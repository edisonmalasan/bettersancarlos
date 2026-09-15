import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildInventory, buildSummary, renderReadme, INV_START, INV_END, SUM_START, SUM_END } from './index';
import { loadIndexDocuments } from './index';

const FM = (id: string, status: string, checked: string) =>
  [
    'schema: research.v2',
    `id: ${id}`,
    `title: ${id} title`,
    'category: fixcat',
    'research_type: profile',
    'verification_status: ' + status,
    'temporal_status: current',
    'risk: low',
    'researched_at: 2026-09-04',
    `last_checked: ${checked}`,
    'canonical_domains:',
    '  - city-profile',
  ].join('\n');

const BODY = [
  '# T',
  '',
  '## Scope',
  'S.',
  '',
  '## Summary',
  'S.',
  '',
  '## Findings',
  '',
  '### Theme',
  'Words.',
  '',
  '## Sources',
  '',
  '| ID | Publisher | Document | Published | Accessed | Type | URL |',
  '|---|---|---|---|---|---|---|',
  '| S1 | P | D | — | 2026-09-04 | official | https://example.test/ |',
  '',
].join('\n');

function tree(docs: Array<{ id: string; status: string; checked: string }>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'research-index-'));
  for (const d of docs) {
    const dir = path.join(root, 'research', 'fixcat');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `26-09-${d.id}.md`), `---\n${FM(d.id, d.status, d.checked)}\n---\n\n${BODY}`);
  }
  fs.writeFileSync(path.join(root, 'research', 'README.md'), 'x');
  return root;
}

const README = ['# Research', '', INV_START, 'OLD', INV_END, '', SUM_START, 'OLD', SUM_END, ''].join('\n');

test('index renders deterministically and reflects edits', () => {
  const root = tree([
    { id: 'b-doc', status: 'partial', checked: '2026-09-04' },
    { id: 'a-doc', status: 'verified', checked: '2026-09-05' },
  ]);
  try {
    const first = renderReadme(README, loadIndexDocuments(root));
    const second = renderReadme(README, loadIndexDocuments(root));
    assert.equal(first, second);
    assert.ok(first.indexOf('a-doc title') < first.indexOf('b-doc title'), 'ordered by stable id');
    assert.ok(first.includes('Verified: 1') && first.includes('Partial: 1'));
    assert.ok(first.includes('Last research update: 2026-09-05'));
    assert.ok(!first.includes('OLD'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('missing markers fail loudly', () => {
  const root = tree([{ id: 'a-doc', status: 'verified', checked: '2026-09-04' }]);
  try {
    assert.throws(() => renderReadme('# No markers\n', loadIndexDocuments(root)), /missing markers/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('inventory and summary builders shape output', () => {
  const root = tree([{ id: 'a-doc', status: 'blocked', checked: '2026-09-04' }]);
  try {
    const docs = loadIndexDocuments(root);
    assert.ok(buildInventory(docs).startsWith('| Category | Topic | Type |'));
    assert.ok(buildSummary(docs).includes('Blocked: 1'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
