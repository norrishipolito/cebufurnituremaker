export type ProductType = "Set" | "Collection" | "Suites";

export interface Product {
  image: string;
  title: string;
  description: string;
  category: string;
  type: ProductType;
}

export const furnitureProducts: Product[] = [
  // Sets
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    title: "Modern Sofa Set",
    description: "Elegant three-piece sofa set crafted from premium hardwood with luxurious fabric upholstery. Perfect for modern living spaces.",
    category: "Living Room",
    type: "Set",
  },
  {
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    title: "Coffee Table Set",
    description: "Contemporary coffee table with matching side tables. Features clean lines and premium wood finish.",
    category: "Living Room",
    type: "Set",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    title: "Dining Chair Set",
    description: "Handcrafted dining chairs in sets of four or six. Made from solid mahogany with ergonomic design for comfort.",
    category: "Dining Room",
    type: "Set",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    title: "End Table Set",
    description: "Matching end tables perfect for flanking sofas or beds. Features drawers and elegant wood grain finish.",
    category: "Living Room",
    type: "Set",
  },
  {
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    title: "Outdoor Patio Set",
    description: "Weather-resistant outdoor furniture set with table and chairs. Ideal for balconies and garden spaces.",
    category: "Outdoor",
    type: "Set",
  },
  {
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    title: "Bar Stool Set",
    description: "Stylish bar stools in sets of two or four. Perfect for kitchen islands and home bars.",
    category: "Dining Room",
    type: "Set",
  },
  // Collections
  {
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    title: "Dining Table Collection",
    description: "Handcrafted solid wood dining table with matching chairs. Built to last generations with traditional joinery techniques.",
    category: "Dining Room",
    type: "Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    title: "Accent Chair Collection",
    description: "Stylish accent chairs available in various designs and fabrics. Adds character and comfort to any room.",
    category: "Accent",
    type: "Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    title: "Wall Unit Collection",
    description: "Modular wall units for living rooms and home offices. Customizable configurations to fit any space.",
    category: "Living Room",
    type: "Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    title: "Console Table Collection",
    description: "Elegant console tables in various sizes and finishes. Perfect for entryways and hallways.",
    category: "Entryway",
    type: "Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    title: "Bookshelf Collection",
    description: "Customizable bookshelf systems available in multiple sizes. Made from premium hardwood.",
    category: "Office",
    type: "Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    title: "Sideboard Collection",
    description: "Beautiful sideboards and buffets for dining rooms. Features ample storage and elegant design.",
    category: "Dining Room",
    type: "Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    title: "Occasional Table Collection",
    description: "Nested tables and occasional pieces in various styles. Versatile and space-efficient designs.",
    category: "Living Room",
    type: "Collection",
  },
  // Suites
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    title: "Master Bedroom Suite",
    description: "Complete bedroom set featuring a queen-size bed frame, nightstands, and dresser. Made from sustainably sourced narra wood.",
    category: "Bedroom",
    type: "Suites",
  },
  {
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    title: "Executive Office Suite",
    description: "Complete office furniture suite with desk, credenza, and bookshelf. Ideal for professional home offices.",
    category: "Office",
    type: "Suites",
  },
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    title: "Guest Bedroom Suite",
    description: "Charming bedroom suite with twin beds, nightstand, and wardrobe. Perfect for guest rooms.",
    category: "Bedroom",
    type: "Suites",
  },
  {
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    title: "Teen Bedroom Suite",
    description: "Modern bedroom suite designed for teenagers. Includes bed, desk, and storage solutions.",
    category: "Bedroom",
    type: "Suites",
  },
  {
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    title: "Study Room Suite",
    description: "Complete study room furniture including desk, chair, and storage units. Optimized for productivity.",
    category: "Office",
    type: "Suites",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    title: "Master Bedroom Luxury Suite",
    description: "Premium bedroom suite with king bed, matching furniture pieces, and elegant finishes.",
    category: "Bedroom",
    type: "Suites",
  },
];

