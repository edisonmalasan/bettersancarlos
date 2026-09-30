'use client';

import PageHeader from '@/components/layout/PageHeader';
import ServiceEntry from '@/components/layout/ServiceEntry';
import CharterPointer from '@/components/layout/CharterPointer';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import { containerClass, sectionClass } from '@/components/layout/Container';


export default function PublicSafetyPage() {
  return (
    <>
      <PageHeader
        title="Public Safety Services"
        description="Emergency response and disaster preparedness."
        badge={{ icon: 'bi bi-shield-fill-check', label: 'Public Safety' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Public Safety Services' },
        ]}
      />
      <section className={sectionClass}>
        <div className={containerClass}>
          <ul className="m-0 list-none p-0">
            <ServiceEntry
              href="/contact"
              title="Emergency Response"
              description="24/7 emergency assistance and rescue"
            />
            <ServiceEntry
              href="/disaster-preparedness"
              title="Disaster Preparedness"
              description="Training and resources for disaster readiness"
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

      {/* Disaster preparedness directory cross-link */}
      <section className={sectionClass} aria-label="Disaster preparedness directory">
        <div className={containerClass}>
          <DirectoryLinkCard
            href="/disaster-preparedness"
            icon="bi bi-shield-fill-check"
            title="Disaster Preparedness Guide"
            description="CDRRMO contacts and evacuation sites for San Carlos City, Pangasinan"
          />
        </div>
      </section>
    </>
  );
}
