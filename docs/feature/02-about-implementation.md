# About/Features Feature Implementation

## Overview

The About feature is a modern feature section that showcases the company's values, craftsmanship, and story. It displays key features in a grid layout with icons, followed by an image showcase section. The implementation follows the component architecture rules, with the main component in `_components/` and sub-components in `features/`.

## Architecture

### File Structure

```
src/
├── app/(landing-page)/
│   └── _components/
│       └── about.tsx                    # Main About component (page layout)
│
└── features/home/about/
    └── components/
        ├── about-header.tsx              # Header with title and description
        ├── feature-card.tsx              # Individual feature card component
        ├── features-grid.tsx             # Grid layout component
        ├── about-showcase.tsx             # Image showcase section
        ├── about-data.ts                 # Feature data and content
        └── index.ts                      # Component exports
```

## Component Breakdown

### Main Component: `about.tsx`

**Location**: `src/app/(landing-page)/_components/about.tsx`

**Purpose**: Orchestrates all about sub-components and provides the main layout structure.

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

import { AboutHeader } from "@/features/home/about/components/about-header";
import { FeaturesGrid } from "@/features/home/about/components/features-grid";
import { AboutShowcase } from "@/features/home/about/components/about-showcase";
import { aboutFeatures, showcaseData } from "@/features/home/about/components/about-data";

