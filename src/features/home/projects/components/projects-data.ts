export interface Product {
  image: string;
  title: string;
  description: string;
  category: string;
}

export const furnitureProducts: Product[] = [
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    title: "Modern Sofa Set",
    description: "Elegant three-piece sofa set crafted from premium hardwood with luxurious fabric upholstery. Perfect for modern living spaces.",
    category: "Living Room",
  },
  {
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    title: "Dining Table Collection",
    description: "Handcrafted solid wood dining table with matching chairs. Built to last generations with traditional joinery techniques.",
    category: "Dining Room",
  },
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    title: "Master Bedroom Suite",
    description: "Complete bedroom set featuring a queen-size bed frame, nightstands, and dresser. Made from sustainably sourced narra wood.",
    category: "Bedroom",
  },
  {
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    title: "Executive Office Desk",
    description: "Spacious executive desk with built-in drawers and cable management. Ideal for home offices and professional workspaces.",
    category: "Office",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    title: "Accent Chair Collection",
    description: "Stylish accent chairs available in various designs and fabrics. Adds character and comfort to any room.",
    category: "Accent",
  },
  {
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    title: "Coffee Table Set",
    description: "Contemporary coffee table with matching side tables. Features clean lines and premium wood finish.",
    category: "Living Room",
  },
];

