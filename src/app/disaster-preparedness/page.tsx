import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import evacuationData from '@/data/evacuation-centers.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function DisasterPreparednessPage() {
  const ev = evacuationData;

  return (
    <>
      <PageHeader
        title="Disaster Preparedness"
        description="CDRRMO contacts and evacuation sites in San Carlos City"
        badge={{ icon: 'bi bi-shield-fill-check', label: 'Disaster Preparedness' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Disaster Preparedness' },
        ]}
      />

      {/* CDRRMO card */}
      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="mx-auto max-w-[640px] overflow-hidden rounded-xl border border-line bg-white">
            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]">
              <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">
                Emergency Management
              </span>
              <h3 className="m-0 text-[1.125rem] font-semibold text-white">{ev.cdrrmo.name}</h3>
              <p className="m-0 mt-1 text-[0.8125rem] text-white/80">{ev.cdrrmo.location}</p>
            </div>
            <div className="flex flex-col gap-2 px-8 py-6">
              <p className="m-0 text-[0.875rem] text-foreground">
                <span className="font-semibold">City DRRM Officer:</span> {ev.cdrrmo.officer}{' '}
                <span className="text-[0.75rem] text-muted-foreground">({ev.cdrrmo.officer_status})</span>
              </p>
              <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                <i className="bi bi-telephone text-primary"></i> {ev.cdrrmo.phone}
                <span className={pendingBadgeCls}>
                  <i className="bi bi-archive"></i> {ev.cdrrmo.phone_status}
                </span>
              </p>
              <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                <i className="bi bi-file-text mr-1"></i>
                {ev.cdrrmo.plan_note}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-white p-5 text-center">
            <span className={pendingBadgeCls}>
              <i className="bi bi-archive"></i> Evacuation sites are 2017 planning data — re-verify with the CDRRMO before
              relying on them
            </span>
          </div>
        </div>
      </section>

      {/* Convergence areas */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Evacuation Convergence Areas
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              Designated muster points in the official city evacuation plan (2017)
            </p>
          </div>
          <div className="mx-auto grid max-w-[860px] grid-cols-1 gap-4">
            {ev.convergence_areas.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-4 rounded-xl border border-line bg-white px-6 py-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 text-[0.9375rem] font-bold text-foreground">{c.name}</h3>
                  <span className="text-[0.8125rem] text-muted-foreground">{c.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-rise shelters */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              High-Rise Shelter Buildings
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              {ev.high_rise_shelters.length} structures designated for sheltering (2017 plan)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[991px]:grid-cols-1">
            {ev.high_rise_shelters.map((s) => (
              <div key={s.name} className="flex items-center gap-4 rounded-xl border border-line bg-white px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <i className="bi bi-building"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 text-[0.875rem] font-bold leading-[1.3] text-foreground">{s.name}</h3>
                  <span className="text-[0.8125rem] text-muted-foreground">{s.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hazard context */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Hazard Context
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">What the city prepares for</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {ev.hazards.map((h) => (
              <div key={h.name} className="rounded-xl border border-line bg-white p-6">
                <h3 className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                  <i className="bi bi-exclamation-triangle text-primary"></i> {h.name}
                </h3>
                <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{h.note}</p>
              </div>
            ))}
          </div>

          {/* Hotline cross-link */}
          <DirectoryLinkCard
            href="/contact"
            icon="bi bi-telephone-fill"
            title="Emergency Hotlines"
            description="National and city emergency numbers with verification status — on the Contact page"
          />
          <DirectoryLinkCard
            href="/services/public-safety"
            icon="bi bi-shield-check"
            title="Public Safety Services"
            description="Police, fire, and public-safety services directory"
          />

          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: research/disaster-risk/26-09-disaster-preparedness.md
            (official LGU pages, archived 2017/2024)
          </p>
        </div>
      </section>
    </>
  );
}
