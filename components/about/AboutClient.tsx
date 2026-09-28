"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Calendar,
  Code,
  Coffee,
  FileText,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { SectionHead } from "@/components/primitives/SectionHead";

const skills = [
  {
    name: "Frontend Development",
    level: 90,
    color: "from-accent to-accent/45",
  },
  {
    name: "Backend Development",
    level: 85,
    color: "from-accent to-violet/70",
  },
  {
    name: "Database Design",
    level: 80,
    color: "from-violet to-accent/70",
  },
  {
    name: "DevOps & Deployment",
    level: 75,
    color: "from-amber to-accent/70",
  },
];

const values = [
  {
    icon: Target,
    title: "Quality First",
    description:
      "I believe in writing clean, maintainable code that stands the test of time.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Great products are built by great teams. I thrive in collaborative environments.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description:
      "Technology evolves rapidly, and I stay ahead by constantly learning new skills.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Every line of code I write is with the end user in mind.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "Started Full-Stack Journey",
    description:
      "Began my journey into web development, focusing on the MERN stack.",
  },
  {
    year: "2023",
    title: "First Major Projects",
    description:
      "Built several full-stack applications and gained hands-on experience.",
  },
  {
    year: "2024",
    title: "Advanced Specialization",
    description:
      "Expanded expertise in modern frameworks and deployment strategies.",
  },
  {
    year: "2025",
    title: "Professional Growth",
    description:
      "Currently seeking opportunities to contribute to innovative projects.",
  },
];

const facts = [
  { icon: MapPin, label: "Based in Pokhara, Nepal" },
  { icon: Calendar, label: "3+ Years of Experience" },
  { icon: Code, label: "10+ Projects Completed" },
  { icon: Award, label: "100% Client Satisfaction" },
];

export default function AboutClient() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-shell px-6 pt-16 pb-16">
        <nav className="mb-10 flex items-center gap-2 font-mono text-micro text-low">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-accent"
          >
            Home
          </Link>
          <span aria-hidden="true" className="text-low/60">
            /
          </span>
          <span className="text-mid">About</span>
        </nav>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3.5 py-1.5 font-mono text-micro text-accent">
            <Coffee className="h-3.5 w-3.5" />
            Get to Know Me
          </span>
          <h1 className="mb-4 text-display font-bold text-hi">
            About <span className="text-accent">Abhishek</span>
          </h1>
          <p className="max-w-measure text-lede text-mid">
            A passionate Full-Stack Developer from Nepal, dedicated to crafting
            exceptional digital experiences that bridge the gap between
            innovative design and powerful functionality.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]"
        >
          <BentoCard interactive className="rounded-card p-7">
            <h2 className="mb-5 text-title font-bold text-hi">My Story</h2>
            <div className="flex flex-col gap-4 text-[14.5px] leading-[1.65] text-mid">
              <p>
                My journey into web development began with curiosity and has
                evolved into a passion for creating digital solutions that make a
                difference. Based in the beautiful city of Pokhara, Nepal,
                I&apos;ve dedicated myself to mastering the art and science of
                full-stack development.
              </p>
              <p>
                What started as a fascination with how websites work has grown
                into expertise in modern web technologies. I specialize in the
                MERN stack, but I&apos;m always eager to learn new technologies and
                frameworks that can help me build better solutions.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring the latest tech
                trends, contributing to open-source projects, or enjoying the
                stunning mountain views that Nepal has to offer. I believe that
                the best code comes from a balanced life and a curious mind.
              </p>
            </div>
          </BentoCard>

          <BentoCard className="rounded-card p-7">
            <h3 className="mb-1.5 text-[15px] font-semibold text-hi">
              Quick Facts
            </h3>
            <p className="mb-5 font-mono text-micro text-low">
              AT A GLANCE
            </p>
            <ul className="flex flex-col">
              {facts.map(({ icon: Icon, label }, index) => (
                <li
                  key={label}
                  className={`flex items-center gap-3.5 py-3.5 ${
                    index > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] border border-accent-line bg-accent-soft text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[14px] font-semibold text-hi">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </BentoCard>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <SectionHead
            eyebrow="CAPABILITIES"
            title="Technical Expertise"
            lede="Where I spend most of my time, from interface work through to shipping and running the thing."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {skills.map((skill, index) => (
              <BentoCard
                key={skill.name}
                interactive
                className="rounded-tile p-6"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-hi">
                    {skill.name}
                  </h3>
                  <span className="font-mono text-caption text-accent">
                    {skill.level}%
                  </span>
                </div>
                {/* The h-3 on both the track and the bar is load-bearing: the bar
                    is animated on width only, so its height has to come from
                    the class, not from the parent's content box. */}
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    /* `skill.color` must stay a literal class string in this
                       file. Tailwind v4's scanner only sees source text, so
                       moving these into a config or a stylesheet would emit no
                       gradient utilities and the bars would render blank. */
                    className={`h-3 rounded-full bg-linear-to-r ${skill.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </BentoCard>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <SectionHead
            eyebrow="PRINCIPLES"
            title="My Values"
            lede="The handful of ideas I keep coming back to when the requirements get messy."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="h-full"
              >
                <BentoCard interactive className="h-full rounded-tile p-5.5">
                  <span className="mb-4 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border border-accent-line bg-accent-soft text-accent">
                    <value.icon className="h-4 w-4" />
                  </span>
                  <h3 className="mb-2 text-[15px] font-semibold text-hi">
                    {value.title}
                  </h3>
                  <p className="text-caption leading-[1.6] text-mid">
                    {value.description}
                  </p>
                </BentoCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <SectionHead
            eyebrow="TIMELINE"
            title="My Journey"
            lede="Four years of going from first commit to shipping full-stack products end to end."
          />

          <div className="relative mx-auto max-w-[860px]">
            <div
              aria-hidden="true"
              className="absolute left-1/2 w-px -translate-x-1/2 bg-accent-line"
              style={{ height: "100%", top: 0, bottom: 0 }}
            />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                className={`mb-8 flex items-center max-[760px]:flex-col ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`w-1/2 max-[760px]:w-full ${
                    index % 2 === 0
                      ? "pr-4 text-right max-[760px]:pr-0 max-[760px]:text-left"
                      : "pl-4 text-left max-[760px]:pl-0"
                  }`}
                >
                  <BentoCard className="rounded-tile p-5.5">
                    <div className="mb-1.5 font-mono text-[13px] font-semibold text-accent">
                      {item.year}
                    </div>
                    <h3 className="mb-2 text-[15px] font-semibold text-hi">
                      {item.title}
                    </h3>
                    <p className="text-caption leading-[1.6] text-mid">
                      {item.description}
                    </p>
                  </BentoCard>
                </div>

                <span
                  aria-hidden="true"
                  className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-bg bg-accent"
                />
                <div className="w-1/2 max-[760px]:hidden" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <BentoCard interactive className="rounded-card p-7 sm:p-9">
            <h2 className="mb-3 text-title font-bold text-hi">
              Let&apos;s Build Something Amazing Together
            </h2>
            <p className="mb-6 max-w-measure text-[15px] text-mid">
              Ready to bring your ideas to life? I&apos;m always excited to work on
              new projects and collaborate with fellow innovators.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                as="a"
                href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4" />
                <span>View My CV</span>
              </Button>
              <Button as={Link} href="/contact" variant="primary">
                <Mail className="h-4 w-4" />
                <span>Start a Conversation</span>
              </Button>
              <Button as={Link} href="/projects">
                <span>Explore My Full-Stack Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </BentoCard>
        </motion.section>
      </div>
    </main>
  );
}
