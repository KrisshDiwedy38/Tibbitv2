import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPostAuthDestination(value?: string | null) {
  return value === "/launchpad" || value === "/community" ? value : "/marketplace";
}

export function getAuthEntryHref(destination: "/launchpad" | "/community") {
  return `/register?redirect=${encodeURIComponent(destination)}`;
}

export function listingHref(id: number | string, slug?: string | null) {
  return `/marketplace/listings/${slug ? `${id}-${slug}` : id}`;
}
