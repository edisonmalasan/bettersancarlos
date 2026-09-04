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
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        fetch('/data/news.json')
            .then((res) => res.json())
            .then((data) => setNews(data.news || []))
            .catch(() => setNews([]));
    }, []);

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
                    <div className="grid grid-cols-3 gap-6 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
                        {news.length === 0 && (
                            <article className="flex flex-col overflow-hidden rounded-lg border border-muted bg-white transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2" aria-label="Loading">
                                <div className="flex items-center justify-between px-4 pt-3">
                                    <span className="inline-block rounded bg-[#e8f0fe] px-2 py-1 text-xs font-semibold uppercase text-info">Loading</span>
                                    <span className="whitespace-nowrap text-xs text-muted-foreground">...</span>
                                </div>
                                <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                                    <h3 className="m-0 mb-2 text-base font-semibold leading-[1.35] text-foreground">Loading news...</h3>
                                    <p className="m-0 flex-1 text-[0.8125rem] leading-[1.55] text-muted-foreground">Fetching news and updates from San Carlos.</p>
                                </div>
                            </article>
                        )}
                        {news.map((item) => {
                            const body = (
                                <>
                                    <div className="flex items-center justify-between px-4 pt-3">
                                        <span className={badgeClass(item.badge)}>{item.category}</span>
                                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                                            <i className="bi bi-calendar-event"></i> {item.date}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
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
                                    className="flex flex-col overflow-hidden rounded-lg border border-muted bg-white transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2"
                                >
                                    {body}
                                </a>
                            ) : (
                                <article key={item.id} className="flex flex-col overflow-hidden rounded-lg border border-muted bg-white transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2">
                                    {body}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#f8fafc] py-16 max-[1024px]:py-8 max-[767px]:py-6" aria-label="Facebook updates">
                <div className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 max-[767px]:px-4 max-[480px]:px-2">
                    <div className="mb-6 text-center">
                        <h2 className="m-0 mb-1.5">From our Facebook Page</h2>
                        <p className="m-0 text-muted-foreground">The latest posts published by the Official LGU San Carlos Facebook Page.</p>
                    </div>
                    <div className="flex justify-center">
                        <iframe
                            title="Latest posts from the Official LGU San Carlos Facebook Page"
                            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FOfficialLGUSolano&tabs=timeline&width=500&height=720&small_header=false&adapt_container_width=true&hide_cover=false&show_facecount=true"
                            width="500"
                            height="720"
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            loading="lazy"
                            allow="encrypted-media; clipboard-write; web-share"
                            className="w-[500px] max-w-full overflow-hidden rounded-xl border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                        ></iframe>
                    </div>
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Can&apos;t see the feed?
                        <a
                            href="https://www.facebook.com/sccp.cio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary no-underline hover:underline"
                        >
                            Visit the Official LGU San Carlos Facebook Page
                            <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                        </a>
                    </p>
                </div>
            </section>
        </>
    );
}
