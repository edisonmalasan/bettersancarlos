'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function SeedoSlaughterhousePage() {
  return (
    <>
      <PageHeader
        title="Economic Enterprise & Development Office"
        description="Hog, cattle, goat, and carabao slaughter with meat inspection services"
        badge={{ icon: 'bi bi-info-circle', label: 'Service' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business, Trade & Investment', href: '/services/business' },
          { label: 'Economic Enterprise & Development Office' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">Hog, cattle, goat, and carabao slaughter with meat inspection services.</p>
            
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> SEEDO Slaughterhouse</span>
              <span><strong>Fee:</strong> ₱40-350</span>
              <span><strong>Processing:</strong> 37 min - 1.5 hrs</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/business" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to Business, Trade & Investment
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
