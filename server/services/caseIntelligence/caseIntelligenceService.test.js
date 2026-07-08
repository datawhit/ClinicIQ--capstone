import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCaseIntelligenceSummary } from './caseIntelligenceService.js';

// Fixed reference date so tests are deterministic
const NOW = new Date('2026-07-08T00:00:00Z');

const BASE_PATIENT = {
  id: 'PT-001',
  alias: 'Patient A',
  chartNumber: '1047823',
  procedure: 'Root Canal',
  treatmentComplete: false,
  labStatus: null,
  preAuth: null,
  notes: '',
  handoffPartner: null,
  handoffNotes: null,
  isPrimaryProvider: true,
  sharedWithD3: false,
};

describe('buildCaseIntelligenceSummary', () => {
  it('returns the expected output shape for a baseline patient', () => {
    const result = buildCaseIntelligenceSummary({ patient: BASE_PATIENT, visits: [], now: NOW });

    assert.equal(result.patientId, 'PT-001');
    assert.equal(result.alias, 'Patient A');
    assert.equal(result.chartNumber, '1047823');
    assert.equal(result.procedure, 'Root Canal');
    assert.equal(typeof result.status, 'object');
    assert.equal(typeof result.timeline, 'object');
    assert.ok(Array.isArray(result.riskFlags));
    assert.ok(Array.isArray(result.nextSteps));
    assert.equal(typeof result.riskLevel, 'string');
    assert.equal(typeof result.visitCount, 'number');
    assert.equal(typeof result.generatedAt, 'string');
  });

  it('riskLevel is None when patient has no signals', () => {
    const result = buildCaseIntelligenceSummary({ patient: BASE_PATIENT, visits: [], now: NOW });
    assert.equal(result.riskLevel, 'None');
    assert.equal(result.riskFlags.length, 0);
  });

  it('detects appointment_today when nextAppt is today', () => {
    const patient = { ...BASE_PATIENT, nextAppt: '2026-07-08' };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'appointment_today');
    assert.ok(flag, 'appointment_today flag should be present');
    assert.equal(flag.severity, 'High');
    assert.equal(result.riskLevel, 'High');
    assert.ok(result.nextSteps.includes('Prepare the visit plan for today'));
  });

  it('detects appointment_soon when nextAppt is in 1 day', () => {
    const patient = { ...BASE_PATIENT, nextAppt: '2026-07-09' };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'appointment_soon');
    assert.ok(flag, 'appointment_soon flag should be present');
    assert.equal(flag.severity, 'Medium');
  });

  it('detects insurance_denied from preAuth field', () => {
    const patient = { ...BASE_PATIENT, preAuth: 'denied' };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'insurance_denied');
    assert.ok(flag, 'insurance_denied flag should be present');
    assert.equal(flag.severity, 'High');
    assert.ok(result.nextSteps.includes('Escalate insurance pre-auth denial immediately'));
  });

  it('detects lab_delay when lab has been sent for 10 days', () => {
    const patient = { ...BASE_PATIENT, labStatus: 'sent', labSentDate: '2026-06-28' };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'lab_delay');
    assert.ok(flag, 'lab_delay flag should be present');
    assert.equal(flag.severity, 'High');
    assert.equal(result.timeline.labDaysPending, 10);
  });

  it('does not flag lab_delay when lab has been received', () => {
    const patient = {
      ...BASE_PATIENT,
      labStatus: 'sent',
      labSentDate: '2026-06-20',
      labReceivedDate: '2026-06-28',
    };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'lab_delay' || f.flag === 'lab_pending');
    assert.equal(flag, undefined, 'No lab flag when lab is received');
    assert.equal(result.timeline.labDaysPending, null);
  });

  it('detects inactivity_high when no visit in over 60 days', () => {
    const patient = { ...BASE_PATIENT, lastVisit: '2026-04-01' }; // 98 days ago
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'inactivity_high');
    assert.ok(flag, 'inactivity_high flag should be present');
    assert.equal(flag.severity, 'High');
  });

  it('detects inactivity_medium when no visit in 31–60 days', () => {
    const patient = { ...BASE_PATIENT, lastVisit: '2026-06-01' }; // 37 days ago
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'inactivity_medium');
    assert.ok(flag, 'inactivity_medium flag should be present');
    assert.equal(flag.severity, 'Medium');
  });

  it('does not flag inactivity when visit was recent (within 30 days)', () => {
    const patient = { ...BASE_PATIENT, lastVisit: '2026-06-25' }; // 13 days ago
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const inactiveFlag = result.riskFlags.find(
      (f) => f.flag === 'inactivity_high' || f.flag === 'inactivity_medium'
    );
    assert.equal(inactiveFlag, undefined, 'No inactivity flag for recent visit');
  });

  it('detects timeline_overdue when past expected completion', () => {
    const patient = { ...BASE_PATIENT, expectedCompletion: '2026-06-01' }; // 37 days past
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'timeline_overdue');
    assert.ok(flag, 'timeline_overdue flag should be present');
    assert.equal(flag.severity, 'Medium');
    assert.equal(result.timeline.daysPastExpectedCompletion, 37);
  });

  it('detects handoff_pending when handoffPartner is set', () => {
    const patient = { ...BASE_PATIENT, handoffPartner: 'Dr. Smith' };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    const flag = result.riskFlags.find((f) => f.flag === 'handoff_pending');
    assert.ok(flag, 'handoff_pending flag should be present');
    assert.equal(flag.severity, 'Low');
  });

  it('counts visits correctly from visits array', () => {
    const visits = [
      { patient_id: 'PT-001', visit_date: '2026-05-01' },
      { patient_id: 'PT-001', visit_date: '2026-06-01' },
      { patient_id: 'PT-002', visit_date: '2026-06-15' }, // different patient
    ];
    const result = buildCaseIntelligenceSummary({ patient: BASE_PATIENT, visits, now: NOW });
    assert.equal(result.visitCount, 2);
  });

  it('derives lastVisit from visits array when patient.lastVisit is not set', () => {
    const visits = [
      { patient_id: 'PT-001', visit_date: '2026-06-10' },
      { patient_id: 'PT-001', visit_date: '2026-07-01' }, // most recent
    ];
    const result = buildCaseIntelligenceSummary({ patient: BASE_PATIENT, visits, now: NOW });
    assert.equal(result.timeline.lastVisit, '2026-07-01');
    assert.equal(result.timeline.daysSinceLastVisit, 7);
  });

  it('throws when patient is missing', () => {
    assert.throws(() => buildCaseIntelligenceSummary({ visits: [], now: NOW }), /patient with id is required/);
  });

  it('produces multiple risk flags and combines next steps correctly', () => {
    const patient = {
      ...BASE_PATIENT,
      nextAppt: '2026-07-08',     // appointment today → High
      preAuth: 'denied',           // insurance denied → High
      labStatus: 'sent',
      labSentDate: '2026-06-20',  // 18 days pending → High
    };
    const result = buildCaseIntelligenceSummary({ patient, visits: [], now: NOW });
    assert.equal(result.riskLevel, 'High');
    assert.ok(result.riskFlags.length >= 3);
    assert.ok(result.nextSteps.length >= 3);
  });
});
