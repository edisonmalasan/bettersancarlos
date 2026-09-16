// PSA-via-PhilAtlas demographics collector.
//
// Extracts deliberately scoped 2020/2015 census facts from a saved PhilAtlas
// San Carlos City page and emits provisional candidates for exactly four
// canonical records. Provenance stays honest: this is PSA data *via PhilAtlas*
// (registry publisher says so); nothing here claims a direct PSA download.
//
// Anchor strategy (verified against the 2026-09-16 page structure):
//   population-total-2020            <- infobox `Population (2020)` cell
//   demographics-census-history      <- table#histPop rows (year from <time>)
//   demographics-households          <- table#households-table 2015 row
//   demographics-barangay-populations<- table#lguTable rows + tfoot totals
// Any required anchor missing/renamed, any duplicate year/name, any malformed
// numeric, or any jurisdiction doubt throws `parse:` so refresh records a
// parse-class failure and diff reports SOURCE_CHANGED (never partial data,
// never false MISSING). Deterministic: same evidence + same run metadata in,
// same output out. No network here; acquisition already happened upstream.
import { buildSourceInstance } from '../lib/instances';
import { cellText, cleanText } from '../parsers/html';
import type { Collector, CollectorArgs } from './types';

export const PSA_PHILATLAS_REGISTRY_ID = 'psa-census-philatlas';

export const PSA_COVERAGE = [
  'population-total-2020',
  'demographics-census-history',
  'demographics-households',
  'demographics-barangay-populations',
] as const;

// ---------------------------------------------------------------------------
// Low-level HTML helpers (tolerant of the source's real-world markup, strict
// about values). Pure string operations, no dependencies.
// Shared text helpers (cleanText/cellText) live in ../parsers/html.
// ---------------------------------------------------------------------------

/** Strict non-negative integer: thousands commas allowed, nothing else (anything else fails closed). */
export function parseStrictInt(raw: string, what: string, evidenceName: string): number {
  const cleaned = cleanText(raw).replace(/,/g, '');
  if (!/^\d+$/.test(cleaned)) {
    throw new Error(`parse: ${what} is not a valid integer in ${evidenceName}: ${JSON.stringify(cleanText(raw))}`);
  }
  return parseInt(cleaned, 10);
}

/** Strict positive decimal (household size): commas allowed, nothing else. */
export function parseStrictDecimal(raw: string, what: string, evidenceName: string): number {
  const cleaned = cleanText(raw).replace(/,/g, '');
  if (!/^\d+(\.\d+)?$/.test(cleaned) || !(parseFloat(cleaned) > 0)) {
    throw new Error(`parse: ${what} is not a valid decimal in ${evidenceName}: ${JSON.stringify(cleanText(raw))}`);
  }
  return parseFloat(cleaned);
}

/** Extract the full <table> element with the given id (single quotes as served). */
export function extractTable(html: string, tableId: string, evidenceName: string): string {
  let cursor = 0;
  while (true) {
    const open = html.indexOf('<table', cursor);
    if (open < 0) break;
    const tagEnd = html.indexOf('>', open);
    if (tagEnd < 0) break;
    const tag = html.slice(open, tagEnd + 1);
    if (tag.includes(`id='${tableId}'`) || tag.includes(`id="${tableId}"`)) {
      const close = html.indexOf('</table>', tagEnd);
      if (close < 0) throw new Error(`parse: table ${tableId} is never closed in ${evidenceName}`);
      return html.slice(open, close + '</table>'.length);
    }
    cursor = tagEnd + 1;
  }
  throw new Error(`parse: required table ${tableId} not found in ${evidenceName}`);
}

/** Header texts of the first <thead> row, normalized for comparison. */
export function tableHeaders(tableHtml: string): string[] {
  // Tolerant of omitted optional closers (the source skips </thead>/</tr>
  // in some tables): the head runs to </thead> or <tbody>, the row to </tr>.
  const head = tableHtml.match(/<thead\b[^>]*>([\s\S]*?)(?:<\/thead\s*>|<tbody\b)/i)?.[1] ?? '';
  const rowHtml = head.split(/<\/tr\s*>/i)[0];
  return rowHtml
    .split(/<(?:th|td)\b[^>]*>/i)
    .slice(1)
    .map(cellText);
}

/** Data rows of the first <tbody>: each row is the list of cell texts (row header first). */
export function tableRows(tableHtml: string): string[][] {
  const tbody = tableHtml.match(/<tbody[\s\S]*?<\/tbody\s*>/i)?.[0] ?? '';
  const rows: string[][] = [];
  for (const match of tbody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi)) {
    rows.push(
      match[1]
        .split(/<(?:th|td)\b[^>]*>/i)
        .slice(1)
        .map(cellText),
    );
  }
  return rows;
}

