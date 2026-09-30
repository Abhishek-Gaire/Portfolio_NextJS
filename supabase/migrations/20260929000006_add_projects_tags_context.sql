-- Distinguish what kind of work a project row is, and stop the home page from
-- featuring college coursework.
--
-- Ten of the twelve rows in Projects had no way to say whether they were client
-- work, shipped open source, coursework, or a weekend build. Every one of them
-- said role = 'Creator', which is the actual problem: Digital Kirana's repository
-- lives under a teammate's GitHub account and Smart Class is a 6th-semester minor
-- project, so "Creator" is a claim the rows cannot support. Splitting the list
-- into labelled groups is only honest if the underlying rows are honest too, so
-- this migration fixes `role` in the same pass it adds `tags`.
--
-- Two columns rather than one:
--
--   tags    provenance. An array, because the buckets genuinely overlap --
--           Typeshala is both published open source and his own product, and a
--           single enum would force it to pick one and misdescribe it.
--   context  where the work sat. Semester and project number, for coursework.
--
-- NOT one overloaded column, because `category` is already the technology axis
-- (Full Stack / Backend / Frontend). Provenance and stack are independent:
-- Livingstone School is a Full Stack client site, the LMS is a Backend college
-- project, barshik is a Frontend OSS package. Keeping them separate means a
-- future filter can cross them without a combinatorial column.
--
-- Run this in the Supabase SQL editor, or via `supabase db push`.
-- Must run AFTER 20260929000005, so the LMS row exists and can be tagged.

alter table "Projects"
  add column if not exists "tags" text[] not null default '{}',
  add column if not exists "context" text;

comment on column "Projects"."tags" is
  'Provenance of the work, one or more of: client, personal, oss, hobby, college. Renders as chips on the project card and on the detail page. Empty array means untagged.';

comment on column "Projects"."context" is
  'Where the work sat, for coursework -- e.g. ''6th semester - Minor Project 2''. Rendered as its own line on the project detail page only when present. Deliberately does not name the university.';

-- Constrain the vocabulary in the database, not only in the TypeScript union.
-- `<@` is set containment: every element of tags must appear in the right-hand
-- array. A typo like 'osss' or a stray capital would otherwise render as a chip
-- nobody defined and silently disappear from every filter.
--
-- The existing 'Collaboration' member of ProjectCategory is a separate question
-- and is left alone: it is a category, not a tag, and no row uses it.
alter table "Projects"
  drop constraint if exists "Projects_tags_check";

alter table "Projects"
  add constraint "Projects_tags_check"
  check (tags <@ array['client', 'personal', 'oss', 'hobby', 'college']);

-- ---------------------------------------------------------------------------
-- Classification
--
-- Written as one explicit UPDATE per row, keyed on slug, and NOT as a default.
--
-- The column default is '{}', so a row that nobody touches stays untagged and
-- renders no chips. That is the safe failure: an untagged project claims
-- nothing. Had the default been 'personal', every row missed here would have
-- silently claimed to be real, independent work -- which is the same shape of
-- bug as the trailing-dash slug in 20260929000003, where a guard that could not
-- distinguish the bad value from the good one was worse than no guard.
--
-- Each statement's classification and role are the ones confirmed by the author:
--
--   client     Livingstone School and TICS Nepal are sites someone else's
--              business runs on. Livingstone has no repository because the
--              client's owns it.
--   oss        Typeshala ships GitLab releases; barshik-nepali-patro is on npm.
--              Both are tagged oss alone, per the author's call.
--   personal   His own builds: this site, and MovieFinder, which he built while
--              learning React.
--   hobby      Task Management System and Puppeteer Automation. Weekend scope,
--              no client and no coursework.
--   college    Assessed work. Smart Class was solo-dominant -- he did most of the
--              build -- so its role says so rather than claiming a flat solo
--              credit. Digital Kirana was a hackathon team and he took the
--              backend, which is what the role now says, and why the repository
--              is under a teammate's account.
--   college    LMS is the 7th-semester Major Project 1.

update "Projects" set
  tags = array['client'],
  role = 'Full-stack -- client site',
  context = null
where slug = 'livingstone-school-website';

update "Projects" set
  tags = array['client'],
  role = 'Full-stack -- consultancy site',
  context = null
where slug = 'tics-nepal';

