# Projects/Gallery Feature Implementation

## Overview

The Projects feature is a gallery component that showcases furniture products in a responsive grid layout. It displays handcrafted furniture pieces with images, titles, descriptions, and categories. The implementation follows the component architecture rules, with the main component in `_components/` and sub-components in `features/`.

## Architecture

### File Structure

```
src/
├── app/(landing-page)/
│   └── _components/
│       └── projects.tsx                    # Main Projects component (page layout)
│
└── features/home/projects/
    └── components/
        ├── projects-header.tsx              # Header with title and description
        ├── project-card.tsx                 # Individual product card component
        ├── projects-grid.tsx                # Grid layout component
        ├── projects-data.ts                 # Product data and types
        └── index.ts                         # Component exports
```

## Component Breakdown

### Main Component: `projects.tsx`

**Location**: `src/app/(landing-page)/_components/projects.tsx`

**Purpose**: Orchestrates all projects sub-components and provides the main layout structure.

**Responsibilities**:
- Imports and composes sub-components
- Provides section container with spacing and background
- Manages the overall layout structure

**Key Features**:
- Responsive padding and spacing
- Dark mode support
- Full-width section layout

**Code Example**:
```tsx
"use client";

import { ProjectsHeader } from "@/features/home/projects/components/projects-header";
import { ProjectsGrid } from "@/features/home/projects/components/projects-grid";
import { furnitureProducts } from "@/features/home/projects/components/projects-data";

export function Projects() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <ProjectsGrid products={furnitureProducts} />
      </div>
    </section>
  );
}
```

### Sub-Components

#### 1. ProjectsHeader

**Location**: `src/features/home/projects/components/projects-header.tsx`

**Purpose**: Displays the section header with title and description.

**Features**:
- Animated entrance with Framer Motion
- Responsive typography
- Centered text layout
- Dark mode support

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: 0.6s
- Viewport: `once: true` (animates only once when scrolled into view)

**Content**:
- Title: "Our Crafted Collection"
- Description: "Discover our handcrafted furniture pieces, each designed and built with precision and care in Cebu."

#### 2. ProjectCard

**Location**: `src/features/home/projects/components/project-card.tsx`

**Purpose**: Renders individual product cards with image, title, description, and category.

**Props**:
```typescript
interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  index: number;
}
```

**Features**:
- Next.js Image optimization
- Hover effects (image scale, overlay gradient)
- Category badge on hover
- Responsive image sizing
- Staggered entrance animations
- Dark mode support

**Hover Effects**:
- Image scales to 110% on hover
- Gradient overlay appears from bottom
- Category badge fades in
- Shadow increases

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: 0.5s
- Delay: `index * 0.1` (staggered based on position)

**Layout**:
- Image aspect ratio: 4:3
- Padding: 6 (p-6)
- Rounded corners: `rounded-lg`
- Shadow: `shadow-lg` → `shadow-xl` on hover

#### 3. ProjectsGrid

**Location**: `src/features/home/projects/components/projects-grid.tsx`

**Purpose**: Renders the responsive grid layout for product cards.

**Props**:
```typescript
interface ProjectsGridProps {
  products: Product[];
}
```

**Features**:
- Responsive grid layout
- 1 column on mobile
- 2 columns on tablet (sm breakpoint)
- 3 columns on desktop (lg breakpoint)
- Gap spacing: 6 (gap-6)

**Grid Classes**:
```tsx
className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
```

#### 4. ProjectsData

**Location**: `src/features/home/projects/components/projects-data.ts`

**Purpose**: Contains product data and TypeScript interfaces.

**Exports**:
- `Product` interface
- `furnitureProducts` array

**Product Interface**:
```typescript
export interface Product {
  image: string;
  title: string;
  description: string;
  category: string;
}
```

**Sample Products**:
1. Modern Sofa Set (Living Room)
2. Dining Table Collection (Dining Room)
3. Master Bedroom Suite (Bedroom)
4. Executive Office Desk (Office)
5. Accent Chair Collection (Accent)
6. Coffee Table Set (Living Room)

**Image URLs**:
- Uses Unsplash images with optimized parameters
- Format: `https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop`
- All images are 800x600 with crop fit

## Design Features

### Layout

- **Section Padding**: `py-24` (vertical), `px-4 sm:px-6 lg:px-8` (horizontal)
- **Max Width**: `max-w-7xl` (1280px)
- **Background**: `bg-gray-50 dark:bg-gray-900`
- **Grid Gap**: `gap-6` (24px)

### Typography

- **Header Title**: `text-4xl font-bold` (mobile), `sm:text-5xl` (desktop)
- **Header Description**: `text-lg` with max-width constraint
- **Card Title**: `text-xl font-semibold`
- **Card Description**: `text-sm` with `line-clamp-2` (2-line truncation)
- **Category Badge**: `text-xs font-semibold`

### Colors

- **Text**: `text-gray-900 dark:text-white` (titles)
- **Description**: `text-gray-600 dark:text-gray-400`
- **Background**: `bg-white dark:bg-gray-800` (cards)
- **Badge**: `bg-black/50 backdrop-blur-sm` with white text

### Animations

1. **Header Animation**:
   - Fade in from bottom
   - Triggers once when scrolled into view

2. **Card Animations**:
   - Staggered fade-in (0.1s delay per card)
   - Smooth hover transitions (300ms)

