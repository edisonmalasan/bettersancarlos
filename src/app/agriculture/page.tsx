import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import agricultureData from '@/data/agriculture.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function AgriculturePage() {
  const ag = agricultureData;

  return (
    <>
      <PageHeader
        title="Agriculture"
        description="The mango and bamboo economy of San Carlos City"
        badge={{ icon: 'bi bi-tree-fill', label: 'Agriculture' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Agriculture' },
        ]}
      />

      {/* Identity + mango stat */}
      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="grid grid-cols-[1.2fr_1fr] items-stretch gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-8">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
                <i className="bi bi-award"></i> {ag.identity.title}
              </span>
              <p className="m-0 text-[1rem] leading-[1.7] text-muted-foreground">{ag.identity.description}</p>
            </div>
            <div className="rounded-xl border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] p-8 text-white">
              <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-white">
                <i className="bi bi-tree-fill text-[1rem]"></i>
                <span>Fruit-bearing mango trees</span>
              </div>
              <div className="mb-1 text-[2.25rem] font-bold leading-[1.1] text-white">
                {ag.mango.trees_stat.toLocaleString('en-PH')}+
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.8125rem] text-white">{ag.mango.trees_stat_year} LGU report</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(255,255,255,0.15)] px-2 py-[3px] text-[0.6875rem] font-semibold text-white">
                  <i className="bi bi-hourglass-split"></i> dated — re-verify
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mango + bamboo products */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-4 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-droplet-half"></i> Mango Industry
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {ag.mango.products.map((p) => (
                  <li key={p} className="flex gap-2 text-[0.9375rem] leading-[1.5] text-muted-foreground">
                    <i className="bi bi-dot"></i>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-4 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-basket"></i> Bamboo Industry
              </h3>
              <div className="mb-3 flex flex-wrap gap-2">
                {ag.bamboo.products.map((p) => (
                  <span key={p} className="rounded-full bg-[rgba(58, 125, 68,0.08)] px-3 py-1 text-[0.8125rem] font-medium text-primary">
                    {p}
                  </span>
                ))}
              </div>
              <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{ag.bamboo.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Other agricultural activities */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Other Agricultural Activities
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Beyond mango and bamboo</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {ag.other_activities.map((a) => (
              <div
                key={a.name}
                className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
              >
                <h3 className="m-0 mb-2 flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                  <i className="bi bi-flower1 text-primary"></i> {a.name}
                </h3>
                {a.note ? <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{a.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Agriculture Offices
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">City offices serving farmers and producers</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {ag.offices.map((o) => (
              <div key={o.name} className="rounded-xl border border-line bg-white p-6">
                <h3 className="m-0 mb-2 flex items-start gap-2 text-[0.9375rem] font-bold leading-[1.3] text-foreground">
                  <i className="bi bi-building mt-[2px] text-primary"></i>
                  <span>{o.name}</span>
                </h3>
                {o.head ? <p className="m-0 mb-2 text-[0.8125rem] text-muted-foreground">{o.head}</p> : null}
                {o.phone ? (
                  <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                    <i className="bi bi-telephone text-primary"></i> {o.phone}
                    <span className={pendingBadgeCls}>
                      <i className="bi bi-archive"></i> {o.phone_status}
                    </span>
                  </p>
                ) : null}
                {o.note ? <p className="m-0 mt-2 text-[0.8125rem] text-muted-foreground">{o.note}</p> : null}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-white p-6">
            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
              <i className="bi bi-hourglass-split"></i> Production volumes pending verification
            </h3>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{ag.gap_note}</p>
            <p className="mb-0 mt-3 text-[0.8125rem] text-muted-foreground">
              <i className="bi bi-info-circle mr-1"></i> Source: research/agriculture/26-09-agriculture.md (LGU/provincial
              sources)
            </p>
          </div>

          <DirectoryLinkCard
            href="/services/agriculture"
            icon="bi bi-flower3"
            title="Agriculture Services"
            description="Seedling distribution, equipment support, and livelihood programs"
          />
        </div>
      </section>
    </>
  );
}
