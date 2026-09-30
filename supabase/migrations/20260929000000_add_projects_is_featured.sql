-- Add an explicit "show this on the home page" flag to Projects.
--
-- The home route's Featured Work section used to take the three most recently
-- completed projects, which meant the two rows there were chosen by a date
-- comparison nobody controlled. This column makes the choice explicit.
--
-- Run this in the Supabase SQL editor, or via `supabase db push`.

alter table "Projects"
  add column if not exists "isFeatured" boolean not null default false;

comment on column "Projects"."isFeatured" is
  'When true, this project is eligible for the home page Featured Work section. The home route shows at most 2, newest completionDate first.';

-- Seed the flag so the home page is not empty after the deploy. Picks the two
-- most recently completed projects, which is what the old date-ordered query
-- was already surfacing, so the section looks the same on the first load
-- instead of going blank. Change these two ids to whatever should actually be
-- featured -- everything else stays false.
--
-- To re-pick later, by hand, either toggle the checkbox in /admin or:
--   update "Projects" set "isFeatured" = (id = '<uuid>' or id = '<uuid>');

update "Projects" p
set "isFeatured" = true
where p.id in (
  select id
  from "Projects"
  order by "completionDate" desc nulls last
  limit 2
);

-- Guard the invariant in the database as well as in the fetcher. The fetcher
-- already does .eq('isFeatured', true).limit(2), so this trigger is belt and
-- braces: it stops a third project being flagged by a direct table write and
-- silently ignored, which is the kind of thing that is very hard to debug from
-- the home page alone.
--
-- To change which two are featured, set the unwanted row false BEFORE setting
-- the wanted row true, or the trigger will reject the new one.
--
-- The count deliberately excludes `new.id`. In a BEFORE UPDATE trigger the
-- table still holds the old row, so a plain count(*) would include the row
-- being edited: saving an already-featured project without touching its
-- checkbox would then see 2, trip the limit, and fail. On INSERT the new id
-- matches nothing, so the exclusion is a no-op and the behaviour is the same.
create or replace function public.enforce_featured_project_limit()
returns trigger
language plpgsql
as $$
begin
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
before insert or update of "isFeatured" on "Projects"
for each row
when (new."isFeatured")
execute function public.enforce_featured_project_limit();
