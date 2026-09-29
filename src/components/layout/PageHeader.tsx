'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Container } from '@/components/layout/Container';

interface PageHeaderProps {
    title: string;
    description?: string;
    /**
     * @deprecated The pill badge was removed as decorative chrome. The prop is
     * still accepted so the ~55 existing call sites need not change, but it is
     * intentionally not rendered. Remove it from call sites when convenient.
     */
    badge?: { icon: string; label: string };
    breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
    const { t } = useLanguage();

    return (
        <>
            <Container className="max-[767px]:px-4 max-[480px]:px-2">
                <nav
                    className="py-4 text-sm text-muted-foreground max-[767px]:text-[0.8125rem] [&_a]:text-muted-foreground"
                    aria-label="Breadcrumb"
                >
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <span key={index} className="mx-2">
                                {crumb.href && !isLast ? (
                                    <Link href={crumb.href}>{t(crumb.label) || crumb.label}</Link>
                                ) : (
                                    <span aria-current="page" className="mx-2">
                                        {t(crumb.label) || crumb.label}
                                    </span>
                                )}
                                {!isLast && <span className="mx-2">/</span>}
                            </span>
                        );
                    })}
                </nav>
            </Container>

            {/* Flat solid bamboo-green masthead band: no gradient, no glow, no
                pill badge, left-aligned text (brand-color-palette, D6). */}
            <section className="bg-[#3a7d44] py-10 text-white max-[1024px]:py-8 max-[767px]:py-6">
                <Container className="max-[767px]:px-4 max-[480px]:px-2">
                    <div className="max-w-[720px]">
                        <h1 className="m-0 mb-2 text-[2rem] text-white max-[767px]:text-[1.75rem]">
                            {title}
                        </h1>
                        {description && (
                            <p className="m-0 text-base text-white/95">{description}</p>
                        )}
                    </div>
                </Container>
            </section>
        </>
    );
}
