import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tibbit - Waitlist',
  description: 'Join the waitlist for the vibrant new marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative">
        {children}
      </body>
    </html>
  );
}
