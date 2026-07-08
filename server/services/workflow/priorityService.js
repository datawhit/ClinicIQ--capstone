const PRIORITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export function derivePriorityLevel(priorityScore) {
  if (priorityScore >= 70) return PRIORITY_LEVELS.HIGH;
  if (priorityScore >= 30) return PRIORITY_LEVELS.MEDIUM;
  return PRIORITY_LEVELS.LOW;
}

export function calculatePriorityScore(context = {}) {
  let score = 0;
  const {
    appointmentToday = false,
    documentationMissing = false,
    insuranceIssue = false,
    labDelay = false,
    followUpNeeded = false,
    graduationRisk = false,
    financialHold = false,
    facultyFollowUp = false,
    patientInactivity = false,
  } = context;

  if (appointmentToday) score += 35;
  if (graduationRisk) score += 30;
  if (documentationMissing) score += 25;
  if (insuranceIssue) score += 25;
  if (labDelay) score += 20;
  if (facultyFollowUp) score += 20;
  if (financialHold) score += 20;
  if (followUpNeeded) score += 15;
  if (patientInactivity) score += 10;

  return Math.min(100, Math.max(0, score));
}

export function buildPriorityItem(context = {}) {
  const priorityScore = calculatePriorityScore(context);
  const priorityLevel = derivePriorityLevel(priorityScore);

  return {
    priorityScore,
    priorityLevel,
    reason: context.reason || 'No specific reason provided.',
    recommendedAction: context.recommendedAction || 'Review this item soon.',
    relatedEntity: context.relatedEntity || null,
    timestamp: context.timestamp || new Date().toISOString(),
  };
}
