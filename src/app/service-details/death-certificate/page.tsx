'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function DeathCertificatePage() {
  return (
    <>
      <PageHeader
        title="Registration of Death Certificate"
        description="Register death certificate and obtain burial or transfer permit"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Certificates & Vital Records', href: '/services/certificates' },
          { label: 'Registration of Death Certificate' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Register death certificate and obtain burial or transfer permit.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> Local Civil Registrar</span>
              <span><strong>Fee:</strong> ₱50-150</span>
              <span><strong>Processing:</strong> 1 hour 35 minutes</span>
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
