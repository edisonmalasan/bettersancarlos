'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import cityProjects from '@/data/city-projects.json';

const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function InfrastructurePage() {
  return (
    <>
      <PageHeader
        title="Infrastructure Services"
        description="City projects, programs, and public infrastructure in San Carlos."
        badge={{ icon: 'bi bi-buildings-fill', label: 'Infrastructure' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Infrastructure Services' },
        ]}
      />

      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          {/* Program buckets */}
          <div className="mb-6 rounded-xl border border-line bg-white p-5 text-center">
            <span className={pendingBadgeCls}>
              <i className="bi bi-cash-coin"></i> {cityProjects.budgets_status}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-5 max-[1200px]:grid-cols-2 max-[575px]:grid-cols-1">
            {cityProjects.program_buckets.map((b) => (
              <div
                key={b.name}
                className="rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
              >
                <h3 className="m-0 mb-2 flex items-start gap-2 text-[0.875rem] font-bold leading-[1.3] text-foreground">
                  <i className="bi bi-diagram-3 mt-[2px] text-primary"></i>
                  <span>{b.name}</span>
                </h3>
                <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">{b.document_status}</p>
              </div>
            ))}
          </div>

          {/* Known projects + public facilities */}
          <div className="mt-6 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-hammer"></i> Known public projects (reference only)
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {cityProjects.known_projects.map((p) => (
                  <li key={p.name} className="flex flex-wrap items-baseline gap-2 text-[0.875rem] text-foreground">
                    <i className="bi bi-dot text-primary"></i> {p.name}
                    <span className="text-[0.75rem] text-muted-foreground">— {p.evidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-basketball"></i> Public sports facilities
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                <li className="flex flex-wrap items-baseline gap-2 text-[0.875rem] text-foreground">
                  <i className="bi bi-geo-alt text-primary"></i> Don Federico Mandapat Sports Dome
                  <span className="text-[0.75rem] text-muted-foreground">— public sports infrastructure</span>
                </li>
                <li className="flex flex-wrap items-baseline gap-2 text-[0.875rem] text-foreground">
                  <i className="bi bi-geo-alt text-primary"></i> City Gymnasium, Palaris Street
                  <span className="text-[0.75rem] text-muted-foreground">— city facility; designated evacuation convergence area</span>
                </li>
              </ul>
            </div>
          </div>

          {/* /budget link */}
          <Link
            href="/budget"
            className="group mt-6 flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
              <i className="bi bi-cash-stack"></i>
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-base font-semibold text-foreground">Budget &amp; Transparency</span>
              <span className="block text-[0.8125rem] text-muted-foreground">
                Verified FY2009–2016 fiscal series, transparency documents, and the full projects section
              </span>
            </span>
            <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
          </Link>
        </div>
      </section>
    </>
  );
}
