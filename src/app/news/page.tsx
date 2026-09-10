'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    badge: string;
    summary: string;
    url: string | null;
    recency?: string;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/news.json')
            .then((res) => res.json())
            .then((data) => setNews(data.news || []))
            .catch(() => setNews([]))
            .finally(() => setLoading(false));
    }, []);

    const current = news.filter((n) => n.recency !== 'historical');
    const historical = news.filter((n) => n.recency === 'historical');

    const badgeClass = (badge: string) => {
        const base = 'inline-block rounded px-2 py-1 text-xs font-semibold uppercase';
        switch (badge) {
            case 'success':
                return `${base} bg-[#e6f4ea] text-success`;
            case 'warning':
                return `${base} bg-[#fff4e5] text-accent`;
            case 'danger':
                return `${base} bg-[#fee2e2] text-[#dc2626]`;
            case 'info':
            default:
                return `${base} bg-[#e8f0fe] text-info`;
        }
    };

    const cardCls =
        'flex flex-col overflow-hidden rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)] focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2';

    return (
        <>
            <PageHeader
                title="News & Updates"
                description="Stay informed about the latest happenings in San Carlos"
                badge={{ icon: 'bi bi-newspaper', label: 'News' }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'News' },
                ]}
            />

            <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    {!loading && current.length > 0 && (
                        <h2 className="mb-6 flex items-center gap-2 text-[1.25rem] font-bold text-foreground">
                            <i className="bi bi-broadcast text-primary"></i> Current Updates
                        </h2>
                    )}
                    <div className="grid grid-cols-3 gap-6 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
                        {loading && (
                            <div
                                className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6 animate-pulse"
                                aria-busy="true"
                                aria-label="Loading news"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-5 w-16 rounded bg-line-soft"></div>
                                    <div className="h-4 w-20 rounded bg-line-soft"></div>
                                </div>
                                <div className="flex flex-1 flex-col gap-2.5">
                                    <div className="h-4 w-3/4 rounded bg-line-soft"></div>
                                    <div className="h-4 w-1/2 rounded bg-line-soft"></div>
                                    <div className="mt-2 h-3 w-full rounded bg-line-soft"></div>
                                    <div className="h-3 w-5/6 rounded bg-line-soft"></div>
                                    <div className="h-3 w-2/3 rounded bg-line-soft"></div>
                                </div>
                            </div>
                        )}
                        {!loading && news.length === 0 && (
                            <p className="col-span-full m-0 text-center text-muted-foreground">
                                No news available right now. Check back soon.
                            </p>
                        )}
                        {current.map((item) => {
                            const body = (
                                <>
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className={badgeClass(item.badge)}>{item.category}</span>
                                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                                            <i className="bi bi-calendar-event"></i> {item.date}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <h3 className="m-0 mb-2 text-base font-semibold leading-[1.35] text-foreground">{item.title}</h3>
                                        <p className="m-0 flex-1 overflow-hidden text-[0.8125rem] leading-[1.55] text-muted-foreground line-clamp-3 max-[480px]:line-clamp-2">{item.summary}</p>
                                    </div>
                                </>
                            );

                            return item.url ? (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cardCls}
                                >
                                    {body}
                                </a>
                            ) : (
                                <article key={item.id} className={cardCls}>
                                    {body}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {historical.length > 0 && (
                <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                    <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="m-0 flex items-center gap-2 text-[1.25rem] font-bold text-foreground">
                                <i className="bi bi-archive text-primary"></i> Historical Archive
                            </h2>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(232,153,10,0.08)] px-2.5 py-1 text-[0.75rem] font-semibold text-[#8a5a00]">
                                <i className="bi bi-clock-history"></i> Past events (2016-2023) kept for context
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
                            {historical.map((item) => {
                                const body = (
                                    <>
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className={badgeClass(item.badge)}>{item.category}</span>
                                            <span className="whitespace-nowrap text-xs text-muted-foreground">
                                                <i className="bi bi-calendar-event"></i> {item.date}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <h3 className="m-0 mb-2 text-base font-semibold leading-[1.35] text-foreground">{item.title}</h3>
                                            <p className="m-0 flex-1 overflow-hidden text-[0.8125rem] leading-[1.55] text-muted-foreground line-clamp-3 max-[480px]:line-clamp-2">{item.summary}</p>
                                        </div>
                                    </>
                                );

                                return item.url ? (
                                    <a
                                        key={item.id}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cardCls}
                                    >
                                        {body}
                                    </a>
                                ) : (
                                    <article key={item.id} className={cardCls}>
                                        {body}
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-muted py-16 max-[1024px]:py-8 max-[767px]:py-6">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-6 text-center">
                        <h2 className="m-0 mb-1.5">From our Facebook Page</h2>
                        <p className="m-0 text-muted-foreground">The latest posts published by the Official LGU San Carlos Facebook Page.</p>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <p className="m-0 max-w-[600px] text-center text-sm leading-[1.6] text-muted-foreground">
                            Follow the official page for real-time advisories, announcements, and community updates.
                        </p>
                        <a
                            href="https://www.facebook.com/sccp.cio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-[box-shadow,transform,background-color] duration-200 hover:bg-primary-dark hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.3)] active:scale-[0.97]"
                        >
                            <i className="bi bi-facebook" aria-hidden="true"></i>
                            Visit the Official LGU San Carlos Facebook Page
                            <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
