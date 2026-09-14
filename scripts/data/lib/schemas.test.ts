import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { schemasDir } from './paths';

function loadSchema(name: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(schemasDir(), name), 'utf8')) as Record<string, unknown>;
}

function requiredKeys(schema: Record<string, unknown>): string[] {
  return (schema.required ?? []) as string[];
}

test('every schema file loads with a title and a type', () => {
  const files = fs.readdirSync(schemasDir()).filter((f) => f.endsWith('.schema.json'));
  assert.ok(files.includes('source-instances.schema.json'), 'source-instances schema must exist');
  for (const file of files) {
    const schema = loadSchema(file);
    assert.ok(typeof schema.title === 'string' && schema.title.length > 0, `${file} needs a title`);
    assert.ok(typeof schema.type === 'string', `${file} needs a type`);
  }
});

test('source-instances schema versions the artifact and requires evidence identity', () => {
  const schema = loadSchema('source-instances.schema.json');
  assert.deepEqual(requiredKeys(schema), ['version', 'instances']);
  const item = (schema.properties as Record<string, Record<string, unknown>>).instances as unknown as Record<
    string,
    unknown
  >;
  const itemRequired = ((item.items ?? {}) as Record<string, unknown>).required as string[];
  for (const key of ['id', 'registryId', 'title', 'publisher', 'documentType', 'retrievedAt', 'sourceState', 'collectedBy', 'runId']) {
    assert.ok(itemRequired.includes(key), `instance requires ${key}`);
  }
});

test('manifest schema versions backwards-compatibly (absent means v1 legacy)', () => {
  const schema = loadSchema('research-run-manifest.schema.json');
  assert.ok(!requiredKeys(schema).includes('schemaVersion'), 'schemaVersion must stay optional');
  const props = schema.properties as Record<string, Record<string, unknown>>;
  assert.ok(props.schemaVersion, 'manifest schema must define schemaVersion');
  const sources = props.sources as unknown as Record<string, unknown>;
  const itemProps = ((sources.items ?? {}) as Record<string, unknown>).properties as Record<string, unknown>;
  assert.ok(itemProps.coverage, 'manifest source entries must define optional coverage');
  const itemRequired = (((sources.items ?? {}) as Record<string, unknown>).required ?? []) as string[];
  assert.ok(!itemRequired.includes('coverage'), 'coverage must stay optional');
});

test('candidate schema links instances optionally (existing fixtures stay valid)', () => {
  const schema = loadSchema('candidate.schema.json');
  assert.ok(!requiredKeys(schema).includes('sourceInstanceIds'), 'sourceInstanceIds must stay optional');
  const props = schema.properties as Record<string, Record<string, unknown>>;
  assert.ok(props.sourceInstanceIds, 'candidate schema must define sourceInstanceIds');
  assert.deepEqual((props.status as Record<string, unknown>).const, 'provisional');
});

test('fixture instance + candidate satisfy the new contract', () => {
  const instance = {
    id: 'src-lgu-website-2026-09-15-a13f92c1',
    registryId: 'lgu-website',
    title: 'LGU homepage snapshot',
    publisher: 'City Government of San Carlos',
    documentType: 'webpage',
    retrievedAt: '2026-09-15T01:00:00Z',
    sourceState: 'active',
    evidencePath: 'research/runs/2026-09-15/evidence/lgu-website.html',
    sha256: 'a13f92c1'.padEnd(64, '0'),
    collectedBy: 'agent',
    runId: '2026-09-15',
  };
  const schema = loadSchema('source-instances.schema.json');
  const itemRequired = ((((schema.properties as Record<string, Record<string, unknown>>).instances as unknown as Record<string, unknown>).items ?? {}) as Record<string, unknown>).required as string[];
  for (const key of itemRequired) {
    assert.ok(key in instance, `fixture instance missing ${key}`);
  }
  assert.match(instance.id, /^src-[a-z0-9-]+-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9a-f]{8}$/);
  const candidate = {
    id: 'city-hall-trunk-line',
    domain: 'emergency',
    type: 'contact',
    label: 'City Hall',
    data: {},
    sourceIds: ['lgu-website'],
    sourceInstanceIds: [instance.id],
    status: 'provisional',
    collectedBy: 'agent',
    runId: '2026-09-15',
  };
  const candidateSchema = loadSchema('candidate.schema.json');
  for (const key of requiredKeys(candidateSchema)) {
    assert.ok(key in candidate, `fixture candidate missing ${key}`);
  }
});
