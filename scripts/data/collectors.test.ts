import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { fetchText } from './lib/fetch';
import { parseJsonEvidence } from './parsers/json';
import { extractPhones, htmlToText } from './parsers/html';
import { collectCityWebsite } from './collectors/city-website';
import { collectFacebook } from './collectors/facebook';
import {
  collectPsaPhilatlas,
  normalizeBarangayName,
  parsePsaPhilatlas,
  PSA_COVERAGE,
} from './collectors/psa-philatlas';
import {
  CENPELCO_COVERAGE,
  collectCenpelco,
  parseCenpelco,
  SAN_CARLOS_MAIN_OFFICE,
} from './collectors/cenpelco';
import { resolveCollector } from './collectors/index';
import type { RegistryEntry } from './lib/civic';

const FB_FIXTURE = JSON.stringify({
  data: [
    {
      id: '123_456',
      message: 'Power interruption advisory for Barangay Talang tomorrow',
      created_time: '2026-09-10T08:30:00+0000',
      permalink_url: 'https://www.facebook.com/post/1',
    },
    {
      id: '123_789',
      message: 'Join us for the Mango-Bamboo Festival opening parade!',
      created_time: '2026-09-09T08:30:00+0000',
      permalink_url: 'https://www.facebook.com/post/2',
    },
  ],
});

const SITE_FIXTURE = `<html><body><div class="contact">City Hall trunk line: (075) 600-1432. Office hours apply.</div></body></html>`;
const SITE_CHANGED_FIXTURE = `<html><body><div class="contact">City Hall trunk line: (075) 600-9999. Office hours apply.</div></body></html>`;

function fbRegistry(): RegistryEntry {
  return {
    id: 'lgu-facebook-cio',
    publisher: 'City Information Office',
    url: 'https://www.facebook.com/sccp.cio',
    sourceType: 'facebook-page',
    collector: 'facebook',
    updateCadence: 'weekly',
    evidenceRef: 'research/evidence.md',
    domains: ['news'],
  };
}

function siteRegistry(): RegistryEntry {
  return {
    id: 'lgu-website',
    publisher: 'City Government of San Carlos',
    url: 'https://example.test/',
    sourceType: 'website',
    collector: 'city-website',
    updateCadence: 'quarterly',
    evidenceRef: 'research/evidence.md',
    domains: ['emergency'],
  };
}

function fbArgs(evidenceText: string = FB_FIXTURE) {
  return {
    registryId: 'lgu-facebook-cio',
    registry: fbRegistry(),
    evidenceName: 'graph-fixture.json',
    evidenceText,
    runId: '2026-09-14',
    collectedBy: 'fixture-agent',
  };
}

function siteArgs(evidenceText: string = SITE_FIXTURE) {
  return {
    registryId: 'lgu-website',
    registry: siteRegistry(),
    evidenceName: 'contact-fixture.html',
    evidenceText,
    runId: '2026-09-14',
    collectedBy: 'fixture-agent',
  };
}

test('facebook collector is deterministic and provisional', () => {
  const first = collectFacebook(fbArgs());
  const second = collectFacebook(fbArgs());
  assert.deepEqual(first, second);
  assert.equal(first.candidates.length, 2);
  assert.equal(first.candidates[0].id, 'news-fb-123-456');
  assert.equal(first.candidates[0].domain, 'news');
  for (const candidate of first.candidates) {
    assert.equal(candidate.status, 'provisional');
    assert.equal(candidate.runId, '2026-09-14');
    assert.deepEqual(candidate.sourceIds, ['lgu-facebook-cio']);
  }
  assert.equal(first.candidates[0].data.category, 'Advisory');
  assert.equal(first.candidates[1].data.category, 'Event');
  assert.deepEqual(first.coverage, { expectedRecordIds: ['news-fb-123-456', 'news-fb-123-789'] });
});

test('facebook collector emits one exact instance linked from every candidate', () => {
  const result = collectFacebook(fbArgs());
  assert.equal(result.sourceInstances.length, 1);
  const [instance] = result.sourceInstances;
  assert.match(instance.id, /^src-lgu-facebook-cio-2026-09-14-[0-9a-f]{8}$/);
  assert.equal(instance.registryId, 'lgu-facebook-cio');
  assert.equal(instance.runId, '2026-09-14');
  assert.equal(instance.collectedBy, 'fixture-agent');
  assert.match(instance.sha256 ?? '', /^[0-9a-f]{64}$/);
  for (const candidate of result.candidates) {
    assert.deepEqual(candidate.sourceInstanceIds, [instance.id]);
  }
});

