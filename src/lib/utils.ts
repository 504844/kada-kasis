import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFullImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://static2.krepsinis.net${url}`;
}