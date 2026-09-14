import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseYamlSubset } from './yaml';

test('parses the registry shape: version, source list, nested domains', () => {
  const value = parseYamlSubset(
    "version: 1\nsources:\n  - id: lgu-website\n    url: 'https://example.gov.ph/'\n    collector: city-website\n    count: 3\n    ratio: 1.5\n    enabled: true\n    domains:\n      - government\n      - news\n",
  ) as {
    version: number;
    sources: Array<{
      id: string;
      url: string;
      collector: string;
      count: number;
      ratio: number;
      enabled: boolean;
      domains: string[];
    }>;
  };
  assert.equal(value.version, 1);
  assert.equal(value.sources.length, 1);
  assert.equal(value.sources[0].id, 'lgu-website');
  assert.equal(value.sources[0].url, 'https://example.gov.ph/');
  assert.equal(value.sources[0].count, 3);
  assert.equal(value.sources[0].ratio, 1.5);
  assert.equal(value.sources[0].enabled, true);
  assert.deepEqual(value.sources[0].domains, ['government', 'news']);
});

test('null spellings and quoted strings', () => {
  const value = parseYamlSubset(
    "a: null\nb: ~\nc: 'it''s quoted'\nd: \"a\\\"b\"\ne:\n  - x\n",
  ) as Record<string, unknown>;
  assert.equal(value.a, null);
  assert.equal(value.b, null);
  assert.equal(value.c, "it's quoted");
  assert.equal(value.d, 'a"b');
  assert.deepEqual(value.e, ['x']);
});

test('rejects odd indentation', () => {
  assert.throws(() => parseYamlSubset('a:\n   - x\n'), /odd indentation/);
});

test('rejects duplicate keys', () => {
  assert.throws(() => parseYamlSubset('a: 1\na: 2\n'), /duplicate key/);
});

test('rejects flow syntax', () => {
  assert.throws(() => parseYamlSubset('a: {b: c}\n'), /flow syntax/);
});
