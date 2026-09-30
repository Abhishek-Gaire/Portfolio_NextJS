-- Seed the LMS microservices project: the 7th-semester Major Project 1.
--
-- Verified against the local checkout at
-- /home/absas/Desktop/College/Major-Project before this file was written. What is
-- described below is what is actually in that tree, not a plan for it:
--
--   src/frontend      React 18 + Vite + TypeScript + Tailwind CSS,
--                     socket.io-client, axios
--   src/gateway       NestJS + Express, JWT auth guard
--   src/backend       8 services: user, course, assessment, file,
--                     communication, notification, recommendation, analytics.
--                     NestJS, Mongoose, amqplib, @grpc/grpc-js +
--                     @grpc/proto-loader, redis/ioredis, socket.io, winston
--   src/rabbitMQ      broker definitions
--   src/nginx         reverse proxy
--   docker-compose    postgres, pg-admin, redis, rabbitmq, mongodb, mongo-express
--   src/gateway/certs mTLS key pairs for three hosts
--
-- This is the strongest project in the table by architecture, and it was not on
-- the site at all. It replaces nothing: there is no Minor Project 1 row, because
-- that one has no live URL and no repository either.
--
-- ORDER MATTERS. Projects_featured_limit caps featured rows at two and fires on
-- INSERT, so this row must be inserted with isFeatured = false and must not be
-- reordered after statement 1 of 20260929000001 -- Typeshala and
-- barshik-nepali-patro already hold the home page's two slots.
--
-- Run this ONCE. There is no unique constraint on Projects.slug or Projects.title,
-- so a second run inserts a duplicate.

insert into "Projects" (
  slug, title, description, "completionDate", image_url, technologies, role,
  challenges, solutions, live_url, github_url, category, "isFeatured"
) values (
  'lms-microservices',
  'LMS Microservices',
  'A learning management system split across eight independently deployable services -- users, courses, assessments, files, communication, notifications, recommendations and analytics -- behind a NestJS API gateway, with a React and Vite client on the front.',
  null,
  null,
  array['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'NestJS', 'Express', 'gRPC', 'RabbitMQ', 'Socket.IO', 'MongoDB', 'PostgreSQL', 'Redis', 'Nginx', 'Docker'],
  'Backend and microservices',
  'One deployable was never going to hold up. Assessment submission, live course communication, file delivery and analytics all have different scaling and failure profiles, and a single Node process couples them: a slow analytics query should not be able to stall a student's file upload. There is also no obvious owner for a monolith this size once more than one person is maintaining it.',
  'Eight services, each with its own model and its own failure domain, fronted by a NestJS gateway that terminates auth with a JWT guard. Inter-service traffic is split by what it is rather than sent through one queue: RabbitMQ for asynchronous work and fan-out, gRPC over proto contracts for request-response calls that need a typed schema. Realtime features run over Socket.IO, and Redis carries shared state and caching. Nginx fronts the whole thing, and mutual TLS key pairs are provisioned per host. Compose brings up Postgres, MongoDB, Redis and RabbitMQ together so the topology can be stood up in one command.',
  null,
  null,
  'Backend',
  false
);

-- completionDate is NULL and should be filled in.
--
-- I did not invent a date. The project is tagged 7th semester but the tree carries
-- no completion marker, and a made-up date would sort the row into an arbitrary
-- position on /projects, which orders by completionDate descending.
--
-- RESOLVED. The author supplied the real date -- six months before 2026-09-30 --
-- and 20260929000007_set_lms_completion_date.sql applies it as 2026-03-30. This
-- statement is left as-written because it has already run; do not fill the date
-- in here.
--
-- /projects fetches with nullsLast so an undated row lands at the end rather than
-- at the top, which is where PostgREST's default NULLS FIRST would otherwise put
-- it. Once the real date is known:
--
--   update "Projects" set "completionDate" = 'YYYY-MM-DD' where slug = 'lms-microservices';
--
-- live_url and github_url are both NULL. The repository is not published and the
-- stack is brought up locally, so there is nothing honest to link. This is the
-- same choice as the tics-nepal row: the card renders its link buttons only when
-- the corresponding URL is truthy, so NULL means the buttons are simply absent
-- rather than present and broken.
--
-- image_url is NULL for the same reason -- there is no screenshot in the tree.
-- The card falls back to FALLBACK_IMAGE in ProjectsPageClient.tsx.

select title, slug, category, "completionDate", "isFeatured"
from "Projects" where slug = 'lms-microservices';
