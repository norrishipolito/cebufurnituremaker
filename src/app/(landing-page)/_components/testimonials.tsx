"use client";

import { TestimonialsHeader } from "@/features/home/testimonials/components/testimonials-header";
import { TestimonialsMarquee } from "@/features/home/testimonials/components/testimonials-marquee";
import { testimonials } from "@/features/home/testimonials/components/testimonials-data";

export function Testimonials() {
  return (
    <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <TestimonialsHeader />
        <TestimonialsMarquee testimonials={testimonials} />
      </div>
    </section>
  );
}

