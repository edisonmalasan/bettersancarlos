'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalAssessorPage() {
  return (
    <>
      <PageHeader
        title="Property Assessment Services"
        description="Property assessment, tax declaration, and land records"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Taxation & Payments', href: '/services/tax-payments' },
          { label: 'Property Assessment Services' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Property assessment, tax declaration, and land records.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Assessor's Office</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> 3-5 days</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/tax-payments" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Taxation & Payments
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
