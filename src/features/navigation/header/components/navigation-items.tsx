"use client";

import { useEffect, useState } from "react";
import { NavigationItemComponent } from "./navigation-item";
import { navigationItems } from "./navigation-data";
import { cn } from "@/lib/utils";

interface NavigationItemsProps {
  className?: string;
  /** Callback when a navigation item is clicked (used for mobile menu) */
  onItemClick?: () => void;
  /** Whether user has scrolled past hero section */
  isScrolled?: boolean;
}

/**
 * Navigation Items Container Component
 * 
 * Manages the list of navigation items with:
 * - Active section detection based on scroll position
 * - Automatic highlighting of current section
 * - Responsive spacing for desktop and mobile
 * 
 * The active section is determined by checking which section
 * is currently in view, accounting for the sticky navigation height.
 */
export function NavigationItems({
  className,
  onItemClick,
  isScrolled = false,
}: NavigationItemsProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100; // Offset for sticky nav

      // Find the current section by checking from bottom to top
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ul className={cn("flex items-center gap-0.5 sm:gap-1", className)}>
      {navigationItems.map((item) => (
        <NavigationItemComponent
          key={item.id}
          {...item}
          isActive={activeSection === item.id}
          onClick={onItemClick}
          isScrolled={isScrolled}
        />
      ))}
    </ul>
  );
}