test('facebook collector rejects a non-envelope fixture', () => {
  assert.throws(() => collectFacebook(fbArgs('{"nope": true}')), /parse: expected a Graph envelope/);
  assert.throws(() => collectFacebook(fbArgs('not json')), /parse: invalid JSON/);
});

test('city-website collector observes the trunk line deterministically', () => {
  const first = collectCityWebsite(siteArgs());
  const second = collectCityWebsite(siteArgs());
  assert.deepEqual(first, second);
  assert.equal(first.candidates.length, 1);
  assert.equal(first.candidates[0].id, 'city-hall-trunk-line');
  assert.equal(first.candidates[0].data.number, '(075) 600-1432');
  assert.equal(first.candidates[0].status, 'provisional');
  assert.equal(first.sourceInstances.length, 1);
  assert.match(first.sourceInstances[0].id, /^src-lgu-website-2026-09-14-[0-9a-f]{8}$/);
  assert.deepEqual(first.candidates[0].sourceInstanceIds, [first.sourceInstances[0].id]);
  assert.deepEqual(first.coverage, { expectedRecordIds: ['city-hall-trunk-line'] });
});

test('city-website collector surfaces a changed number as a new candidate value', () => {
  const changed = collectCityWebsite(siteArgs(SITE_CHANGED_FIXTURE));
  assert.equal(changed.candidates[0].data.number, '(075) 600-9999');
});

test('city-website collector emits nothing when the line is absent', () => {
  const result = collectCityWebsite(siteArgs('<html><body><p>No contacts here.</p></body></html>'));
  assert.deepEqual(result.candidates, []);
  assert.ok(result.notes.some((n) => n.includes('city-hall-trunk-line not observed')));
  assert.deepEqual(result.coverage, { expectedRecordIds: ['city-hall-trunk-line'] });
});

test('resolveCollector refuses unknown or null collectors', () => {
  assert.equal(typeof resolveCollector('facebook'), 'function');
  assert.equal(typeof resolveCollector('city-website'), 'function');
  assert.equal(typeof resolveCollector('psa-philatlas'), 'function');
  assert.equal(typeof resolveCollector('cenpelco'), 'function');
  assert.equal(resolveCollector('universal-scraper'), null);
  assert.equal(resolveCollector(null), null);
});

test('parsers: html text extraction and phone observation', () => {
  const text = htmlToText('<html><head><style>x{}</style></head><body><p>Call (075) 600-1432</p></body></html>', 't.html');
  assert.ok(!text.includes('x{}'));
  const phones = extractPhones(text);
  assert.equal(phones.length, 1);
  assert.equal(phones[0].number, '(075) 600-1432');
  assert.throws(() => parseJsonEvidence('', 'empty.json'), /parse: empty evidence/);
});

test('fetchText fetches from a local server and refuses dead endpoints fast', async () => {
  let seenAgent = '';
  const server = http.createServer((req, res) => {
    seenAgent = String(req.headers['user-agent'] ?? '');
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<p>fixture</p>');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no local address');
    const body = await fetchText(`http://127.0.0.1:${address.port}/page`);
    assert.equal(body, '<p>fixture</p>');
    assert.ok(seenAgent.includes('BetterSanCarlos-CivicRefresh'), `unexpected UA: ${seenAgent}`);
  } finally {
    server.close();
  }
  await assert.rejects(fetchText('http://127.0.0.1:9/unreachable', { retries: 0, timeoutMs: 2000 }), /fetch: /);
});

// ---- psa-philatlas collector (PSA census figures via PhilAtlas) ----

const PSA_FIXTURE = fileURLToPath(
  new URL('./fixtures/psa-philatlas-san-carlos-2026-09-16.html', import.meta.url),
);

function psaHtml(): string {
  return fs.readFileSync(PSA_FIXTURE, 'utf8');
}

function psaRegistry(): RegistryEntry {
  return {
    id: 'psa-census-philatlas',
    publisher: 'Philippine Statistics Authority (via PhilAtlas)',
    url: 'https://www.philatlas.com/luzon/r01/pangasinan/san-carlos.html',
    sourceType: 'portal',
    collector: 'psa-philatlas',
    updateCadence: 'per-document',
    evidenceRef: 'research/demographics/26-09-demographics.md',
    domains: ['demographics', 'barangays'],
  };
}

