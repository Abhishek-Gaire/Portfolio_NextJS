import { Reveal } from "@/components/primitives/Reveal";
import { StackOrbit } from "@/components/primitives/StackOrbit";
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

/*
 * A curated subset of `skills` above, spanning all four categories, for the
 * orbit rings. The terminal below stays the exhaustive list; these are the
 * headline names. If one is removed from `skills`, update it here too --
 * which is now the only place that list is hand-maintained, since StackOrbit
 * took the markup this used to duplicate.
 */
const ORBIT_OUTER = [
  skills.frontend[0],
  skills.frontend[1],
  skills.backend[0],
  skills.database[1],
  skills.database[0],
  skills.tools[1],
];

const ORBIT_INNER = [skills.backend[1], skills.database[2], skills.tools[0]];

export default function Skills() {
  return (
    <section id="skills" className="py-16">
      <div className="mx-auto max-w-shell px-6">
        <SectionHead
          eyebrow="MY EXPERTISE"
          title="Technical skills"
          lede="A comprehensive toolkit of modern technologies and frameworks used to build exceptional digital experiences."
        />

        {/*
          Same treatment as the Typeshala stack section: the remix
          OrbitingCircles at its reference geometry, scaled down on narrow
          viewports rather than hidden, and paused on hover. The parent's flex
          centring is load-bearing — the orbit children are absolutely
          positioned with no inset offsets, so the flexbox is what places them.
        */}
        <Reveal>
          <StackOrbit outer={ORBIT_OUTER} inner={ORBIT_INNER} />
        </Reveal>

        <Reveal>
          <SkillsTerminal directories={directories} />
        </Reveal>
      </div>
    </section>
  );
}
