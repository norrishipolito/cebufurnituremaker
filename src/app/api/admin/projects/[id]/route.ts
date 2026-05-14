import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, revalidatePublicSite, writeAuditLog } from "@/lib/site-content/mutations";
import { projectInputSchema } from "@/lib/site-content/validators";
import { assets, projectAssets, projects } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

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
      .select({
        project: projects,
        primary_asset: assets,
      })
      .from(projects)
      .leftJoin(assets, eq(projects.primary_asset_id, assets.id))
      .where(eq(projects.id, id))
      .limit(1);

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const images = await getProjectImages(id);

    return NextResponse.json({
      project: {
        ...data.project,
        primary_asset: data.primary_asset,
        images: buildProjectImages(data.primary_asset, images),
      },
    });
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
    const { asset_ids: assetIds, ...projectInput } = input;
    const db = getRequiredServiceClient();
    const [data] = await db
      .update(projects)
      .set({
        ...projectInput,
        updated_by: guard.auth.userId,
        updated_at: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (assetIds) {
      await db.delete(projectAssets).where(eq(projectAssets.project_id, id));

      if (assetIds.length) {
        await db.insert(projectAssets).values(
          [...new Set(assetIds)].map((assetId, index) => ({
            project_id: id,
            asset_id: assetId,
            sort_order: index,
          }))
        );
      }
    }

    const images = await getProjectImages(id);

    await writeAuditLog({
      actorId: guard.auth.userId,
      action: "project.update",
      entityType: "project",
      entityId: id,
    });
    await revalidatePublicSite();

    return NextResponse.json({
      project: {
        ...data,
        images: buildProjectImages(null, images),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Database")) {
      return missingServiceConfig();
    }

    return jsonError(error);
  }
}

async function getProjectImages(projectId: string) {
  const db = getRequiredServiceClient();
  const rows = await db
    .select({
      asset: assets,
    })
    .from(projectAssets)
    .innerJoin(assets, eq(projectAssets.asset_id, assets.id))
    .where(eq(projectAssets.project_id, projectId))
    .orderBy(asc(projectAssets.sort_order));

  return rows.map((row) => row.asset);
}

function buildProjectImages(
  primaryAsset: typeof assets.$inferSelect | null,
  linkedAssets: (typeof assets.$inferSelect)[]
) {
  const seen = new Set<string>();
  const orderedAssets = primaryAsset ? [primaryAsset, ...linkedAssets] : linkedAssets;

  return orderedAssets.filter((asset) => {
    if (seen.has(asset.id)) {
      return false;
    }

    seen.add(asset.id);
    return true;
  });
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
