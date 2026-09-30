import Link from "next/link";

import { Reveal } from "@/components/primitives/Reveal";

/**
 * Ported from the reference project's home route:
 * ../remix-of-pixel-perfect/src/routes/index.tsx:208-223
 *
 * This replaces the previous home contact section, which was a two-column
 * block pairing a contact-details card with a full copy of the contact form.
 * The reference's home page does not do that — it ends with a short pitch and a
 * link through to /contact, which is where the form lives. That is the better
 * arrangement here too: the form was being rendered twice on the site, once on
 * / and once on /contact, and only the /contact copy is the real page.
 *
 * Token mapping, same as the header port: `max-w-5xl px-5` to the shell,
 * `text-muted-foreground` to `text-mid`, `border-border` to `border-line`,
 * `hover:border-primary/50 hover:text-primary` to the accent, and
 * `rounded-md` to `rounded-control`. The heading moves onto the bento
 * `text-title` scale, which is the same size the reference's
 * `text-2xl sm:text-3xl` resolves to.
 *
 * The reference's `focus-visible:ring-2 focus-visible:ring-ring
 * focus-visible:outline-none` is dropped: `ring-ring` is a shadcn token that
 * does not exist here, and `outline-none` would suppress the global
 * `:focus-visible` accent outline in globals.css.
 *
 * The heading is an h2 because the hero already owns the page's only h1.
 */
export default function ContactCta() {
  return (
    <section id="contact" className="py-16" aria-labelledby="contact-cta-heading">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <h2 id="contact-cta-heading" className="text-title font-bold text-hi">
            Have something to build?
          </h2>
          <p className="mt-3 max-w-measure text-[15px] text-mid">
            I take on a small number of engagements at a time. Tell me what
            you&apos;re working on.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-control border border-line px-5 py-2.5 font-mono text-xs text-hi transition-colors duration-200 hover:border-accent-line hover:text-accent"
          >
            Get in touch ↗
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
