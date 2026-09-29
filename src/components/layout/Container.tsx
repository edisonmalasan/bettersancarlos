import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

const CONTAINER_BASE =
    'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6';

const SECTION_BASE = 'py-12 max-[1024px]:py-10 max-[767px]:py-8';

type ContainerProps = ComponentPropsWithoutRef<'div'>;

/**
 * The site's single definition of page width and responsive gutters.
 * Pages compose this instead of re-declaring the utility string.
 */
export function Container({ className, ...props }: ContainerProps) {
    return <div className={cn(CONTAINER_BASE, className)} {...props} />;
}

type SectionProps = ComponentPropsWithoutRef<'section'>;

/**
 * The canonical vertical rhythm for page sections. Band-level padding
 * (masthead, hero) deliberately deviates and passes its own className.
 */
export function Section({ className, ...props }: SectionProps) {
    return <section className={cn(SECTION_BASE, className)} {...props} />;
}
