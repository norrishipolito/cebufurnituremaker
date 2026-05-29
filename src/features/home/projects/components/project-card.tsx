"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Images } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  image: string;
  imageAlt: string;
  images: {
    url: string;
    alt: string;
  }[];
  imageCount: number;
  title: string;
  description: string;
  category: string;
  index: number;
  onOpen: () => void;
}

export function ProjectCard({
  image,
  imageAlt,
  images,
  imageCount,
  title,
  description,
  category,
  index,
  onOpen,
}: ProjectCardProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const activeImage = hasMultipleImages ? images[activeImageIndex] : null;
  const previewImage = activeImage?.url ?? image;
  const previewAlt = activeImage?.alt ?? imageAlt;

  useEffect(() => {
    if (!isPreviewing || !hasMultipleImages) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [hasMultipleImages, images.length, isPreviewing]);

  function stopPreview() {
    setIsPreviewing(false);
    setActiveImageIndex(0);
  }

  function startPreview() {
    setIsPreviewing(true);
    if (hasMultipleImages) {
      setActiveImageIndex(1 % images.length);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
      data-image-count={imageCount}
      className="group relative overflow-hidden rounded-lg border border-gray-950/[.1] bg-gray-950/[.01] text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-gray-950/[.05] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {previewImage ? (
          <motion.div
            key={`${previewImage}-${activeImageIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0.72, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={previewImage}
              alt={previewAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur">
            {category}
          </span>
          {imageCount > 1 ? (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-white shadow-sm backdrop-blur">
              <Images className="size-3.5" />
              <span className="sr-only">
                {activeImageIndex + 1} of {imageCount} images
              </span>
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-950 shadow-sm">
            Preview Project
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
      <div className="grid min-h-40 gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          View details
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </motion.button>
  );
}
