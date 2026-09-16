import fs from 'node:fs';
import path from 'node:path';
import { loadRecords, loadSources, type CivicRecord, type SourceRecord } from './lib/civic';
import { FB_MAX_ITEMS } from './lib/facebook';
import { sha256FileHex, writeJsonAtomic } from './lib/json';

interface EmitContext {
  records: Map<string, CivicRecord>;
  sources: Map<string, SourceRecord>;
}

function requiredRecord(ctx: EmitContext, id: string): CivicRecord {
  const record = ctx.records.get(id);
  if (!record) throw new Error(`generate: missing canonical record: ${id}`);
  return record;
}

function recordSources(ctx: EmitContext, record: CivicRecord): SourceRecord[] {
  return record.sourceIds.map((id) => {
    const source = ctx.sources.get(id);
    if (!source) {
      throw new Error(`generate: record ${record.id} cites unresolvable source: ${id}`);
    }
    return source;
  });
}

// Display label for a source inside generated compatibility files.
// Prefers the direct URL; archived LGU snapshots keep their established
// human-readable label; sources without a captured URL fall back to an
// honest publisher label instead of an invented URL.
export function sourceDisplayLabel(source: SourceRecord): string {
  if (source.sourceState === 'archived' && source.registryId === 'lgu-old-site-archive') {
    const snapshot = /\/web\/(\d{4})(\d{2})(\d{2})\d*\//.exec(source.url ?? '');
    if (snapshot) return `old official site (archived ${snapshot[1]}-${snapshot[2]}-${snapshot[3]})`;
  }
  if (source.url) return source.url;
  return `${source.publisher} (canonical URL unverified)`;
}

// File-level verification standing: verified only when every emitted fact
// record is verified and the domain carries no standing qualification note.
export function aggregateFileStatus(factRecords: CivicRecord[], hasQualificationNote: boolean): string {
  const allVerified = factRecords.every((r) => r.status === 'verified');
  return allVerified && !hasQualificationNote ? 'verified' : 'partially-verified';
}

function registryRefs(ctx: EmitContext, factRecords: CivicRecord[]): string {
  const registryIds = new Set<string>();
  const bareIds = new Set<string>();
  for (const record of factRecords) {
    for (const source of recordSources(ctx, record)) {
      if (source.registryId) registryIds.add(source.registryId);
      else bareIds.add(source.id);
    }
  }
  const parts = [`registry: ${[...registryIds].sort().join(', ')}`];
  if (bareIds.size > 0) parts.push(`sources: ${[...bareIds].sort().join(', ')}`);
  return parts.join('; ');
}

function maxAcceptedAt(factRecords: CivicRecord[]): string {
  return factRecords.map((r) => r.acceptedAt).sort().at(-1) ?? '';
}

function pickPerson(data: Record<string, unknown>): Record<string, unknown> {
  return { name: data.name, title: data.title, image: data.image };
}

