import { test } from 'node:test';
import assert from 'node:assert/strict';

import { collectSourceFiles, scanForClaims, scanText } from './validate-fact-provenance';

test('flags a fee literal', () => {
  const findings = scanText(`const row = { fee: '₱150' };`);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 1);
});

test('flags the label/value pair shape used by the original defect', () => {
  // A fee: key scan alone misses this, which is how the defect shipped.
  const findings = scanText(`  { label: 'Fee', value: '₱50-100' },`);
  assert.equal(findings.length, 1);
  assert.ok(findings[0].text.includes('₱50-100'));
});

test('flags the label/value pair shape with a double-quoted label', () => {
  assert.equal(scanText(`  { label: "Time", value: "Same day" },`).length, 1);
});

test('flags cost, processing time and turnaround variants', () => {
  for (const key of ['cost', 'processingTime', 'processing_time', 'turnaround', 'processing time']) {
    assert.equal(scanText(`const x = { ${key}: '5 days' };`).length, 1, `expected ${key} to be flagged`);
  }
});

test('ignores JSX text nodes and colour classes', () => {
  assert.equal(
    scanText(`<span className="bg-[#fee2e2] text-[#dc2626]">Payments &amp; Fees</span>`).length,
    0,
  );
  assert.equal(scanText(`<h2 className="m-0 text-[1.125rem]">Payments &amp; Fees</h2>`).length, 0);
});

test('ignores values that are not string literals', () => {
  assert.equal(scanText(`const x = { fee: FEE_TABLE[x] };`).length, 0);
  assert.equal(scanText(`const x = { fee: someVar };`).length, 0);
});

test('ignores unrelated keys such as feelsLike', () => {
  assert.equal(scanText(`const w = { feelsLike: 30 };`).length, 0);
});

test('ignores comments that merely name the field', () => {
  assert.equal(scanText(`// fee: '₱150' removed`).length, 0);
  assert.equal(scanText(` * fee: '₱150'`).length, 0);
});

test('reports the correct line number', () => {
  const findings = scanText(
    ['const a = 1;', 'const b = 2;', "const c = { fee: 'Free' };"].join('\n'),
  );
  assert.equal(findings[0].line, 3);
});

test('collectSourceFiles finds source files and skips generated trees', () => {
  const files = collectSourceFiles(`${process.cwd()}/src`);
  assert.ok(files.length > 0);
  assert.ok(files.every((f) => /\.(ts|tsx|js|jsx|mjs)$/.test(f)));
  assert.ok(!files.some((f) => f.includes('node_modules')));
  assert.ok(!files.some((f) => f.includes('.next')));
});

test('no unsourced claims exist in the current source tree', () => {
  assert.deepEqual(scanForClaims({ root: process.cwd() }), []);
});