import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';
import tourismData from '@/data/tourism.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';
const sourceBadgeCls = (source: string) =>
  source === 'official-lgu'
    ? 'shrink-0 rounded-full bg-[rgba(58, 125, 68,0.1)] px-2.5 py-[3px] text-[0.6875rem] font-semibold text-primary'
    : 'shrink-0 rounded-full bg-[rgba(0,119,190,0.08)] px-2.5 py-[3px] text-[0.6875rem] font-semibold text-info';

export default function TourismPage() {
  const td = tourismData;

  return (
    <>
      <PageHeader
        title="Tourism"
        description="Discover San Carlos City — attractions, festivals, food, and stays"
        badge={{ icon: 'bi bi-sun-fill', label: 'Tourism' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Tourism' },
        ]}
      />

      {/* Attractions grid */}
      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Attractions
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              Heritage sites, nature, and resorts — each tagged by its data source
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {td.attractions.map((a) => (
              <div
                key={a.name}
                className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="m-0 text-[0.9375rem] font-bold leading-[1.3] text-foreground">{a.name}</h3>
                  <span className={sourceBadgeCls(a.source)}>
                    {a.source === 'official-lgu' ? 'Official LGU' : 'Community'}
                  </span>
                </div>
                <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{a.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> &quot;Official LGU&quot; = named on the official city tourism page
            (archived 2017/2024). &quot;Community&quot; = Wikivoyage listings; verify details before visiting.
          </p>
        </div>
      </section>

      {/* Mango-Bamboo Festival */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
              <i className="bi bi-balloon-fill"></i> Signature Festival
            </span>
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              {td.festival.name}
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              Launched {td.festival.launched} · {td.festival.schedule}
            </p>
          </div>
          <div className="grid grid-cols-[1fr_340px] items-start gap-8 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-3 text-[1rem] font-semibold text-foreground">Typical programming</h3>
              <ul className="m-0 flex list-none flex-col gap-2 pl-0" role="list">
                {td.festival.activities.map((act) => (
                  <li key={act} className="flex gap-2 text-[0.9375rem] leading-[1.5] text-muted-foreground">
                    <i className="bi bi-check2 text-primary"></i>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-0 mt-4 text-[0.75rem] text-muted-foreground">{td.festival.activities_status}</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-line bg-white p-5">
                <h4 className="m-0 mb-2 text-[0.9375rem] font-semibold text-foreground">Why it matters</h4>
                <p className="m-0 text-[0.875rem] leading-[1.5] text-muted-foreground">{td.festival.purpose}</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-5">
                <span className={pendingBadgeCls}>
                  <i className="bi bi-calendar-x"></i> {td.festival.dates_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giant mango pie record */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mx-auto max-w-[760px] rounded-xl border border-line bg-white p-8 text-center max-[575px]:p-5">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(232,153,10,0.12)] px-3 py-1.5 text-[0.8125rem] font-bold text-[#8a5a00]">
              <i className="bi bi-trophy-fill"></i> City Record
            </span>
            <h2 className="m-0 mb-3 text-[1.5rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.25rem]">
              {td.mango_pie_record.title}
            </h2>
            <p className="m-0 mb-5 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              {td.mango_pie_record.made_by} baked a {td.mango_pie_record.size_m2} m² pie ({td.mango_pie_record.thickness}
              {' '}thick) using {td.mango_pie_record.mangoes_kg.toLocaleString('en-PH')} kg of mangoes — at a total cost of
              about ₱{td.mango_pie_record.cost_php.toLocaleString('en-PH')} — at the {td.mango_pie_record.venue}.
            </p>
            <div className="grid grid-cols-3 gap-4 max-[575px]:grid-cols-1">
              <div className="rounded-lg bg-muted px-4 py-3">
                <span className="block text-[1.25rem] font-bold text-primary">{td.mango_pie_record.date}</span>
                <span className="block text-[0.75rem] text-muted-foreground">Date</span>
              </div>
              <div className="rounded-lg bg-muted px-4 py-3">
                <span className="block text-[1.25rem] font-bold text-primary">{td.mango_pie_record.size_m2} m²</span>
                <span className="block text-[0.75rem] text-muted-foreground">Size</span>
              </div>
              <div className="rounded-lg bg-muted px-4 py-3">
                <span className="block text-[1.25rem] font-bold text-primary">
                  {td.mango_pie_record.mangoes_kg.toLocaleString('en-PH')} kg
                </span>
                <span className="block text-[0.75rem] text-muted-foreground">Mangoes used</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food & drink + shopping */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Food &amp; Drink
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Local eateries and cafes (community-sourced listings)</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[991px]:grid-cols-1">
            {td.food_drink.map((f) => (
              <div key={f.name} className="rounded-xl border border-line bg-white px-5 py-4">
                <h3 className="m-0 mb-1 text-[0.875rem] font-semibold text-foreground">{f.name}</h3>
                <p className="m-0 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
                  <i className="bi bi-geo-alt text-primary"></i> {f.location}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 mb-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> {td.food_drink_status}. Shopping: malls and supermarkets downtown
            (&quot;Las Bellas Carlenians&quot;).
          </p>

          <DirectoryLinkCard
            href="/about"
            icon="bi bi-info-circle"
            title="About San Carlos City"
            description="City profile, history timeline, heritage landmarks, and the Minor Basilica"
          />
        </div>
      </section>
    </>
  );
}
