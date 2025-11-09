"use client";

import { ProjectsHeader } from "@/features/home/projects/components/projects-header";
import { ProjectsGrid } from "@/features/home/projects/components/projects-grid";
import { furnitureProducts } from "@/features/home/projects/components/projects-data";

export function Projects() {
  return (
    <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <ProjectsGrid products={furnitureProducts} />
      </div>
    </section>
  );
}
