import fs from 'node:fs';
import path from 'node:path';
import { loadRecords, loadSources, type CivicRecord, type SourceRecord } from './lib/civic';
import { sha256FileHex, writeJsonAtomic } from './lib/json';

interface EmitContext {
  records: Map<string, CivicRecord>;
  sources: Map<string, SourceRecord>;
}

function requiredRecord(ctx: EmitContext, id: string): CivicRecord {
  const record = ctx.records.get(id);
  if (!record) throw new Error(`generate: missing canonical record: ${id}`);
  return record;
}

function recordSources(ctx: EmitContext, record: CivicRecord): SourceRecord[] {
  return record.sourceIds
    .map((id) => ctx.sources.get(id))
    .filter((s): s is SourceRecord => s !== undefined);
}

// Display label for a source inside generated compatibility files.
// Prefers the direct URL; archived LGU snapshots keep their established
// human-readable label; sources without a captured URL fall back to an
// honest publisher label instead of an invented URL.
export function sourceDisplayLabel(source: SourceRecord): string {
  if (source.sourceState === 'archived' && source.registryId === 'lgu-old-site-archive') {
    const snapshot = /\/web\/(\d{4})(\d{2})(\d{2})\d*\//.exec(source.url ?? '');
    if (snapshot) return `old official site (archived ${snapshot[1]}-${snapshot[2]}-${snapshot[3]})`;
  }
  if (source.url) return source.url;
  return `${source.publisher} (canonical URL unverified)`;
}

// File-level verification standing: verified only when every emitted fact
// record is verified and the domain carries no standing qualification note.
export function aggregateFileStatus(factRecords: CivicRecord[], hasQualificationNote: boolean): string {
  const allVerified = factRecords.every((r) => r.status === 'verified');
  return allVerified && !hasQualificationNote ? 'verified' : 'partially-verified';
}

function registryRefs(ctx: EmitContext, factRecords: CivicRecord[]): string {
  const registryIds = new Set<string>();
  const bareIds = new Set<string>();
  for (const record of factRecords) {
    for (const source of recordSources(ctx, record)) {
      if (source.registryId) registryIds.add(source.registryId);
      else bareIds.add(source.id);
    }
  }
  const parts = [`registry: ${[...registryIds].sort().join(', ')}`];
  if (bareIds.size > 0) parts.push(`sources: ${[...bareIds].sort().join(', ')}`);
  return parts.join('; ');
}

function maxAcceptedAt(factRecords: CivicRecord[]): string {
  return factRecords.map((r) => r.acceptedAt).sort().at(-1) ?? '';
}

function pickPerson(data: Record<string, unknown>): Record<string, unknown> {
  return { name: data.name, title: data.title, image: data.image };
}

