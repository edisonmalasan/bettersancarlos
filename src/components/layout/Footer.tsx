'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [version, setVersion] = useState('');

  useEffect(() => {
    fetch('/version.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.version) setVersion(data.version);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="site-footer bg-[linear-gradient(180deg,#2f3e46_0%,#111111_100%)] text-white">
      <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 border-b border-white/[0.08] py-[60px] pb-10 max-[991px]:grid-cols-2 max-[991px]:gap-10 max-[575px]:grid-cols-1 max-[575px]:gap-8 max-[575px]:py-10 max-[575px]:pb-8">
          <div className="max-w-[320px] max-[991px]:col-[1/-1] max-[991px]:max-w-full max-[991px]:text-left max-[575px]:flex max-[575px]:flex-col max-[575px]:items-center max-[575px]:text-center">
            <img
              src="/assets/images/logo/better-san-carlos-logo-white.png"
              alt="Better San Carlos logo"
              className="mb-4 block h-[104px] w-auto max-w-[260px] max-[991px]:ml-0 max-[991px]:mr-auto max-[575px]:mx-auto"
              width="241"
              height="104"
              loading="lazy"
              decoding="async"
            />
            <p className="m-0 mb-6 text-sm leading-[1.6] text-white/70 max-[575px]:text-center">{t('footer-tagline')}</p>
            <div className="hidden">
              <a
                href="https://www.facebook.com/bettersancarlos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/bettersancarlos/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://discord.com/invite/qeSu7RJkjQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <i className="bi bi-discord"></i>
              </a>
            </div>
          </div>
          <div className="max-[575px]:flex max-[575px]:flex-col max-[575px]:items-center max-[575px]:text-center">
            <h4 className="m-0 mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-white/50">{t('footer-quick-links')}</h4>
            <ul className="m-0 list-none p-0">
              <li className="mb-2">
                <a href="/sitemap-page" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">{t('footer-sitemap')}</a>
              </li>
              <li className="mb-2">
                <a
                  href="https://sancarlospangasinan.gov.ph/wp-content/uploads/2025/10/As-of-October-21-2025-2.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline"
                >
                  {t('footer-citizens-charter')}
                </a>
              </li>
              <li className="mb-2">
                <a href="/terms" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">{t('footer-terms')}</a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">{t('footer-privacy')}</a>
              </li>
              <li className="mb-2">
                <a href="/accessibility" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">{t('footer-accessibility')}</a>
              </li>
              <li className="mb-2">
                <a href="/faq" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">{t('footer-faq')}</a>
              </li>
            </ul>
          </div>
          <div className="max-[575px]:flex max-[575px]:flex-col max-[575px]:items-center max-[575px]:text-center">
            <h4 className="m-0 mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-white/50">{t('footer-resources')}</h4>
            <ul className="m-0 list-none p-0">
              <li className="mb-2">
                <a href="https://data.gov.ph" target="_blank" rel="noopener noreferrer" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">
                  {t('footer-open-data')}
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.foi.gov.ph/" target="_blank" rel="noopener noreferrer" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">
                  {t('footer-foi')}
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://sancarlospangasinan.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline"
                >
                  {t('footer-lgu-portal')}
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://sangguniangbayan.sancarlospangasinan.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline"
                >
                  {t('footer-sb')}
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.facebook.com/sccp.cio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline"
                >
                  {t('footer-lgu-facebook')}
                </a>
              </li>
              <li className="mb-2">
                <a href="https://blgf.gov.ph/" target="_blank" rel="noopener noreferrer" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">
                  {t('footer-blgf')}
                </a>
              </li>
              <li className="mb-2">
                <a href="https://cmci.dti.gov.ph/" target="_blank" rel="noopener noreferrer" className="block text-[0.8125rem] font-normal text-white/80 no-underline transition-colors hover:text-white hover:no-underline">
                  {t('footer-cmci')}
                </a>
              </li>
            </ul>
          </div>
          <div className="max-[575px]:flex max-[575px]:flex-col max-[575px]:items-center max-[575px]:text-center">
            <div
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-[rgba(58, 125, 68,0.08)] px-3 py-1.5 text-xs text-white/80 max-[575px]:mx-auto"
              role="status"
              aria-label="Cost to the People of San Carlos: Zero Pesos"
            >
              {t('footer-cost')} <span className="font-bold text-success">₱0</span>
            </div>
            <a href="mailto:volunteer@bettersancarlos" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-[0.8125rem] text-white/70 no-underline transition-all hover:bg-white/10 hover:text-white hover:no-underline [&_i]:text-white">
              <i className="bi bi-envelope-heart"></i> {t('footer-volunteer')}
            </a>
            <a
              href="https://github.com/BetterSanCarlos/bettersancarlos"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-[0.8125rem] text-white/70 no-underline transition-all hover:bg-white/10 hover:text-white hover:no-underline [&_i]:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-github"></i> {t('footer-contribute')}
            </a>
            <div className="mt-4 flex flex-row items-center gap-5 [&_a]:inline-flex [&_a]:items-center [&_a]:opacity-60 [&_a]:transition-opacity [&_a]:hover:opacity-100">
              <a
                href="https://bettergov.ph"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BetterGov.ph"
              >
                <img
                  src="/assets/images/logo/bettergov-footer.svg"
                  alt="BetterGov.ph"
                  className="block h-[54px] w-auto"
                  width="120"
                  height="28"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 max-[575px]:justify-center max-[575px]:text-center">
          <div className="flex w-full flex-wrap items-center gap-1.5 text-[0.8125rem] text-white/50 max-[575px]:flex-col max-[575px]:gap-1 max-[575px]:items-center max-[575px]:text-center">
            <span className="text-white/60">
              &copy; {currentYear} {t('footer-copyright-text')}
            </span>
            <span className="text-white/45">MIT | CC BY 4.0</span>
            <span className="text-white/40">{t('footer-copyright-disclaimer')}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] text-white/50 max-[575px]:ml-0 [&_i]:text-sm [&_i]:text-white/50">
              <i className="bi bi-boxes"></i> {version ? `Ver. ${version}` : ''}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
