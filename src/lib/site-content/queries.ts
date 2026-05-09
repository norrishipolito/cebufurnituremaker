import { defaultSiteContent, getDefaultSection, type SiteSectionKey } from "@/lib/default-site-content";
import { createDbClient } from "@/lib/db/client";
import { assets, projects, siteSections, testimonials } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

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

  return {
    projects: data.map((row) => ({
      ...row.project,
      primary_asset: row.primary_asset,
    })),
    source: "database" as const,
  };
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
