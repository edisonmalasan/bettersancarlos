import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { commitAtomicPair, detectTornPair, recoverAtomicPair } from './atomic';

const FILES = ['records.json', 'sources.json'];

function fixtureDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'civic-atomic-'));
  fs.writeFileSync(path.join(dir, 'records.json'), JSON.stringify({ records: [1] }));
  fs.writeFileSync(path.join(dir, 'sources.json'), JSON.stringify({ sources: ['a'] }));
  return dir;
}

function tree(dir: string): string[] {
  return fs.readdirSync(dir).sort();
}

function contents(dir: string): Record<string, string> {
  return Object.fromEntries(FILES.map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));
}

test('success commits both files and leaves no artifacts', () => {
  const dir = fixtureDir();
  try {
    commitAtomicPair(dir, { 'records.json': { records: [2] }, 'sources.json': { sources: ['b'] } });
    assert.deepEqual(tree(dir), FILES);
    assert.deepEqual(contents(dir), {
      'records.json': JSON.stringify({ records: [2] }, null, 2) + '\n',
      'sources.json': JSON.stringify({ sources: ['b'] }, null, 2) + '\n',
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('pre-staging failure touches nothing', () => {
  const dir = fixtureDir();
  try {
    const before = contents(dir);
    assert.throws(() => commitAtomicPair(dir, { 'records.json': { v: BigInt(1) }, 'sources.json': {} }), TypeError);
    assert.deepEqual(contents(dir), before);
    assert.deepEqual(tree(dir), FILES);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('forced mid-commit failure rolls both files back with no artifacts', () => {
  const dir = fixtureDir();
  try {
    const before = contents(dir);
    assert.throws(
      () =>
        commitAtomicPair(
          dir,
          { 'records.json': { records: [2] }, 'sources.json': { sources: ['b'] } },
          { faultAfterFirstRename: true },
        ),
      /injected fault/,
    );
    assert.deepEqual(contents(dir), before);
    assert.deepEqual(tree(dir), FILES);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('detection lists staged, backup, and legacy temp artifacts', () => {
  const dir = fixtureDir();
  try {
    fs.writeFileSync(path.join(dir, 'records.json.next-111'), '{}');
    fs.writeFileSync(path.join(dir, 'sources.json.prev-222'), '{}');
    fs.writeFileSync(path.join(dir, 'records.json.tmp-333'), '{}');
    assert.deepEqual(detectTornPair(dir, FILES), [
      'records.json.next-111',
      'records.json.tmp-333',
      'sources.json.prev-222',
    ]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('recovery completes a fully staged pair', () => {
  const dir = fixtureDir();
  try {
    const staged = { 'records.json': { records: [9] }, 'sources.json': { sources: ['z'] } };
    for (const [name, value] of Object.entries(staged)) {
      fs.writeFileSync(path.join(dir, `${name}.next-444`), JSON.stringify(value));
    }
    assert.equal(recoverAtomicPair(dir, FILES), 'completed');
    assert.deepEqual(contents(dir), {
      'records.json': JSON.stringify({ records: [9] }),
      'sources.json': JSON.stringify({ sources: ['z'] }),
    });
    assert.deepEqual(tree(dir), FILES);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('recovery restores from backups when no staged pair exists', () => {
  const dir = fixtureDir();
  try {
    const before = contents(dir);
    fs.writeFileSync(path.join(dir, 'records.json'), 'TORN');
    fs.writeFileSync(path.join(dir, 'records.json.prev-555'), before['records.json']);
    fs.writeFileSync(path.join(dir, 'sources.json.prev-555'), before['sources.json']);
    assert.equal(recoverAtomicPair(dir, FILES), 'restored');
    assert.deepEqual(contents(dir), before);
    assert.deepEqual(tree(dir), FILES);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('recovery cleans orphans and reports clean dirs', () => {
  const dir = fixtureDir();
  try {
    assert.equal(recoverAtomicPair(dir, FILES), 'clean');
    fs.writeFileSync(path.join(dir, 'records.json.next-666'), '{"partial": true}');
    assert.equal(recoverAtomicPair(dir, FILES), 'cleaned');
    assert.deepEqual(tree(dir), FILES);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