function requireHeaders(actual: string[], expected: string[], tableId: string, evidenceName: string): void {
  if (actual.length !== expected.length || actual.some((h, i) => h !== expected[i])) {
    throw new Error(
      `parse: table ${tableId} headers changed in ${evidenceName}: ` +
        `expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Jurisdiction guard: positive Pangasinan identity required, Negros rejected.
// ---------------------------------------------------------------------------

export function assertPangasinanJurisdiction(html: string, evidenceName: string): void {
  const text = cellText(html);
  if (/negros\s+occidental/i.test(text) || /\bnegros\b/i.test(text)) {
    throw new Error(`parse: evidence is not San Carlos City, Pangasinan in ${evidenceName} (Negros marker present)`);
  }
  const crumb = html.match(/<nav[^>]*breadcrumb[\s\S]*?<\/nav\s*>/i)?.[0] ?? '';
  const crumbText = cellText(crumb);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i)?.[1] ?? '';
  const identity = cellText(`${title} ${h1} ${crumbText}`);
  if (!/san\s+carlos/i.test(identity) || !/pangasinan/i.test(identity)) {
    throw new Error(`parse: ambiguous jurisdiction in ${evidenceName}: expected San Carlos City, Pangasinan markers`);
  }
  if (!/ilocos/i.test(`${crumbText} ${text.slice(0, 4000)}`)) {
    throw new Error(`parse: missing Ilocos Region context in ${evidenceName}`);
  }
}

// ---------------------------------------------------------------------------
// Section parsers: each returns normalized observations or throws `parse:`.
// ---------------------------------------------------------------------------

export interface CensusEntry {
  year: number;
  population: number;
}

export interface HouseholdRow {
  year: number;
  householdPopulation: number;
  count: number;
  averageSize: number;
}

export interface BarangayRow {
  name: string;
  population2020: number;
  population2015: number;
}

export interface PsaPhilatlasObservations {
  total2020: number;
  history: CensusEntry[];
  households2015: { count: number; year: 2015; averageSize: number };
  barangays: BarangayRow[];
  notes: string[];
}

/** Year-specific 2020 total from the infobox `Population (2020)` cell. */
export function parseProfileTotal(html: string, evidenceName: string): number {
  const match = html.match(
    /<th[^>]*>\s*Population\s*\(2020\)\s*<\/th\s*>\s*<td[^>]*>([\s\S]*?)<\/td\s*>/i,
  );
  if (!match) throw new Error(`parse: infobox Population (2020) cell not found in ${evidenceName}`);
  return parseStrictInt(match[1], 'Population (2020)', evidenceName);
}

/** Full census series from table#histPop; year comes from the <time datetime>. */
export function parseCensusHistory(html: string, evidenceName: string): CensusEntry[] {
  const table = extractTable(html, 'histPop', evidenceName);
  requireHeaders(
    tableHeaders(table),
    ['Census date', 'Population', 'Annualized Growth Rate'],
    'histPop',
    evidenceName,
  );
  // Row-scoped <time> lookup keeps each year bound to its own row.
  const tbody = table.match(/<tbody[\s\S]*?<\/tbody\s*>/i)?.[0] ?? '';
  const out: CensusEntry[] = [];
  for (const match of tbody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi)) {
    const row = match[1];
    const time = row.match(/<time datetime='(\d{4})-\d{2}-\d{2}'>([\s\S]*?)<\/time\s*>/i);
    if (!time) throw new Error(`parse: histPop row without a census <time> in ${evidenceName}`);
    const year = parseInt(time[1], 10);
    if (!cellText(time[2]).startsWith(time[1])) {
      throw new Error(`parse: histPop <time> content disagrees with datetime in ${evidenceName}`);
    }
    const cells = row
      .split(/<(?:th|td)\b[^>]*>/i)
      .slice(1)
      .map(cellText);
    if (cells.length < 2) throw new Error(`parse: malformed histPop row in ${evidenceName}`);
    out.push({ year, population: parseStrictInt(cells[1], `census population ${year}`, evidenceName) });
  }
  if (out.length === 0) throw new Error(`parse: histPop table has no rows in ${evidenceName}`);
  const years = out.map((e) => e.year);
  if (new Set(years).size !== years.length) {
    throw new Error(`parse: duplicate census year in histPop in ${evidenceName}`);
  }
  for (let i = 1; i < years.length; i++) {
    if (years[i] <= years[i - 1]) throw new Error(`parse: census years not ascending in ${evidenceName}`);
  }
  return out;
}

/** 2015 household snapshot from table#households-table (series otherwise noted, not modeled). */
export function parseHouseholds(
  html: string,
  evidenceName: string,
): { row2015: HouseholdRow; notes: string[] } {
  const table = extractTable(html, 'households-table', evidenceName);
  requireHeaders(
    tableHeaders(table),
    ['Census date', 'Household population', 'Number of households', 'Average household size'],
    'households-table',
    evidenceName,
  );
  const tbody = table.match(/<tbody[\s\S]*?<\/tbody\s*>/i)?.[0] ?? '';
  const rows: HouseholdRow[] = [];
  for (const match of tbody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi)) {
    const row = match[1];
    const time = row.match(/<time datetime='(\d{4})-\d{2}-\d{2}'/);
    if (!time) throw new Error(`parse: households row without a census <time> in ${evidenceName}`);
    const cells = row
      .split(/<(?:th|td)\b[^>]*>/i)
      .slice(1)
      .map(cellText);
    if (cells.length < 4) throw new Error(`parse: malformed households row in ${evidenceName}`);
    const year = parseInt(time[1], 10);
    rows.push({
      year,
      householdPopulation: parseStrictInt(cells[1], `household population ${year}`, evidenceName),
      count: parseStrictInt(cells[2], `household count ${year}`, evidenceName),
      averageSize: parseStrictDecimal(cells[3], `average household size ${year}`, evidenceName),
    });
  }
  if (rows.length === 0) throw new Error(`parse: households table has no rows in ${evidenceName}`);
  const years = rows.map((r) => r.year);
  if (new Set(years).size !== years.length) {
    throw new Error(`parse: duplicate census year in households table in ${evidenceName}`);
  }
  const row2015 = rows.find((r) => r.year === 2015);
  if (!row2015) throw new Error(`parse: no 2015 row in households table in ${evidenceName}`);
  const notes: string[] = [];
  for (const row of rows) {
    if (row.year !== 2015) {
      notes.push(`household observation for ${row.year} noted but not modeled (canonical record is the 2015 snapshot)`);
    }
  }
  return { row2015, notes };
}

/**
 * Barangay name for output: safe presentation normalization only (Unicode NFC,
 * whitespace collapse, trim). Original casing/punctuation and qualifiers such
 * as `(Poblacion)` are preserved verbatim; matching never fuzzies.
 */
export function normalizeBarangayName(raw: string): string {
  return raw.normalize('NFC').replace(/[\s ]+/g, ' ').trim();
}

function barangayKey(name: string): string {
  return normalizeBarangayName(name).toLowerCase();
}

/** Barangay populations from table#lguTable with tfoot aggregate consistency. */
export function parseBarangays(html: string, evidenceName: string): BarangayRow[] {
  const table = extractTable(html, 'lguTable', evidenceName);
  requireHeaders(
    tableHeaders(table),
    [
      'Barangay',
      'Population percentage (2020)',
      'Population (2020)',
      'Population (2015)',
      'Change (2015‑2020)',
      'Annual Population Growth Rate (2015‑2020)',
    ],
    'lguTable',
    evidenceName,
  );
  const rows = tableRows(table);
  if (rows.length === 0) throw new Error(`parse: lguTable has no rows in ${evidenceName}`);
  const out: BarangayRow[] = [];
  const seen = new Set<string>();
  for (const cells of rows) {
    if (cells.length < 4) throw new Error(`parse: malformed barangay row in ${evidenceName}`);
    const name = normalizeBarangayName(cells[0]);
    if (!name) throw new Error(`parse: blank barangay name in ${evidenceName}`);
    const key = barangayKey(name);
    if (seen.has(key)) throw new Error(`parse: duplicate barangay identity in ${evidenceName}: ${name}`);
    seen.add(key);
    out.push({
      name,
      population2020: parseStrictInt(cells[2], `2020 population of ${name}`, evidenceName),
      population2015: parseStrictInt(cells[3], `2015 population of ${name}`, evidenceName),
    });
  }
  // The source supplies its own totals in <tfoot id='tableTotals'>: parts must agree.
  const tfoot = table.match(/<tfoot[\s\S]*?<\/tfoot\s*>/i)?.[0] ?? '';
  const curPop = tfoot.match(/<td[^>]*id='curPop'[^>]*>([\s\S]*?)<\/td\s*>/i)?.[1];
  const prevPop = tfoot.match(/<td[^>]*id='prevPop'[^>]*>([\s\S]*?)<\/td\s*>/i)?.[1];
  if (curPop === undefined || prevPop === undefined) {
    throw new Error(`parse: lguTable totals row (curPop/prevPop) not found in ${evidenceName}`);
  }
  const sum2020 = out.reduce((n, r) => n + r.population2020, 0);
  const sum2015 = out.reduce((n, r) => n + r.population2015, 0);
  if (sum2020 !== parseStrictInt(curPop, 'barangay 2020 total', evidenceName)) {
    throw new Error(`parse: barangay 2020 parts sum to ${sum2020}, source total disagrees in ${evidenceName}`);
  }
  if (sum2015 !== parseStrictInt(prevPop, 'barangay 2015 total', evidenceName)) {
    throw new Error(`parse: barangay 2015 parts sum to ${sum2015}, source total disagrees in ${evidenceName}`);
  }
  return out;
}

/** Full observation pass: jurisdiction first, then the four covered sections. */
export function parsePsaPhilatlas(html: string, evidenceName: string): PsaPhilatlasObservations {
  if (!html || html.trim() === '') throw new Error(`parse: empty evidence: ${evidenceName}`);
  assertPangasinanJurisdiction(html, evidenceName);
  const total2020 = parseProfileTotal(html, evidenceName);
  const history = parseCensusHistory(html, evidenceName);
  const { row2015, notes: householdNotes } = parseHouseholds(html, evidenceName);
  const barangays = parseBarangays(html, evidenceName);
  const notes: string[] = [
    `${history.length} census row(s) observed`,
    `${barangays.length} barangay row(s) observed`,
    ...householdNotes,
  ];
  return {
    total2020,
    history,
    households2015: { count: row2015.count, year: 2015, averageSize: row2015.averageSize },
    barangays,
    notes,
  };
}

// ---------------------------------------------------------------------------
// Collector: observations -> provisional candidates + exact source instance.
// ---------------------------------------------------------------------------
//
// claimSources convention (verified against scripts/data/promote.ts):
// each candidate data leaf cites the registry id `psa-census-philatlas`
// (NOT an exact id). Promotion resolveClaim (promote.ts ~L102-111) maps a
// registry id with run evidence to the accepted exact source id; identical
// data + identical claims + byte-identical evidence then promotes nothing new
// (promote.ts ~L332-339), while new evidence/values create a real revision
// (~L349-361). Omitting claimSources would also promote, but per-field
// attribution keeps the canonical per-claim traceability contract intact.

export function collectPsaPhilatlas(args: CollectorArgs): ReturnType<Collector> {
  const registryId = args.registryId;
  const obs = parsePsaPhilatlas(args.evidenceText, args.evidenceName);
  const instance = buildSourceInstance({
    registry: args.registry,
    evidenceName: args.evidenceName,
    evidenceBytes: args.evidenceText,
    runId: args.runId,
    collectedBy: args.collectedBy,
    documentType: 'webpage',
    title: `${args.registry.publisher} San Carlos City profile (${args.evidenceName})`,
    notes: `PhilAtlas mirror of PSA census figures; ${obs.history.length} census row(s), ${obs.barangays.length} barangay row(s) observed.`,
  });
  const common = {
    domain: 'demographics',
    type: 'statistic',
    sourceIds: [registryId],
    sourceInstanceIds: [instance.id],
    status: 'provisional' as const,
    collectedBy: args.collectedBy,
    runId: args.runId,
  };
  const candidates: ReturnType<Collector>['candidates'] = [
    {
      ...common,
      id: 'population-total-2020',
      label: 'Total population (2020 census)',
      data: { total: obs.total2020, year: 2020, source: 'PSA 2020 Census of Population and Housing' },
      claimSources: { total: [registryId], year: [registryId], source: [registryId] },
      notes: `Observed 2020 total ${obs.total2020} in ${registryId} evidence ${args.evidenceName}`,
    },
    {
      ...common,
      id: 'demographics-census-history',
      label: 'Census history 1903-2020',
      data: { entries: obs.history.map((e) => ({ year: e.year, population: e.population })) },
      claimSources: { entries: [registryId] },
      notes: `Observed ${obs.history.length} census row(s) in ${registryId} evidence ${args.evidenceName}`,
    },
    {
      ...common,
      id: 'demographics-households',
      label: 'Households (2015 census)',
      data: {
        count: obs.households2015.count,
        year: obs.households2015.year,
        average_size: obs.households2015.averageSize,
      },
      claimSources: { count: [registryId], year: [registryId], average_size: [registryId] },
      notes: `Observed 2015 household count ${obs.households2015.count} in ${registryId} evidence ${args.evidenceName}`,
    },
    {
      ...common,
      id: 'demographics-barangay-populations',
      label: 'Barangay populations 2020/2015',
      data: {
        barangays: obs.barangays.map((b) => ({
          name: b.name,
          population_2020: b.population2020,
          population_2015: b.population2015,
        })),
      },
      claimSources: { barangays: [registryId] },
      notes: `Observed ${obs.barangays.length} barangay row(s) in ${registryId} evidence ${args.evidenceName}`,
    },
  ];
  const notes = [...obs.notes];
  return {
    candidates,
    sourceInstances: [instance],
    coverage: { expectedRecordIds: [...PSA_COVERAGE] },
    notes,
  };
}
