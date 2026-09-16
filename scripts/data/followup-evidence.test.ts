import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDomainJson, buildHealthJson } from './generate';
import { loadRecords, loadRegistry, loadSources, type CivicRecord, type SourceRecord } from './lib/civic';
import { COLLECTORS } from './collectors/index';

// Follow-up civic-evidence integration: provenance, generation, and status
// boundaries for health accreditation, SCCWD identity, DPWH observations,
// and Province appropriation documents.

function srcDoc(id = 'src-doc', registryId = 'philhealth-accredited-facilities'): SourceRecord {
  return {
    id,
    title: 'Fixture doc',
    publisher: 'Fixture',
    url: 'https://example.test/doc',
    documentType: 'webpage',
    retrievedAt: '2026-09-16',
    verifier: 'fixture',
    sourceState: 'active',
    registryId,
  };
}

function healthRecord(overrides: Partial<CivicRecord> & { id: string }): CivicRecord {
  return {
    domain: 'health',
    type: 'facility',
    label: overrides.label ?? overrides.id,
    data: {},
    claimSources: {},
    sourceIds: ['src-doc'],
    status: 'verified',
    riskTier: 'high',
    lastVerified: '2026-09-16',
    acceptedBy: 'fixture',
    acceptedAt: '2026-09-16',
    nextReviewOn: '2027-09-16',
    updateCadence: 'annually',
    ...overrides,
  } as CivicRecord;
}

function healthFixture(): { records: CivicRecord[]; sources: SourceRecord[] } {
  const facility = (id: string, beds: number, category: string) =>
    healthRecord({
      id,
      label: id,
      data: {
        name: id,
        address: 'Some Street, San Carlos City, Pangasinan',
        level: 'Level 2',
        category,
        accreditation: { accredited_by: 'PhilHealth', accredited_beds: beds, accreditation_expiry: '12/31/2026' },
      },
    });
  const cho = healthRecord({
    id: 'city-health-office',
    type: 'directory',
    label: 'City Health Office',
    updateCadence: 'manual',
    nextReviewOn: '2026-09-16',
    sourceIds: ['src-lgu'],
    data: {
      office: 'City Health Office',
      officers: [{ name: 'Dr. A', role: 'City Health Officer' }],
      phone: { number: '(075) 000-0000', status: 'historical - re-verify', source: 'old official site (archived 2017-03-22)' },
    },
  });
  const note = healthRecord({
    id: 'health-publication-note',
    type: 'document',
    label: 'Note',
    updateCadence: 'per-document',
    nextReviewOn: '2026-09-16',
    data: { note: 'accreditation note', gap_note: 'license gap note' },
  });
  return { records: [facility('health-facility-a', 10, 'hospital'), facility('health-facility-b', 5, 'infirmary'), cho, note], sources: [srcDoc(), srcDoc('src-lgu', 'lgu-website')] };
}

