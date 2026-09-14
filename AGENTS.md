# AGENTS.md

## Project overview

Better San Carlos is the civic portal for San Carlos City, Pangasinan (services directory, government, budget transparency, statistics, news).
It is a statically exported Next.js PWA with no backend; all content comes from JSON files under `data/` / `src/data/`.

---

## Stack

- Language: TypeScript (`strict: true`), React 18
- Framework: Next.js 15 with `output: 'export'` (static HTML in `out/`)
- Styling: Tailwind CSS v4, CSS-first config in `src/app/globals.css` (`@theme`, no config file); shadcn/ui in `src/components/ui`
- PWA: Serwist (`src/app/sw.ts`); charts: Chart.js; icons: Bootstrap Icons CDN + `lucide-react`
- Storage: none — static JSON only
- Deploy: Vercel, plus cPanel static hosting via `build.sh` (`out/` → `dist/`)

---

## Setup & commands

Install with bun (`bun.lock` is committed). `npm install` is broken in this repo (verified: `EOVERRIDE`, the `postcss` override conflicts with the direct dependency).

```bash
bun install
./node_modules/.bin/next dev --port 3000
./node_modules/.bin/tsc --noEmit
$env:NODE_ENV="production"; ./node_modules/.bin/next build
```

---

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

---

## Testing

- There is no test suite in this repo (no test script, no test files). Do not claim tests exist or passed.
- Run `./node_modules/.bin/tsc --noEmit` and the production `next build` before finishing any change; don't hand back a failing build.
- If a required check cannot be run, report why.

---

## Boundaries — do not touch

- Generated output: `.next/`, `out/`, `dist/`, `public/sw.js*`, `tsconfig.tsbuildinfo` (revert it if a build dirties it).
- `version.json` and the `version` field in `package.json` — managed by `scripts/bump-version.js` via `build.sh`; never hand-edit.
- Never commit secrets or credentials.
- Do not reinstall, upgrade, or reconfigure Tailwind/PostCSS unless the task requires it.

---

## Change scope

- Make the smallest coherent change that satisfies the task.
- Do not perform unrelated refactors.
- Do not modify unrelated files.
- Do not upgrade dependencies without a reason.
- Do not rename or reorganize code unless required by the task.
- Preserve existing behavior unless the task explicitly changes it.

---

## Git / PR workflow 
 
`main` is the integration branch. Never perform planned work directly on `main`. 
 
Every repository-mutating OpenSpec stage must use a remote branch and PR. Local-only working branches are not allowed. 
 
### Branch naming 
 
Branch names describe the technical work, not the raw OpenSpec change name. 
 
- Proposal/docs: `docs/<technical-scope>-proposal` 
- Feature: `feat/<technical-scope>` 
- Fix: `fix/<technical-scope>` 
- Refactor: `refactor/<technical-scope>` 
- Tests/validation: `test/<technical-scope>` 
- Technical spike: `spike/<technical-scope>` 
- Spec sync: `docs/<technical-scope>-spec-sync` 
- Archive: `chore/archive-<technical-scope>` 
 
Examples: 
 
- `docs/.....-proposal` 
- `feat/quest-progress-api` 
- `fix/duplicate-xp-award` 
- `docs/....-spec-sync` 
- `chore/archive-...-validation` 
 
Do not use the OpenSpec change ID as the branch name unless it is also the clearest technical description. 
 
### Branch lifecycle 
 
Before starting any repository-mutating stage: 
 
1. Check `git status`. 
2. Switch to `main`. 
3. Pull the latest `origin/main`. 
4. Create a new branch from the updated `main`. 
5. Immediately push the new branch to `origin` and set upstream tracking. 
6. Only then begin modifying files. 
 
Never leave active repository work only on a local branch. 
 
Recommended pattern: 
 
    git switch main 
    git pull --ff-only origin main 
    git switch -c <branch-name> 
    git push -u origin <branch-name> 
 
### OpenSpec Git lifecycle 
 
