"use client";

import { Menu, X, Github, Linkedin, Twitter, Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-md z-50 shadow-2xl border-b border-gray-800/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-xl">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">AG</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-800/50 ${pathname === item.href
                  ? "text-blue-400 bg-blue-500/10"
                  : ""
                  }`}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-linear-to-r hover:from-green-600/30 hover:to-emerald-600/30 hover:border-green-500/50 transition-all duration-300 text-sm font-medium group"
            >
              <Download className="w-4 h-4 mr-1 group-hover:animate-bounce" />
              <span>CV</span>
            </a>
            <a
              href="https://github.com/Abhishek-Gaire"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://x.com/GaireAbhishek44"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Profile"
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <Twitter size={20} />
            </a>
          </div>

          <button
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-6 p-6 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 ${pathname === item.href
                    ? "text-blue-400 bg-blue-500/10"
                    : ""
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <a
                href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-3 bg-linear-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-linear-to-r hover:from-green-600/30 hover:to-emerald-600/30 hover:border-green-500/50 transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </a>
            </div>

            <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-700/50">
              <a
                href="https://github.com/Abhishek-Gaire"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/GaireAbhishek44"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
