# Hero Feature Implementation

## Overview

The Hero feature is the main landing section of the Cebu Furniture Maker website. It features a parallax scrolling background image, animated content, and a footer bar with key features. The implementation follows the component architecture rules, with the main component in `_components/` and sub-components in `features/`.

## Architecture

### File Structure

```
src/
├── app/(landing-page)/
│   └── _components/
│       └── hero.tsx                    # Main Hero component (page layout)
│
└── features/home/hero/
    └── components/
        ├── hero-background.tsx         # Parallax background with image
        ├── hero-logo.tsx               # Brand logo component
        ├── hero-content.tsx            # Content wrapper
        ├── hero-heading.tsx             # Main heading
        ├── hero-tagline.tsx             # Tagline text
        ├── hero-footer-bar.tsx          # Footer bar container
        ├── hero-feature-item.tsx        # Reusable feature item
        └── index.ts                     # Component exports
```

## Component Breakdown

### Main Component: `hero.tsx`

**Location**: `src/app/(landing-page)/_components/hero.tsx`

**Purpose**: Orchestrates all hero sub-components and manages scroll-based animations.

**Responsibilities**:
- Manages scroll state using `useScroll` hook
- Creates transform values for parallax and fade effects
- Composes all sub-components into the final layout

**Key Features**:
- Parallax scrolling background
- Content fade and scale on scroll
- Full-height section layout

**Code Example**:
```tsx
"use client";

import { useScroll, useTransform } from "framer-motion";
import { HeroBackground } from "@/features/home/hero/components/hero-background";
import { HeroLogo } from "@/features/home/hero/components/hero-logo";
import { HeroContent } from "@/features/home/hero/components/hero-content";
import { HeroFooterBar } from "@/features/home/hero/components/hero-footer-bar";

export function Hero() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <HeroBackground backgroundY={backgroundY} />
      <HeroLogo />
      <HeroContent opacity={contentOpacity} scale={contentScale} />
      <HeroFooterBar />
    </section>
  );
}
```

### Sub-Components

#### 1. HeroBackground

**Location**: `src/features/home/hero/components/hero-background.tsx`

**Purpose**: Renders the parallax background image with gradient overlays.

**Props**:
- `backgroundY: MotionValue<number>` - Transform value for parallax effect

**Features**:
- Next.js Image optimization
- Gradient overlays for text readability
- Parallax scrolling effect
- Responsive image sizing

**Implementation Details**:
- Uses `motion.div` with `style={{ y: backgroundY }}` for parallax
- Image height set to 120% to allow parallax movement
- Multiple gradient overlays for visual depth

#### 2. HeroLogo

**Location**: `src/features/home/hero/components/hero-logo.tsx`

**Purpose**: Displays the brand logo at the top of the hero section.

**Features**:
- Fade-in animation on mount
- Centered positioning
- Responsive typography

**Animation**:
- Initial: `opacity: 0, y: -20`
- Animate: `opacity: 1, y: 0`
- Duration: 0.8s with easeOut

#### 3. HeroContent

**Location**: `src/features/home/hero/components/hero-content.tsx`

**Purpose**: Wraps the main heading and tagline with scroll-based effects.

**Props**:
- `opacity: MotionValue<number>` - Opacity transform for fade effect
- `scale: MotionValue<number>` - Scale transform for zoom effect

**Composition**:
- Contains `HeroHeading` component
- Contains `HeroTagline` component
- Applies scroll-based opacity and scale transforms

#### 4. HeroHeading

**Location**: `src/features/home/hero/components/hero-heading.tsx`

**Purpose**: Displays the main hero heading.

**Content**: "Design furniture for *spaces that breathe.*"

**Features**:
- Large, responsive typography (5xl to 8xl)
- Italic styling for "spaces that breathe"
- Fade-in animation with custom easing

**Animation**:
- Initial: `opacity: 0, y: 30`
- Animate: `opacity: 1, y: 0`
- Duration: 1s with custom easing `[0.22, 1, 0.36, 1]`

#### 5. HeroTagline

**Location**: `src/features/home/hero/components/hero-tagline.tsx`

**Purpose**: Displays the tagline below the heading.

**Content**: "Designed in Cebu, crafted to endure — timeless pieces for modern living."

**Features**:
- Responsive typography
- Delayed animation for sequential reveal
- Semi-transparent white text

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Delay: 0.3s
- Duration: 1s with custom easing

#### 6. HeroFooterBar

**Location**: `src/features/home/hero/components/hero-footer-bar.tsx`

