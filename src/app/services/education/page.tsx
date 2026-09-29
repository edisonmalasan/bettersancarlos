'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { containerClass, sectionClass } from '@/components/layout/Container';


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
      <section className={sectionClass}>
        <div className={containerClass}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <Link href="/service-details/mswdo-services" className="rounded-xl border border-line bg-white p-6 text-inherit no-underline duration-200 hover:border-primary hover:no-underline transition-colors">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-file-earmark-text text-primary"></i>
                <span>Student Assistance</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">Educational grants and allowances</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1"><strong className="text-foreground">Office:</strong> MSWDO</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Fee:</strong> Free</span>
                <span className="flex items-center gap-1"><strong className="text-foreground">Time:</strong> Varies</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* City education directory cross-link */}
      <section className={sectionClass} aria-label="City education directory">
        <div className={containerClass}>
          <Link
            href="/education"
            className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline duration-200 hover:border-primary hover:no-underline transition-colors"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
              <i className="bi bi-mortarboard"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="m-0 mb-1 text-base text-foreground">Schools &amp; Education Directory</h3>
              <p className="m-0 text-[0.8125rem] text-muted-foreground">
                Colleges, high schools, and elementary schools in San Carlos City, Pangasinan
              </p>
            </div>
            <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
          </Link>
        </div>
      </section>
    </>
  );
}
