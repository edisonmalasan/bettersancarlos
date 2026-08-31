'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function TaxPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Tax & Payments"
        description="Property tax, fees, and payment services."
        badge={{ icon: 'bi bi-cash-coin', label: 'Taxation' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Tax & Payments' },
        ]}
      />

    </>
  );
}
