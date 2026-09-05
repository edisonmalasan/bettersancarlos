'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
    title: string;
    description?: string;
    badge?: { icon: string; label: string };
    breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, description, badge, breadcrumbs }: PageHeaderProps) {
    const { t } = useLanguage();

    return (
        <>
            <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                <nav className="py-4 text-sm text-[#5c6b73] max-[767px]:text-[0.8125rem] [&_a]:text-[#5c6b73]" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <span key={index} className="mx-2">
                                {crumb.href && !isLast ? (
                                    <Link href={crumb.href}>{t(crumb.label) || crumb.label}</Link>
                                ) : (
                                    <span aria-current="page" className="mx-2">{t(crumb.label) || crumb.label}</span>
                                )}
                                {!isLast && <span className="mx-2">/</span>}
                            </span>
                        );
                    })}
                </nav>
            </div>

            <section className="bg-[linear-gradient(135deg,#3a7d44_0%,#275230_100%)] py-12 text-white">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mx-auto max-w-[600px] text-center">
                        {badge && (
                            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-[0.8125rem] font-medium text-white">
                                <i className={badge.icon}></i>
                                <span>{badge.label}</span>
                            </span>
                        )}
                        <h1 className="m-0 mb-2 text-[2rem] text-white">{title}</h1>
                        {description && <p className="m-0 text-base text-white/90">{description}</p>}
                    </div>
                </div>
            </section>
        </>
    );
}
