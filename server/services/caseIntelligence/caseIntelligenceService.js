/**
 * caseIntelligenceService.js
 *
 * Produces a deterministic, explainable case summary for a single patient.
 * No AI/LLM calls — all logic is rule-based and testable.
 *
 * Entry point: buildCaseIntelligenceSummary({ patient, visits, now })
 *
 * Design constraints:
 *  - Pure functions only; no side-effects, no DB access.
 *  - All date fields are TEXT in the DB — normalizeDate() handles that.
 *  - Output shape is stable: callers depend on named fields.
 */

// ── Shared date utilities ─────────────────────────────────────────────────────

function normalizeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Positive = b is after a, negative = b is before a */
function differenceInDays(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b - a) / msPerDay);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLatestVisitDate(patientId, visits = []) {
  const relevant = visits
    .filter((v) => (v.patient_id || v.patientId) === patientId)
    .map((v) => normalizeDate(v.visit_date || v.visitDate))
    .filter(Boolean)
    .sort((a, b) => b - a);
  return relevant[0] || null;
}

function countVisits(patientId, visits = []) {
  return visits.filter((v) => (v.patient_id || v.patientId) === patientId).length;
}

function normalizePreAuth(value) {
  const s = (value || '').toString().toLowerCase().trim();
  if (!s || s === 'not required' || s === 'n/a') return 'not_required';
  if (s.includes('approved')) return 'approved';
  if (s.includes('denied')) return 'denied';
  if (s.includes('submitted') || s.includes('pending')) return 'submitted';
  return 'not_required';
}

function normalizeLabStatus(value) {
  const s = (value || '').toString().toLowerCase().trim();
  if (!s || s === 'n/a' || s === 'not applicable') return null;
  if (s === 'received') return 'received';
  if (s === 'sent') return 'sent';
  return null;
}

// ── Risk flag derivation ──────────────────────────────────────────────────────

/**
 * Derives an ordered array of risk flags for a patient.
 * Each flag has: { flag, label, severity }
 * Severity: 'High' | 'Medium' | 'Low'
 */
function deriveRiskFlags({ timeline, status, patient }) {
  const flags = [];
  const { daysSinceLastVisit, daysUntilNextAppt, labDaysPending, daysPastExpectedCompletion } = timeline;
  const { preAuth, labStatus, hasHandoff } = status;

  // Appointment today or past-due
  if (daysUntilNextAppt !== null && daysUntilNextAppt <= 0) {
    flags.push({ flag: 'appointment_today', label: 'Appointment scheduled today or overdue', severity: 'High' });
  } else if (daysUntilNextAppt !== null && daysUntilNextAppt <= 2) {
    flags.push({ flag: 'appointment_soon', label: 'Appointment in the next 2 days', severity: 'Medium' });
  }

  // Insurance issues
  if (preAuth === 'denied') {
    flags.push({ flag: 'insurance_denied', label: 'Insurance pre-auth was denied', severity: 'High' });
  } else if (preAuth === 'submitted') {
    flags.push({ flag: 'insurance_pending', label: 'Insurance pre-auth is pending', severity: 'Medium' });
  }

  // Lab delays
  if (labStatus === 'sent' && labDaysPending !== null && labDaysPending >= 7) {
    flags.push({ flag: 'lab_delay', label: `Lab case pending for ${labDaysPending} days`, severity: 'High' });
  } else if (labStatus === 'sent' && labDaysPending !== null && labDaysPending >= 3) {
    flags.push({ flag: 'lab_pending', label: `Lab case pending for ${labDaysPending} days`, severity: 'Medium' });
  }

  // Patient inactivity
  if (daysSinceLastVisit !== null && daysSinceLastVisit > 60) {
    flags.push({ flag: 'inactivity_high', label: `No visit in ${daysSinceLastVisit} days`, severity: 'High' });
  } else if (daysSinceLastVisit !== null && daysSinceLastVisit > 30) {
    flags.push({ flag: 'inactivity_medium', label: `No visit in ${daysSinceLastVisit} days`, severity: 'Medium' });
  }

  // Treatment timeline overdue
  if (daysPastExpectedCompletion !== null && daysPastExpectedCompletion > 0) {
    flags.push({
      flag: 'timeline_overdue',
      label: `Treatment expected completion was ${daysPastExpectedCompletion} days ago`,
      severity: 'Medium',
    });
  }

  // Faculty handoff notes
  if (hasHandoff) {
    flags.push({ flag: 'handoff_pending', label: 'Faculty handoff or care transfer is noted', severity: 'Low' });
  }

  // Urgent language in notes
  const notes = (patient.notes || '').toLowerCase();
  if (/urgent|reschedule|today|follow-up/.test(notes)) {
    flags.push({ flag: 'notes_urgent', label: 'Workflow notes contain urgent language', severity: 'Medium' });
  }

  return flags;
}

