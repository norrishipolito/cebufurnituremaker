export interface Product {
  slug: string;
  image: string;
  imageAlt: string;
  images: {
    url: string;
    alt: string;
  }[];
  title: string;
  description: string;
  category: string;
  group: string;
  groupLabel: string;
}

export const furnitureProducts: Product[] = [
  // Sets
  {
    slug: "modern-sofa-set",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    imageAlt: "Modern Sofa Set",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        alt: "Modern Sofa Set",
      },
    ],
    title: "Modern Sofa Set",
    description: "Elegant three-piece sofa set crafted from premium hardwood with luxurious fabric upholstery. Perfect for modern living spaces.",
    category: "Living Room",
    group: "products",
    groupLabel: "Products",
  },
  {
    slug: "coffee-table-set",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    imageAlt: "Coffee Table Set",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
        alt: "Coffee Table Set",
      },
    ],
    title: "Coffee Table Set",
    description: "Contemporary coffee table with matching side tables. Features clean lines and premium wood finish.",
    category: "Living Room",
    group: "products",
    groupLabel: "Products",
  },
  {
    slug: "dining-chair-set",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    imageAlt: "Dining Chair Set",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Dining Chair Set",
      },
    ],
    title: "Dining Chair Set",
    description: "Handcrafted dining chairs in sets of four or six. Made from solid mahogany with ergonomic design for comfort.",
    category: "Dining Room",
    group: "products",
    groupLabel: "Products",
  },
  {
    slug: "end-table-set",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    imageAlt: "End Table Set",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "End Table Set",
      },
    ],
    title: "End Table Set",
    description: "Matching end tables perfect for flanking sofas or beds. Features drawers and elegant wood grain finish.",
    category: "Living Room",
    group: "products",
    groupLabel: "Products",
  },
  {
    slug: "outdoor-patio-set",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    imageAlt: "Outdoor Patio Set",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
        alt: "Outdoor Patio Set",
      },
    ],
    title: "Outdoor Patio Set",
    description: "Weather-resistant outdoor furniture set with table and chairs. Ideal for balconies and garden spaces.",
    category: "Outdoor",
    group: "products",
    groupLabel: "Products",
  },
  {
    slug: "bar-stool-set",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    imageAlt: "Bar Stool Set",
    images: [
      {
        url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
        alt: "Bar Stool Set",
      },
    ],
    title: "Bar Stool Set",
    description: "Stylish bar stools in sets of two or four. Perfect for kitchen islands and home bars.",
    category: "Dining Room",
    group: "products",
    groupLabel: "Products",
  },
  // Collections
  {
    slug: "dining-table-collection",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    imageAlt: "Dining Table Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
        alt: "Dining Table Collection",
      },
    ],
    title: "Dining Table Collection",
    description: "Handcrafted solid wood dining table with matching chairs. Built to last generations with traditional joinery techniques.",
    category: "Dining Room",
    group: "showroom",
    groupLabel: "Showroom",
  },
  {
    slug: "accent-chair-collection",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    imageAlt: "Accent Chair Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Accent Chair Collection",
      },
    ],
    title: "Accent Chair Collection",
    description: "Stylish accent chairs available in various designs and fabrics. Adds character and comfort to any room.",
    category: "Accent",
    group: "showroom",
    groupLabel: "Showroom",
  },
  {
    slug: "wall-unit-collection",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    imageAlt: "Wall Unit Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        alt: "Wall Unit Collection",
      },
    ],
    title: "Wall Unit Collection",
    description: "Modular wall units for living rooms and home offices. Customizable configurations to fit any space.",
    category: "Living Room",
    group: "showroom",
    groupLabel: "Showroom",
  },
  {
    slug: "console-table-collection",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    imageAlt: "Console Table Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
        alt: "Console Table Collection",
      },
    ],
    title: "Console Table Collection",
    description: "Elegant console tables in various sizes and finishes. Perfect for entryways and hallways.",
    category: "Entryway",
    group: "showroom",
    groupLabel: "Showroom",
  },
  {
    slug: "bookshelf-collection",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    imageAlt: "Bookshelf Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
        alt: "Bookshelf Collection",
      },
    ],
    title: "Bookshelf Collection",
    description: "Customizable bookshelf systems available in multiple sizes. Made from premium hardwood.",
    category: "Office",
    group: "showroom",
    groupLabel: "Showroom",
  },
  {
    slug: "sideboard-collection",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    imageAlt: "Sideboard Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Sideboard Collection",
      },
    ],
    title: "Sideboard Collection",
    description: "Beautiful sideboards and buffets for dining rooms. Features ample storage and elegant design.",
    category: "Dining Room",
    group: "showroom",
    groupLabel: "Showroom",
  },
  {
    slug: "occasional-table-collection",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    imageAlt: "Occasional Table Collection",
    images: [
      {
        url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
        alt: "Occasional Table Collection",
      },
    ],
    title: "Occasional Table Collection",
    description: "Nested tables and occasional pieces in various styles. Versatile and space-efficient designs.",
    category: "Living Room",
    group: "showroom",
    groupLabel: "Showroom",
  },
  // Suites
  {
    slug: "master-bedroom-suite",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    imageAlt: "Master Bedroom Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
        alt: "Master Bedroom Suite",
      },
    ],
    title: "Master Bedroom Suite",
    description: "Complete bedroom set featuring a queen-size bed frame, nightstands, and dresser. Made from sustainably sourced narra wood.",
    category: "Bedroom",
    group: "fabrication_site",
    groupLabel: "Fabrication Site",
  },
  {
    slug: "executive-office-suite",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
    imageAlt: "Executive Office Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop",
        alt: "Executive Office Suite",
      },
    ],
    title: "Executive Office Suite",
    description: "Complete office furniture suite with desk, credenza, and bookshelf. Ideal for professional home offices.",
    category: "Office",
    group: "fabrication_site",
    groupLabel: "Fabrication Site",
  },
  {
    slug: "guest-bedroom-suite",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    imageAlt: "Guest Bedroom Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        alt: "Guest Bedroom Suite",
      },
    ],
    title: "Guest Bedroom Suite",
    description: "Charming bedroom suite with twin beds, nightstand, and wardrobe. Perfect for guest rooms.",
    category: "Bedroom",
    group: "fabrication_site",
    groupLabel: "Fabrication Site",
  },
  {
    slug: "teen-bedroom-suite",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    imageAlt: "Teen Bedroom Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
        alt: "Teen Bedroom Suite",
      },
    ],
    title: "Teen Bedroom Suite",
    description: "Modern bedroom suite designed for teenagers. Includes bed, desk, and storage solutions.",
    category: "Bedroom",
    group: "fabrication_site",
    groupLabel: "Fabrication Site",
  },
  {
    slug: "study-room-suite",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
    imageAlt: "Study Room Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
        alt: "Study Room Suite",
      },
    ],
    title: "Study Room Suite",
    description: "Complete study room furniture including desk, chair, and storage units. Optimized for productivity.",
    category: "Office",
    group: "fabrication_site",
    groupLabel: "Fabrication Site",
  },
  {
    slug: "master-bedroom-luxury-suite",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    imageAlt: "Master Bedroom Luxury Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Master Bedroom Luxury Suite",
      },
    ],
    title: "Master Bedroom Luxury Suite",
    description: "Premium bedroom suite with king bed, matching furniture pieces, and elegant finishes.",
    category: "Bedroom",
    group: "fabrication_site",
    groupLabel: "Fabrication Site",
  },
];

