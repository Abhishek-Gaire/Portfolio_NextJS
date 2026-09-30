-- Corrective: one slug came out with a trailing dash.
--
-- 20260929000002 produced "digital-kirana-" from the title "Digital Kirana\n",
-- which is stored with a trailing newline. Two things in that migration were
-- wrong, and both were meant to prevent exactly this:
--
-- 1. It ran `trim(both from regexp_replace(lower(title), ...))`. The regexp
--    already turned the newline into a dash, so by the time trim saw the value
--    there was no whitespace left for it to remove — and trim strips spaces,
--    not dashes. The order has to be: strip whitespace off the title FIRST,
--    slugify, then strip dashes.
--
-- 2. Its fallback guard was `slug !~ '^[a-z0-9][a-z0-9-]*$'`, which permits a
--    trailing dash: the `-` sits in the final character-class position, so
--    "digital-kirana-" matches. The pattern has to anchor the last character
--    too.
--
-- Only one row was affected, and the URL it produced worked — the page renders
-- at /projects/digital-kirana- — but it is a permanently ugly public URL for a
-- project, and it is the first thing anyone would see in a sitemap.
--
-- Safe to run more than once: it is idempotent, and a re-run after the first
-- pass matches nothing.

update "Projects"
set slug = btrim(
      regexp_replace(lower(btrim(title)), '[^a-z0-9]+', '-', 'g'),
      '-'
    )
where slug ~ '^-+' or slug ~ '-+$';

-- Anything still unusable falls back to its id, same as before.
update "Projects"
set slug = id
where slug is null or slug = '' or slug !~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$';

-- Sanity check: no leading or trailing dash on any row, no nulls, all unique.
select title, slug, length(slug) as len,
       (slug ~ '^-+' or slug ~ '-+$') as has_edge_dash
from "Projects"
order by "completionDate" desc;
