'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SITE_NAME = 'Better San Carlos';
const DEFAULT_TITLE = `${SITE_NAME} | Official Portal`;

// Labels for routes whose last path segment is not a good page name.
const routeLabels: Record<string, string> = {
  '': DEFAULT_TITLE,
  services: 'Services Directory',
  government: 'Government',
  statistics: 'Statistics',
  legislative: 'Legislative',
  budget: 'Budget & Transparency',
  transparency: 'Budget & Transparency',
  contact: 'Contact Information',
  news: 'Latest Updates',
  quiz: 'History Quiz',
  faq: 'Frequently Asked Questions',
  about: 'About San Carlos City',
  health: 'Health Services',
  agriculture: 'Agriculture Services',
  education: 'Education Services',
  tourism: 'Tourism',
  transportation: 'Transportation',
  utilities: 'Utilities',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  accessibility: 'Accessibility',
  sitemap: 'Sitemap',
  officials: 'City Officials',
  'news-editor': 'News Editor',
  barangays: 'Barangays',
  certificates: 'Certificates & Vital Records',
  business: 'Business & Trade',
  'tax-payments': 'Tax & Payments',
  'social-services': 'Social Services',
  environment: 'Environment',
  infrastructure: 'Infrastructure',
  'public-safety': 'Public Safety',
  'disaster-preparedness': 'Disaster Preparedness',
};

function titleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return DEFAULT_TITLE;
  const last = segments[segments.length - 1].replace(/\.html$/, '');
  if (routeLabels[last]) return `${routeLabels[last]} | ${SITE_NAME}`;
  const words = last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return `${words} | ${SITE_NAME}`;
}

export default function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const title = titleFromPath(pathname);
    // Next's head manager restores metadata titles during hydration, so defer
    // until after that pass to keep the route-specific title.
    const id = window.setTimeout(() => {
      document.title = title;
    }, 100);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
