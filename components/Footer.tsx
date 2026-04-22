import { Github, Linkedin, Twitter, Download, FileText } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute opacity-20 top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AG</span>
              </div>
              <h3 className="text-2xl font-bold">Abhishek Gaire</h3>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
              Full Stack Developer specializing in MERN stack development.
              Building scalable web applications with modern technologies.
            </p>

            <div className="mb-6">
              <a
                href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-linear-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-xl hover:bg-linear-to-r hover:from-green-600/30 hover:to-emerald-600/30 hover:border-green-500/50 transition-all duration-300 font-medium group"
              >
                <FileText className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                <span>Download Professional CV</span>
                <Download className="w-4 h-4 ml-2 group-hover:animate-bounce" />
              </a>
            </div>

            <div className="flex space-x-4">
              <a
                href="https://github.com/Abhishek-Gaire"
                className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
                className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/GaireAbhishek44"
                className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Web Development</li>
              <li className="text-gray-400">API Development</li>
              <li className="text-gray-400">Database Design</li>
              <li className="text-gray-400">App Development</li>
              <li className="text-gray-400">Performance Optimization</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 Abhishek Gaire. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ in Nepal</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Available for hire</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
