"use client";

import { useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { HeroBackground } from "@/features/home/hero/components/hero-background";
import { HeroLogo } from "@/features/home/hero/components/hero-logo";
import { HeroContent } from "@/features/home/hero/components/hero-content";
import { HeroFooterBar } from "@/features/home/hero/components/hero-footer-bar";

/**
 * Hero Section Component
 * 
 * Main hero section with:
 * - Parallax background image
 * - Animated logo (transitions to navigation on scroll)
 * - Fading content (headline and tagline)
 * - Footer bar with key features
 * 
 * Scroll animations:
 * - Background: Parallax effect (0-500px scroll range)
 * - Content: Fade out and scale down (0-300px scroll range)
 * - Logo: Fade out and scale down (50-150px scroll range)
 */
export function Hero() {
  const { scrollY } = useScroll();
  const [hasScrolledDown, setHasScrolledDown] = useState(false);
  
  // Parallax and fade animations
  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Track if user has scrolled down to prevent logo animation on scroll back up
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 150) {
      setHasScrolledDown(true);
    } else if (latest < 50 && hasScrolledDown) {
      // Reset when back at top after having scrolled down
      setHasScrolledDown(false);
    }
  });

  return (
    <section id="hero" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <HeroBackground backgroundY={backgroundY} />
      <HeroLogo hasScrolledDown={hasScrolledDown} />
      <HeroContent opacity={contentOpacity} scale={contentScale} />
      <HeroFooterBar />
    </section>
  );
}
