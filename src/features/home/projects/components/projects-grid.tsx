"use client";

import { ProjectCard } from "./project-card";
import type { Product } from "./projects-data";

interface ProjectsGridProps {
  products: Product[];
}

export function ProjectsGrid({ products }: ProjectsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProjectCard
          key={product.title}
          image={product.image}
          title={product.title}
          description={product.description}
          category={product.category}
          index={index}
        />
      ))}
    </div>
  );
}

