import DirectoryLinkCard from '@/components/DirectoryLinkCard';

/**
 * Points residents to the authoritative source for the requirements, fees and
 * processing times of a service.
 *
 * Directory rows deliberately do not render fee or turnaround values: the civic
 * data pipeline holds no such field, so any figure shown would be an unsourced
 * civic claim (see `civic-data-surfacing`, "Directory facts are never presented
 * without a canonical source"). This pointer is where a resident is sent instead.
 */
export default function CharterPointer() {
    return (
        <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="m-0 mb-2 flex items-center gap-2 text-[1.0625rem] font-semibold text-foreground [&_i]:text-primary">
                <i className="bi bi-journal-text" aria-hidden="true"></i>
                Fees, requirements, and processing times
            </h2>
            <p className="m-0 mb-3 text-[0.9375rem] leading-[1.6] text-muted-foreground">
                This directory does not publish fees or turnaround times, because no verified city
                source for them is recorded yet. The city&apos;s Citizen&apos;s Charter lists the
                requirements, fees, and processing times for each office, and is published on the
                transparency pages.
            </p>
            <DirectoryLinkCard
                href="/budget"
                icon="bi bi-shield-check"
                title="Transparency & Full Disclosure"
                description="Transparency Seal, Citizen's Charter offices, FDP reports, and e-services"
            />
        </div>
    );
}