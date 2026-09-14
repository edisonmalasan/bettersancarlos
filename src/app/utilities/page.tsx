import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import utilitiesData from '@/data/utilities.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function UtilitiesPage() {
  const ut = utilitiesData;

  return (
    <>
      <PageHeader
        title="Utilities"
        description="Power, water, and telecom services in San Carlos City"
        badge={{ icon: 'bi bi-lightning-charge-fill', label: 'Utilities' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Utilities' },
        ]}
      />

      {/* CENPELCO (verified) */}
      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Electricity
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">The city&apos;s power distribution cooperative</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="px-8 py-6 text-center bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)]">
              <span className="mb-2 inline-block rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-white">
                Distribution Utility
              </span>
              <h3 className="m-0 text-[1.25rem] font-semibold text-white">{ut.electricity.provider}</h3>
            </div>
            <div className="grid grid-cols-2 gap-6 px-8 py-6 max-[991px]:grid-cols-1">
              <div>
                <h4 className="m-0 mb-2 text-[0.9375rem] font-semibold text-foreground">Why this is verified</h4>
                <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                  {ut.electricity.evidence.map((e) => (
                    <li key={e} className="flex gap-2 text-[0.875rem] leading-[1.5] text-muted-foreground">
                      <i className="bi bi-patch-check text-primary"></i>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
                <p className="mb-0 mt-3 text-[0.875rem] text-foreground">
                  <i className="bi bi-globe mr-1 text-primary"></i>
                  <a
                    href={ut.electricity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    cenpelco.com
                  </a>{' '}
                  — rate archives, online bill inquiry, and advisories
                </p>
              </div>
              <div>
                <h4 className="m-0 mb-2 text-[0.9375rem] font-semibold text-foreground">
                  Area offices ({ut.electricity.branches.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ut.electricity.branches.map((b) => (
                    <span
                      key={b}
                      className={
                        b.includes('San Carlos')
                          ? 'rounded-full bg-primary px-3 py-1 text-[0.75rem] font-semibold text-white'
                          : 'rounded-full bg-muted px-3 py-1 text-[0.75rem] font-medium text-foreground'
                      }
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-line bg-[#fafbfc] px-8 py-5 max-[575px]:px-5">
              <p className="m-0 flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted-foreground">
                <i className="bi bi-telephone-x text-[#8a5a00]"></i>
                {ut.electricity.contact_gaps}
              </p>
              <p className="m-0 flex flex-wrap items-start gap-1.5 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                <i className="bi bi-file-earmark-text text-primary mt-[2px]"></i>
                <span>{ut.electricity.magna_carta_note}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Water (unverified) */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Water
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Provider identity not yet confirmed</p>
          </div>
          <div className="mx-auto max-w-[760px] rounded-xl border border-line bg-white p-6">
            <div className="mb-3 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-[1.25rem] text-muted-foreground">
                <i className="bi bi-droplet"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-2 text-[1.0625rem] font-bold text-foreground">Water service provider — unverified</h3>
                <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{ut.water.note}</p>
              </div>
            </div>
            <span className={pendingBadgeCls}>
              <i className="bi bi-hourglass-split"></i> Pending LWUA / city confirmation — no contact published
            </span>
          </div>
        </div>
      </section>

      {/* Telecom + other utilities */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Telecom &amp; Other Services
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Not yet researched — no data invented</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                <i className="bi bi-wifi text-muted-foreground"></i> Telecom &amp; Internet
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">{ut.telecom.note}</p>
              <span className={pendingBadgeCls}>
                <i className="bi bi-search"></i> {ut.telecom.status}
              </span>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                <i className="bi bi-tv text-muted-foreground"></i> Cable / Pay TV
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">Providers have not been researched.</p>
              <span className={pendingBadgeCls}>
                <i className="bi bi-search"></i> {ut.cable_tv.status}
              </span>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                <i className="bi bi-recycle text-muted-foreground"></i> Sewage / Wastewater
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">{ut.sewage.note}</p>
              <span className={pendingBadgeCls}>
                <i className="bi bi-search"></i> {ut.sewage.status}
              </span>
            </div>
          </div>
          <DirectoryLinkCard
            href="/contact"
            icon="bi bi-telephone"
            title="Contact & Emergency Channels"
            description="Verified city phone, email, and emergency hotlines"
          />

          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: research/utilities/26-09-public-utilities.md and{' '}
            research/utilities/26-09-cenpelco-contacts.md
          </p>
        </div>
      </section>
    </>
  );
}
