"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NavigationBrand } from "@/features/navigation/header/components/navigation-brand";
import { NavigationItems } from "@/features/navigation/header/components/navigation-items";
import { NavigationMobileMenu } from "@/features/navigation/header/components/navigation-mobile-menu";
import type { NavigationItem } from "@/features/navigation/header/components/navigation-data";
import { cn } from "@/lib/utils";

export function NavigationClient({ items }: { items: NavigationItem[] }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);

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
          <NavigationBrand
            isScrolled={isScrolled}
            scrollDirection={scrollDirection}
          />
          <div className="hidden lg:flex relative z-[102] flex-1 justify-end">
            <NavigationItems isScrolled={isScrolled} items={items} />
          </div>
          <NavigationMobileMenu isScrolled={isScrolled} items={items} />
        </div>
      </div>
    </motion.nav>
  );
}
