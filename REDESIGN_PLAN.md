# Redesign Plan

Replace the visual design of this portfolio while keeping every feature working.

**Non negotiable.** Features, routes, data, and auth do not change. Only how things look.

---

## 0. Locked decisions

Settled 2026-09-28. These came out of a full read of the codebase, the mockup, and the
remix reference. Do not relitigate them without a reason.

| # | Decision |
|---|---|
| 1 | **Home hero** is recreated **same to same** from `../ag-bento.html`. Not inspired by. Ported. |
| 2 | **Skills section** is recreated **same to same** from `../ag-bento.html` — the orbit card and the `skill-terminal` tree. |
| 3 | **Everything else** uses the bento style **taken from the remix project**, not the mockup. Different easing, different primitives. |
| 4 | Add `@tailwindcss/typography` and rewire the four `prose` call sites. No hand-rolled prose. |
| 5 | `/admin` is **left alone**. It stays light `slate-*`. It is a CMS, not marketing. |
| 6 | `/typeshala` **is** restyled to match the main domain. It is back in scope. |
| 7 | Global `focus-visible` ring on the accent, main domain + typeshala. Admin untouched. |
| 8 | Verification is `npm run dev` locally. Vercel previews are a nice-to-have, not a gate. |
| 9 | **RESOLVED BY INFERENCE, still confirm.** Fonts are **Space Grotesk 300–700 + IBM Plex Mono 400/500/600**, self-hosted. The answer given was "use from the remix project" but that project has **no font files at all** — `public/` there is just `favicon.ico` and `robots.txt`, and its `styles.css:22-23` declares bare stacks (`"Inter", ui-sans-serif`) with no `@font-face` and no Google Fonts link. There is nothing to copy. Space Grotesk is also what the mockup uses, and decisions 1 and 2 require the mockup's exact typography. If Inter + JetBrains Mono was actually intended, it is a two-file change: `app/globals.css` and `app/layout.tsx`. |

---

## 1. Where we are

Next.js 16 App Router, React 19, Tailwind v4 (CSS first, no `tailwind.config.*`), Supabase,
framer-motion 11, TipTap, react-toastify, Upstash Redis.

Two facts shape the whole approach:

**The design layer is inline Tailwind.** 855 `className` attributes across 6,556 lines of TSX
in 59 files. No CSS modules, no styled components, no `clsx`/`tailwind-merge`/`cn()` helper,
no shared wrapper components. `app/globals.css` is 54 lines and 8 of its 12 `:root` vars are
never referenced.

**The feature layer is real and load bearing.** Four API routes, three non interchangeable
Supabase clients, four auth layers, a CSP nonce chain, and subdomain routing for Typeshala.

So this is not a theme swap. There is no abstraction to untangle first, which is good, but
every page gets touched. The win comes from building the token layer and primitives first
so the pages become cheap.

### Scope, measured

| Bucket | Files | `className` | gray/slate tokens |
|---|---|---|---|
| Main domain — in scope | 34 | 479 | 252 |
| Typeshala — in scope (decision 6) | 6 | 160 | 63 |
| Admin — **out of scope** (decision 5) | 17 | — | 130 |
| **In-scope total** | **40** | **639** | **315** |

`npm run lint` is clean today. That is the baseline.

### Design debt

The plan previously undercounted these. Corrected:

| Pattern | Copies | Note |
|---|---|---|
| `container mx-auto px-6` | 14 | across 13 files |
| `bg-gray-800/50` card surface | 53 | 18 also carry `backdrop-blur-sm` |
| Blurred orb block | **13** across 7 files | not 5 |
| Eyebrow pill | **7** | byte identical, `mb-6` in 3 and `mb-4` in 4 |
| `bg-clip-text` gradient heading | 5 | 4 use v4 `bg-linear-to-r`, 1 uses v3 `bg-gradient-to-r` |
| `rounded-2xl` / `rounded-xl` / `rounded-3xl` | 25 / 59 / 1 | 85 total |
| `"use client"` | **30** | not 26; 4 files use single quotes |

Dominant tokens to kill: `text-gray-400` ×93 and `bg-gray-800` ×62.

---

## 2. Bugs to fix during the pass

