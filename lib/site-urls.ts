// Central place for cross-site URLs.
//
// In production the portfolio lives at https://abhishekgaire.com.np and the
// Typeshala page lives at https://typeshala.abhishekgaire.com.np. Links
// between the two sites MUST be absolute — a relative link like "/" would
// stay on the current subdomain and never reach the other site.
//
// Override with env vars if the domains ever change:
//   NEXT_PUBLIC_PORTFOLIO_URL=https://abhishekgaire.com.np
//   NEXT_PUBLIC_TYPESHala_SITE_URL=https://typeshala.abhishekgaire.com.np
//
// NOTE: this file is imported by proxy.ts (edge runtime), so keep it free
// of Node-only APIs — plain string operations only.

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

export const PORTFOLIO_URL: string = stripTrailingSlash(
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://abhishekgaire.com.np",
);

export const TYPESHala_SITE_URL: string = stripTrailingSlash(
  process.env.NEXT_PUBLIC_TYPESHala_SITE_URL ||
    "https://typeshala.abhishekgaire.com.np",
);

/** True when the request is served from the typeshala subdomain. */
export function isTypeshalaHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const hostname = host.split(":")[0].toLowerCase();
  return (
    hostname === "typeshala.abhishekgaire.com.np" ||
    hostname.startsWith("typeshala.")
  );
}