function psaArgs(evidenceText?: string) {
  return {
    registryId: 'psa-census-philatlas',
    registry: psaRegistry(),
    evidenceName: 'psa-census-philatlas.html',
    evidenceText: evidenceText ?? psaHtml(),
    runId: '2026-09-16',
    collectedBy: 'fixture-agent',
  };
}

/** Replace all occurrences, asserting the anchor exists (guards silently stale variants). */
function swapAll(html: string, from: string, to: string, minExpected = 1): string {
  const count = html.split(from).length - 1;
  assert.ok(count >= minExpected, `expected ${minExpected}+ occurrence(s) of ${from}, found ${count}`);
  return html.split(from).join(to);
}

test('psa-philatlas parses the current fixture with exact canonical values', () => {
  const obs = parsePsaPhilatlas(psaHtml(), 'psa-census-philatlas.html');
  assert.equal(obs.total2020, 205424);
  assert.equal(obs.history.length, 15);
  assert.deepEqual(obs.history[0], { year: 1903, population: 27166 });
  assert.deepEqual(obs.history[obs.history.length - 1], { year: 2020, population: 205424 });
  assert.deepEqual(obs.households2015, { count: 42049, year: 2015, averageSize: 4.48 });
  assert.equal(obs.barangays.length, 86);
  assert.deepEqual(obs.barangays[0], { name: 'Abanon', population2020: 1974, population2015: 1877 });
  assert.deepEqual(obs.barangays[obs.barangays.length - 1], {
    name: 'Turac',
    population2020: 6919,
    population2015: 5702,
  });
  assert.equal(
    obs.barangays.reduce((n, b) => n + b.population2020, 0),
    205424,
  );
  assert.equal(
    obs.barangays.reduce((n, b) => n + b.population2015, 0),
    188571,
  );
});

test('psa-philatlas collector is deterministic, provisional, and exactly linked', () => {
  const first = collectPsaPhilatlas(psaArgs());
  const second = collectPsaPhilatlas(psaArgs());
  assert.deepEqual(first, second);
  assert.equal(first.candidates.length, 4);
  assert.deepEqual(
    first.candidates.map((c) => c.id).sort(),
    [...PSA_COVERAGE].sort(),
  );
  assert.equal(first.sourceInstances.length, 1);
  const [instance] = first.sourceInstances;
  assert.match(instance.id, /^src-psa-census-philatlas-2026-09-16-[0-9a-f]{8}$/);
  assert.equal(instance.registryId, 'psa-census-philatlas');
  assert.equal(instance.documentType, 'webpage');
  assert.ok(instance.publisher.includes('via PhilAtlas'), 'provenance stays honestly PSA-via-PhilAtlas');
  for (const candidate of first.candidates) {
    assert.equal(candidate.status, 'provisional');
    assert.ok(!('acceptedBy' in candidate), `${candidate.id} must not carry reviewer fields`);
    assert.ok(!('acceptedAt' in candidate), `${candidate.id} must not carry reviewer fields`);
    assert.deepEqual(candidate.sourceIds, ['psa-census-philatlas']);
    assert.deepEqual(candidate.sourceInstanceIds, [instance.id]);
    assert.ok(candidate.claimSources && Object.keys(candidate.claimSources).length > 0);
  }
  assert.deepEqual(first.coverage, {
    expectedRecordIds: [...PSA_COVERAGE],
  });
});

test('psa-philatlas emits source-verbatim barangay names without fuzzy mapping', () => {
  const { candidates } = collectPsaPhilatlas(psaArgs());
  const names = (
    candidates.find((c) => c.id === 'demographics-barangay-populations')?.data as {
      barangays: Array<{ name: string }>;
    }
  ).barangays.map((b) => b.name);
  for (const verbatim of [
    'Bugallon-Posadas Street',
    'Burgos Padlan',
    'M. Soriano',
    'Rizal',
    'Nilentap',
    'Malacañang',
  ]) {
    assert.ok(names.includes(verbatim), `source name preserved verbatim: ${verbatim}`);
  }
  assert.ok(!names.includes('Rizal Avenue'), 'LGUs long form must not be substituted in');
  assert.ok(!names.includes('Nelintap'), 'canonical spelling must not be substituted in');
  const malacanang = names.find((n) => n.startsWith('Malaca')) ?? '';
  assert.ok(malacanang.includes('ñ'), 'real ñ (U+00F1), never an escape sequence');
  assert.ok(!malacanang.includes('\\'), 'no literal backslash escapes in names');
});