3. **Hover Effects**:
   - Image scale: 110%
   - Shadow increase
   - Gradient overlay fade-in
   - Category badge fade-in

## Usage

### Basic Usage

```tsx
import { Projects } from "./_components/projects";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Projects />
      {/* Other sections */}
    </>
  );
}
```

### Customization

#### Adding New Products

Edit `projects-data.ts`:

```tsx
export const furnitureProducts: Product[] = [
  // ... existing products
  {
    image: "https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop",
    title: "Your Product Name",
    description: "Your product description here.",
    category: "Category Name",
  },
];
```

#### Modifying Header Content

Edit `projects-header.tsx`:

```tsx
<h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
  Your Custom Title
</h2>
<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
  Your custom description here.
</p>
```

#### Changing Grid Layout

Edit `projects-grid.tsx`:

```tsx
// 4 columns on large screens
className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"

// Different gap spacing
className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
```

#### Customizing Card Appearance

Edit `project-card.tsx`:

```tsx
// Change aspect ratio
<div className="relative aspect-square overflow-hidden">

// Change padding
<div className="p-8">

// Change border radius
className="group relative overflow-hidden rounded-xl"
```

#### Adjusting Animation Speeds

Edit component files:

```tsx
// Faster animations
transition={{ duration: 0.3, delay: index * 0.05 }}

// Slower animations
transition={{ duration: 0.8, delay: index * 0.15 }}
```

## Props and Interfaces

### ProjectCardProps

```typescript
interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  index: number;
}
```

### ProjectsGridProps

```typescript
interface ProjectsGridProps {
  products: Product[];
}
```

### Product

```typescript
export interface Product {
  image: string;
  title: string;
  description: string;
  category: string;
}
```

## Dependencies

- **framer-motion**: For animations and scroll-triggered effects
- **next/image**: For optimized image loading
- **tailwindcss**: For styling and responsive design

## Performance Considerations

1. **Image Optimization**: Uses Next.js Image component with proper sizing
2. **Lazy Loading**: Images load as they enter viewport
3. **Staggered Animations**: Animations trigger only when visible (`viewport={{ once: true }}`)
4. **Responsive Images**: Uses `sizes` prop for optimal image loading
5. **Component Splitting**: Sub-components allow for code splitting

## Responsive Behavior

### Mobile (< 640px)
- Single column grid
- Full-width cards
- Reduced padding

### Tablet (640px - 1024px)
- Two column grid
- Medium padding
- Optimized spacing

### Desktop (> 1024px)
- Three column grid
- Maximum content width (1280px)
- Generous spacing

## Accessibility

- Semantic HTML (`<section>`, proper heading hierarchy)
- Alt text for images (via Next.js Image)
- Keyboard navigation support
- Screen reader friendly text
- Proper contrast ratios
- Focus states on interactive elements

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid support
- Requires JavaScript for animations
- Works with reduced motion preferences

## Image Requirements

### Recommended Specifications

- **Aspect Ratio**: 4:3 (800x600)
- **Format**: JPEG or WebP
- **Size**: Optimized for web (< 200KB per image)
- **Source**: Unsplash or similar high-quality image service

### Image URL Format

```tsx
// Unsplash format
"https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop"

// Local images
"/images/products/product-name.jpg"
```

## Future Enhancements

Potential improvements:
- [ ] Add filtering by category
- [ ] Implement lightbox/modal for image viewing
- [ ] Add product detail pages
- [ ] Implement infinite scroll or pagination
- [ ] Add search functionality
- [ ] Add sorting options (price, date, popularity)
- [ ] Implement favorites/wishlist feature
- [ ] Add loading skeletons
- [ ] Implement image lazy loading with intersection observer
- [ ] Add animation presets configuration

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Hero Implementation](./00-hero-implementation.md)

## Troubleshooting

### Images Not Loading

1. **Check Image URLs**: Verify URLs are accessible
2. **Next.js Config**: Ensure `images.remotePatterns` includes your image domain
3. **Image Format**: Verify image format is supported
4. **Network**: Check network connectivity

### Animations Not Working

1. **Framer Motion**: Ensure framer-motion is installed
2. **Client Component**: Verify component has `"use client"` directive
3. **Viewport**: Check if element is in viewport

### Layout Issues

1. **Grid**: Verify Tailwind classes are correct
2. **Container**: Check max-width constraints
3. **Responsive**: Test on different screen sizes

## Example: Adding a New Product

```tsx
// 1. Add to projects-data.ts
export const furnitureProducts: Product[] = [
  // ... existing products
  {
    image: "https://images.unsplash.com/photo-1234567890?w=800&h=600&fit=crop",
    title: "New Furniture Piece",
    description: "Description of the new furniture piece.",
    category: "Living Room",
  },
];

// 2. The grid will automatically render the new product
// No other changes needed!
```

## Code Examples

### Custom Card Component

```tsx
// Create a custom card variant
export function CustomProjectCard({ product }: { product: Product }) {
  return (
    <motion.div
      className="custom-card-styles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Custom card content */}
    </motion.div>
  );
}
```

### Filtered Grid

```tsx
// Filter products by category
const filteredProducts = furnitureProducts.filter(
  (product) => product.category === "Living Room"
);

<ProjectsGrid products={filteredProducts} />
```

This documentation provides a comprehensive guide for understanding, maintaining, and extending the Projects/Gallery feature.

