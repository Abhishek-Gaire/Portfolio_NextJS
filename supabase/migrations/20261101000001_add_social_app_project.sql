-- Add the E2EE social app (social-app-mvp) to /projects.
--
-- Source: /home/absas/Desktop/OpenSource/mvp/social-app-mvp, git remote
-- git@gitlab.com:abhishek_gaire/social_e2ee.git. The row describes what is in
-- that tree as of its last commit (4af12bb, 2026-08-16), not the roadmap:
--   backend/  Express + TypeScript, PostgreSQL via Prisma, MinIO, JWT
--             access/refresh, Zod, Helmet, rate limiting, pino, Docker
--   app/      Expo SDK 57 / React Native 0.86 / React 19, Expo Router,
--             Zustand, TanStack Query, expo-sqlite, tweetnacl
--   native    SimpleX libsimplex/libsupport bundled from the official APK
--             v6.5.6, exposed through a Kotlin CoreKt JNI proxy and an Expo
--             Modules bridge
--
-- It is a personal build, and the source is public under AGPL-3.0. Both tags
-- apply and the 000006 schema allows overlapping provenance buckets, so both
-- are set rather than forcing a choice.
--
-- DATE. 2026-08-16 is the last commit on main, not a launch date. Nothing here
-- is deployed: app.json still has a placeholder release API URL, so live_url is
-- NULL and the card renders without a Live button. The project is still being
-- worked on; the description says MVP rather than claiming it is finished.
--
-- The licence matters for the copy, not just the repo. The native SimpleX
-- libraries are AGPL-3.0 and this project is a derivative work, so the source
-- is public, which is why github_url (the card's Code button) can be filled in
-- with the GitLab URL. Typeshala already uses that column for GitLab.
--
-- Run this ONCE, in the Supabase SQL editor or via `supabase db push`. There is
-- no unique constraint on Projects.title; the unique index on slug is the guard
-- used below.

begin;

do $$
begin
  if exists (
    select 1 from "Projects" where slug = 'social-app'
  ) then
    raise exception
      'a project with slug social-app already exists; nothing to insert';
  end if;
end;
$$;

insert into "Projects" (
  slug, title, description, "completionDate", image_url, technologies, role,
  challenges, solutions, live_url, github_url, category, "isFeatured", tags,
  context
) values (
  'social-app',
  'Social App',
  'An Instagram-style social app -- feed, posts, likes, comments, bookmarks, follows and profiles -- with JWT access/refresh auth, plus end-to-end encrypted direct messaging through a native SimpleX bridge in an Expo development build. The API is Express and TypeScript over PostgreSQL with Prisma and MinIO storage; the client is Expo SDK 57 and React Native 0.86 with Expo Router.',
  '2026-08-16',
  null,
  array[
    'React Native', 'Expo SDK 57', 'TypeScript', 'Expo Router', 'Zustand',
    'TanStack Query', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'MinIO',
    'JWT', 'SimpleX', 'Kotlin', 'Docker'
  ],
  'Solo -- personal MVP',
  'Two systems with different security models had to meet in one app. The social half is a conventional REST backend. The chat half is SimpleX, which exposes its core only as a compiled Haskell library and a slash-command wire protocol -- there is no JavaScript API to call. Encrypted post captions and comment bodies add a second problem: a content key has to be wrapped for every viewer who should be able to read them, or the post is unreadable to the people it was shared with. The custom native module also rules out Expo Go, so every install is a development build.',
  'The backend is a layered Express and TypeScript API over PostgreSQL with a multi-file Prisma schema, cursor-paginated feeds, Zod validation at the request boundary, Helmet, rate limiting, pino logging and MinIO for media. Auth uses short-lived JWT access tokens plus rotating 30-day refresh tokens stored hashed, so individual sessions can be revoked. For the bridge, SimpleX''s libsimplex and libsupport are bundled from the official APK and exposed through a Kotlin CoreKt JNI proxy and an Expo Modules bridge; the JS side wraps every slash command in a service layer, parses incoming ChatEvent payloads and renders them in a native chat UI. E2EE captions and comments use per-viewer wrapped content keys with tweetnacl on the client. Session hardening, EXIF-stripped uploads, mute and read receipts sit on top. Source is public under AGPL-3.0.',
  null,
  'https://gitlab.com/abhishek_gaire/social_e2ee',
  'Full Stack',
  false,
  array['personal', 'oss'],
  null
);

commit;

select title, slug, category, tags, "completionDate", "isFeatured"
from "Projects"
where slug = 'social-app';
