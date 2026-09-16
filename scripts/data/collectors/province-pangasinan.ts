// Province of Pangasinan profile collector (structure monitor).
//
// Verifies San Carlos City, Pangasinan jurisdiction on the registered profile
// page, validates the expected labeled profile structure, and records scoped
// observations (classification, barangay count, district, cityhood/RA refs,
// distance, verbatim land area, census-population presence) in run notes with
// an exact source instance. By explicit design this collector emits ZERO
// candidates and declares EMPTY fact-level coverage: every mappable page fact
// sits inside a composite canonical record that promotion replaces wholesale,
// so any partial candidate would drop unrelated canonical fields (see
// design.md matrix). PSA owns the census fact; officials, tourism, and
// issuances are out of scope. The known 17,087 ha vs 169.03 km² land-area
// conflict is preserved as notes-only evidence, never a candidate.
//
// Fail-closed: missing anchors, ambiguous jurisdiction, or duplicate/
// conflicting values throw `parse:` so refresh records a parse-class failure
// and diff reports SOURCE_CHANGED (never partial output, never MISSING).
// Deterministic: same evidence + same run metadata in, same output out.
// No network here; acquisition already happened upstream.
import { buildSourceInstance } from '../lib/instances';
import { cellText } from '../parsers/html';
import type { Collector, CollectorArgs } from './types';

export const PROVINCE_REGISTRY_ID = 'province-pangasinan';

/** Explicitly empty: v1 watches structure + conflict evidence, no canonical IDs. */
export const PROVINCE_COVERAGE: readonly string[] = [];

export interface ProvinceObservations {
  notes: string[];
}

/** Profile text region: H1 block through the narrative, stopping at Officials. */
export function extractProfileRegion(html: string, evidenceName: string): string {
  const h1 = html.indexOf('<h1');
  if (h1 < 0) throw new Error(`parse: profile H1 not found in ${evidenceName}`);
  const officials = html.indexOf('<h4>Officials</h4>', h1);
  if (officials < 0) throw new Error(`parse: Officials boundary not found in ${evidenceName}`);
  return html.slice(h1, officials);
}

/**
 * Positive jurisdiction guard: exact H1 locality, provincial title context,
 * and Pangasinan markers. Negros markers or a missing locality fail closed.
 */
export function assertProvinceJurisdiction(html: string, evidenceName: string): void {
  const text = cellText(html);
  if (/negros/i.test(text)) {
    throw new Error(`parse: evidence is not San Carlos City, Pangasinan in ${evidenceName} (Negros marker present)`);
  }
  const h1 = cellText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i)?.[1] ?? '');
  if (h1 !== 'San Carlos City') {
    throw new Error(`parse: ambiguous jurisdiction in ${evidenceName}: expected H1 San Carlos City`);
  }
  const title = cellText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  if (!/san carlos city/i.test(title) || !/pangasinan/i.test(title)) {
    throw new Error(`parse: ambiguous jurisdiction in ${evidenceName}: title lacks San Carlos City, Pangasinan`);
  }
  if (!/pangasinan/i.test(text)) {
    throw new Error(`parse: missing Pangasinan context in ${evidenceName}`);
  }
}

/** Strict labeled integer: thousands commas allowed, nothing else. Multiple distinct values → fail. */
function parseLabeledInt(region: string, pattern: RegExp, what: string, evidenceName: string): number {
  const values = [...region.matchAll(new RegExp(pattern.source, 'gi'))].map((m) => m[1].replace(/,/g, ''));
  const distinct = [...new Set(values)];
  if (distinct.length === 0) throw new Error(`parse: ${what} label not found in ${evidenceName}`);
  if (distinct.length > 1) {
    throw new Error(`parse: conflicting ${what} values in ${evidenceName}: ${distinct.join(' vs ')}`);
  }
  if (!/^\d+$/.test(distinct[0])) {
    throw new Error(`parse: ${what} is not a valid integer in ${evidenceName}`);
  }
  return parseInt(distinct[0], 10);
}

/** Exactly one distinct value per observed fact; multiples disagree → fail. */
function expectSingle(values: string[], what: string, evidenceName: string): string {
  const distinct = [...new Set(values.map((v) => v.replace(/\s+/g, ' ').trim()))];
  if (distinct.length === 0) throw new Error(`parse: ${what} not found in ${evidenceName}`);
  if (distinct.length > 1) {
    throw new Error(`parse: conflicting ${what} values in ${evidenceName}: ${distinct.join(' vs ')}`);
  }
  return distinct[0];
}

