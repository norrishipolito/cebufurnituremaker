"use client";

import { useScroll, useTransform } from "framer-motion";
import { HeroBackground } from "@/features/home/hero/components/hero-background";
import { HeroLogo } from "@/features/home/hero/components/hero-logo";
import { HeroContent } from "@/features/home/hero/components/hero-content";
import { HeroFooterBar } from "@/features/home/hero/components/hero-footer-bar";

export function Hero() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <HeroBackground backgroundY={backgroundY} />
      <HeroLogo />
      <HeroContent opacity={contentOpacity} scale={contentScale} />
      <HeroFooterBar />
    </section>
  );
}