test('health emitter keeps the compatibility shape with accreditation mapped', () => {
  const { records, sources } = healthFixture();
  const out = buildHealthJson(records, sources) as {
    _status: string;
    _source: string;
    _note: string;
    city_health_office: Record<string, unknown>;
    facilities: Array<Record<string, unknown>>;
    gap_note: string;
  };
  assert.deepEqual(Object.keys(out), [
    '_schema_version',
    '_status',
    '_updated',
    '_source',
    '_note',
    'city_health_office',
    'facilities',
    'gap_note',
  ]);
  assert.equal(out._status, 'partially-verified');
  assert.ok(out._source.includes('philhealth-accredited-facilities'));
  assert.ok(out._source.includes('lgu-website'));
  assert.equal(out.facilities.length, 2);
  const [a, b] = out.facilities;
  assert.equal(a.type, 'Hospital');
  assert.equal(b.type, 'Infirmary');
  assert.deepEqual(a.accreditation, {
    accredited_by: 'PhilHealth',
    level: 'Level 2',
    accredited_beds: 10,
    accreditation_expiry: '12/31/2026',
  });
  assert.equal(a.license_status, 'pending-verification');
  assert.equal(a.verification, 'philhealth-accredited');
  // Accreditation is never labeled licensure: no license numbers, LTO
  // statuses, or license expiries anywhere in the emitted facilities.
  for (const item of out.facilities) {
    const text = JSON.stringify(item);
    assert.ok(!text.match(/dohLicense|"lto|licenseExpiry|license_number/i), `licensure leak in ${item.name}`);
    assert.equal(item.license_status, 'pending-verification');
    // The evidence disclaimer explicitly states the license absence.
    assert.ok(String(item.evidence).includes('no license numbers'));
  }
});

test('health emitter fails loudly without records or with a dangling source', () => {
  const { records, sources } = healthFixture();
  assert.throws(() => buildHealthJson([], sources), /no canonical health-facility/);
  const bad = healthFixture();
  bad.records[0].sourceIds = ['src-missing'];
  assert.throws(() => buildDomainJson('health', bad.records, bad.sources), /src-missing/);
});

test('dpwh emitter keeps file-level unverified standing with entries passed through', () => {
  const records = loadRecords().records;
  const sources = loadSources().sources;
  const out = buildDomainJson('dpwh', records, sources) as {
    _status: string;
    projects: Array<Record<string, unknown>>;
  };
  assert.equal(out._status, 'unverified');
  assert.ok(out.projects.length >= 4, 'expected the integrated narrative works');
  for (const entry of out.projects) {
    assert.ok(!('project_id' in entry) && !('contractor' in entry), 'no invented project fields');
  }
  assert.ok(!JSON.stringify(out.projects).match(/Gemma|26Aj0046|26A00037|26AJ0050/), 'tenders and non-DPWH works stay out');
});

test('difficult sources gain no collectors', () => {
  const registry = loadRegistry();
  for (const id of ['dilg-fdpp', 'coa-audit', 'blgf', 'dpwh-projects', 'doh-hfsrb', 'lwua']) {
    const entry = registry.sources.find((s) => s.id === id);
    assert.ok(entry, `${id} is registered`);
    assert.equal(entry.collector, null);
  }
  for (const name of ['fdpp', 'coa', 'blgf', 'dpwh', 'doh', 'lwua']) {
    assert.ok(!(name in COLLECTORS), `no ${name} collector module`);
  }
  for (const id of ['philhealth-accredited-facilities', 'sccwd-official']) {
    const entry = registry.sources.find((s) => s.id === id);
    assert.ok(entry, `${id} is registered`);
    assert.equal(entry.collector, null);
  }
});

test('canonical boundaries hold on the promoted state', () => {
  const records = loadRecords().records;
  const byId = new Map(records.map((r) => [r.id, r]));
  // SRE series still ends FY2016; Province docs carry no SRE fields.
  const income = byId.get('fiscal-annual-income');
  assert.ok(income);
  const years = (income.data as { entries: Array<{ year: number }> }).entries.map((e) => e.year);
  assert.equal(Math.max(...years), 2016);
  for (const record of records.filter((r) => r.id.startsWith('transparency-doc-'))) {
    assert.ok(!('annual_regular_income' in record.data) && !('entries' in record.data), `${record.id} carries no SRE series`);
  }
  assert.ok(records.filter((r) => r.id.startsWith('transparency-doc-')).length >= 3);
  // Health records carry accreditation, never licensure or contacts.
  const facilities = records.filter((r) => r.id.startsWith('health-facility-'));
  assert.equal(facilities.length, 6);
  for (const record of facilities) {
    const text = JSON.stringify(record.data);
    assert.ok(!text.match(/dohLicense|lto|phone|email/i), `${record.id} leaks license/contact fields`);
  }
  // Water identity: PrimeWater unresolved, vintage contacts withheld.
  const water = byId.get('utility-water-provider-sccwd');
  assert.ok(water);
  assert.equal((water.data as { joint_venture: { operator_status: string } }).joint_venture.operator_status, 'unresolved');
  assert.ok(!JSON.stringify(water.data).match(/637-6044|531-4202|634-1035/), 'vintage phones are not current facts');
  // CENPELCO coverage intact: no canonical record was modified for electricity.
  const cenpelcoTouched = records.filter((r) => JSON.stringify(r).match(/cenpelco|CENPELCO/i) && r.acceptedBy !== 'civic-data-pipeline-seed');
  assert.equal(cenpelcoTouched.length, 0);
});
