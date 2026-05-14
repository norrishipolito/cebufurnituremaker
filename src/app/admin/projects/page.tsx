import { redirect } from "next/navigation";
import { AdminPageShell } from "../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { defaultSiteContent } from "@/lib/default-site-content";
import {
  ProjectManager,
  type AdminProject,
} from "@/features/admin/projects/components/project-manager";
import { createDbClient } from "@/lib/db/client";
import { assets, projectAssets, projects as projectsTable } from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

export default async function AdminProjectsPage() {
  const auth = await getCurrentAdminProfile();

  if (!auth) {
    redirect("/admin/login");
  }

  const db = createDbClient();
  const data = db
    ? await db
        .select({
          project: projectsTable,
          primary_asset: assets,
        })
        .from(projectsTable)
        .leftJoin(assets, eq(projectsTable.primary_asset_id, assets.id))
      .orderBy(asc(projectsTable.sort_order))
    : null;
  const imageMap =
    data?.length && db
      ? await getProjectImageMap(
          db,
          data.map((row) => row.project.id)
        )
      : new Map<string, (typeof assets.$inferSelect)[]>();
  const projects: AdminProject[] = data?.length
    ? data.map((row) => {
        const linkedImages = imageMap.get(row.project.id) ?? [];

        return {
          ...row.project,
          primary_asset: row.primary_asset,
          images: buildProjectImages(row.primary_asset, linkedImages),
          editable: true,
        };
      })
    : defaultSiteContent.projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.description,
        category: project.category,
        group: project.group,
        primary_asset_id: null,
        sort_order: project.sortOrder,
        published: project.published,
        image: project.image,
        images: project.images?.map((image, index) => ({
          id: `${project.id}-image-${index}`,
          blob_url: image.url,
          blob_pathname: "",
          alt_text: image.alt,
        })),
        primary_asset: null,
        editable: false,
      }));
  const source = data?.length ? "database" : "default";

  return (
    <AdminPageShell
      title="Projects"
      description="Create and review editable project records. Defaults appear while the database is empty."
    >
      <ProjectManager initialProjects={projects} source={source} />
    </AdminPageShell>
  );
}

async function getProjectImageMap(
  db: NonNullable<ReturnType<typeof createDbClient>>,
  projectIds: string[]
) {
  const imageMap = new Map<string, (typeof assets.$inferSelect)[]>();

  if (projectIds.length === 0) {
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
  linkedImages: (typeof assets.$inferSelect)[]
) {
  const seen = new Set<string>();
  const orderedAssets = primaryAsset ? [primaryAsset, ...linkedImages] : linkedImages;

  return orderedAssets.filter((asset) => {
    if (seen.has(asset.id)) {
      return false;
    }

    seen.add(asset.id);
    return true;
  });
}
