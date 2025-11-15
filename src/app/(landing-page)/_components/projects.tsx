"use client";

import { useState, useMemo } from "react";
import { ProjectsHeader } from "@/features/home/projects/components/projects-header";
import { ProjectsTabs } from "@/features/home/projects/components/projects-tabs";
import { ProjectsGrid } from "@/features/home/projects/components/projects-grid";
import { furnitureProducts } from "@/features/home/projects/components/projects-data";
import type { ProductType } from "@/features/home/projects/components/projects-data";

export function Projects() {
  const [activeTab, setActiveTab] = useState<ProductType>("Set");

  const filteredProducts = useMemo(() => {
    return furnitureProducts.filter((product) => product.type === activeTab);
  }, [activeTab]);

  return (
    <section id="projects" className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <ProjectsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ProjectsGrid products={filteredProducts} />
      </div>
    </section>
  );
}
