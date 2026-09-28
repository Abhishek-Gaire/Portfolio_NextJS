import { Download, FileText } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/icons";
import Link from "next/link";

import { Button } from "@/components/primitives/Button";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Web Development",
  "API Development",
  "Database Design",
  "App Development",
  "Performance Optimization",
];

const socials = [
  {
    href: "https://github.com/Abhishek-Gaire",
    label: "GitHub Profile",
    Icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/abhisek-gaire-359294219/",
    label: "LinkedIn Profile",
    Icon: Linkedin,
  },
  {
    href: "https://x.com/GaireAbhishek44",
    label: "Twitter Profile",
    Icon: Twitter,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line pt-11 pb-8.5">
      <div className="mx-auto max-w-shell px-6">
        <div className="mb-8 grid grid-cols-[2fr_1fr_1fr] gap-8 max-[720px]:grid-cols-1">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-control border border-accent-line bg-accent-soft font-mono text-[13px] font-semibold text-accent">
                AG
              </div>
              <strong className="text-[15px] font-semibold text-hi">
                Abhishek Gaire
              </strong>
            </div>

            <p className="mt-3.5 mb-4.5 max-w-[36ch] text-[13.5px] leading-[1.6] text-mid">
              Full Stack Developer specializing in MERN stack development.
              Building scalable web applications with modern technologies.
            </p>

            <div className="mb-6">
              <Button
                as="a"
                variant="primary"
                href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4" />
                <span>Download Professional CV</span>
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex gap-3.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center justify-center rounded-control border border-line bg-surface p-3 text-low transition-colors duration-200 hover:border-line-hi hover:bg-surface-2 hover:text-hi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3.5 text-[13px] font-semibold text-low">Quick Links</h3>
            <ul>
              {quickLinks.map(({ href, label }) => (
                <li key={href} className="mb-2.5">
                  <Link
                    href={href}
                    className="inline-block text-[13.5px] text-mid transition-colors duration-200 hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3.5 text-[13px] font-semibold text-low">Services</h3>
            <ul>
              {services.map((service) => (
                <li key={service} className="mb-2.5 text-[13.5px] text-mid">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2.5 border-t border-line pt-6 text-caption text-low md:flex-row">
          <p>&copy; 2025 Abhishek Gaire. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Made with ❤️ in Nepal</span>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse-ring" />
              <span>Available for hire</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
