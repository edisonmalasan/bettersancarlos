import fs from 'node:fs';
import path from 'node:path';

const legacyRoot = '/Users/edison/Documents/Projects/bettersancarlos';
const appRoot = path.join(legacyRoot, 'react-app', 'src', 'app');
const servicesJson = JSON.parse(
  fs.readFileSync(path.join(legacyRoot, 'data', 'services.json'), 'utf8')
);

const categoryPages = [
  {
    slug: 'agriculture',
    title: 'Agriculture Services',
    badgeIcon: 'bi bi-tree-fill',
    badgeLabel: 'Agriculture',
    desc: 'Support for farmers and agricultural development.',
    category: 'Agriculture & Economic Development',
  },
  {
    slug: 'business',
    title: 'Business Services',
    badgeIcon: 'bi bi-shop',
    badgeLabel: 'Business',
    desc: 'Permits, licenses, and support for businesses in San Carlos.',
    category: 'Business, Trade & Investment',
  },
  {
    slug: 'certificates',
    title: 'Certificates & Vital Records',
    badgeIcon: 'bi bi-file-earmark-text-fill',
    badgeLabel: 'Certificates',
    desc: 'Official documents for birth, death, marriage, and other vital records.',
    category: 'Certificates & Vital Records',
  },
  {
    slug: 'education',
    title: 'Education Services',
    badgeIcon: 'bi bi-mortarboard-fill',
    badgeLabel: 'Education',
    desc: 'Scholarship programs and educational assistance.',
    category: 'Education & Scholarship',
  },
  {
    slug: 'environment',
    title: 'Environment Services',
    badgeIcon: 'bi bi-globe-americas',
    badgeLabel: 'Environment',
    desc: 'Waste management and environmental protection.',
    category: 'Environment & Natural Resources',
  },
  {
    slug: 'health',
    title: 'Health Services',
    badgeIcon: 'bi bi-heart-pulse-fill',
    badgeLabel: 'Health',
    desc: 'Medical consultations, vaccinations, and health programs.',
    category: 'Health & Wellness',
    skip: true,
  },
  {
    slug: 'infrastructure',
    title: 'Infrastructure Services',
    badgeIcon: 'bi bi-building-fill-gear',
    badgeLabel: 'Infrastructure',
    desc: 'Building permits, construction, and engineering services.',
    category: 'Infrastructure & Public Works',
  },
  {
    slug: 'public-safety',
    title: 'Public Safety Services',
    badgeIcon: 'bi bi-shield-fill-check',
    badgeLabel: 'Public Safety',
    desc: 'Emergency response and disaster preparedness.',
    category: 'Public Safety & Security',
  },
  {
    slug: 'social-services',
    title: 'Social Services',
    badgeIcon: 'bi bi-people-fill',
    badgeLabel: 'Social Services',
    desc: 'Support programs for vulnerable sectors and communities.',
    category: 'Social Services & Assistance',
  },
  {
    slug: 'tax-payments',
    title: 'Tax & Payments',
    badgeIcon: 'bi bi-cash-coin',
    badgeLabel: 'Taxation',
    desc: 'Property tax, fees, and payment services.',
    category: 'Taxation & Payments',
  },
];

const categoriesDir = path.join(legacyRoot, 'services');
const detailsDir = path.join(legacyRoot, 'service-details');

function toJsx(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/'/g, "\\'")
    .trim();
}

function jsxString(str) {
  if (!str) return '';
  return str.replace(/"/g, '\\"').replace(/'/g, "\\'");
}

