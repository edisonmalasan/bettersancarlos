export default function OfflinePage() {
    return (
        <section className="container py-5 text-center" style={{ minHeight: '60vh' }}>
            <h1 className="display-5 fw-bold text-primary">You are offline</h1>
            <p className="lead mt-3">
                Some pages may not be available without an internet connection.
            </p>
            <p className="text-muted">
                Please check your connection and try again.
            </p>
        </section>
    );
}