#### Explore 
 
`/openspec-explore` is normally read-only. 
 
If no repository files change, no branch or PR is required. 
 
If exploration intentionally modifies tracked documentation, treat it as a normal repository-mutating stage and use a branch + PR. 
 
#### Propose 
 
For `/openspec-propose`: 
 
1. Start from updated `main`. 
2. Create a technical proposal branch such as `docs/<scope>-proposal`. 
3. Immediately push the branch to `origin`. 
4. Create/update the OpenSpec proposal, design, specs, tasks, and roadmap status. 
5. Review the diff. 
6. Commit using Conventional Commits. 
7. Push all proposal commits to the remote branch. 
8. Open a PR into `main`. 
9. After required checks pass, merge the PR using a **merge commit**. 
10. Delete the merged local and remote branch. 
11. Return to `main` and pull the merged result before starting Apply. 
 
Proposal artifacts should be committed and pushed so the exact remote PR diff can be reviewed. 
 
Do not reuse the proposal branch for Apply. 
 
#### Apply 
 
For `/openspec-apply-change`: 
 
1. Ensure the proposal PR has already been merged. 
2. Return to `main`. 
3. Pull the latest `origin/main`. 
4. Create a new implementation branch from `main`. 
5. Immediately push the new branch to `origin`. 
6. Apply only the approved OpenSpec tasks. 
7. Commit coherent implementation steps using Conventional Commits. 
8. Push commits regularly to the remote branch. 
9. Run all required verification. 
10. Review the final diff and test results. 
11. Open or update the PR into `main`. 
12. Merge after required checks pass. 
13. Merge using a **merge commit**. 
14. Delete the merged local and remote branch. 
15. Return to updated `main`. 
 
Do not reuse the proposal branch for Apply. 
 
Do not begin Sync or Archive from an unmerged Apply branch. 
 
#### Sync 
 
If `/openspec-sync` modifies repository files: 
 
1. Ensure the Apply PR has already been merged. 
2. Return to `main` and pull latest `origin/main`. 
3. Create `docs/<scope>-spec-sync`. 
4. Immediately push it to `origin`. 
5. Run the approved OpenSpec sync. 
6. Review the diff. 
7. Commit using Conventional Commits. 
8. Push the commit(s). 
9. Open a PR into `main`. 
10. Merge using a **merge commit** after required checks pass. 
11. Delete the local and remote branch. 
12. Return to updated `main`. 
 
Skip this stage when no spec synchronization is required. 
 
#### Archive 
 
For `/openspec-archive`: 
 
1. Archive only after Apply and any required Sync are merged. 
2. Return to `main`. 
3. Pull latest `origin/main`. 
4. Create `chore/archive-<technical-scope>`. 
5. Immediately push the branch to `origin`. 
6. Run the OpenSpec archive workflow. 
7. Update Project Status, roadmap references, and archive links where required. 
8. Review the diff. 
9. Commit using Conventional Commits. 
10. Push the archive commit(s). 
11. Open a PR into `main`. 
12. Merge after required checks pass. 
13. Merge using a **merge commit**. 
14. Delete the local and remote branch. 
15. Return to `main` and pull latest `origin/main` before beginning the next roadmap phase. 
 
### Commit conventions 
 
Use Conventional Commits: 
 
- `feat:` new product capability 
- `fix:` bug fix 
- `refactor:` behavior-preserving restructuring 
- `test:` tests or technical validation 
- `docs:` documentation/specification 
- `chore:` repository/tooling/archive maintenance 
 
Examples: 
 
- `docs: propose browser runtime validation` 
- `test: add worker containment probes` 
- `feat: add quest progress endpoint` 
- `fix: prevent duplicate xp awards` 
- `docs: sync runtime validation requirements` 
- `chore: archive browser runtime validation` 
 
Keep commits coherent and scoped. 
 
Do not bundle unrelated changes into one commit. 
 
### PR / merge conventions 
 
