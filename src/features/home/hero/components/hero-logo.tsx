"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CebuFurnitureMakerLogo } from "@/components/logo/cebu-furniture-maker-logo";

interface HeroLogoProps {
  /** Whether user has previously scrolled down (prevents animation on scroll back up) */
  hasScrolledDown?: boolean;
}

/**
 * Hero Logo Component
 *
 * Logo displayed in the hero section that:
 * - Fades out and scales down as user scrolls (50-150px range)
 * - Uses layoutId to smoothly transition to navigation logo position
 * - Only animates on initial load, not when scrolling back up
 * - Positioned on the left side, aligned with navigation logo
 *
 * Z-index: 50 (below mobile menu z-200, above hero content)
 */
export function HeroLogo({ hasScrolledDown = false }: HeroLogoProps) {
  const { scrollY } = useScroll();

  // Fade out between 50-150px scroll
  const opacity = useTransform(scrollY, [50, 150], [1, 0]);
  const scale = useTransform(scrollY, [0, 150], [1, 0.6]);

  return (
    <motion.div
      layoutId="logo"
      className="absolute top-16 left-4 z-[50] sm:top-20 sm:left-6 md:top-20 md:left-6 lg:top-24 lg:left-20 xl:top-24 xl:left-24"
      style={{ opacity, scale }}
      initial={hasScrolledDown ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        hasScrolledDown ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }
      }
    >
      <CebuFurnitureMakerLogo
        width={120}
        height={72}
        className="text-white sm:w-[140px] sm:h-[84px] md:w-[160px] md:h-[96px] lg:w-[180px] lg:h-[108px]"
      />
    </motion.div>
  );
}
