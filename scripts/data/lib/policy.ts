// Central pipeline policy: the single source of truth for cadence windows,
// retry timing, risk classification, and status/outcome semantics.
//
// Rationale: refresh.ts, promote.ts, validate.ts, diff.ts, and report.ts all
// depended on overlapping local copies of these rules (two cadence→days maps
// that already disagreed on non-scheduled cadences, a hardcoded domain list
// beside a tier default, two copies of the "changing" predicate). Divergence
// here creates correctness bugs (missed reviews, bypassed gates), so every
// business rule lives here and callers import it. Pure functions only,
// no I/O, no network.

import type { Cadence, CivicStatus, RiskTier, RunSourceOutcome } from './civic';

export interface CadenceRule {
  /** Maximum acceptedAt → nextReviewOn span in days. 0 = no scheduled review. */
  days: number;
  /** False for manual / per-document: review is trigger-based, not scheduled. */
  timeBased: boolean;
}

// Windows per the hardened spec: daily 1, weekly 7, monthly 31, quarterly 92,
// annually 366, per-term 1461 (explicit: 3-year terms plus transition),
// event-driven 366. Non-time-based cadences use the nextReviewOn ==
// acceptedAt sentinel instead of a horizon.
export const CADENCE_POLICY: Record<Cadence, CadenceRule> = {
  daily: { days: 1, timeBased: true },
  weekly: { days: 7, timeBased: true },
  monthly: { days: 31, timeBased: true },
  quarterly: { days: 92, timeBased: true },
  annually: { days: 366, timeBased: true },
  'per-term': { days: 1461, timeBased: true },
  'per-document': { days: 0, timeBased: false },
  manual: { days: 0, timeBased: false },
  'event-driven': { days: 366, timeBased: true },
};

export function isTimeBasedCadence(cadence: string): boolean {
  return (CADENCE_POLICY[cadence as Cadence]?.timeBased ?? false) === true;
}

/** Maximum review window in days, or null for unknown cadences. */
export function cadenceWindowDays(cadence: string): number | null {
  const rule = CADENCE_POLICY[cadence as Cadence];
  return rule ? rule.days : null;
}

function addDays(date: string, days: number): string {
  const dt = new Date(date + 'T00:00:00Z');
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Promotion entry point: recompute nextReviewOn from cadence + acceptance date. */
export function nextReviewDate(cadence: Cadence, from: string): string {
  return addDays(from, CADENCE_POLICY[cadence].days);
}

// Domains whose facts are high-impact by nature. riskTier on the record can
// only ever raise classification, never lower it (see isHighRisk).
const HIGH_RISK_DOMAINS = new Set([
  'government',
  'emergency',
  'health',
  'transparency',
  'legislation',
  'barangays',
  'infrastructure',
  'disaster-risk',
]);

export interface RiskInput {
  riskTier?: RiskTier | string;
  domain: string;
  type: string;
}

/** Central high-risk decision: explicit tier, high-impact domain, or office-holder type. */
export function isHighRisk(input: RiskInput): boolean {
  if (input.riskTier === 'high') return true;
  if (HIGH_RISK_DOMAINS.has(input.domain)) return true;
  if (input.type === 'official') return true;
  return false;
}

/** Safe default tier for brand-new records (never silently low for high-impact facts). */
export function policyDefaultRiskTier(domain: string, type: string): RiskTier {
  return isHighRisk({ domain, type }) ? 'high' : 'medium';
}

/** Statuses under which a fact may be presented (subject to labeling rules). */
export function isPublishedStatus(status: string): status is 'verified' | 'reported' {
  return status === 'verified' || status === 'reported';
}

/** Collection outcomes that satisfy a source's normal refresh cadence. */
export function isSuccessfulCollectionOutcome(outcome: string): boolean {
  return outcome === 'collected' || outcome === 'unchanged';
}

/** How soon a failed source becomes due again (days). Null: never automatically. */
export function retryDueDays(cadence: string): number | null {
  switch (cadence as Cadence) {
    case 'daily':
      return 1;
    case 'weekly':
    case 'monthly':
    case 'quarterly':
      return 7;
    case 'annually':
      return 30;
    default:
      return null;
  }
}

/** Review class for reporting: scheduled, event-driven, manual, or document-triggered. */
export function reviewClass(cadence: string): 'scheduled' | 'event-driven' | 'manual' | 'document' {
  if (cadence === 'manual') return 'manual';
  if (cadence === 'per-document') return 'document';
  if (cadence === 'event-driven') return 'event-driven';
  return 'scheduled';
}

/** Re-export for callers that need the outcome vocabulary without importing civic. */
export type { Cadence, CivicStatus, RiskTier, RunSourceOutcome };
