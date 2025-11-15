"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { NavigationBrand } from "@/features/navigation/header/components/navigation-brand";
import { NavigationItems } from "@/features/navigation/header/components/navigation-items";
import { NavigationMobileMenu } from "@/features/navigation/header/components/navigation-mobile-menu";
import { cn } from "@/lib/utils";

/**
 * Main Navigation Component
 * 
 * Sticky navigation bar that:
 * - Appears at the top of the page
 * - Changes background opacity based on scroll position
 * - Shows/hides logo based on scroll direction
 * - Includes desktop navigation items and mobile menu
 * 
 * Features:
 * - Smooth fade-in animation on mount
 * - Dynamic background blur and opacity
 * - Scroll direction detection for logo animation control
 * - Responsive design (desktop nav + mobile menu)
 */
export function Navigation() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track scroll position and direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
    
    // Determine scroll direction for logo animation control
    if (latest > lastScrollY) {
      setScrollDirection("down");
    } else if (latest < lastScrollY) {
      setScrollDirection("up");
    }
    setLastScrollY(latest);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        "border-b",
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-sm"
          : "bg-black/40 dark:bg-black/50 backdrop-blur-md border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-[101]">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          <NavigationBrand isScrolled={isScrolled} scrollDirection={scrollDirection} />
          <div className="hidden lg:flex relative z-[102] flex-1 justify-end">
            <NavigationItems isScrolled={isScrolled} />
          </div>
          <NavigationMobileMenu isScrolled={isScrolled} />
        </div>
      </div>
    </motion.nav>
  );
}

