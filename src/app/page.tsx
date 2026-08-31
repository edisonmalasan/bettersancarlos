'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchAutocomplete, { SearchAutocompleteHandle } from '@/components/SearchAutocomplete';
import WeatherWidget from '@/components/WeatherWidget';
import officialsData from '@/data/officials.json';

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
      <section className="home-hero-v2">
        <div className="container">
          <div className="home-hero-v2-inner">
            <div className="home-hero-v2-text">
              <h1>{t('hero-welcome')}</h1>
              <p>{t('hero-subtitle')}</p>
              <div className="home-hero-v2-actions">
                <Link href="/services" className="btn btn-primary">
                  {t('hero-browse-services')} <i className="bi bi-arrow-right"></i>
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  {t('hero-contact-us')}
                </Link>
              </div>
            </div>
            <div className="home-hero-v2-search">
              <div className="home-search-box">
                <h2>
                  <i className="bi bi-search"></i> {t('hero-find-service')}
                </h2>
                <form className="search-form" role="search" onSubmit={handleSearchSubmit}>
                  <div className="search-input-wrapper">
                    <SearchAutocomplete ref={searchRef} placeholder={t('hero-search-placeholder')} />
                    <button type="submit" className="search-submit-btn" aria-label="Search">
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
                <div className="home-search-tags">
                  <span>{t('hero-popular')}</span>
                  <Link href="/service-details/birth-certificate">
                    {t('hero-birth-certificate')}
                  </Link>
                  <Link href="/service-details/business-permits-licensing">
                    {t('hero-business-permit')}
                  </Link>
                  <Link href="/service-details/municipal-treasurer">
                    {t('hero-real-property-tax')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-popular')}</h2>
            <p>{t('popular-services-subtitle')}</p>
          </div>
          <div className="home-services-grid">
            <Link href="/services/certificates" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-file-earmark-text-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-certificates')}</h3>
                <p>{t('service-certificates-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </Link>
            <Link href="/services/business" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-shop"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-business')}</h3>
                <p>{t('service-business-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </Link>
            <Link href="/services/tax-payments" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-tax')}</h3>
                <p>{t('service-tax-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </Link>
            <Link href="/services/social-services" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-social')}</h3>
                <p>{t('service-social-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </Link>
            <Link href="/services/health" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-health')}</h3>
                <p>{t('service-health-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </Link>
            <Link href="/services" className="home-service-card home-service-card--all">
              <div className="home-service-icon">
                <i className="bi bi-grid-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('btn-view-all-services')}</h3>
                <p>{t('popular-browse-directory')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="home-stats-v2">
        <div className="container">
          <div className="home-stats-v2-header">
            <h2>{t('stats-at-a-glance')}</h2>
            <Link href="/statistics" className="home-section-link">
              {t('stats-view-statistics')} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="home-stats-v2-grid">
            <Link href="/statistics" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">52,746</span>
                <span className="home-stat-card-label">{t('stats-population-label')}</span>
                <span className="home-stat-card-source">{t('stats-population-source')}</span>
              </div>
            </Link>
            <Link href="/government" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">44</span>
                <span className="home-stat-card-label">{t('stats-barangays-label')}</span>
                <span className="home-stat-card-source">{t('stats-barangays-source')}</span>
              </div>
            </Link>
            <Link href="/budget" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-award-fill"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">1st Class</span>
                <span className="home-stat-card-label">{t('stats-municipality-label')}</span>
                <span className="home-stat-card-source">{t('stats-municipality-source')}</span>
              </div>
            </Link>
            <Link href="/statistics" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-rulers"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">180.95 km²</span>
                <span className="home-stat-card-label">{t('stats-land-area-label')}</span>
                <span className="home-stat-card-source">{t('stats-land-area-source')}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Weather & Map */}
      <section className="section weather-map-section">
        <div className="container">
          <div className="home-stats-v2-header">
            <h2>{t('weather-map-title')}</h2>
          </div>
          <div className="weather-map-grid">
            <div className="weather-column">
              <div id="weather-container" aria-live="polite">
                <WeatherWidget />
              </div>
            </div>
            <div className="map-column">
              <div className="map-card">
                <div
                  id="map-container"
                  role="application"
                  aria-label="Interactive map of San Carlos City, Pangasinan"
                  data-map-loaded="iframe"
                >
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=120.32%2C15.90%2C120.38%2C15.95&layer=mapnik&marker=15.928%2C120.349"
                    className="map-iframe"
                    title="Map of San Carlos City, Pangasinan"
                    aria-label="OpenStreetMap showing San Carlos City Hall, Pangasinan"
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="map-attribution">
                  <i className="bi bi-geo-alt" aria-hidden="true"></i> San Carlos City Hall,
                  Pangasinan 2420
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brief History of San Carlos */}
      <section className="section history-section">
        <div className="container">
          <div className="home-stats-v2-header">
            <h2>
              <i className="bi bi-book" aria-hidden="true"></i> {t('history-title')}
            </h2>
          </div>
          <div className="history-content">
            <div className="history-timeline">
              <div className="timeline-item" data-year="1578">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1578</span>
                  <p>{t('history-1578')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1660">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1660</span>
                  <p>{t('history-1660')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1762">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1762</span>
                  <p>{t('history-1762')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1763">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1763</span>
                  <p>{t('history-1763')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1965">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1965</span>
                  <p>{t('history-1965')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="2001">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">2001</span>
                  <p>{t('history-2001')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="2010">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">2010</span>
                  <p>{t('history-2010')}</p>
                </div>
              </div>
            </div>
            <div className="history-summary">
              <div className="history-card">
                <div className="history-card-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="history-card-content">
                  <h4>{t('history-pioneers-title')}</h4>
                  <p>{t('history-pioneers-desc')}</p>
                </div>
              </div>
              <div className="history-card">
                <div className="history-card-icon">
                  <i className="bi bi-grid-3x3"></i>
                </div>
                <div className="history-card-content">
                  <h4>{t('history-namesake-title')}</h4>
                  <p>{t('history-namesake-desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .history-section {
            background: linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          }
          .history-section .home-stats-v2-header h2 {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .history-section .home-stats-v2-header h2 i {
            color: var(--color-primary);
          }
          .history-content {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 32px;
            align-items: start;
          }
          .history-timeline {
            position: relative;
            padding-left: 28px;
          }
          .history-timeline::before {
            content: '';
            position: absolute;
            left: 6px;
            top: 8px;
            bottom: 8px;
            width: 2px;
            background: linear-gradient(
              180deg,
              var(--color-primary) 0%,
              rgba(0, 50, 160, 0.2) 100%
            );
            border-radius: 2px;
          }
          .timeline-item {
            position: relative;
            padding-bottom: 20px;
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
          }
          .timeline-item:nth-child(1) {
            animation-delay: 0.1s;
          }
          .timeline-item:nth-child(2) {
            animation-delay: 0.2s;
          }
          .timeline-item:nth-child(3) {
            animation-delay: 0.3s;
          }
          .timeline-item:nth-child(4) {
            animation-delay: 0.4s;
          }
          .timeline-item:nth-child(5) {
            animation-delay: 0.5s;
          }
          .timeline-item:nth-child(6) {
            animation-delay: 0.6s;
          }
          .timeline-item:nth-child(7) {
            animation-delay: 0.7s;
          }
          .timeline-item:last-child {
            padding-bottom: 0;
          }
          .timeline-marker {
            position: absolute;
            left: -28px;
            top: 4px;
            width: 14px;
            height: 14px;
            background: var(--color-bg);
            border: 3px solid var(--color-primary);
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 1;
          }
          .timeline-item:hover .timeline-marker {
            background: var(--color-primary);
            transform: scale(1.2);
            box-shadow: 0 0 0 4px rgba(0, 50, 160, 0.15);
          }
          .timeline-content {
            background: var(--color-bg);
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 10px;
            padding: 16px 18px;
            transition: all 0.3s ease;
          }
          .timeline-item:hover .timeline-content {
            border-color: var(--color-primary);
            box-shadow: 0 4px 16px rgba(0, 50, 160, 0.1);
            transform: translateX(4px);
          }
          .timeline-year {
            display: inline-block;
            background: var(--color-primary);
            color: white;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 20px;
            margin-bottom: 8px;
          }
          .timeline-content p {
            font-size: 0.875rem;
            color: var(--color-text);
            margin: 0;
            line-height: 1.6;
          }
          .timeline-content p strong {
            color: var(--color-primary);
          }
          .timeline-content p em {
            font-style: italic;
            color: var(--color-text-light);
          }
          .history-summary {
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: sticky;
            top: 100px;
          }
          .history-card {
            background: var(--color-bg);
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            gap: 14px;
            align-items: flex-start;
            transition: all 0.3s ease;
          }
          .history-card:hover {
            border-color: var(--color-primary);
            box-shadow: 0 4px 16px rgba(0, 50, 160, 0.1);
            transform: translateY(-2px);
          }
          .history-card-icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(
              135deg,
              var(--color-primary) 0%,
              var(--color-secondary) 100%
            );
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .history-card-icon i {
            color: white;
            font-size: 1.25rem;
          }
          .history-card-content h4 {
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--color-text);
            margin: 0 0 6px 0;
          }
          .history-card-content p {
            font-size: 0.8125rem;
            color: var(--color-text-light);
            margin: 0;
            line-height: 1.5;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 900px) {
            .history-content {
              grid-template-columns: 1fr;
            }
            .history-summary {
              position: static;
              flex-direction: row;
              flex-wrap: wrap;
            }
            .history-card {
              flex: 1 1 280px;
            }
          }
          @media (max-width: 575px) {
            .history-summary {
              flex-direction: column;
            }
            .history-card {
              flex: 1 1 100%;
            }
          }
        `}</style>
      </section>

      {/* Latest Updates */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-updates')}</h2>
            <Link href="/news" className="home-section-link">
              <span>{t('btn-view-all')}</span> <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="home-news-grid">
            <article className="home-news-card">
              <div className="home-news-meta">
                <span className="home-news-badge home-news-badge--info">
                  {t('news-announcement')}
                </span>
                <span className="home-news-date">Nov 28, 2025</span>
              </div>
              <h3>
                <Link href="/news">{t('news-business-permit-title')}</Link>
              </h3>
              <p>{t('news-business-permit-desc')}</p>
            </article>
            <article className="home-news-card">
              <div className="home-news-meta">
                <span className="home-news-badge home-news-badge--success">
                  {t('news-project')}
                </span>
                <span className="home-news-date">Nov 15, 2025</span>
              </div>
              <h3>
                <Link href="/news">{t('news-market-title')}</Link>
              </h3>
              <p>{t('news-market-desc')}</p>
            </article>
            <article className="home-news-card">
              <div className="home-news-meta">
                <span className="home-news-badge home-news-badge--warning">
                  {t('news-advisory')}
                </span>
                <span className="home-news-date">Nov 10, 2025</span>
              </div>
              <h3>
                <Link href="/news">{t('news-power-title')}</Link>
              </h3>
              <p>{t('news-power-desc')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Municipal Leadership */}
      <section className="section home-leadership-section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-leadership')}</h2>
            <Link href="/government" className="home-section-link">
              <span>{t('btn-view-officials')}</span> <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="home-leadership-grid">
            <div className="home-leader-card">
              <div className="home-leader-badge">{t('title-mayor')}</div>
              <h3>{officialsData.mayor.name}</h3>
              <div className="home-leader-contacts">
                <a href="mailto:CIO@sancarlospangasinan.com">
                  <i className="bi bi-envelope"></i> CIO@sancarlospangasinan.com
                </a>
                <a href="tel:(075) 600-1432">
                  <i className="bi bi-telephone"></i> (075) 600-1432
                </a>
              </div>
            </div>
            <div className="home-leader-card">
              <div className="home-leader-badge">{t('title-vice-mayor')}</div>
              <h3>{officialsData.vice_mayor.name}</h3>
              <div className="home-leader-contacts">
                <a href="mailto:CIO@sancarlospangasinan.com">
                  <i className="bi bi-envelope"></i> CIO@sancarlospangasinan.com
                </a>
                <a href="tel:(075) 600-1432">
                  <i className="bi bi-telephone"></i> (075) 600-1432
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-contact')}</h2>
            <Link href="/contact" className="home-section-link">
              {t('btn-view-all')} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="home-contact-v2-grid">
            <a href="tel:0623312067" className="home-contact-v2-card">
              <div className="home-contact-v2-icon">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div className="home-contact-v2-content">
                <h3>{t('contact-phone')}</h3>
                <p className="home-contact-v2-value">(062) 331-2067</p>
                <span className="home-contact-v2-note">{t('contact-hours')}</span>
              </div>
            </a>
            <a href="mailto:CIO@sancarlospangasinan.com" className="home-contact-v2-card">
              <div className="home-contact-v2-icon">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="home-contact-v2-content">
                <h3>{t('contact-email')}</h3>
                <p className="home-contact-v2-value">CIO@sancarlospangasinan.com</p>
                <span className="home-contact-v2-note">{t('contact-response')}</span>
              </div>
            </a>
            <div className="home-contact-v2-card">
              <div className="home-contact-v2-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="home-contact-v2-content">
                <h3>{t('contact-address')}</h3>
                <p className="home-contact-v2-value">{t('contact-municipal-hall')}</p>
                <span className="home-contact-v2-note">San Carlos City, Pangasinan 2420</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
