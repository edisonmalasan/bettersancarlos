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
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <Link href="/services/agriculture" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-tree-fill text-primary"></i>
                <span>Agriculture & Economic Development</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Support for farmers and agricultural development.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/business" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-shop text-primary"></i>
                <span>Business, Trade & Investment</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Permits, licenses, and support for businesses in San Carlos.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/certificates" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-file-earmark-text-fill text-primary"></i>
                <span>Certificates & Vital Records</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Official documents for birth, death, marriage, and other vital records.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/education" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-mortarboard-fill text-primary"></i>
                <span>Education & Scholarship</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Scholarship programs and educational assistance.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/environment" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-globe-americas text-primary"></i>
                <span>Environment & Natural Resources</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Waste management and environmental protection.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/infrastructure" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-building-fill-gear text-primary"></i>
                <span>Infrastructure & Public Works</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Building permits, construction, and engineering services.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/public-safety" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-shield-fill-check text-primary"></i>
                <span>Public Safety & Security</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Emergency response and disaster preparedness.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/social-services" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-people-fill text-primary"></i>
                <span>Social Services & Assistance</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Support programs for vulnerable sectors and communities.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            
            <Link href="/services/tax-payments" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-cash-coin text-primary"></i>
                <span>Taxation & Payments</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Property tax, fees, and payment services.</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
