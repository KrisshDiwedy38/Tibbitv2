import type { Metadata, Viewport } from 'next';
import './globals.css';
import GlobalPreloader from '@/components/layout/GlobalPreloader';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'TIBBIT | Student-led Marketplace',
  description: 'The playground for Gen Z hustlers. Trade goods, launch services, and scale your campus startup on a platform built for builders, by builders.',
  icons: {
    icon: [
      { url: '/images/tibbit-favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/tibbit-favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/tibbit-favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/images/tibbit-favicon-32.png',
    apple: '/images/tibbit-favicon-64.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="site-shell text-on-surface antialiased overflow-x-clip min-h-screen relative">
        <GlobalPreloader>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GlobalPreloader>
      </body>

    </html>
  );
}
