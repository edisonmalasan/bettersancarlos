'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function GeneralServicesPage() {
  return (
    <>
      <PageHeader
        title="Municipal General Services Office"
        description="Property management, vehicle maintenance, and general municipal services"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Government Services', href: '/services/government' },
          { label: 'Municipal General Services Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Property management, vehicle maintenance, and general municipal services.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> General Services Office</span>
              <span><strong>Fee:</strong> Free</span>
              <span><strong>Processing:</strong> Varies</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/government" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Government Services
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
