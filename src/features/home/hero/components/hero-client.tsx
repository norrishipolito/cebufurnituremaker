"use client";

import { useState } from "react";
import { useMotionValueEvent, useTransform } from "framer-motion";
import { HeroBackground } from "./hero-background";
import { HeroLogo } from "./hero-logo";
import { HeroContent } from "./hero-content";
import { HeroFooterBar } from "./hero-footer-bar";
import type { HeroSectionContent } from "@/app/(landing-page)/_components/hero";
import { useSyncedScrollY } from "@/hooks/use-synced-scroll-y";

export function HeroClient({ content }: { content: HeroSectionContent }) {
  const scrollY = useSyncedScrollY();
  const [hasScrolledDown, setHasScrolledDown] = useState(false);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 150) {
      setHasScrolledDown(true);
    } else if (latest < 50 && hasScrolledDown) {
      setHasScrolledDown(false);
    }
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      <HeroBackground
        backgroundY={backgroundY}
        image={content.backgroundImage.url}
        alt={content.backgroundImage.alt}
      />
      <HeroLogo hasScrolledDown={hasScrolledDown} />
      <HeroContent
        opacity={contentOpacity}
        scale={contentScale}
        heading={content.heading}
        emphasizedHeading={content.emphasizedHeading}
        tagline={content.tagline}
      />
      <HeroFooterBar features={content.footerFeatures} />
    </section>
  );
}
