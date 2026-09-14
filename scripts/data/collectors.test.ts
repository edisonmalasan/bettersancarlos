import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { fetchText } from './lib/fetch';
import { parseJsonEvidence } from './parsers/json';
import { extractPhones, htmlToText } from './parsers/html';
import { collectCityWebsite } from './collectors/city-website';
import { collectFacebook } from './collectors/facebook';
import { resolveCollector } from './collectors/index';

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

function fbArgs(evidenceText: string = FB_FIXTURE) {
  return {
    registryId: 'lgu-facebook-cio',
    evidenceName: 'graph-fixture.json',
    evidenceText,
    runId: '2026-09-14',
    collectedBy: 'fixture-agent',
  };
}

function siteArgs(evidenceText: string = SITE_FIXTURE) {
  return {
    registryId: 'lgu-website',
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
});

test('city-website collector surfaces a changed number as a new candidate value', () => {
  const changed = collectCityWebsite(siteArgs(SITE_CHANGED_FIXTURE));
  assert.equal(changed.candidates[0].data.number, '(075) 600-9999');
});

test('city-website collector emits nothing when the line is absent', () => {
  const result = collectCityWebsite(siteArgs('<html><body><p>No contacts here.</p></body></html>'));
  assert.deepEqual(result.candidates, []);
  assert.ok(result.notes.some((n) => n.includes('city-hall-trunk-line not observed')));
});

test('resolveCollector refuses unknown or null collectors', () => {
  assert.equal(typeof resolveCollector('facebook'), 'function');
  assert.equal(typeof resolveCollector('city-website'), 'function');
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
