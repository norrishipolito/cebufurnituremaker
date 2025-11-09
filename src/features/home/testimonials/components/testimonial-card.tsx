"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface TestimonialCardProps {
  img: string;
  name: string;
  role: string;
  quote: string;
}

export function TestimonialCard({
  img,
  name,
  role,
  quote,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "relative flex flex-col h-full w-[280px] sm:w-80 cursor-pointer overflow-hidden rounded-xl border p-4 sm:p-6",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <blockquote className="mt-0 text-sm sm:text-base italic text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4 grow">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex flex-row items-center gap-2 sm:gap-3 mt-auto">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 40px, 48px"
          />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-xs sm:text-sm font-semibold dark:text-white">
            {name}
          </figcaption>
          <p className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
            {role}
          </p>
        </div>
      </div>
    </figure>
  );
}
