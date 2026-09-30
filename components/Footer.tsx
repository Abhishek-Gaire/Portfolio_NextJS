import { CONTACT_EMAIL } from "@/lib/site-urls";

/**
 * Ported from the reference project's
 * ../remix-of-pixel-perfect/src/components/site-header.tsx:42-55
 *
 * This replaces a three-column footer carrying the wordmark, a CV download
 * button, three social buttons, a quick-links list and a services list. The
 * reference is a single row: location on the left, mailto on the right. The CV
 * and the social profiles are still reachable from the hero, the contact page
 * and the about page, so nothing becomes unreachable by dropping them here.
 *
 * Token mapping, same as the header port: `border-t border-border` to
 * `border-line`, `text-muted-foreground` to `text-mid`, `hover:text-primary`
 * to the accent, and `max-w-5xl px-5` to the shell. The reference's
 * `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` is
 * dropped — `ring-ring` does not exist here, and `outline-none` would suppress
 * the global `:focus-visible` accent outline in globals.css.
 *
 * The reference spells the name "Abhisek Gaire". Every other surface on this
 * site says "Abhishek Gaire", including the JSON-LD, the title tag and the
 * social profiles, so the correct spelling is used here.
 */
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-shell flex-col gap-2 px-6 py-10 font-mono text-xs text-mid sm:flex-row sm:items-center sm:justify-between">
        <span>Abhishek Gaire — Pokhara, Nepal</span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="transition-colors duration-200 hover:text-accent"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
