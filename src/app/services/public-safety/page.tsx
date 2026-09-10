'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';


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
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <Link href="/service-details/public-safety" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Emergency Response</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">24/7 emergency assistance and rescue</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><strong className="text-foreground">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Time:</strong> Immediate</span>
              </div>
            </Link>
            <Link href="/service-details/public-safety" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Disaster Preparedness</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Training and resources for disaster readiness</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><strong className="text-foreground">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Time:</strong> Varies</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Disaster preparedness directory cross-link */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6" aria-label="Disaster preparedness directory">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
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
