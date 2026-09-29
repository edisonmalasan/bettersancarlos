'use client';

import PageHeader from '@/components/layout/PageHeader';
import ServiceEntry from '@/components/layout/ServiceEntry';
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
              meta={[
                { label: 'Office', value: 'Barangay Hall' },
                { label: 'Fee', value: '₱50-100' },
                { label: 'Time', value: 'Same day' },
              ]}
            />
            <ServiceEntry
              href="/government"
              title="Barangay ID"
              description="Official barangay identification card"
              meta={[
                { label: 'Office', value: 'Barangay Hall' },
                { label: 'Fee', value: 'Free' },
                { label: 'Time', value: '1-2 days' },
              ]}
            />
            <ServiceEntry
              href="/contact"
              title="Police Clearance"
              description="Police clearance coordination through municipal office"
              meta={[
                { label: 'Office', value: 'PNP San Carlos' },
                { label: 'Fee', value: 'Varies' },
                { label: 'Time', value: '3-5 days' },
              ]}
            />
          </ul>
        </div>
      </section>
    </>
  );
}
