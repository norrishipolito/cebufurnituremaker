import { redirect } from "next/navigation";
import { AdminPageShell } from "../_components/admin-page-shell";
import { getCurrentAdminProfile } from "@/lib/auth/require-admin";
import { defaultSiteContent } from "@/lib/default-site-content";
import {
  ProjectManager,
  type AdminProject,
} from "@/features/admin/projects/components/project-manager";
import { createDbClient } from "@/lib/db/client";
import { assets, projects as projectsTable } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

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
  const projects: AdminProject[] = data?.length
    ? data.map((row) => ({
        ...row.project,
        primary_asset: row.primary_asset,
        editable: true,
      }))
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
