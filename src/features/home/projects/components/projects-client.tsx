"use client";

import { useState } from "react";
import { ProjectsGrid } from "./projects-grid";
import { ProjectsHeader } from "./projects-header";
import { ProjectDetailDialog } from "./project-detail-dialog";
import type { Product } from "./projects-data";

export function ProjectsClient({ products }: { products: Product[] }) {
  const [selectedProject, setSelectedProject] = useState<Product | null>(null);

  return (
    <>
      <ProjectsHeader projectCount={products.length} />
      <ProjectsGrid
        products={products}
        onProjectOpen={setSelectedProject}
      />
      <ProjectDetailDialog
        project={selectedProject}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null);
          }
        }}
      />
    </>
  );
}
