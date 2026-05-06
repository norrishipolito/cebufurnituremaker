# Cebu Furniture Maker

A Next.js landing page for Cebu Furniture Maker, built with React, TypeScript, Tailwind CSS, and pnpm.

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
