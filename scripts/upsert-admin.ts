import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { profiles } from "../src/lib/db/schema";
import { closeDbClient, getRequiredDbClient } from "../src/lib/db/client";

type AdminRole = "admin" | "maintainer";

function readArg(name: string) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function requiredArg(name: string) {
  const value = readArg(name);

  if (!value) {
    throw new Error(`Missing required argument: --${name}`);
  }

  return value;
}

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    process.env[key] ??= value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const email = requiredArg("email");
  const password = requiredArg("password");
  const displayName = readArg("name") ?? "";
  const role = (readArg("role") ?? "admin") as AdminRole;

  if (!["admin", "maintainer"].includes(role)) {
    throw new Error("--role must be admin or maintainer.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecret) {
    throw new Error(
      "Missing Supabase Auth env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseSecret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
    },
  });

  let user = data.user;

  if (error || !user) {
    const message = error?.message.toLowerCase() ?? "";

    if (!message.includes("already")) {
      throw error ?? new Error("Unable to create Supabase Auth user.");
    }

    const users = await supabase.auth.admin.listUsers();

    if (users.error) {
      throw users.error;
    }

    user = users.data.users.find((candidate) => candidate.email === email) ?? null;
  }

  if (!user) {
    throw new Error("User already exists, but the matching Auth user was not found.");
  }

  const db = getRequiredDbClient();
  const [profile] = await db
    .insert(profiles)
    .values({
      id: user.id,
      email,
      display_name: displayName || null,
      role,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        email,
        display_name: displayName || null,
        role,
        updated_at: new Date(),
      },
    })
    .returning();

  console.log(`Created ${profile.role} profile for ${profile.email}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDbClient();
  });
