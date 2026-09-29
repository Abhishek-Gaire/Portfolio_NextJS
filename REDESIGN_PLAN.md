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
- `AnimatedBeam` for the architecture diagram. Ported late — see section 6.

Skip the cursor spotlight on anything non-interactive. It costs a motion value per card.

### Porting gotchas for the remix primitives

Verified by reading the source, all of these will bite:

- `scroll-based-velocity.tsx:2` and `animated-beam.tsx:2` import from **`motion/react`**. This repo is on framer-motion 11. Rewrite to `framer-motion`; `useScroll`, `useTransform`, `useSpring` all exist in v11.
- Those components reference shadcn semantic tokens — `border-border`, `bg-background`, `text-muted-foreground` — that **do not exist here**. Every one needs remapping to the bento tokens.
- They all `import { cn } from "@/lib/utils"`. That helper does not exist. Phase 2 creates it.
- **None of the four primitives has an internal `prefers-reduced-motion` branch.** They all lean on the global CSS kill switch at remix `styles.css:171`. That is sufficient for `orbit` (pure `@keyframes`) and `PixelImage` (CSS), but **not** for the marquee (framer spring) or the 3D tilt (direct style writes). Those two get explicit `matchMedia` guards. `AnimatedBeam` turned out to need one too, for the same reason — see section 6.
- `animated-beam.tsx` takes `pathColor` as a **literal colour**, not a token. It lands on the SVG `stroke` *attribute*, and attribute values are not parsed for `var()`.
- `scroll-based-velocity.tsx` is **scroll-coupled, not a marquee.** It maps `scrollYProgress` to an x offset, so the text only moves while the page is scrolling and coasts to a stop when you stop. Its `baseVelocity` is a scroll-distance multiplier, not a speed. The divider now runs continuously and freezes on hover instead, which is a different mechanism — see section 6.

### Accessibility

The mockup honours `prefers-reduced-motion` in five places. One global kill switch instead,
plus explicit JS branches on: the count-up, the live clock, the marquee, the 3D tilt, and the
architecture beams. The orbit and the caret are pure CSS and are covered by the kill switch.

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
## 5. Phases — as built

Delivered on branch `redesign/bento`, one commit per phase. 67 files changed,
4,271 insertions, 2,012 deletions.

| Phase | Commit | Scope |
|---|---|---|
| 1 | `40c059e` | Token layer + typography swap |
| — | `e6377bc` | Prose theme, `cn` helper, `clsx`/`tailwind-merge`/`@tailwindcss/typography` |
| 2 | `aa50e68` | 12 primitives and ported motion components |
| 3 | `f2a122c` | Header, Footer, toaster |
| 4 | `ba4ac0a` | Home: hero + skills recreated from the mockup, rest of home |
| 5 | `683b0bd` | Projects, blogs, about, contact, login, 404, error, OG image |
| 6 | `beeeae9` | Typeshala |
| 7 | — | Cleanup sweep and verification |
| 8 | *(uncommitted)* | `AnimatedBeam` + the architecture section, ported after the fact |

### Commits after the as-built checkpoint

`3767585` recorded this document. Everything below it landed afterwards and is
not reflected in sections 1, 4 or 5:

| Commit | Scope |
|---|---|
| `c77974a` | Canonical Tailwind utilities in place of arbitrary values |
| `f28c41f` | Typeshala stack section switched to the remix `OrbitingCircles` |
| `7a61700` | Home skills diagram switched to the remix `OrbitingCircles` |
| `03bb044` | Contact route ported from the remix reference, design only |
| `ff88e79` | Contact world map with the Pokhara pin |
| `982a04d` | Header replaced with the remix reference's navbar |
| `942a472` | `KineticDivider` split out of `LatestBlogs`, header tweak, 180×180 `apple-touch-icon` |
| *(uncommitted)* | `AnimatedBeam` + the architecture section, ported after the fact |
| *(uncommitted)* | Kinetic divider rebuilt as a continuous marquee with a hover pause |
| *(uncommitted)* | Reference home CTA and reference footer replace the old home contact and the three-column footer; contact address moved to `CONTACT_EMAIL` |
| *(uncommitted)* | Divider rows widened from 3–2 labels to 4–3 |
| *(uncommitted)* | `/about` replaced wholesale with the reference route; `AboutClient.tsx` deleted; the reference's `Tools` block dropped as a duplicate of the home Skills section |

