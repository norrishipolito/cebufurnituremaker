# Application Architecture Plan

## Overview

This document outlines the architectural revamp plan for the Cebu Furniture Maker application. The goal is to establish a scalable, maintainable structure that separates concerns and follows Next.js App Router best practices.

## Current State

### Files to Remove

- `src/app/page.tsx` - Default Next.js starter template
- `src/app/layout.tsx` - Will be restructured (root layout will remain but moved to appropriate location)

## Target Architecture

### Directory Structure

```
src/
├── app/
│   └── (landing-page)/              # Route group for landing page
│       ├── _components/             # Page-specific components
│       │   ├── hero.tsx
│       │   ├── about.tsx
│       │   ├── contact.tsx
│       │   └── projects.tsx
│       ├── layout.tsx               # Layout for landing page
│       └── page.tsx                 # Landing page entry point
│
├── common/
│   └── layouts/                     # Shared layout components
│       └── [layout-components].tsx
│
├── features/                        # Feature-based modules
│   ├── navigation/
│   │   └── components/              # Navigation-specific components
│   │       └── [navigation-components].tsx
│   ├── about/
│   │   └── components/              # About feature components
│   │       └── [about-components].tsx
│   └── [other-features]/
│       └── components/
│
└── components/
    └── ui/                          # shadcn/ui components
        └── [shadcn-components]/
```

## Architecture Principles

### 1. Route Groups (`app/(landing-page)`)

- Uses Next.js route groups with parentheses `(landing-page)` to organize routes without affecting URL structure
- Allows for shared layouts and components specific to the landing page
- Provides a clear namespace for landing page related code

### 2. Page Components (`app/(landing-page)/_components`)

- Components prefixed with `_` to indicate they are private to the route group
- Each major section gets its own component:
  - `hero.tsx` - Hero section component
  - `about.tsx` - About section component
  - `contact.tsx` - Contact section component
  - `projects.tsx` - Projects/portfolio section component
- These components are scoped to the landing page and not shared across routes

### 3. Landing Page Layout (`app/(landing-page)/layout.tsx`)

- Defines the layout structure for the landing page
- Each component section should cover full height and width
- Handles spacing, scrolling behavior, and section transitions
- May include shared elements like navigation, footer, etc.

### 4. Common Layouts (`src/common/layouts`)

- Reusable layout components that can be shared across different routes
- Examples: `MainLayout`, `AuthLayout`, `DashboardLayout`
- Contains structural elements that are not route-specific

### 5. Feature-Based Modules (`src/features`)

- Organizes code by feature/domain rather than by technical layer
- Each feature has its own `components/` subdirectory
- Examples:
  - `navigation/` - Navigation bar, mobile menu, etc.
  - `about/` - About section logic, data fetching, etc.
- Promotes code cohesion and makes features easier to locate and maintain

### 6. UI Components (`src/components/ui`)

- Dedicated directory for shadcn/ui components
- Follows shadcn/ui conventions for component structure
- Contains reusable, styled UI primitives (buttons, cards, inputs, etc.)

## Layout Requirements

### Landing Page Layout Specifications

- **Full Height Sections**: Each component section (hero, about, contact, projects) should occupy full viewport height
- **Full Width**: Components should span the full width of the viewport
- **Section Transitions**: Smooth scrolling between sections
- **Responsive Design**: Layout should adapt to different screen sizes

## Migration Steps

1. **Create Directory Structure**

   - Create `app/(landing-page)` route group
   - Create `app/(landing-page)/_components` directory
   - Create `src/common/layouts` directory
   - Create `src/features` directory with initial feature folders
   - Create `src/components/ui` directory

2. **Move and Restructure Root Layout**

   - Keep root `app/layout.tsx` for global providers, fonts, and metadata
   - Create `app/(landing-page)/layout.tsx` for landing page specific layout

3. **Create Landing Page Components**

   - Extract hero section into `hero.tsx`
   - Extract about section into `about.tsx`
   - Extract contact section into `contact.tsx`
   - Extract projects section into `projects.tsx`

4. **Set Up Feature Modules**

   - Create `features/navigation` with components subdirectory
   - Create `features/about` with components subdirectory
   - Add other features as needed

5. **Initialize shadcn/ui**

   - Set up shadcn/ui configuration
   - Create `components/ui` directory structure
   - Install initial UI components as needed

6. **Remove Starter Files**
   - Delete default `app/page.tsx` content
   - Clean up any unused starter assets

## Benefits of This Architecture

1. **Scalability**: Easy to add new routes and features without cluttering
2. **Maintainability**: Clear separation of concerns and logical grouping
3. **Reusability**: Common layouts and UI components can be shared
4. **Feature Isolation**: Features are self-contained and easier to test
5. **Next.js Best Practices**: Follows App Router conventions and patterns
6. **Team Collaboration**: Clear structure makes it easier for multiple developers to work on different features

## Component Architecture Rules

**IMPORTANT**: All component implementations must follow the rules defined in [Component Architecture Rules](./01-component-architecture-rules.md).

Key principle: **Page layout components belong in `_components/`, while reusable feature sub-components belong in `features/`.**

## Next Steps

After this architecture is implemented:

- Set up shadcn/ui component library
- Implement landing page sections
- Add feature-specific components
- Set up shared layouts
- Configure styling and theming
- Follow component architecture rules for all new implementations
