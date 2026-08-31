'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';


export default function SocialServicesPage() {
  return (
    <>
      <PageHeader
        title="Social Services"
        description="Support programs for vulnerable sectors and communities."
        badge={{ icon: 'bi bi-people-fill', label: 'Social Services' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Social Services' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <Link href="/service-details/social-services" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Senior Citizen ID</span>
              </h3>
              <p className="service-item-desc">ID card and benefits for citizens 60 years and above</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> 1-2 weeks</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>PWD ID & Services</span>
              </h3>
              <p className="service-item-desc">ID and benefits for persons with disabilities</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> 1-2 weeks</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Financial Assistance</span>
              </h3>
              <p className="service-item-desc">Emergency financial aid for qualified residents</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> Varies</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Burial Assistance</span>
              </h3>
              <p className="service-item-desc">Financial assistance for burial expenses</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> 1-3 days</span>
              </div>
            </Link>
            <Link href="/service-details/social-services" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Solo Parent ID</span>
              </h3>
              <p className="service-item-desc">ID and benefits for solo parents</p>
              <div className="service-item-meta">
                <span><strong>Fee:</strong> Free</span>
                <span><strong>Time:</strong> 1-2 weeks</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
