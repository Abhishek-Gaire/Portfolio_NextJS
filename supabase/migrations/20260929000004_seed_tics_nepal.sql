-- Seed TICS Nepal: the consultancy site at https://ticsnepal.com.np/.
--
-- Verified against the local checkout at
-- /home/absas/Desktop/TICS/next-tics/ticsnepal before this file was written.
-- The local copy matches the deployed site: same nine public routes, the
-- [slug] service detail pages that generate the six /services/* entries in the
-- live sitemap, and the protected /admin area. Live responds 200 at the root
-- and 307 at /admin, which is the auth redirect the local admin layout
-- implies. So this describes the site that is actually running, not an
-- earlier draft of it.
--
-- ORDER MATTERS. The Projects_featured_limit trigger caps featured rows at two
-- and fires on INSERT. This row is inserted with isFeatured = false, so it
-- must not be reordered after statement 1 of 20260929000001 — the home page's
-- two slots are already taken by Typeshala and barshik-nepali-patro.
--
-- Run this ONCE. There is no unique constraint on Projects.title, so a second
-- run inserts a duplicate.

insert into "Projects" (
  slug, title, description, "completionDate", image_url, technologies, role,
  challenges, solutions, live_url, github_url, category, "isFeatured"
) values (
  'tics-nepal',
  'TICS Nepal',
  'A development consultancy site for TICS Nepal — six research and policy service verticals, a partner and client directory, and a private admin area for enquiries. Deployed on Cloudflare Workers.',
  '2026-05-23',
  '__TICS_IMAGE_URL__',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'Cloudflare Workers', 'Drizzle ORM', 'Neon', 'GSAP', 'Zod'],
  'Creator',
  'Content-heavy and serverless at the same time. Six service verticals each need a long-form page with its own overview, bullet set, stat and SEO metadata, and the whole site has to run without a conventional Node server. Enquiries and admin data still need somewhere durable to go.',
  'Six detail routes are generated from a single typed SERVICES constant in src/lib/constants.ts, so the copy, icons and sitemap entries cannot drift apart, and the sitemap builds itself from that list. Deployed through OpenNext to Cloudflare Workers, so there is no server to keep running. Drizzle ORM over Neon Postgres holds the contact and admin records, with the schema in versioned Drizzle migrations rather than hand-applied SQL. Zod validates both the client forms and the API boundary, and GSAP carries the motion.',
  'https://ticsnepal.com.np/',
  null,
  'Full Stack',
  false
);

-- github_url is deliberately NULL.
--
-- github.com/Abhishek-Gaire/next_tics returns 404 — the repo is private. The
-- sibling repos on the same account (nepali-patro, ReactPractice) are public
-- and return 200, so this is a visibility setting rather than a deleted repo.
-- A 404 link on the portfolio is worse than no link: the card renders the
-- "Code" button only when github_url is truthy, so NULL means the button is
-- simply absent.
--
-- To add it later, make the repo public and run:
--   update "Projects" set github_url =
--     'https://github.com/Abhishek-Gaire/next_tics' where slug = 'tics-nepal';
--
-- image_url must be a Supabase storage URL. The site's own OG image lives on
-- www.ticsnepal.com.np, which is NOT in next.config.ts remotePatterns — only
-- **.supabase.co and images.unsplash.com are — so pointing at it would make
-- next/image throw at render time and take the card down with it. Upload the
-- image and replace the placeholder before running this.

select title, slug, category, "completionDate", "isFeatured",
       case when github_url is null then 'no source link (private repo)'
            else github_url end as source
from "Projects" where slug = 'tics-nepal';
