import { defaultSiteContent, getDefaultSection, type SiteSectionKey } from "@/lib/default-site-content";
import { createDbClient } from "@/lib/db/client";
import { assets, projectAssets, projects, siteSections, testimonials } from "@/lib/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";

export async function getSiteSection(sectionKey: SiteSectionKey) {
  const db = createDbClient();

  if (!db) {
    return { content: getDefaultSection(sectionKey), source: "default" as const };
  }

  const [section] = await db
    .select({ content: siteSections.content })
    .from(siteSections)
    .where(eq(siteSections.key, sectionKey))
    .limit(1);

  return {
    content: section?.content ?? getDefaultSection(sectionKey),
    source: section?.content ? ("database" as const) : ("default" as const),
  };
}

export async function getPublicProjects() {
  const db = createDbClient();

  if (!db) {
    return { projects: [...defaultSiteContent.projects], source: "default" as const };
  }

  const data = await db
    .select({
      project: projects,
      primary_asset: assets,
    })
    .from(projects)
    .leftJoin(assets, eq(projects.primary_asset_id, assets.id))
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sort_order));

  if (!data.length) {
    return { projects: [...defaultSiteContent.projects], source: "default" as const };
  }

  const imageMap = await getProjectImageMap(data.map((row) => row.project.id));

  return {
    projects: data.map((row) => ({
      ...row.project,
      primary_asset: row.primary_asset,
      images: buildProjectImages(row.primary_asset, imageMap.get(row.project.id)),
    })),
    source: "database" as const,
  };
}

export async function getPublicProjectBySlug(slug: string) {
  const db = createDbClient();

  if (!db) {
    const project = defaultSiteContent.projects.find((item) => item.slug === slug);
    return project ? { project, source: "default" as const } : null;
  }

  const [row] = await db
    .select({
      project: projects,
      primary_asset: assets,
    })
    .from(projects)
    .leftJoin(assets, eq(projects.primary_asset_id, assets.id))
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);

  if (!row) {
    const project = defaultSiteContent.projects.find((item) => item.slug === slug);
    return project ? { project, source: "default" as const } : null;
  }

  const imageMap = await getProjectImageMap([row.project.id]);

  return {
    project: {
      ...row.project,
      primary_asset: row.primary_asset,
      images: buildProjectImages(row.primary_asset, imageMap.get(row.project.id)),
    },
    source: "database" as const,
  };
}

async function getProjectImageMap(projectIds: string[]) {
  const db = createDbClient();
  const imageMap = new Map<string, typeof assets.$inferSelect[]>();

  if (!db || projectIds.length === 0) {
    return imageMap;
  }

  const rows = await db
    .select({
      project_id: projectAssets.project_id,
      sort_order: projectAssets.sort_order,
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

  return orderedAssets
    .filter((asset) => {
      if (seen.has(asset.id)) {
        return false;
      }

      seen.add(asset.id);
      return true;
    })
    .map((asset) => ({
      id: asset.id,
      url: asset.blob_pathname ? `/api/blob/${asset.blob_pathname}` : asset.blob_url,
      alt: asset.alt_text,
    }));
}

export async function getPublicTestimonials() {
  const db = createDbClient();

  if (!db) {
    return {
      testimonials: [...defaultSiteContent.testimonials],
      source: "default" as const,
    };
  }

  const data = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.sort_order));

  if (!data.length) {
    return {
      testimonials: [...defaultSiteContent.testimonials],
      source: "default" as const,
    };
  }

  return { testimonials: data, source: "database" as const };
}
