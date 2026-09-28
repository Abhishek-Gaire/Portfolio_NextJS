import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "../../components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to discuss web development, collaboration opportunities, and project inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact",
    description:
      "Get in touch to discuss web development, collaboration opportunities, and project inquiries.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Get in touch to discuss web development, collaboration opportunities, and project inquiries.",
  },
};

const EMAIL = "abhisekgaire7@gmail.com";
const LOCATION = "Pokhara, Nepal";
const CV_URL =
  "https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Abhishek-Gaire" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abhisek-gaire-359294219/" },
  { label: "Twitter", href: "https://x.com/GaireAbhishek44" },
];

const REASONS = [
  { title: "Fast Response", detail: "I typically respond within 24 hours" },
  { title: "Quality Focused", detail: "Clean code and modern best practices" },
  { title: "Long-term Support", detail: "Ongoing maintenance and updates" },
];

/**
 * Layout ported from the remix reference at src/routes/contact.tsx:65-216:
 * breadcrumb, a two-column details/form split, the mono <dl> detail list, the
 * left-accent-bar "Why Work With Me?" list, and the hairline-grid form panel.
 *
 * Design only. The reference's submit handler is deliberately not ported — it
 * only fires a toast and writes nothing. ContactForm is reused unchanged so
 * the real submission path stays intact: POST /api/contact, the Zod validation
 * on that route, the Redis rate limit, the stripTags pass, and the Supabase
 * Contacts insert. The reference's per-field client validation and its
 * `text-destructive` styling came with that handler and are left behind with
 * it, since this form validates server-side and reports through toasts.
 *
 * The reference's world-map footer is ported, but the SVG is vendored into
 * public/world.svg rather than hotlinked from assets.aceternity.com, so this
 * route has no third-party runtime dependency and next.config.ts needs no new
 * remote pattern. The file is credited in its own header.
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-shell px-6 py-16">
        <nav aria-label="Breadcrumb" className="mb-12 text-sm">
          <Link
            href="/"
            className="text-mid transition-colors duration-200 hover:text-hi"
          >
            Home
          </Link>
          <span className="mx-2 text-low">/</span>
          <span className="font-semibold text-hi" aria-current="page">
            Contact
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs tracking-widest text-accent uppercase">
              Contact
            </p>
            <h1 className="mt-4 text-title font-bold tracking-tight text-hi">
              Let&apos;s talk about your system.
            </h1>

            <dl className="mt-10 space-y-5 font-mono text-xs">
              <div>
                <dt className="text-low">email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-hi transition-colors duration-200 hover:text-accent"
                  >
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-low">location</dt>
                <dd className="mt-1 text-hi">{LOCATION}</dd>
              </div>
            </dl>

            <a
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-control border border-line px-5 py-2.5 font-mono text-xs text-hi transition-colors duration-200 hover:border-accent-line hover:text-accent"
            >
              View &amp; Download CV
            </a>

            <ul className="mt-8 flex gap-5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-mid transition-colors duration-200 hover:text-accent"
                  >
                    {social.label} &#8599;
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 border-t border-line pt-8">
              <h2 className="text-[20px] font-semibold text-hi">
                Why Work With Me?
              </h2>
              <dl className="mt-6 space-y-5">
                {REASONS.map((reason) => (
                  <div key={reason.title} className="border-l-2 border-accent pl-4">
                    <dt className="text-sm font-medium text-hi">
                      {reason.title}
                    </dt>
                    <dd className="mt-1 text-sm text-mid">{reason.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/*
            The grid pattern is on the outer panel and the form sits on an inner
            translucent panel above it, as in the reference at :141-142. Without
            that inner layer the hairline grid runs straight through the input
            fields, which read as broken.
          */}
          <div className="grid-pattern rounded-card border border-line p-4 sm:p-5">
            <div className="rounded-card bg-bg/80 p-5 backdrop-blur-sm sm:p-6">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="mb-4 font-mono text-xs text-low">Based in Pokhara, Nepal</p>
          <div className="relative overflow-hidden rounded-card border border-line bg-surface p-4">
            <div className="relative">
              {/* next/image buys nothing here: it passes SVG through
                  unoptimised, and optimising SVG would need dangerouslyAllowSVG
                  in next.config. A plain img is the right tool for a local,
                  already-minimised vector. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/world.svg"
                alt="World map showing Pokhara, Nepal"
                loading="lazy"
                decoding="async"
                width={2000}
                height={857}
                className="block w-full opacity-30"
              />
              <span
                className="absolute top-[36.9%] left-[72.4%] -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-accent ring-2 ring-bg" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
