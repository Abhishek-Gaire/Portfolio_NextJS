"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";
import type { Project } from "../../types/project";

/**
 * The detail view for a project, split out of the old ProjectsGrid.
 *
 * ProjectsGrid drew the cards and the dialog in one component, which meant the
 * page client could not adopt the reference's card markup without also
 * rewriting the dialog. The dialog is the part with real behaviour in it — the
 * Escape handler and the body scroll lock — so it is kept verbatim and the card
 * markup moved to ProjectsPageClient.
 *
 * The scroll lock is the only `document.body.style` write in the app. Any other
 * primitive that locks scroll will collide with it.
 */

const DIALOG_TITLE_ID = "project-dialog-title";

const DIALOG_LABEL_CLASS =
  "mb-2 font-mono text-micro uppercase tracking-[0.14em] text-low";

type ProjectDialogProps = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  useEffect(() => {
    if (!project) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  const year = project.completionDate
    ? new Date(project.completionDate).getFullYear()
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={DIALOG_TITLE_ID}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-card border border-line bg-code-bg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-6 sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              {year ? <MonoTag className="mb-2.5">{year}</MonoTag> : null}
              <h2 id={DIALOG_TITLE_ID} className="text-title font-bold text-hi">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close project details"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-hi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {project.image_url?.trim() ? (
            <div className="mb-6 overflow-hidden rounded-tile border border-line">
              <Image
                src={project.image_url.trim()}
                alt={project.title}
                width={1200}
                height={600}
                sizes="100vw"
                unoptimized
                className="h-64 w-full object-cover"
              />
            </div>
          ) : null}

          <div className="space-y-6">
            <div>
              <h3 className={DIALOG_LABEL_CLASS}>Description</h3>
              <p className="text-[14px] leading-[1.65] text-mid">
                {project.description}
              </p>
            </div>
            <div>
              <h3 className={DIALOG_LABEL_CLASS}>Role</h3>
              <p className="text-[14px] leading-[1.65] text-mid">
                {project.role}
              </p>
            </div>
            {project.challenges ? (
              <div>
                <h3 className={DIALOG_LABEL_CLASS}>Challenges</h3>
                <p className="text-[14px] leading-[1.65] text-mid">
                  {project.challenges}
                </p>
              </div>
            ) : null}
            {project.solutions ? (
              <div>
                <h3 className={DIALOG_LABEL_CLASS}>Solutions</h3>
                <p className="text-[14px] leading-[1.65] text-mid">
                  {project.solutions}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
              {project.live_url ? (
                <Button
                  as="a"
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  Live site
                </Button>
              ) : null}
              {project.github_url ? (
                <Button
                  as="a"
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View code
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