export function About() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <AboutHeader />
        <FeaturesGrid features={aboutFeatures} />
        <AboutShowcase
          image={showcaseData.image}
          title={showcaseData.title}
          description={showcaseData.description}
        />
      </div>
    </section>
  );
}
```

### Sub-Components

#### 1. AboutHeader

**Location**: `src/features/home/about/components/about-header.tsx`

**Purpose**: Displays the section header with title and description.

**Features**:
- Animated entrance with Framer Motion
- Responsive typography
- Centered text layout
- Dark mode support
- Staggered text animations

**Animation**:
- Container: Initial `opacity: 0, y: 20` → Animate `opacity: 1, y: 0`
- Title: Delay 0.1s
- Description: Delay 0.2s
- Duration: 0.6s
- Viewport: `once: true` (animates only once when scrolled into view)

**Content**:
- Title: "Crafted with Excellence"
- Description: "Every piece of furniture we create is a testament to traditional craftsmanship combined with modern design principles, built to last for generations."

#### 2. FeatureCard

**Location**: `src/features/home/about/components/feature-card.tsx`

**Purpose**: Renders individual feature cards with icon, title, and description.

**Props**:
```typescript
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}
```

**Features**:
- Icon in colored background container
- Title and description text
- Hover effects (shadow increase)
- Staggered entrance animations
- Dark mode support
- Border and background styling

**Layout**:
- Icon container: `w-12 h-12` with rounded background
- Padding: `p-6`
- Border: `border-gray-200 dark:border-gray-800`
- Shadow: `shadow-sm` → `shadow-md` on hover

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: 0.5s
- Delay: `index * 0.1` (staggered based on position)

#### 3. FeaturesGrid

**Location**: `src/features/home/about/components/features-grid.tsx`

**Purpose**: Renders the responsive grid layout for feature cards.

**Props**:
```typescript
interface FeaturesGridProps {
  features: Feature[];
}
```

**Features**:
- Responsive grid layout
- 1 column on mobile
- 2 columns on tablet (md breakpoint)
- 3 columns on desktop (lg breakpoint)
- Gap spacing: 6 (gap-6)

**Grid Classes**:
```tsx
className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
```

#### 4. AboutShowcase

**Location**: `src/features/home/about/components/about-showcase.tsx`

**Purpose**: Displays an image showcase with story content in a two-column layout.

**Props**:
```typescript
interface AboutShowcaseProps {
  image: string;
  title: string;
  description: string;
}
```

**Features**:
- Two-column layout (image + content)
- Next.js Image optimization
- Responsive layout (stacks on mobile)
- Animated entrance
- Dark mode support

**Layout**:
- Grid: `grid-cols-1 lg:grid-cols-2`
- Image aspect ratio: 4:3
- Gap: `gap-8 lg:gap-12`
- Image rounded corners: `rounded-lg`

**Animation**:
- Container: Fade in (0.8s duration)
- Image: Slide from left (`x: -20`)
- Content: Slide from right (`x: 20`) with 0.2s delay

#### 5. AboutData

**Location**: `src/features/home/about/components/about-data.ts`

**Purpose**: Contains feature data, showcase content, and TypeScript interfaces.

**Exports**:
- `Feature` interface
- `aboutFeatures` array (6 features)
- `showcaseData` object

**Feature Interface**:
```typescript
export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
```

**Features List**:
1. **Handcrafted Excellence** (Hammer icon)
   - "Each piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations."

2. **Made with Passion** (Heart icon)
   - "We pour our heart into every detail, ensuring that each furniture piece tells a story of dedication and care."

3. **Built to Last** (Shield icon)
   - "Using only the finest materials and time-tested construction methods, our furniture is designed to withstand the test of time."

4. **Award-Winning Design** (Award icon)
   - "Our designs have been recognized for their innovation, combining modern aesthetics with timeless craftsmanship."

5. **Family-Owned Business** (Users icon)
   - "As a family-owned business in Cebu, we take pride in our local roots and commitment to our community."

6. **Sustainable Practices** (Leaf icon)
   - "We source our materials responsibly and use sustainable practices to minimize our environmental impact."

**Showcase Data**:
- Image: Workshop/interior image
- Title: "Our Story"
- Description: Company history and values

## Design Features

### Layout

- **Section Padding**: `py-24` (vertical), `px-4 sm:px-6 lg:px-8` (horizontal)
- **Max Width**: `max-w-7xl` (1280px)
- **Background**: `bg-white dark:bg-gray-950`
- **Grid Gap**: `gap-6` (24px) for features, `gap-8 lg:gap-12` for showcase

### Typography

- **Header Title**: `text-4xl font-bold` (mobile), `sm:text-5xl` (desktop)
- **Header Description**: `text-lg` with max-width constraint
- **Card Title**: `text-lg font-semibold`
- **Card Description**: `text-sm` with `leading-relaxed`
- **Showcase Title**: `text-2xl font-bold`
- **Showcase Description**: `text-base` with `leading-relaxed`

### Colors

- **Text**: `text-gray-900 dark:text-white` (titles)
- **Description**: `text-gray-600 dark:text-gray-400`
- **Background**: `bg-white dark:bg-gray-900` (cards)
- **Icon Background**: `bg-primary/10 dark:bg-primary/20`
- **Icon Color**: `text-primary`
- **Border**: `border-gray-200 dark:border-gray-800`

### Icons

All icons are from `lucide-react`:
- `Hammer` - Handcrafted Excellence
- `Heart` - Made with Passion
- `Shield` - Built to Last
- `Award` - Award-Winning Design
- `Users` - Family-Owned Business
- `Leaf` - Sustainable Practices

### Animations

1. **Header Animation**:
   - Fade in from bottom
   - Staggered text elements
   - Triggers once when scrolled into view

2. **Card Animations**:
   - Staggered fade-in (0.1s delay per card)
   - Smooth hover transitions

3. **Showcase Animation**:
   - Container fades in
   - Image slides from left
   - Content slides from right with delay

## Usage

### Basic Usage

```tsx
import { About } from "./_components/about";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      {/* Other sections */}
    </>
  );
}
```

### Customization

#### Adding New Features

Edit `about-data.ts`:

```tsx
export const aboutFeatures: Feature[] = [
  // ... existing features
  {
    icon: YourIcon,
    title: "Your Feature Title",
    description: "Your feature description here.",
  },
];
```

#### Modifying Header Content

Edit `about-header.tsx`:

```tsx
<h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
  Your Custom Title
</h2>
<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
  Your custom description here.
</p>
```

#### Changing Grid Layout

Edit `features-grid.tsx`:

```tsx
// 4 columns on large screens
className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"

// Different gap spacing
className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
```

#### Customizing Card Appearance

Edit `feature-card.tsx`:

```tsx
// Change icon size
<div className="inline-flex items-center justify-center w-16 h-16 rounded-lg">

// Change padding
className="relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8"

// Change border radius
className="relative rounded-xl border"
```

#### Modifying Showcase Content

Edit `about-data.ts`:

```tsx
export const showcaseData = {
  image: "/your-image.jpg",
  title: "Your Title",
  description: "Your description here.",
};
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

### FeatureCardProps

```typescript
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}
```

### FeaturesGridProps

```typescript
interface FeaturesGridProps {
  features: Feature[];
}
```

### AboutShowcaseProps

```typescript
interface AboutShowcaseProps {
  image: string;
  title: string;
  description: string;
}
```

### Feature

```typescript
export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
```

## Dependencies

- **framer-motion**: For animations and scroll-triggered effects
- **next/image**: For optimized image loading
- **lucide-react**: For icons
- **tailwindcss**: For styling and responsive design

