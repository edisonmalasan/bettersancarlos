// CENPELCO public-website collector.
//
// Extracts deliberately scoped facts from a saved CENPELCO homepage shell:
// the cooperative identity and the area-office gallery including
// "San Carlos City (Main)". Emits provisional candidates for exactly two
// stable new IDs. Contact numbers, emails, office hours, addresses, and the
// General Manager identity are visibly out of scope: the public site exposes
// some of them on subpages first seen 2026-09-16 with no stability history,
// so v1 models none of them (see design.md; a follow-up may scope them with
// their own research update).
//
// Anchor strategy (verified against the 2026-09-16 shell structure):
//   provider identity <- <title>CENPELCO Central Pangasinan Electric Cooperative</title>
//   office list       <- "CENPELCO Gallery of Branches" block,
//                        <a href="../branches/<slug>/<slug>.jsp">Name</a> links
// Missing anchors, duplicate office slugs, malformed rows, or ambiguous San
// Carlos identity throw `parse:` so refresh records a parse-class failure and
// diff reports SOURCE_CHANGED (never partial data, never false MISSING).
// Deterministic: same evidence + same run metadata in, same output out.
// No network here; acquisition already happened upstream.
import { buildSourceInstance } from '../lib/instances';
import { cellText } from '../parsers/html';
import type { Collector, CollectorArgs } from './types';

export const CENPELCO_REGISTRY_ID = 'cenpelco';

export const CENPELCO_COVERAGE = ['utility-electricity-provider', 'cenpelco-area-offices'] as const;

export const SAN_CARLOS_MAIN_OFFICE = 'San Carlos City (Main)';

export interface CenpelcoOffice {
  /** Stable identifier from the gallery link slug (e.g. `sancarlos`). */
  id: string;
  /** Official office name, verbatim (e.g. `San Carlos City (Main)`). */
  name: string;
}

export interface CenpelcoObservations {
  providerShort: string;
  providerFull: string;
  sanCarlosOffice: string;
  /** Offices in gallery document order. */
  offices: CenpelcoOffice[];
  notes: string[];
}

/** Gallery block: from the gallery heading through its link list. */
export function extractGallery(html: string, evidenceName: string): string {
  const heading = html.indexOf('CENPELCO Gallery of Branches');
  if (heading < 0) throw new Error(`parse: office gallery anchor not found in ${evidenceName}`);
  const ulOpen = html.indexOf('<ul', heading);
  const ulClose = html.indexOf('</ul>', ulOpen);
  if (ulOpen < 0 || ulClose < 0) throw new Error(`parse: office gallery list not found in ${evidenceName}`);
  return html.slice(ulOpen, ulClose + '</ul>'.length);
}

/** Offices from gallery links; slugs are stable ids, names stay verbatim. */
export function parseCenpelcoOffices(html: string, evidenceName: string): CenpelcoOffice[] {
  const gallery = extractGallery(html, evidenceName);
  const offices: CenpelcoOffice[] = [];
  const seen = new Set<string>();
  for (const match of gallery.matchAll(/<a\s[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a\s*>/gi)) {
    const href = match[2].trim();
    const slug = href.match(/^(?:\.\.\/)?branches\/([a-z0-9-]+)\/([a-z0-9-]+)\.jsp$/i);
    if (!slug || slug[1].toLowerCase() !== slug[2].toLowerCase()) {
      throw new Error(`parse: malformed office link in ${evidenceName}: ${JSON.stringify(href)}`);
    }
    const id = slug[1].toLowerCase();
    if (seen.has(id)) throw new Error(`parse: duplicate office identity in ${evidenceName}: ${id}`);
    seen.add(id);
    const name = cellText(match[3]);
    if (!name) throw new Error(`parse: blank office name in ${evidenceName}: ${JSON.stringify(href)}`);
    offices.push({ id, name });
  }
  if (offices.length === 0) throw new Error(`parse: office gallery has no office links in ${evidenceName}`);
  return offices;
}

/**
 * Cooperative + San Carlos identity guard. The title must identify CENPELCO
 * serving Pangasinan; the gallery must contain exactly the
 * `San Carlos City (Main)` entry and no other San Carlos office variant.
 */
export function parseCenpelcoIdentity(
  html: string,
  gallery: string,
  evidenceName: string,
): { providerShort: string; providerFull: string; sanCarlosOffice: string } {
  const title = cellText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const titleMatch = title.match(/^cenpelco\s+(central pangasinan electric cooperative)$/i);
  if (!titleMatch) throw new Error(`parse: cooperative identity not found in ${evidenceName}`);
  if (!/pangasinan/i.test(cellText(html))) {
    throw new Error(`parse: missing Pangasinan context in ${evidenceName}`);
  }
  const galleryText = cellText(gallery);
  if (!galleryText.includes(SAN_CARLOS_MAIN_OFFICE)) {
    throw new Error(`parse: ${SAN_CARLOS_MAIN_OFFICE} not found in ${evidenceName}`);
  }
  const variants = new Set(
    [...galleryText.matchAll(/san carlos(?:\s+city)?(?:\s*\([^)]*\))?/gi)].map((m) =>
      m[0].replace(/\s+/g, ' ').trim(),
    ),
  );
  variants.delete(SAN_CARLOS_MAIN_OFFICE);
  if (variants.size > 0) {
    throw new Error(
      `parse: ambiguous San Carlos office identity in ${evidenceName}: ${[...variants].join(', ')}`,
    );
  }
  return {
    providerShort: 'CENPELCO',
    providerFull: titleMatch[1].replace(/\s+/g, ' ').trim(),
    sanCarlosOffice: SAN_CARLOS_MAIN_OFFICE,
  };
}

