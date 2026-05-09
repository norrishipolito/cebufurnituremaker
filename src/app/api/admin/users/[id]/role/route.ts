import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, writeAuditLog } from "@/lib/site-content/mutations";
import { rolePatchSchema } from "@/lib/site-content/validators";
import { profiles } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin("admin");

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const input = rolePatchSchema.parse(await request.json());
    const db = getRequiredServiceClient();
    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (id === guard.auth.userId && input.role !== existing.role) {
      return NextResponse.json(
        { error: "You cannot change your own admin role." },
        { status: 400 }
      );
    }

    if (existing.role === "admin" && input.role !== "admin") {
      const [adminCount] = await db
        .select({ value: count() })
        .from(profiles)
        .where(eq(profiles.role, "admin"));

      if ((adminCount?.value ?? 0) <= 1) {
        return NextResponse.json(
          { error: "At least one admin user is required." },
          { status: 400 }
        );
      }
    }

    const [data] = await db
      .update(profiles)
      .set({ role: input.role, updated_at: new Date() })
      .where(eq(profiles.id, id))
      .returning();

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "user.role.update",
      entityType: "profile",
      entityId: id,
      metadata: { role: input.role },
    });

    return NextResponse.json({ user: data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}