function emitOfficials(ctx: EmitContext): Record<string, unknown> {
  const mayor = requiredRecord(ctx, 'city-mayor-current');
  const viceMayor = requiredRecord(ctx, 'city-vice-mayor-current');
  const representative = requiredRecord(ctx, 'district-representative-current');
  const councilorIds = Array.from({ length: 10 }, (_, i) => `sp-member-${String(i + 1).padStart(2, '0')}`);
  const councilors = councilorIds.map((id) => requiredRecord(ctx, id));
  const voters = requiredRecord(ctx, 'registered-voters-2025');
  const histories = ['term-history-2022-2025', 'term-history-2019-2022', 'term-history-2016-2019'].map((id) =>
    requiredRecord(ctx, id),
  );
  const votesNote = ctx.records.get('officials-votes-note');

  const factRecords = [mayor, viceMayor, representative, ...councilors, voters, ...histories];
  const voterSources = recordSources(ctx, voters);
  if (voterSources.length === 0) throw new Error('generate: registered-voters-2025 has no resolvable source');

  return {
    mayor: pickPerson(mayor.data),
    vice_mayor: pickPerson(viceMayor.data),
    representative: pickPerson(representative.data),
    councilors: councilors.map((c) => ({
      ...pickPerson(c.data),
      party: c.data.party,
      votes: c.data.votes,
    })),
    registered_voters: {
      count: voters.data.count,
      election: voters.data.election,
      source: sourceDisplayLabel(voterSources[0]),
    },
    history: histories.map((h) => h.data),
    _term: mayor.data.term,
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/government/26-09-city-officials.md`,
    _status: aggregateFileStatus(factRecords, votesNote?.status === 'verified'),
    _votes_note: votesNote?.data.note ?? '',
  };
}

function emitEmergency(ctx: EmitContext): Record<string, unknown> {
  const nationalIds = [
    'emergency-national-911',
    'emergency-pnp-117',
    'emergency-redcross-143',
    'emergency-complaint-8888',
  ];
  const cityIds = [
    'city-hall-trunk-line',
    'cdrmo-emergency-contact',
    'pnp-sancarlos-contact',
    'bfp-sancarlos-contact',
  ];
  const national = nationalIds.map((id) => requiredRecord(ctx, id));
  const city = cityIds.map((id) => requiredRecord(ctx, id));
  const note = requiredRecord(ctx, 'emergency-publication-note');
  const factRecords = [...national, ...city];

  const entry = (record: CivicRecord): Record<string, unknown> => {
    const sources = recordSources(ctx, record);
    if (sources.length === 0) throw new Error(`generate: ${record.id} has no resolvable source`);
    return {
      service: record.data.service,
      number: record.data.number,
      status: record.status === 'verified' ? 'verified' : 'historical - re-verify',
      source: sourceDisplayLabel(sources[0]),
    };
  };

  return {
    _schema_version: '1.0',
    _status: aggregateFileStatus(factRecords, false),
    _updated: maxAcceptedAt(factRecords),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/emergency/26-09-emergency-hotlines.md`,
    _note: note.data.note,
    city: 'San Carlos City',
    province: 'Pangasinan',
    national: national.map(entry),
    city_hotlines: city.map(entry),
  };
}

const EMITTERS: Record<string, { file: string; emit: (ctx: EmitContext) => Record<string, unknown> }> = {
  officials: { file: 'officials.json', emit: emitOfficials },
  emergency: { file: 'emergency-hotlines.json', emit: emitEmergency },
  news: { file: 'news.json', emit: emitNews },
  demographics: { file: 'demographics.json', emit: emitDemographics },
  cityProfile: { file: 'city-profile.json', emit: emitCityProfile },
  fiscal: { file: 'fiscal_transparency.json', emit: emitFiscal },
  cmci: { file: 'competitive-index.json', emit: emitCmci },
  ordinances: { file: 'ordinances.json', emit: emitOrdinances },
  resolutions: { file: 'resolutions.json', emit: emitResolutions },
  dpwh: { file: 'dpwh-projects.json', emit: emitDpwh },
  health: { file: 'health-facilities.json', emit: emitHealth },
  barangays: { file: 'barangays.json', emit: emitBarangays },
  barangayOfficials: { file: 'barangay-officials.json', emit: emitBarangayOfficials },
};

export function isFbNewsRecord(record: CivicRecord): boolean {
  return record.domain === 'news' && (record.id.startsWith('news-fb-') || record.sourceIds.includes('lgu-facebook-cio'));
}

// Manual items keep their curated seed order (the /news page renders file
// order, split into current/historical by recency); Facebook-reported items
// follow newest-first capped, reusing the legacy feed-merge cap.
function newsOrder(record: CivicRecord): number {
  const order = (record.data as Record<string, unknown>).order;
  return typeof order === 'number' ? order : Number.MAX_SAFE_INTEGER;
}

function toNewsItem(record: CivicRecord): Record<string, unknown> {
  const data = record.data as Record<string, unknown>;
  return {
    id: record.id.replace(/^news-/, ''),
    title: data.title,
    date: data.date,
    category: data.category,
    badge: data.badge,
    summary: data.summary,
    url: data.url,
    recency: data.recency ?? 'current',
  };
}

export function buildNewsJson(records: CivicRecord[], sources: SourceRecord[]): Record<string, unknown> {
  const ctx: EmitContext = {
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  };
  return emitNews(ctx);
}

export function buildDemographicsJson(records: CivicRecord[], sources: SourceRecord[]): Record<string, unknown> {
  const ctx: EmitContext = {
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  };
  return emitDemographics(ctx);
}

export function buildCityProfileJson(records: CivicRecord[], sources: SourceRecord[]): Record<string, unknown> {
  const ctx: EmitContext = {
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  };
  return emitCityProfile(ctx);
}

