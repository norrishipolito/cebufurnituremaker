"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CebuFurnitureMakerLogo } from "@/components/logo/cebu-furniture-maker-logo";
import { cn } from "@/lib/utils";

interface NavigationBrandProps {
  className?: string;
  /** Whether user has scrolled past the hero section */
  isScrolled?: boolean;
  /** Scroll direction to control animation behavior */
  scrollDirection?: "up" | "down";
}

/**
 * Navigation Brand Component
 *
 * Displays the logo in the navigation bar. The logo:
 * - Only appears when scrolled past hero section (isScrolled = true)
 * - Uses layoutId to smoothly transition from hero logo position
 * - Animates in when scrolling down, appears instantly when scrolling up
 * - Clicking scrolls to top of page
 */
export function NavigationBrand({
  className,
  isScrolled = false,
  scrollDirection = "down",
}: NavigationBrandProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 transition-opacity hover:opacity-80 relative z-[102] cursor-pointer",
        className
      )}
    >
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            layoutId="logo"
            initial={
              scrollDirection === "down" ? { opacity: 0, scale: 0.6 } : false
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={
              scrollDirection === "down"
                ? { duration: 0.4, ease: "easeOut" }
                : { duration: 0 }
            }
            className={cn("transition-colors duration-300")}
          >
            <CebuFurnitureMakerLogo
              width={120}
              height={72}
              className="h-7 sm:h-8 lg:h-9 w-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
