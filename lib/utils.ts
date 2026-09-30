import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * earlier conflicting ones (so a `className` prop can override a component
 * default without fighting specificity).
 *
 * `extendTailwindMerge` is not decoration. This repo's type scale is declared
 * in `app/globals.css` as `--text-micro`, `--text-caption`, `--text-lede`,
 * `--text-title` and `--text-display`, which Tailwind turns into
 * `text-micro`, `text-caption` and so on. Stock tailwind-merge does not know
 * those names, so it classifies every `text-*` utility as a *colour* — one
 * group — and the later one deletes the earlier. The visible symptom was a
 * breadcrumb written as
 *
 *   cn("... font-mono text-micro text-low")
 *
 * merging down to `font-mono text-low`: the 11.5px silently vanished and the
 * crumb rendered at 16px. Same for `text-caption text-mid`, and for
 * `text-title font-bold text-hi`, where the title size was the thing dropped.
 * Nothing warns; the class is simply gone from the DOM.
 *
 * Declaring the custom sizes in the `font-size` group makes the two
 * categories distinct, so both survive and only a real conflict collapses.
 *
 * The tokens are listed explicitly rather than by prefix. A broad rule would
 * also reclassify `text-hi`, `text-mid` and `text-low`, which ARE colours, and
 * reclassifying a colour as a size is the same class of bug in reverse.
 */
const tokens = ["micro", "caption", "lede", "title", "display"] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...tokens] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
