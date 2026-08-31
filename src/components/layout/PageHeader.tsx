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
            <div className="container">
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <span key={index}>
                                {crumb.href && !isLast ? (
                                    <Link href={crumb.href}>{t(crumb.label) || crumb.label}</Link>
                                ) : (
                                    <span aria-current="page">{t(crumb.label) || crumb.label}</span>
                                )}
                                {!isLast && <span>/</span>}
                            </span>
                        );
                    })}
                </nav>
            </div>

            <section className="page-header">
                <div className="container">
                    <div className="page-header-content">
                        {badge && (
                            <span className="page-header-badge">
                                <i className={badge.icon}></i>
                                <span>{badge.label}</span>
                            </span>
                        )}
                        <h1>{title}</h1>
                        {description && <p className="page-header-desc">{description}</p>}
                    </div>
                </div>
            </section>
        </>
    );
}
