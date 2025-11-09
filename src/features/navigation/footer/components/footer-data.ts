export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumnData[] = [
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
];

