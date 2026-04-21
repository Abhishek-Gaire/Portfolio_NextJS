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

const skills = [
  {
    name: "Frontend Development",
    level: 90,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Backend Development",
    level: 85,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Database Design",
    level: 80,
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "DevOps & Deployment",
    level: 75,
    color: "from-orange-500 to-red-500",
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

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
      <div className="container mx-auto px-6 py-16">
        <nav className="flex items-center mb-12 text-gray-400 text-sm">
          <Link
            href="/"
            className="hover:text-white transition-colors hover:translate-x-1 duration-300"
          >
            Home
          </Link>
          <span className="mx-3 text-gray-600">/</span>
          <span className="text-white">About</span>
        </nav>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400 text-sm font-medium mb-6">
            <Coffee size={16} className="mr-2" />
            Get to Know Me
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Abhishek
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A passionate Full-Stack Developer from Nepal, dedicated to crafting
            exceptional digital experiences that bridge the gap between
            innovative design and powerful functionality.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">My Story</h2>
            <p className="text-gray-300 leading-relaxed">
              My journey into web development began with curiosity and has
              evolved into a passion for creating digital solutions that make a
              difference. Based in the beautiful city of Pokhara, Nepal, I&apos;ve
              dedicated myself to mastering the art and science of full-stack
              development.
            </p>
            <p className="text-gray-300 leading-relaxed">
              What started as a fascination with how websites work has grown
              into expertise in modern web technologies. I specialize in the
              MERN stack, but I&apos;m always eager to learn new technologies and
              frameworks that can help me build better solutions.
            </p>
            <p className="text-gray-300 leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me exploring the latest tech
              trends, contributing to open-source projects, or enjoying the
              stunning mountain views that Nepal has to offer. I believe that
              the best code comes from a balanced life and a curious mind.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="text-blue-400 mr-3" size={20} />
                  <span className="text-gray-300">
                    Based in Pokhara, Nepal
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-green-400 mr-3" size={20} />
                  <span className="text-gray-300">
                    3+ Years of Experience
                  </span>
                </div>
                <div className="flex items-center">
                  <Code className="text-purple-400 mr-3" size={20} />
                  <span className="text-gray-300">
                    10+ Projects Completed
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="text-orange-400 mr-3" size={20} />
                  <span className="text-gray-300">
                    100% Client Satisfaction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Technical Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {skill.name}
                  </h3>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${skill.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            My Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                  <value.icon className="text-blue-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            My Journey
          </h2>
          <div className="max-w-4xl mx-auto relative">
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 opacity-30"
              style={{ height: "100%", top: 0, bottom: 0 }}
            ></div>

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>

                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 relative z-10"></div>
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Let&apos;s Build Something Amazing Together
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Ready to bring your ideas to life? I&apos;m always excited to work on
            new projects and collaborate with fellow innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-1 group"
            >
              <FileText className="mr-2 group-hover:animate-pulse" size={20} />
              <span className="font-medium">View My CV</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 group"
            >
              <Mail
                className="mr-2 group-hover:translate-x-1 transition-transform duration-300"
                size={20}
              />
              <span className="font-medium">Start a Conversation</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 border border-gray-600/50 text-white rounded-xl hover:bg-gray-800/50 hover:border-gray-500/50 transition-all duration-300 group"
            >
              <span className="font-medium">
                Explore My Full-Stack Projects
              </span>
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                size={20}
              />
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
