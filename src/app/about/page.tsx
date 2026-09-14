import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import cityProfile from '@/data/city-profile.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const statCardCls =
  'rounded-xl border border-line bg-white p-5 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function AboutPage() {
  const cp = cityProfile;

  return (
    <>
      <PageHeader
        title="About San Carlos City"
        description="Profile, geography, history, and heritage of the Heart of Pangasinan"
        badge={{ icon: 'bi bi-info-circle-fill', label: 'About the City' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'About' },
        ]}
      />

      {/* Infobox stat cards */}
      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="grid grid-cols-4 gap-5 max-[991px]:grid-cols-2 max-[575px]:grid-cols-1">
            <div className={statCardCls}>
              <span className="block text-[1.75rem] font-bold leading-[1.2] text-primary">
                {cp.population.total.toLocaleString('en-PH')}
              </span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">Population</span>
              <span className="block text-[0.75rem] text-muted-foreground">{cp.population.year} census (PSA)</span>
            </div>
            <div className={statCardCls}>
              <span className="block text-[1.75rem] font-bold leading-[1.2] text-primary">{cp.barangays}</span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">Barangays</span>
              <span className="block text-[0.75rem] text-muted-foreground">30 urban / 56 rural</span>
            </div>
            <div className={statCardCls}>
              <span className="block text-[1.75rem] font-bold leading-[1.2] text-primary">{cp.income_class}</span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">Income Class</span>
              <span className="block text-[0.75rem] text-muted-foreground">{cp.type}</span>
            </div>
            <div className={statCardCls}>
              <span className="block text-[1.75rem] font-bold leading-[1.2] text-primary">{cp.land_area_km2} km²</span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">Land Area</span>
              <span className="block text-[0.75rem] text-muted-foreground">PSA / LGU archived profile</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            <div className={statCardCls}>
              <span className="block text-[1.25rem] font-bold leading-[1.2] text-primary">{cp.postal_code}</span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">ZIP Code</span>
            </div>
            <div className={statCardCls}>
              <span className="block text-[1.25rem] font-bold leading-[1.2] text-primary">{cp.area_code}</span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">Area Code</span>
            </div>
            <div className={statCardCls}>
              <span className="block text-[1.25rem] font-bold leading-[1.2] text-primary">{cp.languages.primary}</span>
              <span className="mt-0.5 block text-[0.875rem] font-medium text-foreground">Primary Language</span>
              <span className="block text-[0.75rem] text-muted-foreground">
                Also {cp.languages.secondary.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Geography / boundaries / distances */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Geography
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">{cp.geography.position}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-4 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-compass"></i> Boundaries
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {cp.geography.boundaries.map((b) => (
                  <li key={b.direction} className="flex items-baseline justify-between gap-3 border-b border-line-soft pb-2 last:border-b-0 last:pb-0">
                    <span className="text-[0.875rem] font-semibold text-foreground">{b.direction}</span>
                    <span className="text-right text-[0.875rem] text-muted-foreground">{b.adjacent}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-4 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-signpost-2"></i> Distances
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {cp.geography.distances.map((d) => (
                  <li key={d.destination} className="flex items-baseline justify-between gap-3 border-b border-line-soft pb-2 last:border-b-0 last:pb-0">
                    <span className="text-[0.875rem] font-semibold text-foreground">
                      {d.destination} {d.note ? <span className="font-normal text-muted-foreground">({d.note})</span> : null}
                    </span>
                    <span className="text-right text-[0.875rem] text-muted-foreground">
                      {d.distance} {d.direction}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mb-0 mt-4 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                <i className="bi bi-geo mr-1"></i>
                Nearest municipalities:{' '}
                {cp.geography.nearest_municipalities.map((m) => `${m.name} (${m.distance} ${m.direction})`).join(', ')}.
              </p>
            </div>
          </div>
          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: Wikipedia, PhilAtlas, and the Province of Pangasinan —{' '}
            research/city-profile/26-09-geography.md
          </p>
        </div>
      </section>

      {/* Seal symbolism */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              The City Seal
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              Official symbolism as described on the old city website (archived 2017)
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {cp.seal.elements.map((el) => (
              <div key={el.name} className={statCardCls + ' text-left'}>
                <h3 className="m-0 mb-2 flex items-start gap-2 text-[0.9375rem] font-semibold text-foreground">
                  <i className="bi bi-patch-check mt-[2px] text-primary"></i>
                  <span>{el.name}</span>
                </h3>
                <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{el.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Vision &amp; Mission
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">From the official city website</p>
          </div>
          <div className="grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-eye"></i> Vision
              </h3>
              <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{cp.vision}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-bullseye"></i> Mission
              </h3>
              <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{cp.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              History
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              From Binalatongan to the City of San Carlos
            </p>
            <p className="mt-3 mb-0">
              <span className={pendingBadgeCls}>
                <i className="bi bi-question-circle"></i> Founding year: sources conflict (1578 vs 1587) — see 1578 footnote below
              </span>
            </p>
          </div>
          <div className="mx-auto max-w-[800px]">
            <div className="relative pl-7 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:rounded-sm before:bg-[linear-gradient(180deg,#3a7d44_0%,rgba(58, 125, 68,0.2)_100%)]">
              {cp.history_timeline.map((item) => (
                <div key={item.year + item.title} className="group relative pb-5 last:pb-0">
                  <div className="absolute -left-7 top-1 z-[1] h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-white transition-transform duration-200 group-hover:scale-125 group-hover:bg-primary group-hover:shadow-[0_0_0_4px_rgba(58, 125, 68,0.15)]"></div>
                  <div className="rounded-lg border border-line bg-white px-[18px] py-4 transition-[border-color,box-shadow,transform] duration-200 group-hover:translate-x-1 group-hover:border-primary group-hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]">
                    <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-[3px] text-xs font-bold text-white">
                      {item.year}
                    </span>
                    <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold text-foreground">{item.title}</h3>
                    <p className="m-0 text-sm leading-[1.6] text-muted-foreground">{item.description}</p>
                    {item.footnote ? (
                      <p className="mb-0 mt-3 inline-flex items-start gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1.5 text-[0.75rem] leading-[1.5] text-[#8a5a00]">
                        <i className="bi bi-question-circle mt-[2px]"></i>
                        <span>{item.footnote}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: research/culture-history/26-09-history.md (LGU history,
            Province of Pangasinan, old official site, Wikipedia)
          </p>
        </div>
      </section>

      {/* Heritage landmarks + Minor Basilica */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Heritage &amp; Landmarks
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Religious and civic heritage of the city</p>
          </div>

          <div className="mb-8 rounded-xl border border-line bg-white p-8 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] max-[575px]:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[0.75rem] font-bold text-white">
                <i className="bi bi-church"></i> Minor Basilica
              </span>
              <span className="rounded-md bg-[rgba(34,197,94,0.1)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#16a34a]">
                Declared by Pope Francis — July 6, 2022
              </span>
            </div>
            <h3 className="m-0 mb-3 text-[1.25rem] font-bold text-foreground">{cp.heritage.basilica.name}</h3>
            <p className="m-0 mb-3 text-[0.9375rem] leading-[1.6] text-muted-foreground">{cp.heritage.basilica.description}</p>
            <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
              <li className="flex gap-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
                <i className="bi bi-dot"></i>
                <span>{cp.heritage.basilica.built_1773}</span>
              </li>
              <li className="flex gap-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
                <i className="bi bi-dot"></i>
                <span>{cp.heritage.basilica.rebuilt_1803}</span>
              </li>
              <li className="flex gap-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
                <i className="bi bi-dot"></i>
                <span>{cp.heritage.basilica.minor_basilica}</span>
              </li>
              <li className="flex gap-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
                <i className="bi bi-dot"></i>
                <span>{cp.heritage.basilica.dominican_presence}</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {cp.heritage.landmarks.map((lm) => (
              <div key={lm.name} className={statCardCls + ' text-left'}>
                <h3 className="m-0 mb-2 flex items-start gap-2 text-[0.9375rem] font-semibold text-foreground">
                  <i className="bi bi-landmark mt-[2px] text-primary"></i>
                  <span>{lm.name}</span>
                </h3>
                <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{lm.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-white p-6">
            <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
              <i className="bi bi-water"></i> Legend of the Sunken Bell
            </h3>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{cp.heritage.legend}</p>
          </div>

          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: research/culture-history/26-09-culture-heritage.md (LGU
            tourism archived 2024-06-03; old official site; Wikipedia; Wikivoyage)
          </p>

          <DirectoryLinkCard
            href="/tourism"
            icon="bi bi-sun"
            title="Tourism"
            description="Attractions, the Mango-Bamboo Festival, food and drink, and places to stay"
          />
          <DirectoryLinkCard
            href="/transportation"
            icon="bi bi-bus-front"
            title="Transportation"
            description="Travel times, entry routes, and bus carriers for getting to the city"
          />
          <DirectoryLinkCard
            href="/quiz"
            icon="bi bi-patch-question"
            title="History Quiz"
            description="Test what you learned — 12 questions on the city's history and heritage"
          />
        </div>
      </section>
    </>
  );
}
