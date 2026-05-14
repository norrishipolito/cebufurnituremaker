import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { defaultSiteContent } from "@/lib/default-site-content";
import { jsonError, missingServiceConfig } from "@/lib/api/responses";
import { getRequiredServiceClient, revalidatePublicSite, writeAuditLog } from "@/lib/site-content/mutations";
import { projectInputSchema } from "@/lib/site-content/validators";
import { createDbClient } from "@/lib/db/client";
import { assets, projectAssets, projects } from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

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
  const imageMap = await getProjectImageMap(data.map((row) => row.project.id));
  const mappedProjects = data.map((row) => ({
    ...row.project,
    primary_asset: row.primary_asset,
    images: buildProjectImages(row.primary_asset, imageMap.get(row.project.id)),
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
    const { asset_ids: assetIds, ...projectInput } = input;
    const [data] = await db
      .insert(projects)
      .values({
        ...projectInput,
        created_by: guard.auth.userId,
        updated_by: guard.auth.userId,
      })
      .returning();

    if (assetIds?.length) {
      await db.insert(projectAssets).values(
        dedupeAssetIds(assetIds).map((assetId, index) => ({
          project_id: data.id,
          asset_id: assetId,
          sort_order: index,
        }))
      );
    }

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

async function getProjectImageMap(projectIds: string[]) {
  const db = createDbClient();
  const imageMap = new Map<string, (typeof assets.$inferSelect)[]>();

  if (!db || projectIds.length === 0) {
    return imageMap;
  }

  const rows = await db
    .select({
      project_id: projectAssets.project_id,
      asset: assets,
    })
    .from(projectAssets)
    .innerJoin(assets, eq(projectAssets.asset_id, assets.id))
    .where(inArray(projectAssets.project_id, projectIds))
    .orderBy(asc(projectAssets.sort_order));

  for (const row of rows) {
    const images = imageMap.get(row.project_id) ?? [];
    images.push(row.asset);
    imageMap.set(row.project_id, images);
  }

  return imageMap;
}

function buildProjectImages(
  primaryAsset: typeof assets.$inferSelect | null,
  linkedAssets: (typeof assets.$inferSelect)[] = []
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

function dedupeAssetIds(assetIds: string[]) {
  return [...new Set(assetIds)];
}
