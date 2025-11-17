"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  // Smoothly fade out on scroll
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const opacitySpring = useSpring(opacity, {
    stiffness: scrollDirection === "up" ? 120 : 160,
    damping: scrollDirection === "up" ? 22 : 30,
    mass: 0.6,
  });

  // Track scroll direction to soften fade when returning upward
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < lastScrollY) {
      setScrollDirection("up");
    } else if (latest > lastScrollY) {
      setScrollDirection("down");
    }
    setLastScrollY(latest);
  });

  return (
    <motion.div
      layoutId="logo"
      className="absolute inset-x-0 top-16 z-[50] sm:top-20 md:top-20 lg:top-24 xl:top-24"
      style={{ opacity }}
      initial={hasScrolledDown ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        hasScrolledDown ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }
      }
    >
      <div className="mx-auto flex max-w-7xl">
        <CebuFurnitureMakerLogo
          width={120}
          height={72}
          className="text-white -ml-6 sm:w-[140px] sm:h-[84px] md:w-[160px] md:h-[96px] lg:w-[180px] lg:h-[108px]"
        />
      </div>
    </motion.div>
  );
}
