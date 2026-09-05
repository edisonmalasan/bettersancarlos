'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function SocialServicesPage() {
  return (
    <>
      <PageHeader
        title="Social Services"
        description="Support programs for vulnerable sectors and communities."
        badge={{ icon: 'bi bi-people-fill', label: 'Social Services' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Social Services' },
        ]}
      />
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <Link href="/service-details/social-services" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Senior Citizen ID</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">ID card and benefits for citizens 60 years and above</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> 1-2 weeks</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>PWD ID & Services</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">ID and benefits for persons with disabilities</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> 1-2 weeks</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Financial Assistance</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">Emergency financial aid for qualified residents</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> Varies</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Burial Assistance</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">Financial assistance for burial expenses</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> 1-3 days</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Solo Parent ID</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">ID and benefits for solo parents</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> 1-2 weeks</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
