"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, Images, Ruler, Sofa, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "./projects-data";
import { ProjectImageCarousel } from "./project-image-carousel";

interface ProjectDetailDialogProps {
  project: Product | null;
  onNavigateToProject: (href: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDialog({
  project,
  onNavigateToProject,
  onOpenChange,
}: ProjectDetailDialogProps) {
  const images = project?.images ?? [];

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
  }

  return (
    <Dialog.Root open={Boolean(project)} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[92vh] w-[min(1140px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-950 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
          {project ? (
            <>
              <ProjectImageCarousel
                key={project.slug}
                images={images}
                title={project.title}
                imageClassName="lg:aspect-auto lg:min-h-[620px]"
                sizes="(max-width: 1024px) 100vw, 64vw"
              />

              <div className="flex min-h-0 flex-col overflow-y-auto p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-300/15 dark:text-amber-200">
                    <Sofa className="size-3.5" />
                    {project.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <Images className="size-3.5" />
                    {images.length || 1} images
                  </span>
                </div>
                <Dialog.Title className="mt-4 text-3xl font-semibold text-gray-950 dark:text-white">
                  {project.title}
                </Dialog.Title>
                <Dialog.Description className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {project.description}
                </Dialog.Description>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      <Ruler className="size-3.5" />
                      Category
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-950 dark:text-white">
                      {project.category}
                    </p>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      <Images className="size-3.5" />
                      Gallery
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-950 dark:text-white">
                      {images.length || 1} project {images.length === 1 ? "image" : "images"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-950 dark:text-white">
                    Project Overview
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6">
                  <Button asChild>
                    <Dialog.Close asChild>
                      <Link
                        href={`/projects/${project.slug}`}
                        onClick={(event) => {
                          event.preventDefault();
                          onNavigateToProject(`/projects/${project.slug}`);
                        }}
                      >
                        <ExternalLink />
                        View More Details
                      </Link>
                    </Dialog.Close>
                  </Button>
                </div>
              </div>
            </>
          ) : null}
          <Dialog.Close className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 dark:bg-gray-900/90 dark:text-white">
            <X className="size-4" />
            <span className="sr-only">Close project details</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
