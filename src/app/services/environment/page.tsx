'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function EnvironmentPage() {
  return (
    <>
      <PageHeader
        title="Environment Services"
        description="Waste management and environmental protection."
        badge={{ icon: 'bi bi-globe-americas', label: 'Environment' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Environment Services' },
        ]}
      />

    </>
  );
}