test('psa-philatlas values flow from evidence, not hardcoded constants', () => {
  let html = psaHtml();
  html = swapAll(html, '205,424', '205,425', 4);
  html = swapAll(html, '188,571', '188,572', 3);
  // Keep parts consistent with the new totals (one row each).
  html = swapAll(
    html,
    '>Abanon</a></th><td>0.96%</td><td>1,974</td><td>1,877</td>',
    '>Abanon</a></th><td>0.96%</td><td>1,975</td><td>1,878</td>',
  );
  const obs = parsePsaPhilatlas(html, 'psa-shifted.html');
  assert.equal(obs.total2020, 205425);
  assert.deepEqual(obs.history[obs.history.length - 1], { year: 2020, population: 205425 });
  assert.equal(
    obs.barangays.reduce((n, b) => n + b.population2020, 0),
    205425,
  );
  assert.equal(
    obs.barangays.reduce((n, b) => n + b.population2015, 0),
    188572,
  );
});

test('psa-philatlas fails closed on layout drift, duplicates, and malformed values', () => {
  const html = psaHtml();
  assert.throws(() => parsePsaPhilatlas('', 'empty.html'), /parse: empty evidence/);
  assert.throws(
    () => parsePsaPhilatlas(swapAll(html, 'Annualized Growth Rate', 'Annual Growth'), 'renamed.html'),
    /parse: table histPop headers changed/,
  );
  assert.throws(
    () => parsePsaPhilatlas(swapAll(html, "id='histPop'", "id='histPopX'"), 'missing-table.html'),
    /parse: required table histPop not found/,
  );
  const row2020 = html.match(/<tr><th scope='row'><time datetime='2020-05-01'>[\s\S]*?<\/tr\s*>/i)?.[0];
  assert.ok(row2020, '2020 census row present in fixture');
  assert.throws(
    () => parsePsaPhilatlas(html.replace(row2020, `${row2020}${row2020}`), 'dup-year.html'),
    /parse: duplicate census year/,
  );
  const abanonRow = html.match(/<tr><th scope='row'><a[^>]*>Abanon<\/a><\/th>[\s\S]*?<\/tr\s*>/i)?.[0];
  assert.ok(abanonRow, 'Abanon row present in fixture');
  assert.throws(
    () => parsePsaPhilatlas(html.replace(abanonRow, `${abanonRow}${abanonRow}`), 'dup-barangay.html'),
    /parse: duplicate barangay identity/,
  );
  assert.throws(
    () => parsePsaPhilatlas(swapAll(html, "<td id='pop2020'>205,424</td>", "<td id='pop2020'>205,4X4</td>"), 'bad-int.html'),
    /parse: .* not a valid integer/,
  );
  assert.throws(
    () => parsePsaPhilatlas(swapAll(html, '<td>42,049</td><td>4.48</td>', '<td>42,049</td><td>large</td>'), 'bad-dec.html'),
    /parse: .* not a valid decimal/,
  );
});

test('psa-philatlas rejects wrong-jurisdiction and ambiguous evidence', () => {
  const html = psaHtml();
  assert.throws(
    () =>
      parsePsaPhilatlas(
        swapAll(html, 'San Carlos City, Pangasinan', 'San Carlos City, Negros Occidental'),
        'wrong-city.html',
      ),
    /parse: .*Negros/,
  );
  let ambiguous = html.replace(/<nav[^>]*breadcrumb[\s\S]*?<\/nav\s*>/i, '');
  ambiguous = ambiguous.split('<h1>')[0];
  ambiguous = swapAll(ambiguous, 'San Carlos City, Pangasinan', 'San Carlos City Profile');
  assert.throws(() => parsePsaPhilatlas(ambiguous, 'ambiguous.html'), /parse: ambiguous jurisdiction/);
});

test('normalizeBarangayName only folds safe presentation differences', () => {
  assert.equal(normalizeBarangayName('  Balite   Sur '), 'Balite Sur');
  assert.equal(normalizeBarangayName('Bugallon-Posadas Street (Poblacion)'), 'Bugallon-Posadas Street (Poblacion)');
  assert.equal(normalizeBarangayName('M. Soriano'), 'M. Soriano');
  assert.equal(normalizeBarangayName('BURGOS PADLAN').toLowerCase(), 'burgos padlan');
});

