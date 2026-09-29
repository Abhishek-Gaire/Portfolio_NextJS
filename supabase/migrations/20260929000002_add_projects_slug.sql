-- Give Projects a stable slug, for /projects/<slug> detail pages.
--
-- Why stored rather than derived at read time: the detail page URL has to
-- survive someone retyping a project title in the admin form. A slug computed
-- from title.toLowerCase() would 404 every existing link the day a title gains
-- or loses a character, and there is no way to recover the old URL from the row.
--
-- The backfill trims. "Digital Kirana" is stored with a trailing newline, and
-- without trim() that row slugifies to "digital-kirana-" with a trailing dash.
-- That is the exact class of bug that is invisible until someone hits the page.
--
-- ⚠ BUG IN THIS FILE, FIXED IN 20260929000003. Read that one too. Two lines
-- below were meant to prevent this and both failed:
--   - `trim(both from regexp_replace(...))` trims SPACES, but the regexp has
--     already turned the newline into a dash by then. Correct order is
--     btrim(title) -> slugify -> btrim(result, '-').
--   - the guard `slug !~ '^[a-z0-9][a-z0-9-]*$'` allows a trailing dash,
--     because `-` occupies the last character-class position.
-- Left as-written because it has already run against the live database and this
-- file is the record of what actually happened. Do not replay it on a fresh
-- database without applying 000003 as well.
--
-- NOT NULL is not set: the column is added nullable and then backfilled, and
-- only then enforced. Adding it NOT NULL with no default would fail outright on
-- a table that already has nine rows.
--
-- Unique, so a collision is a loud error rather than two projects sharing a URL.
--
-- Run this BEFORE deploying the /projects/[slug] route. A row with a null slug
-- is skipped by the page's lookup and renders as 404, so deploying the route
-- first means live pages 404 until this lands.

alter table "Projects"
  add column if not exists slug text;

update "Projects"
set slug = trim(both from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null;

-- A title that slugifies to nothing (punctuation only, or empty) would leave
-- an empty slug, which is falsy-ish but not null and would produce a
-- /projects/ URL. Point those at their id instead so every row has a usable
-- key and the fallback is unambiguous.
update "Projects"
set slug = id
where slug is null or slug = '' or slug !~ '^[a-z0-9][a-z0-9-]*$';

create unique index if not exists "Projects_slug_key" on "Projects" (slug);

alter table "Projects"
  alter column slug set not null;

comment on column "Projects".slug is
  'URL key for /projects/<slug>. Stored, not derived, so a title edit cannot break a live URL.';

-- Sanity check: one row per project, all keys usable, nothing null.
select title, slug, length(slug) as len
from "Projects"
order by "completionDate" desc;
