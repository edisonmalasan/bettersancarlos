'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchAutocomplete, { SearchAutocompleteHandle } from '@/components/SearchAutocomplete';
import WeatherWidget from '@/components/WeatherWidget';
import officialsData from '@/data/officials.json';
import cityProfile from '@/data/city-profile.json';
import demographics from '@/data/demographics.json';

const containerCls =
  'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2';
const sectionCls = 'py-16 max-[1024px]:py-8 max-[767px]:py-6';
const sectionHeaderCls =
  'mb-8 flex flex-wrap items-center justify-between gap-4 max-[768px]:flex-col max-[768px]:text-center';
const sectionLinkCls =
  'inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-primary transition-[gap] duration-200 hover:gap-2.5 hover:no-underline';
const serviceCardCls =
  'group flex items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] hover:no-underline';
const statCardCls =
  'group relative flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[background-color,border-color,box-shadow,transform] duration-200 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[linear-gradient(180deg,#3a7d44_0%,#275230_100%)] before:opacity-0 before:transition-opacity before:duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] hover:no-underline hover:before:opacity-100';

const Hero3DLogo = dynamic(() => import('@/components/three/Hero3DLogo'), {
  ssr: false,
  loading: () => (
    <img
      src="/assets/images/logo/better-san-carlos-logo-white.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="h-full w-full object-contain"
    />
  ),
});

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
      <section className="relative flex min-h-[calc(100dvh-6rem)] items-center overflow-hidden bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] bg-cover bg-center py-24 max-[767px]:py-20 bg-[url('/assets/videos/hero-poster.jpg')]">
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover max-[767px]:hidden"
          src="/assets/videos/hero-bettersc.mp4"
          poster="/assets/videos/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(23,34,27,0.62)_0%,rgba(23,34,27,0.34)_45%,rgba(23,34,27,0.15)_100%)]"
          aria-hidden="true"
        ></div>
        <div
          className="absolute inset-0 bg-[rgba(39,82,48,0.30)] mix-blend-multiply"
          aria-hidden="true"
        ></div>
        <div className={containerCls + ' relative z-[1]'}>
          <div className="grid grid-cols-[1fr_1.1fr] items-center gap-24 max-[1280px]:gap-16 max-[992px]:grid-cols-1 max-[992px]:gap-8">
            <div className="max-[992px]:text-center">
              <h1 className="m-0 mb-4 text-[2.5rem] leading-[1.2] text-white max-[768px]:text-[2rem]">
                {t('hero-welcome')}
              </h1>
              <p className="m-0 mb-8 text-[1.125rem] leading-[1.6] text-white/90 max-[768px]:text-base">
                {t('hero-subtitle')}
              </p>
              <div className="w-full max-w-[560px] rounded-2xl border border-[rgba(58, 125, 68,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(58, 125, 68,0.1),0_2px_8px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-300 focus-within:border-[rgba(58, 125, 68,0.15)] focus-within:shadow-[0_12px_40px_rgba(58, 125, 68,0.15),0_4px_12px_rgba(0,0,0,0.06)] max-[768px]:p-5 max-[992px]:mx-auto">
                <h2 className="m-0 mb-5 flex items-center gap-2 text-base text-foreground [&_i]:text-primary">
                  <i className="bi bi-search"></i> {t('hero-find-service')}
                </h2>
                <form role="search" onSubmit={handleSearchSubmit}>
                  <div className="relative flex gap-2">
                    <SearchAutocomplete
                      ref={searchRef}
                      placeholder={t('hero-search-placeholder')}
                    />
                    <button
                      type="submit"
                      className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-[linear-gradient(135deg,#3a7d44_0%,#2f6136_100%)] text-[1.125rem] text-white shadow-[0_2px_8px_rgba(58, 125, 68,0.3)] transition-[box-shadow,transform] duration-200 hover:bg-[linear-gradient(135deg,#2f6136_0%,#275230_100%)] hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.4)] active:scale-[0.97]"
                      aria-label="Search"
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.8125rem]">
                  <span className="font-medium text-muted-foreground">{t('hero-popular')}</span>
                  <Link
                    href="/service-details/birth-certificate"
                    className="rounded-full border border-transparent bg-[rgba(58, 125, 68,0.06)] px-3 py-[5px] font-medium text-primary transition-[border-color,background-color] duration-200 hover:border-[rgba(58, 125, 68,0.15)] hover:bg-[rgba(58, 125, 68,0.1)] hover:no-underline"
                  >
                    {t('hero-birth-certificate')}
                  </Link>
                  <Link
                    href="/service-details/business-permits-licensing"
                    className="rounded-full border border-transparent bg-[rgba(58, 125, 68,0.06)] px-3 py-[5px] font-medium text-primary transition-[border-color,background-color] duration-200 hover:border-[rgba(58, 125, 68,0.15)] hover:bg-[rgba(58, 125, 68,0.1)] hover:no-underline"
                  >
                    {t('hero-business-permit')}
                  </Link>
                  <Link
                    href="/service-details/municipal-treasurer"
                    className="rounded-full border border-transparent bg-[rgba(58, 125, 68,0.06)] px-3 py-[5px] font-medium text-primary transition-[border-color,background-color] duration-200 hover:border-[rgba(58, 125, 68,0.15)] hover:bg-[rgba(58, 125, 68,0.1)] hover:no-underline"
                  >
                    {t('hero-real-property-tax')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="aspect-[4/3] w-full max-w-[640px] max-[1280px]:max-w-[560px] max-[992px]:max-w-[440px] max-[767px]:max-w-[320px]">
                <Hero3DLogo />
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
            <p className="m-0 w-full text-muted-foreground">{t('popular-services-subtitle')}</p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1">
            <Link href="/services/certificates" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl text-primary">
                <i className="bi bi-file-earmark-text-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-foreground">{t('service-certificates')}</h3>
                <p className="m-0 text-[0.8125rem] text-muted-foreground">
                  {t('service-certificates-desc')}
                </p>
              </div>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/business" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl text-primary">
                <i className="bi bi-shop"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-foreground">{t('service-business')}</h3>
                <p className="m-0 text-[0.8125rem] text-muted-foreground">{t('service-business-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/tax-payments" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl text-primary">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-foreground">{t('service-tax')}</h3>
                <p className="m-0 text-[0.8125rem] text-muted-foreground">{t('service-tax-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/social-services" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl text-primary">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-foreground">{t('service-social')}</h3>
                <p className="m-0 text-[0.8125rem] text-muted-foreground">{t('service-social-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link href="/services/health" className={serviceCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl text-primary">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-foreground">{t('service-health')}</h3>
                <p className="m-0 text-[0.8125rem] text-muted-foreground">{t('service-health-desc')}</p>
              </div>
              <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
            <Link
              href="/services"
              className={cn(
                serviceCardCls,
                'border-transparent bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] text-white hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.3)]'
              )}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xl text-white">
                <i className="bi bi-grid-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-base text-white">{t('btn-view-all-services')}</h3>
                <p className="m-0 text-[0.8125rem] text-white">{t('popular-browse-directory')}</p>
              </div>
              <i className="bi bi-arrow-right text-white opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className="mb-8 flex items-center justify-between max-[576px]:flex-col max-[576px]:gap-4 max-[576px]:text-center">
            <h2 className="m-0 text-2xl">{t('stats-at-a-glance')}</h2>
            <Link href="/statistics" className={sectionLinkCls}>
              {t('stats-view-statistics')} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-6 max-[992px]:grid-cols-2 max-[576px]:grid-cols-1">
            <Link href="/statistics" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary transition-colors duration-200 group-hover:bg-primary/20">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors duration-200 group-hover:text-primary-dark">
                  {cityProfile.population.total.toLocaleString('en-PH')}
                </span>
                <span className="mt-0.5 block text-sm font-medium text-foreground">
                  {t('stats-population-label')}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {cityProfile.population.year} census
                </span>
              </div>
            </Link>
            <Link href="/government" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary transition-colors duration-200 group-hover:bg-primary/20">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors duration-200 group-hover:text-primary-dark">
                  {demographics.barangay_count}
                </span>
                <span className="mt-0.5 block text-sm font-medium text-foreground">
                  {t('stats-barangays-label')}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  PSA {cityProfile.population.year}
                </span>
              </div>
            </Link>
            <Link href="/budget" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary transition-colors duration-200 group-hover:bg-primary/20">
                <i className="bi bi-award-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors duration-200 group-hover:text-primary-dark">
                  {demographics.income_class} Class
                </span>
                <span className="mt-0.5 block text-sm font-medium text-foreground">
                  {t('stats-city-label')}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t('stats-income-source')}
                </span>
              </div>
            </Link>
            <Link href="/statistics" className={statCardCls}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary transition-colors duration-200 group-hover:bg-primary/20">
                <i className="bi bi-rulers"></i>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-2xl font-bold leading-[1.2] text-primary transition-colors duration-200 group-hover:text-primary-dark">
                  {cityProfile.land_area_km2} km²
                </span>
                <span className="mt-0.5 block text-sm font-medium text-foreground">
                  {t('stats-land-area-label')}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t('stats-land-area-source')}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Weather & Map */}
      <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="m-0 text-2xl">{t('weather-map-title')}</h2>
          </div>
          <div className="grid grid-cols-[340px_1fr] items-stretch gap-8 max-[991px]:grid-cols-1 max-[991px]:gap-6">
            <div className="flex flex-col">
              <div id="weather-container" className="h-full" aria-live="polite">
                <WeatherWidget />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
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
                <p className="m-0 flex items-center gap-1.5 border-t border-line-soft bg-white px-6 py-3 text-xs text-muted-foreground [&_i]:text-[0.8125rem] [&_i]:text-primary">
                  <i className="bi bi-geo-alt" aria-hidden="true"></i> San Carlos City Hall,
                  Pangasinan 2420
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brief History of San Carlos */}
      <section className="bg-[linear-gradient(180deg,#faf9f6_0%,#ffffff_100%)] py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="m-0 flex items-center gap-2.5 text-2xl [&_i]:text-primary">
              <i className="bi bi-book" aria-hidden="true"></i> {t('history-title')}
            </h2>
            <Link href="/about" className={sectionLinkCls}>
              <span>{t('history-title')}</span> <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-[1fr_340px] items-start gap-8 max-[900px]:grid-cols-1">
            <div className="relative pl-7 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:rounded-sm before:bg-[linear-gradient(180deg,#3a7d44_0%,rgba(58, 125, 68,0.2)_100%)]">
              {[
                { year: '1578', key: 'history-1578', delay: '100ms' },
                { year: '1660', key: 'history-1660', delay: '150ms' },
                { year: '1762', key: 'history-1762', delay: '200ms' },
                { year: '1763', key: 'history-1763', delay: '250ms' },
                { year: '1965', key: 'history-1965', delay: '300ms' },
                { year: '2001', key: 'history-2001', delay: '350ms' },
                { year: '2010', key: 'history-2010', delay: '400ms' },
              ].map((item) => (
                <div
                  key={item.year}
                  data-year={item.year}
                  className="group relative animate-[fadeInUp_0.5s_ease_forwards] pb-5 opacity-0 last:pb-0"
                  style={{ animationDelay: item.delay }}
                >
                  <div className="absolute -left-7 top-1 z-[1] h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-white transition-transform duration-200 group-hover:scale-125 group-hover:bg-primary group-hover:shadow-[0_0_0_4px_rgba(58, 125, 68,0.15)]"></div>
                  <div className="rounded-lg border border-line bg-white px-[18px] py-4 transition-[border-color,box-shadow,transform] duration-200 group-hover:translate-x-1 group-hover:border-primary group-hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)]">
                    <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-[3px] text-xs font-bold text-white">
                      {item.year}
                    </span>
                    <p className="m-0 text-sm leading-[1.6] text-foreground">{t(item.key)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky top-[100px] flex flex-col gap-4 max-[900px]:static max-[900px]:flex-row max-[900px]:flex-wrap max-[575px]:flex-col">
              <div className="flex items-start gap-3.5 rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)] max-[900px]:flex-[1_1_280px] max-[575px]:flex-[1_1_100%]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_i]:text-xl">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold text-foreground">
                    {t('history-pioneers-title')}
                  </h4>
                  <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                    {t('history-pioneers-desc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5 rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_4px_16px_rgba(58, 125, 68,0.1)] max-[900px]:flex-[1_1_280px] max-[575px]:flex-[1_1_100%]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_i]:text-xl">
                  <i className="bi bi-grid-3x3"></i>
                </div>
                <div>
                  <h4 className="m-0 mb-1.5 text-[0.9375rem] font-semibold text-foreground">
                    {t('history-namesake-title')}
                  </h4>
                  <p className="m-0 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                    {t('history-namesake-desc')}
                  </p>
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
            <article className="rounded-xl border border-line bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 text-xs font-semibold text-[#0369a1]">
                  {t('news-announcement')}
                </span>
                <span className="text-[0.8125rem] text-muted-foreground">Nov 28, 2025</span>
              </div>
              <h3 className="m-0 mb-2 text-base">
                <Link href="/news" className="text-foreground hover:text-primary">
                  {t('news-business-permit-title')}
                </Link>
              </h3>
              <p className="m-0 text-sm leading-[1.5] text-muted-foreground">
                {t('news-business-permit-desc')}
              </p>
            </article>
            <article className="rounded-xl border border-line bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-semibold text-[#15803d]">
                  {t('news-project')}
                </span>
                <span className="text-[0.8125rem] text-muted-foreground">Nov 15, 2025</span>
              </div>
              <h3 className="m-0 mb-2 text-base">
                <Link href="/news" className="text-foreground hover:text-primary">
                  {t('news-market-title')}
                </Link>
              </h3>
              <p className="m-0 text-sm leading-[1.5] text-muted-foreground">{t('news-market-desc')}</p>
            </article>
            <article className="rounded-xl border border-line bg-white p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-xs font-semibold text-[#b45309]">
                  {t('news-advisory')}
                </span>
                <span className="text-[0.8125rem] text-muted-foreground">Nov 10, 2025</span>
              </div>
              <h3 className="m-0 mb-2 text-base">
                <Link href="/news" className="text-foreground hover:text-primary">
                  {t('news-power-title')}
                </Link>
              </h3>
              <p className="m-0 text-sm leading-[1.5] text-muted-foreground">{t('news-power-desc')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* City Leadership */}
      <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
        <div className={containerCls}>
          <div className={sectionHeaderCls}>
            <h2 className="m-0 text-2xl">{t('section-leadership')}</h2>
            <Link href="/government" className={sectionLinkCls}>
              <span>{t('btn-view-officials')}</span> <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            <div className="rounded-xl border border-line bg-white p-8 text-center">
              <div className="mb-4 inline-block rounded-full bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-3.5 py-1.5 text-xs font-semibold text-white">
                {t('title-mayor')}
              </div>
              <h3 className="m-0 mb-4 text-xl text-foreground">{officialsData.mayor.name}</h3>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:CIO@sancarlospangasinan.com"
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  <i className="bi bi-envelope"></i> CIO@sancarlospangasinan.com
                </a>
                <a
                  href="tel:(075) 600-1432"
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  <i className="bi bi-telephone"></i> (075) 600-1432
                </a>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-8 text-center">
              <div className="mb-4 inline-block rounded-full bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] px-3.5 py-1.5 text-xs font-semibold text-white">
                {t('title-vice-mayor')}
              </div>
              <h3 className="m-0 mb-4 text-xl text-foreground">{officialsData.vice_mayor.name}</h3>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:CIO@sancarlospangasinan.com"
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  <i className="bi bi-envelope"></i> CIO@sancarlospangasinan.com
                </a>
                <a
                  href="tel:(075) 600-1432"
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
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
            <a
              href="tel:(075) 600-1432"
              className="flex items-start gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] hover:no-underline"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[1.125rem] text-primary">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-muted-foreground">
                  {t('contact-phone')}
                </h3>
                <p className="m-0 mb-1 text-base font-semibold text-foreground">(075) 600-1432</p>
                <span className="text-[0.8125rem] text-muted-foreground">{t('contact-hours')}</span>
              </div>
            </a>
            <a
              href="mailto:CIO@sancarlospangasinan.com"
              className="flex items-start gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] hover:no-underline"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[1.125rem] text-primary">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-muted-foreground">
                  {t('contact-email')}
                </h3>
                <p className="m-0 mb-1 text-base font-semibold text-foreground">
                  CIO@sancarlospangasinan.com
                </p>
                <span className="text-[0.8125rem] text-muted-foreground">{t('contact-response')}</span>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-xl border border-line bg-white p-6 text-foreground transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[1.125rem] text-primary">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[0.8125rem] font-medium uppercase tracking-[0.5px] text-muted-foreground">
                  {t('contact-address')}
                </h3>
                <p className="m-0 mb-1 text-base font-semibold text-foreground">
                  {t('contact-municipal-hall')}
                </p>
                <span className="text-[0.8125rem] text-muted-foreground">
                  San Carlos City, Pangasinan 2420
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