### Confirmed, all ten reproduce

| Issue | Where | Effect |
|---|---|---|
| `bg-gray-50 text-gray-900` on `<body>` vs dark CSS | `app/layout.tsx:152` | Login, 404, error render light gray. |
| `prose prose-invert` used, plugin not installed | 4 files | Blog + release-note body copy gets zero styling. Fixed by decision 4. |
| `text-small` | `components/home/FeaturedProjectsClient.tsx:85` | Nonexistent class, silent no op. |
| `text-white-900`, `text-white-600` | `app/blogs/[slug]/page.tsx:293,296` | Nonexistent classes. |
| `pt-25` | `app/blogs/[slug]/page.tsx:273` | Nonexistent class. |
| `animate-in slide-in-from-top-2` | `components/typeshala/ReleaseNotes.tsx:139` | Needs `tw-animate-css`, not installed. Replaced with `Reveal`. |
| `animationDelay` with no keyframes | `Skills.tsx:87,106`, `LatestBlogsClient.tsx:75`, `ProjectsGrid.tsx:54` | Reveals written, never fire. |
| Fraunces loaded, zero consumers | `app/layout.tsx:44-69` | 138,904 bytes shipped for nothing. |
| Mulish ships 400+600, code uses `font-light` | `app/layout.tsx:10-25`, `Hero.tsx:33` | Weight 300 synthesized. Dies with Mulish. |
| `theme="light"` toaster on a dark site | `components/ToastContainerClient.tsx:14` | |

### Found during verification, not in the original plan

| Issue | Where | Effect |
|---|---|---|
| `absolute inset-0` inside a non-`relative` parent | `components/home/Skills.tsx:118` inside the card at `:85` | Hover gradient escapes the card and floods the whole `<section>`. Needs `relative` on the card. |
| `Reveal` depends on keyframes that do not exist here | ported from remix `reveal.tsx:38` + `styles.css:138,149` | **Trap.** Copying the component without `@keyframes fade-up` reproduces the exact `animationDelay` bug above. The keyframes land in **Phase 1**, not Phase 2. |
| Zero `focus-visible:` rules in the codebase | 855 `className`s, 83 `focus:ring-*` in blue/indigo/slate | Keyboard focus relies on UA defaults surviving overrides. Fixed by decision 7. |
| `h5`/`h6` branch is dead | `components/blog/BlogHomeContent.tsx:17` | `lib/sanitize.ts:5-9` strips `h5`/`h6`, so that branch can never match. |
| `app/page.tsx:57` is also `bg-gray-50` | home `<main>` | Latent, not visible — every home section sets its own dark bg. Fix anyway. |
| v3 gradient syntax | `AboutClient.tsx:98,123,219,273,326,333` | `bg-gradient-to-*` alongside v4 `bg-linear-to-*`. Normalise. |
| `"use client"` quote style | 4 typeshala files | Single quotes, inconsistent with the other 26. |

### Latent constraints, not bugs to fix

- **`components/home/FeaturedProjectsClient.tsx` `FeaturedProjects.tsx` / `LatestBlogs.tsx` are pure data fetchers.** All markup is in the `*Client.tsx` sibling. Restyle the client, not the fetcher.
- **`Hero.tsx:91` renders `HeroAnimated`.** Do not delete one and orphan the other.
- **Admin update/delete has no Zod validation**, unlike create. `AdminProjectsManager.tsx:149-153` only checks two fields. The asymmetry is real. Do not "fix" it during a restyle.
- **`next.config.ts:5-16` allows only `**.supabase.co` and `images.unsplash.com`** in `images.remotePatterns`. Any new imagery host throws at runtime.
- **`app/admin` is insulated from the body fix.** `app/admin/layout.tsx:42` sets its own `bg-slate-50 text-slate-900`, so fixing `<body>` does not darken admin. That is why decision 5 is safe.

---

## 3. The design direction

### Two sources, split by section

**`../ag-bento.html` owns the hero and the skills section, same to same.**
Port the CSS values verbatim, not approximately. Full token block at `ag-bento.html:12-27`,
hero grid at `:129-160` plus markup at `:401-470`, orbit at `:180-215`, terminal at
`:218-252`, and the clock + count-up JS at the bottom of the file.

