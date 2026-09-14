import type { Candidate, RegistryEntry, SourceInstance } from '../lib/civic';

export interface CollectorArgs {
  registryId: string;
  /** Registry entry for the source (publisher/URL/discovery for instance identity). */
  registry: RegistryEntry;
  evidenceName: string;
  evidenceText: string;
  sourceUrl?: string;
  runId: string;
  collectedBy: string;
}

export interface CollectorOutput {
  candidates: Candidate[];
  /** Exact evidence instances backing the candidates (one per evidence blob). */
  sourceInstances: SourceInstance[];
  notes: string[];
}

export type Collector = (args: CollectorArgs) => CollectorOutput;
