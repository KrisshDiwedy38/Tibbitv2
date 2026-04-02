import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TIBBIT | Student-Led Marketplace',
  description: 'The playground for Gen Z hustlers. Trade goods, launch services, and scale your campus startup on a platform built for builders, by builders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="text-on-surface antialiased overflow-x-hidden min-h-screen relative">
        {children}
      </body>
    </html>
  );
}