// ---- cenpelco collector (CENPELCO branch gallery) ----

const CENPELCO_FIXTURE = fileURLToPath(
  new URL('./fixtures/cenpelco-branch-gallery-2026-09-16.html', import.meta.url),
);

function cenpelcoHtml(): string {
  return fs.readFileSync(CENPELCO_FIXTURE, 'utf8');
}

function cenpelcoRegistry(): RegistryEntry {
  return {
    id: 'cenpelco',
    publisher: 'Central Pangasinan Electric Cooperative',
    url: 'https://cenpelco.com/',
    sourceType: 'website',
    collector: 'cenpelco',
    updateCadence: 'quarterly',
    evidenceRef: 'research/utilities/26-09-cenpelco-contacts.md',
    domains: ['utilities'],
  };
}

function cenpelcoArgs(evidenceText?: string) {
  return {
    registryId: 'cenpelco',
    registry: cenpelcoRegistry(),
    evidenceName: 'cenpelco.html',
    evidenceText: evidenceText ?? cenpelcoHtml(),
    runId: '2026-09-16',
    collectedBy: 'fixture-agent',
  };
}

function cenpelcoSwap(html: string, from: string, to: string, minExpected = 1): string {
  const count = html.split(from).length - 1;
  assert.ok(count >= minExpected, `expected ${minExpected}+ occurrence(s) of ${from}, found ${count}`);
  return html.split(from).join(to);
}

const CENPELCO_SLUGS = [
  'mangaldan', 'lingayen', 'bugallon', 'sual', 'labrador', 'bayambang', 'malasiqui',
  'binmaley', 'mangatarem', 'aguilar', 'basista', 'urbiztondo', 'alcala', 'bautista', 'sancarlos',
];

test('cenpelco parses the current fixture with the full office gallery', () => {
  const obs = parseCenpelco(cenpelcoHtml(), 'cenpelco.html');
  assert.equal(obs.providerShort, 'CENPELCO');
  assert.equal(obs.providerFull, 'Central Pangasinan Electric Cooperative');
  assert.equal(obs.sanCarlosOffice, SAN_CARLOS_MAIN_OFFICE);
  assert.deepEqual(
    obs.offices.map((o) => o.id),
    CENPELCO_SLUGS,
  );
  assert.equal(obs.offices.find((o) => o.id === 'sancarlos')?.name, 'San Carlos City (Main)');
});

test('cenpelco collector is deterministic, provisional, and exactly linked', () => {
  const first = collectCenpelco(cenpelcoArgs());
  const second = collectCenpelco(cenpelcoArgs());
  assert.deepEqual(first, second);
  assert.equal(first.candidates.length, 2);
  assert.deepEqual(
    first.candidates.map((c) => c.id).sort(),
    [...CENPELCO_COVERAGE].sort(),
  );
  assert.equal(first.sourceInstances.length, 1);
  const [instance] = first.sourceInstances;
  assert.match(instance.id, /^src-cenpelco-2026-09-16-[0-9a-f]{8}$/);
  assert.equal(instance.registryId, 'cenpelco');
  assert.equal(instance.documentType, 'webpage');
  const provider = first.candidates.find((c) => c.id === 'utility-electricity-provider');
  const offices = first.candidates.find((c) => c.id === 'cenpelco-area-offices');
  assert.deepEqual(Object.keys(provider?.data ?? {}).sort(), [
    'provider_full',
    'provider_short',
    'san_carlos_office',
    'serves_san_carlos_city',
  ]);
  assert.deepEqual(provider?.data.serves_san_carlos_city, true);
  assert.deepEqual(Object.keys(offices?.data ?? {}), ['offices']);
  assert.deepEqual(
    (offices?.data as { offices: Array<{ id: string }> }).offices.map((o) => o.id),
    [...CENPELCO_SLUGS].sort(),
  );
  for (const candidate of first.candidates) {
    assert.equal(candidate.status, 'provisional');
    assert.ok(!('acceptedBy' in candidate), `${candidate.id} must not carry reviewer fields`);
    assert.ok(!('acceptedAt' in candidate), `${candidate.id} must not carry reviewer fields`);
    assert.deepEqual(candidate.sourceIds, ['cenpelco']);
    assert.deepEqual(candidate.sourceInstanceIds, [instance.id]);
  }
  assert.deepEqual(first.coverage, { expectedRecordIds: [...CENPELCO_COVERAGE] });
});

