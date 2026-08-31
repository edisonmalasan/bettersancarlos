'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MarriageCertificatePage() {
  return (
    <>
      <PageHeader
        title="Marriage Certificate (Local Registration)"
        description="Register or request certified true copy of marriage certificate"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Certificates & Vital Records', href: '/services/certificates' },
          { label: 'Marriage Certificate (Local Registration)' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Register or request certified true copy of marriage certificate.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Local Civil Registrar</span>
              <span><strong>Fee:</strong> Free (Registration)</span>
              <span><strong>Processing:</strong> 5 minutes</span>
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
