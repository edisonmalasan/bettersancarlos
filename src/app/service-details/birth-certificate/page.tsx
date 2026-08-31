'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function BirthCertificatePage() {
  return (
    <>
      <PageHeader
        title="Birth Certificate (Local Copy)"
        description="Official certified copy of birth certificate registered in San Carlos"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Certificates & Vital Records', href: '/services/certificates' },
          { label: 'Birth Certificate (Local Copy)' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Get a certified copy of birth certificate registered in San Carlos.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Local Civil Registrar</span>
              <span><strong>Fee:</strong> ₱150</span>
              <span><strong>Processing:</strong> 15-30 minutes</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/certificates" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Certificates & Vital Records
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
