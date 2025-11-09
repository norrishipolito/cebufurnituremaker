# Footer Feature Implementation

## Overview

The Footer feature is a comprehensive footer component that provides site navigation, company information, and contact details. It follows the Launch UI footer pattern with a 4-column layout (excluding Legal section). The footer is implemented as a shared layout component that appears across all pages. The implementation follows the component architecture rules, with the main component in `common/layouts/` and sub-components in `features/`.

## Architecture

### File Structure

```
src/
├── app/(landing-page)/
│   └── layout.tsx                    # Includes Footer component
│
├── common/layouts/
│   └── footer.tsx                    # Main Footer component (shared layout)
│
└── features/navigation/footer/
    └── components/
        ├── footer-brand.tsx          # Brand/logo section
        ├── footer-column.tsx         # Reusable column component
        ├── footer-social.tsx          # Social media links
        ├── footer-bottom.tsx         # Copyright and bottom links
        ├── footer-data.ts             # Footer links data
        └── index.ts                   # Component exports
```

## Component Breakdown

### Main Component: `footer.tsx`

**Location**: `src/common/layouts/footer.tsx`

**Purpose**: Orchestrates all footer sub-components and provides the main layout structure.

**Responsibilities**:
- Imports and composes sub-components
- Provides footer container with spacing and background
- Manages 4-column responsive grid layout
- Integrates brand, columns, social, and bottom sections

**Key Features**:
- 4-column layout (Product, Company, Contact + Brand)
- Responsive grid (stacks on mobile)
- Dark mode support
- Border top separator

**Code Example**:
```tsx
"use client";

import { FooterBrand } from "@/features/navigation/footer/components/footer-brand";
import { FooterColumn } from "@/features/navigation/footer/components/footer-column";
import { FooterSocial } from "@/features/navigation/footer/components/footer-social";
import { FooterBottom } from "@/features/navigation/footer/components/footer-bottom";
import { footerColumns } from "@/features/navigation/footer/components/footer-data";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterBrand />
            <FooterSocial />
          </div>
          {footerColumns.map((column, index) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
```

### Sub-Components

#### 1. FooterBrand

**Location**: `src/features/navigation/footer/components/footer-brand.tsx`

**Purpose**: Displays the company brand, name, and description.

**Features**:
- Company name display
- Description text
- Animated entrance
- Dark mode support

**Content**:
- Title: "Cebu Furniture Maker"
- Description: "Handcrafted furniture designed and built in Cebu, Philippines. Creating timeless pieces for modern living."

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: 0.6s
- Viewport: `once: true`

#### 2. FooterColumn

**Location**: `src/features/navigation/footer/components/footer-column.tsx`

**Purpose**: Renders a footer column with title and list of links.

**Props**:
```typescript
interface FooterColumnProps {
  title: string;
  links: FooterLink[];
  delay?: number;
}
```

**Features**:
- Column title
- List of links
- Hover effects on links
- Animated entrance with configurable delay
- Dark mode support

**Layout**:
- Title: `text-sm font-semibold`
- Links: `space-y-3` vertical spacing
- Link styling: `text-sm` with hover color transition

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: 0.5s
- Delay: Configurable (default 0)

#### 3. FooterSocial

**Location**: `src/features/navigation/footer/components/footer-social.tsx`

**Purpose**: Displays social media links with icons.

**Features**:
- Four social media icons (Facebook, Instagram, Twitter, GitHub)
- Icon hover effects
- Animated entrance
- Accessibility labels

**Social Links**:
- Facebook
- Instagram
- Twitter
- GitHub

**Icons**:
- All icons from `lucide-react`
- Size: `h-5 w-5` (20px)
- Color: `text-gray-600 dark:text-gray-400` with hover transition

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Delay: 0.4s
- Duration: 0.5s

#### 4. FooterBottom

**Location**: `src/features/navigation/footer/components/footer-bottom.tsx`

**Purpose**: Displays copyright notice and legal links.

**Features**:
- Dynamic copyright year
- Privacy Policy link
- Terms of Service link
- Responsive layout (stacks on mobile)
- Border separator
- Animated entrance

**Content**:
- Copyright: "© {currentYear} Cebu Furniture Maker. All rights reserved."
- Links: Privacy Policy, Terms of Service

