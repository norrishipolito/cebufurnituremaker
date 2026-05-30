# Projects/Gallery Feature Implementation

## Overview

The Projects feature showcases Cebu Furniture Maker work in a responsive single-grid gallery. It displays clickable image cards for all published projects in one `Projects` collection. Each project supports a primary image plus an ordered image carousel, a public modal overview, and a dedicated detail page.

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
                |-- project-navigation-pending.tsx
                |-- projects-header.tsx
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

The public Projects section no longer renders tabs or project type/group labels. All published rows appear in one polished grid.

### `projects-grid.tsx`

Location: `src/features/home/projects/components/projects-grid.tsx`

Responsibilities:

- Renders the responsive card grid.
- Shows an empty state when no public projects exist.
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
- Matches the testimonial card border color so the public section language stays consistent.

### `project-detail-dialog.tsx`

Location: `src/features/home/projects/components/project-detail-dialog.tsx`

Responsibilities:

- Renders the project popout/modal through Radix Dialog.
- Displays the project image carousel.
- Shows thumbnail boxes that jump directly to a selected image.
- Shows project overview, category, and image count in an aligned details panel.
- Closes the controlled Radix Dialog through dialog-owned behavior before routing to `/projects/[slug]` on the next animation frame.
- Hands the closing dialog off to a lightweight modal-shaped pending shell so slow detail navigation shows clear progress instead of an exposed blank intermediate state.
- Leaves browser Back scroll restoration intact so returning visitors remain near the Projects section and can immediately reopen cards.

### `project-navigation-pending.tsx`

Location: `src/features/home/projects/components/project-navigation-pending.tsx`

Responsibilities:

- Preserves the modal-shaped visual surface while a project detail route is opening.
- Shows a small spinner, the selected project title, and concise status text.
- Avoids rendering a second carousel or requesting duplicate images during navigation.
- Allows the Radix Dialog to close internally first so its modal interaction lock is released before routing.

### `app/projects/[slug]/page.tsx`

Responsibilities:

- Reads a single published project by slug through `getPublicProjectBySlug`.
- Falls back to the matching default project when the database is unavailable.
- Uses one-hour ISR caching and is invalidated with the public homepage after editor mutations.
- Exposes a route-level `loading.tsx` skeleton so slow dynamic navigation has an immediate partial loading boundary.
- Shows all project images, overview/details, category, and image count.
- Preloads the above-the-fold active image while gallery and grid images remain lazy.
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
  group?: string;
  groupLabel?: string;
}
```

`group` and `groupLabel` remain optional compatibility fields in older static data but are not used by the public UI.

## Editable Admin Impact

Implemented behavior:

- Public reads query Supabase first.
- If Supabase has no published project rows, the public gallery uses the default products from `src/lib/default-site-content.ts`.
- Admin project forms show database rows when they exist and read-only default rows while the database is empty.
- Uploaded project images are stored in Vercel Blob and referenced by asset records.
- Saved asset URLs resolve through one shared compatibility helper: stored absolute URLs remain direct, while private or legacy records use `/api/blob/...`.
- Multiple project images are attached through the existing `project_assets` join table.
- Project create/edit forms accept multiple image files and an editor-provided alt text through labeled admin controls.
- Editors can remove attached project images from the project row without deleting the underlying asset record.
- Public project grouping/type controls are retired. The existing `projects.group` column remains as an internal compatibility field and new writes should default it to `projects`.

## Dependencies

- `framer-motion` for animations.
- `next/image` for optimized image rendering.
- `@radix-ui/react-dialog` for the project overview modal.
- Tailwind CSS for layout and styling.

## Research Basis

- Next.js App Router `useRouter`: https://nextjs.org/docs/app/api-reference/functions/use-router
- Next.js App Router prefetching: https://nextjs.org/docs/app/guides/prefetching
- Radix Dialog: https://www.radix-ui.com/primitives/docs/components/dialog

## Accessibility

- The section uses a stable `id="projects"` anchor for navigation.
- Project cards are buttons that open a keyboard-accessible Radix Dialog preview.
- Project images should use meaningful alt text once editable assets are introduced.
- Empty states should be readable by assistive technologies.
- Project card interactions should recover after browser back/forward navigation from detail pages.
- Project card interactions should also recover after returning from another page, using the header Projects navigation, and opening a card.

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Editable Admin Implementation](./07-editable-admin-implementation.md)
