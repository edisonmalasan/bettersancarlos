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
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Apply for tricycle franchise (MTOF) and request records.</p>
            
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
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> BPLS / SBO</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> 3-5 days</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/business" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Business, Trade & Investment
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
