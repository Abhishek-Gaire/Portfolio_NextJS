import { OrbitingCircles } from "@/components/motion/OrbitingCircles";
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

/*
 * A curated subset of `skills` above, spanning all four categories, for the
 * orbit rings. The terminal below stays the exhaustive list; these are the
 * headline names. If one is removed from `skills`, update it here too.
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
          <div className="relative mx-auto flex h-[420px] w-full origin-center items-center justify-center max-md:scale-[0.72] [&:hover_*]:[animation-play-state:paused]">
            <span className="font-mono text-xs text-low">core</span>
            <OrbitingCircles radius={170} duration={40} iconSize={56} speed={0.6}>
              {ORBIT_OUTER.map((tech) => (
                <span
                  key={tech}
                  className="flex size-14 items-center justify-center rounded-full border border-line bg-surface-2 px-1.5 text-center font-mono text-[11px] leading-tight text-hi"
                >
                  {tech}
                </span>
              ))}
            </OrbitingCircles>
            <OrbitingCircles radius={100} duration={32} iconSize={44} speed={0.6} reverse>
              {ORBIT_INNER.map((tech) => (
                <span
                  key={tech}
                  className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-2 px-1 text-center font-mono text-[10px] leading-tight text-mid"
                >
                  {tech}
                </span>
              ))}
            </OrbitingCircles>
          </div>
        </Reveal>

        <Reveal>
          <SkillsTerminal directories={directories} />
        </Reveal>
      </div>
    </section>
  );
}
