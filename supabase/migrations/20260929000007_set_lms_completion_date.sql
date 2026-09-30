-- Set the LMS completion date.
--
-- 20260929000005 inserted lms-microservices with completionDate = null, on the
-- grounds that inventing a date would sort the row into an arbitrary position
-- on /projects. That was the right call at write time and the author has since
-- supplied the real answer: six months before 2026-09-30, i.e. 2026-03-30.
--
-- This file exists rather than an edit to 20260929000005 because that one has
-- already run against the live database. Same reasoning as
-- 20260929000003_fix_trailing_dash_slug.sql: a migration that has executed is
-- the record of what actually happened, and rewriting it would make the file
-- disagree with the database.
--
-- Where the date lands: /projects orders by completionDate descending, so at
-- 2026-03-30 the LMS sits third, immediately above barshik-nepali-patro
-- (2026-03-29) and below TICS Nepal (2026-05-23). That is why the day matters
-- as well as the month -- one day earlier and it falls below barshik.
--
-- Nothing else is touched. In particular this row stays isFeatured = false, and
-- the Projects_featured_limit trigger would refuse to flip it anyway: the row is
-- tagged college.

update "Projects"
set "completionDate" = '2026-03-30'
where slug = 'lms-microservices';

-- Fail loudly rather than silently updating zero rows. An UPDATE ... WHERE on a
-- bad slug reports success and changes nothing, which is exactly the shape of
-- bug that 20260929000003 records.
do $$
begin
  if not exists (
    select 1 from "Projects"
    where slug = 'lms-microservices' and "completionDate" = '2026-03-30'
  ) then
    raise exception 'lms-microservices did not pick up completionDate 2026-03-30';
  end if;
end;
$$;

select slug, "completionDate", "isFeatured",
       array_to_string(tags, ',') as tags
from "Projects"
order by "completionDate" desc nulls last;
