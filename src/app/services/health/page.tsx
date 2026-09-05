'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HealthPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
        <nav className="py-4 text-[0.875rem] text-[#5c6b73] max-[767px]:text-[0.8125rem]" aria-label="Breadcrumb">
          <Link href="/" className="text-[#5c6b73] no-underline">{t('nav-home')}</Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="text-[#5c6b73] no-underline">{t('nav-services')}</Link>
          <span className="mx-2">/</span>
          <span className="mx-2" aria-current="page">{t('health-page-title')}</span>
        </nav>
      </div>

      <section className="bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] py-12 text-white max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="mx-auto max-w-[600px] text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.15)] px-4 py-1.5 text-[0.8125rem] font-medium text-white">
              <i className="bi bi-heart-pulse-fill"></i>
              <span>{t('health-page-badge')}</span>
            </span>
            <h1 className="mb-2 text-[2rem] font-bold leading-[1.2] text-white">{t('health-page-title')}</h1>
            <p className="m-0 text-[1rem] text-[rgba(255,255,255,0.9)]">{t('health-page-desc')}</p>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 min-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[767px]:grid-cols-1">
            <div className="rounded-[10px] border border-[#e2e8e0] bg-white p-6 transition-all duration-200 hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-hospital text-primary"></i>
                <span>{t('health-consultation')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#5c6b73]">{t('health-consultation-desc')}</p>
              <div className="flex gap-6 border-t border-[#eaece8] pt-3 text-[0.8125rem] text-[#5c6b73]">
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-fee')}</strong> {t('label-free')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-time')}</strong> {t('label-walk-in')}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#e2e8e0] bg-white p-6 transition-all duration-200 hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-shield-plus text-primary"></i>
                <span>{t('health-vaccination')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#5c6b73]">{t('health-vaccination-desc')}</p>
              <div className="flex gap-6 border-t border-[#eaece8] pt-3 text-[0.8125rem] text-[#5c6b73]">
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-fee')}</strong> {t('label-free')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-time')}</strong> {t('label-schedule-varies')}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#e2e8e0] bg-white p-6 transition-all duration-200 hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-heart text-primary"></i>
                <span>{t('health-maternal')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#5c6b73]">{t('health-maternal-desc')}</p>
              <div className="flex gap-6 border-t border-[#eaece8] pt-3 text-[0.8125rem] text-[#5c6b73]">
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-fee')}</strong> {t('label-free')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-time')}</strong> {t('label-by-appointment')}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#e2e8e0] bg-white p-6 transition-all duration-200 hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <h3 className="m-0 mb-2 flex items-center gap-2 text-[1rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-prescription2 text-primary"></i>
                <span>{t('health-medicine')}</span>
              </h3>
              <p className="m-0 mb-3 text-[0.875rem] text-[#5c6b73]">{t('health-medicine-desc')}</p>
              <div className="flex gap-6 border-t border-[#eaece8] pt-3 text-[0.8125rem] text-[#5c6b73]">
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-fee')}</strong> {t('label-free-subsidy')}
                </span>
                <span className="flex items-center gap-1">
                  <strong className="text-[#2f3e46]">{t('label-time')}</strong> {t('label-1-3-days')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Facilities Statistics */}
      <section className="py-6 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="grid grid-cols-4 gap-3 max-[768px]:grid-cols-2">
            <div className="rounded-lg border border-[#e2e8e0] bg-white p-4 px-3 text-center transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.1)] max-[640px]:px-2.5 max-[640px]:py-3">
              <span className="mb-1 block text-[1.75rem] font-bold leading-none text-primary max-[640px]:text-[1.5rem]">88</span>
              <span className="text-[0.75rem] leading-[1.2] text-[#5c6b73]">{t('health-stat-facilities')}</span>
            </div>
            <div className="rounded-lg border border-[#e2e8e0] bg-white p-4 px-3 text-center transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.1)] max-[640px]:px-2.5 max-[640px]:py-3">
              <span className="mb-1 block text-[1.75rem] font-bold leading-none text-primary max-[640px]:text-[1.5rem]">3</span>
              <span className="text-[0.75rem] leading-[1.2] text-[#5c6b73]">{t('health-stat-hospitals')}</span>
            </div>
            <div className="rounded-lg border border-[#e2e8e0] bg-white p-4 px-3 text-center transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.1)] max-[640px]:px-2.5 max-[640px]:py-3">
              <span className="mb-1 block text-[1.75rem] font-bold leading-none text-primary max-[640px]:text-[1.5rem]">22</span>
              <span className="text-[0.75rem] leading-[1.2] text-[#5c6b73]">{t('health-stat-bhs')}</span>
            </div>
            <div className="rounded-lg border border-[#e2e8e0] bg-white p-4 px-3 text-center transition-all duration-200 hover:border-primary hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.1)] max-[640px]:px-2.5 max-[640px]:py-3">
              <span className="mb-1 block text-[1.75rem] font-bold leading-none text-primary max-[640px]:text-[1.5rem]">1</span>
              <span className="text-[0.75rem] leading-[1.2] text-[#5c6b73]">{t('health-stat-mho')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hospitals Directory */}
      <section className="py-6 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <h2 className="mb-6 flex items-center gap-2 text-[1.375rem] font-semibold leading-[1.2] text-[#2f3e46]">
            <i className="bi bi-hospital text-primary"></i>
            <span>{t('health-section-hospitals')}</span>
          </h2>
          <div className="grid grid-cols-3 gap-3 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
            <div className="rounded-[0_8px_8px_0] border border-[#e2e8e0] border-l-[3px] border-l-primary bg-white p-4 transition-all duration-200 hover:border-primary hover:border-l-[#2f6136] hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)]">
              <div className="mb-2 inline-block rounded bg-[rgba(58, 125, 68,0.1)] px-2 py-[3px] text-[0.625rem] font-semibold uppercase tracking-[0.5px] text-primary">Tertiary Hospital</div>
              <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.3] text-[#2f3e46]">{t('health-pltciluis-a-tiam-medical-center')}</h3>
              <p className="m-0 mb-2.5 text-[0.8125rem] leading-[1.5] text-[#5c6b73]">
                {t('health-a-tertiary-level-philhealthaccredited-private')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-[5px] text-[0.75rem] text-[#5c6b73]">
                  <i className="bi bi-geo-alt text-[0.6875rem] text-primary"></i>
                  <span>{t('health-national-highway-san-carlos')}</span>
                </span>
              </div>
            </div>

            <div className="rounded-[0_8px_8px_0] border border-[#e2e8e0] border-l-[3px] border-l-primary bg-white p-4 transition-all duration-200 hover:border-primary hover:border-l-[#2f6136] hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)]">
              <div className="mb-2 inline-block rounded bg-[rgba(58, 125, 68,0.1)] px-2 py-[3px] text-[0.625rem] font-semibold uppercase tracking-[0.5px] text-primary">Private Hospital</div>
              <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.3] text-[#2f3e46]">{t('health-medical-mission-group-hospital-health-services')}</h3>
              <p className="m-0 mb-2.5 text-[0.8125rem] leading-[1.5] text-[#5c6b73]">
                {t('health-also-known-as-new-mmg-hospital-providing-quality')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-[5px] text-[0.75rem] text-[#5c6b73]">
                  <i className="bi bi-geo-alt text-[0.6875rem] text-primary"></i>
                  <span>{t('health-bintawan-road-brgy-quezon')}</span>
                </span>
              </div>
            </div>

            <div className="rounded-[0_8px_8px_0] border border-[#e2e8e0] border-l-[3px] border-l-primary bg-white p-4 transition-all duration-200 hover:border-primary hover:border-l-[#2f6136] hover:shadow-[0_2px_8px_rgba(58, 125, 68,0.08)]">
              <div className="mb-2 inline-block rounded bg-[rgba(58, 125, 68,0.1)] px-2 py-[3px] text-[0.625rem] font-semibold uppercase tracking-[0.5px] text-primary">Medical Center</div>
              <h3 className="m-0 mb-1.5 text-[0.9375rem] font-semibold leading-[1.3] text-[#2f3e46]">{t('health-salubris-inc-salubris-medical-center')}</h3>
              <p className="m-0 mb-2.5 text-[0.8125rem] leading-[1.5] text-[#5c6b73]">
                {t('health-private-medical-center-offering-various')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-[5px] text-[0.75rem] text-[#5c6b73]">
                  <i className="bi bi-geo-alt text-[0.6875rem] text-primary"></i>
                  <span>{t('health-national-highway-san-carlos')}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Municipal Health Office */}
      <section className="bg-muted py-6 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <h2 className="mb-6 flex items-center gap-2 text-[1.375rem] font-semibold leading-[1.2] text-[#2f3e46]">
            <i className="bi bi-building text-primary"></i>
            <span>{t('health-section-mho')}</span>
          </h2>
          <div className="rounded-[0_8px_8px_0] border border-[#e2e8e0] border-l-[3px] border-l-primary bg-white p-5">
            <div>
              <h3 className="m-0 mb-2 text-[1rem] font-semibold leading-[1.2] text-[#2f3e46]">{t('health-mho-title')}</h3>
              <p className="m-0 mb-3.5 text-[0.8125rem] leading-[1.5] text-[#5c6b73]">{t('health-mho-desc')}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">
                  <i className="bi bi-check-circle text-[0.6875rem] text-primary"></i>
                  <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">{t('health-service-lying-in')}</span>
                </span>
                <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">
                  <i className="bi bi-check-circle text-[0.6875rem] text-primary"></i>
                  <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">{t('health-service-laboratory')}</span>
                </span>
                <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">
                  <i className="bi bi-check-circle text-[0.6875rem] text-primary"></i>
                  <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">{t('health-service-immunization')}</span>
                </span>
                <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">
                  <i className="bi bi-check-circle text-[0.6875rem] text-primary"></i>
                  <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">{t('health-service-prenatal')}</span>
                </span>
                <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">
                  <i className="bi bi-check-circle text-[0.6875rem] text-primary"></i>
                  <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">{t('health-service-family-planning')}</span>
                </span>
                <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">
                  <i className="bi bi-check-circle text-[0.6875rem] text-primary"></i>
                  <span className="inline-flex items-center gap-[5px] rounded bg-muted px-2.5 py-[5px] text-[0.75rem] text-[#2f3e46] max-[640px]:px-2 max-[640px]:py-1 max-[640px]:text-[0.6875rem]">{t('health-service-tb-dots')}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barangay Health Stations */}
      <section className="py-6 max-[1024px]:py-8 max-[767px]:py-6">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <h2 className="mb-6 flex items-center gap-2 text-[1.375rem] font-semibold leading-[1.2] text-[#2f3e46]">
            <i className="bi bi-plus-circle text-primary"></i>
            <span>{t('health-section-bhs')}</span>
          </h2>
          <p className="mx-0 -mt-2 mb-4 text-[0.8125rem] text-[#5c6b73]">{t('health-bhs-subtitle')}</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-[640px]:grid-cols-2">
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-aggub-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-bagahabag-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-bangaan-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-bangar-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-buenavista-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-calaocan-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-commando-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-concepcion-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-curifang-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-dadap-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-lactawan-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-nangalisan-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-ocapon-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-osmea-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-paitan-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-pilar-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-poblacion-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-quezon-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-quirino-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-roxas-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-tucal-bhs')}</span>
            </div>
            <div className="rounded-[0_6px_6px_0] border-l-[3px] border-l-primary bg-muted px-3 py-2.5 text-[0.8125rem] font-medium text-[#2f3e46] transition-all duration-150 hover:border-l-[#2f6136] hover:bg-[#eaf3ea]">
              <span>{t('health-uddiawan-bhs')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* HIV Care Philippines CTA */}
      <section className="bg-muted bg-[radial-gradient(circle,rgba(0,0,0,0.035)_1px,transparent_1px)] py-12 [background-size:20px_20px] max-[1024px]:py-8 max-[767px]:py-6" aria-label="HIV Care Philippines facility directory">
        <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6">
          <div className="flex w-full flex-col items-center gap-4 rounded-[20px] border border-[rgba(16,24,40,0.04)] bg-white p-12 px-14 text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_rgba(16,24,40,0.08)] max-[767px]:gap-3.5 max-[767px]:px-7 max-[767px]:py-9 max-[575px]:rounded-2xl max-[575px]:px-5 max-[575px]:py-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(176, 46, 46,0.08)] px-4 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.02em] text-[#c4123f]">
              <i className="bi bi-shield-check text-[0.9375rem]" aria-hidden="true"></i>
              <span>{t('health-hivcare-cta-eyebrow')}</span>
            </span>
            <img
              src="/assets/images/logo/hivcareph-logo.svg"
              alt="HIV Care Philippines"
              className="my-1 h-11 w-auto object-contain max-[575px]:h-8"
              width={168}
              height={50}
              loading="lazy"
            />
            <h2 className="m-0 text-[1.75rem] font-extrabold leading-[1.25] text-[#2f3e46] max-[767px]:text-[1.4375rem] max-[575px]:text-[1.25rem]">{t('health-hivcare-cta-heading')}</h2>
            <p className="m-0 max-w-[560px] text-[1rem] leading-[1.7] text-[#5c6b73] max-[575px]:text-[0.9375rem]">{t('health-hivcare-cta-desc')}</p>
            <div className="my-1 mb-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 max-[767px]:gap-x-5 max-[767px]:gap-y-2.5 max-[575px]:flex-col max-[575px]:gap-2.5">
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-hospital text-[1.0625rem] text-[#b02e2e]" aria-hidden="true"></i>
                <strong className="text-[1.0625rem] font-extrabold text-[#b02e2e]">338</strong>
                <span>{t('health-hivcare-cta-stat-facilities')}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-phone text-[1.0625rem] text-[#b02e2e]" aria-hidden="true"></i>
                <span>{t('health-hivcare-cta-stat-mobile')}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#2f3e46]">
                <i className="bi bi-patch-check-fill text-[1.0625rem] text-[#b02e2e]" aria-hidden="true"></i>
                <span>{t('health-hivcare-cta-stat-verified')}</span>
              </span>
            </div>
            <a
              href="https://hivcareph.org/"
              className="mt-2 inline-flex items-center gap-2.5 rounded-[10px] bg-[#b02e2e] px-9 py-4 text-[1rem] font-semibold text-white no-underline shadow-[0_4px_16px_rgba(176, 46, 46,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8f2424] hover:text-white hover:no-underline hover:shadow-[0_6px_20px_rgba(176, 46, 46,0.4)] active:translate-y-0 max-[575px]:w-full max-[575px]:justify-center max-[575px]:px-6 max-[575px]:py-3.5"
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