**`../remix-of-pixel-perfect` owns everything else.**
Easing `cubic-bezier(0.16, 1, 0.3, 1)`. Motion vocabulary from its primitives. Bento *taste*
without the mockup's exact geometry.

| | Now | Target |
|---|---|---|
| Accent | blue `#3b82f6` + purple + green | teal `#2dd4bf`, one accent |
| Card surface | opaque `bg-gray-800/50` | alpha overlay `rgba(255,255,255,.035)` |
| Border | `border-gray-700` | `rgba(255,255,255,.09)`, hover step `.18` |
| Background | flat + blur orbs per section | flat `#0a0a0c` + two radial teal orbs on `<body>` |
| Radius | stock, mostly `rounded-xl`/`2xl` | 14 / 16 / 28 px, three steps |
| Container | full width, 24 px gutter | 1180 px, 24 px gutter |
| Section rhythm | `py-16`…`py-24`, inconsistent | flat 64 px, 16 px grid gap |
| Sans | Mulish | Space Grotesk |
| Mono | IBM Plex Mono 400/500 | IBM Plex Mono 400/500/**600** |
| Serif | unused, 139 KB | none |
| Headings | stock sizes | `clamp()` scale, negative tracking |
| Hover | scale, lift, shadow ramp | border + color shift, cursor spotlight on interactive tiles only |
| Card entry | load stagger, or nothing | scroll reveal, fires once on intersect |

### Motifs

From the mockup, for hero and skills only: 4-column bento grid with varied spans, cursor
spotlight card, orbiting tech badges on two counter-rotating rings paused on hover, fake
terminal with the skills tree, live clock in `Asia/Kathmandu`, count-up stats divided by
`border-right`, blinking caret, eyebrow + heading + lede section head.

From the remix project, for everything else:

- `Reveal` — IntersectionObserver, disconnects after firing, `delay` prop. Replaces the three inert `animationDelay` blocks.
- `KineticDivider` + scroll velocity row — two counter-scrolling mono rows with edge fade masks. Needs `framer-motion` import swap and a `matchMedia` guard.
- `PixelImage` — mosaic clip-path reveal, grayscale to color.
- 3D tilt card — real `rotateX`/`rotateY` with layered `translateZ`. Needs a `matchMedia` guard, it writes `style.transform` on mousemove.
- `gap-px` + `bg-border` hairline grid, more robust than per-cell `border-right`.
- `AnimatedBeam` for the architecture diagram.

Skip the cursor spotlight on anything non-interactive. It costs a motion value per card.

### Porting gotchas for the remix primitives

Verified by reading the source, all of these will bite:

- `scroll-based-velocity.tsx:2` and `animated-beam.tsx:2` import from **`motion/react`**. This repo is on framer-motion 11. Rewrite to `framer-motion`; `useScroll`, `useTransform`, `useSpring` all exist in v11.
- Those components reference shadcn semantic tokens — `border-border`, `bg-background`, `text-muted-foreground` — that **do not exist here**. Every one needs remapping to the bento tokens.
- They all `import { cn } from "@/lib/utils"`. That helper does not exist. Phase 2 creates it.
- **None of the four primitives has an internal `prefers-reduced-motion` branch.** They all lean on the global CSS kill switch at remix `styles.css:171`. That is sufficient for `orbit` (pure `@keyframes`) and `PixelImage` (CSS), but **not** for the marquee (framer spring) or the 3D tilt (direct style writes). Those two get explicit `matchMedia` guards.

### Accessibility

The mockup honours `prefers-reduced-motion` in five places. One global kill switch instead,
plus explicit JS branches on: the count-up, the live clock, the marquee, and the 3D tilt.
The orbit and the caret are pure CSS and are covered by the kill switch.

Global `focus-visible` ring on the accent per decision 7. Admin's existing `focus:ring-slate-*`
and `focus:ring-indigo-*` stay.

---

## 4. Do not touch

Authorization lives in Supabase RLS. The UI guards are redirects only. Do not remove any of
the four layers, and do not restructure the data path.

| Keep | Why |
|---|---|
| `proxy.ts` in full | CSP nonce, HTTPS redirect, Typeshala subdomain routing, admin guard |
| `lib/supabase/*` | Three clients, three session models, not interchangeable |
| `lib/sanitize.ts` | The 19-tag allowlist is the de facto content schema |
| `app/api/*` | Zod validation, auth, Redis rate limiting, `{ message }` error shape |
| `x-nonce` to CSP chain in `app/layout.tsx` | Seven JSON-LD blocks depend on it |
| `types/*`, `utils/dateUtils.ts` | Contracts |
| Browser-direct Supabase writes in `Admin*Manager` | Update and delete bypass `/api` and rely on RLS |
| TipTap StarterKit extensions | Its HTML output *is* the stored `Blogs.content` format |
| `localStorage["blogViewPreference"]` | Persisted user preference |
| `hideChrome` in `AppShell.tsx:19-26` | Depends on `isTypeshalaHost` computed in `app/layout.tsx:126`. `AppShell` never reads `headers()` itself. Do not move it. |
| `flex-1` on `AppShell.tsx:32` | Pairs with `flex flex-col min-h-full` on `<body>`. Removing either breaks page height. |

### Highest risk areas

- **`/blogs` URL state.** `search, sort, view, page, limit, tag[]` across `app/blogs/page.tsx`, two client toggles, and the `useSyncExternalStore` hydration dance in `components/blog/BlogsViewToggle.tsx:13-38`. `getServerSnapshot` returns `null` and the client snapshot must also be `null` on first paint, or hydration throws. URL wins over `localStorage`; storage is fallback only. The toggle lives **inside** the GET `<form>` (`page.tsx:320`), which is why `view` is a hidden input at `:316`.
- **Typeshala four way branch.** `app/typeshala/TypeshalaPageClient.tsx:103,180,188,204`. No releases, API down, rate limited, and ok must stay distinct. The two fallback branches each require **all three** of `!latestRelease`, `previousReleases.length === 0`, and the relevant flag. Collapsing one silently merges states. Note `release.ts:63-65` treats HTTP 404 as *success with fallback*, which is the only thing keeping "no releases" distinct from "API down".
- **Typeshala mobile reorder.** `TypeshalaPageClient.tsx:124-134` swaps sections via `useDetectedOS`, which is another `useSyncExternalStore` with `getServerSnapshot → null`. SSR emits desktop first, then reorders after hydration. Preserved by construction.
- **RSC and client split.** 30 files are `"use client"`. Moving markup *into* a client primitive is safe. Converting the reverse is not.
- **`ProjectsGrid` modal.** Esc handler plus body overflow lock at `:18-37`, keyed on `selectedProject`. It is the only `document.body.style` write in the app — any new primitive that also locks scroll will collide with it.

---

## 5. Phases

Each phase is one branch, one reviewable change.

### Phase 0 — Safety

- [ ] Branch off `main`. Never redesign on the live branch.
- [ ] Do not force push, rebase, amend, or squash published history.
- [ ] Baseline: `npm run lint` is clean, record it. `npm run dev` for all visual checks per decision 8.
- [ ] To exercise the Typeshala rewrite locally, add a hosts entry mapping `typeshala.localhost` to `127.0.0.1`, or send a `Host:` header. The subdomain branch at `proxy.ts:85-112` cannot be reached from the bare main domain.

> Note: the original plan said "this project is connected to Lovable." Unverified — there is
> no `AGENTS.md` and no `.lovable/` in this repo. Those live in `../remix-of-pixel-perfect`.
> The history caution still stands on its own merits.

### Phase 1 — Token layer

`app/globals.css` plus the font swap. Highest leverage single edit in the project.

- [ ] Replace the twelve `:root` variables, 8 of them dead, with the bento system: `--bg`, `--surface`, `--surface-2`, `--border`, `--border-hi`, `--text-hi`, `--text-mid`, `--text-low`, `--accent`, `--accent-soft`, `--accent-line`. Add `--amber: #f0b429` and `--violet: #a78bfa` — the mockup uses both for code syntax colouring in the hero panel (`:155-156`) and the terminal (`:251-255`), and decisions 1 and 2 depend on them.
- [ ] Map them into `@theme` so Tailwind generates utilities. Colors on `@theme`, not scattered `:root`.
- [ ] Set the two radial teal orbs on `<body>`, per mockup `:36-40`.
- [ ] Type scale with `clamp()` values, measure caps at 56ch and 50ch.
- [ ] Three step radius scale: 14 / 16 / 28 px. Retire stock `rounded-2xl`.
- [ ] Unify the split where fonts live on `<html>` and colors on `:root`.
- [ ] `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` and shared durations.
- [ ] **Add `@keyframes fade-up` and `@utility fade-up`, ported from remix `styles.css:138-151`.** Non-negotiable, and it belongs here, not Phase 2. Without it `Reveal` is inert and reproduces the existing `animationDelay` bug.
- [ ] One global `prefers-reduced-motion` kill switch.
- [ ] Restyle the scrollbar to the new border tokens.
- [ ] Resolve the light/dark `<body>` conflict. Fixes login, 404, error in one edit. Confirm admin stays light via its own wrapper.
- [ ] Global `focus-visible` accent ring per decision 7. Admin excluded.
- [ ] ~~Drop `scroll-behavior: smooth` from CSS~~ **Correction: do not drop it.** The original plan called it a duplicate of `data-scroll-behavior="smooth"` at `layout.tsx:149`. It is not a duplicate — the data attribute is the marker Next.js reads, the CSS rule is the actual implementation. Removing the CSS silently breaks smooth anchor scrolling. Keep both, and add `scroll-padding-top: 76px` so anchors clear the sticky header (`ag-bento.html:30`), which is a genuine gap today.
- [ ] **The body fix is necessary but not sufficient.** `<body>` carried `bg-gray-50 text-gray-900`, and so did each of `app/page.tsx:57`, `app/login/page.tsx:30`, `app/not-found.tsx:5`, `app/error.tsx:18`. The original plan claimed one edit fixes login, 404 and error. It does not — every one of those sets its own `bg-gray-50` on its `<main>`, so all four must be changed. Each is fixed in its own phase below.
- [ ] **Checkpoint: stop here and review.** Nothing else starts until the direction is confirmed.

### Phase 2 — Primitives

- [x] Download Space Grotesk 400/500/600/700 and IBM Plex Mono 600 into `public/fonts/`. Both are OFL.
  - **Do not use the `latin`-subset files from the Google Fonts CSS API.** The latin subset of IBM Plex Mono 600 carries only 229 codepoints and is **missing every box-drawing character** (`─ │ ├ └` U+2500/2502/251C/2514) — which is the entire content of the skills terminal required by decision 2. It would render as tofu. The existing local 400/500 are full 930-codepoint fonts, so 600 must match.
  - Shipped instead: `SpaceGrotesk-Variable.woff2` (49,128 b, variable `wght` 300–700, 735 cps, from the `google/fonts` TTF converted to woff2 — one file covers all four weights) and `IBMPlexMono-SemiBold.woff2` (41,064 b, static, 930 cps).
  - Space Grotesk has no box-drawing coverage, which is fine: the terminal is monospace. It does have `→`, `•`, `—`, curly quotes, and the middot.
  - Net payload **down from 245,456 b to 168,660 b**. Fraunces (138,904 b) and Mulish (72,468 b) deleted.
  - Side effect: `font-light` at `Hero.tsx:33` now resolves to a real 300 instance instead of being synthesized, because the Space Grotesk axis starts at 300.
- [x] Rewrite the `localFont` blocks in `app/layout.tsx`: add Space Grotesk, add Mono 600, delete Mulish and Fraunces. Resolves the `font-light` bug.
- [ ] `cn()` helper. Install `clsx` and `tailwind-merge`. This is the second new dependency.
- [ ] `<BentoCard>` — alpha surface, border, cursor spotlight via `useMotionValue` + `useMotionTemplate`. Opt in per tile, not every card.
- [ ] `<SectionHead>` — eyebrow + h2 + lede.
- [ ] `<Eyebrow>` — mono, teal.
- [ ] `<StatCell>` — with `border-right` dividers.
- [ ] `<WindowChrome>` — the three dot panel. Reused for terminal, code, and project mockups.
- [ ] `<MonoTag>`.
- [ ] `Reveal`, ported. Needs the Phase 1 keyframes. Replaces the three inert `animationDelay` blocks and `ReleaseNotes.tsx:139`.
- [ ] `KineticDivider` + scroll velocity row, ported. `motion/react` → `framer-motion`, shadcn tokens remapped, `matchMedia` guard added.
- [ ] `PixelImage`, ported. Tokens remapped.
- [ ] 3D tilt card, ported. `matchMedia` guard added.
- [ ] Orbit badges. Merge the remix component with the mockup's per-brand colours and stagger.

### Phase 3 — Shell

- [ ] `app/layout.tsx`. Fonts and `<body>` classes only. Keep the nonce and all JSON-LD untouched.
- [ ] `components/Header.tsx`. Sticky instead of fixed, backdrop blur, monogram tile, two button cluster, mobile panel. Active link logic at `:36-44` and the menu state stay.
- [ ] `components/Footer.tsx`. Three column grid, bottom rule. The orbs at `:9-12` go away, body orbs replace them.
- [ ] `components/ToastContainerClient.tsx`. Flip to `theme="dark"`.

### Phase 4 — Home

**Same to same from `../ag-bento.html`.** This is the visual centrepiece.

- [ ] `app/page.tsx` section order and wrappers. Note `:57` is also `bg-gray-50`.
- [ ] `components/home/Hero.tsx` + `HeroAnimated.tsx`, rebuilt as the mockup's 4-column bento at `:129-160` and `:401-470`:
  - hero-main (span 3 × 2 rows) — split into text and code panel, `radius-l`
  - hero-status (span 1) — "BASED IN / Pokhara, Nepal" plus the live clock in `Asia/Kathmandu`, 15 s interval, `UTC +05:45` footer
  - hero-social (span 1) — GitHub, LinkedIn, X, reusing `components/icons.tsx`
  - hero-stats (span 3) — three `StatCell`s, `border-right` dividers, count-up on intersect at threshold 0.6, 900 ms cubic ease-out
  - code panel carries the blinking caret and the violet/amber keyword colours
  - responsive: 4 cols → 2 cols at 900 px, stats stack at 720 px
- [ ] `components/home/Skills.tsx`, same to same from `:473-548` and `:180-252`:
  - `SectionHead` with "MY EXPERTISE / Technical skills"
  - orbit card — hub, inner ring 4 badges at `--r:78px` / 20 s, outer ring 4 at `--r:150px` / 32 s reversed, paused on hover, caption line
  - `skill-terminal` — `WindowChrome` bar titled `bash — skills`, the `abhishek@dev:~/skills$ tree --by-category` prompt, the full four-directory tree, and the `4 directories, 24 files` summary with caret
  - the existing `skills` object at `Skills.tsx:5-24` maps 1:1 onto the tree, 24 items across 4 dirs
  - fix the `absolute`-without-`relative` bug at `:118`
  - drop the 4 skill cards and the `animationDelay` props, or keep them as a `Reveal` stagger
- [ ] `components/home/FeaturedProjectsClient.tsx`. Big card plus two small tiles. Fix `text-small` at `:85`. Replace `animationDelay`.
- [ ] `components/home/LatestBlogsClient.tsx`. Replace `animationDelay`.
- [ ] `components/home/HomeContact.tsx` and the two contact children.

### Phase 5 — Secondary pages

Bento style **from the remix project** here, not the mockup.

- [ ] `app/projects/page.tsx` + `components/projects/*`. `ProjectsGrid.tsx:18-37` Esc handler and body lock stay. Replace `animationDelay` at `:54`.
- [ ] `components/about/AboutClient.tsx`. Timeline and skill bars keep their framer width animations. Watch `skill.color` at `:24,29,34,39` — those are full Tailwind class strings injected via template literal, and Tailwind v4's scanner cannot see inside a variable, so moving them into a config silently kills the gradient.
- [ ] `app/blogs/page.tsx`. Layout only. Query param names are the contract. `BlogsViewToggle` and `BlogLimitControl` are logic, restyle the surface only.
- [ ] `app/blogs/[slug]/page.tsx`. Add `@tailwindcss/typography` per decision 4, restyle the four `prose` call sites, and delete the three dead classes. Note the 19-tag allowlist caps what prose can style, and stored Tailwind classes in post HTML pass through sanitization via the `*` class attribute.
- [ ] `app/contact/page.tsx`, `app/login/page.tsx`, `app/not-found.tsx`, `app/error.tsx`.
- [ ] `app/opengraph-image.tsx`. Inline styles only, Satori cannot read a stylesheet. Hand port.

### Phase 6 — Typeshala

Back in scope per decision 6. 6 files, 160 `className`, 63 gray tokens.

- [ ] `components/typeshala/TypeshalaChrome.tsx`, `DownloadCards.tsx`, `ReleaseNotes.tsx`, `app/typeshala/page.tsx`.
- [ ] `app/typeshala/TypeshalaPageClient.tsx`. Adopt the bento surface and accent. The four-way branch at `:103,180,188,204` and the mobile reorder at `:124-134` stay exactly as they are.
- [ ] Delete the `animate-in slide-in-from-top-2` at `ReleaseNotes.tsx:139`, replace with `Reveal`. Do **not** install `tw-animate-css` for one class.
- [ ] Restyle the two `prose prose-invert` sites at `ReleaseNotes.tsx:67,141` — now live thanks to decision 4.
- [ ] Verify against a `typeshala.` Host header, not the bare main domain.

### Phase 7 — Cleanup

- [ ] Delete the dead classes from section 2.
- [ ] Confirm Fraunces and Mulish are fully gone from `app/layout.tsx` and `public/fonts/`.
- [ ] Normalise the 6 v3 `bg-gradient-to-*` call sites to v4 `bg-linear-*`.
- [ ] Drop the dead `h5`/`h6` branch at `BlogHomeContent.tsx:17`.
- [ ] Normalise the 4 single-quoted `"use client"` directives.
- [ ] Sweep for stock `rounded-2xl` and `bg-gray-*` that escaped the primitives.
- [ ] Confirm `next.config.ts:5-16` `images.remotePatterns` still covers every image in use.

### Explicitly not doing

- `/admin` is not restyled (decision 5). 130 slate tokens, 17 files, untouched.
- The three separate sanitizers (`lib/sanitize.ts`, DOMPurify in `ContactForm.tsx:35`, the regex in `api/contact/route.ts:102`) are not unified.
- The update/delete validation asymmetry in `AdminProjectsManager` is not fixed.
- `release.ts:153` keeps its own `host.startsWith('typeshala.')` string check rather than being unified with `isTypeshalaHost()`.

---

## 6. Definition of done

- [ ] Every route renders, no console errors, no hydration warnings.
- [ ] `/blogs` URL state intact: all six params, both toggles, `localStorage` fallback, no hydration mismatch.
- [ ] Typeshala four states still distinct: no releases, API down, rate limited, ok.
- [ ] Typeshala subdomain routing verified via Host header, and the mobile reorder still works.
- [ ] Supabase reads and writes work in admin. TipTap still round trips.
- [ ] Contact form still submits and the Redis rate limit still returns 429.
- [ ] Admin is still unreachable when logged out, on all four layers.
- [ ] JSON LD validates, sitemap and robots unchanged, OG image still renders.
- [ ] Hero and skills section match `../ag-bento.html` — verified side by side, not from memory.
- [ ] Keyboard focus is visible everywhere on the main domain and typeshala. Admin unchanged.
- [ ] `prefers-reduced-motion` honored. Marquee, 3D tilt, clock, and count-up all have explicit JS branches; orbit and caret are covered by the kill switch.
- [ ] Lighthouse parity or better. Fonts self-hosted, no layout shift.
- [ ] Lighthouse accessibility at or above current.
- [ ] Mobile checked at 360, 720, 900 px.
- [ ] `npm run lint` and `npm run build` clean.

---

## 7. Rollout

1. Merge Phase 1 and 2. Review the tokens in isolation.
2. Ship the shell plus home. This is the visible win. Deploy and look at it.
3. Ship Phase 5, 6, 7 in small batches.
4. Leave admin alone indefinitely. Revisit only if the marketing site has moved far enough that the split starts to read as a bug.