### Phase 0 — Safety
Branch `redesign/bento` branched off `main`; nothing was committed to `main`.
No history was rewritten. Verification ran against `npm run dev`.

### Phase 1 — Token layer and typography
`app/globals.css` rewritten as the token layer: 16 colour tokens plus the
three-step radius scale, the `clamp()` type scale, `--ease-out-expo`, the body
orbs, the global `:focus-visible` ring, `color-scheme: dark`, and the
`prefers-reduced-motion` kill switch. The `fade-up`, `orbit`, `blink` and
`pulse-ring` keyframes all landed here, which is what makes the ported
primitives animate instead of repeating the repo's original inert
`animationDelay` bug.

Radius tokens are deliberately **not** named `--radius-s/m/l`: those generate
`rounded-s`, `rounded-m` and `rounded-l`, and `rounded-l` collides with
Tailwind's existing `border-left-radius` utility.

Typography: Space Grotesk 300-700 (one 49 KB variable file) and IBM Plex Mono
400/500/600 replace Mulish and Fraunces. Payload 245,456 b -> 168,660 b.
`font-light` at `Hero.tsx:33` now resolves to a real 300 instance.

**The font trap.** The Google Fonts `latin` subset of IBM Plex Mono 600 carries
229 codepoints and is missing every box-drawing character (`U+2500/2502/251C/
2514`) — the entire content of the skills terminal that decision 2 requires. It
would have rendered as tofu. Full fonts were pulled from `google/fonts` and
converted to woff2 instead, giving 930 codepoints to match the existing 400/500.

### Phase 2 — Primitives
Twelve components: eight in `components/primitives/` and four in
`components/motion/` (one shared hook). The four porting traps in section 3 all
materialised, and each is commented in the source where a future editor would
otherwise re-break it.

The reference has a *fifth* motion component, `AnimatedBeam`, which section 3
lists as a motif but which was missed here. `components/motion/` shipped with
four files, not five. It was ported afterwards; see section 6.

### Phases 3-6
As described in sections 3 and 4 above. Typeshala came back into scope per
decision 6 and is now on the same system as the main domain.

### Phase 7 — Cleanup
All ten original bugs plus the seven found during verification are fixed. The
final sweep confirms zero occurrences of `text-small`, `text-white-900`,
`text-white-600`, `pt-25`, `animate-in`, `bg-gradient-to-*` (the Tailwind v3
syntax) and single-quoted `"use client"`. The five surviving `animationDelay`
props are all paired with `fade-up` and were checked individually.

---

## 6. What the plan did not anticipate

Found during the build. Each is fixed, but each is a trap worth recording.

