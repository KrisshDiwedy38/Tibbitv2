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

export function formatListingPrice(price: string | number, pricingUnit?: string | null) {
  const amount = `₹${parseFloat(String(price)).toLocaleString('en-IN')}`;
  return pricingUnit === 'hourly' ? `${amount}/hr` : amount;
}

export function soldOutLabel(listingType?: string | null) {
  return listingType === 'service' ? 'BOOKED' : 'SOLD OUT';
}
