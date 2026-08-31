'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalPlanningPage() {
  return (
    <>
      <PageHeader
        title="Municipal Planning and Development Office"
        description="Zoning clearance, locational clearance, and development planning services"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Infrastructure & Public Works', href: '/services/infrastructure' },
          { label: 'Municipal Planning and Development Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Zoning, land use, development permits, and planning services.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Planning Office</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> 3-7 days</span>
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
