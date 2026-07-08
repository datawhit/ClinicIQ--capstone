import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkflowDashboardSummary } from './workflowSummaryService.js';

test('buildWorkflowDashboardSummary produces explainable summary data from patient workflow records', () => {
  const patients = [
    {
      id: 'PT-1',
      alias: 'P-2026-001',
      chartNumber: '1047823',
      procedure: 'Root Canal - Molar',
      nextAppt: '2026-07-06',
      nextApptTime: '09:00',
      lastVisit: '2026-06-01',
      preAuth: 'Denied',
      labStatus: 'Sent',
      labSentDate: '2026-06-10',
      labReceivedDate: '',
      notes: '',
      treatmentComplete: false,
      expectedCompletion: '2026-08-01',
      handoffPartner: 'Dr. Webb',
      handoffNotes: 'Needs faculty review',
    },
    {
      id: 'PT-2',
      alias: 'P-2026-002',
      chartNumber: '1047824',
      procedure: 'Composite Restoration',
      nextAppt: null,
      nextApptTime: '',
      lastVisit: '2026-04-01',
      preAuth: 'Approved',
      labStatus: 'None',
      labSentDate: '',
      labReceivedDate: '',
      notes: 'Stable case',
      treatmentComplete: false,
      expectedCompletion: '2026-09-01',
      handoffPartner: '',
      handoffNotes: '',
    },
  ];

  const visits = [
    { patient_id: 'PT-1', visit_date: '2026-06-01', procedure: 'Root Canal - Molar' },
    { patient_id: 'PT-2', visit_date: '2026-04-01', procedure: 'Composite Restoration' },
  ];

  const summary = buildWorkflowDashboardSummary({
    patients,
    visits,
    now: new Date('2026-07-06T10:00:00.000Z'),
  });

  assert.equal(summary.summaryTitle, 'Daily workflow priorities');
  assert.equal(summary.priorityItems.length, 2);
  assert.deepEqual(summary.urgencyCounts, { High: 1, Medium: 0, Low: 1 });
  assert.ok(summary.reasons.includes('Insurance issue needs follow-up'));
  assert.ok(summary.recommendedActions.includes('Escalate insurance follow-up'));
  assert.ok(summary.freshnessTimestamp);
  assert.equal(summary.priorityItems[0].priorityLevel, 'High');
});
