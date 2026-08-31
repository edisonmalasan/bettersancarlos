'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function MswdoPage() {
  return (
    <>
      <PageHeader
        title="Municipal Social Welfare and Development Office"
        description="Comprehensive social welfare programs and services for vulnerable sectors"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          
          { label: 'Municipal Social Welfare and Development Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Comprehensive social welfare programs and services for vulnerable sectors.</p>
            
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
