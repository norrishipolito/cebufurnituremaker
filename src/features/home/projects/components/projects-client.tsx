"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectsGrid } from "./projects-grid";
import { ProjectsHeader } from "./projects-header";
import { ProjectDetailDialog } from "./project-detail-dialog";
import type { Product } from "./projects-data";

export function ProjectsClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Product | null>(null);
  const [pendingProjectHref, setPendingProjectHref] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingProjectHref || selectedProject) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      router.push(pendingProjectHref);
      setPendingProjectHref(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingProjectHref, router, selectedProject]);

  return (
    <>
      <ProjectsHeader projectCount={products.length} />
      <ProjectsGrid
        products={products}
        onProjectOpen={setSelectedProject}
      />
      <ProjectDetailDialog
        project={selectedProject}
        onNavigateToProject={(href) => {
          setPendingProjectHref(href);
          setSelectedProject(null);
        }}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null);
          }
        }}
      />
    </>
  );
}
