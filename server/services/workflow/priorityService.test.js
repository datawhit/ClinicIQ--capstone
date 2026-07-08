import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePriorityScore, derivePriorityLevel, buildPriorityItem } from './priorityService.js';

test('calculatePriorityScore combines high-impact signals deterministically', () => {
  const score = calculatePriorityScore({
    appointmentToday: true,
    documentationMissing: true,
    insuranceIssue: true,
    labDelay: true,
    followUpNeeded: true,
    graduationRisk: true,
    financialHold: true,
    facultyFollowUp: true,
    patientInactivity: true,
  });

  assert.equal(score, 100);
});

test('derivePriorityLevel maps score bands correctly', () => {
  assert.equal(derivePriorityLevel(85), 'High');
  assert.equal(derivePriorityLevel(40), 'Medium');
  assert.equal(derivePriorityLevel(10), 'Low');
});

test('buildPriorityItem returns the expected contract', () => {
  const item = buildPriorityItem({
    appointmentToday: true,
    reason: 'Needs immediate review',
    recommendedAction: 'Escalate to faculty',
  });

  assert.equal(item.priorityScore, 35);
  assert.equal(item.priorityLevel, 'Medium');
  assert.equal(item.reason, 'Needs immediate review');
  assert.equal(item.recommendedAction, 'Escalate to faculty');
  assert.ok(item.timestamp);
});
