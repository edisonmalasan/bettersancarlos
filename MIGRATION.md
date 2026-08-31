# Migration Guide: Static HTML to Next.js + TypeScript

This document records the migration from the legacy static HTML site to the current Next.js + TypeScript application at the repository root.

## Overview

Better San Carlos now ships as a single Next.js application on the `main` branch. The legacy static HTML files, the Python `serve.py` development server, and the separate `react-app/` directory have been removed.

| Version            | Location              | Status   | Technology                       |
| ------------------ | --------------------- | -------- | -------------------------------- |
| Next.js + TypeScript | repository root       | Active   | Next.js 15, React 18, TypeScript |
| Static HTML        | `legacy` branch (future archive) | Retired  | HTML5, CSS3, Vanilla JavaScript  |

## Version Comparison

### Static HTML Version

**Location:** Root directory (`/`)

**Characteristics:**

- Pure HTML5 with semantic markup
- Vanilla CSS with custom properties
- Vanilla JavaScript (ES6+)
- No build step required for development
- Direct file serving

**Best for:**

- Simple content updates
- Quick fixes
- Contributors unfamiliar with React

### React + TypeScript Version

**Location:** `/react-app/` directory

**Characteristics:**

- Next.js 14 with App Router
- TypeScript for type safety
- React 18 with Server Components
- Component-based architecture
- Built-in routing and SSR

**Best for:**

- New feature development
- Complex UI interactions
- Long-term maintenance
- Scalable architecture

## Getting Started

### Prerequisites

| Requirement | Version       |
| ----------- | ------------- |
| Bun         | v1.3 or higher |
| Git         | Latest        |

### Setup

```bash
# Clone the repository
git clone https://github.com/BetterSanCarlos/bettersancarlos.git
cd bettersancarlos

# Install dependencies
bun install

# Start development server
bun dev
```

Open http://localhost:3000 in your browser.

## Directory Structure Comparison

### Static HTML

```
bettersancarlos/
├── index.html
├── services/
├── government/
├── budget/
├── assets/
│   ├── css/
│   └── js/
└── data/
```

### Next.js + TypeScript

```
bettersancarlos/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable React components
│   └── contexts/      # React Context providers
├── public/            # Static assets and data
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## Component Mapping

This table shows which static HTML files correspond to which React components:

| Static HTML             | Next.js Page        | Location                      |
| ----------------------- | ------------------- | ----------------------------- |
| `index.html`            | `page.tsx`          | `src/app/page.tsx`            |
| `services/index.html`   | `page.tsx`          | `src/app/services/page.tsx`   |
| `government/index.html` | `page.tsx`         | `src/app/government/page.tsx` |
| `budget/index.html`     | `page.tsx`          | `src/app/budget/page.tsx`     |
| `statistics/index.html` | `page.tsx`          | `src/app/statistics/page.tsx` |
| `contact/index.html`    | `page.tsx`          | `src/app/contact/page.tsx`    |
| Legacy service detail pages | `page.tsx`      | `src/app/services/[slug]/page.tsx` |

## Key Differences

### Routing

**Static HTML:** File-based with `.html` extensions

```
/services/business.html
```

**React:** Next.js App Router (folder-based)

```
/services/business (maps to src/app/services/business/page.tsx)
```

### Styling

Both versions share the same CSS files from `public/assets/css/`. The React version imports these stylesheets in the root layout.

### State Management

**Static HTML:** DOM manipulation with vanilla JavaScript

**React:** React Context API for global state (e.g., `LanguageContext` for translations)

### Data Fetching

**Static HTML:** Inline data or fetch from JSON files

**React:** Server Components with direct data access or client-side hooks

## Contributing to React Version

### Code Style

| Guideline  | Description                                        |
| ---------- | -------------------------------------------------- |
| TypeScript | Use strict typing; avoid `any`                     |
| Components | Functional components with hooks                   |
| Naming     | PascalCase for components, camelCase for functions |
| Files      | One component per file; name matches component     |
| Imports    | Use absolute imports with `@/` prefix              |

### Creating a New Page

1. Create a folder in `src/app/` matching the route
2. Add a `page.tsx` file with the page component
3. Export the component as default
4. Add any client interactivity with `'use client'` directive

Example:

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <main>
      <h1>New Page</h1>
    </main>
  );
}
```

### Creating a Component

1. Add file to `src/components/`
2. Export as default or named export
3. Include TypeScript interface for props

Example:

```typescript
// src/components/ExampleCard.tsx
interface ExampleCardProps {
  title: string;
  description: string;
}

export default function ExampleCard({ title, description }: ExampleCardProps) {
  return (
    <div className="example-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

## Transition Timeline

| Phase   | Timeframe | Action                                         |
| ------- | --------- | ---------------------------------------------- |
| Phase 1 | Completed | Static HTML and `react-app/` merged to root Next.js app |
| Phase 2 | Completed | Python `serve.py` and static HTML removed       |
| Phase 3 | Completed | Bun + Serwist PWA adopted for build/runtime     |
| Phase 4 | Ongoing   | Final branding and documentation updates        |

## Questions and Support

- Open an issue on GitHub with the `react` label
- Join our Discord community for real-time discussion
- Email: volunteer@bettersancarlos.vercel.app

---

Last updated: July 2026
