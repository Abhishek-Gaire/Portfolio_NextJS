-- Seed the two 2026 projects the reference site has and this one did not:
-- the npm package and the Tauri desktop app.
--
-- The reference carries them in src/data/projects.ts as `barshik-nepali-patro`
-- and `typeshala`. Both mention them on /about already, so /projects was the
-- only route that contradicted them.
--
-- `id` is omitted on purpose: the column has a uuid default. Supplying one
-- would be fine, but letting the database mint it avoids a copy-paste collision.
--
-- image_url points at local files copied into public/images, not at Supabase
-- storage like the other seven rows. That is deliberate: it avoids requiring an
-- upload before these render, and a path under public/ needs no entry in
-- next.config.ts remotePatterns. Upload to storage later and swap the value if
-- you would rather have them consistent with the rest.
--
-- isFeatured is left false on both. Only two projects can be featured and the
-- current pair is Livingstone School Website + Smart Class, which the home page
-- is already showing. Flag these instead by unfeaturing those two first — the
-- trigger rejects a third, so order matters.
--
-- Run in the Supabase SQL editor. Re-running is safe: the titles are unique in
-- the ON CONFLICT sense below only if there is a matching constraint, which
-- there is not, so this will duplicate on a second run. Run it once.

insert into "Projects" (
  title,
  description,
  "completionDate",
  image_url,
  technologies,
  role,
  challenges,
  solutions,
  live_url,
  github_url,
  category,
  "isFeatured"
) values
  (
    'barshik-nepali-patro',
    'A precise, zero-dependency Bikram Sambat calendar library for React and React Native — bundled BS month tables, public holidays, and a shared hook that drives both web and native UIs.',
    '2026-01-01',
    '/images/project-patro.jpg',
    array['React', 'React Native', 'TypeScript', 'npm'],
    'Creator',
    'Almost every Bikram Sambat library on npm was either Angular-era, dependency-heavy, or quietly wrong around month boundaries. Naive BS↔AD converters also drift by a day because they are not normalised to the civil date.',
    'Month-length tables covering BS 2000 to 2100 ship bundled, so historical and projected years render without a network call. Conversion is epoch-based and normalised to the civil date, which removes the timezone and time-of-day drift. A missing requested year falls back to the latest known year rather than crashing. One useNepaliCalendar hook drives both the web and React Native render targets, behind separate nepali-patro, nepali-patro/native and nepali-patro/core entry points so bundles stay tree-shakeable. MIT licensed, zero dependencies.',
    'https://www.npmjs.com/package/barshik-nepali-patro',
    'https://github.com/Abhishek-Gaire/nepali-patro',
    'Frontend',
    false
  ),
  (
    'Typeshala',
    'A modern, open-source re-creation of the classic Nepali typing tutor, built with Tauri v2 + React and running natively on Windows, macOS and Linux.',
    '2026-01-01',
    '/images/project-typeshala.jpg',
    array['Tauri', 'React', 'TypeScript', 'Rust'],
    'Creator',
    'Typeshala is how a generation in Nepal learned to type, and the original only exists as 16-bit Windows binaries. A faithful re-creation needs both scripts, the full drill structure, and installers for three platforms — without shipping any original code or assets.',
    'Rebuilt from scratch with Tauri v2 + React. English has structured lessons with progression; Nepali ships Romanized and Traditional Preeti layouts, including a corrected Preeti key map with lesson coverage down to the All L3 sentences. The classic screens are all there — Home, Top, Bottom, All, Game and Free across Levels 1-3 — with a single-line centred prompt, paging, and the shift-key glow, and drills are generated from the key rules rather than hardcoded. Progress is local-first: results, trend charts and lifetime stats, bilingual UI, themes and settings, plus a bonus Ramayana game. v1.0.0 shipped native installers for Windows (x64-setup.exe and .msi), macOS on both Apple Silicon and Intel (.dmg), and Linux (.deb, .rpm, AppImage). MIT licensed, GitLab as source of truth.',
    'https://gitlab.com/abhishek_gaire/typeshala/-/releases',
    'https://gitlab.com/abhishek_gaire/typeshala',
    'Frontend',
    false
  );
