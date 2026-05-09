import { ProjectsClient } from "@/features/home/projects/components/projects-client";
import { getPublicProjects } from "@/lib/site-content/queries";

const groupLabels: Record<string, string> = {
  products: "Products",
  showroom: "Showroom",
  fabrication_site: "Fabrication Site",
};

function toGroupLabel(group: string) {
  return (
    groupLabels[group] ??
    group
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

interface PublicProjectRow {
  image?: string;
  title: string;
  description: string;
  category: string;
  group?: string;
  primary_asset?: {
    blob_url?: string | null;
    blob_pathname?: string | null;
    alt_text?: string | null;
  } | null;
}

export async function Projects() {
  const { projects } = await getPublicProjects();
  const mappedProjects = (projects as PublicProjectRow[]).map((project) => ({
    image: project.primary_asset?.blob_pathname
      ? `/api/blob/${project.primary_asset.blob_pathname}`
      : project.primary_asset?.blob_url ?? project.image ?? "",
    title: project.title,
    description: project.description,
    category: project.category,
    group: project.group ?? "products",
    groupLabel: toGroupLabel(project.group ?? "products"),
  }));

  return (
    <section id="projects" className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <ProjectsClient products={mappedProjects} />
      </div>
    </section>
  );
}
