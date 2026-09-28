import { OrbitBadges } from "@/components/motion/OrbitBadges";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";
import { SkillsTerminal, type SkillDirectory } from "./SkillsTerminal";

const skills = {
  frontend: [
    "ReactJS",
    "TypeScript",
    "JavaScript",
    "EJS",
    "Tailwind CSS",
    "Context API",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "NestJS",
    "WebSocket",
    "REST APIs",
    "Java",
  ],
  database: ["MongoDB", "PostgreSQL", "Redis", "Prisma", "MySQL", "Supabase"],
  tools: ["Git", "Docker", "NGinx", "Postman", "CI/CD", "S3 Bucket"],
};

const TREE_DIRECTORIES: { key: keyof typeof skills; dirClassName: string }[] = [
  { key: "frontend", dirClassName: "text-accent" },
  { key: "backend", dirClassName: "text-violet" },
  { key: "database", dirClassName: "text-amber" },
  { key: "tools", dirClassName: "text-hi" },
];

const directories: SkillDirectory[] = TREE_DIRECTORIES.map(
  ({ key, dirClassName }) => ({
    name: key,
    dirClassName,
    items: skills[key],
  }),
);

/* Per-brand logo colours, the one place raw hex is the design. */
const INNER_RING = [
  { label: "Re", color: "#61dafb" },
  { label: "TS", color: "#3178c6" },
  { label: "Nd", color: "#3c873a" },
  { label: "Ns", color: "#e0234e" },
];

const OUTER_RING = [
  { label: "Pg", color: "#336791" },
  { label: "Mg", color: "#47a248" },
  { label: "Rd", color: "#dc382d" },
  { label: "Dk", color: "#2496ed" },
];

export default function Skills() {
  return (
    <section id="skills" className="py-16">
      <div className="mx-auto max-w-shell px-6">
        <SectionHead
          eyebrow="MY EXPERTISE"
          title="Technical skills"
          lede="A comprehensive toolkit of modern technologies and frameworks used to build exceptional digital experiences."
        />

        <Reveal>
          <BentoCard className="mb-4 flex flex-col items-center p-7 px-5 pb-5">
            <OrbitBadges
              innerItems={INNER_RING}
              outerItems={OUTER_RING}
              hubLabel="CORE STACK"
              caption="Hover to pause · inner ring: language & frameworks · outer ring: data & infra"
            />
          </BentoCard>
        </Reveal>

        <Reveal>
          <SkillsTerminal directories={directories} />
        </Reveal>
      </div>
    </section>
  );
}