function deriveRiskLevel(flags) {
  if (flags.some((f) => f.severity === 'High')) return 'High';
  if (flags.some((f) => f.severity === 'Medium')) return 'Medium';
  if (flags.length > 0) return 'Low';
  return 'None';
}

// ── Next-step derivation ──────────────────────────────────────────────────────

function deriveNextSteps(riskFlags) {
  const stepsByFlag = {
    appointment_today: 'Prepare the visit plan for today',
    appointment_soon: 'Confirm the appointment and prep materials',
    insurance_denied: 'Escalate insurance pre-auth denial immediately',
    insurance_pending: 'Track insurance approval status',
    lab_delay: 'Check lab status and contact the lab',
    lab_pending: 'Follow up on the pending lab case',
    inactivity_high: 'Reach out to reschedule the patient',
    inactivity_medium: 'Re-engage the patient before the next cycle',
    timeline_overdue: 'Review treatment progress and revise completion plan',
    handoff_pending: 'Confirm handoff or transfer details with faculty',
    notes_urgent: 'Address the urgent workflow note in clinic planning',
  };

  const steps = riskFlags.map((f) => stepsByFlag[f.flag]).filter(Boolean);
  return steps.length > 0 ? steps : ['Review patient record before next visit'];
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Builds a case intelligence summary for a single patient.
 *
 * @param {object} patient  - Camel-cased patient record (from DB mapping layer)
 * @param {Array}  visits   - All visit records (may span multiple patients; filtered by patientId)
 * @param {Date}   now      - Reference date for all time calculations (injectable for testing)
 * @returns {object} Case summary payload
 */
export function buildCaseIntelligenceSummary({ patient, visits = [], now = new Date() }) {
  if (!patient || !patient.id) {
    throw new Error('buildCaseIntelligenceSummary: patient with id is required');
  }

  // Dates
  const lastVisitDateRecord = normalizeDate(patient.lastVisit || patient.last_visit);
  const lastVisitDateFromLog = getLatestVisitDate(patient.id, visits);
  const lastVisitDate = lastVisitDateRecord || lastVisitDateFromLog;

  const nextApptDate = normalizeDate(patient.nextAppt || patient.next_appt);
  const expectedCompletionDate = normalizeDate(patient.expectedCompletion || patient.expected_completion);
  const treatmentStartDate = normalizeDate(patient.treatmentStart || patient.treatment_start);
  const labSentDate = normalizeDate(patient.labSentDate || patient.lab_sent_date);
  const labReceivedDate = normalizeDate(patient.labReceivedDate || patient.lab_received_date);

  // Timeline deltas
  const daysSinceLastVisit = lastVisitDate ? differenceInDays(lastVisitDate, now) : null;
  const daysUntilNextAppt = nextApptDate ? differenceInDays(now, nextApptDate) : null;
  const daysPastExpectedCompletion = expectedCompletionDate ? differenceInDays(expectedCompletionDate, now) : null;
  const labDaysPending = labSentDate && !labReceivedDate ? differenceInDays(labSentDate, now) : null;

  const timeline = {
    lastVisit: lastVisitDate ? lastVisitDate.toISOString().split('T')[0] : null,
    daysSinceLastVisit,
    nextAppt: nextApptDate ? nextApptDate.toISOString().split('T')[0] : null,
    daysUntilNextAppt,
    expectedCompletion: expectedCompletionDate ? expectedCompletionDate.toISOString().split('T')[0] : null,
    daysPastExpectedCompletion,
    treatmentStart: treatmentStartDate ? treatmentStartDate.toISOString().split('T')[0] : null,
    labDaysPending,
  };

  // Status
  const preAuth = normalizePreAuth(patient.preAuth || patient.pre_auth);
  const labStatus = normalizeLabStatus(patient.labStatus || patient.lab_status);
  const hasHandoff = !!(patient.handoffPartner || patient.handoff_partner || patient.handoffNotes || patient.handoff_notes);

  const status = {
    treatmentComplete: patient.treatmentComplete === true || patient.treatment_complete === true,
    labStatus,
    preAuth,
    hasHandoff,
    isPrimaryProvider: patient.isPrimaryProvider !== false,
    sharedWithD3: patient.sharedWithD3 === true || patient.shared_with_d3 === true,
  };

  // Risk
  const riskFlags = deriveRiskFlags({ timeline, status, patient });
  const riskLevel = deriveRiskLevel(riskFlags);
  const nextSteps = deriveNextSteps(riskFlags);

  return {
    patientId: patient.id,
    alias: patient.alias || patient.id,
    chartNumber: patient.chartNumber || patient.chart_number || '',
    procedure: patient.procedure || '',
    status,
    timeline,
    riskLevel,
    riskFlags,
    nextSteps,
    visitCount: countVisits(patient.id, visits),
    generatedAt: now.toISOString(),
  };
}
