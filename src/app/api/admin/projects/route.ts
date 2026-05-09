import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { defaultSiteContent } from "@/lib/default-site-content";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, revalidatePublicSite, writeAuditLog } from "@/lib/site-content/mutations";
import { projectInputSchema } from "@/lib/site-content/validators";
import { createDbClient } from "@/lib/db/client";
import { assets, projects } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  const db = createDbClient();

  if (!db) {
    return NextResponse.json({
      projects: defaultSiteContent.projects,
      source: "default",
    });
  }

  const data = await db
    .select({
      project: projects,
      primary_asset: assets,
    })
    .from(projects)
    .leftJoin(assets, eq(projects.primary_asset_id, assets.id))
    .orderBy(asc(projects.sort_order));
  const mappedProjects = data.map((row) => ({
    ...row.project,
    primary_asset: row.primary_asset,
  }));

  return NextResponse.json({
    projects: mappedProjects.length ? mappedProjects : defaultSiteContent.projects,
    source: mappedProjects.length ? "database" : "default",
  });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();

  if ("response" in guard) {
    return guard.response;
  }

  try {
    const db = getRequiredServiceClient();
    const input = projectInputSchema.parse(await request.json());
    const [data] = await db
      .insert(projects)
      .values({
        ...input,
        created_by: guard.auth.userId,
        updated_by: guard.auth.userId,
      })
      .returning();

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "project.create",
      entityType: "project",
      entityId: data.id,
    });
    await revalidatePublicSite();

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error, 400, {
      route: "/api/admin/projects",
      method: "POST",
      actorId: guard.auth.userId,
    });
  }
}
