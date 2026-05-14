# Projects/Gallery Feature Implementation

## Overview

The Projects feature showcases Cebu Furniture Maker products in a responsive, tab-filtered gallery. It displays clickable image cards for product sets, showroom collections, and fabrication site suites. Each project supports a primary image plus an ordered image carousel, a public modal overview, and a dedicated detail page.

The public gallery reads database-backed editable projects first and falls back to `src/lib/default-site-content.ts` when the database is empty or unavailable.

## Architecture

```txt
src/
|-- app/
|   |-- (landing-page)/
|   |   `-- _components/
|   |       `-- projects.tsx
|   `-- projects/
|       `-- [slug]/
|           `-- page.tsx
|-- components/
|   `-- shadcn-space/
|       `-- blocks/
|           `-- cta-01/
|               `-- cta.tsx
`-- features/
    `-- home/
        `-- projects/
            `-- components/
                |-- project-detail-dialog.tsx
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

- Loads published projects through `getPublicProjects`.
- Normalizes database rows and fallback projects into the shared `Product` UI shape.
- Composes `ProjectsClient`.
- Adds the `id="projects"` section anchor used by navigation.

Current default tab: first available project group.

### `projects-tabs.tsx`

Location: `src/features/home/projects/components/projects-tabs.tsx`

Responsibilities:

- Renders the available gallery groups with the shared `Tabs` UI component.
- Receives `activeTab` and `onTabChange` from the page-level component.
- Maps database group values to readable display labels:
  - `products` -> Products
  - `showroom` -> Showroom
  - `fabrication_site` -> Fabrication Site

### `projects-grid.tsx`

Location: `src/features/home/projects/components/projects-grid.tsx`

Responsibilities:

- Renders the responsive card grid.
- Shows an empty state when no products exist for the selected tab.
- Passes each product into `ProjectCard`.
- Opens the project detail modal when a card is clicked.

Grid layout:

```tsx
className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
```

### `project-card.tsx`

Location: `src/features/home/projects/components/project-card.tsx`

Responsibilities:

- Renders an individual clickable product image card with title, description, and category.
- Uses Next.js image optimization.
- Applies hover and entrance animation effects.

### `project-detail-dialog.tsx`

Location: `src/features/home/projects/components/project-detail-dialog.tsx`

Responsibilities:

- Renders the project popout/modal through Radix Dialog.
- Displays the project image carousel.
- Shows thumbnail boxes that jump directly to a selected image.
- Shows project overview, category, and project type in an aligned details panel.
- Links to `/projects/[slug]` through the `View More Details` action.

### `app/projects/[slug]/page.tsx`

Responsibilities:

- Reads a single published project by slug through `getPublicProjectBySlug`.
- Falls back to the matching default project when the database is unavailable.
- Shows all project images, overview/details, category, and project type.
- Renders the `cta-01` shadcn-space style call-to-action before the shared site footer.

### `projects-data.ts`

Location: `src/features/home/projects/components/projects-data.ts`

Responsibilities:

- Exports the `ProductType` union.
- Exports the `Product` interface.
- Exports the current default `furnitureProducts` list.

Current UI type:

```ts
export interface Product {
  slug: string;
  image: string;
  imageAlt: string;
  images: {
    url: string;
    alt: string;
  }[];
  title: string;
  description: string;
  category: string;
  group: string;
  groupLabel: string;
}
```

Current default groups:

- `Set`: Modern Sofa Set, Coffee Table Set, Dining Chair Set, End Table Set, Outdoor Patio Set, Bar Stool Set.
- `Collection`: Dining Table Collection, Accent Chair Collection, Wall Unit Collection, Console Table Collection, Bookshelf Collection, Sideboard Collection, Occasional Table Collection.
- `Suites`: Master Bedroom Suite, Executive Office Suite, Guest Bedroom Suite, Teen Bedroom Suite, Study Room Suite, Master Bedroom Luxury Suite.

## Editable Admin Impact

Implemented behavior:

- Public reads query Supabase first.
- If Supabase has no published project rows, the public gallery uses the default products from `src/lib/default-site-content.ts`.
- Admin project forms show database rows when they exist and read-only default rows while the database is empty.
- Uploaded project images are stored in Vercel Blob and referenced by asset records.
- Multiple project images are attached through the existing `project_assets` join table.
- Project create/edit forms accept multiple image files and an editor-provided alt text through labeled admin controls.
- Editors can remove attached project images from the project row without deleting the underlying asset record.
- Public project tabs map database groups to stable admin-friendly values:
  - `products`
  - `showroom`
  - `fabrication_site`

The implementation should keep a compatibility adapter so the public UI can keep its current tab labels while the database uses stable snake_case values.

## Dependencies

- `framer-motion` for animations.
- `next/image` for optimized image rendering.
- `@radix-ui/react-dialog` for the project overview modal.
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
