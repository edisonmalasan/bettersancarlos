import Link from 'next/link';

export interface ServiceEntryMeta {
    /** Short label rendered in bold before the value, e.g. "Office". */
    label: string;
    value: string;
}

interface ServiceEntryProps {
    href: string;
    title: string;
    description?: string;
    /** Office / Fee / Time style facts, rendered as a definition list. */
    meta?: ServiceEntryMeta[];
    /** External destination: rendered as a plain anchor with the usual rel hygiene. */
    external?: boolean;
    /**
     * A provenance or status marker that the adjacent text does not already
     * convey (for example a verified system). Rendered as quiet text, not a
     * decorative pill.
     */
    status?: string;
}

/**
 * One service in a directory listing.
 *
 * Presented as a rule-separated row rather than an individually bordered card:
 * a directory of parallel services is a list, and the Office/Fee/Time facts are
 * exposed as real term/definition pairs so assistive technology announces each
 * fact with its service (civic-composition, "Parallel service data renders as
 * scannable list rows").
 */
export default function ServiceEntry({
    href,
    title,
    description,
    meta,
    external = false,
    status,
}: ServiceEntryProps) {
    const inner = (
        <>
            <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 flex flex-wrap items-baseline gap-2 text-base font-semibold text-foreground group-hover:text-primary">
                    {title}
                    {status && (
                        <span className="text-[0.75rem] font-medium text-muted-foreground">
                            {status}
                        </span>
                    )}
                </h3>
                {description && (
                    <p className="m-0 text-[0.875rem] text-muted-foreground">{description}</p>
                )}
                {meta && meta.length > 0 && (
                    <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem] text-muted-foreground">
                        {meta.map((item) => (
                            <div key={item.label} className="flex gap-1">
                                <dt className="font-semibold text-foreground">{item.label}:</dt>
                                <dd className="m-0">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
            <i
                className={`bi ${external ? 'bi-box-arrow-up-right' : 'bi-arrow-right'} mt-1 shrink-0 text-muted-foreground`}
                aria-hidden="true"
            ></i>
        </>
    );

    const className =
        'group flex items-start gap-4 py-5 text-inherit no-underline transition-colors duration-200 hover:no-underline';

    return (
        <li className="border-b border-line last:border-b-0">
            {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                </a>
            ) : (
                <Link href={href} className={className}>
                    {inner}
                </Link>
            )}
        </li>
    );
}
