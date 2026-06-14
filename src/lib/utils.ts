import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolves a topic color from either a hex/rgb value or a CSS variable name. */
export function topicColor(tagVar: string): string {
  if (tagVar.startsWith("#") || tagVar.startsWith("rgb")) {
    return tagVar;
  }
  return `var(${tagVar})`;
}
