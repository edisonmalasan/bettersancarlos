// Facebook Graph API evidence collector (fixture-driven).
//
// Parses a recorded Graph response envelope ({data: [...]}) into provisional
// news candidates with stable IDs. Deterministic: the same posts always
// produce the same candidates. Phase 4 replaces the title/category mapping
// with the battle-tested transform from scripts/sync-facebook.js.
import { parseJsonEvidence } from '../parsers/json';
import type { Collector, CollectorArgs } from './types';

interface GraphPost {
  id?: unknown;
  message?: unknown;
  story?: unknown;
  created_time?: unknown;
  permalink_url?: unknown;
}

function sanitizeId(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'post';
}

function toDate(value: unknown): string {
  const d = new Date(String(value ?? ''));
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function truncate(s: string, max: number): string {
  const clean = s.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + '…';
}

function tier(message: string): string {
  const text = message.toLowerCase();
  if (/(power interruption|brownout|outage|closure|suspend|typhoon|storm|flood|evacuat|advisory|alert|emergency|disaster)/.test(text)) {
    return 'Advisory';
  }
  if (/(groundbreaking|inaugurat|turnover|completed|project|construction|rehabilitation|opened)/.test(text)) {
    return 'Project';
  }
  if (/(invit|join us|will be held|fiesta|festival|celebration|ceremony|seminar|training|event)/.test(text)) {
    return 'Event';
  }
  return 'Announcement';
}

export function collectFacebook(args: CollectorArgs): ReturnType<Collector> {
  const envelope = parseJsonEvidence(args.evidenceText, args.evidenceName) as { data?: unknown };
  if (!envelope || !Array.isArray(envelope.data)) {
    throw new Error(`parse: expected a Graph envelope {data: [...]} in ${args.evidenceName}`);
  }
  const candidates: ReturnType<Collector>['candidates'] = [];
  const notes: string[] = [`${envelope.data.length} post(s) in evidence`];
  for (const raw of envelope.data as GraphPost[]) {
    if (!raw || typeof raw.id === 'undefined') {
      notes.push('skipped a post without an id');
      continue;
    }
    const message = String(raw.message ?? raw.story ?? '');
    const category = tier(message);
    candidates.push({
      id: `news-fb-${sanitizeId(String(raw.id))}`,
      domain: 'news',
      type: 'announcement',
      label: truncate(message.split('\n').find((l) => l.trim()) ?? 'Update', 120) || `${category} Update`,
      data: {
        title: truncate(message.split('\n').find((l) => l.trim()) ?? '', 120) || `${category} Update`,
        date: toDate(raw.created_time),
        category,
        summary: truncate(message, 300),
        url: typeof raw.permalink_url === 'string' ? raw.permalink_url : null,
      },
      sourceIds: [args.registryId],
      status: 'provisional',
      collectedBy: args.collectedBy,
      runId: args.runId,
      notes: `Collected from ${args.registryId} evidence ${args.evidenceName}`,
    });
  }
  candidates.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { candidates, notes };
}
