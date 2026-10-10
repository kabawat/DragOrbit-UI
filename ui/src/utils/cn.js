import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes, correctly handling overrides and conditional classes.
 * @param {...import("clsx").ClassValue} inputs - Classes to merge.
 * @returns {string} - The merged classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
