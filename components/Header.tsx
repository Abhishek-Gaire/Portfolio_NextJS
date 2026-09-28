"use client";

import { Menu, X, Download } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/icons";
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

const CV_URL =
  "https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(10,10,12,0.72)] backdrop-blur-[14px] pt-[env(safe-area-inset-top,0px)]">
      <nav className="w-full">
        <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Abhishek Gaire, home">
            <span className="flex h-9.5 w-9.5 items-center justify-center rounded-control border border-accent-line bg-accent-soft font-mono text-[13px] font-semibold text-accent">
              AG
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-[14px] text-mid lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative transition-colors duration-200 ease-out-expo hover:text-hi ${pathname === item.href ? "text-accent" : ""}`}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"></div>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-control border border-accent-line px-4.5 py-2.25 font-mono text-caption font-semibold text-accent transition-colors duration-200 ease-out-expo hover:bg-accent-soft"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CV</span>
            </a>
            <a
              href="https://github.com/Abhishek-Gaire"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 ease-out-expo hover:border-line-hi hover:text-accent"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 ease-out-expo hover:border-line-hi hover:text-accent"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://x.com/GaireAbhishek44"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter Profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 ease-out-expo hover:border-line-hi hover:text-accent"
            >
              <Twitter size={18} />
            </a>
          </div>

          <button
            aria-label="Toggle mobile menu"
            className="inline-flex h-9.5 w-9.5 items-center justify-center rounded-[9px] border border-line text-hi transition-colors duration-200 ease-out-expo hover:border-line-hi lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="flex flex-col gap-0.5 border-t border-line bg-[rgba(10,10,12,0.92)] px-6 pb-4 pt-2 lg:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`border-b border-line py-3 text-[14.5px] transition-colors duration-200 ease-out-expo hover:text-hi ${pathname === item.href ? "text-accent" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <a
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-control border border-accent-line px-4.5 py-3 font-mono text-caption font-semibold text-accent transition-colors duration-200 ease-out-expo hover:bg-accent-soft"
              onClick={() => setIsMenuOpen(false)}
            >
              <Download className="h-3.5 w-3.5" />
              Download CV
            </a>

            <div className="mt-3 flex items-center gap-3 pt-4">
              <a
                href="https://github.com/Abhishek-Gaire"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 ease-out-expo hover:border-line-hi hover:text-accent"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 ease-out-expo hover:border-line-hi hover:text-accent"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/GaireAbhishek44"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 ease-out-expo hover:border-line-hi hover:text-accent"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
