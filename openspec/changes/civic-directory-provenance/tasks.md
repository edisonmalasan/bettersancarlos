# Tasks

## 1. Remove unsourced civic claims

- [ ] 1.1 Delete the `meta` prop, the `ServiceEntryMeta` interface, and the `<dl>` rendering block from `src/components/layout/ServiceEntry.tsx`
- [ ] 1.2 Remove the `meta={[...]}` call sites (and their now-unused `import type` if any) from `src/app/services/certificates/page.tsx`, `education/page.tsx`, `public-safety/page.tsx`, and `social-services/page.tsx`
- [ ] 1.3 Audit every remaining `Office` value on those rows; keep only values attested in canonical data or verified research, and reword the rest into the description text
- [ ] 1.4 Confirm no `Fee` / `Time` / `Turnaround` literal remains anywhere in `src/`

## 2. Restore list semantics

- [ ] 2.1 Wrap the `CATEGORIES` map in `src/app/services/page.tsx` in a `<ul>` with the same reset classes the category pages use, so no orphaned `<li>` is emitted
- [ ] 2.2 Verify the generated `out/services.html` contains each list item inside a `<ul>`

## 3. Provenance guard

- [ ] 3.1 Add `scripts/validate-fact-provenance.ts` scanning `src/**` for string-literal values under `fee` / `cost` / `processing time` / `turnaround` keys, reporting file and line
- [ ] 3.2 Wire it into `package.json` (`fact:validate`) and into the `verify` script so CI runs it
- [ ] 3.3 Confirm the guard passes on the current tree and fails when a temporary literal is introduced

## 4. Verification

- [ ] 4.1 `tsc --noEmit` clean
- [ ] 4.2 `bun run verify` green (typecheck, `data:validate`, production build)
- [ ] 4.3 `bun run data:validate`, `research:validate`, `research:test`, `research:index:check`, `data:test` all green
- [ ] 4.4 Grep the build output to confirm no unsourced fee/turnaround value is published
- [ ] 4.5 `openspec validate civic-directory-provenance --strict` clean
