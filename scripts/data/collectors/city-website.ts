// Official LGU website collector (fixture-driven).
//
// Extracts labeled contact numbers from saved site HTML and emits candidates
// only for explicitly watched record IDs. Anything else observed is reported
// in notes (for findings), never synthesized into candidate records.
// Deterministic: the same HTML always produces the same candidates.
import { extractPhones, htmlToText } from '../parsers/html';
import type { Collector, CollectorArgs } from './types';

interface WatchedContact {
  recordId: string;
  service: string;
  // Label fragments that must appear near the number for it to count.
  labels: string[];
}

const WATCHED_CONTACTS: WatchedContact[] = [
  {
    recordId: 'city-hall-trunk-line',
    service: 'City Hall (general trunk line)',
    labels: ['city hall', 'trunk', 'contact', 'telephone', 'tel'],
  },
];

export function collectCityWebsite(args: CollectorArgs): ReturnType<Collector> {
  const text = htmlToText(args.evidenceText, args.evidenceName);
  const observed = extractPhones(text);
  const candidates: ReturnType<Collector>['candidates'] = [];
  const notes: string[] = [`${observed.length} phone-like value(s) observed in evidence`];
  const claimed = new Set<number>();

  for (const watched of WATCHED_CONTACTS) {
    const hit = observed.find((o) => {
      const context = o.context.toLowerCase();
      return watched.labels.some((label) => context.includes(label));
    });
    if (!hit) {
      notes.push(`${watched.recordId} not observed in evidence`);
      continue;
    }
    claimed.add(observed.indexOf(hit));
    candidates.push({
      id: watched.recordId,
      domain: 'emergency',
      type: 'contact',
      label: watched.service,
      data: { service: watched.service, number: hit.number },
      sourceIds: [args.registryId],
      status: 'provisional',
      collectedBy: args.collectedBy,
      runId: args.runId,
      notes: `Observed in ${args.registryId} evidence ${args.evidenceName}: "${hit.context}"`,
    });
  }

  for (let i = 0; i < observed.length; i++) {
    if (!claimed.has(i)) notes.push(`unmapped number ${observed[i].number} (${observed[i].context})`);
  }
  return { candidates, notes };
}
