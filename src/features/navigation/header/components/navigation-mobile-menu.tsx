"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavigationItems } from "./navigation-items";
import { CebuFurnitureMakerLogo } from "@/components/logo/cebu-furniture-maker-logo";
import { cn } from "@/lib/utils";

interface NavigationMobileMenuProps {
  className?: string;
  /** Whether user has scrolled past hero section */
  isScrolled?: boolean;
}

/**
 * Mobile Navigation Menu Component
 *
 * Full-screen mobile menu that:
 * - Covers entire viewport when open (z-index: 200)
 * - Prevents body scroll when open
 * - Shows logo and navigation items
 * - Animated hamburger/X icon toggle
 * - Smooth slide-in/fade animations
 *
 * Design inspired by shadcn/studio mobile menu pattern.
 */
export function NavigationMobileMenu({
  className,
  isScrolled = false,
}: NavigationMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className={cn("lg:hidden relative z-[103]", className)}>
        <button
          onClick={toggleMenu}
          className={cn(
            "relative z-[104] flex items-center justify-center w-10 h-10 rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
            isScrolled
              ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              : "text-white hover:bg-white/10"
          )}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-white dark:bg-gray-950"
            style={{ isolation: "isolate" }}
            aria-label="Mobile navigation"
          >
            {/* Header with logo and close button */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CebuFurnitureMakerLogo
                    width={100}
                    height={60}
                    className="h-8 w-auto text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    CEBU FURNITURE MAKER
                  </span>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-md transition-colors",
                  "text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                )}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Navigation Items */}
            <div className="flex flex-col py-2 overflow-y-auto h-[calc(100vh-73px)] sm:h-[calc(100vh-89px)] bg-white dark:bg-gray-950">
              <NavigationItems
                onItemClick={closeMenu}
                className="flex-col items-stretch gap-0.5"
                isScrolled={true}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
