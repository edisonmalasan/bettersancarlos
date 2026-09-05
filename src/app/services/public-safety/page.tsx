'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


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
            <Link href="/service-details/public-safety" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Emergency Response</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">24/7 emergency assistance and rescue</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> Immediate</span>
              </div>
            </Link>
            <Link href="/service-details/public-safety" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Disaster Preparedness</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">Training and resources for disaster readiness</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> Varies</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
