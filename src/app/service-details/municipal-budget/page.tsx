'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalBudgetPage() {
  return (
    <>
      <PageHeader
        title="Municipal Budget Office"
        description="Obligation requests, barangay budget review, and SEF budget preparation"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Taxation & Payments', href: '/services/tax-payments' },
          { label: 'Municipal Budget Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Obligation requests, barangay budget review, and SEF budget preparation.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Budget Office</span>
              <span><strong>Fee:</strong> Free</span>
              <span><strong>Processing:</strong> 15 min - 1 day</span>
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
