import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './lib/research';

// FORMAT.md's ```yaml blocks are normative examples: each must parse as a
// complete valid frontmatter through the same reader the validator uses.
test('documented yaml frontmatter examples stay parser-valid', () => {
  const text = fs.readFileSync(path.join(process.cwd(), 'research', 'FORMAT.md'), 'utf8');
  const fences = [...text.matchAll(/```yaml\r?\n([\s\S]*?)```/g)].map((m) => m[1]);
  assert.ok(fences.length > 0, 'expected at least one yaml example');
  for (const fence of fences) {
    const lines = fence.trim().split(/\r?\n/);
    const core = lines;
    assert.equal(lines[0].trim(), '---', 'example opens with the fence');
    assert.equal(lines[lines.length - 1].trim(), '---', 'example closes with the fence');
    const meta = parseFrontmatter(core.slice(1, -1).join('\n'), 'research/FORMAT.md');
    assert.equal(meta.schema, 'research.v2');
  }
});
