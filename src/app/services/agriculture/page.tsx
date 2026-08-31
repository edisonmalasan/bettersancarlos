'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function AgriculturePage() {
  return (
    <>
      <PageHeader
        title="Agriculture Services"
        description="Support for farmers and agricultural development."
        badge={{ icon: 'bi bi-tree-fill', label: 'Agriculture' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Agriculture Services' },
        ]}
      />

    </>
  );
}
