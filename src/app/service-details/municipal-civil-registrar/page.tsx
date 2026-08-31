'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MunicipalCivilRegistrarPage() {
  return (
    <>
      <PageHeader
        title="Municipal Civil Registrar\'s Office"
        description=""
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          
          { label: 'Municipal Civil Registrar\'s Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Service details for Municipal Civil Registrar\'s Office.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Municipal Office</span>
              <span><strong>Fee:</strong> Varies</span>
              <span><strong>Processing:</strong> Varies</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/services" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Services
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
