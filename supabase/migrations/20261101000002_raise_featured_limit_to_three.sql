-- Raise the Featured Work cap from two to three, and feature the school
-- management system as the third slot.
--
-- WHY 3. The two-slot cap was set when the only candidates were Typeshala and
-- barshik-nepali-patro. The school management system is the strongest client
-- work on the site and is currently not on the home page at all, and the cap
-- was the only thing stopping it. Leaving Typeshala and barshik featured and
-- adding the SMS keeps all three visible.
--
-- The change has three parts and they have to agree:
--   1. this function, which the Projects_featured_limit trigger calls;
--   2. FEATURED_LIMIT in components/home/FeaturedProjects.tsx, which is what the
--      home page query asks for;
--   3. FEATURED_LIMIT in components/admin/AdminProjectsManager.tsx, which mirrors
--      the trigger in the admin UI.
-- Raising only the database and not the two constants would store three rows
-- and render two. Raising only the constants would make the admin claim a slot
-- is free when Postgres will reject the write.
--
-- The college exclusion is unchanged and is repeated here verbatim: this
-- replaces the function, so anything omitted would be silently dropped. The
-- trigger itself is not recreated -- same name, same signature, same WHEN
-- clause -- so only the body and the column comment need rewriting.
--
-- Order matters for the UPDATE below. It is a plain single-row write and there
-- are currently two featured rows, so the new cap of three permits it. If a
-- future run finds three already featured, the trigger raises and the
-- transaction rolls back rather than leaving a half-applied cap change.
--
-- Run this ONCE, in the Supabase SQL editor or via `supabase db push`.

begin;

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
  ) >= 3 then
    raise exception 'At most 3 projects can be featured. Unfeature one first.';
  end if;

  return new;
end;
$$;

comment on column "Projects"."isFeatured" is
  'When true, this project is eligible for the home page Featured Work section. The home route shows at most 3, newest completionDate first.';

update "Projects"
set "isFeatured" = true
where slug = 'school-management-system';

commit;

-- Sanity check: exactly three featured, none of them college coursework, and
-- the newest-first order the home page will render.
select slug, title, tags, "completionDate", "isFeatured"
from "Projects"
where "isFeatured"
order by "completionDate" desc nulls last;
