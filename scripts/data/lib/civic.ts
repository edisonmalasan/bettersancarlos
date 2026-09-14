import fs from 'node:fs';
import { recordsPath, registryPath, sourcesPath } from './paths';
import { readJsonFile } from './json';
import { parseYamlSubset } from './yaml';

export type CivicStatus =
  | 'provisional'
  | 'verified'
  | 'reported'
  | 'needs-reverification'
  | 'blocked'
  | 'retired';

export type Cadence =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'per-term'
  | 'per-document'
  | 'manual'
  | 'event-driven';

export type RiskTier = 'high' | 'medium' | 'low';

export interface CivicRecordHistoryEntry {
  revision: number;
  data: Record<string, unknown>;
  acceptedBy: string;
  acceptedAt: string;
  sourceIds: string[];
  notes?: string;
}

export interface CivicRecord {
  id: string;
  domain: string;
  type: string;
  label: string;
  data: Record<string, unknown>;
  claimSources?: Record<string, string[]>;
  sourceIds: string[];
  status: CivicStatus;
  riskTier?: RiskTier;
  lastVerified: string;
  acceptedBy: string;
  acceptedAt: string;
  nextReviewOn: string;
  updateCadence: Cadence;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  collectedBy?: string;
  notes?: string;
  history?: CivicRecordHistoryEntry[];
}

export interface RecordsFile {
  records: CivicRecord[];
}

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  discovery?: string;
  documentType: string;
  publishedAt?: string | null;
  effectivePeriod?: { from?: string | null; to?: string | null } | null;
  retrievedAt: string;
  verifiedAt?: string | null;
  verifier: string;
  sourceState: 'active' | 'archived' | 'unavailable' | 'moved';
  sha256?: string;
  evidencePath?: string;
  registryId?: string;
  notes?: string;
}

export interface SourcesFile {
  sources: SourceRecord[];
}

export type SourceType = 'website' | 'facebook-page' | 'portal' | 'document' | 'archive' | 'inquiry';

export interface RegistryEntry {
  id: string;
  publisher: string;
  url?: string;
  discovery?: string;
  sourceType: SourceType;
  collector: string | null;
  updateCadence: Cadence;
  riskTier?: RiskTier;
  accessNotes?: string;
  evidenceRef: string;
  domains?: string[];
}

export interface RegistryFile {
  version: number;
  sources: RegistryEntry[];
}

export interface Candidate {
  id: string;
  domain: string;
  type: string;
  label: string;
  data: Record<string, unknown>;
  claimSources?: Record<string, string[]>;
  sourceIds: string[];
  status: 'provisional';
  collectedBy: string;
  runId: string;
  notes?: string;
}

export type RunSourceOutcome =
  | 'collected'
  | 'unchanged'
  | 'unavailable'
  | 'failed'
  | 'skipped'
  | 'unregistered';

export interface RunSourceEntry {
  sourceId: string;
  checkedAt: string;
  outcome: RunSourceOutcome;
  error?: string;
  evidenceSha256?: string;
}

export interface RunManifest {
  runId: string;
  startedAt: string;
  endedAt?: string | null;
  parameters: Record<string, unknown>;
  sources: RunSourceEntry[];
  candidatesProduced?: number;
  conflictsFound?: number;
  collectedBy?: string;
}

export type DiffOutcome =
  | 'UNCHANGED'
  | 'NEW'
  | 'CHANGED'
  | 'MISSING'
  | 'STALE'
  | 'CONFLICT'
  | 'SOURCE_UNAVAILABLE'
  | 'SOURCE_CHANGED';

export function loadRecords(root?: string): RecordsFile {
  return readJsonFile<RecordsFile>(recordsPath(root));
}

export function loadSources(root?: string): SourcesFile {
  return readJsonFile<SourcesFile>(sourcesPath(root));
}

export function loadRegistry(root?: string): RegistryFile {
  return parseYamlSubset(fs.readFileSync(registryPath(root), 'utf8')) as RegistryFile;
}
