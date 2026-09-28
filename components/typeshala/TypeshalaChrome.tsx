import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PORTFOLIO_URL } from "@/lib/site-urls";

/**
 * Minimal top bar for the standalone Typeshala page (the portfolio
 * Header is hidden here). Uses an absolute URL on purpose: in production
 * this page is served from typeshala.abhishekgaire.com.np, so a relative
 * "/" link would never leave the subdomain.
 */
export function TypeshalaTopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(10,10,12,0.72)] backdrop-blur-[14px] pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-6 py-4">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-control border border-accent-line bg-accent-soft font-mono text-[13px] font-semibold text-accent">
            T
          </span>
          <strong className="truncate text-[15px] font-semibold text-hi">
            Typeshala
          </strong>
        </span>

        <Button as="a" href={PORTFOLIO_URL} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Button>
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
    <div className="mx-auto max-w-shell px-6 pb-16">
      <BentoCard className="mb-10 rounded-hero p-7 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <Eyebrow className="mb-3">Built by Abhishek Gaire</Eyebrow>

          <h2 className="mb-3 text-title font-bold text-hi">
            Want to see more of my work?
          </h2>

          <p className="mb-7 max-w-measure text-mid text-lede">
            Explore my portfolio for more projects, blog posts, and ways to get
            in touch.
          </p>

          <Button as="a" href={PORTFOLIO_URL} variant="primary">
            <span>Go to Portfolio</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </BentoCard>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-[13px] text-low sm:flex-row">
        <p>
          &copy; {year} Abhishek Gaire. Typeshala is free and open source.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={PORTFOLIO_URL}
            className="transition-colors duration-200 hover:text-hi"
          >
            Portfolio
          </a>
          <a
            href={issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-hi"
          >
            Report an issue
          </a>
        </div>
      </footer>
    </div>
  );
}
