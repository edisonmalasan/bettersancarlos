import Link from 'next/link';

interface ServiceEntryProps {
    href: string;
    title: string;
    description?: string;
    /** External destination: rendered as a plain anchor with the usual rel hygiene. */
    external?: boolean;
    /**
     * A provenance or status marker that the adjacent text does not already
     * convey (for example a verified system). Rendered as quiet text, not a
     * decorative pill.
     *
     * Note: this component deliberately has no prop for a fee, cost, or
     * processing time. The civic-data pipeline holds no such field, so any
     * value passed here would be an unsourced civic claim (see
     * `civic-data-surfacing`, "Directory facts are never presented without a
     * canonical source"). Reinstate metadata rendering only once a canonical
     * record can supply it.
     */
    status?: string;
}

/**
 * One service in a directory listing.
 *
 * Presented as a rule-separated row rather than an individually bordered card:
 * a directory of parallel services is a list (civic-composition, "Parallel
 * service data renders as scannable list rows").
 */
export default function ServiceEntry({
    href,
    title,
    description,
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
