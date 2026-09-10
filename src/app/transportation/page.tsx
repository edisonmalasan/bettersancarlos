import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import transportationData from '@/data/transportation.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function TransportationPage() {
  const tp = transportationData;

  return (
    <>
      <PageHeader
        title="Transportation"
        description="Getting to and around San Carlos City, Pangasinan"
        badge={{ icon: 'bi bi-bus-front-fill', label: 'Transportation' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Transportation' },
        ]}
      />

      {/* Getting here */}
      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Getting Here
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Travel times to San Carlos City</p>
            <p className="mt-3 mb-0">
              <span className={pendingBadgeCls}>
                <i className="bi bi-archive"></i> Historical data — from the official city website (2017 archive)
              </span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {tp.getting_here.travel_times.map((t) => (
              <div key={t.from} className="rounded-xl border border-line bg-white p-6 text-center">
                <span className="mb-1 block text-[0.8125rem] font-medium text-muted-foreground">From {t.from}</span>
                <span className="block text-[1.5rem] font-bold text-primary">{t.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-signpost-2"></i> Entry routes from Manila
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {tp.getting_here.entry_routes_from_manila.map((r) => (
                  <li key={r} className="flex gap-2 text-[0.9375rem] leading-[1.5] text-muted-foreground">
                    <i className="bi bi-arrow-right text-primary"></i>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-signpost-split"></i> Entry routes from Baguio City
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {tp.getting_here.entry_routes_from_baguio.map((r) => (
                  <li key={r} className="flex gap-2 text-[0.9375rem] leading-[1.5] text-muted-foreground">
                    <i className="bi bi-arrow-right text-primary"></i>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-0 mt-4 text-[0.8125rem] text-muted-foreground">
                <i className="bi bi-geo mr-1"></i> {tp.provincial_capital.distance} to {tp.provincial_capital.destination}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bus carriers */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Bus Carriers
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">National carriers serving the city</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {tp.carriers.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-line bg-white p-6 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary">
                  <i className="bi bi-bus-front"></i>
                </div>
                <h3 className="m-0 mb-1 text-[0.9375rem] font-bold leading-[1.3] text-foreground">{c.name}</h3>
                <span className={pendingBadgeCls}>
                  <i className="bi bi-archive"></i> {c.status} — schedules unverified
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intra-city + rail history */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-truck"></i> Getting Around the City
              </h3>
              <p className="m-0 mb-3 text-[0.9375rem] leading-[1.6] text-muted-foreground">{tp.intra_city.modes}</p>
              <span className={pendingBadgeCls}>
                <i className="bi bi-hourglass-split"></i> Fares &amp; routes pending verification
              </span>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-train-front"></i> Rail History
              </h3>
              <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{tp.rail_history.note}</p>
            </div>
          </div>
          <DirectoryLinkCard
            href="/about"
            icon="bi bi-geo-alt"
            title="About San Carlos City"
            description="Geography, boundaries, and distances to nearby cities"
          />

          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: research/transportation/26-09-public-transport.md (old
            official site archived 2017; Province of Pangasinan)
          </p>
        </div>
      </section>
    </>
  );
}