/** Thousands grouping without locale APIs (deterministic across runtimes). */
function groupThousands(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Scoped observations from the profile region. Every fact below is required
 * structurally (missing → parse failure); values flow to notes only and are
 * never hardcoded, so legitimate source changes re-note without candidacy.
 */
export function parseProvinceProfile(html: string, evidenceName: string): ProvinceObservations {
  if (!html || html.trim() === '') throw new Error(`parse: empty evidence: ${evidenceName}`);
  assertProvinceJurisdiction(html, evidenceName);
  const region = extractProfileRegion(html, evidenceName);
  const text = cellText(region);

  const classification = expectSingle(
    [...text.matchAll(/(\d+(?:st|nd|rd|th)\s+Class\s+City)/gi)].map((m) => m[1]),
    'city classification',
    evidenceName,
  );
  const barangayCount = parseLabeledInt(region, /Number of Barangay:\s*([\d,]+)/i, 'barangay count', evidenceName);
  const district = expectSingle(
    [...text.matchAll(/((?:third|\d+(?:st|nd|rd|th))\s+congressional district)/gi)].map((m) => m[1]),
    'congressional district',
    evidenceName,
  );
  const cityhoodRa = expectSingle(
    [...text.matchAll(/Republic Act No\.\s*(\d+)/gi)].map((m) => m[1]),
    'cityhood Republic Act',
    evidenceName,
  );
  const cityhoodDate = expectSingle(
    [...text.matchAll(/signed on ([A-Z][a-z]+ \d{1,2}, \d{4})/g)].map((m) => m[1]),
    'cityhood signing date',
    evidenceName,
  );
  const basistaRa = expectSingle(
    [...text.matchAll(/\bRA\s*(\d+)/g)].map((m) => m[1]),
    'Basista separation RA',
    evidenceName,
  );
  const distanceKm = parseLabeledInt(
    region,
    /(\d+)\s*kilometers?\s+from\s+the\s+capital\s+town\s+of\s+Lingayen/i,
    'Lingayen distance',
    evidenceName,
  );
  // Land-area conflict observation: verbatim value + units only. No comparison
  // against canonical values here (no hardcoded 169.03, no canonical reads):
  // interpretation belongs to reviewers and existing research conflict docs.
  const landArea = parseLabeledInt(region, /([\d,]+)\s*hectares/i, 'land area', evidenceName);
  const censusPairs = [...region.matchAll(/population of ([\d,]+) people according to the (\d{4}) census/gi)].map(
    (m) => `${m[1].replace(/,/g, '')}/${m[2]}`,
  );
  const censusDistinct = [...new Set(censusPairs)];
  if (censusDistinct.length === 0) throw new Error(`parse: census population label not found in ${evidenceName}`);
  if (censusDistinct.length > 1) {
    throw new Error(`parse: conflicting census population values in ${evidenceName}`);
  }
  const [censusValue, censusYear] = censusDistinct[0].split('/');
  if (!/^\d+$/.test(censusValue) || !/^\d{4}$/.test(censusYear)) {
    throw new Error(`parse: census population is not valid in ${evidenceName}`);
  }

  return {
    notes: [
      `classification observed: ${classification}`,
      `barangay count observed: ${barangayCount}`,
      `congressional district observed: ${district}`,
      `cityhood observed: Republic Act No. ${cityhoodRa} signed ${cityhoodDate}; Basista separation RA ${basistaRa} (context only)`,
      `distance observed: ${distanceKm} kilometers from Lingayen`,
      `land area observed: ${groupThousands(landArea)} hectares (verbatim source observation; conflict review per existing research documentation, never a candidacy)`,
      `census population observed: ${groupThousands(parseInt(censusValue, 10))} (${censusYear}; PSA-owned fact; corroborating presence only, no duplicate candidate)`,
      'officials, tourism, and issuances content out of scope; profile region only',
    ],
  };
}

// ---------------------------------------------------------------------------
// Collector: observations -> exact source instance, zero candidates.
// ---------------------------------------------------------------------------
//
// claimSources convention (verified against scripts/data/promote.ts): when a
// future scoped change adds watched facts, each candidate data leaf SHALL
// cite the registry id `province-pangasinan` (NOT an exact id) so promotion
// resolveClaim maps it to the accepted exact source id. v1 has no candidates,
// so there is nothing to attribute yet.

export function collectProvincePangasinan(args: CollectorArgs): ReturnType<Collector> {
  const obs = parseProvinceProfile(args.evidenceText, args.evidenceName);
  const instance = buildSourceInstance({
    registry: args.registry,
    evidenceName: args.evidenceName,
    evidenceBytes: args.evidenceText,
    runId: args.runId,
    collectedBy: args.collectedBy,
    documentType: 'webpage',
    title: `${args.registry.publisher} San Carlos City profile (${args.evidenceName})`,
    notes: `Province profile structure verified; land-area conflict observation preserved in run notes.`,
  });
  return {
    candidates: [],
    sourceInstances: [instance],
    coverage: { expectedRecordIds: [...PROVINCE_COVERAGE] },
    notes: obs.notes,
  };
}
