import type { FooterColumnData } from "@/features/navigation/footer/components/footer-data";
import type { NavigationItem } from "@/features/navigation/header/components/navigation-data";

export interface DefaultProject {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
  category: string;
  group: string;
  sortOrder: number;
  published: boolean;
}

export interface DefaultTestimonial {
  id: string;
  img: string;
  name: string;
  role: string;
  quote: string;
  sortOrder: number;
  published: boolean;
}

export const defaultSiteContent = {
  hero: {
    heading: "Design furniture for spaces that breathe.",
    emphasizedHeading: "spaces that breathe.",
    tagline:
      "Designed in Cebu, crafted to endure - timeless pieces for modern living.",
    backgroundImage: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop",
      alt: "Modern interior with handcrafted furniture",
    },
    footerFeatures: [
      { icon: "Truck", text: "Free shipping" },
      { icon: "Rocket", text: "Delivered in 6 weeks" },
      { icon: "Shield", text: "Lifetime guarantee" },
    ],
  },
  about: {
    title: "Crafted with Excellence",
    description:
      "Every piece of furniture we create is a testament to traditional craftsmanship combined with modern design principles, built to last for generations.",
    features: [
      {
        icon: "Hammer",
        title: "Handcrafted Excellence",
        description:
          "Each piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations.",
      },
      {
        icon: "Heart",
        title: "Made with Passion",
        description:
          "We pour our heart into every detail, ensuring that each furniture piece tells a story of dedication and care.",
      },
      {
        icon: "Shield",
        title: "Built to Last",
        description:
          "Using only the finest materials and time-tested construction methods, our furniture is designed to withstand the test of time.",
      },
      {
        icon: "Award",
        title: "Award-Winning Design",
        description:
          "Our designs have been recognized for their innovation, combining modern aesthetics with timeless craftsmanship.",
      },
      {
        icon: "Users",
        title: "Family-Owned Business",
        description:
          "As a family-owned business in Cebu, we take pride in our local roots and commitment to our community.",
      },
      {
        icon: "Leaf",
        title: "Sustainable Practices",
        description:
          "We source our materials responsibly and use sustainable practices to minimize our environmental impact.",
      },
    ],
    showcase: {
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      title: "Our Story",
      description:
        "Founded in Cebu, we've been creating beautiful, functional furniture for over two decades. Our workshop combines traditional Filipino craftsmanship with contemporary design sensibilities, resulting in pieces that are both timeless and modern. Every order is treated with the utmost care, from the initial design consultation to the final finishing touches.",
    },
  },
  projects: [
    {
      id: "default-modern-sofa-set",
      slug: "modern-sofa-set",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      title: "Modern Sofa Set",
      description:
        "Elegant three-piece sofa set crafted from premium hardwood with luxurious fabric upholstery. Perfect for modern living spaces.",
      category: "Living Room",
      group: "products",
      sortOrder: 0,
      published: true,
    },
    {
      id: "default-coffee-table-set",
      slug: "coffee-table-set",
      image:
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
      title: "Coffee Table Set",
      description:
        "Contemporary coffee table with matching side tables. Features clean lines and premium wood finish.",
      category: "Living Room",
      group: "products",
      sortOrder: 1,
      published: true,
    },
    {
      id: "default-dining-chair-set",
      slug: "dining-chair-set",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      title: "Dining Chair Set",
      description:
        "Handcrafted dining chairs in sets of four or six. Made from solid mahogany with ergonomic design for comfort.",
      category: "Dining Room",
      group: "products",
      sortOrder: 2,
      published: true,
    },
    {
      id: "default-dining-table-collection",
      slug: "dining-table-collection",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
      title: "Dining Table Collection",
      description:
        "Handcrafted solid wood dining table with matching chairs. Built to last generations with traditional joinery techniques.",
      category: "Dining Room",
      group: "showroom",
      sortOrder: 0,
      published: true,
    },
    {
      id: "default-accent-chair-collection",
      slug: "accent-chair-collection",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      title: "Accent Chair Collection",
      description:
        "Stylish accent chairs available in various designs and fabrics. Adds character and comfort to any room.",
      category: "Accent",
      group: "showroom",
      sortOrder: 1,
      published: true,
    },
    {
      id: "default-master-bedroom-suite",
      slug: "master-bedroom-suite",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
      title: "Master Bedroom Suite",
      description:
        "Complete bedroom set featuring a queen-size bed frame, nightstands, and dresser. Made from sustainably sourced narra wood.",
      category: "Bedroom",
      group: "fabrication_site",
      sortOrder: 0,
      published: true,
    },
    {
      id: "default-executive-office-suite",
      slug: "executive-office-suite",
      image:
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
      title: "Executive Office Suite",
      description:
        "Complete office furniture suite with desk, credenza, and bookshelf. Ideal for professional home offices.",
      category: "Office",
      group: "fabrication_site",
      sortOrder: 1,
      published: true,
    },
  ] satisfies DefaultProject[],
  testimonials: [
    {
      id: "default-carlos-mendoza",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      name: "Carlos Mendoza",
      role: "Homeowner",
      quote:
        "I love that I don't need to think about the design because Cebu Furniture Maker perfectly solves it for me. If you value quality craftsmanship over mass-produced furniture, I can highly recommend it.",
      sortOrder: 0,
      published: true,
    },
    {
      id: "default-maria-santos",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      name: "Maria Santos",
      role: "Interior Designer",
      quote:
        "The attention to detail in every piece is remarkable. Each furniture item tells a story of traditional Filipino craftsmanship combined with modern aesthetics.",
      sortOrder: 1,
      published: true,
    },
  ] satisfies DefaultTestimonial[],
  contact: {
    title: "Get in Touch",
    description:
      "Have a project in mind? Let's discuss how we can bring your furniture vision to life.",
    email: "info@cebufurnituremaker.com",
    phone: "+63 32 123 4567",
    address: "Cebu City, Philippines",
  },
  navigation: [
    { label: "Home", href: "#hero", id: "hero" },
    { label: "About", href: "#about", id: "about" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Testimonials", href: "#testimonials", id: "testimonials" },
    { label: "Contact", href: "#contact", id: "contact" },
  ] satisfies NavigationItem[],
  footer: {
    brand:
      "Handcrafted furniture designed and built in Cebu, Philippines. Creating timeless pieces for modern living.",
    socialLinks: [
      {
        label: "Facebook",
        href: "https://facebook.com/cebufurnituremaker",
      },
      {
        label: "Instagram",
        href: "https://instagram.com/cebufurnituremaker",
      },
      {
        label: "Twitter",
        href: "https://twitter.com/cebufurnituremaker",
      },
    ],
    columns: [
      {
        title: "Product",
        links: [
          { label: "Collections", href: "/collections" },
          { label: "Custom Orders", href: "/custom" },
          { label: "Design Consultation", href: "/consultation" },
          { label: "Catalog", href: "/catalog" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Our Story", href: "/story" },
          { label: "Craftsmanship", href: "/craftsmanship" },
          { label: "Careers", href: "/careers" },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: "Get in Touch", href: "/contact" },
          { label: "Visit Showroom", href: "/showroom" },
          { label: "Email Us", href: "mailto:info@cebufurnituremaker.com" },
          { label: "Phone", href: "tel:+63321234567" },
        ],
      },
    ] satisfies FooterColumnData[],
  },
} as const;

export type SiteSectionKey =
  | "hero"
  | "about"
  | "contact"
  | "footer";

export function getDefaultSection(sectionKey: SiteSectionKey) {
  return defaultSiteContent[sectionKey];
}
