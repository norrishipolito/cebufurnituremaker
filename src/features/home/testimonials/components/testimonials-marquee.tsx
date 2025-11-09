"use client";

import { Marquee } from "@/components/ui/marquee";
import { TestimonialCard } from "./testimonial-card";
import { Testimonial } from "./testimonials-data";

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:40s]">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.name}
            img={testimonial.img}
            name={testimonial.name}
            role={testimonial.role}
            quote={testimonial.quote}
          />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}