**Purpose**: Displays key features in a footer bar at the bottom.

**Features**:
- Semi-transparent background with backdrop blur
- Three feature items (Free shipping, Delivery, Guarantee)
- Responsive layout (column on mobile, row on desktop)
- Staggered animations for each item

**Animation**:
- Container: Fade in with 0.6s delay
- Items: Staggered animations (0.8s, 0.9s, 1.0s delays)

#### 7. HeroFeatureItem

**Location**: `src/features/home/hero/components/hero-feature-item.tsx`

**Purpose**: Reusable component for displaying individual features.

**Props**:
- `icon: LucideIcon` - Icon component from lucide-react
- `text: string` - Feature text
- `initialX?: number` - Initial X position for animation (default: 0)
- `initialY?: number` - Initial Y position for animation (default: 0)
- `delay: number` - Animation delay

**Features**:
- Flexible animation directions
- Icon and text layout
- Responsive typography

## Animation Details

### Scroll-Based Animations

The hero section uses Framer Motion's `useScroll` and `useTransform` hooks for scroll-based animations:

1. **Background Parallax**:
   - Scroll range: `[0, 500]`
   - Transform range: `[0, 200]`
   - Effect: Background moves slower than content

2. **Content Fade**:
   - Scroll range: `[0, 300]`
   - Opacity range: `[1, 0]`
   - Effect: Content fades out as user scrolls

3. **Content Scale**:
   - Scroll range: `[0, 300]`
   - Scale range: `[1, 0.95]`
   - Effect: Content slightly shrinks on scroll

### Entrance Animations

All components use entrance animations with custom easing:

- **Easing Function**: `[0.22, 1, 0.36, 1]` (custom cubic bezier)
- **Staggered Delays**: Components animate in sequence
- **Smooth Transitions**: All animations use easeOut or custom easing

## Usage

### Basic Usage

```tsx
import { Hero } from "./_components/hero";

export default function LandingPage() {
  return (
    <>
      <Hero />
      {/* Other sections */}
    </>
  );
}
```

### Customization

#### Changing Background Image

Edit `hero-background.tsx`:

```tsx
<Image
  src="/images/your-image.jpg"  // Local image
  // or
  src="https://your-image-url.com/image.jpg"  // External URL
  alt="Your alt text"
  // ... other props
/>
```

#### Modifying Text Content

**Heading**: Edit `hero-heading.tsx`
```tsx
Design furniture for{" "}
<span className="italic font-normal">your custom text.</span>
```

**Tagline**: Edit `hero-tagline.tsx`
```tsx
Your custom tagline text here.
```

**Logo**: Edit `hero-logo.tsx`
```tsx
<h2 className="text-2xl font-bold tracking-wider text-white uppercase">
  Your Brand Name
</h2>
```

#### Adjusting Animation Speeds

Edit `hero.tsx` transform ranges:

```tsx
// Faster parallax
const backgroundY = useTransform(scrollY, [0, 500], [0, 300]);

// Slower fade
const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
```

#### Adding/Removing Features

Edit `hero-footer-bar.tsx`:

```tsx
<HeroFeatureItem
  icon={YourIcon}
  text="Your feature text"
  initialX={-20}
  delay={1.1}
/>
```

## Props and Interfaces

### HeroBackgroundProps

```typescript
interface HeroBackgroundProps {
  backgroundY: MotionValue<number>;
}
```

### HeroContentProps

```typescript
interface HeroContentProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}
```

### HeroFeatureItemProps

```typescript
interface HeroFeatureItemProps {
  icon: LucideIcon;
  text: string;
  initialX?: number;
  initialY?: number;
  delay: number;
}
```

## Dependencies

- **framer-motion**: For animations and scroll effects
- **next/image**: For optimized image loading
- **lucide-react**: For icons (Truck, Rocket, Shield)

## Performance Considerations

1. **Image Optimization**: Uses Next.js Image component with `priority` flag for above-the-fold content
2. **Lazy Animations**: Scroll-based animations only activate when needed
3. **Component Splitting**: Sub-components allow for code splitting
4. **Motion Values**: Uses Framer Motion's optimized transform values

## Accessibility

- Semantic HTML (`<section>`)
- Alt text for images
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly text

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid and Flexbox support
- Requires JavaScript for animations

## Future Enhancements

Potential improvements:
- [ ] Add video background option
- [ ] Implement intersection observer for better performance
- [ ] Add dark mode support
- [ ] Create animation presets
- [ ] Add configuration file for easy customization

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)

