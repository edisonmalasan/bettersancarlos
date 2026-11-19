import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import InfoBar from '@/components/layout/InfoBar';
import Footer from '@/components/layout/Footer';
import PageTitle from '@/components/layout/PageTitle';
import PWAManager from '@/components/PWAManager';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#3a7d44',
};

export const metadata: Metadata = {
  title: { default: 'Better San Carlos | Official Portal', template: '%s | Better San Carlos' },
  description: 'Better San Carlos - Your digital gateway to LGU San Carlos services.',
  referrer: 'strict-origin-when-cross-origin',
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
    <html lang="en" className={cn(inter.variable, "font-sans")}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
          integrity="sha384-4LISF5TTJX/fLmGSxO53rV4miRxdg84mZsxmO8Rx5jGtp/LbrixFETvWa5a6sESd"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/videos/hero-poster.jpg"
          fetchPriority="high"
        />
      </head>
      <body>
        <LanguageProvider>
          <PageTitle />
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[2000] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-deep focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            Skip to main content
          </a>
          <Header />
          <InfoBar />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <PWAManager />
        </LanguageProvider>
      </body>
    </html>
  );
}
