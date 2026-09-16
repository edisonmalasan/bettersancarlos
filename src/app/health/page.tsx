import PageHeader from '@/components/layout/PageHeader';
import healthFacilities from '@/data/health-facilities.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function HealthPage() {
  const hf = healthFacilities;

  return (
    <>
      <PageHeader
        title="Health Facilities"
        description="Hospitals and health offices serving San Carlos City"
        badge={{ icon: 'bi bi-heart-pulse-fill', label: 'Health' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Health' },
        ]}
      />

      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="rounded-xl border border-line bg-white p-5">
            <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
              <span className={pendingBadgeCls}>
                <i className="bi bi-hourglass-split"></i> Verification pending
              </span>
              <span>
                Facility accreditation details below are PhilHealth CY2026 data (level, accredited beds, accreditation
                expiry, address). DOH license numbers and contact details are not yet verified and are deliberately
                not shown. For medical emergencies, call 911 or the City Hall trunk line (075) 600-1432.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* City Health Office */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              City Health Office
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">The city government&apos;s primary health office</p>
          </div>
          <div className="mx-auto max-w-[640px] rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary">
                <i className="bi bi-hospital"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1.5 text-[1.125rem] font-bold text-foreground">{hf.city_health_office.name}</h3>
                <p className="m-0 mb-2 text-[0.875rem] text-muted-foreground">
                  City Hall Building, Palaris Street, San Carlos City, Pangasinan
                </p>
                <p className="m-0 mb-2 flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                  <i className="bi bi-telephone text-primary"></i>
                  {hf.city_health_office.phone}
                  <span className={pendingBadgeCls}>
                    <i className="bi bi-archive"></i> {hf.city_health_office.phone_status}
                  </span>
                </p>
                <p className="m-0 text-[0.8125rem] text-muted-foreground">
                  {hf.city_health_office.officers_source}:{' '}
                  {hf.city_health_office.officers.map((o) => `${o.name} — ${o.role}`).join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospitals (PhilHealth-accredited, DOH license pending) */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Hospitals
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              PhilHealth-accredited facilities (CY2026); DOH licensure pending verification
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5 max-[991px]:grid-cols-1">
            {hf.facilities.map((f) => (
              <div
                key={f.name}
                className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
              >
                <div className="mb-3 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary">
                    <i className="bi bi-hospital"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 mb-1 text-[1.0625rem] font-bold leading-[1.3] text-foreground">{f.name}</h3>
                    <p className="m-0 text-[0.875rem] text-muted-foreground">{f.type}</p>
                    <p className="m-0 mt-1 text-[0.8125rem] text-muted-foreground">{f.address}</p>
                    <p className="m-0 mt-1 text-[0.8125rem] text-foreground">
                      <i className="bi bi-patch-check text-primary"></i> PhilHealth accreditation: {f.accreditation.level},{' '}
                      {f.accreditation.accredited_beds} beds, expiry {f.accreditation.accreditation_expiry}
                    </p>
                  </div>
                </div>
                <span className={pendingBadgeCls}>
                  <i className="bi bi-hourglass-split"></i> PhilHealth-accredited — DOH license pending
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-white p-6">
            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
              <i className="bi bi-info-circle"></i> About the missing DOH data
            </h3>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{hf.gap_note}</p>
            <p className="mb-0 mt-3 text-[0.8125rem] text-muted-foreground">
              <i className="bi bi-info-circle mr-1"></i> Source: research/health/26-09-health-facilities.md and{' '}
              research/health/26-09-doh-facilities.md
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