| Finding | Where | Why it matters |
|---|---|---|
| The body fix was necessary but not sufficient | `app/page.tsx:57`, `login:30`, `not-found:5`, `error:18` | Each of those pages set its own `bg-gray-50` on its `<main>`. One edit could not fix them. Until `app/page.tsx:57` was dropped in Phase 4, every bento section rendered white-on-white. |
| The mobile Download CV link was 404 | `Header.tsx:115` | It pointed at `Abhishek_Gaire_CV.pdf` (HTTP 400). All five other references use `Abhishek_Gaire_Resume.pdf` (200). |
| `StatCell` declared a border with no colour | `components/primitives/StatCell.tsx` | Tailwind v4 preflight declares `border: 0 solid` with no `border-color`, so a bare `border-r` falls back to `currentColor`, not `--color-line`. |
| The `SectionHead` refactor removed every `h1` | `/projects`, `/blogs`, `/contact` | `SectionHead` rendered an `h2` unconditionally and those pages have no other heading, so three pages shipped with no `h1` at all. `SectionHead` now takes `as`. |
| `HomeContact` is shared across two routes | `components/home/HomeContact.tsx` | It is the page heading on `/contact` but only a section on `/`. A fixed level would have given `/` two `h1`s. It now takes `headingLevel`, defaulting to `h2`. |
| `LoginForm` was dark-on-dark | `components/auth/LoginForm.tsx` | `text-gray-900` inputs and `text-gray-700` labels sat on the new dark card, effectively invisible, and `outline-none` suppressed the global focus ring. |
| Native `<select>` popups render light without `color-scheme` | `app/globals.css` | The control is styled but its popup is not, so Firefox showed a light dropdown on `/projects` and `/blogs`. |
| An HTML entity inside a JSX *expression* does not decode | `TypeshalaPageClient.tsx` | A refactor moved `&apos;` into a ternary and it rendered literally. Entities only decode in JSX text positions. |
| A subagent overwrote the verification harness | — | A parallel agent replaced `verify.mjs` with a script hardcoded to one route that ignored its path argument, so a later sweep reported "PASS" for six routes while actually hitting the same one. The real sweep had to be re-run. |
| `AnimatedBeam` was listed as a Phase 2 motif and never ported | `../remix-of-pixel-perfect/src/routes/index.tsx:53-108,193-204` | Section 3 claims the primitive shipped. It did not — `components/motion/` went out with four components and the architecture section did not exist on the home page at all. Ported after the fact; see below. |

### The architecture section, ported late

`components/motion/AnimatedBeam.tsx` and `components/home/Architecture.tsx`, wired into
`app/page.tsx` between `<Skills />` and `<KineticDivider />` to match the reference's section
order. Three things about the port are worth recording.

**The node labels had to be rewritten, not copied.** The reference describes a NestJS service —
React and PostgreSQL into a Core App, out to a NestJS gateway. Copying it verbatim would have
put three technologies on the page that this site does not run. The topology is kept, because
the topology *is* the diagram: `Client` and `Redis` feed `Next.js`, which drives `Supabase`.
The lede was written to match, since it also described the reference's stack.

**The `ResizeObserver` had to observe more than the container.** The reference observes only
`containerRef`, sized off the container. That is fine when the node labels are fixed-size pills
laid out in a font that is already loaded. Here the fonts are self-hosted with `display: swap`,
so the first paint lays the labels out in the fallback face, the swap reflows them, and the
container — which is `w-full` — does not change size at all, so the observer never fires and
the beams land against stale geometry. Observing both endpoints as well costs two extra
`observe` calls and fixes it. This is the same class of bug as the `animationDelay` trap
recorded at section 3: a component that looks wired up and is not.

**The reference's `pathColor="gray"` is a named colour, not a token.** It lands on the SVG
`stroke` *attribute*, and attribute values are not parsed for `var()`. Passing
`var(--color-line)` there renders no stroke at all, silently. The default is a literal and the
prop is documented so the next editor does not "fix" it into a token.

### The kinetic divider was never a marquee

Asked to make the divider move continuously and pause on hover, the first thing to establish
was that it could not be done by tweaking the reference. The reference's
`scroll-based-velocity.tsx` is **scroll-coupled, not a marquee**: it maps `scrollYProgress` to an
x offset, so the rows only move while the page is scrolling and spring to a halt when you stop
scrolling. There is no clock in it at all, and no hover handling. Making it always move meant
replacing the mechanism, not the parameters.

`components/motion/ScrollVelocityRow.tsx` now advances a `useMotionValue` from
`useAnimationFrame`, wraps it on the period, and freezes in place when `paused` is set. The
period is *measured* — the distance from copy 1's left edge to copy 2's — because it is the text
width plus the `gap-8` between copies, and because the self-hosted `display: swap` fonts change
the text width after first paint. `KineticDivider` owns the hover state so the two rows stop as
one band; the pause has to come from JS because the rows are moved by a rAF loop, not a CSS
animation, so there is no `animation-play-state` to flip.

