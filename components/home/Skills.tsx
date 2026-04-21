import { Database, Server, Layout, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Skills() {
  const skills = {
    frontend: [
      "ReactJS",
      "TypeScript",
      "Javascript",
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
  const skillCategories = [
    {
      title: "Frontend",
      icon: Layout,
      skills: skills.frontend,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Backend",
      icon: Server,
      skills: skills.backend,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Database",
      icon: Database,
      skills: skills.database,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Tools",
      icon: Wrench,
      skills: skills.tools,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <section id="skills" className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400 text-sm font-medium mb-4">
            <Wrench size={16} className="mr-2" />
            My Expertise
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks I use
            to build exceptional digital experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className={`group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border ${category.borderColor} hover:bg-gray-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`p-3 ${category.bgColor} rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill}
                    className="flex items-center text-gray-300 group-hover:text-white transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100 + skillIndex * 50}ms`,
                    }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm font-medium hover:translate-x-1 transition-transform duration-200">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
              ></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">
            Interested in working together? Let's discuss your project
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1"
          >
            <span className="font-medium">Let's Build Something Amazing</span>
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
