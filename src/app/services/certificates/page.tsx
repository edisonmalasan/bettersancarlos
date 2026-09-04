'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


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
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <Link href="/service-details/certificates" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(0,50,160,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Barangay Clearance</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">Certificate of residence from your barangay</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> ₱50-100</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> Same day</span>
              </div>
            </Link>
            <Link href="/service-details/certificates" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(0,50,160,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Barangay ID</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">Official barangay identification card</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> 1-2 days</span>
              </div>
            </Link>
            <Link href="/service-details/certificates" className="rounded-[10px] border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-200 hover:border-primary hover:no-underline hover:shadow-[0_4px_12px_rgba(0,50,160,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#1a1a1a]">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Police Clearance</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#666]">Police clearance coordination through municipal office</p>
              <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]">
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Varies</span>
                <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Time:</strong> 3-5 days</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
