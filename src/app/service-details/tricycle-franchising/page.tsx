'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function TricycleFranchisingPage() {
  return (
    <>
      <PageHeader
        title="Tricycle Franchising and Records Sections"
        description="Apply for tricycle franchise (MTOF) and request records"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business, Trade & Investment', href: '/services/business' },
          { label: 'Tricycle Franchising and Records Sections' },
        ]}
      />
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div>
            <p className="mb-4 text-[1.125rem] text-[#666]">Apply for tricycle franchise (MTOF) and request records.</p>
            
            <h2>Process Flow</h2>
            <p>Step-by-step procedures for tricycle franchise and records request</p>
            <p>Submit documentary requirements to the BPLS</p>
            <p>BPLS Inspector inspects the tricycle unit</p>
            <p>Franchising Staff verifies records and assessment fees</p>
            <p>BPLS Inspector receives the franchise application form</p>
            <p>Municipal Mayor approves the application form</p>
            <p>Municipal Treasurer\'s Office collects the fees</p>
            <p>BPLS receives notarized application and other documentary requirements</p>
            <p>BPLS encodes the application into the system</p>
            <p>BPLS prepares the transmittal letter</p>
            <p>Submit transmittal letter and franchise applications to the SB</p>
            <p>Franchising Staff receives, inspects, and sorts applications</p>
            <p>Franchising Staff processes application and issues certification</p>
            <p>Sangguniang Bayan Members approve the MTOF</p>
            <p>Vice Mayor and Presiding Officer sign the approved MTOF</p>
            <p>Franchising Staff releases the MTOF to the applicant</p>
            <p>VMO/SBO Staff receives the letter of request</p>
            <p>Vice Mayor or Secretary to the Sanggunian approves/disapproves the request</p>
            <p>Records Officer II reviews and determines document availability</p>
            <p>Records Staff retrieves and reproduces the requested documents</p>
            <p>Records Officer III releases and stamps the requested documents</p>
            <div className="flex gap-6 border-t border-[#f0f0f0] pt-3 text-[0.8125rem] text-[#666]" style={{ marginTop: '1.5rem' }}>
              <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Office:</strong> BPLS / SBO</span>
              <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Fee:</strong> Varies</span>
              <span className="flex items-center gap-1"><strong className="text-[#1a1a1a]">Processing:</strong> 3-5 days</span>
            </div>
            <p className="mb-4" style={{ marginTop: '1.5rem' }}>
              <Link href="/services/business" className="inline-block rounded-lg border-2 border-primary bg-white px-6 py-3 text-center font-semibold text-primary no-underline transition-all duration-200 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(247,127,0,0.5)] hover:bg-[#f8f9fa] hover:no-underline max-[767px]:px-5 max-[767px]:py-2.5 max-[767px]:text-[0.9375rem]">
                <i className="bi bi-arrow-left"></i> Back to Business, Trade & Investment
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
