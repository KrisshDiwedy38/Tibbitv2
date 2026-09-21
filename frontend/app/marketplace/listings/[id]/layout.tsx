import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listing',
};

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
