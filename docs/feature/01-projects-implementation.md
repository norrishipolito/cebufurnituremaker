# Projects/Gallery Feature Implementation

## Overview

The Projects feature showcases Cebu Furniture Maker products in a responsive, tab-filtered gallery. It displays image cards for product sets, showroom collections, and fabrication site suites. The main page-level component lives in `app/(landing-page)/_components`, while reusable sub-components and default product data live under `features/home/projects/components`.

This feature is currently static, but it is one of the primary surfaces that will move to database-backed editable content in the admin implementation.

## Architecture

```txt
src/
|-- app/
|   `-- (landing-page)/
|       `-- _components/
|           `-- projects.tsx
`-- features/
    `-- home/
        `-- projects/
            `-- components/
                |-- projects-header.tsx
                |-- projects-tabs.tsx
                |-- projects-grid.tsx
                |-- project-card.tsx
                |-- projects-data.ts
                `-- index.ts
```

## Component Breakdown

### `projects.tsx`

Location: `src/app/(landing-page)/_components/projects.tsx`

Responsibilities:

- Owns the active tab state with `useState<ProductType>`.
- Filters `furnitureProducts` with `useMemo`.
- Composes `ProjectsHeader`, `ProjectsTabs`, and `ProjectsGrid`.
- Adds the `id="projects"` section anchor used by navigation.

Current default tab: `Set`.

### `projects-tabs.tsx`

Location: `src/features/home/projects/components/projects-tabs.tsx`

Responsibilities:

- Renders the three gallery tabs with the shared `Tabs` UI component.
- Receives `activeTab` and `onTabChange` from the page-level component.
- Maps display labels to the current data types:
  - `Set` -> Products
  - `Collection` -> Showroom
  - `Suites` -> Fabrication Site

### `projects-grid.tsx`

Location: `src/features/home/projects/components/projects-grid.tsx`

Responsibilities:

- Renders the responsive card grid.
- Shows an empty state when no products exist for the selected tab.
- Passes each product into `ProjectCard`.

Grid layout:

```tsx
className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
```

### `project-card.tsx`

Location: `src/features/home/projects/components/project-card.tsx`

Responsibilities:

- Renders an individual product image, title, description, and category.
- Uses Next.js image optimization.
- Applies hover and entrance animation effects.

### `projects-data.ts`

Location: `src/features/home/projects/components/projects-data.ts`

Responsibilities:

- Exports the `ProductType` union.
- Exports the `Product` interface.
- Exports the current default `furnitureProducts` list.

Current types:

```ts
export type ProductType = "Set" | "Collection" | "Suites";

export interface Product {
  image: string;
  title: string;
  description: string;
  category: string;
  type: ProductType;
}
```

Current default groups:

- `Set`: Modern Sofa Set, Coffee Table Set, Dining Chair Set, End Table Set, Outdoor Patio Set, Bar Stool Set.
- `Collection`: Dining Table Collection, Accent Chair Collection, Wall Unit Collection, Console Table Collection, Bookshelf Collection, Sideboard Collection, Occasional Table Collection.
- `Suites`: Master Bedroom Suite, Executive Office Suite, Guest Bedroom Suite, Teen Bedroom Suite, Study Room Suite, Master Bedroom Luxury Suite.

## Editable Admin Impact

When the editable admin is implemented, the current static product data should become the runtime fallback content for an empty database.

Planned behavior:

- Public reads query Supabase first.
- If Supabase has no published project rows, the public gallery uses the default products from `src/lib/default-site-content.ts`.
- Admin project forms prefill from database rows when they exist.
- If the database is empty, admin forms can seed or upsert content based on the defaults.
- Uploaded project images are stored in Vercel Blob and referenced by asset records.
- Public project tabs map database groups to stable admin-friendly values:
  - `products`
  - `showroom`
  - `fabrication_site`

The implementation should keep a compatibility adapter so the public UI can keep its current tab labels while the database uses stable snake_case values.

## Dependencies

- `framer-motion` for animations.
- `next/image` for optimized image rendering.
- `@/components/ui/tabs` for the tab control.
- Tailwind CSS for layout and styling.

## Accessibility

- The section uses a stable `id="projects"` anchor for navigation.
- Tabs should remain keyboard-accessible through the shared Tabs component.
- Project images should use meaningful alt text once editable assets are introduced.
- Empty states should be readable by assistive technologies.

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Editable Admin Implementation](./07-editable-admin-implementation.md)
