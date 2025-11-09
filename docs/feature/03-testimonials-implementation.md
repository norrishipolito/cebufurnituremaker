# Testimonials Feature Implementation

## Overview

The Testimonials feature is an infinite scrolling marquee component that displays customer testimonials in a continuous horizontal scroll. It uses Magic UI's Marquee component to create a smooth, animated display of testimonial cards. The implementation follows the component architecture rules, with the main component in `_components/` and sub-components in `features/`.

## Architecture

### File Structure

```
src/
├── app/(landing-page)/
│   └── _components/
│       └── testimonials.tsx                    # Main Testimonials component (page layout)
│
└── features/home/testimonials/
    └── components/
        ├── testimonial-card.tsx                # Individual testimonial card
        ├── testimonials-header.tsx              # Header with title and description
        ├── testimonials-marquee.tsx             # Marquee wrapper component
        ├── testimonials-data.ts                 # Testimonials data and types
        └── index.ts                             # Component exports
```

## Component Breakdown

### Main Component: `testimonials.tsx`

**Location**: `src/app/(landing-page)/_components/testimonials.tsx`

**Purpose**: Orchestrates all testimonials sub-components and provides the main layout structure.

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

import { TestimonialsHeader } from "@/features/home/testimonials/components/testimonials-header";
import { TestimonialsMarquee } from "@/features/home/testimonials/components/testimonials-marquee";
import { testimonials } from "@/features/home/testimonials/components/testimonials-data";

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <TestimonialsHeader />
        <TestimonialsMarquee testimonials={testimonials} />
      </div>
    </section>
  );
}
```

### Sub-Components

#### 1. TestimonialsHeader

**Location**: `src/features/home/testimonials/components/testimonials-header.tsx`

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
- Title: "What Our Customers Say"
- Description: "Don't just take our word for it. Here's what our satisfied customers have to say about our handcrafted furniture."

#### 2. TestimonialCard

**Location**: `src/features/home/testimonials/components/testimonial-card.tsx`

**Purpose**: Renders individual testimonial cards with quote, profile image, name, and role.

**Props**:
```typescript
interface TestimonialCardProps {
  img: string;
  name: string;
  role: string;
  quote: string;
}
```

**Features**:
- Flexbox layout ensuring author info stays at bottom
- Next.js Image optimization for profile pictures
- Quote text with proper typography
- Profile image, name, and role at bottom
- Hover effects
- Dark mode support
- Consistent card height

**Layout Structure**:
- **Card Container**: Flex column layout (`flex flex-col`)
- **Quote Section**: Takes available space (`grow`) at top
- **Author Section**: Pushed to bottom (`mt-auto`) with image and info

**Styling**:
- Border: `border-gray-950/[.1]` (light), `border-gray-50/[.1]` (dark)
- Background: `bg-gray-950/[.01]` (light), `bg-gray-50/[.10]` (dark)
- Hover: Background opacity increases on hover
- Rounded corners: `rounded-xl`
- Padding: `p-6`
- Width: `w-80` (320px)

**Typography**:
- Quote: `text-base italic` with proper quote marks (`&ldquo;` and `&rdquo;`)
- Name: `text-sm font-semibold`
- Role: `text-xs font-medium`

#### 3. TestimonialsMarquee

**Location**: `src/features/home/testimonials/components/testimonials-marquee.tsx`

**Purpose**: Wraps the Marquee component and renders testimonial cards in an infinite scroll.

**Props**:
```typescript
interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
}
```

**Features**:
- Single horizontal marquee (not multiple rows)
- Pause on hover functionality
- Gradient fade edges
- Custom duration (40s for slower speed)
- Responsive container

**Marquee Configuration**:
- `pauseOnHover`: `true` - Animation pauses when hovering
- `className`: `[--duration:40s]` - Custom animation duration
- Gradient overlays on left and right edges for fade effect

**Gradient Overlays**:
- Left edge: `w-1/4 bg-gradient-to-r` (fades from background)
- Right edge: `w-1/4 bg-gradient-to-l` (fades to background)
- `pointer-events-none` to allow interaction with cards

#### 4. TestimonialsData

**Location**: `src/features/home/testimonials/components/testimonials-data.ts`

**Purpose**: Contains testimonial data and TypeScript interfaces.

**Exports**:
- `Testimonial` interface
- `testimonials` array (6 testimonials)

**Testimonial Interface**:
```typescript
export interface Testimonial {
  img: string;
  name: string;
  role: string;
  quote: string;
}
```

**Testimonials List**:
1. **Carlos Mendoza** (Homeowner)
   - Quote about design and quality craftsmanship

2. **Maria Santos** (Interior Designer)
   - Quote about attention to detail and craftsmanship

3. **Roberto Cruz** (Business Owner)
   - Quote about office furniture transformation

4. **Ana Garcia** (Restaurant Owner)
   - Quote about dining sets exceeding expectations

5. **Miguel Torres** (Hotel Manager)
   - Quote about consistency and timeless design

6. **Sofia Reyes** (Architect)
   - Quote about form and function

**Image URLs**:
- Uses Unsplash images with optimized parameters
- Format: `https://images.unsplash.com/photo-[ID]?w=100&h=100&fit=crop`
- All images are 100x100px with crop fit for profile pictures