- Every Propose, Apply, Sync, and Archive stage that changes repository files must go through a PR into `main`. 
- Never silently commit completed stage work directly to `main`. 
- Keep one coherent OpenSpec stage per branch. 
- Open the PR from the remote branch, not from local-only work. 
- Use **merge commits only** for OpenSpec and development PRs. 
- Do **not** squash merge. 
- Do **not** rebase merge. 
- Preserve branch topology and individual branch commits in Git history. 
- When using GitHub CLI, merge with: 
 
    gh pr merge <PR_NUMBER> --merge --delete-branch 
 
- Do not use: 
 
    gh pr merge <PR_NUMBER> --squash 
 
or: 
 
    gh pr merge <PR_NUMBER> --rebase 
 
- Do not replace the default GitHub merge-commit title unless there is a specific reason. 
- Prefer preserving the normal GitHub merge message, for example: 
 
    Merge pull request #123 from owner/feat/quest-progress-api 
 
- Delete local and remote branches only after the PR has successfully merged. 
- The PR and merge commit are the permanent historical record after branch deletion. 
- Never begin the next OpenSpec stage from an unmerged branch. 
- After every merge, switch back to `main` and update it from `origin/main` before creating the next branch. 
 
### Expected OpenSpec branch flow 
 
For one OpenSpec change, the normal flow is: 
 
    main 
      │ 
      ├── docs/<scope>-proposal 
      │      ↓ push remote immediately 
      │      ↓ /openspec-propose 
      │      ↓ commit + push 
      │      ↓ PR 
      │      ↓ merge commit 
      │ 
      ├── feat|spike|test/<scope> 
      │      ↓ push remote immediately 
      │      ↓ /openspec-apply-change 
      │      ↓ implementation 
      │      ↓ verification 
      │      ↓ commit + push 
      │      ↓ PR 
      │      ↓ merge commit 
      │ 
      ├── docs/<scope>-spec-sync 
      │      ↓ only if sync is required 
      │      ↓ /openspec-sync 
      │      ↓ PR 
      │      ↓ merge commit 
      │ 
      └── chore/archive-<scope> 
             ↓ /openspec-archive 
             ↓ update roadmap/status 
             ↓ PR 
             ↓ merge commit 
             ↓ delete branch 
             ↓ return to updated main 
 
### Git safety 
 
- Check `git status` before significant work. 
- Inspect `git diff` before every commit. 
- Inspect the final diff before opening a PR. 
- Never discard existing user changes. 
- Never force-push unless explicitly authorized. 
- Never use destructive Git operations unless explicitly authorized. 
- Never rewrite history unless explicitly authorized. 
- Never merge a PR with failing required checks unless explicitly authorized. 
- Never claim a branch was pushed, a PR was opened, or a merge occurred unless it actually happened.

---

## Source of truth

When deciding what the project should do, use this order:

1. Explicit user/task requirements
2. Approved OpenSpec specifications
3. Existing project behavior and architecture
4. Tests
5. Repository documentation
6. Agent assumptions

When sources conflict, do not silently invent a resolution.

---

## Existing / brownfield projects

When continuing an existing project:

- Inspect the relevant implementation before modifying it.
- Read the relevant OpenSpec specs.
- Check `openspec/changes/` for an existing active change.
- Understand current behavior before redesigning anything.
- Do not rewrite working systems merely because they are unfamiliar.
- Do not assume missing documentation means missing functionality.

---

## Spec-driven development (OpenSpec)

This project uses OpenSpec (`openspec/{config.yaml,specs/,changes/}`, skills in `.agents/skills/`).

- Before nontrivial work, check `openspec/changes/` for an in-flight change; continue it instead of duplicating.
- `openspec/specs/` is the source of truth for agreed behavior; read the relevant spec before modifying that capability.
- Implement via the matching skill: explore → propose → apply → verify → sync → archive. Do not skip stages silently, and do not diverge from the plan without updating the change.
- Never hand-edit generated skills under `.agents/skills/`; regenerate with `openspec update`.
