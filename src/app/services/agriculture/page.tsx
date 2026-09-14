'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import DirectoryLinkCard from '@/components/DirectoryLinkCard';

const pendingBadgeCls =
  'inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]';

export default function AgriculturePage() {
  return (
    <>
      <PageHeader
        title="Agriculture Services"
        description="Support for farmers and agricultural development."
        badge={{ icon: 'bi bi-tree-fill', label: 'Agriculture' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Agriculture Services' },
        ]}
      />

      {/* Identity */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-[14px] py-[6px] text-[0.8125rem] font-semibold text-primary">
              <i className="bi bi-award"></i> Mango and Bamboo Capital
            </span>
            <p className="m-0 text-[1rem] leading-[1.7] text-muted-foreground">
              San Carlos City is the provincial and national reference point for carabao mango and bamboo products — a
              major trading center for bamboo-based products and furniture and a top producer of carabao mangoes. Beyond
              mango and bamboo, the city&apos;s agricultural base includes crop production, livestock raising, inland
              fishing (the city is landlocked), pottery, and food processing.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 max-[991px]:grid-cols-1">
            {/* 2008 trees stat */}
            <div className="rounded-xl border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] p-6 text-white sm:p-8">
              <div className="mb-3 flex items-center gap-2 text-[0.875rem] font-medium text-white">
                <i className="bi bi-tree-fill text-[1rem]"></i>
                <span>Fruit-bearing mango trees</span>
              </div>
              <div className="mb-1 text-[2rem] font-bold leading-[1.1] text-white">127,000+</div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.8125rem] text-white">2008 LGU report</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(255,255,255,0.15)] px-2 py-[3px] text-[0.6875rem] font-semibold text-white">
                  <i className="bi bi-hourglass-split"></i> dated — re-verify
                </span>
              </div>
            </div>

            {/* City Agriculture Office */}
            <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
              <h3 className="m-0 mb-2 flex items-start gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-building mt-[2px] text-primary"></i>
                <span>City Agriculture Office</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] leading-[1.5] text-muted-foreground">
                City Agriculturist: Nerissa T. Cabuay (2024 archived LGU directory).
              </p>
              <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                <i className="bi bi-telephone text-primary"></i> (075) 955-5826
                <span className={pendingBadgeCls}>
                  <i className="bi bi-archive"></i> historical (2017) — re-verify
                </span>
              </p>
            </div>
          </div>

          {/* Service link */}
          <div className="mt-6 grid grid-cols-1 gap-6">
            <Link
              href="/service-details/municipal-agriculture"
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                <i className="bi bi-flower1"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-base font-semibold text-foreground">Municipal Agriculture Office services</span>
                <span className="block text-[0.8125rem] text-muted-foreground">
                  Agricultural assistance, farm registration, and livelihood programs
                </span>
              </span>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
          </div>

          <DirectoryLinkCard
            href="/agriculture"
            icon="bi bi-tree"
            title="City Agriculture Guide"
            description="Mango and bamboo economy, 2008 tree census, offices, and production-data gaps"
          />
        </div>
      </section>
    </>
  );
}
