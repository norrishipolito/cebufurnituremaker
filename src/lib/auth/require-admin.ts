import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageUsers, isAdminRole, type AdminProfile, type AdminRole } from "./roles";
import { createDbClient } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface AuthResult {
  profile: AdminProfile;
  userId: string;
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export async function getCurrentAdminProfile(): Promise<AuthResult | null> {
  return getCurrentAdminProfileForRequest(await cookies());
}

const getCurrentAdminProfileForRequest = cache(
  async function getCurrentAdminProfileForRequest(
    cookieStore: CookieStore
  ): Promise<AuthResult | null> {
    void cookieStore;

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const db = createDbClient();

    if (!db) {
      return null;
    }

    const [profile] = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        display_name: profiles.display_name,
        role: profiles.role,
      })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    if (!profile || !isAdminRole(profile.role)) {
      return null;
    }

    return {
      userId: user.id,
      profile: profile as AdminProfile,
    };
  }
);

async function hasMismatchedOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (!origin) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

    return Boolean(host && originUrl.host !== host);
  } catch {
    return true;
  }
}

export async function requireAdmin(requiredRole?: "admin") {
  if (await hasMismatchedOrigin()) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  const auth = await getCurrentAdminProfile();

  if (!auth) {
    return {
      response: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
    };
  }

  if (requiredRole === "admin" && !canManageUsers(auth.profile.role)) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { auth };
}

export function assertRoleCanManageUsers(role: AdminRole) {
  if (!canManageUsers(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