## Performance Considerations

1. **Image Optimization**: Uses Next.js Image component with proper sizing
2. **Lazy Loading**: Images load as they enter viewport
3. **Staggered Animations**: Animations trigger only when visible (`viewport={{ once: true }}`)
4. **Responsive Images**: Uses `sizes` prop for optimal image loading
5. **Component Splitting**: Sub-components allow for code splitting

## Responsive Behavior

### Mobile (< 768px)
- Single column grid for features
- Stacked layout for showcase (image above content)
- Full-width cards
- Reduced padding

### Tablet (768px - 1024px)
- Two column grid for features
- Stacked layout for showcase
- Medium padding
- Optimized spacing

### Desktop (> 1024px)
- Three column grid for features
- Two column layout for showcase (image + content side by side)
- Maximum content width (1280px)
- Generous spacing

## Accessibility

- Semantic HTML (`<section>`, proper heading hierarchy)
- Alt text for images (via Next.js Image)
- Keyboard navigation support
- Screen reader friendly text
- Proper contrast ratios
- Focus states on interactive elements
- Icon accessibility (decorative icons properly marked)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid support
- Requires JavaScript for animations
- Works with reduced motion preferences

## Icon Requirements

### Recommended Icons

- Use icons from `lucide-react` library
- Icons should be semantically meaningful
- Size: `h-6 w-6` (24px)
- Color: Primary theme color

### Adding Custom Icons

```tsx
import { YourIcon } from "lucide-react";

export const aboutFeatures: Feature[] = [
  {
    icon: YourIcon,
    title: "Feature Title",
    description: "Feature description",
  },
];
```

## Future Enhancements

Potential improvements:
- [ ] Add feature filtering or categorization
- [ ] Implement expandable feature details
- [ ] Add video showcase option
- [ ] Implement testimonial integration
- [ ] Add statistics/counters
- [ ] Implement interactive hover effects
- [ ] Add feature comparison table
- [ ] Implement animated icons
- [ ] Add feature search functionality
- [ ] Create feature detail modals

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Hero Implementation](./00-hero-implementation.md)
- [Projects Implementation](./01-projects-implementation.md)

## Troubleshooting

### Icons Not Displaying

1. **Check Icon Import**: Verify icon is imported from `lucide-react`
2. **Icon Component**: Ensure icon is passed as component, not string
3. **Icon Props**: Verify icon component accepts `className` prop

### Animations Not Working

1. **Framer Motion**: Ensure framer-motion is installed
2. **Client Component**: Verify component has `"use client"` directive
3. **Viewport**: Check if element is in viewport

### Layout Issues

1. **Grid**: Verify Tailwind classes are correct
2. **Container**: Check max-width constraints
3. **Responsive**: Test on different screen sizes
4. **Showcase**: Verify image and content are properly aligned

### Image Not Loading

1. **Image URL**: Verify URL is accessible
2. **Next.js Config**: Ensure `images.remotePatterns` includes your image domain
3. **Image Format**: Verify image format is supported

## Example: Adding a New Feature

```tsx
// 1. Import icon
import { Sparkles } from "lucide-react";

// 2. Add to about-data.ts
export const aboutFeatures: Feature[] = [
  // ... existing features
  {
    icon: Sparkles,
    title: "Innovative Design",
    description: "We combine traditional craftsmanship with cutting-edge design principles.",
  },
];

// 3. The grid will automatically render the new feature
// No other changes needed!
```

## Code Examples

### Custom Feature Card Variant

```tsx
// Create a custom card variant
export function CustomFeatureCard({ feature }: { feature: Feature }) {
  return (
    <motion.div
      className="custom-card-styles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <feature.icon className="custom-icon-styles" />
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </motion.div>
  );
}
```

### Filtered Features

```tsx
// Filter features by keyword
const filteredFeatures = aboutFeatures.filter(
  (feature) => feature.title.toLowerCase().includes("craft")
);

<FeaturesGrid features={filteredFeatures} />
```

### Custom Showcase Layout

```tsx
// Reverse layout (content first, then image)
<motion.div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
  <motion.div className="space-y-4 order-2 lg:order-1">
    {/* Content */}
  </motion.div>
  <motion.div className="relative aspect-[4/3] overflow-hidden rounded-lg order-1 lg:order-2">
    {/* Image */}
  </motion.div>
</motion.div>
```

This documentation provides a comprehensive guide for understanding, maintaining, and extending the About/Features feature.

