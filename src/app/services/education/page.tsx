'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function EducationPage() {
  return (
    <>
      <PageHeader
        title="Education Services"
        description="Scholarship programs and educational assistance."
        badge={{ icon: 'bi bi-mortarboard-fill', label: 'Education' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Education Services' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <Link href="/service-details/education" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Student Assistance</span>
              </h3>
              <p className="service-item-desc">Educational grants and allowances</p>
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
