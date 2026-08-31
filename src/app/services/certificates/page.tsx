'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function CertificatesPage() {
  return (
    <>
      <PageHeader
        title="Certificates & Vital Records"
        description="Official documents for birth, death, marriage, and other vital records."
        badge={{ icon: 'bi bi-file-earmark-text-fill', label: 'Certificates' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Certificates & Vital Records' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <Link href="/service-details/certificates" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Barangay Clearance</span>
              </h3>
              <p className="service-item-desc">Certificate of residence from your barangay</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> ₱50-100</span>
                <span><strong>Time:</strong> Same day</span>
              </div>
            </Link>
            <Link href="/service-details/certificates" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Barangay ID</span>
              </h3>
              <p className="service-item-desc">Official barangay identification card</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> 1-2 days</span>
              </div>
            </Link>
            <Link href="/service-details/certificates" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Police Clearance</span>
              </h3>
              <p className="service-item-desc">Police clearance coordination through municipal office</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Varies</span>
                <span><strong>Time:</strong> 3-5 days</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