Two bugs surfaced while building it, both the same class as the ones section 3 warns about —
things that look wired up and are not:

- **The wrap range has to be `[-period, 0)`, not `[0, period)`.** Every copy is a child of the
  one translated element, so they all move together and the content's left edge is exactly `x`.
  Wrapping into a positive range slides the text right and leaves a growing blank strip on the
  left — up to a full period of it, which at 1280px was most of the row. Caught by screenshot,
  not by the assertions: the transforms were all in range, the row just had a hole in it.
- **The copy count cannot be a hardcoded 3.** Coverage needs `n * period >= rowWidth + period`,
  which 3 satisfies at this content size and stops satisfying the moment the phrase is shortened
  or the viewport widens. It is now computed from the measured period and the row width.

`KineticDivider.tsx` also carried the last two unremapped shadcn tokens on the site. Both were
silently dead rather than wrong-looking: `border-border` on the band (there is no
`--color-border`, so the hairline fell back to `currentColor` and rendered bright white instead
of `rgba(255,255,255,.09)`) and `from-background` on both edge fades (there is no
`--color-background`, so the whole gradient was dropped and the text was sliced off dead at both
edges). Confirmed by checking the compiled stylesheet for the emitted rules rather than by
eyeballing: an unknown colour token produces no rule at all, and nothing warns.

### The home CTA and the footer came from the reference

`components/home/ContactCta.tsx` and a rewritten `components/Footer.tsx`, both ported from
the reference. `components/home/HomeContact.tsx` and
`components/contact/ContactInformation.tsx` are deleted.

Two things are worth writing down, because both were already stale in the plan:

**The form was being rendered twice.** The old home contact section paired a details card with
a full copy of `ContactForm`, so `POST /api/contact` — Zod validation, the Redis rate limit, the
`stripTags` pass, the Supabase `Contacts` insert — was mounted on `/` as well as `/contact`. The
reference's home page ends with a short pitch and a link through to `/contact`, which is the
better arrangement and is what replaced it. The submission path is untouched; it just has one
mount point now.

**Section 6's note that `HomeContact` is "shared across two routes" had itself gone stale.**
It was true when written, and stopped being true at `03bb044`, which ported `/contact` to
stand on its own. By the time this change landed, `HomeContact` was imported by `app/page.tsx`
and nothing else, and `ContactInformation` only by `HomeContact`. So the two of them were a
dead two-file island, and removing the home CTA orphaned both. Checked before deleting rather
than assumed: the CV link survives in three places (hero, `/contact`, `/about`), so dropping
the footer's CV button makes nothing unreachable, and the `Header.tsx` comment that listed the
footer as a fourth route to the CV was corrected with it.

**The contact address is now a single constant.** `CONTACT_EMAIL` in `lib/site-urls.ts`, read
by both the footer and `/contact`. It was a string literal in two files, which is the exact
arrangement that let the footer and the contact page disagree — the same failure mode as the
duplicated `CV_URL` next to it. The value is now `abhishekgaire@protonmail.com`.

The reference's footer spells the name "Abhisek Gaire". Every other surface here — the title
tag, the JSON-LD, the social profiles, the hero — says "Abhishek Gaire", so the correct
spelling was used.

---

## 7. Definition of done — verified

- [x] Every route renders. No console errors, no hydration warnings.
- [x] `/blogs` URL state intact: all six params, both toggles, the
      `localStorage` fallback. Verified across ~15 param combinations including
      `view=bogus`, `limit=abc`, `page=-4`, `page=999`, and both the
      stored-preference restore and the URL-wins-over-storage path.
- [x] Typeshala's four states still distinct, verified by forcing each one.
- [x] Typeshala subdomain routing works, verified with a `typeshala.localhost`
      host; the off-subdomain redirect still returns 307.
- [x] Auth: `/admin` and `/admin/posts` both 307 to `/login` when logged out,
      across all four layers. The three write APIs return 401 with the
      `{ message }` shape. `/api/contact` is public and validates with 400.
