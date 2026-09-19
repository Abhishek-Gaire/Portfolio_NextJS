import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PORTFOLIO_URL } from "@/lib/site-urls";

/**
 * Minimal top bar for the standalone Typeshala page (the portfolio
 * Header is hidden here). Uses an absolute URL on purpose: in production
 * this page is served from typeshala.abhishekgaire.com.np, so a relative
 * "/" link would never leave the subdomain.
 */
export function TypeshalaTopNav() {
  return (
    <header className="relative z-10 border-b border-white/10 bg-gray-950/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <span className="flex items-center space-x-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
            T
          </span>
          <span className="font-semibold text-white">Typeshala</span>
        </span>
        <a
          href={PORTFOLIO_URL}
          className="inline-flex items-center space-x-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </a>
      </div>
    </header>
  );
}

type TypeshalaFooterProps = {
  issuesUrl: string;
};

/**
 * "Go to Portfolio" section + slim footer for the standalone Typeshala
 * page. Rendered inside the page because the portfolio Footer is hidden
 * here (see AppShell).
 */
export function TypeshalaFooter({ issuesUrl }: TypeshalaFooterProps) {
  const year = new Date().getFullYear();

  return (
    <div className="relative container mx-auto px-6 pb-16">
      <section className="mb-10 rounded-3xl border border-blue-500/20 bg-linear-to-br from-blue-600/10 via-transparent to-purple-600/10 p-10 text-center sm:p-12">
        <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
          <span className="text-sm font-medium text-blue-300">
            Built by Abhishek Gaire
          </span>
        </div>
        <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">
          Want to see more of my work?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-gray-400">
          Explore my portfolio for more projects, blog posts, and ways to get
          in touch.
        </p>
        <a
          href={PORTFOLIO_URL}
          className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-blue-500"
        >
          <span>Go to Portfolio</span>
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </section>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 sm:flex-row">
        <p>
          &copy; {year} Abhishek Gaire. Typeshala is free and open source.
        </p>
        <div className="flex items-center space-x-6">
          <a
            href={PORTFOLIO_URL}
            className="transition-colors hover:text-gray-300"
          >
            Portfolio
          </a>
          <a
            href={issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-300"
          >
            Report an issue
          </a>
        </div>
      </footer>
    </div>
  );
}
