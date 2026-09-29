'use client';

import PageHeader from '@/components/layout/PageHeader';
import ServiceEntry from '@/components/ServiceEntry';
import { Section, Container } from '@/components/layout/Container';

const CATEGORIES = [
  {
    slug: 'agriculture',
    title: 'Agriculture & Economic Development',
    description: 'Support for farmers and agricultural development.',
  },
  {
    slug: 'business',
    title: 'Business, Trade & Investment',
    description: 'Permits, licenses, and support for businesses in San Carlos.',
  },
  {
    slug: 'certificates',
    title: 'Certificates & Vital Records',
    description: 'Official documents for birth, death, marriage, and other vital records.',
  },
  {
    slug: 'education',
    title: 'Education & Scholarship',
    description: 'Scholarship programs and educational assistance.',
  },
  {
    slug: 'environment',
    title: 'Environment & Natural Resources',
    description: 'Waste management and environmental protection.',
  },
  {
    slug: 'infrastructure',
    title: 'Infrastructure & Public Works',
    description: 'Building permits, construction, and engineering services.',
  },
  {
    slug: 'public-safety',
    title: 'Public Safety & Security',
    description: 'Emergency response and disaster preparedness.',
  },
  {
    slug: 'social-services',
    title: 'Social Services & Assistance',
    description: 'Support programs for vulnerable sectors and communities.',
  },
  {
    slug: 'tax-payments',
    title: 'Taxation & Payments',
    description: 'Property tax, fees, and payment services.',
  },
];

export default function ServicesDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Municipal Services Directory"
        description="Browse all services offered by the City of San Carlos."
        badge={{ icon: 'bi bi-grid-fill', label: 'Services' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
      />
      <Section>
        <Container>
          <div className="border-t border-line">
            {CATEGORIES.map((c) => (
              <ServiceEntry
                key={c.slug}
                href={`/services/${c.slug}`}
                title={c.title}
                description={c.description}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