- [x] Contact form submits; the Redis rate limit returns 429 on the 5th request
      in the window. The form is now mounted on one route, `/contact`, rather
      than on both `/` and `/contact`.
- [x] The contact address is rendered from `CONTACT_EMAIL` and nowhere else;
      `abhisekgaire7@gmail.com` no longer appears anywhere in the repository,
      and the new address is asserted absent from the rendered text of all seven
      public routes rather than only present in the two files that changed.
- [x] The CV is still reachable after the footer lost its download button —
      asserted by counting `Resume.pdf` anchors per route: present on `/`,
      `/about` and `/contact`.
- [x] JSON-LD validates and carries the CSP nonce on every page including
      Typeshala. Sitemap, robots and the OG image unchanged; the OG image
      returns 200 `image/png` at 1200x630.
- [x] Exactly one `<h1>` per page, re-confirmed across all seven public routes at
      390/720/900/1280px, and zero horizontal overflow on every route at every
      width. The `/about` exception that used to be recorded below is gone — the
      route was replaced wholesale and took the offending row with it.
- [x] Keyboard focus visible everywhere via the global accent ring.
- [x] `prefers-reduced-motion` honoured on all six motion surfaces: the marquee,
      3D tilt and architecture beams have JS guards, the clock and count-up
      branch in JS, and the orbit and caret are covered by the CSS switch plus a
      per-badge static angle. The beam guard is verified against a control pass —
      with motion allowed the same gradient attributes advance between samples,
      with `reduce` they hold still. Same control-pass shape for the marquee:
      running it must advance on its own with no scrolling, must freeze on hover
      and stay frozen, and must resume from the stopped offset rather than jump.
- [x] Marquee has no blank strip and no visible seam at any offset. The wrap
      range and the adaptive copy count are asserted directly against the
      measured `period` and row width, not just eyeballed.
- [x] Fonts self-hosted, no CDN. `npm run lint`, `npx tsc --noEmit` and
      `npm run build` all clean; 31/31 routes generate.
- [x] Mobile checked at 390, 720 and 900 px.
- [x] Admin untouched — `git diff main -- app/admin components/admin` is empty,
      as is the diff for `proxy.ts`, `lib/supabase`, `lib/sanitize.ts`,
      `app/api`, `components/AppShell.tsx`, `types/`, `utils/` and
      `next.config.ts`.

### Known, accepted, and out of scope

- **The OG image uses Satori's default font, not Space Grotesk.** Satori cannot
  load woff2, so matching the real typeface would mean committing a TTF for one
  image. Palette only, by decision.
- **`app/typeshala/_lib/release.ts:76` logs a rate-limit warning on every request,**
  and with a 5-minute revalidate a cold cache makes the rate-limited branch the
  common path. Pre-existing, needs an upstream fix.
- A pre-existing Next.js LCP advisory about a missing `loading="eager"` on blog
  card and project images.
- `next.config.ts` `images.remotePatterns` still whitelists only
  `**.supabase.co` and `images.unsplash.com`. No new image host was introduced.
- Two DB rows with `probe@example.com` were written to the `Contacts` table
  while verifying the rate limiter. Delete them if that table is inspected.
- **Resolved — `/about` used to overflow horizontally by 26px at 390px and 900px,**
  from a `flex-row-reverse` header row in `AboutClient.tsx`. Replacing the route
  with the reference version removed that component and the row with it, so the
  site has no horizontal overflow on any route at any of the four widths. The
  "zero horizontal overflow" claim is accurate again.

---

## 8. `isFeatured` — a schema migration, not a code change

Added after the redesign, so it is not covered by the "features do not change"
rule in section 0. The home route's Featured Work section used to take the three
most recently completed projects, which meant the rows on the home page were
chosen by a date comparison nobody controlled and a project could not opt out of
appearing there. It is now an explicit boolean, capped at two.

