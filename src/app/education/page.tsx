import PageHeader from '@/components/layout/PageHeader';
import schoolsData from '@/data/schools.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function EducationPage() {
  const sc = schoolsData;
  const publicCount = sc.elementary.public.length;
  const privateCount = sc.elementary.private.length;

  return (
    <>
      <PageHeader
        title="Education"
        description="Schools, colleges, and learning institutions in San Carlos City"
        badge={{ icon: 'bi bi-mortarboard-fill', label: 'Education' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Education' },
        ]}
      />

      <section className="relative z-[2] mt-10 pb-[40px]">
        <div className={containerCls}>
          <div className="rounded-xl border border-line bg-white p-5">
            <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] leading-[1.6] text-muted-foreground">
              <span className={pendingBadgeCls}>
                <i className="bi bi-hourglass-split"></i> Directory pending DepEd verification
              </span>
              <span>
                Institution lists are compiled from Wikipedia (DepEd indexes); DepEd school IDs, exact addresses, and
                contacts are not yet verified. Cross-check with the DepEd School Masterlist before relying on this
                directory.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Higher Education Institutions */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Higher Education
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">{sc.heis.length} colleges and universities in the city</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-[991px]:grid-cols-1">
            {sc.heis.map((h) => (
              <div
                key={h.name}
                className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
              >
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <i className="bi bi-bank"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 mb-1 text-[0.9375rem] font-bold leading-[1.3] text-foreground">{h.name}</h3>
                    <p className="m-0 text-[0.8125rem] text-muted-foreground">{h.type}</p>
                  </div>
                </div>
                {h.note ? <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">{h.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical / vocational */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Technical &amp; Vocational
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">Skills and technical training</p>
          </div>
          <div className="grid grid-cols-2 gap-5 max-[991px]:grid-cols-1">
            {sc.vocational.map((v) => (
              <div key={v.name} className="rounded-xl border border-line bg-white p-6">
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <i className="bi bi-wrench-adjustable"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 mb-1 text-[0.9375rem] font-bold leading-[1.3] text-foreground">{v.name}</h3>
                    <p className="m-0 text-[0.8125rem] text-muted-foreground">{v.type}</p>
                  </div>
                </div>
                {v.note ? <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">{v.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary schools */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Secondary Schools
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              {sc.secondary.filter((s) => s.type === 'Public').length} public /{' '}
              {sc.secondary.filter((s) => s.type === 'Private').length} private high schools
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-[767px]:grid-cols-1">
            {sc.secondary.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-[10px] transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)]"
              >
                <span className="text-[0.875rem] font-medium text-foreground">{s.name}</span>
                <span
                  className={
                    s.type === 'Public'
                      ? 'shrink-0 rounded-full bg-[rgba(58, 125, 68,0.1)] px-2 py-[2px] text-[0.6875rem] font-semibold text-primary'
                      : 'shrink-0 rounded-full bg-[rgba(0,119,190,0.1)] px-2 py-[2px] text-[0.6875rem] font-semibold text-info'
                  }
                >
                  {s.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elementary schools */}
      <section className={`${sectionCls} bg-muted`}>
        <div className={containerCls}>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-2 text-[1.75rem] font-bold leading-[1.2] text-foreground max-[575px]:text-[1.5rem]">
              Elementary Schools
            </h2>
            <p className="m-0 text-[1rem] text-muted-foreground">
              {publicCount} public / {privateCount} private
            </p>
          </div>
          <div className="mb-6 rounded-xl border border-line bg-white p-6">
            <h3 className="m-0 mb-4 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
              <i className="bi bi-person-lines-fill"></i> Public ({publicCount})
            </h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
              {sc.elementary.public.map((name) => (
                <span key={name} className="text-[0.875rem] leading-[1.5] text-muted-foreground">
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="m-0 mb-4 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-info">
              <i className="bi bi-person-badge"></i> Private ({privateCount})
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 max-[767px]:grid-cols-1">
              {sc.elementary.private.map((name) => (
                <span key={name} className="text-[0.875rem] leading-[1.5] text-muted-foreground">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Library + DepEd gap notice */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className="mb-6 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6">
              <div className="mb-2 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <i className="bi bi-book-half"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 mb-1 text-[1.0625rem] font-bold text-foreground">{sc.library.name}</h3>
                  <p className="m-0 text-[0.875rem] text-muted-foreground">Operates under the {sc.library.operator}</p>
                </div>
              </div>
              <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                <i className="bi bi-telephone text-primary"></i>
                {sc.library.phone}
                <span className={pendingBadgeCls}>
                  <i className="bi bi-archive"></i> {sc.library.phone_status}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-6">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-info-circle"></i> DepEd data gap
              </h3>
              <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">{sc.gap_note}</p>
            </div>
          </div>
          <p className="m-0 text-center text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Source: research/education/26-09-schools.md (Wikipedia lists; old
            official site for the library)
          </p>
        </div>
      </section>
    </>
  );
}
