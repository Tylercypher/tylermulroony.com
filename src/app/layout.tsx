import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackgroundEffect from '@/components/layout/BackgroundEffect';
import CustomCursor from '@/components/layout/CustomCursor';

export const metadata: Metadata = {
  title: {
    default: 'Tyler Mulroony | Cybersecurity & Software Development',
    template: '%s | Tyler Mulroony',
  },
  description:
    'Cybersecurity professional and full-stack developer. Penetration testing, network security, secure web applications, and cloud infrastructure.',
  keywords: [
    'cybersecurity',
    'penetration testing',
    'full-stack developer',
    'network security',
    'web development',
    'Tyler Mulroony',
  ],
  authors: [{ name: 'Tyler Mulroony' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tylermulroony.com',
    siteName: 'Tyler Mulroony',
    title: 'Tyler Mulroony | Cybersecurity & Software Development',
    description:
      'Cybersecurity professional and full-stack developer. Securing systems, building solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tyler Mulroony | Cybersecurity & Software Development',
    description:
      'Cybersecurity professional and full-stack developer.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="stealth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <BackgroundEffect />
        <CustomCursor />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
