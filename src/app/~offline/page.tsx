export default function OfflinePage() {
    return (
        <section className="mx-auto w-full max-w-[1200px] min-[1025px]:max-[1199px]:max-w-[960px] px-6 py-12 text-center max-[767px]:px-4 max-[480px]:px-2" style={{ minHeight: '60vh' }}>
            <h1 className="text-5xl font-bold text-primary">You are offline</h1>
            <p className="mt-3 text-xl font-light">
                Some pages may not be available without an internet connection.
            </p>
            <p className="text-muted-foreground">
                Please check your connection and try again.
            </p>
        </section>
    );
}
