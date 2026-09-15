import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  splitFrontmatter,
  parseFrontmatter,
  discoverDocuments,
  getSections,
  extractTables,
  parseCsv,
  isSourceId,
  looksLikeSourceId,
} from './research';

const FM = [
  'schema: research.v2',
  'id: fix-doc',
  'title: Fix Doc',
  'category: fixcat',
  'research_type: directory',
  'verification_status: partial',
  'temporal_status: mixed',
  'risk: medium',
  'researched_at: 2026-09-04',
  'last_checked: 2026-09-04',
  'canonical_domains:',
  '  - emergency',
].join('\n');

test('frontmatter splits from the body', () => {
  const { raw, body } = splitFrontmatter(`---\n${FM}\n---\n\n# Title\n`, 'research/fixcat/f.md');
  assert.ok(raw.includes('id: fix-doc'));
  assert.ok(body.includes('# Title'));
});

test('file must start with the fence', () => {
  assert.throws(() => splitFrontmatter('# No fence\n', 'research/fixcat/f.md'), /missing frontmatter/);
});

test('unterminated frontmatter fails', () => {
  assert.throws(() => splitFrontmatter('---\ntitle: x\n', 'research/fixcat/f.md'), /unterminated/);
});

test('frontmatter parses with defaults', () => {
  const meta = parseFrontmatter(FM, 'research/fixcat/f.md');
  assert.equal(meta.id, 'fix-doc');
  assert.deepEqual(meta.canonical_domains, ['emergency']);
  assert.deepEqual(meta.data_files, []);
  assert.equal(meta.jurisdiction, null);
});

test('jurisdiction and data_files parse', () => {
  const meta = parseFrontmatter(
    `${FM}\ndata_files:\n  - data/fix.csv\njurisdiction:\n  country: PH\n  province: Pangasinan\n  locality: San Carlos City`,
    'research/fixcat/f.md',
  );
  assert.deepEqual(meta.data_files, ['data/fix.csv']);
  assert.deepEqual(meta.jurisdiction, { country: 'PH', province: 'Pangasinan', locality: 'San Carlos City' });
});

test('unknown frontmatter key fails', () => {
  assert.throws(() => parseFrontmatter(`${FM}\ntags:\n  - x`, 'research/fixcat/f.md'), /unknown frontmatter key/);
});

test('unknown schema fails', () => {
  assert.throws(
    () => parseFrontmatter(FM.replace('research.v2', 'research.v9'), 'research/fixcat/f.md'),
    /unknown schema/,
  );
});

test('discovery orders category-then-file and skips non-governed paths', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'research-discover-'));
  try {
    for (const dir of ['b-cat', 'a-cat', 'runs', 'templates']) {
      fs.mkdirSync(path.join(root, 'research', dir), { recursive: true });
    }
    fs.writeFileSync(path.join(root, 'research', 'b-cat', 'z.md'), '---\n---\n');
    fs.writeFileSync(path.join(root, 'research', 'b-cat', 'a.md'), '---\n---\n');
    fs.writeFileSync(path.join(root, 'research', 'a-cat', 'm.md'), '---\n---\n');
    fs.writeFileSync(path.join(root, 'research', 'a-cat', 'notes.txt'), 'x');
    fs.mkdirSync(path.join(root, 'research', 'runs', '2026-09-14'), { recursive: true });
    fs.writeFileSync(path.join(root, 'research', 'runs', '2026-09-14', 'x.md'), 'x');
    fs.writeFileSync(path.join(root, 'research', 'README.md'), 'x');
    fs.writeFileSync(path.join(root, 'research', 'FORMAT.md'), 'x');
    const found = discoverDocuments(root).map((f) => f.relPath);
    assert.deepEqual(found, [
      'research/a-cat/m.md',
      'research/b-cat/a.md',
      'research/b-cat/z.md',
    ]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('sections split on ## and ### in order', () => {
  const sections = getSections('# T\n\n## Scope\nA\n\n### Sub\nB\n\n## Summary\nC\n');
  assert.deepEqual(
    sections.map((s) => [s.level, s.title]),
    [
      [2, 'Scope'],
      [3, 'Sub'],
      [2, 'Summary'],
    ],
  );
  assert.ok(sections[0].content.includes('A'));
});

test('tables extract; malformed runs are ignored', () => {
  const tables = extractTables('| A | B |\n|---|---|\n| 1 | 2 |\n\n| No delim |\n| x |\n');
  assert.equal(tables.length, 1);
  assert.deepEqual(tables[0].headers, ['A', 'B']);
  assert.deepEqual(tables[0].rows, [['1', '2']]);
});

test('csv parses quotes and rejects ragged rows', () => {
  assert.deepEqual(parseCsv('a,b\n"1,2",3\n', 'f.csv'), [
    ['a', 'b'],
    ['1,2', '3'],
  ]);
  assert.throws(() => parseCsv('a,b\n1\n', 'f.csv'), /ragged/);
  assert.throws(() => parseCsv('a\n"oops\n', 'f.csv'), /unbalanced/);
});

test('source-id shapes', () => {
  assert.ok(isSourceId('S1') && isSourceId('S23'));
  assert.ok(!isSourceId('S01') && !isSourceId('s1') && !isSourceId('S0') && !isSourceId('SGLG'));
  assert.ok(looksLikeSourceId('s1') && looksLikeSourceId('S01'));
  assert.ok(!looksLikeSourceId('SGLG'));
});