## Design Features

### Layout

- **Section Padding**: `py-24` (vertical), `px-4 sm:px-6 lg:px-8` (horizontal)
- **Max Width**: `max-w-7xl` (1280px)
- **Background**: `bg-gray-50 dark:bg-gray-900`
- **Card Width**: `w-80` (320px)
- **Card Padding**: `p-6` (24px)

### Typography

- **Header Title**: `text-4xl font-bold` (mobile), `sm:text-5xl` (desktop)
- **Header Description**: `text-lg` with max-width constraint
- **Quote Text**: `text-base italic` with proper quote marks
- **Name**: `text-sm font-semibold`
- **Role**: `text-xs font-medium`

### Colors

- **Quote Text**: `text-gray-700 dark:text-gray-300`
- **Name**: `dark:text-white` (light mode uses default)
- **Role**: `text-gray-600 dark:text-gray-400`
- **Card Background**: `bg-gray-950/[.01]` (light), `bg-gray-50/[.10]` (dark)
- **Card Border**: `border-gray-950/[.1]` (light), `border-gray-50/[.1]` (dark)
- **Hover Background**: Increased opacity on hover

### Animations

1. **Header Animation**:
   - Fade in from bottom
   - Staggered text elements
   - Triggers once when scrolled into view

2. **Marquee Animation**:
   - Continuous horizontal scroll
   - Duration: 40 seconds (slow, elegant speed)
   - Pauses on hover
   - Infinite loop

3. **Card Hover Effects**:
   - Background opacity increases
   - Smooth transition

## Usage

### Basic Usage

```tsx
import { Testimonials } from "./_components/testimonials";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Testimonials />
      <Contact />
    </>
  );
}
```

### Customization

#### Adding New Testimonials

Edit `testimonials-data.ts`:

```tsx
export const testimonials: Testimonial[] = [
  // ... existing testimonials
  {
    img: "https://images.unsplash.com/photo-[ID]?w=100&h=100&fit=crop",
    name: "Customer Name",
    role: "Customer Role",
    quote: "Customer testimonial quote here.",
  },
];
```

#### Modifying Header Content

Edit `testimonials-header.tsx`:

```tsx
<h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
  Your Custom Title
</h2>
<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
  Your custom description here.
</p>
```

#### Adjusting Marquee Speed

Edit `testimonials-marquee.tsx`:

```tsx
// Slower (60 seconds)
<Marquee pauseOnHover className="[--duration:60s]">

// Faster (20 seconds)
<Marquee pauseOnHover className="[--duration:20s]">
```

#### Customizing Card Appearance

Edit `testimonial-card.tsx`:

```tsx
// Change card width
className="relative flex flex-col h-full w-96 cursor-pointer..."

// Change padding
className="... p-8"

// Change border radius
className="... rounded-2xl"
```

#### Disabling Pause on Hover

Edit `testimonials-marquee.tsx`:

```tsx
<Marquee className="[--duration:40s]">
  {/* Remove pauseOnHover prop */}
</Marquee>
```

## Props and Interfaces

### TestimonialCardProps

```typescript
interface TestimonialCardProps {
  img: string;
  name: string;
  role: string;
  quote: string;
}
```

### TestimonialsMarqueeProps

```typescript
interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
}
```

### Testimonial

```typescript
export interface Testimonial {
  img: string;
  name: string;
  role: string;
  quote: string;
}
```

## Dependencies

- **@magicui/marquee**: Marquee component from Magic UI (installed via shadcn)
- **framer-motion**: For header animations
- **next/image**: For optimized image loading
- **tailwindcss**: For styling and responsive design
- **lucide-react**: Not used directly but available for icons

## Performance Considerations

1. **Image Optimization**: Uses Next.js Image component with proper sizing (48px for profile pictures)
2. **Lazy Loading**: Images load as they enter viewport
3. **CSS Animations**: Marquee uses CSS animations (hardware accelerated)
4. **Single Marquee**: Only one marquee instance reduces DOM complexity
5. **Component Splitting**: Sub-components allow for code splitting

