"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ProjectCarouselImage {
  url: string;
  alt: string;
}

interface ProjectImageCarouselProps {
  images: ProjectCarouselImage[];
  title: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
  thumbnailClassName?: string;
  sizes: string;
}

export function ProjectImageCarousel({
  images,
  title,
  preload = false,
  className,
  imageClassName,
  thumbnailClassName,
  sizes,
}: ProjectImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState(1);
  const activeImage = images[activeIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) {
      return;
    }

    const interval = window.setInterval(() => {
      setTransitionDirection(1);
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  function moveImage(direction: -1 | 1) {
    if (!hasMultipleImages) {
      return;
    }

    setTransitionDirection(direction);
    setActiveIndex(
      (current) => (current + direction + images.length) % images.length,
    );
  }

  function goToImage(index: number) {
    if (index === activeIndex) {
      return;
    }

    setTransitionDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col bg-white dark:bg-gray-950",
        className,
      )}
    >
      <div className="relative px-12 py-5 sm:px-16 sm:py-7">
        <div
          className={cn(
            "relative mx-auto aspect-[4/3] min-h-[260px] max-w-3xl overflow-hidden rounded-lg bg-gray-100 shadow-sm dark:bg-gray-900 sm:min-h-[360px]",
            imageClassName,
          )}
        >
          {activeImage ? (
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`${activeImage.url}-${activeIndex}`}
                className="absolute inset-0"
                initial={{ x: `${transitionDirection * 100}%` }}
                animate={{ x: "0%" }}
                exit={{ x: `${transitionDirection * -100}%` }}
                transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt}
                  fill
                  preload={preload}
                  className="object-cover"
                  sizes={sizes}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              No image
            </div>
          )}
        </div>

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={() => moveImage(-1)}
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-950/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-50/[.15]"
              aria-label="Previous project image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => moveImage(1)}
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-950/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-50/[.15]"
              aria-label="Next project image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 bg-white px-4 pb-5 pt-1 dark:border-gray-800 dark:bg-gray-950",
            thumbnailClassName,
          )}
        >
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => goToImage(index)}
              aria-label={`Show ${title} image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className="relative aspect-[4/3] w-20 overflow-hidden rounded-md border border-transparent bg-gray-950/[.01] shadow-sm ring-offset-2 ring-offset-white transition hover:bg-gray-950/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:bg-gray-50/[.10] dark:ring-offset-gray-950 dark:hover:bg-gray-50/[.15] dark:focus-visible:ring-gray-100 sm:w-24"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className={cn(
                  "object-cover transition duration-300",
                  activeIndex === index
                    ? "blur-0 opacity-100"
                    : "blur-[1.5px] opacity-50",
                )}
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