/** Full observation pass: identity first, then the office list. */
export function parseCenpelco(html: string, evidenceName: string): CenpelcoObservations {
  if (!html || html.trim() === '') throw new Error(`parse: empty evidence: ${evidenceName}`);
  const gallery = extractGallery(html, evidenceName);
  const identity = parseCenpelcoIdentity(html, gallery, evidenceName);
  const offices = parseCenpelcoOffices(html, evidenceName);
  const sanCarlos = offices.find((o) => o.name === SAN_CARLOS_MAIN_OFFICE);
  if (!sanCarlos) throw new Error(`parse: ${SAN_CARLOS_MAIN_OFFICE} office row missing in ${evidenceName}`);
  return {
    providerShort: identity.providerShort,
    providerFull: identity.providerFull,
    sanCarlosOffice: sanCarlos.name,
    offices,
    notes: [
      `${offices.length} office(s) observed in gallery order`,
      'contact-number, email, hours, address, GM, rate, outage, and billing subpages linked from the site are out of v1 scope (see design.md deferral)',
    ],
  };
}

// ---------------------------------------------------------------------------
// Collector: observations -> provisional candidates + exact source instance.
// ---------------------------------------------------------------------------

export function collectCenpelco(args: CollectorArgs): ReturnType<Collector> {
  const registryId = args.registryId;
  const obs = parseCenpelco(args.evidenceText, args.evidenceName);
  const instance = buildSourceInstance({
    registry: args.registry,
    evidenceName: args.evidenceName,
    evidenceBytes: args.evidenceText,
    runId: args.runId,
    collectedBy: args.collectedBy,
    documentType: 'webpage',
    title: `${args.registry.publisher} branch listing (${args.evidenceName})`,
    notes: `CENPELCO public homepage shell; ${obs.offices.length} office(s) observed, ${obs.sanCarlosOffice} present.`,
  });
  const sorted = [...obs.offices].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const common = {
    domain: 'utilities',
    type: 'statistic',
    sourceIds: [registryId],
    sourceInstanceIds: [instance.id],
    status: 'provisional' as const,
    collectedBy: args.collectedBy,
    runId: args.runId,
  };
  const providerData = {
    provider_short: obs.providerShort,
    provider_full: obs.providerFull,
    serves_san_carlos_city: true,
    san_carlos_office: obs.sanCarlosOffice,
  };
  const officesData = {
    offices: sorted.map((o) => ({ id: o.id, name: o.name })),
  };
  const candidates: ReturnType<Collector>['candidates'] = [
    {
      ...common,
      id: 'utility-electricity-provider',
      type: 'service',
      label: 'Electricity distribution provider (CENPELCO)',
      data: providerData,
      claimSources: {
        provider_short: [registryId],
        provider_full: [registryId],
        serves_san_carlos_city: [registryId],
        san_carlos_office: [registryId],
      },
      notes: `Observed CENPELCO provider presence with ${obs.sanCarlosOffice} in ${registryId} evidence ${args.evidenceName}`,
    },
    {
      ...common,
      id: 'cenpelco-area-offices',
      type: 'directory',
      label: 'CENPELCO area offices',
      data: officesData,
      claimSources: { offices: [registryId] },
      notes: `Observed ${sorted.length} office(s) in ${registryId} evidence ${args.evidenceName}`,
    },
  ];
  return {
    candidates,
    sourceInstances: [instance],
    coverage: { expectedRecordIds: [...CENPELCO_COVERAGE] },
    notes: obs.notes,
  };
}
