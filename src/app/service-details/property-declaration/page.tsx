'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function PropertyDeclarationPage() {
  return (
    <>
      <PageHeader
        title="Declaration of Land, Building and Machineries"
        description="Declaration of land, building and machineries for tax assessment"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Taxation & Payments', href: '/services/tax-payments' },
          { label: 'Declaration of Land, Building and Machineries' },
        ]}
      />
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div>
            <p className="mb-4 text-[1.125rem] text-[#5c6b73]">Declaration of land, building and machineries for tax assessment.</p>
            
            <div className="flex gap-6 border-t border-[#eaece8] pt-3 text-[0.8125rem] text-[#5c6b73]" style={{ marginTop: '1.5rem' }}>
              <span className="flex items-center gap-1"><strong className="text-[#2f3e46]">Office:</strong> Municipal Assessor's Office</span>
              <span className="flex items-center gap-1"><strong className="text-[#2f3e46]">Fee:</strong> Varies</span>
              <span className="flex items-center gap-1"><strong className="text-[#2f3e46]">Processing:</strong> 3-5 days</span>
            </div>
            <p className="mb-4" style={{ marginTop: '1.5rem' }}>
              <Link href="/services/tax-payments" className="inline-block rounded-lg border-2 border-primary bg-white px-6 py-3 text-center font-semibold text-primary no-underline transition-all duration-200 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(232, 153, 10,0.5)] hover:bg-[#faf9f6] hover:no-underline max-[767px]:px-5 max-[767px]:py-2.5 max-[767px]:text-[0.9375rem]">
                <i className="bi bi-arrow-left"></i> Back to Taxation & Payments
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
