# Cebu Furniture Maker

A Next.js landing page for Cebu Furniture Maker, built with React, TypeScript, Tailwind CSS, and pnpm.

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime and package manager | Node.js `20.9.0+`, pnpm |
| App framework | Next.js App Router `16.2.5` |
| Language and UI | TypeScript `6`, React `19`, Tailwind CSS `4` |
| UI primitives | Radix UI, lucide-react, Framer Motion |
| Backend endpoints | Next.js route handlers under `src/app/api/` |
| Planned API layer for new features | tRPC |
| Authentication and roles | Supabase Auth with `admin` and `maintainer` roles |
| Database and ORM | Supabase Postgres, Drizzle ORM, `postgres` driver |
| Image storage | Vercel Blob |
| Validation | Zod |
| Testing and quality | Playwright, ESLint, Next.js production build |
| Deployment target | Vercel-compatible Next.js deployment |

## Requirements

Install these before running the project:

- [Node.js](https://nodejs.org/) `20.9.0` or newer
- [pnpm](https://pnpm.io/)

If you already have Node.js installed, you can enable pnpm through Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Check your installed versions:

```bash
node -v
pnpm -v
```

## Setup

Install dependencies:

```bash
pnpm install
```

## Run Locally

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The main landing page is in `src/app/(landing-page)/page.tsx`.

## Available Scripts

```bash
pnpm dev
```

Runs the app in development mode.

```bash
pnpm build
```

Builds the production app.

```bash
pnpm start
```

Runs the production build. Run `pnpm build` first.

```bash
pnpm lint
```

Runs ESLint.

## Project Structure

- `src/app` - Next.js app routes, layouts, and global styles
- `src/features` - page feature sections such as hero, projects, about, testimonials, contact, and navigation
- `src/components` - shared UI and logo components
- `src/common` - shared layouts
- `public` - static assets
- `docs` - project architecture and feature notes

## Implementation Rules

Before adding or changing features, read:

- `docs/00-application-architecture.md`
- `docs/01-component-architecture-rules.md`
- `docs/02-feature-implementation-rules.md`
- the relevant plan in `docs/feature/`

These documents define the standing rules for editable content defaults, admin UX, Supabase, Vercel Blob, RBAC, documentation, and Playwright coverage.

Database schema changes are managed with Drizzle ORM. See `docs/feature/08-orm-backend-implementation.md`.

New backend-facing features should use tRPC for typed client/server calls unless there is a practical reason to keep a standard Next.js route handler, such as file uploads, webhooks, or public asset delivery.