| File | Change |
|---|---|
| `supabase/migrations/20260929000000_add_projects_is_featured.sql` | The column, the seed, and a cap trigger |
| `types/project.ts` | `isFeatured?: boolean` |
| `components/home/FeaturedProjects.tsx` | `.eq("isFeatured", true).limit(2)` |
| `app/api/projects/route.ts` | `isFeatured` in the Zod schema |
| `components/admin/AdminProjectsManager.tsx` | Checkbox, live slot counter, Featured badge |
| `components/home/FeaturedProjectsClient.tsx` | Hero treatment gated on `length >= 3` |

### Run the migration before deploying

`/` returns 500 with `column Projects.isFeatured does not exist` until the SQL
has been applied. This is the only route affected — `/projects`, `/blogs`,
`/about`, `/contact` and the rest all still return 200, because only the home
fetcher filters on the new column. It is a hard failure rather than a silent
fallback to the old date-ordered query, on purpose: a fallback would keep
rendering three projects and look like the feature had half-worked.

Run it in the Supabase SQL editor, or `supabase db push`. The migration seeds the
two most recently completed projects so the section does not go blank on first
load; change the two ids in it to whatever should actually be featured.

### Two things about the trigger worth knowing

**The count must exclude `new.id`.** In a `BEFORE UPDATE` trigger the table still
holds the old row, so a plain `count(*) where isFeatured` includes the row being
edited: saving an already-featured project without touching its checkbox would
see 2, trip the limit, and fail. The exclusion is a no-op on `INSERT`, where the
new id matches nothing.

**Re-pointing the two is order-dependent.** Set the unwanted row false *before*
setting the wanted row true, or the trigger rejects the second statement and the
pair ends up as zero featured. The admin form avoids this by counting the slots
excluding the row being edited and warning before the write, but a direct
`update` in the SQL editor does not.

### Verified

The trigger is no longer an unverified assumption. Four independent checks:

| Check | Result |
|---|---|
| `Projects.isFeatured` exists, 7 rows, exactly 2 flagged | 2 newest by `completionDate`, matching the seed |
| Trigger installed, `FOR EACH ROW`, `BEFORE INSERT` + `UPDATE OF isFeatured`, enabled | Confirmed in the dashboard |
| `select prosrc from pg_proc` | Deployed body matches the migration file verbatim, including `and id <> new.id` |
| `update "Projects" set "isFeatured" = true where "title" = 'Smart Class'` | Succeeded. This is the discriminating test — a no-op write to a row that is *already* featured, which the exclusion exists to permit. Without it the trigger counts the row being edited, sees 2 and wrongly raises, breaking every plain re-save. |
| `update "Projects" set "isFeatured" = true where "title" = 'Personal Portfolio'` | Rejected: `P0001: At most 2 projects can be featured.` |

RLS is intact and worth recording, because it blocked the first attempt at this: a `PATCH`
carrying the **anon** key returned `200` with an empty body and changed nothing. PostgREST
reports an RLS-filtered row as a non-match rather than an error, so a write that was silently
denied looks identical to one that matched nothing. Any future test of a trigger or a policy
from outside an authenticated admin session will produce a false pass unless the affected row
count is checked.

### `/admin` was touched

Decision 5 puts `/admin` out of scope, and the "do not touch" table lists the
`Admin*Manager` files. Both of those were about the redesign not changing
behaviour or the write path, and neither is violated here: the checkbox is styled
in the existing light `slate-*` system, and the browser-direct Supabase update
and the `/api` create path are both untouched. A field nobody can set is half a
feature. Flagging it because it is a locked decision, not because the reasoning
depends on it.

---

## 9. Rollout

0. **Apply the `isFeatured` migration first.** `/` 500s until it lands. *(Done —
   applied and verified, see section 8.)*
1. Review `redesign/bento` and deploy the preview.
2. Exercise the Typeshala subdomain against the preview domain, since a
   main-domain preview cannot reach the rewrite.
3. Merge to `main`. Do not squash — the phase commits are the review history.
4. Leave `/admin` on the light `slate-*` system indefinitely. Revisit only if
   the marketing site moves far enough that the split reads as a bug.
