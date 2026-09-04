# AGENTS.md

## Project overview

Better San Carlos is the civic portal for San Carlos City, Pangasinan (services directory, government, budget transparency, statistics, news).
It is a statically exported Next.js PWA with no backend; all content comes from JSON files under `data/` / `src/data/`.

## Stack

- Language: TypeScript (`strict: true`), React 18
- Framework: Next.js 15 with `output: 'export'` (static HTML in `out/`)
- Styling: Tailwind CSS v4, CSS-first config in `src/app/globals.css` (`@theme`, no config file); shadcn/ui in `src/components/ui`
- PWA: Serwist (`src/app/sw.ts`); charts: Chart.js; icons: Bootstrap Icons CDN + `lucide-react`
- Storage: none — static JSON only
- Deploy: Vercel, plus cPanel static hosting via `build.sh` (`out/` → `dist/`)

## Setup & commands

Install with bun (`bun.lock` is committed). `npm install` is broken in this repo (verified: `EOVERRIDE`, the `postcss` override conflicts with the direct dependency).

```bash
bun install
./node_modules/.bin/next dev --port 3000
./node_modules/.bin/tsc --noEmit
$env:NODE_ENV="production"; ./node_modules/.bin/next build
```

## Code style

- Prettier: 2-space, single quotes, semicolons, `printWidth: 100`, LF (`./.prettierrc`).
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Interactive components need `'use client'` at the top of the file.
- Styling is Tailwind utilities; use exact-value arbitrary variants, never reintroduce global CSS files:

```tsx
<section className="bg-[#f8f9fa] py-16 max-[1024px]:py-8 max-[767px]:py-6">
```

- Resolve conflicting conditional classes with `cn()` (`@/lib/utils`, tailwind-merge), not string concatenation:

```tsx
import { cn } from '@/lib/utils';
className={cn(base, isActive && 'bg-primary text-white')}
```

- Some vanilla JS toggles classes via `querySelector`/`classList` (e.g. `.cmci-tab`, `.metric-card`, search `.selected`). Keep those hook names in `className` and style around them.
- Imports/module style: `@/` alias imports first, then relative; no unused imports.
- Error handling: never swallow errors silently — at minimum leave a `catch` with a comment explaining why it is ignored.

## Testing

- There is no test suite in this repo (no test script, no test files). Do not claim tests exist or passed.
- Run `./node_modules/.bin/tsc --noEmit` and the production `next build` before finishing any change; don't hand back a failing build.
- If a required check cannot be run, report why.

## Boundaries — do not touch

- Generated output: `.next/`, `out/`, `dist/`, `public/sw.js*`, `tsconfig.tsbuildinfo` (revert it if a build dirties it).
- `version.json` and the `version` field in `package.json` — managed by `scripts/bump-version.js` via `build.sh`; never hand-edit.
- Never commit secrets or credentials.
- Do not reinstall, upgrade, or reconfigure Tailwind/PostCSS unless the task requires it.

## Change scope

- Make the smallest coherent change that satisfies the task.
- Do not perform unrelated refactors.
- Do not modify unrelated files.
- Do not upgrade dependencies without a reason.
- Do not rename or reorganize code unless required by the task.
- Preserve existing behavior unless the task explicitly changes it.

## Git / PR conventions

- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `research:`).
- Branch naming: `<type>/<topic>`, optionally prefixed with the user (observed: `chore/migrate-vanilla-css-to-tailwind`, `edisonmalasan/research/better-san-carlos-city`).
- Merge strategy: merge commits via GitHub PR.

### Git safety

- Check `git status` before significant work.
- Inspect `git diff` before finishing.
- Never discard existing user changes.
- Do not use destructive Git operations unless explicitly authorized.
- Do not rewrite history unless explicitly required.

## Source of truth

When deciding what the project should do, use this order:

1. Explicit user/task requirements
2. Approved OpenSpec specifications
3. Existing project behavior and architecture
4. Tests
5. Repository documentation
6. Agent assumptions

When sources conflict, do not silently invent a resolution.

## Existing / brownfield projects

When continuing an existing project:

- Inspect the relevant implementation before modifying it.
- Read the relevant OpenSpec specs.
- Check `openspec/changes/` for an existing active change.
- Understand current behavior before redesigning anything.
- Do not rewrite working systems merely because they are unfamiliar.
- Do not assume missing documentation means missing functionality.

## Spec-driven development (OpenSpec)

This project uses OpenSpec (`openspec/{config.yaml,specs/,changes/}`, skills in `.agents/skills/`).

- Before nontrivial work, check `openspec/changes/` for an in-flight change; continue it instead of duplicating.
- `openspec/specs/` is the source of truth for agreed behavior; read the relevant spec before modifying that capability.
- Implement via the matching skill: explore → propose → apply → verify → sync → archive. Do not skip stages silently, and do not diverge from the plan without updating the change.
- Never hand-edit generated skills under `.agents/skills/`; regenerate with `openspec update`.
