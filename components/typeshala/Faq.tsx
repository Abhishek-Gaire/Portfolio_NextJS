import { HelpCircle } from "lucide-react";

import { BentoCard } from "@/components/primitives/BentoCard";
import { SectionHead } from "@/components/primitives/SectionHead";

import { TYPESHALA_FAQ } from "@/lib/typeshala-content";

/**
 * The visible half of the FAQ. The JSON-LD half is generated from the same array
 * in app/typeshala/layout.tsx, so the two cannot describe different answers.
 *
 * Every answer is rendered in the HTML, not behind a <details> toggle or a
 * "read more" button. Google requires FAQ answers to be visible on the page and
 * AI assistants quote what they can see without interacting — a collapsed
 * accordion is present in the markup but reads as empty to both.
 *
 * No <Reveal> wrapper, unlike every other section on this page. Reveal ships
 * `opacity-0` in the server HTML and only un-hides it from an IntersectionObserver
 * on the client, so wrapped content is invisible to anyone without JavaScript —
 * and a FAQ whose answers are invisible is exactly the mismatch between the
 * structured data and the page that gets a manual action. The section is last on
 * a long page and has nothing to reveal: the reader is already there.
 */
export function TypeshalaFaq() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-shell px-6">
        <SectionHead
          eyebrow="FAQ"
          title="Frequently asked questions"
          lede="What people usually want to know before they install it."
        />

        <dl className="grid gap-4 lg:grid-cols-2">
          {TYPESHALA_FAQ.map(({ question, answer }) => (
            <BentoCard key={question} className="h-full p-5">
              <dt className="mb-2 flex items-start gap-2.5 text-[15px] font-semibold text-hi">
                <HelpCircle
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                />
                <span>{question}</span>
              </dt>
              <dd className="text-[13px] leading-[1.6] text-mid">{answer}</dd>
            </BentoCard>
          ))}
        </dl>
      </div>
    </section>
  );
}