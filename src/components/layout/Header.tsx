'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

function isMobileNav(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
}

const langBtnBase =
  'inline-block cursor-pointer rounded-lg border-2 border-primary bg-white px-2.5 py-1.5 font-sans text-xs font-semibold text-primary opacity-70 transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:opacity-100 max-[1024px]:px-[9px] max-[1024px]:py-[5px] max-[1024px]:text-[0.6875rem] max-[767px]:px-2 max-[767px]:py-1';

const langBtnActive = 'border-primary bg-primary text-white opacity-100';

const navLinkBase =
  'font-medium text-[#1a1a1a] select-none [-webkit-tap-highlight-color:transparent] hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2 max-[1024px]:block max-[1024px]:rounded-md max-[1024px]:px-4 max-[1024px]:py-3 max-[1024px]:hover:bg-[#f8f9fa]';

const caretBase =
  'after:ml-1.5 after:inline-block after:h-0 after:w-0 after:border-x-4 after:border-t-4 after:border-x-transparent after:align-middle after:transition-transform after:duration-200 max-[1024px]:flex max-[1024px]:items-center max-[1024px]:justify-between max-[1024px]:after:ml-auto max-[1024px]:after:shrink-0';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const scrollYRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const lockBodyScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.body.classList.add('mobile-menu-open');
    document.body.style.top = `-${scrollYRef.current}px`;
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.classList.remove('mobile-menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollYRef.current);
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    unlockBodyScroll();
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 320);
  }, [unlockBodyScroll]);

  const toggleDropdown = useCallback((index: number, e: React.MouseEvent) => {
    if (isMobileNav()) {
      e.preventDefault();
      setOpenDropdown((prev) => (prev === index ? null : index));
    }
  }, []);

  // Close menu on route change
  useEffect(() => {
    isAnimatingRef.current = false;
    closeMenu();
  }, [pathname, closeMenu]);

  // Cleanup body scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        closeMenu();
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, closeMenu]);

  // Escape key to close
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, closeMenu]);

  // Close mobile menu on resize to desktop (debounced)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isMobileNav() && mobileMenuOpen) {
          isAnimatingRef.current = false;
          closeMenu();
        }
      }, 150);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen, closeMenu]);

  const dropdownMenuCls = (open: boolean) =>
    cn(
      'flex flex-col gap-0 rounded-none bg-transparent p-0 shadow-none transition-[max-height,opacity,padding,visibility] duration-300 max-[1024px]:overflow-hidden min-[1025px]:invisible min-[1025px]:absolute min-[1025px]:left-0 min-[1025px]:top-full min-[1025px]:z-[1001] min-[1025px]:min-w-[220px] min-[1025px]:translate-y-2.5 min-[1025px]:rounded-lg min-[1025px]:bg-white min-[1025px]:py-2 min-[1025px]:opacity-0 min-[1025px]:shadow-[0_4px_8px_rgba(0,0,0,0.1)] min-[1025px]:transition-all min-[1025px]:duration-200 min-[1025px]:group-hover:visible min-[1025px]:group-hover:translate-y-0 min-[1025px]:group-hover:opacity-100',
      open
        ? 'max-[1024px]:visible max-[1024px]:max-h-[500px] max-[1024px]:opacity-100 max-[1024px]:py-1 max-[1024px]:pl-4'
        : 'max-[1024px]:invisible max-[1024px]:max-h-0 max-[1024px]:opacity-0'
    );

  const dropdownItemCls =
    'block whitespace-nowrap px-4 py-2 text-[#1a1a1a] transition-colors hover:bg-[#f8f9fa] hover:text-primary hover:no-underline max-[1024px]:whitespace-normal max-[1024px]:px-4 max-[1024px]:py-2.5 max-[1024px]:text-[0.9375rem] max-[1024px]:text-[#666]';

  return (
    <header className="site-header sticky top-0 z-[1000] bg-white py-2 shadow-[0_2px_4px_rgba(0,0,0,0.05)] max-[1024px]:py-2.5 max-[767px]:py-2 max-[480px]:py-1.5">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] items-center justify-between overflow-visible px-6 max-[1024px]:h-auto max-[1024px]:min-h-16 max-[1024px]:flex-wrap max-[1024px]:gap-0 max-[767px]:min-h-[60px] max-[767px]:gap-1.5 max-[767px]:px-4 max-[480px]:min-h-14 max-[480px]:px-2">
        <div className="flex shrink-0 items-center gap-4 self-start overflow-visible pt-0.5 max-[1024px]:order-1 max-[1024px]:py-0.5">
          <Link href="/">
            <img
              src="/assets/images/logo/better-san-carlos-logo.png"
              alt="Better San Carlos Logo"
              className="block h-16 w-auto max-w-[260px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.18)] max-[1024px]:h-[60px] max-[1024px]:max-w-[220px] max-[767px]:h-14 max-[767px]:max-w-[210px] max-[480px]:h-[52px] max-[480px]:max-w-[200px]"
              width="148"
              height="64"
              fetchPriority="high"
              decoding="async"
            />
          </Link>
        </div>

        <nav
          ref={navRef}
          className={`max-[1024px]:order-4 max-[1024px]:w-full max-[1024px]:overflow-hidden max-[1024px]:transition-[max-height,opacity,padding,visibility] max-[1024px]:duration-300 ${
            mobileMenuOpen
              ? 'max-[1024px]:visible max-[1024px]:max-h-[80vh] max-[1024px]:overflow-y-auto max-[1024px]:opacity-100 max-[1024px]:border-t max-[1024px]:border-[#f8f9fa] max-[1024px]:pt-4 max-[1024px]:mt-4'
              : 'max-[1024px]:invisible max-[1024px]:max-h-0 max-[1024px]:opacity-0 max-[1024px]:border-t max-[1024px]:border-transparent max-[1024px]:pt-0 max-[1024px]:mt-0'
          }`}
          aria-label="Main Navigation"
        >
          <div className={mobileMenuOpen ? 'flex items-center gap-2 border-b border-[#f8f9fa] px-4 pb-3 pt-2 lg:hidden' : 'hidden lg:hidden'}>
            <button
              type="button"
              className={cn(langBtnBase, language === 'en' && langBtnActive)}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={cn(langBtnBase, language === 'fil' && langBtnActive)}
              onClick={() => setLanguage('fil')}
              aria-label="Switch to Filipino"
            >
              FIL
            </button>
          </div>
          <ul className="flex gap-6 max-[1024px]:flex-col max-[1024px]:gap-0">
            <li>
              <Link href="/" className={cn(navLinkBase, pathname === '/' && 'text-primary')}>
                {t('nav-home')}
              </Link>
            </li>
            <li className="group min-[1025px]:relative">
              <Link
                href="/services"
                className={`${navLinkBase} ${caretBase} ${openDropdown === 0 ? 'max-[1024px]:after:rotate-180' : ''}`}
                aria-haspopup="true"
                aria-expanded={openDropdown === 0 ? 'true' : 'false'}
                onClick={(e) => toggleDropdown(0, e)}
              >
                {t('nav-services')}
              </Link>
              <ul className={dropdownMenuCls(openDropdown === 0)}>
                <li>
                  <Link href="/services/certificates" className={dropdownItemCls}>{t('dropdown-certificates')}</Link>
                </li>
                <li>
                  <Link href="/services/business" className={dropdownItemCls}>{t('dropdown-business')}</Link>
                </li>
                <li>
                  <Link href="/services/tax-payments" className={dropdownItemCls}>{t('dropdown-tax-payments')}</Link>
                </li>
                <li>
                  <Link href="/services/social-services" className={dropdownItemCls}>{t('dropdown-social-services')}</Link>
                </li>
                <li>
                  <Link href="/services/health" className={dropdownItemCls}>{t('dropdown-health')}</Link>
                </li>
                <li>
                  <Link href="/services/agriculture" className={dropdownItemCls}>{t('dropdown-agriculture')}</Link>
                </li>
                <li>
                  <Link href="/services/infrastructure" className={dropdownItemCls}>{t('dropdown-infrastructure')}</Link>
                </li>
                <li>
                  <Link href="/services/education" className={dropdownItemCls}>{t('dropdown-education')}</Link>
                </li>
                <li>
                  <Link href="/services/public-safety" className={dropdownItemCls}>{t('dropdown-public-safety')}</Link>
                </li>
                <li>
                  <Link href="/services/environment" className={dropdownItemCls}>{t('dropdown-environment')}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/government" className={navLinkBase}>{t('nav-government')}</Link>
            </li>
            <li>
              <Link href="/statistics" className={navLinkBase}>{t('nav-statistics')}</Link>
            </li>
            <li className="group min-[1025px]:relative">
              <Link
                href="/legislative"
                className={`${navLinkBase} ${caretBase} ${openDropdown === 1 ? 'max-[1024px]:after:rotate-180' : ''}`}
                aria-haspopup="true"
                aria-expanded={openDropdown === 1 ? 'true' : 'false'}
                onClick={(e) => toggleDropdown(1, e)}
              >
                {t('nav-legislative')}
              </Link>
              <ul className={dropdownMenuCls(openDropdown === 1)}>
                <li>
                  <Link href="/legislative/ordinance-framework" className={dropdownItemCls}>
                    {t('dropdown-ordinance-framework')}
                  </Link>
                </li>
                <li>
                  <Link href="/legislative/resolution-framework" className={dropdownItemCls}>
                    {t('dropdown-resolution-framework')}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/budget" className={navLinkBase}>{t('nav-transparency')}</Link>
            </li>
            <li>
              <Link href="/contact" className={navLinkBase}>{t('nav-contact')}</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 py-1 max-[1024px]:hidden">
          <div className="lang-selector flex gap-1 max-[1024px]:gap-[3px] max-[767px]:gap-0.5">
            <button
              type="button"
              className={cn(langBtnBase, language === 'en' && langBtnActive)}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={cn(langBtnBase, language === 'fil' && langBtnActive)}
              onClick={() => setLanguage('fil')}
              aria-label="Switch to Filipino"
            >
              FIL
            </button>
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="mobile-menu-toggle hidden cursor-pointer border-0 bg-transparent p-2 text-2xl leading-none text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2 max-[1024px]:order-3 max-[1024px]:flex max-[1024px]:items-center max-[1024px]:justify-center"
          onClick={() => {
            if (isAnimatingRef.current) return;
            if (mobileMenuOpen) {
              closeMenu();
            } else {
              isAnimatingRef.current = true;
              setMobileMenuOpen(true);
              lockBodyScroll();
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 320);
            }
          }}
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true"></i>
        </button>
      </div>
    </header>
  );
}
