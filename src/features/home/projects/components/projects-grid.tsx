"use client";

import { ProjectCard } from "./project-card";
import type { Product } from "./projects-data";

interface ProjectsGridProps {
  products: Product[];
  onProjectOpen: (product: Product) => void;
}

export function ProjectsGrid({ products, onProjectOpen }: ProjectsGridProps) {
  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-gray-950/[.1] bg-gray-950/[.01] px-6 py-12 text-center dark:border-gray-50/[.1] dark:bg-gray-50/[.10]">
        <p className="text-base font-semibold text-gray-900 dark:text-white">
          No projects are published yet.
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Published projects from the admin area will appear here as one
          browsable collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProjectCard
          key={product.slug}
          image={product.image}
          imageAlt={product.imageAlt}
          images={product.images}
          imageCount={product.images.length}
          title={product.title}
          description={product.description}
          category={product.category}
          index={index}
          onOpen={() => onProjectOpen(product)}
        />
      ))}
    </div>
  );
}

