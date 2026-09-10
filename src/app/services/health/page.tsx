'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/layout/PageHeader';
import healthFacilities from '@/data/health-facilities.json';

export default function HealthPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        title={t('health-page-title')}
        description={t('health-page-desc')}
        badge={{ icon: 'bi bi-heart-pulse-fill', label: t('health-page-badge') }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'nav-services', href: '/services' },
          { label: t('health-page-title') },
        ]}
      />

      {/* Service Cards */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-hospital text-primary"></i>
                <span>{t('health-consultation')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">{t('health-consultation-desc')}</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-fee')}</strong> {t('label-free')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-time')}</strong> {t('label-walk-in')}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-shield-plus text-primary"></i>
                <span>{t('health-vaccination')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">{t('health-vaccination-desc')}</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-fee')}</strong> {t('label-free')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-time')}</strong> {t('label-schedule-varies')}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-heart text-primary"></i>
                <span>{t('health-maternal')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">{t('health-maternal-desc')}</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-fee')}</strong> {t('label-free')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-time')}</strong> {t('label-by-appointment')}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-foreground">
                <i className="bi bi-prescription2 text-primary"></i>
                <span>{t('health-medicine')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-muted-foreground">{t('health-medicine-desc')}</p>
              <div className="flex gap-6 border-t border-line-soft pt-3 text-[0.8125rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-fee')}</strong> {t('label-free-subsidy')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-foreground">{t('label-time')}</strong> {t('label-1-3-days')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Facilities pending notice (verified data on /health) */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="rounded-xl border border-line bg-white p-6 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
              <i className="bi bi-hourglass-split"></i> Facility statistics pending verification
            </span>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              Previously displayed facility counts could not be verified for San Carlos City, Pangasinan and have been
              withheld. Verified hospital and health-office information is available on the{' '}
              <Link href="/health" className="text-primary hover:underline">
                Health Facilities page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Hospitals Directory (verified names only) */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6 bg-muted">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <h2 className="mb-6 flex items-center gap-2 text-[1.375rem] font-semibold leading-[1.2] text-foreground">
            <i className="bi bi-hospital text-primary"></i>
            <span>{t('health-section-hospitals')}</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 max-[991px]:grid-cols-1">
            {healthFacilities.facilities.map((f) => (
              <div
                key={f.name}
                className="rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)]"
              >
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <i className="bi bi-hospital"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 mb-0.5 text-[0.9375rem] font-semibold leading-[1.3] text-foreground">{f.name}</h3>
                    <p className="m-0 text-[0.8125rem] text-muted-foreground">{f.type}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]">
                  <i className="bi bi-hourglass-split"></i> Name verified — DOH data pending
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 mb-0 text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-info-circle mr-1"></i> Facility names are verified from the official city evacuation plan
            (archived 2017). DOH license, bed capacity, and contact data are not verified and are not shown. See{' '}
            <Link href="/health" className="text-primary hover:underline">
              /health
            </Link>{' '}
            for details.
          </p>
        </div>
      </section>

      {/* City Health Office */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <h2 className="mb-6 flex items-center gap-2 text-[1.375rem] font-semibold leading-[1.2] text-foreground">
            <i className="bi bi-building text-primary"></i>
            <span>City Health Office</span>
          </h2>
          <div className="rounded-xl border border-line bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[1.25rem] text-primary">
                <i className="bi bi-hospital"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1.5 text-[1.125rem] font-bold text-foreground">{healthFacilities.city_health_office.name}</h3>
                <p className="m-0 mb-2 text-[0.875rem] text-muted-foreground">
                  City Hall Building, Palaris Street, San Carlos City, Pangasinan
                </p>
                <p className="m-0 flex flex-wrap items-center gap-2 text-[0.875rem] text-foreground">
                  <i className="bi bi-telephone text-primary"></i>
                  {healthFacilities.city_health_office.phone}
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]">
                    <i className="bi bi-archive"></i> {healthFacilities.city_health_office.phone_status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barangay Health Stations pending notice */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="rounded-xl border border-line bg-white p-6 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#8a5a00]">
              <i className="bi bi-hourglass-split"></i> Barangay health stations pending verification
            </span>
            <p className="m-0 text-[0.9375rem] leading-[1.6] text-muted-foreground">
              Per-barangay health station names and locations for San Carlos City are being verified with the City Health
              Office. Previously listed stations could not be confirmed for this city and have been removed. For
              health-service locations, call the City Hall trunk line (075) 600-1432.
            </p>
          </div>
        </div>
      </section>

      {/* HIV Care Philippines CTA */}
      <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6" aria-label="HIV Care Philippines facility directory">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-line bg-white p-12 px-14 text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_rgba(16,24,40,0.08)] max-[767px]:gap-3.5 max-[767px]:px-7 max-[767px]:py-9 max-[575px]:px-5 max-[575px]:py-8">
            <img
              src="/assets/images/logo/hivcareph-logo.svg"
              alt="HIV Care Philippines"
              className="my-1 h-11 w-auto object-contain max-[575px]:h-8"
              width={168}
              height={50}
              loading="lazy"
            />
            <h2 className="m-0 text-[1.75rem] font-extrabold leading-[1.25] text-foreground max-[767px]:text-[1.4375rem] max-[575px]:text-[1.25rem]">{t('health-hivcare-cta-heading')}</h2>
            <p className="m-0 max-w-[560px] text-[1rem] leading-[1.7] text-muted-foreground max-[575px]:text-[0.9375rem]">{t('health-hivcare-cta-desc')}</p>
            <div className="my-1 mb-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 max-[767px]:gap-x-5 max-[767px]:gap-y-2.5 max-[575px]:flex-col max-[575px]:gap-2.5">
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-foreground">
                <i className="bi bi-hospital text-[1.0625rem] text-[#b02e2e]" aria-hidden="true"></i>
                <strong className="text-[1.0625rem] font-extrabold text-[#b02e2e]">338</strong>
                <span>{t('health-hivcare-cta-stat-facilities')}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-foreground">
                <i className="bi bi-phone text-[1.0625rem] text-[#b02e2e]" aria-hidden="true"></i>
                <span>{t('health-hivcare-cta-stat-mobile')}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-foreground">
                <i className="bi bi-patch-check-fill text-[1.0625rem] text-[#b02e2e]" aria-hidden="true"></i>
                <span>{t('health-hivcare-cta-stat-verified')}</span>
              </span>
            </div>
            <a
              href="https://hivcareph.org/"
              className="mt-2 inline-flex items-center gap-2.5 rounded-lg bg-[#b02e2e] px-9 py-4 text-[1rem] font-semibold text-white no-underline shadow-[0_4px_16px_rgba(176, 46, 46,0.25)] transition-[box-shadow,transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#8f2424] hover:text-white hover:no-underline hover:shadow-[0_6px_20px_rgba(176, 46, 46,0.4)] active:scale-[0.97] max-[575px]:w-full max-[575px]:justify-center max-[575px]:px-6 max-[575px]:py-3.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i>
              <span>{t('health-hivcare-cta-btn')}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
