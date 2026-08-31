import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import InfoBar from '@/components/layout/InfoBar';
import Footer from '@/components/layout/Footer';
import PWAManager from '@/components/PWAManager';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { cn } from "@/lib/utils";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: '#0032a0',
};

export const metadata: Metadata = {
  title: { default: 'Better San Carlos | Official Portal', template: '%s | Better San Carlos' },
  description: 'Better San Carlos - Your digital gateway to LGU San Carlos services.',
  keywords: ['BetterSanCarlos', 'San Carlos City, Pangasinan', 'LGU San Carlos', 'municipal services'],
  authors: [{ name: 'Edison' }],
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://bettersancarlos.vercel.app/',
    siteName: 'Better San Carlos',
    title: 'Better San Carlos | Official Portal',
    description: 'Empowering the people of San Carlos with transparent access to services.',
    images: [
      {
        url: 'https://bettersancarlos.vercel.app/assets/images/banners/opengraph.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/images/logo/favicon.svg', apple: '/assets/images/logo/favicon.svg' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BetterSanCarlos',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans")}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="stylesheet" href="/assets/css/accessibility.css" />
        <link rel="stylesheet" href="/assets/css/footer.css" />
        <link rel="stylesheet" href="/assets/css/statistics.css" />
      </head>
      <body>
        <LanguageProvider>
          <a href="#main-content" className="skip-link hidden">
            Skip to main content
          </a>
          <Header />
          <InfoBar />
          <main id="main-content">{children}</main>
          <Footer />
          <PWAManager />
        </LanguageProvider>
        <Script
          src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
