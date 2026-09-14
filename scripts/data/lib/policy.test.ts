import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CADENCE_POLICY,
  cadenceWindowDays,
  isHighRisk,
  isPublishedStatus,
  isSuccessfulCollectionOutcome,
  isTimeBasedCadence,
  nextReviewDate,
  policyDefaultRiskTier,
  retryDueDays,
  reviewClass,
} from './policy';

test('cadence table covers every cadence with the specified windows', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(CADENCE_POLICY).map(([k, v]) => [k, v.days])),
    {
      daily: 1,
      weekly: 7,
      monthly: 31,
      quarterly: 92,
      annually: 366,
      'per-term': 1461,
      'per-document': 0,
      manual: 0,
      'event-driven': 366,
    },
  );
  assert.equal(cadenceWindowDays('quarterly'), 92);
  assert.equal(cadenceWindowDays('nope'), null);
  assert.equal(isTimeBasedCadence('quarterly'), true);
  assert.equal(isTimeBasedCadence('manual'), false);
  assert.equal(isTimeBasedCadence('per-document'), false);
  assert.equal(isTimeBasedCadence('event-driven'), true);
  assert.equal(isTimeBasedCadence('nope'), false);
});

test('nextReviewDate agrees with the window table', () => {
  assert.equal(nextReviewDate('quarterly', '2026-09-15'), '2026-12-16');
  assert.equal(nextReviewDate('weekly', '2026-09-15'), '2026-09-22');
  assert.equal(nextReviewDate('manual', '2026-09-15'), '2026-09-15');
  assert.equal(nextReviewDate('per-document', '2026-09-15'), '2026-09-15');
});

test('high-risk matrix: tier, domain, and official type', () => {
  // Explicit tier wins upward.
  assert.equal(isHighRisk({ riskTier: 'high', domain: 'news', type: 'announcement' }), true);
  // Every high-impact domain, regardless of tier or type.
  for (const domain of [
    'government',
    'emergency',
    'health',
    'transparency',
    'legislation',
    'barangays',
    'infrastructure',
    'disaster-risk',
  ]) {
    assert.equal(isHighRisk({ domain, type: 'directory' }), true, domain);
    assert.equal(isHighRisk({ riskTier: 'low', domain, type: 'directory' }), true, `${domain} cannot be lowered`);
  }
  // Office holders are high-risk in any domain.
  assert.equal(isHighRisk({ domain: 'barangays', type: 'official' }), true);
  assert.equal(isHighRisk({ domain: 'news', type: 'official' }), true);
  // Low-impact facts stay non-high.
  assert.equal(isHighRisk({ domain: 'news', type: 'announcement' }), false);
  assert.equal(isHighRisk({ riskTier: 'low', domain: 'tourism', type: 'facility' }), false);
  assert.equal(isHighRisk({ domain: 'demographics', type: 'statistic' }), false);
  // Safe defaults for new records.
  assert.equal(policyDefaultRiskTier('government', 'directory'), 'high');
  assert.equal(policyDefaultRiskTier('news', 'official'), 'high');
  assert.equal(policyDefaultRiskTier('news', 'announcement'), 'medium');
});

test('status and outcome classification', () => {
  assert.equal(isPublishedStatus('verified'), true);
  assert.equal(isPublishedStatus('reported'), true);
  assert.equal(isPublishedStatus('provisional'), false);
  assert.equal(isPublishedStatus('blocked'), false);
  assert.equal(isPublishedStatus('needs-reverification'), false);
  assert.equal(isSuccessfulCollectionOutcome('collected'), true);
  assert.equal(isSuccessfulCollectionOutcome('unchanged'), true);
  assert.equal(isSuccessfulCollectionOutcome('failed'), false);
  assert.equal(isSuccessfulCollectionOutcome('unavailable'), false);
  assert.equal(isSuccessfulCollectionOutcome('skipped'), false);
  assert.equal(isSuccessfulCollectionOutcome('unregistered'), false);
});

test('retry table bounds failure recovery without hammering sources', () => {
  assert.equal(retryDueDays('daily'), 1);
  assert.equal(retryDueDays('weekly'), 7);
  assert.equal(retryDueDays('monthly'), 7);
  assert.equal(retryDueDays('quarterly'), 7);
  assert.equal(retryDueDays('annually'), 30);
  assert.equal(retryDueDays('manual'), null);
  assert.equal(retryDueDays('per-document'), null);
  assert.equal(retryDueDays('event-driven'), null);
  assert.equal(retryDueDays('per-term'), null);
});

test('review classes distinguish scheduled from trigger-based review', () => {
  assert.equal(reviewClass('quarterly'), 'scheduled');
  assert.equal(reviewClass('daily'), 'scheduled');
  assert.equal(reviewClass('event-driven'), 'event-driven');
  assert.equal(reviewClass('manual'), 'manual');
  assert.equal(reviewClass('per-document'), 'document');
  assert.equal(reviewClass('nope'), 'scheduled');
});
