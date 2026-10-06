import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import {
  PORTFOLIO_URL,
  TYPESHala_SITE_URL,
  isTypeshalaHost,
} from "@/lib/site-urls";

/**
 * One app serves both hosts, so this file answers for whichever one asked.
 * `metadataBase` and the sitemap pointer in app/typeshala/layout.tsx are already
 * subdomain-aware; a robots.txt that pointed at the portfolio's sitemap while the
 * typeshala subdomain served it would tell a crawler the two were one site.
 */
async function currentHostIsTypeshala(): Promise<boolean> {
  const host = (await headers()).get("host");
  return isTypeshalaHost(host);
}

/**
 * AI crawlers are listed explicitly, one group per class.
 *
 * A bare `User-agent: *` / `Allow: /` already covers all of them — they honour
 * robots.txt like anything else — so these rules are documentation, not
 * permission. They earn their place for two reasons. First, the two classes
 * behave differently and only one of them is what gets an app cited: the search
 * indexers (OAI-SearchBot, PerplexityBot, Claude-User, Google-Extended) decide
 * whether the app shows up in an answer, while the training crawlers (GPTBot,
 * CCBot, ClaudeBot) only decide whether the text ends up in a model. Second, a
 * future block aimed at training crawlers is then a two-line edit that cannot
 * accidentally take the indexers down with it.
 *
 * The explicit `Allow: /` also matters because several of these bots treat a
 * missing directive group as a full disallow rather than falling through to
 * the `*` group — being explicit removes the ambiguity.
 */
const AI_CRAWLER_GROUPS: string[][] = [
  // Search indexers — these are the ones that surface the app in an answer.
  ["OAI-SearchBot", "ChatGPT-User"],
  ["PerplexityBot", "Perplexity-User"],
  ["Claude-User", "Claude-SearchBot"],
  ["Google-Extended"],
  // Training crawlers — opt in only if you want the source in the training set.
  ["GPTBot", "CCBot", "ClaudeBot"],
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const onTypeshala = await currentHostIsTypeshala();
  const siteUrl = onTypeshala ? TYPESHala_SITE_URL : PORTFOLIO_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: onTypeshala
          ? // The Typeshala page has no admin, login or API surface of its own.
            []
          : ["/admin", "/admin/*", "/login", "/api/"],
      },
      ...AI_CRAWLER_GROUPS.map((group) => ({
        userAgent: group,
        allow: "/",
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}