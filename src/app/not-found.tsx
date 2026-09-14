import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-16 max-[1024px]:py-8 max-[767px]:py-6">
      <div className="mx-auto w-full max-w-[640px] px-6 max-[767px]:px-4 max-[480px]:px-3">
        <div className="rounded-xl border border-line bg-white p-8 text-center sm:p-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-[1.5rem] text-primary">
            <i className="bi bi-compass" aria-hidden="true"></i>
          </div>
          <p className="m-0 mb-2 text-[0.8125rem] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
            404 — Page not found
          </p>
          <h1 className="m-0 mb-3 text-[1.5rem] font-bold leading-[1.2] text-foreground">
            This page doesn&apos;t exist
          </h1>
          <p className="m-0 mb-6 text-[0.9375rem] leading-[1.6] text-muted-foreground">
            The page you are looking for may have moved or never existed. Try the services directory, browse the sitemap,
            or search from the homepage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[0.9375rem] font-semibold text-white transition-[background-color] duration-200 hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <i className="bi bi-house-door" aria-hidden="true"></i> Go home
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-[0.9375rem] font-semibold text-foreground transition-[border-color,color] duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <i className="bi bi-grid" aria-hidden="true"></i> Browse services
            </Link>
            <Link
              href="/sitemap"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-[0.9375rem] font-semibold text-foreground transition-[border-color,color] duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <i className="bi bi-diagram-3" aria-hidden="true"></i> Sitemap
            </Link>
          </div>
          <p className="m-0 mt-6 text-[0.8125rem] text-muted-foreground">
            <i className="bi bi-search mr-1" aria-hidden="true"></i>
            Tip: the search bar on the homepage finds services by name.
          </p>
        </div>
      </div>
    </section>
  );
}