function emitFiscal(ctx: EmitContext): Record<string, unknown> {
  const income = requiredRecord(ctx, 'fiscal-annual-income');
  const core = requiredRecord(ctx, 'fiscal-core');
  const note = requiredRecord(ctx, 'fiscal-publication-note');
  const factRecords = [income, core];
  const coreData = core.data as Record<string, unknown>;

  return {
    _schema_version: '1.1',
    _status: aggregateFileStatus(factRecords, false),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/transparency/26-09-budget.md`,
    _note: (note.data as Record<string, unknown>).note,
    municipality: coreData.municipality,
    province: coreData.province,
    fiscal_years: (income.data as Record<string, unknown>).entries,
  };
}

function emitCmci(ctx: EmitContext): Record<string, unknown> {
  const series = requiredRecord(ctx, 'cmci-series');
  const note = requiredRecord(ctx, 'cmci-publication-note');
  const factRecords = [series];
  const data = series.data as Record<string, unknown>;

  return {
    _schema_version: '1.0',
    // File-level standing, not the record vocabulary: the series is a frozen
    // historical capture (last data update 2019), preserved verbatim.
    _status: 'historical',
    _updated: maxAcceptedAt(factRecords),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/competitiveness/26-09-cmci-index.md`,
    _note: (note.data as Record<string, unknown>).note,
    title: data.title,
    description: data.description,
    source: data.source,
    category: data.category,
    years: data.years,
    overall: data.overall,
    pillars: data.pillars,
  };
}

export function buildFiscalJson(records: CivicRecord[], sources: SourceRecord[]): Record<string, unknown> {
  const ctx: EmitContext = {
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  };
  return emitFiscal(ctx);
}

export function buildHealthJson(records: CivicRecord[], sources: SourceRecord[]): Record<string, unknown> {
  const ctx: EmitContext = {
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  };
  return emitHealth(ctx);
}

export function buildCmciJson(records: CivicRecord[], sources: SourceRecord[]): Record<string, unknown> {
  const ctx: EmitContext = {
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  };
  return emitCmci(ctx);
}

function ordinanceRecords(ctx: EmitContext): CivicRecord[] {
  return [...ctx.records.values()]
    .filter((r) => r.id.startsWith('ordinance-') && r.status !== 'retired')
    .sort((a, b) => {
      const ao = (a.data as Record<string, unknown>).order;
      const bo = (b.data as Record<string, unknown>).order;
      return (typeof ao === 'number' ? ao : 0) - (typeof bo === 'number' ? bo : 0);
    });
}

function emitOrdinances(ctx: EmitContext): Record<string, unknown> {
  const note = requiredRecord(ctx, 'sp-ordinances-note');
  return {
    // File-level standing preserved verbatim: entries are reported, not
    // independently confirmed against the SP archive (see _note).
    _status: 'unverified',
    _note: (note.data as Record<string, unknown>).note,
    ordinances: ordinanceRecords(ctx).map((r) => {
      const data = r.data as Record<string, unknown>;
      return { ordinanceNo: data.ordinanceNo, title: data.title, sessionDate: data.sessionDate };
    }),
  };
}

function emitResolutions(ctx: EmitContext): Record<string, unknown> {
  const current = requiredRecord(ctx, 'sp-resolutions-current');
  const note = requiredRecord(ctx, 'sp-resolutions-note');
  return {
    _status: 'unverified',
    _note: (note.data as Record<string, unknown>).note,
    resolutions: (current.data as Record<string, unknown>).entries,
  };
}

function emitDpwh(ctx: EmitContext): Record<string, unknown> {
  const summary = requiredRecord(ctx, 'dpwh-projects-summary');
  const note = requiredRecord(ctx, 'dpwh-projects-note');
  const data = summary.data as Record<string, unknown>;
  return {
    // File-level standing stays conservative: the records hold verified
    // reported observations, but coverage is explicitly partial (no project
    // IDs/contractors/dates retrievable), so this file is never presented as
    // a complete current project registry. See the carried _note.
    _status: 'unverified',
    _note: (note.data as Record<string, unknown>).note,
    summary: data.summary,
    projects: data.entries,
  };
}

