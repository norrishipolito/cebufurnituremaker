"use client";

import { AboutHeader } from "@/features/home/about/components/about-header";
import { FeaturesGrid } from "@/features/home/about/components/features-grid";
import { AboutShowcase } from "@/features/home/about/components/about-showcase";
import { aboutFeatures, showcaseData } from "@/features/home/about/components/about-data";

export function About() {
  return (
    <section id="about" className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <AboutHeader />
        <FeaturesGrid features={aboutFeatures} />
        <AboutShowcase
          image={showcaseData.image}
          title={showcaseData.title}
          description={showcaseData.description}
        />
      </div>
    </section>
  );
}
