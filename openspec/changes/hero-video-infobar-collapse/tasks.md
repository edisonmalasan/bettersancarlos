## 1. Asset Pipeline (one-time ffmpeg)

- [x] 1.1 Encode the video from the user's source `C:\Users\ediso\Videos\hero-bettersc-.mp4` (40.147s) per design D1: `ffmpeg -i <source> -an -vf "boxblur=12:2,scale=1280:-2" -c:v libx264 -crf 27 -preset slow -movflags +faststart -pix_fmt yuv420p public/assets/videos/hero-bettersc.mp4` — verify duration preserved (~40.1s), no audio stream (`ffprobe` shows video only), size ≤ 6 MB (fallback CRF 29 / 960w if over 8 MB), and loop seam looks clean (first/last frames similar) (result: 1.78 MB, 1280x720, 40.13s, video-only, faststart — well under budget)
- [x] 1.2 Extract poster: `ffmpeg -ss 2 -i <source> -frames:v 1 -vf "boxblur=10:1,scale=1600:-2" -q:v 4 public/assets/videos/hero-poster.jpg` — verify file < 200 KB and frame is representative of the footage start (result: 73.6 KB, 1600x900)
- [x] 1.3 Replace the git-tracked 83 MB file with the new encode (working tree already has it deleted; the encode lands at the same path) and commit both assets — verify `git status` shows modified video + new poster and `next build` copies them to `out/` (committed d629e83; build copy verified in task 4.2)

## 2. Full-Viewport Video Hero

- [x] 2.1 Hero geometry in `src/app/page.tsx`: section becomes `relative flex min-h-[100dvh] items-center overflow-hidden` (keep existing responsive paddings tuned for vertical centering); hero grid wrapped in a `relative z-[1]` container — verify hero fills the first screen on desktop and content is vertically centered, Popular Services below the fold (py-28/20 for navbar clearance)
- [x] 2.2 Add video layer: `<video autoPlay muted loop playsInline preload="metadata" poster="/assets/videos/hero-poster.jpg" aria-hidden tabIndex={-1}>` with `src="/assets/videos/hero-bettersc.mp4"`, classes `absolute inset-0 h-full w-full object-cover hidden min-[768px]:block` — verify autoplay muted+loop on desktop, no audio, no controls, tab focus skips it
- [x] 2.3 Add scrim layer: bamboo gradient overlay div (`absolute inset-0`, ~rgba(42,84,49,0.82)→rgba(39,82,48,0.68)) between video and content — verify headline/CTA/search-card white text meets WCAG AA against the lightest video frame (tune opacity within 0.6-0.85 if needed) (0.85→0.68 diagonal)
- [x] 2.4 Mobile + reduced-motion fallback: section carries `bg-[url('/assets/videos/hero-poster.jpg')] bg-cover bg-center` beneath layers; video hidden <768px and under `prefers-reduced-motion: reduce` (CSS `.hero-video` display none) — verify at 375px width no video request fires (Network tab) and poster renders with scrim + content; verify reduced-motion shows poster
- [x] 2.5 LCP wiring: preload the poster (`<link rel="preload" as="image" href="/assets/videos/hero-poster.jpg" fetchPriority="high">` in the page/layout head) — verify Lighthouse LCP candidate is the poster with high priority and no layout shift from video swap-in (preload link in layout.tsx head)

## 3. Collapsible InfoBar

- [x] 3.1 Add `motion` dependency (`bun add motion`) and convert InfoBar outer div to a Motion scroll-driven element per design D3: `useScroll()` + `useTransform` mapping scrollY [0-80px] to height [36px-full to 0] and opacity [1-0] with `overflow-hidden` - verify smooth collapse by ~80px scroll, smooth re-expand at top, no `window` scroll listeners added (motion@13.2.0 installed; InfoBar collapsed height 36px = py-1.5 + line)
- [x] 3.2 Reduced-motion path: `useReducedMotion()` renders the strip static (no tween; instant state change) - verify collapse is instant and content stays accessible (`aria-live` intact) (implemented: reduced-motion branch keeps static height, only overflow-hidden)
- [ ] 3.3 Navbar independence: verify sticky navbar stays fixed during collapse (no position change, no flicker) and hero content glides up smoothly with zero layout jump; verify at mobile width (767px) the collapse behaves with the compact InfoBar layout

## 4. Verification

- [x] 4.1 Run `./node_modules/.bin/tsc --noEmit` — verify zero type errors
- [x] 4.2 Run production build (`$env:NODE_ENV="production"; ./node_modules/.bin/next build`) — verify success, video + poster present in `out/`, revert `tsconfig.tsbuildinfo` if dirtied (build pass; out/assets/videos contains 1826.4 KB mp4 + 73.6 KB jpg; tsbuildinfo clean)
- [ ] 4.3 Full visual pass: desktop (video autoplays blurred behind scrim, content readable), mobile 375px (poster-only, no video bytes), reduced-motion (poster + instant InfoBar), scroll behavior (InfoBar collapse/expand, navbar stable) — verify all four and record anything deferred
- [x] 4.4 Confirm asset budget: hero-bettersc.mp4 <= 6 MB (1.78 MB), hero-poster.jpg <= 200 KB (73.6 KB), homepage First Load JS delta from motion within reason (140 kB vs 139 kB pre-change; page size 12.2 kB vs 11.5 kB - recorded here)

## 5. Refinement Pass 1 (user visual feedback)

- [x] 5.1 Re-encode video with subtle blur (boxblur 12->6, CRF 26) + re-extract poster (blur 10->4) - verify footage recognizable and sizes within budget (3.27 MB / 108.8 KB)
- [x] 5.2 Split scrim: directional dark gradient (0.62->0.15 left-to-right) + light bamboo multiply tint (0.30) replacing heavy uniform wash - verify footage clearly visible and headline AA holds
- [x] 5.3 Hero geometry: min-h calc(100dvh-6rem) accounting for navbar + InfoBar chrome - verify next section peeks after natural scroll
- [x] 5.4 Bottom white fade (h-24) hand-off into Popular Services surface - verify seamless seam
- [x] 5.5 InfoBar refinement: py-1 (was missing padding entirely - root cause of tall strip), collapse height 30->26, justify-center + gap-5/4/3 centered balance - verify slim centered strip
- [x] 5.6 Sync OpenSpec artifacts: design D1/D2/D3 amendments + D7 feedback record; spec deltas updated (footage-visibility scenario, chrome-aware geometry, harmonized transition requirement, compact-strip requirement)
- [ ] 5.7 Automated checks re-run (tsc, build) and user browser re-approval of task 4.3
