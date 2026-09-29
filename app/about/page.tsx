import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/primitives/Breadcrumb";

import { Reveal } from "@/components/primitives/Reveal";
import { KineticDivider } from "@/components/home/KineticDivider";

export const metadata: Metadata = {
  title: "About Me - Abhishek Gaire",
  description:
    "Learn about Abhishek Gaire's journey as a Full-Stack Developer, his values, skills, and passion for creating exceptional web applications.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Abhishek Gaire - Full-Stack Developer",
    description:
      "Discover the story behind the code. Learn about my journey, values, and passion for web development.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Abhishek Gaire - Full-Stack Developer",
    description:
      "Discover the story behind the code. Learn about my journey, values, and passion for web development.",
  },
};

/*
 * Whole route ported from the reference project:
 * ../remix-of-pixel-perfect/src/routes/about.tsx
 *
 * This replaces a client component that carried skill progress bars, a set of
 * value cards and a "Download CV" button. The CV is still reachable from the
 * hero, the contact page and the footer, so nothing became unreachable.
 *
 * One section from the reference is not ported. Its "Tools" block listed the
 * same frontend / backend / database / tools groups, in the same order, as the
 * home page's Skills section — which carries the fuller version in the orbit
 * rings and the skills terminal. Two copies of the same list on two routes is
 * a maintenance trap: they drift, and then the site contradicts itself. The
 * reference has the same duplication, because its home page and its about page
 * are separate; this site merges them.
 *
 * This is a server component. The previous version was "use client" and
 * shipped its whole 381-line tree to the browser; nothing here needs state or
 * an effect. `Reveal` and `KineticDivider` are client components and nest
 * inside it without pulling the page itself across the boundary.
 *
 * Token mapping, same as the header, footer and home CTA ports: `max-w-5xl
 * px-5` to the shell, `text-foreground` to `text-hi`, `text-muted-foreground`
 * to `text-mid`, `text-primary` to `text-accent`, `border-border` to
 * `border-line`, `bg-card` to `bg-surface`, `rounded-lg` to `rounded-card`,
 * and the Tailwind v3 `bg-gradient-to-b` to the v4 `bg-linear-to-b`. The
 * `gap-px` + `bg-border` hairline grids become `gap-px` + `bg-line`.
 *
 * The reference's `focus-visible:outline-none focus-visible:ring-2
 * focus-visible:ring-ring focus-visible:ring-offset-*` is dropped throughout:
 * `ring-ring` does not exist here, and `outline-none` would suppress the
 * global `:focus-visible` accent outline in globals.css.
 *
 * The reference spells the name "Abhisek". Every other surface here says
 * "Abhishek Gaire", so the correct spelling is used.
 */

const principles = [
  {
    title: "Type the whole path",
    body: "From database schema to API contract to UI props — if it can be checked at compile time, it should be. Runtime surprises are a design failure.",
  },
  {
    title: "Events over sync",
    body: "Realtime systems stay consistent when every mutation is an ordered event: validate, persist, then fan out. Reconnection becomes replay, not recovery.",
  },
  {
    title: "Motion earns its cost",
    body: "Animation is decoration unless it communicates state. Every effect on this site is scroll- or hover-driven, gated behind reduced-motion, and free on first paint.",
  },
  {
    title: "Design for the operator",
    body: "A system that only the person who wrote it can maintain isn't finished. Content models, idempotent writes, and boring failure modes are features.",
  },
];

