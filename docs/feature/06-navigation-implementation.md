# Navigation Implementation Documentation

## Overview

This document describes the navigation system implementation for the Cebu Furniture Maker landing page. The navigation features a sticky header with smooth animations, logo transitions, and a full-screen mobile menu.

## Architecture

Following the component architecture rules, the navigation is structured as:

```
src/
├── app/(landing-page)/
│   └── _components/
│       └── navigation.tsx              # Main navigation component
│
└── features/navigation/header/
    └── components/
        ├── navigation-brand.tsx        # Logo component
        ├── navigation-item.tsx         # Individual nav item
        ├── navigation-items.tsx        # Nav items container
        ├── navigation-mobile-menu.tsx  # Mobile menu
        ├── navigation-data.ts          # Navigation data
        └── index.ts                    # Exports
```

## Components

### 1. Navigation (Main Component)

**Location**: `src/app/(landing-page)/_components/navigation.tsx`

**Features**:
- Sticky navigation bar (always visible)
- Dynamic background opacity based on scroll position
- Scroll direction detection for logo animation control
- Responsive design with mobile menu

**Key Behaviors**:
- **Scroll threshold**: Changes appearance at 100px scroll
- **Background**: Transparent over hero, opaque white/dark when scrolled
- **Z-index**: `z-[100]` (navigation bar)

### 2. Navigation Brand

**Location**: `src/features/navigation/header/components/navigation-brand.tsx`

**Features**:
- Logo appears in navigation when scrolled past hero section
- Uses `layoutId="logo"` for smooth transition from hero logo
- Animates in when scrolling down, appears instantly when scrolling up
- Clicking scrolls to top of page

**Animation Logic**:
- When `scrollDirection === "down"`: Logo animates in with scale/opacity
- When `scrollDirection === "up"`: Logo appears instantly (no animation)

### 3. Navigation Items

**Location**: `src/features/navigation/header/components/navigation-items.tsx`

**Features**:
- Active section detection based on scroll position
- Automatically highlights current section
- Works for both desktop and mobile

**Active Section Detection**:
- Checks scroll position with 100px offset (for sticky nav)
- Finds current section by checking from bottom to top
- Updates active state on scroll

### 4. Navigation Item

**Location**: `src/features/navigation/header/components/navigation-item.tsx`

**Features**:
- Smooth scroll to section on click
- Different indicators for desktop vs mobile
- Adapts text color based on scroll position

**Indicators**:
- **Desktop**: Animated underline that expands on hover/active
- **Mobile**: Dot indicator (●) before label for active items

**Smooth Scroll**:
- Accounts for sticky nav height (80px offset)
- Uses `behavior: "smooth"` for smooth scrolling

### 5. Mobile Menu

**Location**: `src/features/navigation/header/components/navigation-mobile-menu.tsx`

**Features**:
- Full-screen overlay when open (covers entire viewport)
- Prevents body scroll when open
- Animated hamburger/X icon toggle
- Logo and navigation items displayed
- Design inspired by shadcn/studio

**Z-index Hierarchy**:
- Mobile menu: `z-[200]` (highest, covers everything)
- Navigation bar: `z-[100]`
- Hero logo: `z-[50]` (below mobile menu)

**Behavior**:
- Opens/closes with smooth fade animation
- Body scroll locked when open
- Close button in header
- Clicking nav item closes menu

## Logo Transition System

### Hero Logo → Navigation Logo

The logo smoothly transitions from the hero section to the navigation bar using Framer Motion's `layoutId`:

1. **Hero Logo** (`hero-logo.tsx`):
   - Positioned on left side of hero section
   - Fades out between 50-150px scroll
   - Uses `layoutId="logo"` for transition
   - Z-index: `z-[50]`

2. **Navigation Logo** (`navigation-brand.tsx`):
   - Appears when `isScrolled === true` (after 100px scroll)
   - Uses same `layoutId="logo"` for smooth transition
   - Animates in when scrolling down
   - Appears instantly when scrolling up

### Animation Behavior

- **Scrolling Down**: Logo animates from hero to nav position
- **Scrolling Up**: Logo appears instantly in nav (no animation)
- **Initial Load**: Hero logo animates in with fade and slide

## Responsive Design

### Desktop (lg and above)
- Navigation items displayed horizontally
- Underline indicator for active items
- Logo appears in navigation when scrolled

### Mobile/Tablet (below lg)
- Hamburger menu button
- Full-screen menu overlay
- Dot indicator for active items
- Logo displayed in menu header

## Z-Index Hierarchy

```
z-[200]  - Mobile menu (when open)
z-[110]  - (Reserved for future use)
z-[103]  - Navigation items container
z-[102]  - Navigation brand
z-[101]  - Navigation content wrapper
z-[100]  - Navigation bar
z-[50]   - Hero logo
z-[10]   - Hero content
```

## Scroll Thresholds

- **100px**: Navigation background changes, logo appears in nav
- **50-150px**: Hero logo fades out
- **0-300px**: Hero content fades out
- **0-500px**: Hero background parallax effect

## Section IDs

All page sections must have matching IDs for navigation to work:

- `#hero` - Hero section
- `#about` - About section
- `#projects` - Projects section
- `#testimonials` - Testimonials section
- `#contact` - Contact section

## Usage Example

```tsx
// In layout.tsx
import { Navigation } from "./_components/navigation";

export default function Layout({ children }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
```

## Animation Details

### Logo SVG Assemble Animation

The logo features a complete SVG assemble animation where:
- Each element animates in sequence
- Stroke elements use `pathLength` animation (drawing effect)
- Filled elements use `scale` animation (pop-in effect)
- Text elements fade in from below
- Total animation duration: ~2 seconds

### Navigation Animations

- **Mount**: Navigation slides down from top (0.5s)
- **Background**: Smooth opacity transition (300ms)
- **Logo**: Scale and opacity animation (400ms when scrolling down)
- **Items**: Fade in on mount (300ms)
- **Mobile Menu**: Fade in overlay (200ms)

## Accessibility

- Proper ARIA labels on buttons
- Keyboard navigation support
- Focus states on interactive elements
- Semantic HTML structure

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Smooth scroll behavior support
- CSS custom properties (CSS variables)

## Performance Considerations

- Scroll event throttled by Framer Motion's `useMotionValueEvent`
- Animations use GPU-accelerated properties (transform, opacity)
- Logo animation only runs on mount, not on every scroll
- Mobile menu prevents body scroll to avoid layout shifts

