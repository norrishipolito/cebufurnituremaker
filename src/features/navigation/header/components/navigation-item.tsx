"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "./navigation-data";

interface NavigationItemProps extends NavigationItem {
  /** Whether this item is currently active (section in view) */
  isActive?: boolean;
  /** Callback when item is clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether user has scrolled past hero section */
  isScrolled?: boolean;
}

/**
 * Navigation Item Component
 * 
 * Individual navigation link that:
 * - Smoothly scrolls to the corresponding section when clicked
 * - Shows different indicators for desktop (underline) vs mobile (dot)
 * - Adapts text color based on scroll position
 * - Animates on mount
 * 
 * Indicators:
 * - Desktop: Animated underline that expands on hover/active
 * - Mobile: Dot indicator before the label for active items
 */
export function NavigationItemComponent({
  label,
  href,
  id,
  isActive = false,
  onClick,
  className,
  isScrolled = false,
}: NavigationItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    onClick?.();
  };

  const isMobileMenu = className?.includes("flex-col");

  return (
    <motion.li
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("relative", className)}
    >
      <a
        href={href}
        onClick={handleClick}
        className={cn(
          "relative px-4 sm:px-6 py-3 text-sm font-medium transition-colors",
          "group flex items-center w-full cursor-pointer z-[103]",
          isScrolled
            ? "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            : "text-white/90 hover:text-white drop-shadow-sm"
        )}
      >
        {isMobileMenu ? (
          // Mobile menu: dot indicator
          <>
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full mr-3 transition-all duration-200",
                isActive
                  ? "bg-gray-900 dark:bg-white scale-100"
                  : "bg-transparent group-hover:bg-gray-400 dark:group-hover:bg-gray-500 scale-0"
              )}
            />
            <span className={cn(isActive && "font-semibold")}>{label}</span>
          </>
        ) : (
          // Desktop: underline indicator
          <>
            {label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out",
                isScrolled
                  ? "bg-gray-900 dark:bg-white"
                  : "bg-white",
                isActive ? "w-full" : "w-0 group-hover:w-full"
              )}
            />
          </>
        )}
      </a>
    </motion.li>
  );
}

