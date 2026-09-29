-- Seed the two 2026 projects the reference site has and this one did not:
-- the npm package (barshik-nepali-patro) and the Tauri desktop app
-- (Typeshala). Both are already named on /about, so /projects was the only
-- route contradicting them.
--
-- Run this ONCE, in the Supabase SQL editor. It is not idempotent: there is no
-- unique constraint on Projects.title, so a second run inserts two more rows.
--
-- Both image URLs were fetched and confirmed before this file was written:
--   web-calendar.png  200 image/png  501x632   (portrait, see note below)
--   typeshala.png     200 image/png  2559x1522
-- The web-calendar one is the library's own screenshot, so its shape is fixed
-- by the calendar it shows. On a project card it is centre-cropped by the
-- h-48 image box, which keeps the middle of the month grid and cuts the
-- "Baisakh / BS 2083" header off the top. Left as-is deliberately: the size is
-- the subject matter, not a presentation choice.
--
-- ORDER MATTERS. The `Projects_featured_limit` trigger caps featured rows at
-- two, and it fires on INSERT too. The two new rows are inserted with
-- isFeatured = true, so the existing pair has to be cleared first or the
-- insert is rejected. The three statements below run in this order for that
-- reason and must not be reordered.

-- 1. Free the two featured slots the home page is currently using.
update "Projects" set "isFeatured" = false where "isFeatured" = true;

-- 2. The npm package. Six months before today, so 2026-03-29.
insert into "Projects" (
  title, description, "completionDate", image_url, technologies, role,
  challenges, solutions, live_url, github_url, category, "isFeatured"
) values (
  'barshik-nepali-patro',
  'A precise, zero-dependency Bikram Sambat calendar library for React and React Native — bundled BS month tables, public holidays, and a shared hook that drives both web and native UIs.',
  '2026-03-29',
  'https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/web-calendar.png',
  array['React', 'React Native', 'TypeScript', 'npm'],
  'Creator',
  'Almost every Bikram Sambat library on npm was either Angular-era, dependency-heavy, or quietly wrong around month boundaries. Naive BS-to-AD converters also drift by a day, because they are not normalised to the civil date.',
  'Month-length tables covering BS 2000 to 2100 ship bundled, so historical and projected years render without a network call. Conversion is epoch-based and normalised to the civil date, which removes the timezone and time-of-day drift. A requested year that is missing falls back to the latest known year rather than crashing. One useNepaliCalendar hook drives both the web and the React Native render target, behind separate nepali-patro, nepali-patro/native and nepali-patro/core entry points so bundles stay tree-shakeable. MIT licensed, zero dependencies.',
  'https://www.npmjs.com/package/barshik-nepali-patro',
  'https://github.com/Abhishek-Gaire/nepali-patro',
  'Frontend',
  true
);

-- 3. Typeshala. Still actively developed, so dated today, 2026-09-29.
insert into "Projects" (
  title, description, "completionDate", image_url, technologies, role,
  challenges, solutions, live_url, github_url, category, "isFeatured"
) values (
  'Typeshala',
  'A modern, open-source re-creation of the classic Nepali typing tutor, built with Tauri v2 + React and running natively on Windows, macOS and Linux.',
  '2026-09-29',
  'https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/typeshala.png',
  array['Tauri', 'React', 'TypeScript', 'Rust'],
  'Creator',
  'Typeshala is how a generation in Nepal learned to type, and the original exists only as 16-bit Windows binaries. A faithful re-creation needs both scripts, the full drill structure and installers for three platforms, without shipping any original code or assets.',
  'Rebuilt from scratch with Tauri v2 and React. English has structured lessons with progression; Nepali ships Romanized and Traditional Preeti layouts, including a corrected Preeti key map with lesson coverage down to the All L3 sentences. The classic screens are all there — Home, Top, Bottom, All, Game and Free across Levels 1-3 — with a single-line centred prompt, paging and the shift-key glow, and drills are generated from the key rules rather than hardcoded. Progress is local-first: results, trend charts and lifetime stats, a bilingual UI, themes and settings, plus a bonus Ramayana game. v1.0.0 shipped native installers for Windows (x64-setup.exe and .msi), macOS on both Apple Silicon and Intel (.dmg), and Linux (.deb, .rpm, AppImage). MIT licensed, GitLab as source of truth.',
  'https://gitlab.com/abhishek_gaire/typeshala/-/releases',
  'https://gitlab.com/abhishek_gaire/typeshala',
  'Frontend',
  true
);

-- 4. Sanity check. Both featured, nothing else is.
select title, "completionDate", "isFeatured"
from "Projects"
where "isFeatured" = true
order by "completionDate" desc;
