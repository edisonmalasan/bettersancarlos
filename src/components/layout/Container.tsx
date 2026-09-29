import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

/** The site's single definition of page width and responsive gutters. */
export const containerClass =
    'mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6';

/** The canonical vertical rhythm for page sections. Band padding deviates explicitly. */
export const sectionClass = 'py-12 max-[1024px]:py-10 max-[767px]:py-8';

type ContainerProps = ComponentPropsWithoutRef<'div'>;

/**
 * Page-width wrapper. Prefer this over inlining `containerClass`; the
 * constant is exported for cases where an existing element already carries
 * the container classes and swapping the element would be pure churn.
 */
export function Container({ className, ...props }: ContainerProps) {
    return <div className={cn(containerClass, className)} {...props} />;
}

type SectionProps = ComponentPropsWithoutRef<'section'>;

/** Canonical section rhythm. Band-level padding passes its own `className`. */
export function Section({ className, ...props }: SectionProps) {
    return <section className={cn(sectionClass, className)} {...props} />;
}