function emitOfficials(ctx: EmitContext): Record<string, unknown> {
  const mayor = requiredRecord(ctx, 'city-mayor-current');
  const viceMayor = requiredRecord(ctx, 'city-vice-mayor-current');
  const representative = requiredRecord(ctx, 'district-representative-current');
  const councilorIds = Array.from({ length: 10 }, (_, i) => `sp-member-${String(i + 1).padStart(2, '0')}`);
  const councilors = councilorIds.map((id) => requiredRecord(ctx, id));
  const voters = requiredRecord(ctx, 'registered-voters-2025');
  const histories = ['term-history-2022-2025', 'term-history-2019-2022', 'term-history-2016-2019'].map((id) =>
    requiredRecord(ctx, id),
  );
  const votesNote = ctx.records.get('officials-votes-note');

  const factRecords = [mayor, viceMayor, representative, ...councilors, voters, ...histories];
  const voterSources = recordSources(ctx, voters);
  if (voterSources.length === 0) throw new Error('generate: registered-voters-2025 has no resolvable source');

  return {
    mayor: pickPerson(mayor.data),
    vice_mayor: pickPerson(viceMayor.data),
    representative: pickPerson(representative.data),
    councilors: councilors.map((c) => ({
      ...pickPerson(c.data),
      party: c.data.party,
      votes: c.data.votes,
    })),
    registered_voters: {
      count: voters.data.count,
      election: voters.data.election,
      source: sourceDisplayLabel(voterSources[0]),
    },
    history: histories.map((h) => h.data),
    _term: mayor.data.term,
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/government/26-09-city-officials.md`,
    _status: aggregateFileStatus(factRecords, votesNote?.status === 'verified'),
    _votes_note: votesNote?.data.note ?? '',
  };
}

function emitEmergency(ctx: EmitContext): Record<string, unknown> {
  const nationalIds = [
    'emergency-national-911',
    'emergency-pnp-117',
    'emergency-redcross-143',
    'emergency-complaint-8888',
  ];
  const cityIds = [
    'city-hall-trunk-line',
    'cdrmo-emergency-contact',
    'pnp-sancarlos-contact',
    'bfp-sancarlos-contact',
  ];
  const national = nationalIds.map((id) => requiredRecord(ctx, id));
  const city = cityIds.map((id) => requiredRecord(ctx, id));
  const note = requiredRecord(ctx, 'emergency-publication-note');
  const factRecords = [...national, ...city];

  const entry = (record: CivicRecord): Record<string, unknown> => {
    const sources = recordSources(ctx, record);
    if (sources.length === 0) throw new Error(`generate: ${record.id} has no resolvable source`);
    return {
      service: record.data.service,
      number: record.data.number,
      status: record.status === 'verified' ? 'verified' : 'historical - re-verify',
      source: sourceDisplayLabel(sources[0]),
    };
  };

  return {
    _schema_version: '1.0',
    _status: aggregateFileStatus(factRecords, false),
    _updated: maxAcceptedAt(factRecords),
    _source: `Generated from canonical civic records; ${registryRefs(ctx, factRecords)}; research: research/emergency/26-09-emergency-hotlines.md`,
    _note: note.data.note,
    city: 'San Carlos City',
    province: 'Pangasinan',
    national: national.map(entry),
    city_hotlines: city.map(entry),
  };
}

const EMITTERS: Record<string, { file: string; emit: (ctx: EmitContext) => Record<string, unknown> }> = {
  officials: { file: 'officials.json', emit: emitOfficials },
  emergency: { file: 'emergency-hotlines.json', emit: emitEmergency },
};

function mirrorTargets(root: string, file: string): string[] {
  const targets = [path.join(root, 'data', file), path.join(root, 'public', 'data', file)];
  // src/data mirrors exist only for statically imported files; never create new ones here.
  const srcMirror = path.join(root, 'src', 'data', file);
  if (fs.existsSync(srcMirror)) targets.push(srcMirror);
  return targets;
}

function main(): number {
  const root = process.env.CIVIC_ROOT ?? process.cwd();
  const args = process.argv.slice(2);
  const domainArg = args.find((a) => a.startsWith('--domain='))?.slice('--domain='.length);
  const names = domainArg ? [domainArg] : Object.keys(EMITTERS);
  for (const name of names) {
    if (!EMITTERS[name]) {
      console.error(`generate: unknown domain: ${name} (known: ${Object.keys(EMITTERS).join(', ')})`);
      return 2;
    }
  }

  const ctx: EmitContext = {
    records: new Map(loadRecords(root).records.map((r) => [r.id, r])),
    sources: new Map(loadSources(root).sources.map((s) => [s.id, s])),
  };

  for (const name of names) {
    const { file, emit } = EMITTERS[name];
    const content = emit(ctx);
    const targets = mirrorTargets(root, file);
    for (const target of targets) writeJsonAtomic(target, content);
    // Post-write self-check: every mirror must be byte-identical.
    const hashes = new Set(targets.map((t) => sha256FileHex(t)));
    if (hashes.size !== 1) {
      console.error(`generate: mirror mismatch after writing ${file}`);
      return 1;
    }
    console.log(`generate: wrote ${file} -> ${targets.map((t) => path.relative(root, t)).join(', ')}`);
  }
  return 0;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/data/generate.ts');

if (invokedDirectly) {
  process.exit(main());
}
