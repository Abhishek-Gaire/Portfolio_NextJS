import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The site breadcrumb, in one place.
 *
 * It existed in two incompatible forms. The reference project uses
 * `mb-10 text-sm` in the sans face on every route that has one, and /about
 * and /contact were ported with that markup intact. The routes written
 * against the bento tokens use `font-mono text-micro` instead, matching the
 * header, the footer and every other piece of chrome. So the same control was
 * 14px sans on two pages and 11.5px mono on three, with `mb-12` against
 * `mb-8`, a styled separator against an aria-hidden one, and `aria-current`
 * present on some and missing on others.
 *
 * This is the bento form, which is the house style. A server component: it
 * holds no state and needs no client JavaScript.
 */
type Crumb = {
  label: string;
  /** Omit on the last crumb — that is the current page, not a link. */
  href?: string;
};

export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-8 flex items-center gap-2 font-mono text-micro text-low",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-low">
                /
              </span>
            ) : null}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors duration-200 hover:text-accent"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn("truncate", isLast && "text-mid")}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
