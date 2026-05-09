import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, revalidatePublicSite, writeAuditLog } from "@/lib/site-content/mutations";
import { projectInputSchema } from "@/lib/site-content/validators";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const db = getRequiredServiceClient();
    const [data] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const input = projectInputSchema.partial().parse(await request.json());
    const db = getRequiredServiceClient();
    const [data] = await db
      .update(projects)
      .set({
        ...input,
        updated_by: guard.auth.userId,
        updated_at: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "project.update",
      entityType: "project",
      entityId: id,
    });
    await revalidatePublicSite();

    return NextResponse.json({ project: data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const { id } = await context.params;
    const db = getRequiredServiceClient();
    await db.delete(projects).where(eq(projects.id, id));

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "project.delete",
      entityType: "project",
      entityId: id,
    });
    await revalidatePublicSite();

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}
