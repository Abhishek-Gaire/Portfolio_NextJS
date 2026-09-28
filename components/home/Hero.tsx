import Link from "next/link";

import { Github, Linkedin, Twitter } from "@/components/icons";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { StatCell } from "@/components/primitives/StatCell";
import HeroAnimated from "./HeroAnimated";
import HeroClock from "./HeroClock";
import HeroCountUp from "./HeroCountUp";

const RESUME_URL =
  "https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf";

const socials = [
  { href: "https://github.com/Abhishek-Gaire", label: "github.com/Abhishek-Gaire", Icon: Github },
  {
    href: "https://www.linkedin.com/in/abhisek-gaire-359294219/",
    label: "linkedin.com/in/abhisek-gaire",
    Icon: Linkedin,
  },
  { href: "https://x.com/GaireAbhishek44", label: "x.com/GaireAbhishek44", Icon: Twitter },
];

const stats = [
  { target: 10, suffix: "+", label: "Projects completed" },
  { target: 3, suffix: "+", label: "Years experience" },
  { target: 100, suffix: "%", label: "Client satisfaction" },
];

export default function Hero() {
  return (
    <section id="home" className="pt-16 pb-16">
      <div className="mx-auto max-w-shell px-6">
        <div className="grid grid-cols-4 gap-4 [auto-rows:minmax(90px,auto)] max-[900px]:grid-cols-2">
          <BentoCard
            interactive
            className="fade-up col-span-3 row-span-2 rounded-hero p-0 max-[900px]:col-span-2 max-[900px]:row-auto"
            style={{ animationDelay: "20ms" }}
          >
            <div className="grid h-full grid-cols-[1.05fr_0.95fr] max-[900px]:grid-cols-1">
              <div className="flex flex-col justify-center px-7 py-8">
                <span className="inline-flex w-fit items-center gap-1.75 mb-4 rounded-full border border-accent-line bg-accent-soft py-1.5 pl-2 pr-2.5 font-mono text-micro text-accent">
                  <span className="animate-pulse-ring h-1.5 w-1.5 rounded-full bg-accent" />
                  Available for new projects
                </span>

                <div className="mb-0.5 font-mono text-[15px] font-semibold text-accent">
                  Full-Stack Developer
                </div>

                {/* Raw HTML on purpose: this h1 pairs with the ProfilePage JSON-LD in
                    app/page.tsx and must stay in the server component's SSR payload, so
                    it can never move into HeroAnimated or any "use client" file. */}
                <h1 className="mt-4 mb-3.5 text-display font-bold text-hi">
                  Hi, I&apos;m Abhishek
                  <br />
                  Gaire.
                </h1>

                <p className="mb-6 max-w-measure-narrow text-mid text-lede">
                  I create exceptional digital experiences that combine beautiful
                  design with powerful functionality — specializing in modern web
                  technologies and user-centered design, MERN stack end to end.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <Button as={Link} href="/projects" variant="primary">
                    Explore my projects
                  </Button>
                  <Button as="a" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                    Download CV
                  </Button>
                  <Button as={Link} href="/contact">
                    Start a conversation
                  </Button>
                </div>
              </div>

              <div className="flex flex-col border-line border-l bg-code-bg p-5 pb-6 max-[900px]:border-t max-[900px]:border-l-0">
                <div className="mb-4 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-chrome-dot" />
                  <span className="h-2 w-2 rounded-full bg-chrome-dot" />
                  <span className="h-2 w-2 rounded-full bg-chrome-dot" />
                </div>

                <pre className="m-0 overflow-x-auto font-mono text-caption leading-[1.9] text-mid">
                  {"const developer = {\n  name: "}
                  <span className="text-amber">{"'Abhishek Gaire'"}</span>
                  {",\n  role: "}
                  <span className="text-amber">{"'Full-Stack Developer'"}</span>
                  {",\n  stack: ["}
                  <span className="text-amber">{"'React'"}</span>
                  {", "}
                  <span className="text-amber">{"'Node.js'"}</span>
                  {",\n    "}
                  <span className="text-amber">{"'MongoDB'"}</span>
                  {", "}
                  <span className="text-amber">{"'Express'"}</span>
                  {"],\n  location: "}
                  <span className="text-amber">{"'Pokhara, NP'"}</span>
                  {",\n  "}
                  <span className="text-accent">available</span>
                  {": "}
                  <span className="text-violet">true</span>
                  <span className="animate-blink inline-block h-3.25 w-1.5 bg-accent align-middle" />
                  {"\n};"}
                </pre>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            className="fade-up col-span-1 rounded-tile p-5"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-1.5 font-mono text-micro text-low">BASED IN</div>
                <div className="text-[15px] font-semibold text-hi">Pokhara, Nepal</div>
                <HeroClock />
              </div>
              <div className="mt-auto font-mono text-micro text-low">UTC +05:45</div>
            </div>
          </BentoCard>

          <BentoCard
            className="fade-up col-span-1 rounded-tile p-5"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex flex-col gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social flex items-center gap-2.5 rounded-control border border-transparent p-2.5 text-[13.5px] text-mid transition-colors duration-200 hover:border-line hover:bg-[rgba(255,255,255,0.02)] hover:text-hi"
                >
                  <Icon
                    size={16}
                    className="shrink-0 text-low transition-colors duration-200 group-hover/social:text-accent"
                  />
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            className="fade-up col-span-3 rounded-tile p-0 max-[900px]:col-span-2"
            style={{ animationDelay: "220ms" }}
          >
            <div className="grid grid-cols-3 max-[720px]:grid-cols-1">
              {stats.map((stat) => (
                <StatCell
                  key={stat.label}
                  value={<HeroCountUp target={stat.target} suffix={stat.suffix} />}
                  label={stat.label}
                />
              ))}
            </div>
          </BentoCard>
        </div>

        <HeroAnimated />
      </div>
    </section>
  );
}
