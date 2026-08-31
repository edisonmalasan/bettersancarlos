'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function BusinessPage() {
  return (
    <>
      <PageHeader
        title="Business Services"
        description="Permits, licenses, and support for businesses in San Carlos."
        badge={{ icon: 'bi bi-shop', label: 'Business' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business Services' },
        ]}
      />

    </>
  );
}
