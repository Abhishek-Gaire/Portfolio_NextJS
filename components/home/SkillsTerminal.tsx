import type { ReactNode } from "react";

import { WindowChrome } from "@/components/primitives/WindowChrome";
import { cn } from "@/lib/utils";

export type SkillDirectory = {
  name: string;
  /** Tailwind text colour for the directory name inside the tree. */
  dirClassName: string;
  items: string[];
};

type SkillsTerminalProps = {
  directories: SkillDirectory[];
  className?: string;
};

/*
 * Box-drawing prefixes, U+2502 / U+2500 / U+251C / U+2514. They are the whole
 * content of this panel and the Google Fonts `latin` subset of IBM Plex Mono
 * has none of them, so the full 930-codepoint files in public/fonts have to stay
 * wired up in app/layout.tsx.
 */
const TEE = "\u2502   ";
const ELBOW = "\u251C\u2500\u2500 ";
const LAST_ELBOW = "\u2514\u2500\u2500 ";
const BLANK_GUTTER = "    ";

function TreeLine({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn("block", className)}>{children}</span>;
}

export function SkillsTerminal({ directories, className }: SkillsTerminalProps) {
  const fileCount = directories.reduce((total, dir) => total + dir.items.length, 0);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-line bg-code-bg",
        className,
      )}
    >
      <WindowChrome
        title="bash — skills"
        bodyClassName="overflow-x-auto p-5 px-5.5 pb-5.5"
      >
        <p className="mb-3.5 whitespace-nowrap font-mono text-[13px] text-mid">
          <span className="text-accent">abhishek@dev</span>
          <span>:</span>
          <span className="text-violet">~/skills</span>
          <span>$ tree --by-category</span>
        </p>

        <pre className="m-0 font-mono text-[13px] leading-[1.85] whitespace-pre text-mid">
          <TreeLine>skills</TreeLine>
          {directories.map((dir, dirIndex) => {
            const isLastDir = dirIndex === directories.length - 1;
            const dirPrefix = isLastDir ? LAST_ELBOW : ELBOW;
            const gutter = isLastDir ? BLANK_GUTTER : TEE;
            return (
              <span key={dir.name} className="block">
                <TreeLine>
                  {dirPrefix}
                  <span className={dir.dirClassName}>{dir.name}</span>
                </TreeLine>
                {dir.items.map((item, itemIndex) => (
                  <TreeLine key={item}>
                    {gutter}
                    {itemIndex === dir.items.length - 1 ? LAST_ELBOW : ELBOW}
                    {item}
                  </TreeLine>
                ))}
              </span>
            );
          })}
        </pre>

        <span className="mt-2.5 block font-mono text-low">
          {directories.length} directories, {fileCount} files
          <span
            aria-hidden="true"
            className="animate-blink ml-1 inline-block h-[14px] w-[7px] align-middle bg-accent"
          />
        </span>
      </WindowChrome>
    </div>
  );
}

export default SkillsTerminal;
