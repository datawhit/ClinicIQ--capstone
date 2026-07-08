import { derivePriorityLevel } from './priorityService.js';

function normalizeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function differenceInDays(startDate, endDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((endDate - startDate) / msPerDay);
}

function getLatestVisitDate(patient, visits = []) {
  const relevantVisits = visits.filter((visit) => {
    const visitPatientId = visit.patient_id || visit.patientId || visit.patientID;
    return visitPatientId === patient.id;
  });

  const parsedDates = relevantVisits
    .map((visit) => normalizeDate(visit.visit_date || visit.visitDate))
    .filter(Boolean)
    .sort((a, b) => b - a);

  return parsedDates[0] || null;
}

function getPatientSignals(patient, visits = [], now = new Date()) {
  const nextApptDate = normalizeDate(patient.nextAppt || patient.next_appt);
  const lastVisitDate = normalizeDate(patient.lastVisit || patient.last_visit) || getLatestVisitDate(patient, visits);
  const labSentDate = normalizeDate(patient.labSentDate || patient.lab_sent_date);
  const labReceivedDate = normalizeDate(patient.labReceivedDate || patient.lab_received_date);
  const expectedCompletionDate = normalizeDate(patient.expectedCompletion || patient.expected_completion);
  const handoffNotes = patient.handoffNotes || patient.handoff_notes || '';
  const notes = patient.notes || '';
  const preAuth = (patient.preAuth || patient.pre_auth || '').toString();
  const labStatus = (patient.labStatus || patient.lab_status || '').toString();

  const daysUntilAppointment = nextApptDate ? differenceInDays(now, nextApptDate) : null;
  const daysSinceLastVisit = lastVisitDate ? differenceInDays(lastVisitDate, now) : null;
  const labDaysPending = labSentDate && !labReceivedDate ? differenceInDays(labSentDate, now) : null;
  const daysPastExpectedCompletion = expectedCompletionDate ? differenceInDays(expectedCompletionDate, now) : null;

  let score = 0;
  let reason = 'Routine follow-up';
  let recommendedAction = 'Review this patient before clinic';

  if (daysUntilAppointment !== null && daysUntilAppointment <= 0) {
    score += 35;
    reason = 'Appointment is scheduled today';
    recommendedAction = 'Prepare the visit plan for today';
  } else if (daysUntilAppointment !== null && daysUntilAppointment <= 2) {
    score += 20;
    reason = 'Appointment is approaching soon';
    recommendedAction = 'Confirm the visit and prep materials';
  }

  if (preAuth.toLowerCase().includes('denied')) {
    score += 25;
    reason = 'Insurance issue needs follow-up';
    recommendedAction = 'Escalate insurance follow-up';
  } else if (preAuth.toLowerCase().includes('submitted')) {
    score += 10;
    reason = 'Pre-auth is pending review';
    recommendedAction = 'Track insurance approval status';
  }

  if (labStatus.toLowerCase() === 'sent' && labDaysPending !== null && labDaysPending >= 7) {
    score += 20;
    if (reason === 'Routine follow-up') {
      reason = 'Lab case is pending beyond the expected window';
      recommendedAction = 'Check lab status and contact the lab';
    }
  }

  if (daysSinceLastVisit !== null && daysSinceLastVisit > 60) {
    score += 25;
    if (reason === 'Routine follow-up') {
      reason = 'Patient has been inactive for an extended period';
      recommendedAction = 'Reach out to reschedule';
    }
  } else if (daysSinceLastVisit !== null && daysSinceLastVisit > 30) {
    score += 15;
    if (reason === 'Routine follow-up') {
      reason = 'Patient is due for follow-up';
      recommendedAction = 'Re-engage the patient before the next cycle';
    }
  }

  if (handoffNotes && /review|follow|faculty|urgent/i.test(handoffNotes.toLowerCase())) {
    score += 20;
    if (reason === 'Routine follow-up') {
      reason = 'Faculty handoff requires review';
      recommendedAction = 'Escalate to the assigned faculty partner';
    }
  }

  if (daysPastExpectedCompletion !== null && daysPastExpectedCompletion > 0) {
    score += 15;
    if (reason === 'Routine follow-up') {
      reason = 'Treatment timeline is overdue';
      recommendedAction = 'Review treatment progress and next steps';
    }
  }

  if (/reschedule|urgent|follow-up|today/i.test((notes || '').toLowerCase())) {
    score += 10;
    if (reason === 'Routine follow-up') {
      reason = 'Workflow note indicates immediate attention';
      recommendedAction = 'Address the note in clinic planning';
    }
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    reason,
    recommendedAction,
  };
}

export function buildWorkflowDashboardSummary({ patients = [], visits = [], now = new Date() } = {}) {
  const priorityItems = patients
    .map((patient) => {
      const signals = getPatientSignals(patient, visits, now);
      if (signals.score <= 0) return null;

      const priorityScore = signals.score;
      return {
        id: patient.id,
        alias: patient.alias || patient.Alias || patient.id,
        chartNumber: patient.chartNumber || patient.chart_number || '',
        procedure: patient.procedure || patient.procedure_name || '',
        priorityScore,
        priorityLevel: derivePriorityLevel(priorityScore),
        reason: signals.reason,
        recommendedAction: signals.recommendedAction,
        relatedEntity: patient.alias || patient.id,
        timestamp: now.toISOString(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      return (a.alias || '').localeCompare(b.alias || '');
    });

  const urgencyCounts = priorityItems.reduce(
    (acc, item) => {
      acc[item.priorityLevel] = (acc[item.priorityLevel] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const reasons = [...new Set(priorityItems.map((item) => item.reason))];
  const recommendedActions = [...new Set(priorityItems.map((item) => item.recommendedAction))];

  return {
    summaryTitle: 'Daily workflow priorities',
    priorityItems,
    urgencyCounts,
    reasons,
    recommendedActions,
    freshnessTimestamp: now.toISOString(),
  };
}
