import type { ReactNode } from "react";
import {
  Mail,
  MapPin,
  Download,
  FileText,
} from "lucide-react";
import {
  Github,
  Linkedin,
  Twitter,
} from "@/components/icons";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";

const CV_URL =
  "https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf";

const socials = [
  {
    href: "https://github.com/Abhishek-Gaire",
    label: "GitHub Profile",
    Icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/abhisek-gaire-359294219/",
    label: "LinkedIn Profile",
    Icon: Linkedin,
  },
  {
    href: "https://x.com/GaireAbhishek44",
    label: "Twitter Profile",
    Icon: Twitter,
  },
];

const reasons = [
  {
    title: "Fast Response",
    detail: "I typically respond within 24 hours",
  },
  {
    title: "Quality Focused",
    detail: "Clean code and modern best practices",
  },
  {
    title: "Long-term Support",
    detail: "Ongoing maintenance and updates",
  },
];

function DetailIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] border border-accent-line bg-accent-soft text-accent">
      {children}
    </span>
  );
}

export default function ContactInformation() {
  return (
    <div className="flex flex-col gap-4">
      <BentoCard>
        <div className="flex flex-col px-6 pb-6 pt-2">
          <div className="flex items-center gap-3.5 border-b border-line py-4">
            <DetailIcon>
              <Mail className="h-4 w-4" />
            </DetailIcon>
            <div>
              <p className="font-mono text-[11.5px] text-low">Email</p>
              <a
                href="mailto:abhisekgaire7@gmail.com"
                className="text-[14.5px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
              >
                abhisekgaire7@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3.5 py-4">
            <DetailIcon>
              <MapPin className="h-4 w-4" />
            </DetailIcon>
            <div>
              <p className="font-mono text-[11.5px] text-low">Location</p>
              <p className="text-[14.5px] font-semibold text-hi">
                Pokhara, Nepal
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-line px-6 py-5">
          <div className="mb-4 flex items-center gap-3.5">
            <DetailIcon>
              <FileText className="h-4 w-4" />
            </DetailIcon>
            <div>
              <h3 className="text-[15px] font-semibold text-hi">
                Professional CV
              </h3>
              <p className="text-[12.5px] text-mid">
                Download my complete resume
              </p>
            </div>
          </div>

          <Button
            as="a"
            variant="primary"
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full justify-center"
          >
            <Download className="h-4 w-4" />
            <span>View &amp; Download CV</span>
          </Button>
        </div>

        <div className="border-t border-line px-6 py-5">
          <p className="mb-3 font-mono text-[11.5px] text-low">Follow Me</p>
          <div className="flex gap-2.5">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-accent"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </BentoCard>

      <BentoCard className="p-5">
        <h3 className="mb-4 text-[15px] font-semibold text-hi">
          Why Work With Me?
        </h3>
        <ul className="flex flex-col gap-3.5">
          {reasons.map(({ title, detail }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div>
                <h4 className="text-[14px] font-semibold text-hi">{title}</h4>
                <p className="text-[12.5px] leading-[1.5] text-mid">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </BentoCard>
    </div>
  );
}
