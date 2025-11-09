import { 
  Hammer, 
  Heart, 
  Shield, 
  Award, 
  Users, 
  Leaf 
} from "lucide-react";

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const aboutFeatures: Feature[] = [
  {
    icon: Hammer,
    title: "Handcrafted Excellence",
    description: "Each piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations.",
  },
  {
    icon: Heart,
    title: "Made with Passion",
    description: "We pour our heart into every detail, ensuring that each furniture piece tells a story of dedication and care.",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Using only the finest materials and time-tested construction methods, our furniture is designed to withstand the test of time.",
  },
  {
    icon: Award,
    title: "Award-Winning Design",
    description: "Our designs have been recognized for their innovation, combining modern aesthetics with timeless craftsmanship.",
  },
  {
    icon: Users,
    title: "Family-Owned Business",
    description: "As a family-owned business in Cebu, we take pride in our local roots and commitment to our community.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    description: "We source our materials responsibly and use sustainable practices to minimize our environmental impact.",
  },
];

export const showcaseData = {
  image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
  title: "Our Story",
  description: "Founded in Cebu, we've been creating beautiful, functional furniture for over two decades. Our workshop combines traditional Filipino craftsmanship with contemporary design sensibilities, resulting in pieces that are both timeless and modern. Every order is treated with the utmost care, from the initial design consultation to the final finishing touches.",
};

