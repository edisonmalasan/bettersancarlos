'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <Link href="/contact" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline duration-200 hover:border-primary hover:no-underline transition-colors">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Emergency Response</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">24/7 emergency assistance and rescue</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><strong className="text-foreground">Office:</strong> MDRRMO</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Time:</strong> Immediate</span>
              </div>
            </Link>
            <Link href="/disaster-preparedness" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline duration-200 hover:border-primary hover:no-underline transition-colors">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Disaster Preparedness</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Training and resources for disaster readiness</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><strong className="text-foreground">Office:</strong> MDRRMO</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Time:</strong> Varies</span>
              </div>
            </Link>
          </div>
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
