import type { Candidate } from '../lib/civic';

export interface CollectorArgs {
  registryId: string;
  evidenceName: string;
  evidenceText: string;
  sourceUrl?: string;
  runId: string;
  collectedBy: string;
}

export interface CollectorOutput {
  candidates: Candidate[];
  notes: string[];
}

export type Collector = (args: CollectorArgs) => CollectorOutput;
