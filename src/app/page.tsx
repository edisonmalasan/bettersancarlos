'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchAutocomplete, { SearchAutocompleteHandle } from '@/components/SearchAutocomplete';
import WeatherWidget from '@/components/WeatherWidget';
import officialsData from '@/data/officials.json';

const containerCls = 'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const sectionHeaderCls =
  'mb-8 flex flex-wrap items-center justify-between gap-4 max-[768px]:flex-col max-[768px]:text-center';
const sectionLinkCls =
  'inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-primary hover:gap-2.5 hover:no-underline';
const serviceCardCls =
  'group flex items-center gap-4 rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#1a1a1a] no-underline transition-all hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.1)] hover:no-underline';
const statCardCls =
  'group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#1a1a1a] no-underline transition-all duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[linear-gradient(180deg,#3a7d44_0%,#275230_100%)] before:opacity-0 before:transition-opacity before:duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] hover:no-underline hover:before:opacity-100';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchRef = useRef<SearchAutocompleteHandle>(null);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchRef.current?.submit();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] py-[120px]">
        <div className={containerCls}>
          <div className="grid grid-cols-2 items-center gap-12 max-[992px]:grid-cols-1 max-[992px]:gap-8">
            <div className="max-[992px]:text-center">
              <h1 className="m-0 mb-4 text-[2.5rem] leading-[1.2] text-white max-[768px]:text-[2rem]">{t('hero-welcome')}</h1>
              <p className="m-0 mb-8 text-[1.125rem] leading-[1.6] text-white/90 max-[768px]:text-base">{t('hero-subtitle')}</p>
              <div className="flex flex-wrap gap-4 max-[992px]:justify-center">
                <Link href="/services" className="inline-flex items-center gap-2 rounded-lg border-2 border-transparent bg-white px-6 py-3 font-semibold text-primary no-underline transition-all hover:-translate-y-0.5 hover:bg-[#f8f9fa] hover:text-primary hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:no-underline focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(232, 153, 10,0.5)]">
                  {t('hero-browse-services')} <i className="bi bi-arrow-right"></i>
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3 font-semibold text-white no-underline transition-all hover:bg-white/15 hover:text-white hover:no-underline">
                  {t('hero-contact-us')}
                </Link>
              </div>
            </div>
            <div>
              <div className="rounded-2xl border border-[rgba(58, 125, 68,0.08)] bg-white p-8 shadow-[0_8px_32px_rgba(58, 125, 68,0.1),0_2px_8px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-300 focus-within:border-[rgba(58, 125, 68,0.15)] focus-within:shadow-[0_12px_40px_rgba(58, 125, 68,0.15),0_4px_12px_rgba(0,0,0,0.06)] max-[768px]:p-6">
                <h2 className="m-0 mb-6 flex items-center gap-2 text-base text-[#1a1a1a] [&_i]:text-primary">
                  <i className="bi bi-search"></i> {t('hero-find-service')}
                </h2>
                <form role="search" onSubmit={handleSearchSubmit}>
                  <div className="relative flex gap-2">
                    <SearchAutocomplete ref={searchRef} placeholder={t('hero-search-placeholder')} />
                    <button type="submit" className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#2f6136_100%)] text-[1.125rem] text-white shadow-[0_2px_8px_rgba(58, 125, 68,0.3)] transition-all hover:-translate-y-px hover:bg-[linear-gradient(135deg,#2f6136_0%,#003399_100%)] hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.4)] active:translate-y-0" aria-label="Search">
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.8125rem]">
                  <span className="font-medium text-[#666]">{t('hero-popular')}</span>
                  <Link href="/service-details/birth-certificate" className="rounded-full border border-transparent bg-[rgba(58, 125, 68,0.06)] px-3 py-[5px] font-medium text-primary no-underline transition-all hover:border-[rgba(58, 125, 68,0.15)] hover:bg-[rgba(58, 125, 68,0.1)] hover:no-underline">
                    {t('hero-birth-certificate')}
                  </Link>
                  <Link href="/service-details/business-permits-licensing" className="rounded-full border border-transparent bg-[rgba(58, 125, 68,0.06)] px-3 py-[5px] font-medium text-primary no-underline transition-all hover:border-[rgba(58, 125, 68,0.15)] hover:bg-[rgba(58, 125, 68,0.1)] hover:no-underline">
                    {t('hero-business-permit')}
                  </Link>
                  <Link href="/service-details/municipal-treasurer" className="rounded-full border border-transparent bg-[rgba(58, 125, 68,0.06)] px-3 py-[5px] font-medium text-primary no-underline transition-all hover:border-[rgba(58, 125, 68,0.15)] hover:bg-[rgba(58, 125, 68,0.1)] hover:no-underline">
                    {t('hero-real-property-tax')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className={sectionHeaderCls}>
            <h2 className="m-0 text-2xl">{t('section-popular')}</h2>
            <p className="m-0 w-full text-[#666]">{t('popular-services-subtitle')}</p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1">
            <Link href="/services/certificates" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary">
                <i className="bi bi-file-earmark-text-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-[#1a1a1a]">{t('service-certificates')}</h3>
                <p className="m-0 text-[0.8125rem] text-[#666]">{t('service-certificates-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-[#666] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/business" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary">
                <i className="bi bi-shop"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-[#1a1a1a]">{t('service-business')}</h3>
                <p className="m-0 text-[0.8125rem] text-[#666]">{t('service-business-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-[#666] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/tax-payments" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-[#1a1a1a]">{t('service-tax')}</h3>
                <p className="m-0 text-[0.8125rem] text-[#666]">{t('service-tax-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-[#666] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/social-services" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-[#1a1a1a]">{t('service-social')}</h3>
                <p className="m-0 text-[0.8125rem] text-[#666]">{t('service-social-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-[#666] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/health" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-[#1a1a1a]">{t('service-health')}</h3>
                <p className="m-0 text-[0.8125rem] text-[#666]">{t('service-health-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-[#666] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services" className={cn(serviceCardCls, 'border-transparent bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-white hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.3)]')}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white/20 text-xl text-white">
                <i className="bi bi-grid-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-white">{t('btn-view-all-services')}</h3>
                <p className="m-0 text-[0.8125rem] text-white">{t('popular-browse-directory')}</p>
              </div>
              <i className="bi bi-arrow-right text-white opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-[#f8f9fa] py-12">
        <div className={containerCls}>
          <div className="mb-8 flex items-center justify-between max-[576px]:flex-col max-[576px]:gap-4 max-[576px]:text-center">
            <h2 className="m-0 text-xl">{t('stats-at-a-glance')}</h2>
            <Link href="/statistics" className={sectionLinkCls}>
              {t('stats-view-statistics')} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-6 max-[992px]:grid-cols-2 max-[576px]:grid-cols-1">
            <Link href="/statistics" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] group-hover:text-white">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors group-hover:text-[#2f6136]">52,746</span>
                <span className="mt-0.5 block text-sm font-medium text-[#1a1a1a]">{t('stats-population-label')}</span>
                <span className="mt-0.5 block text-xs text-[#666]">{t('stats-population-source')}</span>
              </div>
            </Link>
            <Link href="/government" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] group-hover:text-white">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors group-hover:text-[#2f6136]">44</span>
                <span className="mt-0.5 block text-sm font-medium text-[#1a1a1a]">{t('stats-barangays-label')}</span>
                <span className="mt-0.5 block text-xs text-[#666]">{t('stats-barangays-source')}</span>
              </div>
            </Link>
            <Link href="/budget" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] group-hover:text-white">
                <i className="bi bi-award-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors group-hover:text-[#2f6136]">1st Class</span>
                <span className="mt-0.5 block text-sm font-medium text-[#1a1a1a]">{t('stats-municipality-label')}</span>
                <span className="mt-0.5 block text-xs text-[#666]">{t('stats-municipality-source')}</span>
              </div>
            </Link>
            <Link href="/statistics" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#f8f9fa] text-xl text-primary transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] group-hover:text-white">
                <i className="bi bi-rulers"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors group-hover:text-[#2f6136]">180.95 km²</span>
                <span className="mt-0.5 block text-sm font-medium text-[#1a1a1a]">{t('stats-land-area-label')}</span>
                <span className="mt-0.5 block text-xs text-[#666]">{t('stats-land-area-source')}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Weather & Map */}
      <section className="bg-[#f8f9fa] py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="m-0 text-xl">{t('weather-map-title')}</h2>
          </div>
          <div className="grid grid-cols-[340px_1fr] items-stretch gap-8 max-[991px]:grid-cols-1 max-[991px]:gap-6">
            <div className="flex flex-col">
              <div id="weather-container" className="h-full" aria-live="polite">
                <WeatherWidget />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] max-[575px]:rounded-xl">
                <div
                  id="map-container"
                  className="relative z-[1] min-h-[300px] w-full flex-1 bg-[#f5f5f5]"
                  role="application"
                  aria-label="Interactive map of San Carlos City, Pangasinan"
                  data-map-loaded="iframe"
                >
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=120.32%2C15.90%2C120.38%2C15.95&layer=mapnik&marker=15.928%2C120.349"
                    className="block h-[300px] w-full border-0"
                    title="Map of San Carlos City, Pangasinan"
                    aria-label="OpenStreetMap showing San Carlos City Hall, Pangasinan"
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="m-0 flex items-center gap-1.5 border-t border-black/[0.05] bg-white px-6 py-3 text-xs text-[#666] [&_i]:text-[0.8125rem] [&_i]:text-primary">
                  <i className="bi bi-geo-alt" aria-hidden="true"></i> San Carlos City Hall,
                  Pangasinan 2420
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brief History of San Carlos */}
      <section className="bg-[linear-gradient(180deg,#f8f9fa_0%,#ffffff_100%)] py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="m-0 flex items-center gap-2.5 text-xl [&_i]:text-primary">
              <i className="bi bi-book" aria-hidden="true"></i> {t('history-title')}
            </h2>
          </div>
          <div className="grid grid-cols-[1fr_340px] items-start gap-8 max-[900px]:grid-cols-1">
            <div className="relative pl-7 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:rounded-sm before:bg-[linear-gradient(180deg,#3a7d44_0%,rgba(58, 125, 68,0.2)_100%)]">
              {[
                { year: '1578', key: 'history-1578', delay: '100ms' },
                { year: '1660', key: 'history-1660', delay: '200ms' },
                { year: '1762', key: 'history-1762', delay: '300ms' },
                { year: '1763', key: 'history-1763', delay: '400ms' },
                { year: '1965', key: 'history-1965', delay: '500ms' },
                { year: '2001', key: 'history-2001', delay: '600ms' },
                { year: '2010', key: 'history-2010', delay: '700ms' },
              ].map((item) => (
                <div key={item.year} data-year={item.year} className="group relative animate-[fadeInUp_0.5s_ease_forwards] pb-5 opacity-0 last:pb-0" style={{ animationDelay: item.delay }}>
                  <div className="absolute -left-7 top-1 z-[1] h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-white transition-all group-hover:scale-125 group-hover:bg-primary group-hover:shadow-[0_0_0_4px_rgba(58, 125, 68,0.15)]"></div>
                  <div className="rounded-[10px] border border-black/[0.06] bg-white px-[18px] py-4 transition-all group-hover:translate-x-1 group-hover:border-primary group-hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]">
                    <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-[3px] text-xs font-bold text-white">{item.year}</span>
                    <p className="m-0 text-sm leading-[1.6] text-[#1a1a1a]">{t(item.key)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky top-[100px] flex flex-col gap-4 max-[900px]:static max-[900px]:flex-row max-[900px]:flex-wrap max-[575px]:flex-col">
              <div className="flex items-start gap-3.5 rounded-xl border border-black/[0.06] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)] max-[900px]:flex-[1_1_280px] max-[575px]:flex-[1_1_100%]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] [&_i]:text-xl [&_i]:text-white">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold text-[#1a1a1a]">{t('history-pioneers-title')}</h4>
                  <p className="m-0 text-[0.8125rem] leading-[1.5] text-[#666]">{t('history-pioneers-desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5 rounded-xl border border-black/[0.06] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)] max-[900px]:flex-[1_1_280px] max-[575px]:flex-[1_1_100%]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] [&_i]:text-xl [&_i]:text-white">
                  <i className="bi bi-grid-3x3"></i>
                </div>
                <div>
                  <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold text-[#1a1a1a]">{t('history-namesake-title')}</h4>
                  <p className="m-0 text-[0.8125rem] leading-[1.5] text-[#666]">{t('history-namesake-desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className={sectionHeaderCls}>
            <h2 className="m-0 text-2xl">{t('section-updates')}</h2>
            <Link href="/news" className={sectionLinkCls}>
              <span>{t('btn-view-all')}</span> <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1">
            <article className="rounded-xl border border-[#e5e7eb] bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 text-xs font-semibold text-[#0369a1]">
                  {t('news-announcement')}
                </span>
                <span className="text-[0.8125rem] text-[#666]">Nov 28, 2025</span>
              </div>
              <h3 className="m-0 mb-2 text-base">
                <Link href="/news" className="text-[#1a1a1a] hover:text-primary">{t('news-business-permit-title')}</Link>
              </h3>
              <p className="m-0 text-sm leading-[1.5] text-[#666]">{t('news-business-permit-desc')}</p>
            </article>
            <article className="rounded-xl border border-[#e5e7eb] bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-semibold text-[#15803d]">
                  {t('news-project')}
                </span>
                <span className="text-[0.8125rem] text-[#666]">Nov 15, 2025</span>
              </div>
              <h3 className="m-0 mb-2 text-base">
                <Link href="/news" className="text-[#1a1a1a] hover:text-primary">{t('news-market-title')}</Link>
              </h3>
              <p className="m-0 text-sm leading-[1.5] text-[#666]">{t('news-market-desc')}</p>
            </article>
            <article className="rounded-xl border border-[#e5e7eb] bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-xs font-semibold text-[#b45309]">
                  {t('news-advisory')}
                </span>
                <span className="text-[0.8125rem] text-[#666]">Nov 10, 2025</span>
              </div>
              <h3 className="m-0 mb-2 text-base">
                <Link href="/news" className="text-[#1a1a1a] hover:text-primary">{t('news-power-title')}</Link>
              </h3>
              <p className="m-0 text-sm leading-[1.5] text-[#666]">{t('news-power-desc')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Municipal Leadership */}
      <section className="bg-[#f8f9fa] py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className={sectionHeaderCls}>
            <h2 className="m-0 text-2xl">{t('section-leadership')}</h2>
            <Link href="/government" className={sectionLinkCls}>
              <span>{t('btn-view-officials')}</span> <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 text-center">
              <div className="mb-4 inline-block rounded-full bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-3.5 py-1.5 text-xs font-semibold text-white">{t('title-mayor')}</div>
              <h3 className="m-0 mb-4 text-xl text-[#1a1a1a]">{officialsData.mayor.name}</h3>
              <div className="flex flex-col gap-2">
                <a href="mailto:CIO@sancarlospangasinan.com" className="inline-flex items-center justify-center gap-2 text-sm text-[#666] hover:text-primary">
                  <i className="bi bi-envelope"></i> CIO@sancarlospangasinan.com
                </a>
                <a href="tel:(075) 600-1432" className="inline-flex items-center justify-center gap-2 text-sm text-[#666] hover:text-primary">
                  <i className="bi bi-telephone"></i> (075) 600-1432
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 text-center">
              <div className="mb-4 inline-block rounded-full bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-3.5 py-1.5 text-xs font-semibold text-white">{t('title-vice-mayor')}</div>
              <h3 className="m-0 mb-4 text-xl text-[#1a1a1a]">{officialsData.vice_mayor.name}</h3>
              <div className="flex flex-col gap-2">
                <a href="mailto:CIO@sancarlospangasinan.com" className="inline-flex items-center justify-center gap-2 text-sm text-[#666] hover:text-primary">
                  <i className="bi bi-envelope"></i> CIO@sancarlospangasinan.com
                </a>
                <a href="tel:(075) 600-1432" className="inline-flex items-center justify-center gap-2 text-sm text-[#666] hover:text-primary">
                  <i className="bi bi-telephone"></i> (075) 600-1432
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className={sectionCls}>
        <div className={containerCls}>
          <div className={sectionHeaderCls}>
            <h2 className="m-0 text-2xl">{t('section-contact')}</h2>
            <Link href="/contact" className={sectionLinkCls}>
              {t('btn-view-all')} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 max-[992px]:grid-cols-1">
            <a href="tel:0623312067" className="flex items-start gap-4 rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#1a1a1a] no-underline transition-all hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)] hover:no-underline">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.125rem] text-white">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-[#666]">{t('contact-phone')}</h3>
                <p className="m-0 mb-1 text-base font-semibold text-[#1a1a1a]">(062) 331-2067</p>
                <span className="text-[0.8125rem] text-[#666]">{t('contact-hours')}</span>
              </div>
            </a>
            <a href="mailto:CIO@sancarlospangasinan.com" className="flex items-start gap-4 rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#1a1a1a] no-underline transition-all hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)] hover:no-underline">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.125rem] text-white">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-[#666]">{t('contact-email')}</h3>
                <p className="m-0 mb-1 text-base font-semibold text-[#1a1a1a]">CIO@sancarlospangasinan.com</p>
                <span className="text-[0.8125rem] text-[#666]">{t('contact-response')}</span>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#1a1a1a] transition-all hover:border-primary hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.08)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-[1.125rem] text-white">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-[#666]">{t('contact-address')}</h3>
                <p className="m-0 mb-1 text-base font-semibold text-[#1a1a1a]">{t('contact-municipal-hall')}</p>
                <span className="text-[0.8125rem] text-[#666]">San Carlos City, Pangasinan 2420</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