function healthFacilityRecords(ctx: EmitContext): CivicRecord[] {
  return [...ctx.records.values()]
    .filter((r) => r.id.startsWith('health-facility-') && r.status !== 'retired')
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function emitHealth(ctx: EmitContext): Record<string, unknown> {
  const facilities = healthFacilityRecords(ctx);
  if (facilities.length === 0) throw new Error('generate: no canonical health-facility-* records');
  const cho = requiredRecord(ctx, 'city-health-office');
  const note = requiredRecord(ctx, 'health-publication-note');
  const factRecords = [...facilities, cho, note];
  const choData = cho.data as Record<string, unknown>;
  const phone = choData.phone as Record<string, unknown>;
  const noteData = note.data as Record<string, unknown>;
  const dirSource = recordSources(ctx, cho).find((s) => s.registryId === 'lgu-website');
  if (!dirSource) throw new Error('generate: city-health-office has no resolvable lgu-website source');
  const entry = (record: CivicRecord): Record<string, unknown> => {
    const data = record.data as Record<string, unknown>;
    const accreditation = data.accreditation as Record<string, unknown>;
    const item: Record<string, unknown> = {
      name: data.name,
      type: data.category === 'infirmary' ? 'Infirmary' : 'Hospital',
      verification: 'philhealth-accredited',
      accreditation: {
        accredited_by: 'PhilHealth',
        level: data.level,
        accredited_beds: accreditation.accredited_beds,
        accreditation_expiry: accreditation.accreditation_expiry,
      },
      address: data.address,
      license_status: 'pending-verification',
      evidence:
        'PhilHealth Accredited Hospitals and Infirmaries CY 2026 (beds, level, contacts, expiry; no license numbers)',
    };
    if (data.ownership !== undefined) item.ownership = data.ownership;
    return item;
  };

  return {
    _schema_version: '1.0',
    // Qualification note present (DOH licensure still pending): never 'verified'.
    _status: aggregateFileStatus(factRecords, true),
    _updated: maxAcceptedAt(factRecords),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/health/26-09-health-facilities.md; research/health/26-09-doh-facilities.md`,
    _note: noteData.note,
    city_health_office: {
      name: choData.office,
      phone: phone.number,
      phone_status: phone.status,
      phone_source: phone.source,
      officers: choData.officers,
      officers_source: `LGU Departments/Offices directory (live ${dirSource.retrievedAt})`,
    },
    facilities: facilities.map(entry),
    gap_note: noteData.gap_note,
  };
}

function captainRecords(ctx: EmitContext): CivicRecord[] {
  return [...ctx.records.values()]
    .filter((r) => r.id.startsWith('barangay-captain-') && r.status !== 'retired')
    .sort((a, b) => {
      const ao = (a.data as Record<string, unknown>).order;
      const bo = (b.data as Record<string, unknown>).order;
      return (typeof ao === 'number' ? ao : 0) - (typeof bo === 'number' ? bo : 0);
    });
}

function barangayPopulations(ctx: EmitContext): Map<string, { population_2020: unknown; population_2015: unknown }> {
  const table = requiredRecord(ctx, 'demographics-barangay-populations');
  const list = ((table.data as Record<string, unknown>).barangays ?? []) as Array<{
    name: string;
    population_2020: unknown;
    population_2015: unknown;
  }>;
  return new Map(list.map((b) => [b.name, b]));
}

function emitBarangays(ctx: EmitContext): Record<string, unknown> {
  return {
    barangays: captainRecords(ctx).map((r) => {
      const data = r.data as Record<string, unknown>;
      return { name: data.barangay, captain: data.captain };
    }),
  };
}

function emitBarangayOfficials(ctx: EmitContext): Record<string, unknown> {
  const term = requiredRecord(ctx, 'barangay-term');
  const split = requiredRecord(ctx, 'barangay-urban-rural');
  const populations = barangayPopulations(ctx);
  const termData = term.data as Record<string, unknown>;
  const splitData = split.data as Record<string, unknown>;
  const captains = captainRecords(ctx);
  const entries = captains.map((r) => {
    const data = r.data as Record<string, unknown>;
    const pop = populations.get(String(data.barangay));
    if (!pop) throw new Error(`generate: no canonical population for barangay: ${data.barangay}`);
    const entry: Record<string, unknown> = {
      barangay: data.barangay,
      total_officials: 1,
      tel: data.tel,
      positions: [{ position: 'Punong Barangay', count: 1, officials: [data.captain] }],
      population_2020: pop.population_2020,
      population_2015: pop.population_2015,
      poblacion: data.poblacion,
    };
    if (data.tel_status !== undefined) entry.tel_status = data.tel_status;
    if (data.tel_shared_with !== undefined) entry.tel_shared_with = data.tel_shared_with;
    return entry;
  });

  return {
    province: termData.province,
    municipality: termData.municipality,
    region: termData.region,
    term: termData.term,
    source: `City Government of San Carlos — Barangay Officials (official LGU site, archived 2024-06-03); registry: lgu-website; research: research/barangays/26-09-barangay-directory.md`,
    barangay_count: captains.length,
    total_officials: captains.length,
    barangays: entries,
    populations_source: splitData.populations_source,
    urban_rural_split: {
      total: splitData.total,
      urban: splitData.urban,
      rural: splitData.rural,
      source: splitData.source,
      note: splitData.note,
    },
    term_note: termData.term_note,
  };
}

function emitNews(ctx: EmitContext): Record<string, unknown> {
  const publishable = [...ctx.records.values()].filter(
    (r) => r.domain === 'news' && (r.status === 'verified' || r.status === 'reported') && r.id !== 'news-publication-note',
  );
  const manual = publishable
    .filter((r) => r.status === 'verified' && !isFbNewsRecord(r))
    .sort((a, b) => newsOrder(a) - newsOrder(b));
  // Facebook slice follows the legacy feed-merge rule (newest-first, capped
  // so one noisy run cannot flood the feed); manual curated order is kept
  // ahead of it because the /news page renders file order.
  const fbDate = (r: CivicRecord): string => String((r.data as Record<string, unknown>).date ?? '');
  const fb = publishable
    .filter((r) => r.status === 'reported' && isFbNewsRecord(r))
    .sort((a, b) => fbDate(b).localeCompare(fbDate(a)))
    .slice(0, FB_MAX_ITEMS);
  const factRecords = [...manual, ...fb];
  const note = requiredRecord(ctx, 'news-publication-note');

  return {
    _status: aggregateFileStatus(factRecords, false),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/news/26-09-news-current-events.md`,
    _note: (note.data as Record<string, unknown>).note,
    news: factRecords.map(toNewsItem),
  };
}

function emitDemographics(ctx: EmitContext): Record<string, unknown> {
  const pop = requiredRecord(ctx, 'population-total-2020');
  const history = requiredRecord(ctx, 'demographics-census-history');
  const households = requiredRecord(ctx, 'demographics-households');
  const barangays = requiredRecord(ctx, 'demographics-barangay-populations');
  const core = requiredRecord(ctx, 'demographics-core');
  const geo = requiredRecord(ctx, 'city-geo-core');
  const note = requiredRecord(ctx, 'demographics-publication-note');
  const factRecords = [pop, history, households, barangays, core, geo];
  const popData = pop.data as Record<string, unknown>;
  const coreData = core.data as Record<string, unknown>;
  const geoData = geo.data as Record<string, unknown>;

  return {
    _schema_version: '1.1',
    _status: aggregateFileStatus(factRecords, false),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/demographics/26-09-demographics.md`,
    _note: (note.data as Record<string, unknown>).note,
    municipality: coreData.municipality,
    province: coreData.province,
    region: coreData.region,
    population: { total: popData.total, year: popData.year, source: popData.source },
    land_area_km2: geoData.land_area_km2,
    barangay_count: geoData.barangay_count,
    income_class: coreData.income_class,
    coordinates: geoData.coordinates,
    census_history: (history.data as Record<string, unknown>).entries,
    households: households.data,
    barangays: (barangays.data as Record<string, unknown>).barangays,
  };
}

function emitCityProfile(ctx: EmitContext): Record<string, unknown> {
  const pop = requiredRecord(ctx, 'population-total-2020');
  const geo = requiredRecord(ctx, 'city-geo-core');
  const contact = requiredRecord(ctx, 'city-hall-contact');
  const trunkLine = requiredRecord(ctx, 'city-hall-trunk-line');
  const identity = requiredRecord(ctx, 'city-profile-identity');
  const admin = requiredRecord(ctx, 'city-profile-admin');
  const geoDetail = requiredRecord(ctx, 'city-profile-geo-detail');
  const seal = requiredRecord(ctx, 'city-profile-seal');
  const leadership = requiredRecord(ctx, 'city-profile-leadership');
  const history = requiredRecord(ctx, 'city-profile-history');
  const culture = requiredRecord(ctx, 'city-profile-culture');
  const visionMission = requiredRecord(ctx, 'city-profile-vision-mission');
  const note = requiredRecord(ctx, 'city-profile-publication-note');
  const factRecords = [pop, geo, contact, identity, admin, geoDetail, seal, leadership, history, culture, visionMission];
  const popData = pop.data as Record<string, unknown>;
  const geoData = geo.data as Record<string, unknown>;
  const contactData = contact.data as Record<string, unknown>;
  const trunkData = trunkLine.data as Record<string, unknown>;
  const identityData = identity.data as Record<string, unknown>;
  const adminData = admin.data as Record<string, unknown>;
  const historyData = history.data as Record<string, unknown>;
  const cultureData = culture.data as Record<string, unknown>;
  const visionData = visionMission.data as Record<string, unknown>;
  const leadershipData = leadership.data as Record<string, unknown>;

  return {
    _schema_version: '2.0',
    _status: aggregateFileStatus(factRecords, false),
    _updated: maxAcceptedAt(factRecords),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/city-profile/26-09-city-profile.md; research/city-profile/26-09-geography.md; research/culture-history/26-09-history.md; research/culture-history/26-09-culture-heritage.md`,
    _note: (note.data as Record<string, unknown>).note,
    official_name: identityData.official_name,
    local_names: identityData.local_names,
    type: identityData.type,
    income_class: adminData.income_class,
    province: adminData.province,
    region: adminData.region,
    legislative_district: adminData.legislative_district,
    coordinates: geoData.coordinates,
    elevation_m: geoData.elevation_m,
    elevation_note: geoData.elevation_note,
    land_area_km2: geoData.land_area_km2,
    barangays: geoData.barangay_count,
    population: { total: popData.total, year: popData.year, source: popData.source },
    postal_code: adminData.postal_code,
    area_code: adminData.area_code,
    founded: historyData.founded,
    cityhood: historyData.cityhood,
    nicknames: identityData.nicknames,
    languages: cultureData.languages,
    geography: (geoDetail.data as Record<string, unknown>).geography,
    seal: (seal.data as Record<string, unknown>).seal,
    mayor: leadershipData.mayor,
    vice_mayor: leadershipData.vice_mayor,
    contact: {
      address: contactData.address,
      phone: trunkData.number,
      email: contactData.email,
      website: contactData.website,
      facebook: contactData.facebook,
    },
    vision: visionData.vision,
    mission: visionData.mission,
    history_timeline: historyData.history_timeline,
    heritage: cultureData.heritage,
  };
}

export function buildDomainJson(
  domain: string,
  records: CivicRecord[],
  sources: SourceRecord[],
): Record<string, unknown> {
  const emitter = EMITTERS[domain];
  if (!emitter) throw new Error(`generate: unknown domain: ${domain}`);
  return emitter.emit({
    records: new Map(records.map((r) => [r.id, r])),
    sources: new Map(sources.map((s) => [s.id, s])),
  });
}

function mirrorTargets(root: string, file: string): string[] {  const targets = [path.join(root, 'data', file), path.join(root, 'public', 'data', file)];
  // src/data mirrors exist only for statically imported files; never create new ones here.
  const srcMirror = path.join(root, 'src', 'data', file);
  if (fs.existsSync(srcMirror)) targets.push(srcMirror);
  return targets;
}

function main(): number {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const args = process.argv.slice(2);
  const domainArg = args.find((a) => a.startsWith('--domain='))?.slice('--domain='.length);
  const names = domainArg ? [domainArg] : Object.keys(EMITTERS);
  for (const name of names) {
    if (!EMITTERS[name]) {
      console.error(`generate: unknown domain: ${name} (known: ${Object.keys(EMITTERS).join(', ')})`);
      return 2;
    }
  }

  const ctx: EmitContext = {
    records: new Map(loadRecords(root).records.map((r) => [r.id, r])),
    sources: new Map(loadSources(root).sources.map((s) => [s.id, s])),
  };

  for (const name of names) {
    const { file, emit } = EMITTERS[name];
    const content = emit(ctx);
    const targets = mirrorTargets(root, file);
    for (const target of targets) writeJsonAtomic(target, content);
    // Post-write self-check: every mirror must be byte-identical.
    const hashes = new Set(targets.map((t) => sha256FileHex(t)));
    if (hashes.size !== 1) {
      console.error(`generate: mirror mismatch after writing ${file}`);
      return 1;
    }
    console.log(`generate: wrote ${file} -> ${targets.map((t) => path.relative(root, t)).join(', ')}`);
  }
  return 0;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/generate.ts');

if (invokedDirectly) {
  process.exit(main());
}
