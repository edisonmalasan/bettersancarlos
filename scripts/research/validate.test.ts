import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateResearchRoot } from './validate';

function fm(overrides: Record<string, string> = {}, extra = ''): string {
  const lines = [
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
  ];
  for (const [k, v] of Object.entries(overrides)) {
    const i = lines.findIndex((l) => l === k || l.startsWith(`${k}:`));
    if (i >= 0) lines[i] = `${k}: ${v}`;
    else lines.push(`${k}: ${v}`);
  }
  if (extra) lines.push(extra);
  return lines.join('\n');
}

const REGISTER = [
  '## Sources',
  '',
  '| ID | Publisher | Document | Published | Accessed | Type | URL |',
  '|---|---|---|---|---|---|---|',
  '| S1 | Fix Pub | Fix Doc | 2026-09-01 | 2026-09-04 | official | https://example.test/fix |',
  '| S2 | Archive | Old Doc | 2017-03-22 | 2026-09-04 | archived-official | https://example.test/old |',
  '',
].join('\n');

const DIRECTORY_BODY = [
  '# Fix Doc',
  '',
  '## Scope',
  'Fix scope.',
  '',
  '## Summary',
  'Fix summary.',
  '',
  '## Findings',
  '',
  '### Directory',
  '| ID | Entity | Status | Sources |',
  '|---|---|---|---|',
  '| fix-thing | Thing | verified | S1 |',
  '| fix-other | Other | partial | S1, S2 |',
  '',
  '## Verification & Uncertainty',
  'Mixed confidence documented per row.',
  '',
  '## Conflicts',
  'None identified.',
  '',
  '## Gaps',
  'Current contact for Other.',
  '',
  '## Research Attempts',
  'Attempted fix research on 2026-09-04.',
  '',
  REGISTER,
].join('\n');

const DATASET_BODY = [
  '# Fix Dataset',
  '',
  '## Scope',
  'Fix scope.',
  '',
  '## Summary',
  'Fix summary.',
  '',
  '## Findings',
  '',
  '### Summary',
  'Population 100. | `S1`',
  '',
  '### Dataset',
  '| Year | Value | Sources |',
  '|---|---|---|',
  '| 2020 | 100 | S1 |',
  '',
  '### Methodology',
  'Counted directly. | `S1`',
  '',
  '## Verification & Uncertainty',
  'Single authoritative source.',
  '',
  '## Conflicts',
  'None identified.',
  '',
  '## Gaps',
  'None identified.',
  '',
  REGISTER,
].join('\n');

const GAP_BODY = [
  '# Fix Gap',
  '',
  '## Scope',
  'Fix scope.',
  '',
  '## Summary',
  'No authoritative source found.',
  '',
  '## Research Question',
  'What is the fix provider?',
  '',
  '## Current Conclusion',
  'BLOCKED — do not publish.',
  '',
  '## Gaps',
  'Provider identity.',
  '',
  '## Research Attempts',
  '| Date | Source | Result | Notes |',
  '|---|---|---|---|',
  '| 2026-09-04 | Fix directory | failed | nothing |',
  '',
  REGISTER,
].join('\n');

function tree(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'research-validate-'));
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

function withDoc(meta: Record<string, string>, body: string, filename = '26-09-fix.md'): Record<string, string> {
  return { [`research/fixcat/${filename}`]: `---\n${fm(meta)}\n---\n\n${body}` };
}

