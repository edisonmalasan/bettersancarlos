'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { containerClass, sectionClass } from '@/components/layout/Container';

export default function HumanResourceManagementPage() {
  return (
    <>
      <PageHeader
        title="Human Resource Management Section"
        description="Employment, personnel records, and HR services"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          
          { label: 'Human Resource Management Section' },
        ]}
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          <div>
            <p className="mb-4 text-[1.125rem] text-muted-foreground">Employment, personnel records, and HR services.</p>

            <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground" style={{ marginTop: '1.5rem' }}>
              <span className="flex items-center gap-1"><strong className="text-foreground">Office:</strong> Human Resource Management Office</span>
              <span className="flex items-center gap-1"><strong className="text-foreground">Fee:</strong> Varies</span>
              <span className="flex items-center gap-1"><strong className="text-foreground">Processing:</strong> Varies</span>
            </div>
            <p className="mb-4" style={{ marginTop: '1.5rem' }}>
              <Link href="/services" className="inline-block rounded-lg border-2 border-primary bg-white px-6 py-3 text-center font-semibold text-primary no-underline transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(232, 153, 10,0.5)] hover:bg-muted hover:no-underline max-[767px]:px-5 max-[767px]:py-2.5 max-[767px]:text-[0.9375rem]">
                <i className="bi bi-arrow-left"></i> Back to Services
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