function linkHref(href) {
  if (!href) return '#';
  if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return href;
  href = href
    .replace(/^\.\.\/services\//, '/services/')
    .replace(/^\.\.\/service-details\//, '/service-details/')
    .replace(/^\.\.\//, '/')
    .replace(/\.html$/, '');
  if (!href.startsWith('/') && !href.startsWith('#'))
    href = '/service-details/' + href.replace(/\.html$/, '');
  return href;
}

function extractBodyContent(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const bodyMatch = html.match(/<main id="main-content">([\s\S]*?)<\/main>/);
  if (!bodyMatch) return { title: '', desc: '', badge: null, sections: [] };
  const body = bodyMatch[1];
  const h1Match = body.match(/<h1[^>]*>(?:<[^>]+>)*([^<]+)<\/[^>]*>/);
  const descMatch = body.match(/<p class="page-header-desc"[^>]*>(?:<[^>]+>)*([^<]+)<\/[^>]*>/);
  const badgeMatch = body.match(
    /<span class="page-header-badge"[^>]*>(?:<[^>]+>)*(?:<span[^>]*>([^<]+)<\/span>)?/
  );
  return {
    title: (h1Match?.[1] || '').trim(),
    desc: (descMatch?.[1] || '').trim(),
    badge: badgeMatch?.[1]?.trim(),
  };
}

function categoryServices(categoryId) {
  return servicesJson.services.filter((s) => s.categoryId === categoryId);
}

function detailServices() {
  return servicesJson.services.filter((s) => {
    const u = s.url || '';
    return u.includes('/service-details/') || u.includes('../service-details/');
  });
}

const pageHeaderImport = "import PageHeader from '@/components/layout/PageHeader';\n";

function writeCategoryPage(cfg) {
  const dir = path.join(appRoot, 'services', cfg.slug);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'page.tsx');
  if (cfg.skip && fs.existsSync(file)) return;
  const services = categoryServices(cfg.slug);
  const officeServices = services.filter((s) => {
    const u = s.url || '';
    return (
      u.includes('service-details') ||
      (!u.includes('http') && (s.office || '').toLowerCase().includes('office'))
    );
  });
  const regularServices = services.filter((s) => !officeServices.includes(s));

  const jsx = [];
  if (regularServices.length) {
    jsx.push(
      `      <section className="section">\n        <div className="container">\n          <div className="grid grid-3">`
    );
    for (const s of regularServices) {
      jsx.push(
        `            <${s.url && !s.url.startsWith('http') ? `Link href="${linkHref(s.url)}" className="service-item-card service-item-link"` : `div className="service-item-card"`}>`
      );
      jsx.push(`              <h3 className="service-item-title">`);
      jsx.push(`                <i className="bi bi-file-earmark-text"></i>`);
      jsx.push(`                <span>${toJsx(s.title)}</span>`);
      jsx.push(`              </h3>`);
      jsx.push(`              <p className="service-item-desc">${toJsx(s.description)}</p>`);
      jsx.push(`              <div className="service-item-meta">`);
      jsx.push(`                <span><strong>Fee:</strong> ${toJsx(s.fee)}</span>`);
      jsx.push(`                <span><strong>Time:</strong> ${toJsx(s.processingTime)}</span>`);
      jsx.push(`              </div>`);
      jsx.push(`            </${s.url && !s.url.startsWith('http') ? 'Link' : 'div'}>`);
    }
    jsx.push(`          </div>\n        </div>\n      </section>`);
  }

  const content = `'use client';

import Link from 'next/link';
${pageHeaderImport}

export default function ${cfg.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())}Page() {
  return (
    <>
      <PageHeader
        title="${jsxString(cfg.title)}"
        description="${jsxString(cfg.desc)}"
        badge={{ icon: '${cfg.badgeIcon}', label: '${jsxString(cfg.badgeLabel)}' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: '${jsxString(cfg.title)}' },
        ]}
      />
${jsx.join('\n')}
    </>
  );
}
`;
  fs.writeFileSync(file, content);
}

function writeDirectoryPage() {
  const dir = path.join(appRoot, 'services');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'page.tsx');
  const cats = categoryPages.filter((c) => !c.skip);
  const content = `'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function ServicesDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Municipal Services Directory"
        description="Browse all services offered by the Municipality of San Carlos."
        badge={{ icon: 'bi bi-grid-fill', label: 'Services' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            ${cats
              .map(
                (c) => `
            <Link href="/services/${c.slug}" className="service-item-card service-item-link">
              <h3 className="service-item-title">
                <i className="${c.badgeIcon}"></i>
                <span>${jsxString(c.category)}</span>
              </h3>
              <p className="service-item-desc">${jsxString(c.desc)}</p>
              <div className="service-item-meta">
                <span><i className="bi bi-arrow-right"></i> View services</span>
              </div>
            </Link>
            `
              )
              .join('')
              .trim()}
          </div>
        </div>
      </section>
    </>
  );
}
`;
  fs.writeFileSync(file, content);
}

function writeDetailPage(fileName) {
  const slug = fileName.replace(/\.html$/, '');
  const filePath = path.join(detailsDir, fileName);
  const html = fs.readFileSync(filePath, 'utf8');
  const bodyMatch = html.match(/<main id="main-content">([\s\S]*?)<\/main>/);
  if (!bodyMatch) return;
  const body = bodyMatch[1];
  const h1 = (
    body.match(/<h1[^>]*>(?:<[^>]+>)*([^<]+)<\/[^>]*>/)?.[1] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  ).trim();
  const desc = (
    body.match(/<p class="page-header-desc"[^>]*>(?:<[^>]+>)*([^<]+)<\/[^>]*>/)?.[1] || ''
  ).trim();
  const badgeLabel =
    (
      body.match(
        /<span class="page-header-badge"[^>]*>(?:<[^>]+>)*(?:<span[^>]*>([^<]+)<\/span>)?/
      )?.[1] || ''
    ).trim() || 'Service';
  const serviceMeta = servicesJson.services.find((s) => s.id === slug) || {};
  const categoryId = serviceMeta.categoryId || 'services';
  const categoryTitle = serviceMeta.category || 'Services';
  const categorySlug = categoryId;

  // Build a simplified content section by extracting section headers and plain paragraphs
  const sections = [];
  const sectionRegex =
    /<section[^>]*class="[^"]*(?:bpl|bc|service|office|program|contact|req|faq|process|quick|steps|info|related|staff|fees|about|documents)[^"]*"[^>]*>([\s\S]*?)<\/section>/g;
  let m;
  while ((m = sectionRegex.exec(body)) !== null) {
    const sec = m[1];
    const header = (sec.match(/<h2[^>]*>(?:<[^>]+>)*([^<]+)<\/[^>]*>/)?.[1] || '').trim();
    if (!header) continue;
    const paras = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let pm;
    while ((pm = pRegex.exec(sec)) !== null) {
      const text = stripTags(pm[1]).trim();
      if (text) paras.push(text);
    }
    sections.push({ header, paras });
  }

  const content = `'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export default function ${slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())}Page() {
  return (
    <>
      <PageHeader
        title="${jsxString(h1)}"
        description="${jsxString(desc) || jsxString(serviceMeta.description) || ''}"
        badge={{ icon: 'bi bi-info-circle', label: '${jsxString(badgeLabel)}' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          ${categorySlug !== 'services' ? `{ label: '${jsxString(categoryTitle)}', href: '/services/${categorySlug}' },` : ''}
          { label: '${jsxString(h1)}' },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="service-detail-content">
            <p className="lead">${jsxString(serviceMeta.description) || jsxString(desc) || 'Service details for ' + jsxString(h1)}.</p>
            ${sections
              .map((s) =>
                s.paras.length
                  ? `
            <h2>${s.header}</h2>
            ${s.paras.map((p) => `<p>${jsxString(p)}</p>`).join('\n            ')}`
                  : ''
              )
              .join('')}
            <div className="service-item-meta" style={{ marginTop: '1.5rem' }}>
              <span><strong>Office:</strong> ${serviceMeta.office || 'Municipal Office'}</span>
              <span><strong>Fee:</strong> ${serviceMeta.fee || 'Varies'}</span>
              <span><strong>Processing:</strong> ${serviceMeta.processingTime || 'Varies'}</span>
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href="/services/${categorySlug}" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Back to ${jsxString(categoryTitle)}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
`;
  const dir = path.join(appRoot, 'service-details', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Run
for (const cfg of categoryPages) writeCategoryPage(cfg);
writeDirectoryPage();
for (const f of fs.readdirSync(detailsDir).filter((f) => f.endsWith('.html'))) writeDetailPage(f);

console.log('Generated service pages');