update "Projects" set
  tags = array['oss'],
  role = 'Solo -- product build and releases',
  context = null
where slug = 'typeshala';

update "Projects" set
  tags = array['oss'],
  role = 'Solo -- published to npm',
  context = null
where slug = 'barshik-nepali-patro';

update "Projects" set
  tags = array['personal'],
  role = 'Solo',
  context = null
where slug = 'personal-portfolio';

update "Projects" set
  tags = array['personal'],
  role = 'Solo -- built while learning React',
  context = null
where slug = 'moviefinder';

update "Projects" set
  tags = array['hobby'],
  role = 'Solo',
  context = null
where slug = 'task-management-system';

update "Projects" set
  tags = array['hobby'],
  role = 'Solo -- automation learning',
  context = null
where slug = 'puppeteer-automation';

update "Projects" set
  tags = array['college'],
  role = 'Solo -- most of the build',
  context = '6th semester - Minor Project 2'
where slug = 'smart-class';

update "Projects" set
  tags = array['college'],
  role = 'Backend -- hackathon team',
  context = 'College hackathon'
where slug = 'digital-kirana';

update "Projects" set
  tags = array['college'],
  context = '7th semester - Major Project 1'
where slug = 'lms-microservices';

-- Guard against a slug in this file that does not exist. Every UPDATE above is
-- keyed on a slug, and PostgREST/Postgres will happily match zero rows and
-- report success, so a typo here would leave that project untagged with no
-- error anywhere. This is the check that catches it.
do $$
declare
  missing text;
begin
  select string_agg(expected, ', ')
    into missing
  from unnest(array[
    'livingstone-school-website', 'tics-nepal', 'typeshala',
    'barshik-nepali-patro', 'personal-portfolio', 'moviefinder',
    'task-management-system', 'puppeteer-automation', 'smart-class',
    'digital-kirana', 'lms-microservices'
  ]) as expected
  where not exists (
    select 1 from "Projects" p where p.slug = expected
  );

  if missing is not null then
    raise exception 'projects tagged in 20260929000006 but no row matches these slugs: %', missing;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Keep college coursework off the home page
--
-- The Featured Work teaser is a claim about what he wants to be known for. A
-- 6th-semester minor project sitting in that two-slot band says something
-- different, and the section deliberately shows only two.
--
-- This replaces the trigger from 20260929000000 rather than adding a second one,
-- because the exclusion has to run on the same pass as the cap: two triggers
-- would both have to reason about the same row, and the cap could fire on a row
-- the exclusion had already rejected.
--
-- Two changes from the original, and both are necessary:
--
-- 1. It fires on UPDATE OF "isFeatured", "tags", not just "isFeatured". With the
--    original signature, tagging an already-featured project as college would
--    bypass the check entirely and leave a coursework row featured until
--    something else touched isFeatured.
--
-- 2. The exclusion is a second condition inside the same guard, so a college row
--    is rejected whether it is being featured now or being tagged now.
--
-- The count still excludes new.id, for the reason recorded in 20260929000000: in
-- a BEFORE UPDATE trigger the table still holds the old row, so a plain count
-- would include the row being edited and break every plain re-save.
--
-- To change which two are featured, set the unwanted row false BEFORE setting the
-- wanted row true, or the trigger will reject the second statement.

create or replace function public.enforce_featured_project_limit()
returns trigger
language plpgsql
as $$
begin
  if new."isFeatured" and 'college' = any(coalesce(new."tags", '{}'::text[])) then
    raise exception 'College coursework cannot be featured on the home page. Untag it first, or feature a different project.';
  end if;

  if new."isFeatured" and (
    select count(*) from "Projects" where "isFeatured" and id <> new.id
  ) >= 2 then
    raise exception 'At most 2 projects can be featured. Unfeature one first.';
  end if;

  return new;
end;
$$;

drop trigger if exists "Projects_featured_limit" on "Projects";

create trigger "Projects_featured_limit"
before insert or update of "isFeatured", "tags" on "Projects"
for each row
when (new."isFeatured")
execute function public.enforce_featured_project_limit();

select slug,
       array_to_string(tags, ',') as tags,
       coalesce(context, '-') as context,
       role,
       "isFeatured"
from "Projects"
order by "completionDate" desc nulls last;
