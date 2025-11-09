# Component Architecture Rules

## Overview

This document defines the architectural rules for organizing components in the Cebu Furniture Maker application. These rules ensure consistency, maintainability, and clear separation of concerns across the codebase.

## Core Principle

**Page layout components belong in `_components/`, while reusable feature sub-components belong in `features/`.**

## Rule: Component Organization Pattern

### Structure

```
src/
├── app/(landing-page)/
│   ├── _components/
│   │   └── [component-name].tsx    # Main page layout component
│   └── page.tsx
│
└── features/[feature-name]/[component-name]/
    └── components/                  # Sub-components only
        ├── [sub-component-1].tsx
        ├── [sub-component-2].tsx
        └── index.ts                 # Exports
```

### Implementation Rules

#### 1. Main Component Location

- **Location**: `src/app/(route-group)/_components/[component-name].tsx`
- **Purpose**: Contains the main component logic and orchestrates sub-components
- **Responsibility**: Page-specific layout and composition

#### 2. Sub-Components Location

- **Location**: `src/features/[feature-name]/[component-name]/components/`
- **Purpose**: Contains reusable, maintainable sub-components
- **Responsibility**: Individual pieces of functionality that can be tested and maintained independently

#### 3. Import Pattern

- Main component in `_components/` imports sub-components from `@/features/[feature-name]/[component-name]/components/`
- Page imports main component from `./_components/[component-name]`

### Example: Hero Component

```
src/
├── app/(landing-page)/
│   ├── _components/
│   │   └── hero.tsx                    # Main Hero component
│   └── page.tsx                         # Imports from ./_components/hero
│
└── features/home/hero/
    └── components/
        ├── hero-background.tsx          # Sub-component
        ├── hero-logo.tsx                # Sub-component
        ├── hero-content.tsx             # Sub-component
        ├── hero-footer-bar.tsx          # Sub-component
        └── index.ts                     # Exports all sub-components
```

**hero.tsx** (in `_components/`):

```tsx
"use client";

import { useScroll, useTransform } from "framer-motion";
import { HeroBackground } from "@/features/home/hero/components/hero-background";
import { HeroLogo } from "@/features/home/hero/components/hero-logo";
import { HeroContent } from "@/features/home/hero/components/hero-content";
import { HeroFooterBar } from "@/features/home/hero/components/hero-footer-bar";

export function Hero() {
  // Main component logic
  return (
    <section>
      <HeroBackground />
      <HeroLogo />
      <HeroContent />
      <HeroFooterBar />
    </section>
  );
}
```

**page.tsx**:

```tsx
import { Hero } from "./_components/hero";

export default function LandingPage() {
  return <Hero />;
}
```

## Guidelines

### When to Create Sub-Components

Create sub-components in `features/` when:

- A component has multiple `motion.div` or complex nested structures
- A piece of functionality can be extracted and reused
- A component becomes too large (>100 lines)
- A component has clear, distinct responsibilities

### Component Naming Convention

- **Main components**: Use descriptive names (e.g., `hero.tsx`, `about.tsx`)
- **Sub-components**: Prefix with parent name (e.g., `hero-background.tsx`, `hero-logo.tsx`)
- **Feature directories**: Use kebab-case (e.g., `home/hero`, `navigation/header`)

### File Organization

1. **Main Component** (`_components/[name].tsx`):

   - Contains the main component export
   - Imports and orchestrates sub-components
   - Handles page-specific logic and state

2. **Sub-Components** (`features/[feature]/[component]/components/`):
   - Each file contains one focused component
   - Components are small, focused, and testable
   - Use `index.ts` to export all sub-components

### Benefits

1. **Maintainability**: Small, focused components are easier to understand and modify
2. **Reusability**: Sub-components can be reused across different pages
3. **Testability**: Individual components can be tested in isolation
4. **Separation of Concerns**: Clear distinction between page layout and feature logic
5. **Scalability**: Easy to add new features following the same pattern

## Migration Checklist

When refactoring an existing component:

- [ ] Identify sub-components that can be extracted
- [ ] Create `features/[feature]/[component]/components/` directory
- [ ] Move sub-components to features directory
- [ ] Update main component to import from features
- [ ] Ensure main component is in `_components/`
- [ ] Update page imports to use `_components/`
- [ ] Remove old component files
- [ ] Verify all imports are correct

## Anti-Patterns to Avoid

❌ **Don't**: Put main components in `features/` directory
❌ **Don't**: Put sub-components in `_components/` directory
❌ **Don't**: Mix page-specific logic with reusable feature logic
❌ **Don't**: Create deeply nested component structures (>3 levels)
❌ **Don't**: Put everything in one large component file

## Summary

- **Main components** → `app/(route)/_components/`
- **Sub-components** → `features/[feature]/[component]/components/`
- **Page imports** → From `_components/`
- **Main component imports** → From `@/features/.../components/`

This pattern ensures clean, maintainable, and scalable code organization.
