# Abhishek Gaire — Portfolio

A personal portfolio website with a blog, a case-study project archive, and a small
admin CMS to manage both. Built with Next.js 16 (App Router) on Supabase, deployed
to Vercel.

Live at **[abhishekgaire.com.np](https://abhishekgaire.com.np)**. A second route
(`/`) on the **typeshala.abhishekgaire.com.np** subdomain serves the landing page for
Typeshala, a separate open-source typing tutor — see [Split-domain hosting](#split-domain-hosting).

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript 5 (`strict`) |
| Styling | Tailwind CSS v4 — CSS-first config in `app/globals.css` |
| Database / Auth | Supabase (Postgres + Auth + Storage) |
| Rate limiting | Upstash Redis, with an in-memory fallback |
| Editor | TipTap |
| Motion | Framer Motion + a few hand-rolled primitives |
| Hosting | Vercel |

Requires **Node >= 20.9**. No `.nvmrc` is committed; Node 22 LTS is what this was
developed against.

---

## Getting started

```bash
npm install
npm run dev
```

There's no `.env.example` in the repo, so create `.env.local` by hand from the table
below. Until the Supabase vars are set, every page that reads the database throws
`Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL`.

| Script | |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (flat config, `core-web-vitals` + `typescript`) |

There is no test script and no typecheck script — `npx tsc --noEmit` is the way.

---

## Environment variables

`.gitignore` ignores `.env*`, so a fresh clone has nothing. Set these in `.env.local`
and in **Vercel → Settings → Environment Variables**.

### Required

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Throws at startup if missing. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anon key — used for *both* public reads and authenticated writes. **There is no service-role key anywhere in this codebase**; Supabase RLS is the only authorization layer. |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin, used for JSON-LD, canonicals, `sitemap.xml`, and `robots.txt`. Falls back to `https://www.abhishekgaire.com.np` if unset. |

### Optional

| Variable | Default | Notes |
|---|---|---|
| `NEXT_PUBLIC_PORTFOLIO_URL` | `NEXT_PUBLIC_SITE_URL` or `https://abhishekgaire.com.np` | Portfolio origin. Takes precedence over `NEXT_PUBLIC_SITE_URL` for cross-site links. |
| `NEXT_PUBLIC_TYPESHala_SITE_URL` | `https://typeshala.abhishekgaire.com.np` | Note the lowercase `s` in `TYPESHala` — easy to typo, and a typo silently falls back to the default. |
| `UPSTASH_REDIS_REST_URL` | — | With the token below, enables distributed rate limiting on the contact form. |
| `UPSTASH_REDIS_REST_TOKEN` | — | Without both, rate limiting falls back to a per-instance `Map` that resets on redeploy. |
| `GITHUB_TOKEN` | — | Server-only PAT. Raises the GitHub Releases API quota from 60/hr to 5,000/hr for the Typeshala download page. |

Do not set `NODE_ENV=production` in `.env.local` — `proxy.ts` will start force-
redirecting `http://localhost` to `https://`.

---

## Routes

```
/                      Home — hero, skills, architecture, featured projects, CTA
/about                 Bio
/contact               Contact form → POST /api/contact → Contacts table
/blogs                 Blog index. Search, tag filter, sort, grid/list, pagination
/blogs/[slug]          Post detail. Revalidated every 300s, statically generated
/projects              Case studies, newest completion first
/projects/[slug]       Case study detail, fully dynamic
/login                 Admin sign-in (redirects to /admin when already authed)
/admin                 Dashboard — record counts
/admin/posts           Blog CMS
/admin/projects        Project CMS
/admin/tags            Tag CMS
/admin/notifications   Inbox for contact-form submissions
/typeshala             Product landing page (served on the subdomain)

/robots.txt  /sitemap.xml  /opengraph-image
```

### API routes

All four are **POST-only**:

```
/api/blogs     create a post       (auth required, Zod-validated)
/api/projects  create a project    (auth required, Zod-validated)
/api/tags      create a tag        (auth required, Zod-validated)
/api/contact   submit a message    (public, rate limited, Zod-validated)
```

Updates and deletes deliberately do **not** go through API routes — they run
browser-direct against Supabase and rely on RLS. See [Auth](#auth-and-the-three-supabase-clients).

---

## Architecture notes

### Auth and the three Supabase clients

The three factories in `lib/supabase/` are deliberately different:

- **`server.ts`** — anon key, `persistSession: false`, does **not** touch cookies.
  Used for every public read. Because it never reads cookies, its fetches are
  cacheable, which is what makes the `revalidate = 300` ISR work.
- **`server-auth.ts`** — `createServerClient` bound to `await cookies()`, with
  cookie writes in a `try/catch` (server components cannot set cookies). Used by
  `/admin`, `/login`, and the authenticated API routes.
- **`client.ts`** — browser singleton, cached on `globalThis` so it survives
  Fast Refresh.

### Three independent gates on `/admin`

1. **`proxy.ts`** — calls `supabase.auth.getUser()` (validates the JWT, not just
   cookie presence) and redirects `/admin ↔ /login`.
2. **`app/admin/layout.tsx`** — server-side `getUser()` + `redirect()`, and sets
   `robots: noindex, nofollow, nocache` for the whole segment.
3. **`components/admin/AdminGate.tsx`** — client-side session check plus an
   `onAuthStateChange` subscription that bounces the user to `/login` if the
   session drops mid-visit.

Also disallowed in `app/robots.ts`: `/admin`, `/login`, `/api/`.

### `proxy.ts`

Next 16 renamed `middleware.ts` to `proxy.ts`. This one file does four jobs:

1. **HTTPS redirect** in production when `x-forwarded-proto: http`.
2. **CSP nonce** — mints a per-request nonce, puts it on the request headers so
   Server Components can read it, and builds the policy. Every
   `dangerouslySetInnerHTML` JSON-LD `<script>` carries the matching `nonce`.
3. **Split-domain hosting** (below).
4. **Admin/login auth redirects** (above).

Because it runs on the edge runtime, `lib/site-urls.ts` — which it imports — is
restricted to plain string operations, no Node APIs.

### Split-domain hosting

`proxy.ts` branches on the `Host` header:

- On the Typeshala subdomain, `/` is **rewritten** to `/typeshala`, and every other
  page route is **redirected** to the same path on `PORTFOLIO_URL` so visitors never
  get stranded on a page that doesn't exist there.
- Cross-subdomain links must be **absolute** — a relative `/` would stay on the
  current subdomain. `lib/site-urls.ts` is the single source of truth for both origins.

Localhost and preview deployments are unaffected.

### Sanitization — two layers

Blog content is sanitized **on write** (`lib/sanitize.ts` → `sanitize-html` with an
explicit tag/attribute/scheme allowlist, called in `app/api/blogs/route.ts`) and again
**on read** (immediately before `html-react-parser` renders it in `BlogContent.tsx`).
The contact form additionally runs `DOMPurify` client-side and a `stripTags` pass
server-side.

### Rate limiting

`/api/contact` only: 5 requests per 10 minutes, keyed by client IP from
`x-forwarded-for`. Returns `429` with a `Retry-After` header. Uses Upstash Redis when
configured, otherwise a module-level `Map`.

### Caching

Per-route ISR via `export const revalidate = 300` on the home, projects, and blogs
pages, plus `next: { revalidate: 300 }` on the GitHub fetches. There is no
`unstable_cache`, `"use cache"`, or manual `cache()` anywhere.

`app/blogs/page.tsx` does all filtering, sorting, and pagination in JS after a single
`Blogs` fetch — search state lives in the URL, so every view is server-rendered.

### Design system

All tokens live in the `@theme` block in `app/globals.css` — surfaces, borders, text
tiers, the teal `#2dd4bf` accent, four radii, the type scale, container widths, and
motion easings. There is no `tailwind.config.*`.

One gotcha worth knowing: `lib/utils.ts` extends `tailwind-merge` to register the
custom type sizes (`micro`/`caption`/`lede`/`title`/`display`) in the **font-size**
group. Stock `tailwind-merge` classifies every `text-*` as a *color* and silently
drops them when merging.

`/admin` deliberately does **not** use the portfolio theme — it's a CMS, so it stays
on a plain light `slate-*` palette with `--focus-ring` opted out.

### Images

`next.config.ts` whitelists exactly two remote hosts: `https://**.supabase.co` and
`https://images.unsplash.com`. **Adding a host here is required** or `next/image`
throws and takes the whole card down.

Every `next/image` in the codebase passes `unoptimized`, so browsers download the
original full-size file — keep uploaded assets small.

---

## Database

Four tables plus one Storage bucket:

| | |
|---|---|
| `Blogs` | `title`, `content` (sanitized HTML), `excerpt`, `slug`, `imageUrl`, `tags`, `publish`, `author`, timestamps |
| `Projects` | `title`, `slug`, `description`, `category`, `image_url`, `technologies`, `role`, `challenges`, `solutions`, `context`, `live_url`, `github_url`, `completionDate`, `isFeatured`, `tags` |
| `tags` | `id`, `name` — note the lowercase table name |
| `Contacts` | `name`, `email`, `message`, `created_at` — written by the public form |
| bucket `images` | Blog and project images, used by the admin upload widget |

### Migrations

Plain SQL in `supabase/migrations/`, applied in filename order via the Supabase SQL
editor or `supabase db push`. There is no `config.toml` and no seed script — the
migrations *are* the seeding.

A few things the migration headers stress, because they're easy to get wrong:

- **`20260929000002` + `20260929000003` must both be applied on a fresh database.**
  000002 has a trailing-newline bug that produced `digital-kirana-`; 000003 fixes it
  with a corrected trim order and regex. Running only 000002 leaves broken slugs.
- **Three seeds are not idempotent** (`000001`, `000004`, `000005`). There's no unique
  constraint on `Projects.title`, so a second run inserts duplicates.
- `enforce_featured_project_limit()` is a trigger capping featured projects at 2, and
  after 000006 it also refuses to feature anything tagged `college`.
- `000006` and `000007` end with `DO $$` post-conditions that raise if the intended
  rows didn't match.

Two Supabase behaviours that make debugging painful, noted here because they cost
real time: an `UPDATE ... WHERE <wrong key>` reports success and changes nothing, and
an RLS-filtered row shows up as a **non-match**, not an error — so a denied write looks
exactly like a no-op.

---

## Gotchas

- **`*GUIDE.md` is in `.gitignore`.** `SECURITY_GUIDE.md` and `FIX_GUIDE.md` exist in
  the working tree but are **not tracked in git** — a fresh clone won't have them.
  (`REDESIGN_PLAN.md` is tracked; it doesn't match the glob.) If those docs matter,
  the glob should be replaced with explicit filenames.
- **`lib/project-links.ts` keys download URLs off project *title*.** It's a title-keyed
  lookup, so renaming a project in the CMS silently breaks its download button.
- **`app/robots.ts`, `sitemap.ts`, and the root layout hardcode the site identity**
  (`siteUrl`, `siteName`, `defaultTitle`) as a fallback alongside the env vars. Changing
  domains means editing code, not just env.
- **`public/app-ads.txt`** is a ~200-line ad-exchange/reseller list with no ad-serving
  code anywhere in the app. Inherited boilerplate, or a feature that was never built.

---

## Deploying

Push to `main` and Vercel builds it. Before your first deploy:

1. Set `NEXT_PUBLIC_SITE_URL` in the Vercel env vars — without it, canonicals,
   `sitemap.xml`, and JSON-LD all point at `example.com`.
2. Apply the migrations in order against your Supabase project.
3. Confirm the domain you deploy to matches what `lib/site-urls.ts` expects, since
   `proxy.ts` makes routing decisions from the `Host` header.