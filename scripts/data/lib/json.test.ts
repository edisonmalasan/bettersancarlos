import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sha256FileHex, sha256Hex, stableStringify, writeJsonAtomic } from './json';

test('stableStringify ignores key order but keeps array order', () => {
  const a = stableStringify({ b: 1, a: { y: [1, 2], x: 's' } });
  const b = stableStringify({ a: { x: 's', y: [1, 2] }, b: 1 });
  assert.equal(a, b);
  assert.notEqual(stableStringify({ a: [1, 2] }), stableStringify({ a: [2, 1] }));
  assert.equal(stableStringify({ a: undefined, b: null }), '{"b":null}');
});

test('sha256 matches the known vector', () => {
  assert.equal(
    sha256Hex('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
});

test('writeJsonAtomic writes content and leaves no temp file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-'));
  try {
    const target = path.join(dir, 'out.json');
    writeJsonAtomic(target, { b: 2 });
    assert.equal(fs.readFileSync(target, 'utf8'), '{\n  "b": 2\n}\n');
    assert.deepEqual(
      fs.readdirSync(dir).filter((f) => f.includes('.tmp-')),
      [],
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('sha256FileHex hashes file bytes', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-'));
  try {
    const target = path.join(dir, 'data.bin');
    fs.writeFileSync(target, 'abc');
    assert.equal(
      sha256FileHex(target),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
