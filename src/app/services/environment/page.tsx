'use client';

import PageHeader from '@/components/layout/PageHeader';

const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function EnvironmentPage() {
  return (
    <>
      <PageHeader
        title="Environment Services"
        description="Environmental programs and natural-resource context for San Carlos."
        badge={{ icon: 'bi bi-globe2', label: 'Environment' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Environment Services' },
        ]}
      />

      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          {/* Verified 2023 programs */}
          <div className="mb-8 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-[1.125rem] text-primary">
                <i className="bi bi-recycle"></i>
              </div>
              <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.4] text-foreground">
                Plastic-use regulation
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">
                The city&apos;s environment office engaged on regulated plastic-use implementation in 2023, monitoring
                single-use plastics.
              </p>
              <span className="text-[0.75rem] text-muted-foreground">Old official site news, archived 2023</span>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-[1.125rem] text-primary">
                <i className="bi bi-tree"></i>
              </div>
              <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.4] text-foreground">
                BFP tree planting
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">
                The city fire station partnered on native tree-planting activities, documented in 2023.
              </p>
              <span className="text-[0.75rem] text-muted-foreground">Old official site news, archived 2023</span>
            </div>
            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-[1.125rem] text-primary">
                <i className="bi bi-panda"></i>
              </div>
              <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.4] text-foreground">
                World Wildlife Day
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">
                The city observed World Wildlife Day in 2023 as part of its environmental programming.
              </p>
              <span className="text-[0.75rem] text-muted-foreground">Old official site news, archived 2023</span>
            </div>
          </div>

          {/* Landlocked / rivers context */}
          <div className="mb-8 rounded-xl border border-line bg-white p-6 sm:p-8">
            <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
              <i className="bi bi-water"></i> Waterways &amp; geography
            </h3>
            <p className="m-0 mb-2 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              San Carlos City is <strong className="text-foreground">landlocked</strong> — it has no marine coastline, so
              coastal programs do not apply. The city sits on the <strong className="text-foreground">Agno River</strong>{' '}
              system, and the <strong className="text-foreground">San Juan River</strong> flows through the Poblacion area;
              inland water management is the relevant environmental focus.
            </p>
            <p className="m-0 text-[0.8125rem] text-muted-foreground">
              <i className="bi bi-info-circle mr-1"></i> Source: research/environment/26-09-environmental-programs.md and
              the city geography profile.
            </p>
          </div>

          {/* Waste schedule gap */}
          <div className="rounded-xl border border-line bg-white p-6 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
              <i className="bi bi-hourglass-split"></i> Waste-collection schedules pending verification
            </span>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              Waste-management service details (collection days, fees, materials-recovery facility) were not found in
              official sources during research; they are expected from the City General Services Office. Sanitation
              functions historically sit with the General Services Office — its 2017-archived number is listed on the{' '}
              contact page directory.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
