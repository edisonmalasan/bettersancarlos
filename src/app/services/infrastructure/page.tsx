'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function InfrastructurePage() {
  return (
    <>
      <PageHeader
        title="Infrastructure Services"
        description="Building permits, construction, and engineering services."
        badge={{ icon: 'bi bi-building-fill-gear', label: 'Infrastructure' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Infrastructure Services' },
        ]}
      />

    </>
  );
}
