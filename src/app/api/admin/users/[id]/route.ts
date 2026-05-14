import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import {
  assets,
  auditLogs,
  profiles,
  projects,
  siteSections,
  testimonials,
} from "@/lib/db/schema";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getRequiredServiceClient, writeAuditLog } from "@/lib/site-content/mutations";
import { updateUserSchema } from "@/lib/site-content/validators";

interface RouteContext {
  params: Promise<{ id: string }>;
}

type DbClient = ReturnType<typeof getRequiredServiceClient>;

async function getProfile(db: DbClient, id: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  return profile;
}

async function countAdmins(db: DbClient) {
  const [result] = await db
    .select({ value: count() })
    .from(profiles)
    .where(eq(profiles.role, "admin"));

  return result?.value ?? 0;
}

async function detachProfileReferences(db: DbClient, id: string) {
  await db
    .update(siteSections)
    .set({ updated_by: null, updated_at: new Date() })
    .where(eq(siteSections.updated_by, id));
  await db
    .update(assets)
    .set({ uploaded_by: null, updated_at: new Date() })
    .where(eq(assets.uploaded_by, id));
  await db
    .update(projects)
    .set({ created_by: null, updated_at: new Date() })
    .where(eq(projects.created_by, id));
  await db
    .update(projects)
    .set({ updated_by: null, updated_at: new Date() })
    .where(eq(projects.updated_by, id));
  await db
    .update(testimonials)
    .set({ created_by: null, updated_at: new Date() })
    .where(eq(testimonials.created_by, id));
  await db
    .update(testimonials)
    .set({ updated_by: null, updated_at: new Date() })
    .where(eq(testimonials.updated_by, id));
  await db
    .update(auditLogs)
    .set({ actor_id: null })
    .where(eq(auditLogs.actor_id, id));
}

function normalizeDisplayName(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeEmail(value: string | undefined) {
  return value?.trim().toLowerCase();
}

export async function GET(_request: Request, context: RouteContext) {
  const guard = await requireAdmin("admin");

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const db = getRequiredServiceClient();
    const user = await getProfile(db, id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error, 500, {
      route: "/api/admin/users/[id]",
      method: "GET",
      actorId: guard.auth.userId,
    });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin("admin");

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const input = updateUserSchema.parse(await request.json());
    const db = getRequiredServiceClient();
    const existing = await getProfile(db, id);

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextRole = input.role ?? existing.role;

    if (id === guard.auth.userId && nextRole !== existing.role) {
      return NextResponse.json(
        { error: "You cannot change your own admin role." },
        { status: 400 }
      );
    }

    if (
      existing.role === "admin" &&
      nextRole !== "admin" &&
      (await countAdmins(db)) <= 1
    ) {
      return NextResponse.json(
        { error: "At least one admin user is required." },
        { status: 400 }
      );
    }

    const nextEmail = normalizeEmail(input.email);
    const nextDisplayName = normalizeDisplayName(input.display_name);
    const nextPassword = input.password?.trim();
    const authUpdates: {
      email?: string;
      password?: string;
      user_metadata?: { display_name: string };
    } = {};

    if (nextEmail && nextEmail !== existing.email) {
      authUpdates.email = nextEmail;
    }

    if (nextPassword) {
      authUpdates.password = nextPassword;
    }

    if (nextDisplayName !== undefined) {
      authUpdates.user_metadata = { display_name: nextDisplayName ?? "" };
    }

    if (Object.keys(authUpdates).length > 0) {
      const supabase = createSupabaseServiceClient();

      if (!supabase) {
        return NextResponse.json(
          {
            error:
              "Supabase Auth server configuration is missing. Set SUPABASE_SECRET_KEY.",
          },
          { status: 503 }
        );
      }

      const { error } = await supabase.auth.admin.updateUserById(id, authUpdates);

      if (error) {
        return jsonError(error, 400, {
          route: "/api/admin/users/[id]",
          method: "PATCH",
          actorId: guard.auth.userId,
        });
      }
    }

    const [user] = await db
      .update(profiles)
      .set({
        email: nextEmail ?? existing.email,
        display_name:
          nextDisplayName === undefined ? existing.display_name : nextDisplayName,
        role: nextRole,
        updated_at: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "user.update",
      entityType: "profile",
      entityId: id,
      metadata: { role: user.role },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error, 400, {
      route: "/api/admin/users/[id]",
      method: "PATCH",
      actorId: guard.auth.userId,
    });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin("admin");

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const db = getRequiredServiceClient();
    const existing = await getProfile(db, id);

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (id === guard.auth.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own admin user." },
        { status: 400 }
      );
    }

    if (existing.role === "admin" && (await countAdmins(db)) <= 1) {
      return NextResponse.json(
        { error: "At least one admin user is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Supabase Auth server configuration is missing. Set SUPABASE_SECRET_KEY.",
        },
        { status: 503 }
      );
    }

    await detachProfileReferences(db, id);
    await db.delete(profiles).where(eq(profiles.id, id));

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      await db
        .insert(profiles)
        .values({
          id: existing.id,
          email: existing.email,
          display_name: existing.display_name,
          role: existing.role,
          created_at: existing.created_at,
          updated_at: new Date(),
        })
        .onConflictDoUpdate({
          target: profiles.id,
          set: {
            email: existing.email,
            display_name: existing.display_name,
            role: existing.role,
            updated_at: new Date(),
          },
        });

      return jsonError(error, 400, {
        route: "/api/admin/users/[id]",
        method: "DELETE",
        actorId: guard.auth.userId,
      });
    }

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "user.delete",
      entityType: "profile",
      entityId: id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error, 500, {
      route: "/api/admin/users/[id]",
      method: "DELETE",
      actorId: guard.auth.userId,
    });
  }
}
