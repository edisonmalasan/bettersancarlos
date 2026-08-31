'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function ServicesDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Municipal Services Directory"
        description="Browse all services offered by the City of San Carlos."
        badge={{ icon: 'bi bi-grid-fill', label: 'Services' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <Link href="/services/agriculture" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-tree-fill"></i>
                <span>Agriculture & Economic Development</span>
              </h3>
              <p className="service-item-desc">Support for farmers and agricultural development.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/business" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-shop"></i>
                <span>Business, Trade & Investment</span>
              </h3>
              <p className="service-item-desc">Permits, licenses, and support for businesses in San Carlos.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/certificates" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-file-earmark-text-fill"></i>
                <span>Certificates & Vital Records</span>
              </h3>
              <p className="service-item-desc">Official documents for birth, death, marriage, and other vital records.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/education" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-mortarboard-fill"></i>
                <span>Education & Scholarship</span>
              </h3>
              <p className="service-item-desc">Scholarship programs and educational assistance.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/environment" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-globe-americas"></i>
                <span>Environment & Natural Resources</span>
              </h3>
              <p className="service-item-desc">Waste management and environmental protection.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/infrastructure" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-building-fill-gear"></i>
                <span>Infrastructure & Public Works</span>
              </h3>
              <p className="service-item-desc">Building permits, construction, and engineering services.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/public-safety" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-shield-fill-check"></i>
                <span>Public Safety & Security</span>
              </h3>
              <p className="service-item-desc">Emergency response and disaster preparedness.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/social-services" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-people-fill"></i>
                <span>Social Services & Assistance</span>
              </h3>
              <p className="service-item-desc">Support programs for vulnerable sectors and communities.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/tax-payments" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="bi bi-cash-coin"></i>
                <span>Taxation & Payments</span>
              </h3>
              <p className="service-item-desc">Property tax, fees, and payment services.</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
