'use client';

import PageHeader from '@/components/layout/PageHeader';
import ServiceEntry from '@/components/layout/ServiceEntry';
import CharterPointer from '@/components/layout/CharterPointer';
import { containerClass, sectionClass } from '@/components/layout/Container';


export default function CertificatesPage() {
  return (
    <>
      <PageHeader
        title="Certificates & Vital Records"
        description="Official documents for birth, death, marriage, and other vital records."
        badge={{ icon: 'bi bi-file-earmark-text-fill', label: 'Certificates' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Certificates & Vital Records' },
        ]}
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          <ul className="m-0 list-none p-0">
            <ServiceEntry
              href="/government"
              title="Barangay Clearance"
              description="Certificate of residence from your barangay"
            />
            <ServiceEntry
              href="/government"
              title="Barangay ID"
              description="Official barangay identification card"
            />
            <ServiceEntry
              href="/contact"
              title="Police Clearance"
              description="Police clearance coordination through municipal office"
            />
          </ul>
        </div>
      </section>

      {/* Citizen's Charter pointer */}
      <section className={sectionClass} aria-label="Fees and requirements">
        <div className={containerClass}>
          <CharterPointer />
        </div>
      </section>
    </>
  );
}
