"use client";

import { ProjectCard } from "./project-card";

interface Product {
  image: string;
  title: string;
  description: string;
  category: string;
}

interface ProjectsGridProps {
  products: Product[];
}

export function ProjectsGrid({ products }: ProjectsGridProps) {
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

