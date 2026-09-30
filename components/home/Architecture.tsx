"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/motion/AnimatedBeam";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

/**
 * Ported from the reference project's home route:
 * ../remix-of-pixel-perfect/src/routes/index.tsx:53-108 (ArchitectureVisualizer)
 * and :193-204 (the section that renders it).
 *
 * The node labels are retargeted. The reference describes a NestJS service —
 * React and PostgreSQL into a Core App, out to a NestJS gateway — which is not
 * this stack and would put wrong technology names on the page. The topology is
 * kept, because the topology is the diagram: two nodes feeding a core, core
 * driving a datastore.
 */
const NODES = {
  client: "Client",
  core: "Next.js",
  redis: "Redis",
  database: "Supabase",
} as const;

const NODE_COPY: Record<keyof typeof NODES, string> = {
  client: "React 19 client, server-rendered",
  core: "App Router, Zod validation, auth",
  redis: "rate limits and response cache",
  database: "Postgres, RLS, storage",
};

const BEAM_COLORS = {
  gradientStartColor: "#2dd4bf",
  gradientStopColor: "#5eead4",
} as const;

export default function Architecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);
  const redisRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const databaseRef = useRef<HTMLDivElement>(null);

  return (
    <section id="architecture" className="py-16" aria-labelledby="architecture-heading">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <SectionHead
            id="architecture-heading"
            eyebrow="ARCHITECTURE"
            title="How this site is put together"
            lede="A Next.js App Router front end over Supabase, with Upstash Redis in front of the one public write endpoint."
          />
        </Reveal>

        <Reveal>
          {/*
            Hidden below md with a text list underneath, which is the
            reference's own call — see its src/data/projects.ts:77, "the
            architecture beams are desktop-only and replaced by plain, readable
            lists on mobile, so the small-screen experience stays text-first".

            The sibling orbit diagram above does the opposite and scales down
            instead of hiding, because a 400px ring still reads at 72%. A
            four-column beam layout does not: the node labels collide long
            before that. So this one follows the reference.
          */}
          <div
            ref={containerRef}
            className="relative hidden h-64 w-full items-center justify-between px-6 md:flex"
          >
            <div className="flex flex-col justify-between gap-10">
              <Node ref={clientRef} label={NODES.client} />
              <Node ref={redisRef} label={NODES.redis} />
            </div>
            <Node ref={coreRef} label={NODES.core} accent />
            <Node ref={databaseRef} label={NODES.database} />

            <AnimatedBeam
              containerRef={containerRef}
              fromRef={clientRef}
              toRef={coreRef}
              pathWidth={1}
              pathOpacity={0.12}
              curvature={-30}
              duration={6}
              {...BEAM_COLORS}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={redisRef}
              toRef={coreRef}
              pathWidth={1}
              pathOpacity={0.12}
              curvature={30}
              duration={6}
              delay={1}
              {...BEAM_COLORS}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={coreRef}
              toRef={databaseRef}
              pathWidth={1}
              pathOpacity={0.12}
              duration={6}
              delay={2}
              {...BEAM_COLORS}
            />
          </div>

          <ul className="mt-6 space-y-2 font-mono text-xs text-mid md:hidden">
            {(["client", "core", "redis", "database"] as const).map((key) => (
              <li key={key}>
                <span className="text-hi">{NODES[key]}</span>{" "}
                <span className="text-low">— {NODE_COPY[key]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

type NodeProps = {
  label: string;
  accent?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function Node({ label, accent = false, ref }: NodeProps) {
  return (
    <div
      ref={ref}
      className={
        accent
          ? "z-10 flex items-center justify-center rounded-tile border border-accent-line bg-surface-2 px-4 py-2 font-mono text-xs text-hi"
          : "z-10 flex items-center justify-center rounded-tile border border-line bg-surface-2 px-4 py-2 font-mono text-xs text-hi"
      }
    >
      {label}
    </div>
  );
}
