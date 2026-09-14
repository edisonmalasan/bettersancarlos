import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildNewsJson, isFbNewsRecord } from './generate';
import { loadRecords, loadSources, type CivicRecord } from './lib/civic';
import { FB_MAX_ITEMS } from './lib/facebook';

function newsRecord(overrides: Partial<CivicRecord> & { id: string }): CivicRecord {
  return {
    domain: 'news',
    type: 'announcement',
    label: overrides.label ?? overrides.id,
    data: {},
    sourceIds: ['src-doc'],
    status: 'verified',
    riskTier: 'low',
    lastVerified: '2026-09-14',
    acceptedBy: 'fixture',
    acceptedAt: '2026-09-14',
    nextReviewOn: '2026-09-14',
    updateCadence: 'manual',
    ...overrides,
  } as CivicRecord;
}

function fixtureTree(): { records: CivicRecord[]; sources: ReturnType<typeof loadSources>['sources'] } {
  const note = newsRecord({
    id: 'news-publication-note',
    type: 'document',
    label: 'Note',
    data: { note: 'recency note' },
  });
  const manual = (id: string, order: number, date: string) =>
    newsRecord({
      id,
      label: id,
      data: { title: id, date, category: 'Announcement', badge: 'info', summary: id, url: null, recency: 'current', order },
    });
  const fb = (id: string, date: string) =>
    newsRecord({
      id,
      label: id,
      status: 'reported',
      data: {
        title: id,
        date,
        category: 'Advisory',
        badge: 'warning',
        summary: id,
        url: 'https://www.facebook.com/post',
        recency: 'current',
      },
      sourceIds: ['lgu-facebook-cio'],
    });
  return {
    records: [note, manual('news-old-manual', 1, '2024-01-01'), manual('news-new-manual', 0, '2025-01-01'), fb('news-fb-a', '2026-09-10'), fb('news-fb-b', '2026-09-11')],
    sources: [],
  };
}

test('isFbNewsRecord detects facebook-sourced items', () => {
  const { records } = fixtureTree();
  assert.ok(isFbNewsRecord(records.find((r) => r.id === 'news-fb-a')!));
  assert.ok(!isFbNewsRecord(records.find((r) => r.id === 'news-new-manual')!));
});

test('emitter keeps manual curated order, then fb newest-first, with the /news shape', () => {
  const { records, sources } = fixtureTree();
  const out = buildNewsJson(records, sources) as {
    _status: string;
    _source: string;
    _note: string;
    news: Array<Record<string, unknown>>;
  };
  assert.deepEqual(Object.keys(out), ['_status', '_source', '_note', 'news']);
  assert.equal(out._status, 'partially-verified');
  assert.equal(out._note, 'recency note');
  assert.ok(out._source.includes('research/news/26-09-news-current-events.md'));
  assert.deepEqual(
    out.news.map((n) => n.id),
    ['new-manual', 'old-manual', 'fb-b', 'fb-a'],
  );
  for (const item of out.news) {
    assert.deepEqual(Object.keys(item), ['id', 'title', 'date', 'category', 'badge', 'summary', 'url', 'recency']);
  }
});

test('fb slice is capped so one noisy run cannot flood the feed', () => {
  const { records, sources } = fixtureTree();
  const many = [...records];
  for (let i = 0; i < FB_MAX_ITEMS + 5; i++) {
    many.push(
      newsRecord({
        id: `news-fb-flood-${i}`,
        label: `flood ${i}`,
        status: 'reported',
        data: {
          title: `flood ${i}`,
          date: '2026-09-12',
          category: 'Announcement',
          badge: 'info',
          summary: 'x',
          url: null,
          recency: 'current',
        },
        sourceIds: ['lgu-facebook-cio'],
      }),
    );
  }
  const out = buildNewsJson(many, sources) as { news: Array<{ id: string }> };
  // 2 manual + capped fb slice.
  assert.equal(out.news.length, 2 + FB_MAX_ITEMS);
});

test('seeded canonical news reproduces the shipped news.json items exactly', () => {
  const records = loadRecords().records;
  const sources = loadSources().sources;
  const out = buildNewsJson(records, sources) as { _status: string; news: unknown[] };
  const shipped = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'news.json'), 'utf8')) as {
    news: unknown[];
  };
  assert.equal(out._status, 'verified');
  assert.deepEqual(out.news, shipped.news);
});

test('generated mirrors stay byte-identical', () => {
  for (const file of ['officials.json', 'emergency-hotlines.json', 'news.json']) {
    const copies = [
      path.join(process.cwd(), 'data', file),
      path.join(process.cwd(), 'public', 'data', file),
    ].filter((p) => fs.existsSync(p));
    assert.ok(copies.length >= 2, `${file} should be mirrored`);
    const hashes = new Set(copies.map((p) => fs.readFileSync(p).toString('base64')));
    assert.equal(hashes.size, 1, `${file} mirrors diverged`);
  }
});
