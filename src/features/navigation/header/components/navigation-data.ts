/**
 * Navigation Item Data Structure
 * 
 * Defines the structure and data for navigation menu items.
 * Each item corresponds to a section on the landing page.
 */

export interface NavigationItem {
  /** Display label for the navigation item */
  label: string;
  /** Anchor href for smooth scrolling */
  href: string;
  /** Section ID that matches the corresponding section element */
  id: string;
}

/**
 * Navigation items configuration
 * 
 * Maps to the main sections of the landing page:
 * - Hero: Top section with main headline
 * - About: Company information and features
 * - Projects: Product showcase
 * - Testimonials: Customer reviews
 * - Contact: Contact form and information
 */
export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Testimonials", href: "#testimonials", id: "testimonials" },
  { label: "Contact", href: "#contact", id: "contact" },
];

