import type { Metadata } from 'next';
import MarketplaceShell from './MarketplaceShell';

export const metadata: Metadata = {
  title: 'Marketplace',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <MarketplaceShell>{children}</MarketplaceShell>;
}
