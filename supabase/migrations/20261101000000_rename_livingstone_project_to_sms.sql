-- Replace the "Livingstone School Website" project row with the school
-- management system behind it, while keeping the site itself attached to the
-- same entry.
--
-- The old row described only the public marketing site at livingstone.edu.np.
-- The larger piece of work is the management system: a Node.js / Express 5 /
-- TypeScript API over MongoDB plus the React Native (Expo) app on top of it. One
-- row is right rather than two -- it is one client engagement -- but the row has
-- to name both deliverables, so the title, description and role are rewritten
-- and the site stays linked.
--
-- The public site was built by him and two teammates, so live_url and image_url
-- both stay. The screenshot is work he shipped, not someone else's site. The
-- role says "with two teammates" for the site and keeps the management system
-- attributed to him, which is the split the other project rows aim for.
--
-- Verified against the local checkouts at /home/absas/Desktop/Users/SMS before
-- writing this:
--   Backend_For_SMS   Express 5, TypeScript, Mongoose, 32 domain modules,
--                     JWT access/refresh, Redis-backed rate limiters, Zod,
--                     Puppeteer, FCM, Resend, Cloudinary/S3, Vitest, Docker,
--                     GitHub Actions CI + CD
--   SMS-app           Expo / React Native, Expo Router, TanStack Query,
--                     Zustand, NativeWind, Firebase messaging
--
-- slug changes with the title, so /projects/livingstone-school-website would
-- 404 after this runs. next.config.ts carries a permanent redirect from the old
-- URL to the new one; keep the two in sync if either changes again.
--
-- Run this ONCE, in the Supabase SQL editor or via `supabase db push`. It is
-- wrapped in a transaction so a failed guard cannot leave a half-renamed row.
-- The guard also refuses to overwrite an existing 'school-management-system'
-- row, because the unique index on slug would make that a confusing failure
-- halfway through the update.

begin;

do $$
begin
  if not exists (
    select 1 from "Projects" where slug = 'livingstone-school-website'
  ) then
    raise exception
      'no project with slug livingstone-school-website; nothing to rename';
  end if;

  if exists (
    select 1 from "Projects" where slug = 'school-management-system'
  ) then
    raise exception
      'a project with slug school-management-system already exists; resolve it before renaming';
  end if;
end;
$$;

update "Projects" set
  slug = 'school-management-system',
  title = 'School Management System',
  description = 'A school management system for Living Stone Academy, Nepalgunj: a Node.js, Express 5 and TypeScript REST API over MongoDB with JWT access/refresh authentication and role-based access for admins, teachers and parents, paired with a React Native (Expo) app that puts attendance, homework, marksheets, fees and announcements in teachers'' and parents'' hands. The public school website was built with two teammates on React, Tailwind CSS, TypeScript and Supabase.',
  "completionDate" = '2026-10-25',
  technologies = array[
    'Node.js', 'Express 5', 'TypeScript', 'MongoDB', 'Mongoose', 'Redis',
    'React Native', 'Expo', 'Firebase Cloud Messaging', 'Zod', 'Puppeteer',
    'Docker', 'GitHub Actions', 'React', 'Tailwind CSS', 'Supabase'
  ],
  role = 'Backend and mobile app -- client website with two teammates',
  challenges = 'The school already ran on records that have to agree with each other. A student''s fee balance, attendance percentage, marksheet and a teacher''s salary deduction all derive from the same enrolment and class data, so one stale or duplicated write surfaces as a wrong number on a report a parent is holding. The API also had to stay usable on low-end Android phones over unreliable connections, and it could not let one family see another family''s records. Most of the system''s weight sits in those two constraints: consistency across 32 modules that write to the same student record, and authorization that holds on every route rather than only on the screens that happen to hide a button.',
  solutions = 'The API is a modular layered Express 5 codebase -- routes, middleware, controllers, services and models -- split into 32 domain modules over MongoDB, with Mongoose schemas and the Counter pattern assigning sequential student IDs. Authentication is JWT access/refresh backed by server-side sessions, and every route is gated by role: admin, teacher, parent and staff. Twenty specialised Redis-backed rate limiters, Helmet, Zod validation on the request boundary and a system audit log cover the abuse and correctness cases. Marksheets and ID cards are printed server-side with Puppeteer, push notifications go out through Firebase Cloud Messaging, email through Resend, and uploads through Cloudinary and S3. Vitest and Supertest suites run in GitHub Actions next to tsc --noEmit, and CD builds and pushes the Docker image. The Expo app is Expo Router and TypeScript with TanStack Query for server state, Zustand for local state, NativeWind for styling and Firebase messaging for notifications, shipped as a native Android build.',
  live_url = 'https://www.livingstone.edu.np/',
  github_url = null,
  category = 'Full Stack',
  tags = array['client'],
  context = null
where slug = 'livingstone-school-website';

commit;

-- The 000006 provenance check still holds: this is client work, and `tags` is
-- constrained to the same vocabulary. `category` stays Full Stack because the
-- deliverable is an API plus an app, not a backend-only service.
select title, slug, category, tags, "completionDate", "isFeatured"
from "Projects"
where slug = 'school-management-system';
