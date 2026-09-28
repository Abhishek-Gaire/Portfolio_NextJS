import ContactForm from "../contact/ContactForm";
import ContactInformation from "../contact/ContactInformation";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

export default function HomeContact() {
  return (
    <section id="contact" className="py-16">
      <div className="mx-auto max-w-shell px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-4">
            <Reveal>
              <SectionHead
                eyebrow="LET'S CONNECT"
                title="Get in touch"
                lede={
                  "Ready to bring your ideas to life? Let's discuss your project and create something amazing together."
                }
              />
            </Reveal>

            <ContactInformation />
          </div>

          <Reveal delay={80} className="h-full">
            <BentoCard className="h-full p-6 sm:p-7">
              <ContactForm />
            </BentoCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