const journey = [
  {
    period: "2022",
    title: "Started Full-Stack Journey",
    body: "Began my journey into web development, focusing on the MERN stack.",
  },
  {
    period: "2023",
    title: "First Major Projects",
    body: "Built several full-stack applications and gained hands-on experience.",
  },
  {
    period: "2024",
    title: "Advanced Specialization",
    body: "Expanded expertise in modern frameworks and deployment strategies.",
  },
  {
    period: "2025",
    title: "New Frameworks, First Package",
    body: "Learned Next.js, NestJS and Redis caching — and built barshik-nepali-patro, my first package published to npm.",
    link: {
      label: "npmjs.com/package/barshik-nepali-patro",
      href: "https://www.npmjs.com/package/barshik-nepali-patro",
    },
  },
  {
    period: "2026",
    title: "Shipped Typeshala",
    body: "Created and released Typeshala v1.0.0 — a modern, open-source re-creation of the classic Nepali typing tutor, built with Tauri v2 + React, running natively on Windows, macOS and Linux.",
    link: {
      label: "gitlab.com/abhishek_gaire/typeshala",
      href: "https://gitlab.com/abhishek_gaire/typeshala",
    },
  },
];

const now = [
  "Building realtime classroom tooling for a school in Pokhara",
  "Refactoring an automation pipeline to run entirely on schedules",
  "Writing about the MERN stack — what holds up, what doesn't",
];

const beyondCode = [
  {
    title: "Chasing tech trends",
    body: "Exploring the latest developments in web technology keeps the toolkit sharp — there's always a better way to build something.",
  },
  {
    title: "Open-source contributions",
    body: "Giving back to the tools I build with. Community projects are where ideas get tested outside client constraints.",
  },
  {
    title: "Mountain views",
    body: "Pokhara's backdrop does half the thinking. Time away from the screen is part of the craft.",
  },
];

const FACTS = [
  { k: "name", v: "Abhishek Gaire" },
  { k: "role", v: "Full-stack developer" },
  { k: "location", v: "Pokhara, Nepal · UTC+5:45" },
  { k: "status", v: "Open to new work" },
];

