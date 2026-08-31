'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function PublicSafetyPage() {
  return (
    <>
      <PageHeader
        title="Public Safety Services"
        description="Emergency response and disaster preparedness."
        badge={{ icon: 'bi bi-shield-fill-check', label: 'Public Safety' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Public Safety Services' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <Link href="/service-details/public-safety" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Emergency Response</span>
              </h3>
              <p className="service-item-desc">24/7 emergency assistance and rescue</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> Immediate</span>
              </div>
            </Link>
            <Link href="/service-details/public-safety" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Disaster Preparedness</span>
              </h3>
              <p className="service-item-desc">Training and resources for disaster readiness</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> Varies</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
