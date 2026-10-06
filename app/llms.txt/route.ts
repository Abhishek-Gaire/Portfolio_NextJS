import { headers } from "next/headers";

import {
  PORTFOLIO_URL,
  TYPESHala_SITE_URL,
  isTypeshalaHost,
} from "@/lib/site-urls";

import {
  TYPESHALA_AUTHOR,
  TYPESHALA_AUTHOR_URL,
  TYPESHALA_DESCRIPTION,
  TYPESHALA_FAQ,
  TYPESHALA_GITHUB_URL,
  TYPESHALA_INTRO,
  TYPESHALA_LICENSE,
  TYPESHALA_NAME,
  TYPESHALA_REPO_URL,
} from "@/lib/typeshala-content";

/**
 * /llms.txt — a plain-text summary for crawlers that look for one.
 *
 * Low priority by evidence, not by principle: an Ahrefs analysis of ~137,000
 * sites found 97% of the llms.txt files out there were never fetched. It costs
 * one route handler, so it is here, but everything that actually decides whether
 * a crawler reads this site is server-rendered HTML, the schema.org blocks in
 * app/typeshala/layout.tsx, and app/robots.ts — all of which came first.
 *
 * Served on both hosts because one app answers for both. The content follows the
 * host: asking the typeshala subdomain about the portfolio would be the kind of
 * mismatched summary this file exists to avoid.
 */
const TYPESHALA_LLMSTXT = `# ${TYPESHALA_NAME}

> ${TYPESHALA_DESCRIPTION}

${TYPESHALA_INTRO.join("\n\n")}

## Links

- [Download](${TYPESHala_SITE_URL}): installers for Windows, macOS and Linux
- [Source (GitLab)](${TYPESHALA_REPO_URL}): source of truth, issues and merge requests
- [Releases and changelogs](${TYPESHALA_GITHUB_URL}/releases): CI mirror that carries the built installers
- [License (MIT)](${TYPESHALA_LICENSE})
- [Author](${TYPESHALA_AUTHOR_URL})

## FAQ

${TYPESHALA_FAQ.map(({ question, answer }) => `### ${question}\n\n${answer}`).join("\n\n")}
`;

const PORTFOLIO_LLMSTXT = `# ${TYPESHALA_AUTHOR}

> Portfolio of ${TYPESHALA_AUTHOR} — full-stack web developer working with the MERN stack, Next.js and Supabase.

## Links

- [Home](${PORTFOLIO_URL})
- [Projects](${PORTFOLIO_URL}/projects)
- [Blog](${PORTFOLIO_URL}/blogs)
- [About](${PORTFOLIO_URL}/about)
- [Contact](${PORTFOLIO_URL}/contact)
- [Typeshala](${TYPESHala_SITE_URL}): free, open-source Nepali and English typing tutor
`;

export const dynamic = "force-dynamic";

export async function GET() {
  const host = (await headers()).get("host");
  const body = isTypeshalaHost(host) ? TYPESHALA_LLMSTXT : PORTFOLIO_LLMSTXT;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}