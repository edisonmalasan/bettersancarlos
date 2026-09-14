// Facebook Graph API evidence collector (fixture-driven).
//
// Parses a recorded Graph response envelope ({data: [...]}) into provisional
// news candidates with stable IDs using the shared battle-tested transform in
// ../lib/facebook.ts (the same categorize/deriveTitle/validate logic the live
// ingestion path uses). Deterministic: the same posts always produce the same
// candidates.
import { parseJsonEvidence } from '../parsers/json';
import { isValidFbItem, transformFbPost, type FbRawPost } from '../lib/facebook';
import type { Collector, CollectorArgs } from './types';

function sanitizeId(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'post';
}

export function collectFacebook(args: CollectorArgs): ReturnType<Collector> {
  const envelope = parseJsonEvidence(args.evidenceText, args.evidenceName) as { data?: unknown };
  if (!envelope || !Array.isArray(envelope.data)) {
    throw new Error(`parse: expected a Graph envelope {data: [...]} in ${args.evidenceName}`);
  }
  const posts = envelope.data as FbRawPost[];
  const notes: string[] = [`${posts.length} post(s) in evidence`];
  const candidates: ReturnType<Collector>['candidates'] = [];
  let dropped = 0;
  for (const raw of posts) {
    if (!raw || typeof raw.id === 'undefined') {
      notes.push('skipped a post without an id');
      continue;
    }
    const item = transformFbPost(raw);
    if (!isValidFbItem(item)) {
      dropped++;
      continue;
    }
    candidates.push({
      id: `news-fb-${sanitizeId(String(raw.id))}`,
      domain: 'news',
      type: 'announcement',
      label: item.title,
      data: {
        title: item.title,
        date: item.date,
        category: item.category,
        badge: item.badge,
        summary: item.summary,
        url: item.url,
        recency: 'current',
      },
      claimSources: {
        title: [args.registryId],
        date: [args.registryId],
        category: [args.registryId],
        badge: [args.registryId],
        summary: [args.registryId],
        url: [args.registryId],
        recency: [args.registryId],
      },
      sourceIds: [args.registryId],
      status: 'provisional',
      collectedBy: args.collectedBy,
      runId: args.runId,
      notes: `Collected from ${args.registryId} evidence ${args.evidenceName}`,
    });
  }
  if (dropped > 0) notes.push(`dropped ${dropped} invalid item(s) after validation`);
  candidates.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { candidates, notes };
}
