"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { to: "/", label: "home" },
  { to: "/about", label: "about" },
  { to: "/projects", label: "projects" },
  { to: "/blogs", label: "blog" },
  { to: "/contact", label: "contact" },
];

/**
 * Navbar ported from the remix reference at src/components/site-header.tsx:11-40.
 *
 * The reference resolves the active link with TanStack Router's
 * `activeOptions={{ exact: l.to === "/" }}` and styles it with `[&.active]`.
 * Here it comes from usePathname instead, which is already exact for every
 * entry, so the home link is not active on every route.
 *
 * Two things not carried over. The reference sets
 * `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
 * which would suppress the global `:focus-visible` accent outline in
 * globals.css; the reference's shadcn `ring-ring` token does not exist in this
 * repo anyway, so the outline is left to stand. And the reference's wordmark is
 * its own brand, so this is a wordmark for this site in the same shape.
 *
 * The reference nav has no mobile menu: the link list wraps. The previous
 * header here had a disclosure button, a useState toggle and a CV button plus
 * three social links, none of which the reference has. The CV and the social
 * profiles are still reachable from the hero, the contact page and the about
 * page.
 */
export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-shell flex-col items-start gap-2 px-6 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0"
      >
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-hi transition-colors duration-200 hover:text-accent"
        >
          abhishek<span className="text-accent">.</span>gaire
        </Link>
        <ul className="flex flex-wrap items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  href={link.to}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-control px-2.5 py-1.5 font-mono text-xs transition-colors duration-200 hover:text-hi ${
                    isActive ? "text-hi" : "text-mid"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
