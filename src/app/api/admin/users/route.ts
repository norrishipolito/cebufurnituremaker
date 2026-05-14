import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, writeAuditLog } from "@/lib/site-content/mutations";
import { createUserSchema } from "@/lib/site-content/validators";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { profiles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const guard = await requireAdmin("admin");

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const db = getRequiredServiceClient();
    const data = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        display_name: profiles.display_name,
        role: profiles.role,
        created_at: profiles.created_at,
      })
      .from(profiles)
      .orderBy(desc(profiles.created_at));

    return NextResponse.json({ users: data ?? [] });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin("admin");

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const input = createUserSchema.parse(await request.json());
    const db = getRequiredServiceClient();
    const supabase = createSupabaseServiceClient();
    const email = input.email.trim().toLowerCase();
    const displayName = input.display_name?.trim() || null;

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase Auth server configuration is missing. Set SUPABASE_SECRET_KEY." },
        { status: 503 }
      );
    }

    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          display_name: displayName ?? "",
        },
      });

    if (userError || !userData.user) {
      return jsonError(userError ?? new Error("Could not create user."), 400);
    }

    const [profile] = await db
      .insert(profiles)
      .values({
        id: userData.user.id,
        email,
        display_name: displayName,
        role: input.role,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          email,
          display_name: displayName,
          role: input.role,
          updated_at: new Date(),
        },
      })
      .returning();

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "user.create",
      entityType: "profile",
      entityId: profile.id,
    });

    return NextResponse.json({ user: profile }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error, 400, {
      route: "/api/admin/users",
      method: "POST",
      actorId: guard.auth.userId,
    });
  }
}
