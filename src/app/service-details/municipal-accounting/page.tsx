'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalAccountingPage() {
  return (
    <>
      <PageHeader
        title="Municipal Accounting Office"
        description="Pre-audit of disbursements, payroll, check issuance, and financial reporting"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Taxation & Payments', href: '/services/tax-payments' },
          { label: 'Municipal Accounting Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Pre-audit of disbursements, payroll, check issuance, and financial reporting.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Accounting Office</span>
              <span><strong>Fee:</strong> Free</span>
              <span><strong>Processing:</strong> Varies</span>
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
