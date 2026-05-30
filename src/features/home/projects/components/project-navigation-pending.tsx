import { LoaderCircle } from "lucide-react";
import type { Product } from "./projects-data";

export function ProjectNavigationPending({
  project,
}: {
  project: Product | null;
}) {
  if (!project) {
    return null;
  }

  return (
    <div
      role="status"
      aria-atomic="true"
      aria-label={`Opening ${project.title} details`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
    >
      <div className="grid min-h-[320px] w-[min(1140px,calc(100vw-32px))] place-items-center overflow-hidden rounded-lg border border-gray-200 bg-white p-8 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-950 sm:min-h-[420px]">
        <div className="max-w-md">
          <LoaderCircle
            aria-hidden="true"
            className="mx-auto size-8 animate-spin text-amber-700 dark:text-amber-300"
          />
          <p className="mt-5 text-xs font-semibold uppercase text-amber-800 dark:text-amber-200">
            Opening project details
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-950 dark:text-white">
            {project.title}
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Loading the full gallery and project information.
          </p>
        </div>
      </div>
    </div>
  );
}
