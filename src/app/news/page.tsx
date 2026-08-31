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
        switch (badge) {
            case 'success':
                return 'badge badge-success';
            case 'warning':
                return 'badge badge-warning';
            case 'danger':
                return 'badge badge-danger';
            case 'info':
            default:
                return 'badge badge-info';
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

            <section className="section">
                <div className="container">
                    <div className="news-card-grid">
                        {news.length === 0 && (
                            <article className="news-card" aria-label="Loading">
                                <div className="news-card-header">
                                    <span className="badge badge-info">Loading</span>
                                    <span className="news-card-date">...</span>
                                </div>
                                <div className="news-card-body">
                                    <h3 className="news-card-title">Loading news...</h3>
                                    <p className="news-card-desc">Fetching news and updates from San Carlos.</p>
                                </div>
                            </article>
                        )}
                        {news.map((item) => {
                            const body = (
                                <>
                                    <div className="news-card-header">
                                        <span className={badgeClass(item.badge)}>{item.category}</span>
                                        <span className="news-card-date">
                                            <i className="bi bi-calendar-event"></i> {item.date}
                                        </span>
                                    </div>
                                    <div className="news-card-body">
                                        <h3 className="news-card-title">{item.title}</h3>
                                        <p className="news-card-desc">{item.summary}</p>
                                    </div>
                                </>
                            );

                            return item.url ? (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-card news-card-link"
                                >
                                    {body}
                                </a>
                            ) : (
                                <article key={item.id} className="news-card">
                                    {body}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section fb-feed-section" aria-label="Facebook updates">
                <div className="container">
                    <div className="fb-feed-head">
                        <h2>From our Facebook Page</h2>
                        <p>The latest posts published by the Official LGU San Carlos Facebook Page.</p>
                    </div>
                    <div className="fb-feed-embed">
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
                        ></iframe>
                    </div>
                    <p className="fb-feed-fallback">
                        Can&apos;t see the feed?
                        <a
                            href="https://www.facebook.com/sccp.cio"
                            target="_blank"
                            rel="noopener noreferrer"
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
