'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalTreasurerPage() {
  return (
    <>
      <PageHeader
        title="Municipal Treasurer\'s Office"
        description="Tax collection, fee payments, and financial services for San Carlos residents"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Taxation & Payments', href: '/services/tax-payments' },
          { label: 'Municipal Treasurer\'s Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Tax collection, cedula, clearances, and payment services.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Treasurer's Office</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> Same day</span>
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