**Layout**:
- Border top: `border-t border-gray-200 dark:border-gray-800`
- Padding top: `pt-8`
- Margin top: `mt-12`
- Flex layout: `flex-col sm:flex-row` (responsive)

**Animation**:
- Initial: `opacity: 0`
- Animate: `opacity: 1`
- Delay: 0.5s
- Duration: 0.6s

#### 5. FooterData

**Location**: `src/features/navigation/footer/components/footer-data.ts`

**Purpose**: Contains footer column data and TypeScript interfaces.

**Exports**:
- `FooterLink` interface
- `FooterColumnData` interface
- `footerColumns` array (3 columns)

**Interfaces**:
```typescript
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}
```

**Columns**:
1. **Product**:
   - Collections
   - Custom Orders
   - Design Consultation
   - Catalog

2. **Company**:
   - About Us
   - Our Story
   - Craftsmanship
   - Careers

3. **Contact**:
   - Get in Touch
   - Visit Showroom
   - Email Us
   - Phone

## Design Features

### Layout

- **Container**: `max-w-7xl` (1280px)
- **Padding**: `px-4 py-12 sm:px-6 lg:px-8`
- **Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Gap**: `gap-8` (32px)
- **Background**: `bg-white dark:bg-gray-950`
- **Border**: `border-t border-gray-200 dark:border-gray-800`

### Typography

- **Brand Title**: `text-2xl font-bold`
- **Brand Description**: `text-sm` with max-width
- **Column Title**: `text-sm font-semibold`
- **Links**: `text-sm`
- **Copyright**: `text-sm`
- **Bottom Links**: `text-sm`

### Colors

- **Text**: `text-gray-900 dark:text-white` (headings)
- **Description**: `text-gray-600 dark:text-gray-400`
- **Links**: `text-gray-600 dark:text-gray-400` with hover to `text-gray-900 dark:text-white`
- **Icons**: `text-gray-600 dark:text-gray-400` with hover transition
- **Background**: `bg-white dark:bg-gray-950`
- **Border**: `border-gray-200 dark:border-gray-800`

### Icons

All icons are from `lucide-react`:
- `Facebook` - Facebook social link
- `Instagram` - Instagram social link
- `Twitter` - Twitter social link
- `Github` - GitHub social link

### Animations

1. **Brand Animation**:
   - Fade in from bottom
   - Triggers once when scrolled into view

2. **Column Animations**:
   - Staggered fade-in (0.1s delay per column)
   - Smooth entrance

3. **Social Animation**:
   - Fade in from bottom
   - Delay: 0.4s

4. **Bottom Animation**:
   - Fade in
   - Delay: 0.5s

## Usage

### Basic Usage

The footer is automatically included in the landing page layout:

```tsx
// app/(landing-page)/layout.tsx
import { Footer } from "@/common/layouts/footer";

export default function LandingPageLayout({ children }) {
  return (
    <div className="flex flex-col">
      {children}
      <Footer />
    </div>
  );
}
```

### Adding Footer to Other Pages

```tsx
import { Footer } from "@/common/layouts/footer";

export default function OtherPage() {
  return (
    <>
      {/* Page content */}
      <Footer />
    </>
  );
}
```

### Customization

#### Adding New Footer Columns

Edit `footer-data.ts`:

```tsx
export const footerColumns: FooterColumnData[] = [
  // ... existing columns
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
    ],
  },
];
```

#### Modifying Brand Content

Edit `footer-brand.tsx`:

```tsx
<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
  Your Brand Name
</h3>
<p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
  Your custom description here.
</p>
```

#### Adding/Removing Social Links

Edit `footer-social.tsx`:

```tsx
const socialLinks: SocialLink[] = [
  // ... existing links
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/cebufurnituremaker",
    label: "LinkedIn",
  },
];
```

#### Modifying Bottom Links

Edit `footer-bottom.tsx`:

```tsx
<div className="flex items-center gap-6 text-sm">
  <a href="/privacy">Privacy Policy</a>
  <a href="/terms">Terms of Service</a>
  <a href="/cookies">Cookie Policy</a>
</div>
```

#### Changing Grid Layout

Edit `footer.tsx`:

```tsx
// 5 columns
<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">

// Different brand span
<div className="sm:col-span-2 lg:col-span-2">
  <FooterBrand />
</div>
```

## Props and Interfaces

### FooterColumnProps

```typescript
interface FooterColumnProps {
  title: string;
  links: FooterLink[];
  delay?: number;
}
```

