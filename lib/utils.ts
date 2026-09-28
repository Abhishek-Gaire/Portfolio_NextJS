import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * earlier conflicting ones (so a `className` prop can override a component
 * default without fighting specificity).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
