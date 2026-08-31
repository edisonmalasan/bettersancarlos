'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalAgriculturePage() {
  return (
    <>
      <PageHeader
        title="Municipal Agriculture Office"
        description="Agricultural assistance, farm registration, and livelihood programs"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Agriculture & Economic Development', href: '/services/agriculture' },
          { label: 'Municipal Agriculture Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Agricultural assistance, farm registration, and livelihood programs.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Agriculture Office</span>
              <span><strong>Fee:</strong> Free/Varies</span>
              <span><strong>Processing:</strong> Varies</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/agriculture" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Agriculture & Economic Development
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