## Responsive Behavior

### Mobile (< 640px)
- Full-width cards
- Reduced padding
- Gradient overlays maintain visibility

### Tablet (640px - 1024px)
- Medium padding
- Optimized spacing
- Cards maintain consistent width

### Desktop (> 1024px)
- Maximum content width (1280px)
- Generous spacing
- Smooth scrolling animation

## Accessibility

- Semantic HTML (`<section>`, `<figure>`, `<blockquote>`, `<figcaption>`)
- Alt text for images (via Next.js Image)
- Keyboard navigation support
- Screen reader friendly text
- Proper contrast ratios
- Pause on hover allows users to read testimonials
- Proper quote marks using HTML entities (`&ldquo;` and `&rdquo;`)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS animations support
- Requires JavaScript for animations
- Works with reduced motion preferences (respects `prefers-reduced-motion`)

## Marquee Component Details

### Magic UI Marquee

The component uses Magic UI's Marquee component which provides:
- Infinite scrolling animation
- Pause on hover functionality
- Customizable duration via CSS variables
- Vertical and horizontal modes
- Configurable repeat count

### Animation Configuration

- **Duration**: Controlled via `[--duration:40s]` CSS variable
- **Direction**: Horizontal (default)
- **Repeat**: 4 times (default, can be customized)
- **Pause**: Enabled on hover

## Future Enhancements

Potential improvements:
- [ ] Add testimonial filtering by role/category
- [ ] Implement testimonial detail modal
- [ ] Add testimonial rating/stars
- [ ] Implement testimonial submission form
- [ ] Add testimonial date/timestamp
- [ ] Create testimonial carousel variant
- [ ] Add testimonial video support
- [ ] Implement testimonial search functionality
- [ ] Add testimonial categories/tags
- [ ] Create testimonial admin panel

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Hero Implementation](./00-hero-implementation.md)
- [Projects Implementation](./01-projects-implementation.md)
- [About Implementation](./02-about-implementation.md)
- [Magic UI Marquee Documentation](https://magicui.design/docs/components/marquee)

## Troubleshooting

### Marquee Not Animating

1. **CSS Animations**: Verify marquee animations are defined in `globals.css`
2. **Duration**: Check if `[--duration:40s]` is properly set
3. **Browser Support**: Ensure browser supports CSS animations

### Cards Not Aligned at Bottom

1. **Flex Layout**: Verify card has `flex flex-col`
2. **Grow Class**: Ensure quote has `grow` class
3. **Auto Margin**: Verify author section has `mt-auto`

### Images Not Loading

1. **Image URLs**: Verify URLs are accessible
2. **Next.js Config**: Ensure `images.remotePatterns` includes Unsplash domain
3. **Image Format**: Verify image format is supported

### Marquee Too Fast/Slow

1. **Duration**: Adjust `[--duration:40s]` value
2. **Higher value** = Slower animation
3. **Lower value** = Faster animation

## Example: Adding a New Testimonial

```tsx
// 1. Add to testimonials-data.ts
export const testimonials: Testimonial[] = [
  // ... existing testimonials
  {
    img: "https://images.unsplash.com/photo-1234567890?w=100&h=100&fit=crop",
    name: "New Customer",
    role: "Customer Role",
    quote: "This is a great testimonial about the furniture.",
  },
];

// 2. The marquee will automatically include the new testimonial
// No other changes needed!
```

## Code Examples

### Custom Card Variant

```tsx
// Create a custom card variant
export function CustomTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="custom-card-styles">
      <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <div className="author-section">
        <img src={testimonial.img} alt={testimonial.name} />
        <div>
          <h3>{testimonial.name}</h3>
          <p>{testimonial.role}</p>
        </div>
      </div>
    </figure>
  );
}
```

### Vertical Marquee

```tsx
// Create vertical scrolling marquee
<Marquee pauseOnHover vertical className="[--duration:40s]">
  {testimonials.map((testimonial) => (
    <TestimonialCard key={testimonial.name} {...testimonial} />
  ))}
</Marquee>
```

### Reverse Direction Marquee

```tsx
// Scroll in reverse direction
<Marquee pauseOnHover reverse className="[--duration:40s]">
  {testimonials.map((testimonial) => (
    <TestimonialCard key={testimonial.name} {...testimonial} />
  ))}
</Marquee>
```

This documentation provides a comprehensive guide for understanding, maintaining, and extending the Testimonials feature.