function errorsOf(files: Record<string, string>): string[] {
  const root = tree(files);
  try {
    return validateResearchRoot(root).errors;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('valid directory passes', () => {
  assert.deepEqual(errorsOf(withDoc({}, DIRECTORY_BODY)), []);
});

test('valid dataset passes', () => {
  const meta = { id: 'fix-data', research_type: 'dataset', verification_status: 'verified' };
  assert.deepEqual(errorsOf(withDoc(meta, DATASET_BODY, '26-09-fix-data.md')), []);
});

test('valid gap-report passes', () => {
  const meta = { id: 'fix-gap', research_type: 'gap-report', verification_status: 'blocked', temporal_status: 'unknown' };
  assert.deepEqual(errorsOf(withDoc(meta, GAP_BODY, '26-09-fix-gap.md')), []);
});

test('missing frontmatter fails', () => {
  assert.ok(errorsOf({ 'research/fixcat/26-09-fix.md': '# No fence\n' }).some((e) => e.includes('missing frontmatter')));
});

test('duplicate document id fails', () => {
  const a = withDoc({ id: 'same' }, DIRECTORY_BODY, '26-09-a.md');
  const b = withDoc({ id: 'same' }, DIRECTORY_BODY, '26-09-b.md');
  assert.ok(errorsOf({ ...a, ...b }).some((e) => e.includes('duplicate document id')));
});

test('unknown research_type fails', () => {
  assert.ok(
    errorsOf(withDoc({ research_type: 'encyclopedia' }, DIRECTORY_BODY)).some((e) =>
      e.includes('unknown research_type'),
    ),
  );
});

test('combined verification status fails', () => {
  assert.ok(
    errorsOf(withDoc({ verification_status: 'Historical/Partially Verified' }, DIRECTORY_BODY)).some((e) =>
      e.includes('unknown verification_status'),
    ),
  );
});

test('invalid and inverted dates fail', () => {
  assert.ok(
    errorsOf(withDoc({ researched_at: '2026-13-99' }, DIRECTORY_BODY)).some((e) =>
      e.includes('researched_at'),
    ),
  );
  assert.ok(
    errorsOf(withDoc({ last_checked: '2026-09-03' }, DIRECTORY_BODY)).some((e) =>
      e.includes('last_checked must not be earlier'),
    ),
  );
});

test('missing declared sidecar fails', () => {
  const meta = { id: 'fix-side' };
  const extra = 'data_files:\n  - data/missing.csv';
  const files = withDoc(meta, DIRECTORY_BODY);
  files['research/fixcat/26-09-fix.md'] = `---\n${fm(meta, extra)}\n---\n\n${DIRECTORY_BODY}`;
  assert.ok(errorsOf(files).some((e) => e.includes('declared sidecar') && e.includes('missing')));
});

test('malformed csv sidecar fails', () => {
  const extra = 'data_files:\n  - data/bad.csv';
  const files = withDoc({ id: 'fix-csv' }, DIRECTORY_BODY);
  files['research/fixcat/26-09-fix.md'] = `---\n${fm({ id: 'fix-csv' }, extra)}\n---\n\n${DIRECTORY_BODY}`;
  files['research/fixcat/data/bad.csv'] = 'a,b\n1\n';
  assert.ok(errorsOf(files).some((e) => e.includes('does not parse')));
});

test('duplicate entity ids fail', () => {
  const dup = DIRECTORY_BODY.replace('| fix-other | Other | partial | S1, S2 |', '| fix-thing | Other | partial | S1 |');
  assert.ok(errorsOf(withDoc({}, dup)).some((e) => e.includes('duplicate entity ID')));
});

test('orphan sidecar fails', () => {
  const files = withDoc({}, DIRECTORY_BODY);
  files['research/fixcat/data/orphan.csv'] = 'a\n1\n';
  assert.ok(errorsOf(files).some((e) => e.includes('orphan sidecar')));
});

test('dangling source reference fails', () => {
  const bad = DIRECTORY_BODY.replace('| fix-thing | Thing | verified | S1 |', '| fix-thing | Thing | verified | S9 |');
  assert.ok(errorsOf(withDoc({}, bad)).some((e) => e.includes('unknown source reference "S9"')));
});

test('duplicate source id fails', () => {
  const bad = REGISTER.replace(
    '| S2 | Archive | Old Doc | 2017-03-22 | 2026-09-04 | archived-official | https://example.test/old |',
    '| S1 | Archive | Old Doc | 2017-03-22 | 2026-09-04 | archived-official | https://example.test/old |',
  );
  const body = DIRECTORY_BODY.replace(REGISTER, bad);
  assert.ok(errorsOf(withDoc({}, body)).some((e) => e.includes('duplicate source ID')));
});

test('secret fails without printing it', () => {
  const token = 'xoxb-1234567890abcdefghij';
  const body = `${DIRECTORY_BODY}\n## Notes\nLeaked ${token} here.\n`;
  const errs = errorsOf(withDoc({}, body));
  assert.ok(errs.some((e) => e.includes('possible secret')));
  assert.ok(!errs.some((e) => e.includes(token)));
});

test('machine-local absolute path fails', () => {
  const body = `${DIRECTORY_BODY}\n## Notes\nSaved at C:\\Users\\tester\\notes.txt.\n`;
  assert.ok(errorsOf(withDoc({}, body)).some((e) => e.includes('machine-local absolute path')));
});

test('unknown source type fails', () => {
  const bad = REGISTER.replace('| official |', '| blog |');
  const body = DIRECTORY_BODY.replace(REGISTER, bad);
  assert.ok(errorsOf(withDoc({}, body)).some((e) => e.includes('unknown source type')));
});

test('jurisdiction override needs Scope naming', () => {
  const extra = 'jurisdiction:\n  country: PH\n  province: Negros Occidental\n  locality: San Carlos City';
  const files = withDoc({ id: 'fix-j' }, DIRECTORY_BODY);
  files['research/fixcat/26-09-fix.md'] = `---\n${fm({ id: 'fix-j' }, extra)}\n---\n\n${DIRECTORY_BODY}`;
  assert.ok(errorsOf(files).some((e) => e.includes('must name "San Carlos City" in ## Scope')));
  const named = DIRECTORY_BODY.replace('## Scope\nFix scope.', '## Scope\nFix scope in San Carlos City, Negros Occidental.');
  files['research/fixcat/26-09-fix.md'] = `---\n${fm({ id: 'fix-j' }, extra)}\n---\n\n${named}`;
  assert.deepEqual(errorsOf(files), []);
});

test('malformed S reference fails, bare prose passes', () => {
  const bad = DIRECTORY_BODY.replace('| fix-thing | Thing | verified | S1 |', '| fix-thing | Thing | verified | S01 |');
  assert.ok(errorsOf(withDoc({}, bad)).some((e) => e.includes('malformed source reference "S01"')));
  const prose = `${DIRECTORY_BODY}\n## Notes\nSomeone mentioned S9 in passing.\n`;
  assert.deepEqual(errorsOf(withDoc({}, prose)), []);
});

test('missing Directory minimum fails', () => {
  const bad = DIRECTORY_BODY.replace('### Directory\n| ID | Entity | Status | Sources |', '### Directory\nNo table here.');
  assert.ok(errorsOf(withDoc({}, bad)).some((e) => e.includes('no table with an ID column')));
});

test('gap-report with Findings fails', () => {
  const bad = `${GAP_BODY}\n## Findings\n\nStray.\n`;
  const meta = { id: 'fix-gap', research_type: 'gap-report', verification_status: 'blocked', temporal_status: 'unknown' };
  assert.ok(errorsOf(withDoc(meta, bad, '26-09-fix-gap.md')).some((e) => e.includes('must not carry a Findings section')));
});

test('research runs are excluded', () => {
  const files = withDoc({}, DIRECTORY_BODY);
  files['research/runs/2026-09-14/manifest.json'] = '{"runId": "2026-09-14"}';
  files['research/runs/2026-09-14/findings.md'] = '# No frontmatter here\n';
  assert.deepEqual(errorsOf(files), []);
});

test('bad id and category mismatch fail', () => {
  assert.ok(errorsOf(withDoc({ id: 'Fix_Doc' }, DIRECTORY_BODY)).some((e) => e.includes('kebab-case')));
  assert.ok(
    errorsOf(withDoc({ category: 'other' }, DIRECTORY_BODY)).some((e) => e.includes('does not match directory')),
  );
});

test('unknown frontmatter key fails', () => {
  const files = withDoc({}, DIRECTORY_BODY);
  files['research/fixcat/26-09-fix.md'] = `---\n${fm({}, 'nickname: fixy')}\n---\n\n${DIRECTORY_BODY}`;
  assert.ok(errorsOf(files).some((e) => e.includes('unknown frontmatter key')));
});
