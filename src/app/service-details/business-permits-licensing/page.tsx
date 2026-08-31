'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function BusinessPermitsLicensingPage() {
  return (
    <>
      <PageHeader
        title="Business Permits & Licensing Section"
        description="New permits, renewals, Mayor\'s clearance, and other business permits"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business, Trade & Investment', href: '/services/business' },
          { label: 'Business Permits & Licensing Section' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">New permits, renewals, Mayor\'s clearance, and other business permits.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Mayor's Office - BPLS</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> 1-5 days</span>
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
