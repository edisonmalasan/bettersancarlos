import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface ServiceEntryMeta {
    label: string;
    value: string;
}

interface ServiceEntryProps {
    href: string;
    title: string;
    description?: string;
    /**
     * Structured metadata (office, fee, processing time) rendered as
     * term/definition pairs so assistive technology associates each value
     * with this entry rather than reading it as loose text.
     */
    meta?: ServiceEntryMeta[];
    className?: string;
}

/**
 * A parallel service entry rendered as a rule-separated list row.
 *
 * Intentionally not a card: entries share one surface and are divided by
 * rules, so a directory of services scans as a list of facts rather than a
 * grid of identical containers. See the `civic-composition` spec.
 */
export default function ServiceEntry({
    href,
    title,
    description,
    meta,
    className,
}: ServiceEntryProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group flex flex-col gap-3 border-b border-line py-5 text-inherit no-underline transition-colors duration-200 last:border-b-0 hover:bg-muted hover:no-underline sm:flex-row sm:items-start sm:gap-6',
                className,
            )}
        >
            <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[1rem] font-semibold text-foreground group-hover:text-primary">
                    {title}
                </h3>
                {description && (
                    <p className="m-0 text-[0.875rem] text-muted-foreground">{description}</p>
                )}
            </div>

            {meta && meta.length > 0 && (
                <dl className="m-0 grid shrink-0 grid-cols-2 gap-x-6 gap-y-1 sm:w-[320px] sm:grid-cols-1">
                    {meta.map((item) => (
                        <div key={item.label} className="flex flex-wrap items-baseline gap-x-2">
                            <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                                {item.label}
                            </dt>
                            <dd className="m-0 text-[0.875rem] text-foreground">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </Link>
    );
}
