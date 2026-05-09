"use client";

import { useMemo, useState } from "react";
import { ProjectsGrid } from "./projects-grid";
import { ProjectsHeader } from "./projects-header";
import { ProjectsTabs } from "./projects-tabs";
import type { Product } from "./projects-data";

export function ProjectsClient({ products }: { products: Product[] }) {
  const groups = useMemo(() => {
    const uniqueGroups = new Map<string, string>();

    for (const product of products) {
      if (!uniqueGroups.has(product.group)) {
        uniqueGroups.set(product.group, product.groupLabel);
      }
    }

    return [...uniqueGroups].map(([value, label]) => ({ value, label }));
  }, [products]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const currentTab =
    activeTab && groups.some((group) => group.value === activeTab)
      ? activeTab
      : groups[0]?.value ?? "";

  const filteredProducts = useMemo(() => {
    return currentTab
      ? products.filter((product) => product.group === currentTab)
      : products;
  }, [currentTab, products]);

  return (
    <>
      <ProjectsHeader />
      <ProjectsTabs
        activeTab={currentTab}
        groups={groups}
        onTabChange={setActiveTab}
      />
      <ProjectsGrid products={filteredProducts} />
    </>
  );
}