### FooterLink

```typescript
export interface FooterLink {
  label: string;
  href: string;
}
```

### FooterColumnData

```typescript
export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}
```

## Dependencies

- **framer-motion**: For animations and scroll-triggered effects
- **lucide-react**: For icons (Facebook, Instagram, Twitter, Github)
- **tailwindcss**: For styling and responsive design

## Performance Considerations

1. **Animations**: Only trigger once when scrolled into view
2. **Component Splitting**: Sub-components allow for code splitting
3. **Static Content**: Footer content is static (no API calls)
4. **Optimized Rendering**: Uses React key props for list rendering

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Brand section at top
- Columns stack vertically
- Social icons below brand
- Bottom links stack vertically

### Tablet (640px - 1024px)
- Two column grid
- Brand spans 2 columns
- Columns arranged in 2 columns
- Bottom links in row

### Desktop (> 1024px)
- Four column grid
- Brand in first column
- Three content columns
- Maximum content width (1280px)
- Bottom links in row

## Accessibility

- Semantic HTML (`<footer>`, `<nav>`, proper link structure)
- ARIA labels on social icons
- Keyboard navigation support
- Screen reader friendly
- Proper contrast ratios
- Focus states on interactive elements
- Descriptive link text

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid support
- Requires JavaScript for animations
- Works with reduced motion preferences

## Footer Structure

### Column Organization

1. **Brand Column** (First):
   - Company name and description
   - Social media links

2. **Product Column**:
   - Product-related links
   - Service offerings

3. **Company Column**:
   - Company information links
   - About and story links

4. **Contact Column**:
   - Contact methods
   - Location information

### Link Organization

- Links are organized by category
- Each column has a clear purpose
- Links use descriptive labels
- External links can be opened in new tabs (if needed)

## Future Enhancements

Potential improvements:
- [ ] Add newsletter signup form
- [ ] Add footer logo/image
- [ ] Implement footer language switcher
- [ ] Add footer search functionality
- [ ] Create footer sitemap
- [ ] Add footer payment method icons
- [ ] Implement footer accordion on mobile
- [ ] Add footer back-to-top button
- [ ] Create footer badge/certifications
- [ ] Add footer awards/recognition

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Hero Implementation](./00-hero-implementation.md)
- [Projects Implementation](./01-projects-implementation.md)
- [About Implementation](./02-about-implementation.md)
- [Testimonials Implementation](./03-testimonials-implementation.md)
- [Contact Implementation](./04-contact-implementation.md)
- [Launch UI Footer Documentation](https://www.launchuicomponents.com/docs/sections/footer)

## Troubleshooting

### Footer Not Displaying

1. **Layout Import**: Verify Footer is imported in layout.tsx
2. **Component Export**: Check if Footer is properly exported
3. **Path**: Verify import path is correct

### Links Not Working

1. **Href Values**: Verify href values are correct
2. **Routes**: Ensure routes exist if using internal links
3. **External Links**: Check if external URLs are valid

### Layout Issues

1. **Grid**: Verify Tailwind classes are correct
2. **Responsive**: Test on different screen sizes
3. **Spacing**: Check gap and padding values

### Animations Not Working

1. **Framer Motion**: Ensure framer-motion is installed
2. **Client Component**: Verify component has `"use client"` directive
3. **Viewport**: Check if element is in viewport

## Example: Adding a New Column

```tsx
// 1. Add to footer-data.ts
export const footerColumns: FooterColumnData[] = [
  // ... existing columns
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
];

// 2. The footer will automatically render the new column
// No other changes needed!
```

## Code Examples

### Custom Footer Column

```tsx
// Create a custom column variant
export function CustomFooterColumn({ column }: { column: FooterColumnData }) {
  return (
    <div>
      <h4>{column.title}</h4>
      <ul>
        {column.links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Footer with Newsletter

```tsx
// Add newsletter section
<div className="sm:col-span-2 lg:col-span-1">
  <FooterBrand />
  <NewsletterSignup />
  <FooterSocial />
</div>
```

### Footer with Logo

```tsx
// Add logo image
<div className="mb-4">
  <Image
    src="/logo.png"
    alt="Cebu Furniture Maker"
    width={120}
    height={40}
  />
</div>
```

This documentation provides a comprehensive guide for understanding, maintaining, and extending the Footer feature.

