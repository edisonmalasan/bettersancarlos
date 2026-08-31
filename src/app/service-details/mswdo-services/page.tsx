'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MswdoServicesPage() {
  return (
    <>
      <PageHeader
        title="Municipal Social Welfare & Development Office"
        description="Social case studies, indigency certificates, AICS, PWD and senior citizen assistance"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Social Services & Assistance', href: '/services/social-services' },
          { label: 'Municipal Social Welfare & Development Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Social case studies, indigency certificates, AICS, PWD and senior citizen assistance.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> MSWDO</span>
              <span><strong>Fee:</strong> Free</span>
              <span><strong>Processing:</strong> 28 min - 1.5 hrs</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/social-services" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Social Services & Assistance
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
