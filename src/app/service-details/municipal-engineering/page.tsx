'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalEngineeringPage() {
  return (
    <>
      <PageHeader
        title="Municipal Engineering Office"
        description="Building permits, infrastructure projects, and engineering services"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Infrastructure & Public Works', href: '/services/infrastructure' },
          { label: 'Municipal Engineering Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Building permits, infrastructure projects, and engineering services.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Engineering Office</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> 5-10 days</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/infrastructure" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Infrastructure & Public Works
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