test('cenpelco ignores stray numbers and out-of-gallery links', () => {
  const pristine = collectCenpelco(cenpelcoArgs());
  const withPhone = cenpelcoHtml().replace('</body>', '<p>Call 532-2222 now! GM office.</p></body>');
  assert.deepEqual(
    collectCenpelco(cenpelcoArgs(withPhone)).candidates.map((c) => c.data),
    pristine.candidates.map((c) => c.data),
    'stray contact text must not enter candidate data',
  );
  // A well-formed branch link between the heading row and the gallery list
  // (outside the <ul> the parser scopes to) must not be picked up.
  const html = cenpelcoHtml();
  const headingAt = html.lastIndexOf('CENPELCO Gallery of Branches');
  assert.ok(headingAt > 0, 'gallery heading present in body');
  const withRogueLink =
    html.slice(0, headingAt) +
    'CENPELCO Gallery of Branches</td></tr><tr><td><a href="../branches/fakeville/fakeville.jsp">Fakeville</a></td></tr><tr><td>' +
    html.slice(headingAt + 'CENPELCO Gallery of Branches'.length);
  assert.deepEqual(
    collectCenpelco(cenpelcoArgs(withRogueLink)).candidates.map((c) => c.data),
    pristine.candidates.map((c) => c.data),
    'out-of-gallery links must not become office records',
  );
});

test('cenpelco gallery reorder alone yields identical candidate data', () => {
  const html = cenpelcoHtml();
  const ulOpen = html.indexOf('<ul>');
  const ulClose = html.indexOf('</ul>', ulOpen);
  const items = [...html.slice(ulOpen, ulClose).matchAll(/<li>[\s\S]*?<\/li>/g)].map((m) => m[0]);
  assert.equal(items.length, 15);
  const reordered = html.slice(0, ulOpen) + '<ul>' + [...items].reverse().join('') + html.slice(ulClose);
  const pristine = collectCenpelco(cenpelcoArgs());
  assert.deepEqual(
    collectCenpelco(cenpelcoArgs(reordered)).candidates.map((c) => c.data),
    pristine.candidates.map((c) => c.data),
  );
});

test('cenpelco fails closed on drift, duplicates, and malformed rows', () => {
  const html = cenpelcoHtml();
  assert.throws(() => parseCenpelco('', 'empty.html'), /parse: empty evidence/);
  assert.throws(
    () => parseCenpelco(cenpelcoSwap(html, 'CENPELCO Gallery of Branches', 'Our Branches'), 'renamed.html'),
    /parse: office gallery anchor not found/,
  );
  const sanCarlosLi = '<li><a href="../branches/sancarlos/sancarlos.jsp" target="frame1">San Carlos City (Main)</a></li>';
  assert.ok(html.includes(sanCarlosLi), 'san carlos row present in fixture');
  assert.throws(
    () => parseCenpelco(html.replace(sanCarlosLi, `${sanCarlosLi}${sanCarlosLi}`), 'dup-office.html'),
    /parse: duplicate office identity/,
  );
  assert.throws(
    () =>
      parseCenpelco(
        cenpelcoSwap(html, '../branches/sancarlos/sancarlos.jsp', '../offices/sancarlos.jsp'),
        'bad-href.html',
      ),
    /parse: malformed office link/,
  );
  assert.throws(
    () =>
      parseCenpelco(
        cenpelcoSwap(html, '>Bugallon</a>', '></a>'),
        'blank-name.html',
      ),
    /parse: blank office name/,
  );
  assert.throws(
    () => parseCenpelco(cenpelcoSwap(html, 'CENPELCO Central Pangasinan', 'XYZ Power'), 'bad-title.html'),
    /parse: cooperative identity not found/,
  );
});

test('cenpelco San Carlos guard requires the exact Main qualifier', () => {
  const html = cenpelcoHtml();
  assert.throws(
    () => parseCenpelco(cenpelcoSwap(html, 'San Carlos City (Main)', 'San Carlos City'), 'bare.html'),
    /parse: San Carlos City \(Main\) not found/,
  );
  const ambiguous = html.replace(
    '</ul>',
    '<li><a href="../branches/sancarlos-north/sancarlos-north.jsp">San Carlos City (North)</a></li></ul>',
  );
  assert.throws(() => parseCenpelco(ambiguous, 'ambiguous.html'), /parse: ambiguous San Carlos office identity/);
});