const SUMMARY = [
  { k: "focus", v: "Full-stack · Realtime" },
  { k: "based in", v: "Pokhara, Nepal" },
  { k: "status", v: "Open to new work" },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-shell px-6 py-16">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                About · Pokhara, Nepal
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl text-[clamp(30px,4.4vw,44px)] leading-[1.1] font-bold tracking-tight text-balance text-hi">
                I build systems that behave the same on day one and day one
                hundred.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-mid">
                <p>
                  I&apos;m Abhishek Gaire, a full-stack developer. My journey
                  into web development began with curiosity and has evolved into
                  a passion for creating digital solutions that make a
                  difference. Based in the beautiful city of Pokhara, Nepal,
                  I&apos;ve dedicated myself to mastering the art and science of
                  full-stack development.
                </p>
                <p>
                  What started as a fascination with how websites work has grown
                  into expertise in modern web technologies. I specialize in the
                  MERN stack, but I&apos;m always eager to learn new
                  technologies and frameworks that can help me build better
                  solutions.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="hidden lg:block">
            <div className="relative overflow-hidden rounded-card border border-line bg-surface">
              <div className="grid-pattern flex h-40 items-end justify-center border-b border-line">
                <div className="flex size-24 translate-y-12 items-center justify-center rounded-full border border-line bg-bg font-mono text-xl font-semibold text-accent">
                  AG
                </div>
              </div>
              <dl className="space-y-3 px-5 pt-16 pb-5">
                {FACTS.map((f) => (
                  <div
                    key={f.k}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="font-mono text-[11px] tracking-widest text-mid uppercase">
                      {f.k}
                    </dt>
                    <dd className="text-right font-mono text-xs text-hi">
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
            {SUMMARY.map((s) => (
              <div key={s.k} className="bg-bg p-5">
                <dt className="font-mono text-[11px] tracking-widest text-mid uppercase">
                  {s.k}
                </dt>
                <dd className="mt-2 font-mono text-sm text-hi">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <KineticDivider />

      <section
        className="mx-auto max-w-shell px-6 py-16"
        aria-labelledby="principles-heading"
      >
        <Reveal>
          <h2
            id="principles-heading"
            className="font-mono text-xs tracking-widest text-mid uppercase"
          >
            How I work
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 70} className="bg-bg p-6">
              <h3 className="text-sm font-semibold tracking-tight text-hi">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mid">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-shell px-6 py-16"
        aria-labelledby="journey-heading"
      >
        <Reveal>
          <h2
            id="journey-heading"
            className="text-center text-title font-bold tracking-[-0.02em] text-hi"
          >
            My Journey
          </h2>
        </Reveal>
        <div className="relative mt-16">
          {/*
            `bg-linear-to-b`, not the reference's v3 `bg-gradient-to-b`. The v3
            name is not a Tailwind v4 utility, so copying it would leave the
            timeline rule with no background at all and no warning.
          */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-4 w-px bg-linear-to-b from-accent via-accent/40 to-transparent md:left-1/2 md:-translate-x-1/2"
          />
          <ol className="space-y-12">
            {journey.map((t, i) => (
              <li
                key={t.period}
                className="relative grid grid-cols-1 md:grid-cols-2 md:gap-16"
              >
                <span
                  aria-hidden
                  className="absolute top-10 left-4 size-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-accent/20 md:left-1/2"
                />
                <Reveal
                  delay={i * 80}
                  className={
                    i % 2 === 0
                      ? "md:col-start-1 md:-mr-2 md:text-right"
                      : "md:col-start-2 md:-ml-2"
                  }
                >
                  <div className="ml-10 rounded-card border border-line bg-surface p-6 md:ml-0">
                    <p className="font-mono text-2xl font-semibold text-accent">
                      {t.period}
                    </p>
                    <h3 className="mt-2 text-base font-semibold tracking-tight text-hi">
                      {t.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-mid">
                      {t.body}
                    </p>
                    {"link" in t && t.link ? (
                      <a
                        href={t.link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-3 inline-block font-mono text-xs text-accent transition-colors duration-200 hover:text-accent/80"
                      >
                        {t.link.label} ↗
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="mx-auto max-w-shell px-6 py-16"
        aria-labelledby="now-heading"
      >
        <Reveal>
          <h2
            id="now-heading"
            className="font-mono text-xs tracking-widest text-mid uppercase"
          >
            Currently
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-8 rounded-card border border-line bg-surface p-6">
            <ul className="space-y-3 font-mono text-xs text-mid">
              {now.map((n) => (
                <li key={n} className="flex gap-3">
                  <span className="text-accent">▸</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section
        className="mx-auto max-w-shell px-6 py-16"
        aria-labelledby="beyond-heading"
      >
        <Reveal>
          <h2
            id="beyond-heading"
            className="font-mono text-xs tracking-widest text-mid uppercase"
          >
            Beyond the code
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
          {beyondCode.map((b, i) => (
            <Reveal key={b.title} delay={i * 70} className="bg-bg p-6">
              <h3 className="text-sm font-semibold tracking-tight text-hi">
                {b.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mid">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 py-16">
        <Reveal>
          <blockquote className="mx-auto max-w-2xl border-l-2 border-accent pl-6 text-lg leading-relaxed text-hi sm:text-xl">
            &quot;The best code comes from a balanced life and a curious
            mind.&quot;
          </blockquote>
        </Reveal>
      </section>

      <section className="mx-auto max-w-shell px-6 py-16">
        <Reveal>
          <h2 className="text-title font-bold tracking-[-0.02em] text-hi">
            Want the shorter version?
          </h2>
          <p className="mt-3 max-w-measure text-sm text-mid">
            The projects page shows the work; the CV has the details. Or just
            ask.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-control border border-accent bg-accent px-5 py-2.5 font-mono text-xs text-[#08110f] transition-colors duration-200 hover:bg-[#5eead4]"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-control border border-line px-5 py-2.5 font-mono text-xs text-hi transition-colors duration-200 hover:border-accent-line hover:text-accent"
            >
              Get in touch ↗
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
