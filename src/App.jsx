import { useState, useEffect, useCallback, useRef } from "react";

const NYU = {
  purple: "#6B21A8",
  purpleDark: "#581c87",
  purpleDeep: "#3b0764",
  purpleLight: "#faf5ff",
  purpleMid: "#9333ea",
  accent: "#7c3aed",
  white: "#ffffff",
  offWhite: "#fefcff",
  gray50: "#faf9fb",
  gray100: "#f3f0f7",
  gray200: "#e5dff0",
  gray400: "#a89cbd",
  gray600: "#6b5f7a",
  gray900: "#1e1428",
  green: "#059669",
  greenLight: "#ecfdf5",
  amber: "#b45309",
  amberLight: "#fffbeb",
  red: "#dc2626",
  redLight: "#fef2f2",
  blue: "#2563eb",
  orange: "#c2410c",
  orangeLight: "#fff7ed",
  cream: "#fdf8f0",
  lavender: "#f5f0ff",
};

const THEMES = {
  "nyu-purple": { name:"NYU Purple",  emoji:"🟣", purple:"#6B21A8", purpleDark:"#581c87", purpleDeep:"#3b0764", purpleLight:"#faf5ff", purpleMid:"#9333ea", accent:"#7c3aed", lavender:"#f5f0ff" },
  "ocean":      { name:"Ocean Blue",  emoji:"🔵", purple:"#1d4ed8", purpleDark:"#1e40af", purpleDeep:"#1e3a8a", purpleLight:"#eff6ff", purpleMid:"#3b82f6", accent:"#2563eb", lavender:"#eff6ff" },
  "forest":     { name:"Forest",      emoji:"🟢", purple:"#047857", purpleDark:"#065f46", purpleDeep:"#022c22", purpleLight:"#ecfdf5", purpleMid:"#059669", accent:"#10b981", lavender:"#ecfdf5" },
  "rose":       { name:"Rose",        emoji:"🩷", purple:"#be185d", purpleDark:"#9d174d", purpleDeep:"#500724", purpleLight:"#fdf2f8", purpleMid:"#ec4899", accent:"#f472b6", lavender:"#fdf2f8" },
  "slate":      { name:"Slate",       emoji:"⚫", purple:"#334155", purpleDark:"#1e293b", purpleDeep:"#0f172a", purpleLight:"#f8fafc", purpleMid:"#475569", accent:"#64748b", lavender:"#f1f5f9" },
  "amber":      { name:"Amber",       emoji:"🟡", purple:"#b45309", purpleDark:"#92400e", purpleDeep:"#451a03", purpleLight:"#fffbeb", purpleMid:"#d97706", accent:"#f59e0b", lavender:"#fef9c3" },
};

const TAB_DEFS = {
  today:        { label:"📋  Today" },
  roster:       { label:"👤  Patient Roster" },
  requirements: { label:"🎓  Graduation Goals" },
  calendar:     { label:"📅  Calendar" },
  notebook:     { label:"📓  Notebook" },
};
const DEFAULT_TAB_ORDER = ["today","roster","requirements","calendar","notebook"];
const STAT_DEFS = [
  { id:"total",    label:"Total Patients" },
  { id:"active",   label:"Active" },
  { id:"urgent",   label:"Needs Attention" },
  { id:"complete", label:"Complete" },
  { id:"preauth",  label:"Pre-Auth Alerts" },
];

const DISCIPLINES = [
  "Comprehensive Care","Endodontics","Oral & Maxillofacial Surgery",
  "Orthodontics","Pediatric Dentistry","Periodontics","Prosthodontics",
  "Implant Dentistry","Dental Hygiene","Special Needs Dentistry",
  "Oral Medicine & Pathology","General Dentistry",
];

const REQUIREMENTS = {
  "Comprehensive Care":{ required:10 },"Endodontics":{ required:10 },
  "Oral & Maxillofacial Surgery":{ required:8 },"Orthodontics":{ required:5 },
  "Pediatric Dentistry":{ required:8 },"Periodontics":{ required:12 },
  "Prosthodontics":{ required:10 },"Implant Dentistry":{ required:6 },
  "Dental Hygiene":{ required:15 },"Special Needs Dentistry":{ required:4 },
  "Oral Medicine & Pathology":{ required:4 },"General Dentistry":{ required:20 },
};

const CDT_CODES = {
  "D0120":{ procedure:"Periodic Oral Evaluation", discipline:"Comprehensive Care" },
  "D0140":{ procedure:"Limited Oral Evaluation", discipline:"Comprehensive Care" },
  "D0150":{ procedure:"Comprehensive Oral Evaluation", discipline:"Comprehensive Care" },
  "D0210":{ procedure:"Full Mouth Radiographic Survey", discipline:"Comprehensive Care" },
  "D0220":{ procedure:"Periapical Radiograph", discipline:"Comprehensive Care" },
  "D0330":{ procedure:"Panoramic Radiographic Image", discipline:"Comprehensive Care" },
  "D1110":{ procedure:"Prophylaxis - Adult", discipline:"Dental Hygiene" },
  "D1120":{ procedure:"Prophylaxis - Child", discipline:"Dental Hygiene" },
  "D1206":{ procedure:"Topical Fluoride Varnish", discipline:"Dental Hygiene" },
  "D1351":{ procedure:"Sealant", discipline:"Dental Hygiene" },
  "D2140":{ procedure:"Amalgam Restoration - 1 Surface", discipline:"General Dentistry" },
  "D2150":{ procedure:"Amalgam Restoration - 2 Surfaces", discipline:"General Dentistry" },
  "D2160":{ procedure:"Amalgam Restoration - 3 Surfaces", discipline:"General Dentistry" },
  "D2330":{ procedure:"Resin Composite - 1 Surface Anterior", discipline:"General Dentistry" },
  "D2391":{ procedure:"Resin Composite - 1 Surface Posterior", discipline:"General Dentistry" },
  "D2740":{ procedure:"Crown - Porcelain/Ceramic", discipline:"Prosthodontics" },
  "D2750":{ procedure:"Crown - Porcelain Fused to Metal", discipline:"Prosthodontics" },
  "D2930":{ procedure:"Prefabricated Stainless Steel Crown - Primary", discipline:"Pediatric Dentistry" },
  "D3110":{ procedure:"Pulp Cap - Direct", discipline:"Endodontics" },
  "D3220":{ procedure:"Pulpotomy", discipline:"Endodontics" },
  "D3310":{ procedure:"Root Canal - Anterior", discipline:"Endodontics" },
  "D3320":{ procedure:"Root Canal - Premolar", discipline:"Endodontics" },
  "D3330":{ procedure:"Root Canal - Molar", discipline:"Endodontics" },
  "D3410":{ procedure:"Apicoectomy - Anterior", discipline:"Endodontics" },
  "D4210":{ procedure:"Gingivectomy", discipline:"Periodontics" },
  "D4240":{ procedure:"Gingival Flap Procedure", discipline:"Periodontics" },
  "D4341":{ procedure:"Scaling & Root Planing - 4+ Teeth", discipline:"Periodontics" },
  "D4342":{ procedure:"Scaling & Root Planing - 1-3 Teeth", discipline:"Periodontics" },
  "D4910":{ procedure:"Periodontal Maintenance", discipline:"Periodontics" },
  "D5110":{ procedure:"Complete Denture - Maxillary", discipline:"Prosthodontics" },
  "D5120":{ procedure:"Complete Denture - Mandibular", discipline:"Prosthodontics" },
  "D5213":{ procedure:"Partial Denture - Maxillary", discipline:"Prosthodontics" },
  "D6010":{ procedure:"Implant Placement", discipline:"Implant Dentistry" },
  "D6065":{ procedure:"Implant Crown - Porcelain/Ceramic", discipline:"Implant Dentistry" },
  "D6240":{ procedure:"Pontic - Porcelain Fused to Metal", discipline:"Prosthodontics" },
  "D7140":{ procedure:"Extraction - Erupted Tooth", discipline:"Oral & Maxillofacial Surgery" },
  "D7210":{ procedure:"Extraction - Impacted Tooth, Soft Tissue", discipline:"Oral & Maxillofacial Surgery" },
  "D7240":{ procedure:"Extraction - Impacted Tooth, Completely Bony", discipline:"Oral & Maxillofacial Surgery" },
  "D7310":{ procedure:"Alveoloplasty", discipline:"Oral & Maxillofacial Surgery" },
  "D8010":{ procedure:"Limited Orthodontic Treatment - Primary", discipline:"Orthodontics" },
  "D8080":{ procedure:"Comprehensive Orthodontic Treatment - Adolescent", discipline:"Orthodontics" },
  "D8090":{ procedure:"Comprehensive Orthodontic Treatment - Adult", discipline:"Orthodontics" },
  "D9930":{ procedure:"Treatment of Complications", discipline:"Comprehensive Care" },
  "D9951":{ procedure:"Occlusal Adjustment - Limited", discipline:"Comprehensive Care" },
};

const DISCIPLINE_BENCHMARKS = {
  "Comprehensive Care":{ visits:4 },"Endodontics":{ visits:3 },
  "Oral & Maxillofacial Surgery":{ visits:2 },"Orthodontics":{ visits:18 },
  "Pediatric Dentistry":{ visits:3 },"Periodontics":{ visits:5 },
  "Prosthodontics":{ visits:4 },"Implant Dentistry":{ visits:5 },
  "Dental Hygiene":{ visits:2 },"Special Needs Dentistry":{ visits:4 },
  "Oral Medicine & Pathology":{ visits:3 },"General Dentistry":{ visits:3 },
};

// ── HIPAA-safe alias generator ──
const generateAlias = (index) => {
  const year = new Date().getFullYear();
  return `P-${year}-${String(index + 1).padStart(3, "0")}`;
};

// Attach alias to patient list (stable by index)
const withAliases = (patients) =>
  patients.map((p, i) => ({ ...p, alias: p.alias || generateAlias(i) }));

// ── Pre-Auth & Lab Nudge Engine ──
const today = new Date();
const getDaysSince = (dateStr) => {
  if (!dateStr) return null;
  return Math.floor((today - new Date(dateStr)) / 86400000);
};

const PREAUTH_DAYS_MIN = 21;
const PREAUTH_DAYS_MAX = 28;
const LAB_DAYS_MIN = 7;
const LAB_DAYS_MAX = 14;

const getPreAuthNudge = (patient) => {
  if (patient.preAuth !== "Submitted" || !patient.preAuthSubmittedDate) return null;
  const days = getDaysSince(patient.preAuthSubmittedDate);
  if (days === null) return null;
  if (days >= PREAUTH_DAYS_MIN) return { level:"ready", days, label:`${days}d — check pre-auth`, color:"#059669", bg:"#dcfce7" };
  if (days >= 14) return { level:"soon", days, label:`${days}d — pre-auth soon`, color:"#b45309", bg:"#fef3c7" };
  if (days >= 10) return { level:"watch", days, label:`${days}d — pre-auth watch`, color:"#2563eb", bg:"#dbeafe" };
  return null;
};

const getLabNudge = (patient) => {
  if (!["Sent"].includes(patient.labStatus) || !patient.labSentDate) return null;
  const days = getDaysSince(patient.labSentDate);
  if (days === null) return null;
  if (days >= LAB_DAYS_MAX) return { level:"overdue", days, label:`${days}d — lab overdue`, color:"#dc2626", bg:"#fee2e2" };
  if (days >= LAB_DAYS_MIN) return { level:"ready", days, label:`${days}d — check lab`, color:"#059669", bg:"#dcfce7" };
  return null;
};

const predictCompletion = (patient) => {
  if (patient.treatmentComplete) return null;
  const visitLog = patient.visitLog || [];
  const benchmark = DISCIPLINE_BENCHMARKS[patient.discipline]?.visits || 3;
  const visitsLogged = visitLog.length;
  const visitsRemaining = Math.max(0, benchmark - visitsLogged);

  if (visitsRemaining === 0) {
    return { date:"Soon", label:"Ready for completion", daysOut:0, confidence:"high", factors:[], benchmark, visitsLogged, visitsRemaining };
  }

  // ── Average interval from actual visit history ────────────────────────────
  let avgInterval = 21; // default 3-week cadence
  if (visitLog.length >= 2) {
    const sorted = [...visitLog].sort((a,b) => new Date(a.date)-new Date(b.date));
    const intervals = [];
    for (let i=1;i<sorted.length;i++) intervals.push((new Date(sorted[i].date)-new Date(sorted[i-1].date))/86400000);
    avgInterval = Math.round(intervals.reduce((a,b)=>a+b,0)/intervals.length);
  }

  // ── Base estimate — anchor from next appointment if scheduled ────────────
  let baseDaysFromToday;
  if (patient.nextAppt) {
    const apptDate = new Date(patient.nextAppt);
    const daysToAppt = Math.max(0, Math.round((apptDate - new Date()) / 86400000));
    const remainingAfterAppt = Math.max(0, visitsRemaining - 1);
    baseDaysFromToday = daysToAppt + remainingAfterAppt * avgInterval;
  } else {
    baseDaysFromToday = visitsRemaining * avgInterval;
  }

  // ── Delay factors from lab & pre-auth status ─────────────────────────────
  const factors = [];
  if (patient.labStatus === "Pending")
    factors.push({ label:"Lab work pending", days:14, icon:"🧪" });
  else if (patient.labStatus === "Sent")
    factors.push({ label:"Lab sent — awaiting result", days:7, icon:"🧪" });
  if (patient.preAuth === "Submitted")
    factors.push({ label:"Pre-auth pending approval", days:21, icon:"📋" });
  else if (patient.preAuth === "Denied")
    factors.push({ label:"Pre-auth denied — refile needed", days:30, icon:"⚠️" });

  const delayDays = factors.reduce((sum,f) => sum+f.days, 0);
  const totalDays = baseDaysFromToday + delayDays;

  const projected  = new Date(Date.now() + totalDays * 86400000);
  const bestCase   = new Date(Date.now() + baseDaysFromToday * 86400000);
  const confidence = visitLog.length >= 3 ? "high" : visitLog.length >= 1 ? "medium" : "low";

  return {
    date: projected.toISOString().split("T")[0],
    bestCaseDate: delayDays > 0 ? bestCase.toISOString().split("T")[0] : null,
    label:`${benchmark} visits typical · ${visitsLogged} done · ${visitsRemaining} remaining`,
    daysOut:totalDays, avgInterval, visitsRemaining, benchmark, visitsLogged,
    factors, confidence, delayDays,
  };
};

const DISCIPLINE_AVATAR = {
  "Comprehensive Care":          { bg:"#e0f2fe", color:"#0369a1", initial:"CC" },
  "Endodontics":                 { bg:"#fce7f3", color:"#9d174d", initial:"En" },
  "Oral & Maxillofacial Surgery":{ bg:"#fee2e2", color:"#991b1b", initial:"OS" },
  "Orthodontics":                { bg:"#fef3c7", color:"#92400e", initial:"Or" },
  "Pediatric Dentistry":         { bg:"#dcfce7", color:"#166534", initial:"Pd" },
  "Periodontics":                { bg:"#ede9fe", color:"#5b21b6", initial:"Pe" },
  "Prosthodontics":              { bg:"#dbeafe", color:"#1e40af", initial:"Pr" },
  "Implant Dentistry":           { bg:"#d1fae5", color:"#065f46", initial:"Im" },
  "Dental Hygiene":              { bg:"#fef9c3", color:"#854d0e", initial:"Hy" },
  "Special Needs Dentistry":     { bg:"#ffe4e6", color:"#9f1239", initial:"SN" },
  "Oral Medicine & Pathology":   { bg:"#f3e8ff", color:"#6d28d9", initial:"OM" },
  "General Dentistry":           { bg:"#e0f2fe", color:"#075985", initial:"GD" },
};

const LAB_STATUSES = ["None","Pending","Sent","Received"];
const PREAUTH_STATUSES = ["Not Submitted","Submitted","Approved","Denied"];

// ── Treatment Phase Framework ──────────────────────────────────────────────────
const TREATMENT_PHASES = {
  "0": { label:"Phase 0 – Assessment",        short:"Assessment",   color:"#6366f1", bg:"#eef2ff", followUpDays:7,   description:"Comprehensive exam, X-rays, medical/dental history review. Usually 45–60 min." },
  "I": { label:"Phase I – Acute Care",         short:"Acute Care",   color:"#dc2626", bg:"#fee2e2", followUpDays:14,  description:"Pain relief, emergency extractions, temporary fillings. Goal: stabilize within 0–2 weeks." },
  "II":{ label:"Phase II – Disease Control",   short:"Disease Ctrl", color:"#b45309", bg:"#fef3c7", followUpDays:28,  description:"Scaling & root planing, caries removal, oral hygiene education. Spans 2–4 weeks." },
  "III":{ label:"Phase III – Re-evaluation",   short:"Re-eval",      color:"#0891b2", bg:"#e0f2fe", followUpDays:35,  description:"Reassess healing after Phase II. 4–6 weeks post-disease control. Confirm stability before restorative work." },
  "IV": { label:"Phase IV – Restorative",      short:"Restorative",  color:"#7c3aed", bg:"#f5f3ff", followUpDays:90,  description:"Final restorations, crowns, bridges, implants, orthodontics. 2–3+ months depending on complexity." },
  "V":  { label:"Phase V – Maintenance",       short:"Maintenance",  color:"#059669", bg:"#d1fae5", followUpDays:120, description:"Regular recall, cleanings, monitoring. Every 3–6 months based on patient risk." },
};

const PHASE_KEYS = ["0","I","II","III","IV","V"];

const SPECIALTY_TYPES = [
  "Endodontics","Oral Surgery","Periodontics","Prosthodontics",
  "Orthodontics","Pediatric Dentistry","Oral Medicine","Implant Dentistry","Other"
];
const SPECIALTY_STATUSES = ["Pending","In Progress","Awaiting Report","Complete","Cancelled"];

// ── Predictive Analytics ───────────────────────────────────────────────────────
// Analyze visit history to find preferred day of week (0=Sun…6=Sat)
const WEEKDAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const getPredictedNextAppt = (patient) => {
  const visits = patient.visitLog || [];
  const phase = patient.treatmentPhase || "IV";
  const phaseData = TREATMENT_PHASES[phase] || TREATMENT_PHASES["IV"];
  const followUpDays = phaseData.followUpDays;

  // Anchor date — last visit or today
  const anchorStr = patient.lastVisit || new Date().toISOString().split("T")[0];
  const anchor = new Date(anchorStr);

  // Raw target date from phase timeline
  const rawTarget = new Date(anchor.getTime() + followUpDays * 86400000);

  // Find preferred weekday from visit history
  let preferredDay = null;
  let preferredDayName = null;
  let patternReason = null;

  if (visits.length >= 2) {
    const dayCounts = {};
    visits.forEach(v => {
      const d = new Date(v.date).getDay();
      dayCounts[d] = (dayCounts[d] || 0) + 1;
    });
    const sorted = Object.entries(dayCounts).sort((a,b) => b[1]-a[1]);
    const topDay = parseInt(sorted[0][0]);
    const topCount = sorted[0][1];
    if (topCount / visits.length >= 0.4) { // 40%+ of visits on same day
      preferredDay = topDay;
      preferredDayName = WEEKDAY_NAMES[topDay];
      patternReason = `Patient attended ${topCount} of ${visits.length} visits on ${preferredDayName}s`;
    }
  }

  // Adjust rawTarget to preferred weekday
  let targetDate = new Date(rawTarget);
  if (preferredDay !== null) {
    let dayDiff = (preferredDay - targetDate.getDay() + 7) % 7;
    if (dayDiff === 0) dayDiff = 7; // push to next occurrence if same day
    targetDate.setDate(targetDate.getDate() + dayDiff);
  }

  // Prefer morning time if history shows it
  const apptTimes = visits.map(v => v.apptTime).filter(Boolean);
  let preferredTime = null;
  if (apptTimes.length >= 2) {
    const morningCount = apptTimes.filter(t => parseInt(t) < 12).length;
    if (morningCount / apptTimes.length >= 0.6) preferredTime = "9:00 AM";
  }

  // Build reason string
  const phaseReason = `${phaseData.label} follow-up due in ${followUpDays} days`;
  const reasons = [phaseReason];
  if (patternReason) reasons.push(patternReason);
  if (preferredTime) reasons.push(`Prefers morning appointments`);

  const dateStr = targetDate.toISOString().split("T")[0];
  const daysFromNow = Math.round((targetDate - new Date()) / 86400000);

  return {
    date: dateStr,
    time: preferredTime,
    preferredDay: preferredDayName,
    daysFromNow,
    reasons,
    phaseLabel: phaseData.short,
    followUpDays,
    overdue: daysFromNow < 0,
  };
};

// Phase-based follow-up nudge
const getPhaseNudge = (patient) => {
  if (patient.treatmentComplete) return null;
  const phase = patient.treatmentPhase;
  if (!phase) return null;
  const phaseData = TREATMENT_PHASES[phase];
  if (!phaseData) return null;
  const lastVisit = patient.lastVisit;
  if (!lastVisit) return null;
  const daysSince = Math.floor((new Date() - new Date(lastVisit)) / 86400000);
  const overdue = daysSince > phaseData.followUpDays;
  const dueSoon = daysSince > phaseData.followUpDays * 0.8;
  if (overdue) return { level:"overdue", label:`${phaseData.short} follow-up overdue (${daysSince}d)`, color:"#dc2626", bg:"#fee2e2" };
  if (dueSoon)  return { level:"soon",   label:`${phaseData.short} follow-up due soon`,                 color:"#b45309", bg:"#fef3c7" };
  return null;
};

// Specialty referral nudge
const getSpecialtyNudge = (patient) => {
  if (!patient.specialtyReferral) return null;
  if (patient.specialtyStatus === "Complete" || patient.specialtyStatus === "Cancelled") return null;
  if (!patient.specialtyReferralDate) return { level:"warn", label:"Specialty referral — no date set", color:"#7c3aed", bg:"#f5f3ff" };
  const daysSince = Math.floor((new Date() - new Date(patient.specialtyReferralDate)) / 86400000);
  if (daysSince > 30 && patient.specialtyStatus === "Pending")
    return { level:"overdue", label:`Specialty pending ${daysSince}d — update status`, color:"#dc2626", bg:"#fee2e2" };
  if (daysSince > 14)
    return { level:"soon", label:`Specialty referral open — ${daysSince}d elapsed`, color:"#b45309", bg:"#fef3c7" };
  return null;
};

const BEHAVIOR_DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const analyzeBehavior = (patients, customGoals) => {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const ms = (n) => n * 86400000;
  const dAgoStr = (n) => new Date(now - ms(n)).toISOString().split("T")[0];

  const allVisits = patients.flatMap(p =>
    (p.visitLog||[]).map(v => ({ ...v, discipline:p.discipline, patientId:p.id, isPrimary:p.isPrimaryProvider!==false }))
  );
  const sortedDates = allVisits.map(v=>v.date).filter(Boolean).sort();

  const result = { insights:[], paceTrend:"neutral", last4PerWeek:0, allTimePerWeek:0, last4Visits:0, neglectedDisciplines:[], summary:"" };
  if (sortedDates.length < 1) return result;

  // ── Pace trend ────────────────────────────────────────────────────────────
  const fourWeeksAgo = dAgoStr(28);
  const last4Visits = sortedDates.filter(d=>d>=fourWeeksAgo).length;
  const allTimeWeeks = Math.max(1, (now - new Date(sortedDates[0])) / ms(7));
  const allTimePerWeek = sortedDates.length / allTimeWeeks;
  const last4PerWeek = last4Visits / 4;
  result.last4Visits = last4Visits;
  result.last4PerWeek = last4PerWeek;
  result.allTimePerWeek = allTimePerWeek;

  let paceTrend = "neutral";
  if (allTimePerWeek > 0 && sortedDates.length >= 4) {
    const ratio = last4PerWeek / allTimePerWeek;
    if (ratio < 0.8) paceTrend = "slowing";
    else if (ratio > 1.2) paceTrend = "accelerating";
  }
  result.paceTrend = paceTrend;

  if (paceTrend === "slowing") {
    result.insights.push({ type:"slowing", icon:"📉",
      obs:`Your visit pace has dropped — ${last4Visits} visit${last4Visits!==1?"s":""} in the last 4 weeks vs your all-time average of ${(allTimePerWeek*4).toFixed(1)} per month.`,
      rec:"Consider scheduling extra clinic sessions this week to stay on track." });
  } else if (paceTrend === "accelerating") {
    result.insights.push({ type:"accelerating", icon:"📈",
      obs:`You're on a strong run — ${last4Visits} visits in the last 4 weeks, above your average of ${(allTimePerWeek*4).toFixed(1)} per month.`,
      rec:"Keep this pace and you'll finish requirements ahead of schedule." });
  }

  // ── Preferred clinic day ──────────────────────────────────────────────────
  if (sortedDates.length >= 5) {
    const dayCounts = Array(7).fill(0);
    sortedDates.forEach(d => dayCounts[new Date(d).getDay()]++);
    const maxCount = Math.max(...dayCounts);
    const maxDay = dayCounts.indexOf(maxCount);
    if (maxCount / sortedDates.length >= 0.4) {
      result.preferredDay = BEHAVIOR_DAY_NAMES[maxDay];
      result.insights.push({ type:"preferred_day", icon:"📅",
        obs:`You tend to be most productive on ${BEHAVIOR_DAY_NAMES[maxDay]}s — ${maxCount} of your ${sortedDates.length} visits fell on that day.`,
        rec:`Make sure you have patients scheduled for your next ${BEHAVIOR_DAY_NAMES[maxDay]} session.` });
    }
  }

  // ── Inactivity risk ───────────────────────────────────────────────────────
  const sixtyDaysAgo = dAgoStr(60);
  const recent60 = sortedDates.filter(d=>d>=sixtyDaysAgo).sort();
  let longestGap = 0;
  const gapDates = [...recent60, todayStr];
  for (let i=1; i<gapDates.length; i++) {
    const gap = (new Date(gapDates[i]) - new Date(gapDates[i-1])) / ms(1);
    if (gap > longestGap) longestGap = gap;
  }
  if (recent60.length === 0 && sortedDates.length > 0) {
    longestGap = (now - new Date(sortedDates[sortedDates.length-1])) / ms(1);
  }
  result.longestGap = Math.round(longestGap);
  if (longestGap > 21) {
    result.insights.push({ type:"inactivity", icon:"⚠️",
      obs:`There's been a gap of ${Math.round(longestGap)} days without a logged visit in the last 60 days.`,
      rec:"Your graduation pace requires consistent clinic attendance — consider booking sessions soon." });
  }

  // ── Neglected disciplines ─────────────────────────────────────────────────
  const thirtyDaysAgo = dAgoStr(30);
  const discLastVisit = {};
  allVisits.filter(v=>v.date).forEach(v => {
    if (!discLastVisit[v.discipline] || v.date > discLastVisit[v.discipline]) discLastVisit[v.discipline] = v.date;
  });
  const activeDiscs = [...new Set(patients.filter(p=>!p.treatmentComplete&&p.discipline).map(p=>p.discipline))];
  activeDiscs.forEach(disc => {
    const lastDate = discLastVisit[disc];
    if (!lastDate || lastDate < thirtyDaysAgo) {
      const goal = customGoals?.find(g=>g.discipline===disc);
      const completed = patients.filter(p=>p.discipline===disc&&p.isPrimaryProvider!==false).reduce((s,p)=>s+(p.visitLog?.length||0),0);
      const required = goal?.required||0;
      const remaining = Math.max(0, required-completed);
      const daysSince = lastDate ? Math.round((now-new Date(lastDate))/ms(1)) : null;
      if (remaining > 0) {
        result.neglectedDisciplines.push(disc);
        result.insights.push({ type:"neglected", icon:"🦷",
          obs:`You haven't seen a ${disc} patient in ${daysSince ? daysSince+" days" : "a while"}.`,
          rec:`You still need ${remaining} more case${remaining!==1?"s":""} — consider prioritizing ${disc} this week.` });
      }
    }
  });

  // ── Month-over-month ──────────────────────────────────────────────────────
  const thisMonth = todayStr.slice(0,7);
  const lastMonth = new Date(now.getFullYear(), now.getMonth()-1, 1).toISOString().slice(0,7);
  const thisMonthCount = sortedDates.filter(d=>d.startsWith(thisMonth)).length;
  const lastMonthCount = sortedDates.filter(d=>d.startsWith(lastMonth)).length;
  result.thisMonthCount = thisMonthCount;
  result.lastMonthCount = lastMonthCount;
  if (lastMonthCount > 0) {
    const pctChange = Math.round(((thisMonthCount-lastMonthCount)/lastMonthCount)*100);
    result.momPct = pctChange;
    if (pctChange <= -10) {
      result.insights.push({ type:"mom_decline", icon:"📊",
        obs:`You logged ${Math.abs(pctChange)}% fewer visits this month than last month (${thisMonthCount} vs ${lastMonthCount}).`,
        rec:"If this trend continues your projected graduation date may be delayed — try to pick up the pace." });
    }
  }

  // ── AI summary string ─────────────────────────────────────────────────────
  const parts = [];
  if (paceTrend==="slowing") parts.push(`Student is slowing down — ${last4PerWeek.toFixed(1)} visits/week recently vs ${allTimePerWeek.toFixed(1)} all-time average.`);
  else if (paceTrend==="accelerating") parts.push(`Student is accelerating — ${last4PerWeek.toFixed(1)} visits/week recently vs ${allTimePerWeek.toFixed(1)} all-time average.`);
  if (result.preferredDay) parts.push(`Most productive on ${result.preferredDay}s.`);
  if (longestGap > 21) parts.push(`Has not logged a visit in ${Math.round(longestGap)} days.`);
  result.neglectedDisciplines.slice(0,3).forEach(d => {
    const goal = customGoals?.find(g=>g.discipline===d);
    const completed = patients.filter(p=>p.discipline===d&&p.isPrimaryProvider!==false).reduce((s,p)=>s+(p.visitLog?.length||0),0);
    const remaining = Math.max(0,(goal?.required||0)-completed);
    parts.push(`Has not seen a ${d} patient in over 30 days — ${remaining} case${remaining!==1?"s":""} still needed.`);
  });
  result.summary = parts.join(" ") || "No significant behavioral patterns detected.";

  return result;
};

const generateId = (patients) => `PT-${String(patients.length+1).padStart(3,"0")}`;

const daysDiff = (dateStr) => {
  if (!dateStr) return null;
  return Math.floor((today - new Date(dateStr)) / 86400000);
};
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  return Math.floor((new Date(dateStr) - today) / 86400000);
};

const calculateUrgency = (patient) => {
  if (patient.treatmentComplete) return null;
  const daysSinceSeen = daysDiff(patient.lastVisit);
  const daysToCompletion = daysUntil(patient.expectedCompletion);
  const reasons = [];
  if (daysSinceSeen > 60) reasons.push(`Not seen in ${daysSinceSeen} days`);
  if (!patient.nextAppt) reasons.push("No follow-up scheduled");
  if (daysToCompletion !== null && daysToCompletion <= 30 && daysToCompletion >= 0) reasons.push(`Treatment due in ${daysToCompletion} days`);
  if (daysToCompletion !== null && daysToCompletion < 0) reasons.push("Treatment completion date passed");
  if (patient.preAuth === "Denied") reasons.push("Pre-auth denied");
  // Phase-based nudge
  const phaseNudge = getPhaseNudge(patient);
  if (phaseNudge?.level === "overdue") reasons.push(phaseNudge.label);
  // Specialty nudge
  const specNudge = getSpecialtyNudge(patient);
  if (specNudge?.level === "overdue") reasons.push(specNudge.label);
  if (reasons.length === 0) return null;
  return reasons;
};

const calculateStatus = (patient) => {
  if (patient.treatmentComplete) return "Treatment Complete";
  const urgency = calculateUrgency(patient);
  if (urgency && urgency.length > 0) return "F/U Appt Needed";
  return "Active";
};

const LAB_META = {
  None:{ color:NYU.gray400, bg:NYU.gray100 },
  Pending:{ color:NYU.amber, bg:"#fef3c7" },
  Sent:{ color:NYU.blue, bg:"#dbeafe" },
  Received:{ color:NYU.green, bg:"#dcfce7" },
};
const PREAUTH_META = {
  "Not Submitted":{ color:NYU.gray400, bg:NYU.gray100 },
  Submitted:{ color:NYU.blue, bg:"#dbeafe" },
  Approved:{ color:NYU.green, bg:"#dcfce7" },
  Denied:{ color:NYU.red, bg:"#fee2e2" },
};

const emptyPatient = {
  chartNumber:"", procedure:"", discipline:"General Dentistry",
  lastVisit:"", treatmentStart:"", expectedCompletion:"",
  nextAppt:null, nextApptTime:"", treatmentComplete:false,
  labStatus:"None", labSentDate:"", labReceivedDate:"",
  preAuth:"Not Submitted", preAuthSubmittedDate:"",
  notes:"", visitLog:[],
  handoffPartner:"", handoffPartnerYear:"D3", handoffNotes:"",
  patientLanguage:"English",
  isPrimaryProvider:true, sharedWithD3:false,
  patientType:"In-Clinic", referringFaculty:"",
  // Predictive Nudge & Phase
  treatmentPhase:"IV",
  // Specialty Referral
  specialtyReferral:false, specialtyType:"", specialtyStatus:"Pending", specialtyReferralDate:"",
  // Transfer
  transferredTo:"", transferDate:"",
};

const SUPPORTED_LANGUAGES = [
  "English","Spanish","Mandarin","Cantonese","Haitian Creole",
  "Russian","Bengali","Arabic","French","Portuguese","Korean","Tagalog","Other"
];

const ROTATION_TYPES = [
  "Hospital Dentistry","Community Health","Oral Surgery","Pediatric Dentistry",
  "Special Needs","Periodontics","Endodontics","Orthodontics","General Practice Residency","Other"
];

const ROTATION_COLOR = "#0891b2"; // teal

const initialPatients = withAliases([
  {
    id:"PT-001", chartNumber:"1047823", lastVisit:"2026-02-10",
    procedure:"Root Canal", discipline:"Endodontics",
    treatmentStart:"2026-01-15", expectedCompletion:"2026-04-01",
    nextAppt:"2026-03-05", treatmentComplete:false,
    labStatus:"Received", labSentDate:"2026-02-12", labReceivedDate:"2026-02-20",
    preAuth:"Approved", preAuthSubmittedDate:"2026-01-20",
    notes:"Patient responds well to treatment. Follow up on crown placement.",
    visitLog:[{ date:"2026-02-10", procedure:"Root Canal", notes:"Initial treatment complete." }],
    handoffPartner:"Marcus Reid", handoffPartnerYear:"D3",
    handoffNotes:"Crown placement still pending. Patient prefers morning appointments.",
  },
  {
    id:"PT-002", chartNumber:"1047824", lastVisit:"2026-01-15",
    procedure:"Crown Prep", discipline:"Prosthodontics",
    treatmentStart:"2026-01-15", expectedCompletion:"2026-03-15",
    nextAppt:null, treatmentComplete:false,
    labStatus:"Sent", labSentDate:"2026-01-20", labReceivedDate:"",
    preAuth:"Submitted", preAuthSubmittedDate:"2026-01-16",
    notes:"Waiting on lab. Need to schedule follow-up appointment.",
    visitLog:[{ date:"2026-01-15", procedure:"Crown Prep", notes:"Sent to lab." }],
    handoffPartner:"", handoffPartnerYear:"D3", handoffNotes:"",
  },
  {
    id:"PT-003", chartNumber:"1047825", lastVisit:"2025-12-20",
    procedure:"Implant Placement", discipline:"Implant Dentistry",
    treatmentStart:"2025-12-20", expectedCompletion:"2026-06-01",
    nextAppt:"2026-02-28", treatmentComplete:false,
    labStatus:"Sent", labSentDate:"2026-02-15", labReceivedDate:"",
    preAuth:"Approved", preAuthSubmittedDate:"2025-12-10",
    notes:"Stage 1 complete. Monitoring osseointegration.",
    visitLog:[{ date:"2025-12-20", procedure:"Implant Placement", notes:"Stage 1 placed." }],
    handoffPartner:"Priya Patel", handoffPartnerYear:"D3",
    handoffNotes:"Osseointegration monitoring ongoing. Next stage in April.",
  },
  {
    id:"PT-004", chartNumber:"1047826", lastVisit:"2026-02-01",
    procedure:"Scaling & Root Planing", discipline:"Periodontics",
    treatmentStart:"2026-02-01", expectedCompletion:"2026-04-15",
    nextAppt:null, treatmentComplete:false,
    labStatus:"None", labSentDate:"", labReceivedDate:"",
    preAuth:"Denied", preAuthSubmittedDate:"2026-01-25",
    notes:"Pre-auth denied — needs resubmission with additional documentation.",
    visitLog:[{ date:"2026-02-01", procedure:"Scaling & Root Planing", notes:"Pre-auth denied." }],
    handoffPartner:"", handoffPartnerYear:"D3", handoffNotes:"",
  },
  {
    id:"PT-005", chartNumber:"1047827", lastVisit:"2026-01-05",
    procedure:"Extraction", discipline:"Oral & Maxillofacial Surgery",
    treatmentStart:"2026-01-05", expectedCompletion:"2026-02-15",
    nextAppt:"2026-03-10", treatmentComplete:false,
    labStatus:"None", labSentDate:"", labReceivedDate:"",
    preAuth:"Not Submitted", preAuthSubmittedDate:"",
    notes:"Post-op healing well. No complications.",
    visitLog:[{ date:"2026-01-05", procedure:"Extraction", notes:"Healing well." }],
    handoffPartner:"Jordan Kim", handoffPartnerYear:"D4",
    handoffNotes:"Post-op complete. Simple case — good for D3 handoff.",
  },
]);

const DISCIPLINE_GROUPS = {
  "Restorative & General": ["Comprehensive Care","General Dentistry","Prosthodontics","Implant Dentistry"],
  "Periodontics & Hygiene": ["Periodontics","Dental Hygiene"],
  "Endodontics": ["Endodontics"],
  "Oral Surgery": ["Oral & Maxillofacial Surgery"],
  "Orthodontics": ["Orthodontics"],
  "Pediatric Dentistry": ["Pediatric Dentistry"],
  "Special Care": ["Special Needs Dentistry","Oral Medicine & Pathology"],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f8f6fb; font-family: 'Inter', sans-serif; }
  .card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(107,33,168,0.06); transition: all 0.2s; border: 1px solid rgba(107,33,168,0.06); }
  .card:hover { box-shadow: 0 4px 16px rgba(107,33,168,0.1); transform: translateY(-1px); }
  .pill-btn { border: none; border-radius: 99px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; padding: 5px 14px; transition: all 0.15s; }
  .pill-btn:hover { opacity: 0.85; }
  .filter-btn { border: 1.5px solid transparent; border-radius: 99px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 7px 18px; transition: all 0.15s; }
  .action-btn { border-radius: 12px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 20px; transition: all 0.18s; border: none; }
  .action-btn:hover { opacity: 0.92; transform: translateY(-1px); }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  input, select, textarea { font-family: 'Inter', sans-serif; outline: none; }
  input:focus, select:focus, textarea:focus { border-color: var(--t-mid) !important; box-shadow: 0 0 0 3px rgba(107,33,168,0.08); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(30,20,40,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease; }
  .modal-box { background: white; border-radius: 24px; padding: 28px; width: 90%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(107,33,168,0.15); animation: slideUp 0.22s ease; }
  .progress-bar { height: 6px; border-radius: 99px; background: ${NYU.gray100}; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
  .nlp-box { background: linear-gradient(135deg, var(--t-deep), var(--t-dark)); border-radius: 16px; padding: 16px; margin-bottom: 4px; }
  .nlp-parsed { background: ${NYU.greenLight}; border: 1px solid #6ee7b7; border-radius: 12px; padding: 12px 14px; margin-top: 8px; animation: slideUp 0.2s ease; }
  .section-label { font-size: 11px; font-weight: 600; color: ${NYU.gray400}; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
  @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes bounce { from { transform: translateY(0) } to { transform: translateY(-5px) } }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${NYU.gray200}; border-radius: 99px; }
  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .insights-grid { grid-template-columns: 1fr !important; }
    .page-header { flex-direction: column; align-items: flex-start !important; gap: 12px; }
    .modal-overlay { align-items: flex-end !important; }
    .modal-box { padding: 20px !important; width: 100% !important; max-width: 100% !important; border-radius: 20px 20px 0 0 !important; margin: 0 !important; max-height: 90vh !important; overflow-y: auto !important; }
    .page-inner { padding: 16px 12px 100px !important; }
    .filter-row { overflow-x: auto; padding-bottom: 4px; flex-wrap: nowrap !important; }
    .tab-nav { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap !important; scroll-behavior: smooth; padding-bottom: 1px; }
    .tab-nav button { white-space: nowrap; flex-shrink: 0; padding: 10px 14px !important; font-size: 13px !important; }
    .top-bar { padding: 0 12px !important; height: auto !important; min-height: 52px; flex-wrap: wrap; gap: 6px; padding-top: 8px !important; padding-bottom: 8px !important; }
    .top-bar-name { display: none !important; }
    .chat-panel { width: calc(100vw - 32px) !important; right: 0 !important; }
    .quick-log-panel { width: calc(100vw - 32px) !important; }
    .float-right { bottom: 16px !important; right: 16px !important; }
    .float-left { bottom: 16px !important; left: 16px !important; }
    .intel-row { flex-direction: column !important; gap: 12px !important; }
    .intel-pct { text-align: left !important; }
    .action-btn { padding: 9px 14px !important; }
    .goal-group-header { padding: 10px 14px !important; }
  }
`;

const NoteCard = ({ note, active, onClick, activeBg="#f5f0ff" }) => {
  const catColors = {
    "Clinical":{ color:"#0369a1", bg:"#e0f2fe" },
    "Patient": { color:"#6d28d9", bg:"#f3e8ff" },
    "Study":   { color:"#065f46", bg:"#d1fae5" },
    "General": { color:"#92400e", bg:"#fef3c7" },
  };
  const cat = catColors[note.category] || catColors["General"];
  return (
    <div onClick={onClick} style={{ padding:"12px 14px", borderRadius:12, marginBottom:6, cursor:"pointer", background:active?activeBg:"white", border:`1px solid ${active?NYU.gray200:NYU.gray100}`, transition:"all 0.15s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
        {note.pinned && <span style={{ fontSize:10 }}>📌</span>}
        <span style={{ fontSize:10, fontWeight:600, color:cat.color, background:cat.bg, borderRadius:99, padding:"2px 8px" }}>{note.category}</span>
        <span style={{ fontSize:10, color:NYU.gray400, marginLeft:"auto" }}>{note.updatedAt}</span>
      </div>
      <div style={{ fontWeight:600, fontSize:13, color:NYU.gray900, marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{note.title||"Untitled"}</div>
      <div style={{ fontSize:12, color:NYU.gray400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{note.body?.split("\n")[0]||"Empty note"}</div>
    </div>
  );
};

const inputStyle = { width:"100%", padding:"10px 14px", borderRadius:12, border:`1px solid ${NYU.gray200}`, fontSize:14, color:NYU.gray900, background:"white", transition:"all 0.15s" };
const labelStyle = { fontSize:11, fontWeight:600, color:NYU.gray400, textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:6 };

export default function App() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email:"", password:"", name:"", year:"D3" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showForgotPw, setShowForgotPw] = useState(false);
  const [forgotForm, setForgotForm] = useState({ email:"", newPassword:"", confirm:"" });
  const [forgotMsg, setForgotMsg] = useState({ type:"", text:"" });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [detailPatient, setDetailPatient] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("today");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [demoSeeding, setDemoSeeding] = useState(false);
  const [showPairedPanel, setShowPairedPanel] = useState(false);
  const [pairedViewingAs, setPairedViewingAs] = useState("me");
  const [showUrgentPanel, setShowUrgentPanel] = useState(false);
  const [showRosterPanel, setShowRosterPanel] = useState(false);
  const [showGoalsPanel, setShowGoalsPanel] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [addPatientError, setAddPatientError] = useState("");
  const [showLogModal, setShowLogModal] = useState(null);
  const [newVisit, setNewVisit] = useState({ date:"", procedure:"", notes:"", nextAppt:"", cdtCode:"", facultyName:"" });
  const [nlpInput, setNlpInput] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpParsed, setNlpParsed] = useState(null);
  const [nlpError, setNlpError] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role:"assistant", content:"Hi! I'm your ClinIQ assistant. Ask me about your caseload, graduation requirements, CDT codes, or anything else on your mind." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isListeningNlp, setIsListeningNlp] = useState(false);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState(null);
  const [noteSearch, setNoteSearch] = useState("");
  const [calView, setCalView] = useState("week");
  const [calCombinedView, setCalCombinedView] = useState(false);
  const [showApptModal, setShowApptModal] = useState(null); // { date, time } for new, or { patientId, date, time } for edit
  const [apptModalMode, setApptModalMode] = useState("new"); // "new" | "edit"
  const [apptDraft, setApptDraft] = useState({ patientId:"", date:"", time:"" });
  const [showRotationModal, setShowRotationModal] = useState(false);
  const [rotationDraft, setRotationDraft] = useState(null);
  const [clinicSchedule, setClinicSchedule] = useState({
    monday:   { enabled:true,  start:"08:00", end:"20:00" },
    tuesday:  { enabled:true,  start:"08:00", end:"18:00" },
    wednesday:{ enabled:true,  start:"08:00", end:"20:00" },
    thursday: { enabled:true,  start:"08:00", end:"18:00" },
    friday:   { enabled:true,  start:"08:00", end:"18:00" },
    saturday: { enabled:false, start:"09:00", end:"13:00" },
    sunday:   { enabled:false, start:"09:00", end:"13:00" },
  });
  const [calDate, setCalDate] = useState(new Date());
  const [rotations, setRotations] = useState([]);
  const [editingGoals, setEditingGoals] = useState(false);
  const [customGoals, setCustomGoals] = useState(
    DISCIPLINES.map((d,i) => ({ discipline:d, required:REQUIREMENTS[d]?.required||5, visible:true, order:i }))
  );
  const [editGoalsDraft, setEditGoalsDraft] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [graduationDateStr, setGraduationDateStr] = useState("2026-05-15");
  const [themePreset, setThemePreset] = useState("nyu-purple");
  const [dashTabOrder, setDashTabOrder] = useState(DEFAULT_TAB_ORDER);
  const [visibleStats, setVisibleStats] = useState(STAT_DEFS.map(s=>s.id));
  const [rosterSearch, setRosterSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [quickLogPatientId, setQuickLogPatientId] = useState("");
  const [quickLogNlp, setQuickLogNlp] = useState("");
  const [quickLogLoading, setQuickLogLoading] = useState(false);
  const [quickLogToast, setQuickLogToast] = useState("");
  const [changelog, setChangelog] = useState([]);
  const [changelogExpanded, setChangelogExpanded] = useState(false);
  const [partnerNoteInput, setPartnerNoteInput] = useState({});
  const [showTransferModal, setShowTransferModal] = useState(null); // patient id
  const [transferToName, setTransferToName] = useState("");
  const [weeklyToastDismissed, setWeeklyToastDismissed] = useState(false);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [collapsedGoalGroups, setCollapsedGoalGroups] = useState({});
  const [onboardingStep, setOnboardingStep] = useState(null); // 1–4 or null
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [settingsTab, setSettingsTab] = useState("profile");
  const [errorToast, setErrorToast] = useState("");
  const [expandedSections, setExpandedSections] = useState(["visitHistory"]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [importRawRows, setImportRawRows] = useState([]);
  const [importHeaders, setImportHeaders] = useState([]);
  const [importMapping, setImportMapping] = useState({ chartNumber:"", lastVisit:"", procedure:"", discipline:"" });
  const [importPreview, setImportPreview] = useState([]);
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Theme ─────────────────────────────────────────────────────────────────────
  const T = { ...NYU, ...(THEMES[themePreset] || THEMES["nyu-purple"]) };
  const themeVars = `:root{--t-purple:${T.purple};--t-dark:${T.purpleDark};--t-deep:${T.purpleDeep};--t-light:${T.purpleLight};--t-mid:${T.purpleMid};--t-accent:${T.accent};--t-lav:${T.lavender}}`;

  const STATUS_META = {
    Active:{ color:NYU.green, bg:"#dcfce7" },
    "F/U Appt Needed":{ color:NYU.amber, bg:"#fef3c7" },
    "Treatment Complete":{ color:T.purple, bg:T.purpleLight },
  };

  // ── API helpers ──────────────────────────────────────────────────────────────
  const saveTimers = useRef({});

  const loadUserData = useCallback(async () => {
    try {
      const [pRes, nRes, rRes, sRes] = await Promise.all([
        fetch("/api/patients"), fetch("/api/notes"),
        fetch("/api/rotations"), fetch("/api/settings"),
      ]);
      let pData = [];
      if (pRes.ok) { pData = await pRes.json(); setPatients(pData); }
      if (nRes.ok) setNotes(await nRes.json());
      if (rRes.ok) setRotations(await rRes.json());
      if (sRes.ok) {
        const s = await sRes.json();
        if (s.graduationDate) setGraduationDateStr(s.graduationDate);
        if (s.customGoals && s.customGoals.length > 0) setCustomGoals(s.customGoals);
        if (s.clinicSchedule && Object.keys(s.clinicSchedule).length > 0) setClinicSchedule(s.clinicSchedule);
        if (s.themePreset && THEMES[s.themePreset]) setThemePreset(s.themePreset);
        if (s.dashTabOrder && s.dashTabOrder.length > 0) setDashTabOrder(s.dashTabOrder);
        if (s.visibleStats && s.visibleStats.length > 0) setVisibleStats(s.visibleStats);
      }
      return pData;
    } catch (err) {
      console.error("Failed to load data:", err);
      showError("Connection error — some data may not have loaded");
      return [];
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(async ({ user: u }) => {
      if (u) {
        setUser(u);
        const pData = await loadUserData();
        if (Array.isArray(pData) && pData.length === 0 && !localStorage.getItem("cliniq-onboarded")) {
          setOnboardingStep(1);
        }
      }
      setAppLoading(false);
    }).catch(() => setAppLoading(false));
  }, [loadUserData]);

  useEffect(() => {
    if (showSettings) {
      fetch("/api/changelog").then(r=>r.ok?r.json():[]).then(d=>setChangelog(Array.isArray(d)?d:[])).catch(()=>{});
    }
  }, [showSettings]);

  // Debounced patient save — flushes after 800ms of no changes
  const schedulePatientSave = (patient) => {
    const id = patient.id;
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(() => {
      fetch(`/api/patients/${id}`, {
        method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(patient)
      }).catch(err => console.error("Failed to save patient:", err));
    }, 800);
  };

  const updateField = (id, field, value) => {
    setPatients(prev => {
      const updated = prev.map(p => p.id===id ? {...p,[field]:value} : p);
      const patient = updated.find(p => p.id===id);
      if (patient) schedulePatientSave(patient);
      return updated;
    });
  };

  const addPatient = async () => {
    if (!newPatient.chartNumber.trim()) {
      setAddPatientError("Chart number is required to add a patient.");
      return;
    }
    setAddPatientError("");
    try {
      const res = await fetch("/api/patients", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(newPatient)
      });
      const data = await res.json();
      if (!res.ok) {
        setAddPatientError(data.error || "Failed to add patient. Please try again.");
        showError(data.error || "Failed to add patient.");
        return;
      }
      setPatients(prev => [...prev, data]);
      logChange({ action_type:"PATIENT_ADDED", patient_alias:data.alias, description:`Added patient ${data.alias} (${data.discipline})` });
      setNewPatient(emptyPatient);
      setAddPatientError("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Add patient failed:", err);
      setAddPatientError("Connection error. Please try again.");
      showError("Connection error — patient not saved.");
    }
  };

  const loadDemoData = async () => {
    setDemoSeeding(true);
    try {
      const res = await fetch("/api/demo/seed", { method:"POST" });
      const data = await res.json();
      if (res.ok) {
        setPatients(data.patients);
        setRotations(data.rotations);
        setNotes(data.notes);
        setShowSettings(false);
      }
    } catch (err) {
      console.error("Demo seed failed:", err);
    } finally {
      setDemoSeeding(false);
    }
  };

  const logChange = (entry) => {
    if (!user) return;
    fetch("/api/changelog", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ user_name:user.name, user_year:user.year, ...entry })
    }).catch(()=>{});
  };

  const showError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(""), 4000);
  };

  const logVisit = async (id) => {
    if (!newVisit.date || !newVisit.procedure) return;
    try {
      const res = await fetch(`/api/patients/${id}/visits`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(newVisit)
      });
      if (res.ok) {
        const visit = await res.json();
        const pt = patients.find(p=>p.id===id);
        logChange({ action_type:"VISIT_LOGGED", patient_alias:pt?.alias||id, description:`Logged visit for ${pt?.alias||id}: ${newVisit.procedure} on ${newVisit.date}` });
        setPatients(prev => prev.map(p =>
          p.id===id ? { ...p, lastVisit:newVisit.date, procedure:newVisit.procedure,
            nextAppt:newVisit.nextAppt||p.nextAppt,
            visitLog:[...(p.visitLog||[]), visit]
          } : p
        ));
      }
    } catch (err) { console.error("Log visit failed:", err); showError("Connection error — visit not saved."); }
    setNewVisit({ date:"", procedure:"", notes:"", nextAppt:"", cdtCode:"", facultyName:"" });
    setNlpInput(""); setNlpParsed(null); setNlpError("");
    setShowLogModal(null);
  };

  const parseWithAI = async () => {
    if (!nlpInput.trim()) return;
    setNlpLoading(true); setNlpError(""); setNlpParsed(null);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const response = await fetch("/api/parse", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:`You are a dental clinic assistant. Today is ${todayStr}. Extract visit info and return ONLY valid JSON, no markdown:
{"date":"YYYY-MM-DD","procedure":"dental procedure name","discipline":"one of the 12 NYUCD disciplines","nextAppt":"YYYY-MM-DD or empty","notes":"context or empty"}
Note: "${nlpInput}"` }]
        })
      });
      const data = await response.json();
      const parsed = JSON.parse(data.content[0].text.trim());
      setNlpParsed(parsed);
      setNewVisit({ date:parsed.date||"", procedure:parsed.procedure||"", notes:parsed.notes||"", nextAppt:parsed.nextAppt||"" });
      if (parsed.discipline && showLogModal) updateField(showLogModal,"discipline",parsed.discipline);
      if (parsed.nextAppt && showLogModal) updateField(showLogModal,"nextAppt",parsed.nextAppt);
    } catch(err) {
      setNlpError("Couldn't parse that — please fill in the fields manually.");
    }
    setNlpLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role:"user", content:chatInput };
    setChatMessages(prev=>[...prev,userMsg]);
    setChatInput("");
    setChatLoading(true);
    const graduationDate = new Date(graduationDateStr);
    const daysToGraduation = Math.floor((graduationDate-today)/86400000);
    const weeksToGraduation = Math.max(1,Math.floor(daysToGraduation/7));
    const fourWeeksAgo = new Date(today-28*86400000).toISOString().split("T")[0];
    const recentVisits = patients.flatMap(p=>p.visitLog||[]).filter(v=>v.date>=fourWeeksAgo).length;
    const visitsPerWeek = recentVisits/4;
    const totalRequired = customGoals.filter(g=>g.visible).reduce((s,g)=>s+g.required,0);
    const totalCompleted = customGoals.filter(g=>g.visible).reduce((s,g)=>{
      return s+patients.filter(p=>p.discipline===g.discipline&&p.isPrimaryProvider!==false).reduce((sum,p)=>sum+(p.visitLog?.length||0),0);
    },0);
    const totalRemaining = Math.max(0,totalRequired-totalCompleted);
    const projectedAdditional = Math.floor(visitsPerWeek*weeksToGraduation);
    const onTrack = projectedAdditional>=totalRemaining;
    const velocityPct = Math.min(100,Math.round((totalCompleted/totalRequired)*100));
    const velocityContext = `Graduation: ${graduationDateStr} (${daysToGraduation} days). Pace: ${visitsPerWeek.toFixed(1)} visits/week. Progress: ${totalCompleted}/${totalRequired} (${velocityPct}%). ${onTrack?"ON TRACK.":"AT RISK."}`;
    const behavCtx = analyzeBehavior(patients, customGoals);
    const behavioralContext = behavCtx.summary || "Insufficient visit history for behavioral analysis.";
    const fmt = (d) => d.toISOString().split("T")[0];
    const caseloadSummary = patients.map(p => {
      const completed = p.visitLog?.length||0;
      const goal = customGoals.find(g=>g.discipline===p.discipline);
      const required = goal?.required||0;
      const pred = predictCompletion(p);
      const preAuthNudge = getPreAuthNudge(p);
      const labNudge = getLabNudge(p);
      const langNote = p.patientLanguage && p.patientLanguage!=="English" ? `, preferred language: ${p.patientLanguage}` : "";
      const roleNote = p.isPrimaryProvider!==false ? ", primary: yes" : ", primary: no";
      return `- ${p.alias} (chart:${p.chartNumber}): ${p.discipline}, ${completed}/${required} visits, last seen ${p.lastVisit||"never"}, next: ${p.nextAppt||"not scheduled"}, pre-auth: ${p.preAuth}, lab: ${p.labStatus}${pred?`, est. completion: ${pred.date}`:""}${preAuthNudge?`, PRE-AUTH: ${preAuthNudge.label}`:""}${labNudge?`, LAB: ${labNudge.label}`:""}${langNote}${roleNote}`;
    }).join("\n");
    const requirementsSummary = customGoals.filter(g=>g.visible).map(g=>{
      const completed = patients.filter(p=>p.discipline===g.discipline&&p.isPrimaryProvider!==false).reduce((s,p)=>s+(p.visitLog?.length||0),0);
      return `- ${g.discipline}: ${completed}/${g.required} (primary provider visits only)`;
    }).join("\n");
    const upcomingAppts = patients.filter(p=>p.nextAppt&&p.nextAppt>=fmt(today)).sort((a,b)=>a.nextAppt.localeCompare(b.nextAppt)).map(p=>`- ${p.nextAppt}: ${p.alias} (${p.procedure||p.discipline})`).join("\n");
    const notebookContext = notes.map(n=>`- [${n.category}] "${n.title}": ${n.body?.slice(0,150)}`).join("\n");
    const rotationContext = rotations.length>0 ? rotations.map(r=>`- ${r.site} (${r.type}): ${r.recurring?`every ${r.recurringDay} from ${r.startDate} to ${r.endDate}`:`${r.startDate} to ${r.endDate}`}${r.notes?` — ${r.notes}`:""}`).join("\n") : "No rotations scheduled.";
    try {
      const response = await fetch("/api/parse", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are ClinIQ, an AI assistant built specifically for dental students at NYU College of Dentistry. Today: ${fmt(today)}.
Student: ${user?.name}, ${user?.year}

CASELOAD (aliases are HIPAA-safe — chart numbers in parens are for student reference only):
${caseloadSummary}

GRADUATION REQUIREMENTS:
${requirementsSummary}

GRADUATION VELOCITY: ${velocityContext}

BEHAVIORAL PATTERNS: ${behavioralContext}

UPCOMING APPOINTMENTS:
${upcomingAppts||"None scheduled."}

NOTEBOOK:
${notebookContext||"No notes."}

EXTERNAL ROTATIONS:
${rotationContext}

NYUCD TERMINOLOGY & CONTEXT:
- Use NYUCD language naturally: "comp care" (comprehensive care), "perio maint" (periodontal maintenance), "SRP" (scaling & root planing), "RCT" (root canal treatment), "AxiUm" (the EHR system), "attending" (supervising faculty), "clinic session" (morning or afternoon block), "requirements sign-off" (faculty approval of completed procedure), "pre-d" (pre-doctoral), "D-board" (dental board exams), "NERB/CDCA" (regional dental board exams), "comp exam" (comprehensive patient exam, D0150).
- Students are D3 or D4 — D3s are in their first clinical year under close supervision, D4s have more autonomy and can supervise D3s on shared patients.
- If the user is a post-graduate resident (GPR, OMFS, Periodontics, Endodontics, Prosthodontics, Orthodontics, or Pediatric Dentistry Resident), they have completed dental school and are now specializing. Treat them as clinical peers — use collegial, peer-level language rather than a supervisory or pedagogical tone. They are more clinically experienced than D3/D4 students and do not need basic explanations unless asked.
- Graduation requires completing minimum procedure counts per discipline — these are tracked in the requirements section above.
- Pre-authorization (pre-auth) is required for insurance-covered procedures above a fee threshold. Turnaround is typically 3–4 weeks.
- Lab cases (crowns, dentures, partials, implant components) typically take 1–2 weeks. Students must coordinate with the lab and attending for try-ins and delivery appointments.

PATIENT LANGUAGE AWARENESS:
- If a patient has a preferred language other than English, you can help the student communicate with them.
- When asked to translate instructions or explain a procedure for a patient, respond in that patient's language using plain, non-clinical language appropriate for a patient (not a clinician).
- Always confirm which patient and which language you're translating for before translating.

NYUCD CLINICAL KNOWLEDGE BASE:
Common procedures and CDT codes used at NYUCD:
D0150 Comprehensive oral exam (new patient, required before any treatment); D0210 Full mouth X-rays (FMX); D0220 Periapical X-ray; D0230 Additional periapical; D0274 Bitewing 4-film series; D0330 Panoramic; D0340 2D cephalometric; D1110 Adult prophy; D1120 Child prophy; D1206 Fluoride varnish; D1351 Sealant per tooth; D2140 Amalgam 1-surface; D2150 Amalgam 2-surface; D2160 Amalgam 3-surface; D2330 Resin 1-surface anterior; D2331 Resin 2-surface anterior; D2332 Resin 3-surface anterior; D2390 Resin crown anterior; D2391 Resin 1-surface posterior; D2392 Resin 2-surface posterior; D2393 Resin 3-surface posterior; D2394 Resin 4+ surface posterior; D2740 Porcelain crown; D2750 PFM crown; D2930 Stainless steel crown (primary); D3310 RCT anterior; D3320 RCT premolar; D3330 RCT molar; D4210 Gingivectomy 4+ teeth per quad; D4211 Gingivectomy 1-3 teeth per quad; D4240 Pedicle soft tissue graft; D4241 Palatal connective tissue graft; D4260 Osseous surgery 4+ teeth per quad; D4261 Osseous surgery 1-3 teeth per quad; D4341 SRP 4+ teeth per quad; D4342 SRP 1-3 teeth per quad; D4346 Scaling in presence of generalized moderate/severe gingivitis; D4910 Periodontal maintenance; D5110 Complete upper denture; D5120 Complete lower denture; D5211 Upper partial resin; D5212 Lower partial resin; D5213 Upper partial cast metal; D5214 Lower partial cast metal; D6010 Implant placement; D6065 Implant-supported porcelain/ceramic crown; D7140 Extraction, erupted tooth; D7210 Surgical extraction; D7240 Removal of impacted tooth, completely bony; D7241 Removal of impacted tooth, partially bony with difficult access; D8010 Limited ortho, primary dentition; D8080 Comprehensive ortho, adolescent; D8090 Comprehensive ortho, adult; D9930 Treatment of complications from previous procedures.

Pre-auth rules at NYUCD: Pre-authorization is required for most insurance-covered restorations (crowns, onlays, multi-surface composites on posterior teeth), periodontal surgery, and removable prosthetics. Implants almost always require pre-auth. Submit pre-auth before scheduling; typical approval turnaround is 3–4 weeks. If pre-auth is denied, discuss alternatives with attending before informing patient. Some Medicaid plans do not cover certain restorations — confirm coverage first. Document submission date and reference number in AxiUm.

Lab coordination: Crown impressions → lab → 2-week turnaround → bisque bake try-in → final delivery. Partial and complete denture cases: preliminary impressions → custom tray → final impressions → jaw relation records → wax try-in → delivery. Always confirm lab due date with the lab technician and communicate to patient. Lab rush requests (5–7 days) require attending approval. Pick up all lab cases on time — uncollected cases hold up scheduling.

NYUCD requirements tracking: D3 students must complete comp exam (D0150) + perio assessment (D4341/D4342/D4346) on every new comprehensive care patient before any definitive treatment. Faculty sign-off required for each completed requirement. D4 students are expected to manage multi-disciplinary cases. Graduation requirements vary by discipline; use the Requirements tab for exact counts. If a requirement count seems off, check whether visits were logged with the correct discipline tag.

ESCALATION RULES — STRICTLY FOLLOW:
- Any question involving a clinical diagnosis, treatment planning decision, medication dosage, patient safety concern, or judgment call that requires faculty oversight must end with: "Check with your attending on this one."
- Never give a definitive clinical recommendation. You can explain what something is or how a procedure typically works, but you cannot advise on whether to proceed.
- Examples that require escalation: "should I extract this tooth?", "what medication should I prescribe?", "is this radiograph normal?", "my patient is having a reaction — what do I do?"

SMART ACTION HINTS:
- If your response references a specific patient alias, end with: [ACTION:patient:ALIAS] replacing ALIAS with the exact alias.
- If your response involves the calendar or scheduling, end with: [ACTION:calendar]
- If your response involves logging a visit, end with: [ACTION:logvisit:ALIAS] replacing ALIAS with the patient alias.
- Only include one action tag per response. These tags are parsed by the UI — do not explain them.

RESPONSE RULES:
- Max 2-3 sentences for simple questions. Max 5 sentences for complex ones.
- Never use bullet points, headers, or bold formatting.
- Lead with the direct answer first, context second.
- Reference patients by alias only (never chart number).
- Speak like a sharp, experienced colleague who respects the student's time.
- If you don't have enough info, say so in one sentence.`,
          messages:[...chatMessages,userMsg].map(m=>({ role:m.role, content:m.content }))
        })
      });
      const data = await response.json();
      const rawText = data.content[0].text;
      // Parse smart action tags
      const actionMatch = rawText.match(/\[ACTION:(patient|calendar|logvisit):?([^\]]*)\]/);
      const cleanText = rawText.replace(/\[ACTION:[^\]]*\]/g,"").trim();
      const action = actionMatch ? { type:actionMatch[1], alias:actionMatch[2]||"" } : null;
      setChatMessages(prev=>[...prev,{ role:"assistant", content:cleanText, action }]);
    } catch(err) {
      setChatMessages(prev=>[...prev,{ role:"assistant", content:"Sorry, I had trouble connecting. Please try again." }]);
      showError("AI connection error — please retry.");
    }
    setChatLoading(false);
  };

  // ── Voice input helper ──
  const startVoice = (onResult, onEnd) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input is not supported in this browser. Try Chrome."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.onend = onEnd;
    recognition.start();
  };

  // ── Rotation helper ──
  const DAY_NAMES_FULL = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const getRotationsForDate = (dateStr) => {
    return rotations.filter(r => {
      if (r.recurring) {
        const d = new Date(dateStr + "T12:00:00");
        const dayName = DAY_NAMES_FULL[d.getDay()];
        return dayName === r.recurringDay &&
          dateStr >= r.startDate && dateStr <= r.endDate;
      } else {
        return dateStr >= r.startDate && dateStr <= r.endDate;
      }
    });
  };

  const handleLogin = async () => {
    if (!loginForm.email||!loginForm.name) { setLoginError("Please enter your name and email."); return; }
    setLoginLoading(true); setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email:loginForm.email, password:loginForm.password||"", name:loginForm.name, year:loginForm.year })
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error||"Login failed"); setLoginLoading(false); return; }
      setUser(data.user);
      await loadUserData();
    } catch { setLoginError("Connection error. Please try again."); }
    setLoginLoading(false);
  };

  const handleForgotSubmit = async () => {
    if (!forgotForm.email) { setForgotMsg({ type:"error", text:"Please enter your email." }); return; }
    if (!forgotForm.newPassword) { setForgotMsg({ type:"error", text:"Please enter a new password." }); return; }
    if (forgotForm.newPassword !== forgotForm.confirm) { setForgotMsg({ type:"error", text:"Passwords don't match." }); return; }
    setForgotLoading(true); setForgotMsg({ type:"", text:"" });
    try {
      const res = await fetch("/api/auth/reset-password", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email:forgotForm.email, newPassword:forgotForm.newPassword })
      });
      const data = await res.json();
      if (!res.ok) { setForgotMsg({ type:"error", text:data.error||"Reset failed" }); }
      else { setForgotMsg({ type:"success", text:"Password updated! You can now sign in." }); setForgotForm({ email:"", newPassword:"", confirm:"" }); }
    } catch { setForgotMsg({ type:"error", text:"Connection error. Please try again." }); }
    setForgotLoading(false);
  };
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method:"POST" });
    setUser(null);
    setPatients([]); setNotes([]); setRotations([]);
    setLoginForm({ email:"", password:"", name:"", year:"D3" });
  };

  const exportRoster = () => {
    const rows = ["Alias,Discipline,Last Visit,Next Appt,Status,Lab,Pre-Auth,Complete"];
    patients.forEach(p=>rows.push(`${p.alias},${p.discipline},${p.lastVisit},${p.nextAppt||"Not scheduled"},${calculateStatus(p)},${p.labStatus},${p.preAuth},${p.treatmentComplete?"Yes":"No"}`));
    const a = Object.assign(document.createElement("a"),{
      href:URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv"})),
      download:"ClinIQ_Roster_Export.csv",
    });
    a.click();
  };

  const parseCSVFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(l=>l.trim());
      if (lines.length < 2) { reject("CSV must have a header row and at least one data row."); return; }
      const headers = lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
      const rows = lines.slice(1).map(line=>{
        const cols = line.match(/("(?:[^"]|"")*"|[^,]*)/g)||[];
        return headers.reduce((obj,h,i)=>{
          obj[h]=(cols[i]||"").trim().replace(/^"|"$/g,"").replace(/""/g,'"');
          return obj;
        },{});
      });
      resolve({ headers, rows });
    };
    reader.onerror = () => reject("Failed to read file.");
    reader.readAsText(file);
  });

  const buildImportPreview = (rows, mapping) => {
    return rows.slice(0, 5).map((row, index) => ({
      id:          `PT-${String(patients.length + index + 1).padStart(3, '0')}`,
      alias:       generateAlias(patients.length + index),
      chartNumber: row[mapping.chartNumber]||"",
      lastVisit:   row[mapping.lastVisit]||"",
      procedure:   row[mapping.procedure]||"",
      discipline:  row[mapping.discipline]||"",
    }));
  };

  const runImport = async () => {
    setImportLoading(true);
    try {
      const payload = importRawRows.map((row, index) => ({
        alias:       generateAlias(patients.length + index),
        chartNumber: row[importMapping.chartNumber]||"",
        lastVisit:   row[importMapping.lastVisit]||"",
        procedure:   row[importMapping.procedure]||"",
        discipline:  row[importMapping.discipline]||"",
      }));
      const res = await fetch("/api/patients/import", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ rows: payload })
      });
      const data = await res.json();
      setImportResult(data);
      setImportStep(4);
      if (data.created > 0) {
        const updated = await fetch("/api/patients").then(r=>r.json());
        setPatients(updated);
      }
    } catch(err) {
      showError("Import failed — please try again.");
    } finally {
      setImportLoading(false);
    }
  };

  const filtered = (filter==="All" ? patients
    : filter==="Urgent" ? patients.filter(p=>calculateUrgency(p))
    : patients.filter(p=>calculateStatus(p)===filter)
  ).filter(p=>{
    if(!rosterSearch.trim()) return true;
    const q=rosterSearch.toLowerCase();
    return (p.alias||"").toLowerCase().includes(q)||(p.chartNumber||"").toLowerCase().includes(q)||(p.procedure||"").toLowerCase().includes(q)||(p.id||"").toLowerCase().includes(q);
  });

  const urgentPatients = patients.filter(p=>calculateUrgency(p)&&!p.treatmentComplete);

  // ── Graduation Velocity ──
  const graduationDate = new Date(graduationDateStr);
  const daysToGraduation = Math.floor((graduationDate-today)/86400000);
  const weeksToGraduation = Math.max(1,Math.floor(daysToGraduation/7));
  const fourWeeksAgo = new Date(today-28*86400000).toISOString().split("T")[0];
  const recentVisits = patients.flatMap(p=>p.visitLog||[]).filter(v=>v.date>=fourWeeksAgo).length;
  const visitsPerWeek = recentVisits/4;
  const totalRequired = customGoals.filter(g=>g.visible).reduce((s,g)=>s+g.required,0);
  const totalCompleted = customGoals.filter(g=>g.visible).reduce((s,g)=>{
    return s+patients.filter(p=>p.discipline===g.discipline&&p.isPrimaryProvider!==false).reduce((sum,p)=>sum+(p.visitLog?.length||0),0);
  },0);
  const totalRemaining = Math.max(0,totalRequired-totalCompleted);
  const projectedAdditional = Math.floor(visitsPerWeek*weeksToGraduation);
  const onTrack = projectedAdditional>=totalRemaining;
  const velocityPct = Math.min(100,Math.round((totalCompleted/totalRequired)*100));
  const atRiskRequirements = customGoals.filter(g=>g.visible).filter(g=>{
    const completed = patients.filter(p=>p.discipline===g.discipline&&p.isPrimaryProvider!==false).reduce((s,p)=>s+(p.visitLog?.length||0),0);
    const remaining = g.required-completed;
    const projectedForThis = Math.floor((completed/Math.max(totalCompleted,1))*projectedAdditional);
    return remaining>0 && projectedForThis<remaining;
  }).map(g=>g.discipline);

  // ── Behavioral analysis ──
  const behaviorAnalysis = analyzeBehavior(patients, customGoals);
  const isMonday = new Date().getDay() === 1;
  const thisWeekKey = (() => { const d=new Date(); d.setDate(d.getDate()-d.getDay()); return d.toISOString().split("T")[0]; })();
  const lastWeeklySummaryDate = typeof window!=="undefined" ? localStorage.getItem("lastWeeklySummaryDate") : null;
  const showWeeklyToast = isMonday && lastWeeklySummaryDate!==thisWeekKey && !weeklyToastDismissed && behaviorAnalysis.insights.length>0;

  // ── Nudge collections ──
  const allPreAuthNudges = patients.filter(p=>getPreAuthNudge(p)!==null);
  const allLabNudges = patients.filter(p=>getLabNudge(p)!==null);
  const hasNudges = allPreAuthNudges.length>0 || allLabNudges.length>0;

  const statsAll = [
    { id:"total",    label:"Total Patients", value:patients.length, color:T.purple },
    { id:"active",   label:"Active", value:patients.filter(p=>calculateStatus(p)==="Active").length, color:NYU.green },
    { id:"urgent",   label:"Needs Attention", value:urgentPatients.length, color:NYU.orange },
    { id:"complete", label:"Complete", value:patients.filter(p=>calculateStatus(p)==="Treatment Complete").length, color:T.purpleMid },
    { id:"preauth",  label:"Pre-Auth Alerts", value:allPreAuthNudges.length+allLabNudges.length, color:NYU.blue },
  ];
  const stats = statsAll.filter(s=>visibleStats.includes(s.id));

  // ── App Loading Screen ──
  if (appLoading) {
    return (
      <>
        <style>{css}</style><style>{themeVars}</style>
        <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #f8f6fb 0%, #ede8f5 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg, ${T.purple}, ${T.accent})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <span style={{ color:"white", fontSize:20, fontWeight:700 }}>C</span>
            </div>
            <div style={{ fontSize:14, color:NYU.gray400 }}>Loading ClinIQ…</div>
          </div>
        </div>
      </>
    );
  }

  // ── Login Screen ──
  if (!user) {
    return (
      <>
        <style>{css}</style><style>{themeVars}</style>
        <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #f8f6fb 0%, #ede8f5 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ width:"100%", maxWidth:420 }}>
            <div style={{ textAlign:"center", marginBottom:40 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg, ${T.purple}, ${T.accent})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <span style={{ color:"white", fontSize:24, fontWeight:700 }}>C</span>
              </div>
              <h1 style={{ fontFamily:"'Fraunces', serif", fontSize:28, fontWeight:700, color:NYU.gray900, letterSpacing:"-0.02em" }}>ClinIQ</h1>
              <p style={{ color:NYU.gray400, fontSize:14, marginTop:6 }}>NYU College of Dentistry · Clinical Caseload Manager</p>
            </div>
            <div style={{ background:"white", borderRadius:24, padding:32, boxShadow:"0 8px 40px rgba(107,33,168,0.1)", border:`1px solid ${NYU.gray100}` }}>

              {/* Testing mode banner */}
              <div style={{ background:"#fef9c3", border:"1px solid #fde047", borderRadius:10, padding:"8px 12px", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14 }}>🧪</span>
                <span style={{ fontSize:12, color:"#92400e", fontWeight:500 }}>Testing mode — password not required</span>
              </div>

              {!showForgotPw ? (
                <>
                  <h2 style={{ fontSize:18, fontWeight:700, color:NYU.gray900, marginBottom:6 }}>Sign in</h2>
                  <p style={{ fontSize:13, color:NYU.gray400, marginBottom:24 }}>Use your NYU credentials to continue</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div><label style={labelStyle}>Full Name</label><input style={inputStyle} placeholder="e.g. Whitney Johnson" value={loginForm.name} onChange={e=>setLoginForm(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} /></div>
                    <div><label style={labelStyle}>NYU Email</label><input style={inputStyle} type="email" placeholder="wj1234@nyu.edu" value={loginForm.email} onChange={e=>setLoginForm(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} /></div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                        <label style={{ ...labelStyle, marginBottom:0 }}>Password</label>
                        <button onClick={()=>{ setShowForgotPw(true); setForgotMsg({ type:"", text:"" }); }} style={{ background:"none", border:"none", fontSize:12, color:T.purple, cursor:"pointer", fontFamily:"'Inter', sans-serif", fontWeight:500, padding:0 }}>Forgot password?</button>
                      </div>
                      <input style={inputStyle} type="password" placeholder="Optional during testing" value={loginForm.password} onChange={e=>setLoginForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
                    </div>
                    <div>
                      <label style={labelStyle}>Student Year</label>
                      <select style={inputStyle} value={loginForm.year} onChange={e=>setLoginForm(p=>({...p,year:e.target.value}))}>
                        <option>D3</option><option>D4</option>
                        <optgroup label="Post-Graduate Residents">
                          <option>GPR Resident</option>
                          <option>OMFS Resident</option>
                          <option>Periodontics Resident</option>
                          <option>Endodontics Resident</option>
                          <option>Prosthodontics Resident</option>
                          <option>Orthodontics Resident</option>
                          <option>Pediatric Dentistry Resident</option>
                        </optgroup>
                      </select>
                      <div style={{ fontSize:11, color:NYU.gray400, marginTop:6 }}>D1 and D2 students do not have active patient access.</div>
                    </div>
                    {loginError && <div style={{ background:NYU.redLight, borderRadius:10, padding:"10px 14px", fontSize:13, color:NYU.red }}>{loginError}</div>}
                    <button className="action-btn" onClick={handleLogin} disabled={loginLoading} style={{ background:T.purple, color:"white", width:"100%", marginTop:4, padding:"13px 20px", fontSize:15, opacity:loginLoading?0.7:1 }}>{loginLoading?<><span className="spinner"/>Signing in…</>:"Sign In"}</button>
                  </div>
                  <p style={{ fontSize:11, color:NYU.gray400, textAlign:"center", marginTop:20, lineHeight:1.5 }}>
                    Production version will authenticate via NYU SSO.<br/>Patient data uses HIPAA-safe identifiers — no PHI stored or transmitted.
                  </p>
                </>
              ) : (
                <>
                  <button onClick={()=>{ setShowForgotPw(false); setForgotMsg({ type:"", text:"" }); }} style={{ background:"none", border:"none", color:NYU.gray400, cursor:"pointer", fontSize:13, fontFamily:"'Inter', sans-serif", marginBottom:16, padding:0, display:"flex", alignItems:"center", gap:6 }}>← Back to sign in</button>
                  <h2 style={{ fontSize:18, fontWeight:700, color:NYU.gray900, marginBottom:6 }}>Reset Password</h2>
                  <p style={{ fontSize:13, color:NYU.gray400, marginBottom:24 }}>Enter your email and choose a new password.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div><label style={labelStyle}>NYU Email</label><input style={inputStyle} type="email" placeholder="wj1234@nyu.edu" value={forgotForm.email} onChange={e=>setForgotForm(p=>({...p,email:e.target.value}))} /></div>
                    <div><label style={labelStyle}>New Password</label><input style={inputStyle} type="password" placeholder="New password" value={forgotForm.newPassword} onChange={e=>setForgotForm(p=>({...p,newPassword:e.target.value}))} /></div>
                    <div><label style={labelStyle}>Confirm Password</label><input style={inputStyle} type="password" placeholder="Confirm new password" value={forgotForm.confirm} onChange={e=>setForgotForm(p=>({...p,confirm:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleForgotSubmit()} /></div>
                    {forgotMsg.text && (
                      <div style={{ background:forgotMsg.type==="success"?"#dcfce7":NYU.redLight, borderRadius:10, padding:"10px 14px", fontSize:13, color:forgotMsg.type==="success"?NYU.green:NYU.red }}>
                        {forgotMsg.type==="success"?"✓ ":""}{forgotMsg.text}
                      </div>
                    )}
                    <button className="action-btn" onClick={handleForgotSubmit} disabled={forgotLoading} style={{ background:T.purple, color:"white", width:"100%", padding:"13px 20px", fontSize:15, opacity:forgotLoading?0.7:1 }}>{forgotLoading?<><span className="spinner"/>Updating…</>:"Update Password"}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style><style>{themeVars}</style>
      <div style={{ minHeight:"100vh", background:"#f8f6fb" }}>

        {/* Top Header */}
        <div style={{ background:"white", borderBottom:`1px solid ${NYU.gray100}`, position:"sticky", top:0, zIndex:100 }}>
          <div className="top-bar" style={{ maxWidth:640, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative" }}>
              <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 8px", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}
                onMouseEnter={e=>e.currentTarget.style.background=NYU.gray100} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="5" width="14" height="1.5" rx="0.75" fill={NYU.gray600}/>
                  <rect x="3" y="9.25" width="14" height="1.5" rx="0.75" fill={NYU.gray600}/>
                  <rect x="3" y="13.5" width="14" height="1.5" rx="0.75" fill={NYU.gray600}/>
                </svg>
              </button>
              <div style={{ width:30, height:30, borderRadius:10, background:`linear-gradient(135deg, ${T.purple}, ${T.accent})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"white", fontSize:14, fontWeight:700 }}>C</span>
              </div>
              <span style={{ color:NYU.gray900, fontSize:16, fontWeight:700, fontFamily:"'Fraunces', serif", letterSpacing:"-0.02em" }}>ClinIQ</span>

              {menuOpen && (
                <>
                  <div onClick={()=>setMenuOpen(false)} style={{ position:"fixed", inset:0, zIndex:199 }}/>
                  <div style={{ position:"absolute", top:44, left:0, background:"white", borderRadius:14, boxShadow:"0 8px 32px rgba(87,6,140,0.15)", border:`1px solid ${NYU.gray100}`, width:220, padding:"6px 0", zIndex:200, animation:"slideUp 0.15s ease" }}>
                    {[
                      { label:"Paired Provider View", icon:"🤝", action:()=>{ setShowPairedPanel(true); setMenuOpen(false); } },
                      { label:"Urgent Patients", icon:"⚠️", action:()=>{ setTab("roster"); setFilter("Urgent"); setMenuOpen(false); setShowUrgentPanel(true); } },
                    ].map((item,i)=>(
                      <button key={i} onClick={item.action} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:500, color:NYU.gray900, fontFamily:"'Inter', sans-serif", textAlign:"left" }}
                        onMouseEnter={e=>e.currentTarget.style.background=NYU.gray50} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{ height:1, background:NYU.gray100, margin:"4px 12px" }}/>
                    {[
                      { label:"Add Patient", icon:"➕", action:()=>{ setShowAddModal(true); setMenuOpen(false); } },
                      { label:"Import Roster", icon:"📂", action:()=>{ setShowImportModal(true); setImportStep(1); setMenuOpen(false); } },
                      { label:"Export Roster", icon:"📥", action:()=>{ exportRoster(); setMenuOpen(false); } },
                    ].map((item,i)=>(
                      <button key={i} onClick={item.action} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:500, color:NYU.gray900, fontFamily:"'Inter', sans-serif", textAlign:"left" }}
                        onMouseEnter={e=>e.currentTarget.style.background=NYU.gray50} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{ height:1, background:NYU.gray100, margin:"4px 12px" }}/>
                    <button onClick={()=>{ setSettingsDraft({ year:user.year, graduationDate:graduationDateStr, name:user.name, clinicSchedule:JSON.parse(JSON.stringify(clinicSchedule)) }); setSettingsTab("profile"); setShowSettings(true); setMenuOpen(false); }}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:500, color:NYU.gray900, fontFamily:"'Inter', sans-serif", textAlign:"left" }}
                      onMouseEnter={e=>e.currentTarget.style.background=NYU.gray50} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      <span style={{ fontSize:15 }}>⚙️</span>Settings
                    </button>
                    <div style={{ height:1, background:NYU.gray100, margin:"4px 12px" }}/>
                    <button onClick={()=>{ handleLogout(); setMenuOpen(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:500, color:NYU.red, fontFamily:"'Inter', sans-serif", textAlign:"left" }}
                      onMouseEnter={e=>e.currentTarget.style.background=NYU.gray50} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      <span style={{ fontSize:15 }}>🚪</span>Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={()=>{ setSettingsDraft({ year:user.year, graduationDate:graduationDateStr, name:user.name, clinicSchedule:JSON.parse(JSON.stringify(clinicSchedule)) }); setSettingsTab("profile"); setShowSettings(true); }}
                style={{ width:36, height:36, borderRadius:"50%", background:T.lavender, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:T.purple, fontSize:14, fontWeight:700 }}>{user?.name?.[0]||"?"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="page-inner" style={{ maxWidth:640, margin:"0 auto" }}>

          {/* ── TODAY TAB ── */}
          {tab==="today"&&(()=>{
            const todayStr = new Date().toISOString().split("T")[0];
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
            const todayPts = patients.filter(p=>p.nextAppt===todayStr).sort((a,b)=>(a.nextApptTime||"").localeCompare(b.nextApptTime||""));
            const pendingCount = patients.filter(p=>{ const pa=getPreAuthNudge(p),lb=getLabNudge(p); return pa||lb||(!p.nextAppt&&calculateStatus(p)==="F/U Appt Needed"); }).length;
            const totalRequired = customGoals.filter(g=>g.visible).reduce((s,g)=>s+g.required,0);
            const totalCompleted = customGoals.filter(g=>g.visible).reduce((sum,g)=>sum+patients.filter(p=>p.discipline===g.discipline&&p.isPrimaryProvider!==false).reduce((s,p)=>s+(p.visitLog?.length||0),0),0);
            const reqLeft = Math.max(0,totalRequired-totalCompleted);
            const urgentNonToday = patients.filter(p=>calculateUrgency(p)&&p.nextAppt!==todayStr);
            const getApptBadge = (p) => { const pa=getPreAuthNudge(p);const lb=getLabNudge(p); if(pa) return{label:pa.label,color:pa.color,bg:pa.bg}; if(lb) return{label:lb.label,color:lb.color,bg:lb.bg}; return null; };
            const nudges=[];
            if(urgentNonToday.length) nudges.push({icon:"⚠️",title:`${urgentNonToday.length} patient${urgentNonToday.length!==1?"s":""} need follow-up`,desc:urgentNonToday.slice(0,2).map(p=>p.alias).join(", ")+(urgentNonToday.length>2?` +${urgentNonToday.length-2} more`:""),bg:"#fef3e2",border:"#f59e0b",text:"#92400e"});
            if(reqLeft>0) nudges.push({icon:"🎓",title:`${reqLeft} requirement${reqLeft!==1?"s":""} to go`,desc:"Keep logging visits to stay on track for graduation.",bg:"#eef6ff",border:"#3b82f6",text:"#1e40af"});
            if(!nudges.length) nudges.push({icon:"✅",title:"You're all caught up!",desc:"No urgent items — great work keeping your caseload on track.",bg:"#ecfdf5",border:"#10b981",text:"#065f46"});
            const nudge=nudges[0];
            return (
              <div style={{ padding:"20px 16px" }}>
                <div style={{ fontFamily:"'Fraunces', serif", fontSize:24, fontWeight:700, color:"#1e1428", marginBottom:3, lineHeight:1.2 }}>{greeting}, {user?.name?.split(" ")[0]}.</div>
                <div style={{ fontSize:13, color:"#a89cbd", marginBottom:20 }}>{new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" })} · {patients.length} patient{patients.length!==1?"s":""}</div>
                <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                  {[
                    {label:"Today's patients",value:todayPts.length,bg:"#EEEDFE",color:"#3C3489"},
                    {label:"Pending items",value:pendingCount,bg:"#FAEEDA",color:"#633806"},
                    {label:"Req. left",value:reqLeft,bg:"#E1F5EE",color:"#085041"},
                  ].map(s=>(
                    <div key={s.label} style={{ flex:1,background:s.bg,borderRadius:16,padding:"14px 10px",textAlign:"center",minWidth:0 }}>
                      <div style={{ fontSize:26,fontWeight:700,color:s.color,fontFamily:"'Fraunces', serif",lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:11,color:s.color,marginTop:5,opacity:0.85,lineHeight:1.3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:nudge.bg,borderRadius:12,borderLeft:`3px solid ${nudge.border}`,padding:"14px 16px",marginBottom:24,display:"flex",alignItems:"flex-start",gap:12 }}>
                  <span style={{ fontSize:20,flexShrink:0,marginTop:1 }}>{nudge.icon}</span>
                  <div>
                    <div style={{ fontWeight:700,fontSize:14,color:nudge.text,marginBottom:3 }}>{nudge.title}</div>
                    <div style={{ fontSize:12,color:nudge.text,opacity:0.8,lineHeight:1.4 }}>{nudge.desc}</div>
                  </div>
                </div>
                {showWeeklyToast&&(
                  <div style={{ background:"linear-gradient(135deg,#534AB7,#3C3489)",borderRadius:16,padding:"16px 18px",marginBottom:20,display:"flex",alignItems:"flex-start",gap:12,boxShadow:"0 4px 20px rgba(83,74,183,0.25)" }}>
                    <span style={{ fontSize:20,flexShrink:0 }}>📋</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"white",fontWeight:700,fontSize:13,marginBottom:4 }}>Weekly Summary</div>
                      <div style={{ color:"rgba(255,255,255,0.85)",fontSize:12,lineHeight:1.5 }}>Last week: {behaviorAnalysis.last4Visits} visit{behaviorAnalysis.last4Visits!==1?"s":""}. Pace is {behaviorAnalysis.paceTrend==="slowing"?"slowing ↘":"on track ✓"}.{behaviorAnalysis.neglectedDisciplines.length>0?` Focus: ${behaviorAnalysis.neglectedDisciplines[0]}.`:""}</div>
                    </div>
                    <button onClick={()=>{ setWeeklyToastDismissed(true); localStorage.setItem("lastWeeklySummaryDate",thisWeekKey); }} style={{ background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,color:"white",fontSize:18,cursor:"pointer",padding:"0 8px",flexShrink:0,lineHeight:1 }}>×</button>
                  </div>
                )}
                <div style={{ fontSize:11,fontWeight:700,color:"#a89cbd",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12 }}>Today's appointments</div>
                {todayPts.length===0?(
                  <div style={{ background:"white",borderRadius:16,padding:"32px 20px",textAlign:"center",border:"1px solid rgba(107,33,168,0.08)",color:"#a89cbd",marginBottom:24 }}>
                    <div style={{ fontSize:28,marginBottom:10 }}>📅</div>
                    <div style={{ fontSize:15,fontWeight:600,color:"#6b5f7a",marginBottom:6 }}>No appointments today</div>
                    <div style={{ fontSize:13 }}>Tap + to add a patient or use Quick Log below.</div>
                  </div>
                ):(
                  <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24 }}>
                    {todayPts.map(p=>{
                      const ava=DISCIPLINE_AVATAR[p.discipline]||{bg:T.lavender,color:T.purple,initial:"??"};
                      const badge=getApptBadge(p);
                      return (
                        <div key={p.id} style={{ background:"white",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,border:"1px solid rgba(107,33,168,0.08)",boxShadow:"0 1px 4px rgba(107,33,168,0.05)" }}>
                          <div style={{ width:40,height:40,borderRadius:12,background:ava.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                            <span style={{ fontSize:12,fontWeight:700,color:ava.color }}>{ava.initial}</span>
                          </div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ fontWeight:600,fontSize:14,color:"#1e1428" }}>{p.alias}</div>
                            <div style={{ fontSize:12,color:"#a89cbd",marginTop:2 }}>{p.procedure||"No procedure"} · {p.nextApptTime||"Time TBD"}</div>
                            {badge&&<span style={{ fontSize:10,fontWeight:600,color:badge.color,background:badge.bg,borderRadius:99,padding:"2px 8px",display:"inline-block",marginTop:4 }}>{badge.label}</span>}
                          </div>
                          <button onClick={()=>{ setDetailPatient(p.id); setShowLogModal(p.id); setNewVisit({date:todayStr,procedure:"",notes:"",nextAppt:"",cdtCode:"",facultyName:""}); setNlpInput(""); setNlpParsed(null); setNlpError(""); }}
                            style={{ background:"#1D9E75",color:"white",border:"none",borderRadius:10,padding:"9px 14px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap",flexShrink:0,minHeight:44 }}>Log Visit</button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {urgentNonToday.length>0&&(
                  <>
                    <div style={{ fontSize:11,fontWeight:700,color:"#a89cbd",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12 }}>Also needs attention</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:16 }}>
                      {urgentNonToday.slice(0,5).map(p=>{
                        const ava=DISCIPLINE_AVATAR[p.discipline]||{bg:T.lavender,color:T.purple,initial:"??"};
                        const reasons=calculateUrgency(p)||[];
                        return (
                          <div key={p.id} onClick={()=>setDetailPatient(p.id)} style={{ background:"white",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,border:"1px solid #fed7aa",cursor:"pointer",transition:"all 0.18s" }}>
                            <div style={{ width:36,height:36,borderRadius:11,background:ava.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                              <span style={{ fontSize:11,fontWeight:700,color:ava.color }}>{ava.initial}</span>
                            </div>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ fontWeight:600,fontSize:14,color:"#1e1428" }}>{p.alias}</div>
                              <div style={{ fontSize:12,color:"#b45309" }}>{reasons[0]}</div>
                            </div>
                            <span style={{ color:"#e5dff0",fontSize:16 }}>›</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {/* ── ROSTER TAB ── */}
          {tab==="roster"&&(
            <div style={{ padding:"16px 16px 0" }}>
              <input
                style={{ width:"100%",boxSizing:"border-box",border:"none",borderRadius:14,padding:"12px 16px",fontSize:14,fontFamily:"'Inter', sans-serif",color:"#1e1428",outline:"none",background:"#ede9f5",marginBottom:12 }}
                placeholder="Search by alias, chart number, or procedure…"
                value={rosterSearch}
                onChange={e=>setRosterSearch(e.target.value)}
              />
              <div style={{ display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4 }}>
                {["All","Urgent","F/U Needed","Complete"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?"#534AB7":"#ede9f5",color:filter===f?"white":"#6b5f7a",border:"none",borderRadius:99,padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.15s" }}>{f}</button>
                ))}
              </div>
              {filtered.length===0&&(
                <div style={{ textAlign:"center",padding:"60px 20px",color:"#a89cbd" }}>
                  <div style={{ fontSize:36,marginBottom:12 }}>🗂️</div>
                  <div style={{ fontSize:15,fontWeight:600,color:"#6b5f7a" }}>No patients found</div>
                </div>
              )}
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {filtered.map(patient=>{
                  const status=calculateStatus(patient);
                  const statusMeta={
                    "Active":           {bg:"#EAF3DE",color:"#27500A"},
                    "F/U Appt Needed":  {bg:"#FAEEDA",color:"#633806"},
                    "Treatment Complete":{bg:"#EEEDFE",color:"#3C3489"},
                  }[status]||{bg:"#fef2f2",color:"#791F1F"};
                  const urgency=calculateUrgency(patient);
                  const avatarMeta=DISCIPLINE_AVATAR[patient.discipline]||{bg:T.lavender,color:T.purple,initial:"??"};
                  const preAuthNudge=getPreAuthNudge(patient);
                  const labNudge=getLabNudge(patient);
                  return (
                    <div key={patient.id} onClick={()=>setDetailPatient(patient.id)} style={{ background:"white",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:urgency?"1px solid #fed7aa":"1px solid rgba(107,33,168,0.08)",transition:"all 0.18s",minHeight:64 }}>
                      <div style={{ width:44,height:44,borderRadius:13,background:avatarMeta.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative" }}>
                        <span style={{ fontSize:12,fontWeight:700,color:avatarMeta.color,letterSpacing:"0.04em" }}>{avatarMeta.initial}</span>
                        {urgency&&<div style={{ position:"absolute",top:-2,right:-2,width:9,height:9,borderRadius:"50%",background:"#c2410c",border:"2px solid white" }}/>}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontWeight:600,fontSize:15,color:"#1e1428",marginBottom:2 }}>{patient.alias}</div>
                        <div style={{ fontSize:12,color:"#a89cbd",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{patient.discipline} · {patient.procedure||"No procedure"}</div>
                        {(preAuthNudge||labNudge)&&(
                          <div style={{ display:"flex",gap:6,marginTop:4,flexWrap:"wrap" }}>
                            {preAuthNudge&&<span style={{ fontSize:10,fontWeight:600,color:preAuthNudge.color,background:preAuthNudge.bg,borderRadius:99,padding:"2px 8px" }}>📄 {preAuthNudge.label}</span>}
                            {labNudge&&<span style={{ fontSize:10,fontWeight:600,color:labNudge.color,background:labNudge.bg,borderRadius:99,padding:"2px 8px" }}>🧪 {labNudge.label}</span>}
                          </div>
                        )}
                      </div>
                      <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
                        <span style={{ fontSize:11,padding:"4px 10px",borderRadius:99,background:statusMeta.bg,color:statusMeta.color,fontWeight:600 }}>{status==="Treatment Complete"?"Complete":status==="F/U Appt Needed"?"F/U Needed":status}</span>
                        <span style={{ color:"#e5dff0",fontSize:16 }}>›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ height:16 }}/>
            </div>
          )}

          {/* ── CALENDAR TAB ── */}
          {tab==="calendar"&&(()=>{
            const PROCEDURE_DURATIONS = { "Root Canal":120,"Crown Prep":90,"Implant Placement":120,"Scaling & Root Planing":90,"Extraction":60,"Cleaning":60,"Exam":45,"Consultation":30,"default":60 };
            const startOfWeek=(d)=>{ const day=new Date(d); const diff=day.getDate()-day.getDay()+(day.getDay()===0?-6:1); day.setDate(diff); day.setHours(0,0,0,0); return day; };
            const addDays=(d,n)=>{ const x=new Date(d); x.setDate(x.getDate()+n); return x; };
            const fmt=(d)=>d.toISOString().split("T")[0];
            const fmtDisplay=(d)=>d.toLocaleDateString("en-US",{ month:"short", day:"numeric" });
            const fmtMonth=(d)=>d.toLocaleDateString("en-US",{ month:"long", year:"numeric" });
            const isToday=(d)=>fmt(d)===fmt(new Date());
            const isWeekend=(d)=>d.getDay()===0||d.getDay()===6;
            const weekStart=startOfWeek(calDate);
            const weekDays=[0,1,2,3,4,5,6].map(i=>addDays(weekStart,i));
            const DAY_NAMES=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
            const todaySchedule=(d)=>clinicSchedule[DAY_NAMES[d.getDay()]]||{ enabled:false,start:"09:00",end:"17:00" };
            const parseHour=(t)=>parseInt(t.split(":")[0]);
            const getSessionsForDay=(d)=>{ const s=todaySchedule(d); if(!s.enabled) return []; const st=parseHour(s.start); const en=parseHour(s.end); const mid=Math.floor((st+en)/2); return [{ label:"Morning Session",start:st,end:mid },{ label:"Afternoon Session",start:mid,end:en }]; };
            const CLINIC_SESSIONS=getSessionsForDay(weekDays[0]).length>0?getSessionsForDay(weekDays[0]):[{ label:"Morning Session",start:9,end:13 },{ label:"Afternoon Session",start:13,end:17 }];
            const pairedApptMap={};
            if(calCombinedView) patients.filter(p=>p.handoffPartner).forEach(p=>{ if(p.nextAppt){ if(!pairedApptMap[p.nextAppt]) pairedApptMap[p.nextAppt]=[]; pairedApptMap[p.nextAppt].push({ alias:p.alias,procedure:p.procedure,discipline:p.discipline,provider:p.handoffPartner,providerYear:p.handoffPartnerYear }); } });

            const apptMap={};
            patients.forEach(p=>{ if(p.nextAppt){ if(!apptMap[p.nextAppt]) apptMap[p.nextAppt]=[]; apptMap[p.nextAppt].push({ type:"confirmed",patient:p,duration:PROCEDURE_DURATIONS[p.procedure]||PROCEDURE_DURATIONS.default,label:p.alias,sublabel:p.procedure||p.discipline,time:p.nextApptTime||"",color:T.purple,bg:T.purpleLight }); } });
            patients.filter(p=>!p.treatmentComplete&&!p.nextAppt).forEach(p=>{ const pred=predictCompletion(p); if(!pred||!p.lastVisit) return; const avgInterval=pred.avgInterval||21; const suggestedDate=fmt(addDays(new Date(p.lastVisit),avgInterval)); if(!apptMap[suggestedDate]) apptMap[suggestedDate]=[]; apptMap[suggestedDate].push({ type:"suggested",patient:p,duration:PROCEDURE_DURATIONS[p.procedure]||PROCEDURE_DURATIONS.default,label:`Schedule ${p.alias}`,sublabel:`Suggested · ${p.discipline}`,time:"",color:T.purpleMid,bg:"#f3e8ff" }); });

            const gradDateStr=graduationDateStr;
            const startOfMonth=(d)=>new Date(d.getFullYear(),d.getMonth(),1);
            const daysInMonth=(d)=>new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
            const monthStart=startOfMonth(calDate);
            const firstDayOfWeek=(monthStart.getDay()+6)%7;
            const totalDays=daysInMonth(calDate);

            // Conflict detection — same date, same time (non-empty)
            const hasConflict=(dateStr,time,excludeId)=>{
              if(!time) return false;
              return patients.some(p=>p.id!==excludeId&&p.nextAppt===dateStr&&p.nextApptTime===time);
            };

            const ApptChip=({ appt,compact })=>{
              const conflict = appt.type==="confirmed" && hasConflict(appt.patient.nextAppt, appt.patient.nextApptTime, null);
              return (
                <div style={{ background:conflict?"#fee2e2":appt.bg,borderLeft:`3px solid ${conflict?NYU.red:appt.color}`,borderRadius:6,padding:compact?"2px 6px":"5px 8px",marginBottom:3,cursor:"pointer",transition:"opacity 0.15s",position:"relative" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:4 }}>
                    <div style={{ fontSize:compact?10:11,fontWeight:700,color:conflict?NYU.red:appt.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1 }}
                      onClick={()=>setDetailPatient(appt.patient.id)}>
                      {appt.type==="suggested"?"💡 ":"📌 "}{appt.label}
                    </div>
                    {appt.type==="confirmed"&&!compact&&(
                      <button onClick={e=>{ e.stopPropagation(); setApptModalMode("edit"); setApptDraft({ patientId:appt.patient.id, date:appt.patient.nextAppt, time:appt.patient.nextApptTime||"" }); setShowApptModal(true); }}
                        style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,color:appt.color,padding:"0 2px",flexShrink:0,fontFamily:"'Inter', sans-serif" }}>✎</button>
                    )}
                  </div>
                  {appt.time&&!compact&&<div style={{ fontSize:10,color:conflict?NYU.red:NYU.gray400,marginTop:1,fontWeight:conflict?700:400 }}>{conflict?"⚠ Conflict · ":""}{appt.time}</div>}
                  {!compact&&<div style={{ fontSize:10,color:NYU.gray400,marginTop:1 }}>{appt.sublabel}</div>}
                </div>
              );
            };

            return (
              <div>
                {/* Toolbar */}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <button onClick={()=>setCalDate(d=>calView==="week"?addDays(d,-7):new Date(d.getFullYear(),d.getMonth()-1,1))} style={{ background:NYU.gray100,border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
                    <span style={{ fontWeight:700,fontSize:15,color:NYU.gray900,minWidth:180,textAlign:"center" }}>{calView==="week"?`${fmtDisplay(weekDays[0])} — ${fmtDisplay(weekDays[4])}`:fmtMonth(calDate)}</span>
                    <button onClick={()=>setCalDate(d=>calView==="week"?addDays(d,7):new Date(d.getFullYear(),d.getMonth()+1,1))} style={{ background:NYU.gray100,border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
                    <button onClick={()=>setCalDate(new Date())} style={{ background:T.lavender,border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600,color:T.purple,fontFamily:"'Inter', sans-serif" }}>Today</button>
                  </div>
                  <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                    <div style={{ display:"flex",background:NYU.gray100,borderRadius:10,padding:3 }}>
                      {["week","month"].map(v=>(
                        <button key={v} onClick={()=>setCalView(v)} style={{ background:calView===v?"white":"transparent",border:"none",borderRadius:8,padding:"6px 16px",cursor:"pointer",fontSize:12,fontWeight:600,color:calView===v?T.purple:NYU.gray400,fontFamily:"'Inter', sans-serif",boxShadow:calView===v?"0 1px 4px rgba(107,33,168,0.1)":"none",transition:"all 0.15s" }}>{v==="week"?"Week":"Month"}</button>
                      ))}
                    </div>
                    {patients.some(p=>p.handoffPartner)&&(
                      <button onClick={()=>setCalCombinedView(!calCombinedView)} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:10,border:`1px solid ${calCombinedView?"#0ea5e9":NYU.gray200}`,background:calCombinedView?"#e0f2fe":"white",color:calCombinedView?"#0369a1":NYU.gray400,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter', sans-serif",transition:"all 0.15s" }}>
                        <span style={{ width:8,height:8,borderRadius:"50%",background:"#0ea5e9",display:"inline-block" }}/>Combined
                      </button>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display:"flex",gap:16,marginBottom:16,flexWrap:"wrap",alignItems:"center" }}>
                  {[
                    { color:T.purple, label:"Confirmed" },
                    { color:T.purpleMid, label:"Suggested" },
                    { color:ROTATION_COLOR, label:"External rotation" },
                    { color:NYU.red, label:"Time conflict" },
                  ].map(l=>(
                    <div key={l.label} style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <div style={{ width:10,height:10,borderRadius:3,background:l.color }}/>
                      <span style={{ fontSize:11,color:NYU.gray600 }}>{l.label}</span>
                    </div>
                  ))}
                  <span style={{ fontSize:11,color:NYU.gray400,marginLeft:4 }}>· Click any empty slot to add an appointment</span>
                </div>

                {/* Week view */}
                {calView==="week"&&(
                  <div style={{ background:"white",borderRadius:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                    <div style={{ display:"grid",gridTemplateColumns:"64px repeat(7,1fr)",borderBottom:`1px solid ${NYU.gray100}` }}>
                      <div style={{ padding:"10px 0",borderRight:`1px solid ${NYU.gray100}` }}/>
                      {weekDays.map((d,i)=>(
                        <div key={i} style={{ padding:"10px 12px",borderRight:i<6?`1px solid ${NYU.gray100}`:"none",background:isToday(d)?T.lavender:"white" }}>
                          <div style={{ fontSize:11,fontWeight:600,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.06em" }}>{d.toLocaleDateString("en-US",{ weekday:"short" })}</div>
                          <div style={{ fontSize:20,fontWeight:700,color:isToday(d)?T.purple:NYU.gray900,fontFamily:"'Fraunces', serif",lineHeight:1.2 }}>{d.getDate()}</div>
                          {fmt(d)===gradDateStr&&<div style={{ fontSize:10,fontWeight:700,color:"#b45309",background:"#fef3c7",borderRadius:99,padding:"1px 8px",marginTop:2,display:"inline-block" }}>🎓 Graduation</div>}
                        </div>
                      ))}
                    </div>
                    {CLINIC_SESSIONS.map((session,si)=>(
                      <div key={si} style={{ display:"grid",gridTemplateColumns:"64px repeat(7,1fr)",borderBottom:si<CLINIC_SESSIONS.length-1?`1px solid ${NYU.gray100}`:"none" }}>
                        <div style={{ padding:"12px 8px",borderRight:`1px solid ${NYU.gray100}`,background:NYU.gray50 }}>
                          <div style={{ fontSize:10,fontWeight:700,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.05em",lineHeight:1.4 }}>{session.label.split(" ")[0]}<br/>{session.label.split(" ")[1]}</div>
                          <div style={{ fontSize:10,color:NYU.gray400,marginTop:4 }}>{session.start}:00–{session.end}:00</div>
                        </div>
                        {weekDays.map((d,di)=>{
                          const dateStr=fmt(d);
                          const dayAppts=(apptMap[dateStr]||[]);
                          const isGrad=dateStr===gradDateStr;
                          const daySched=todaySchedule(d);
                          const dayDisabled=!daySched.enabled;
                          const isEmpty=!dayAppts.length&&!isGrad&&!dayDisabled;
                          return (
                            <div key={di}
                              onClick={isEmpty?()=>{ setApptModalMode("new"); setApptDraft({ patientId:"", date:dateStr, time:"" }); setShowApptModal(true); }:undefined}
                              style={{ padding:"10px 8px",borderRight:di<6?`1px solid ${NYU.gray100}`:"none",minHeight:90,background:dayDisabled?NYU.gray50:isToday(d)?"#fdfcff":"white",cursor:isEmpty?"pointer":"default",transition:"background 0.15s" }}
                              onMouseEnter={e=>{ if(isEmpty) e.currentTarget.style.background="#f5f0ff"; }}
                              onMouseLeave={e=>{ if(isEmpty) e.currentTarget.style.background=isToday(d)?"#fdfcff":"white"; }}>
                              {dayDisabled&&<div style={{ fontSize:10,color:NYU.gray200,fontStyle:"italic" }}>No clinic</div>}
                              {isGrad&&<div style={{ background:"#fef3c7",borderLeft:`3px solid #b45309`,borderRadius:6,padding:"4px 8px",marginBottom:4 }}><div style={{ fontSize:10,fontWeight:700,color:"#b45309" }}>🎓 Graduation Day</div></div>}
                              {getRotationsForDate(dateStr).map((r,ri)=>(
                                <div key={ri} onClick={()=>{ setRotationDraft({ id:r.id, site:r.site, startDate:r.startDate, endDate:r.endDate, time:r.time||"" }); setShowRotationModal(true); }}
                                  style={{ background:"#ecfeff",borderLeft:`3px solid ${ROTATION_COLOR}`,borderRadius:6,padding:"4px 8px",marginBottom:3,cursor:"pointer",transition:"opacity 0.15s" }}
                                  onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:4 }}>
                                    <div style={{ fontSize:10,fontWeight:700,color:ROTATION_COLOR,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1 }}>🏥 {r.site}</div>
                                    <span style={{ fontSize:9,color:"#0891b2" }}>✎</span>
                                  </div>
                                  <div style={{ fontSize:9,color:"#0e7490",marginTop:1 }}>{r.type}{r.time?` · ${r.time}`:""}</div>
                                </div>
                              ))}
                              {dayAppts.map((appt,ai)=><ApptChip key={ai} appt={appt} compact={false}/>)}
                              {calCombinedView&&(pairedApptMap[dateStr]||[]).map((a,ai)=>(
                                <div key={"paired"+ai} style={{ background:"#e0f2fe",borderLeft:"3px solid #0ea5e9",borderRadius:8,padding:"4px 8px",marginBottom:3,fontSize:11 }}>
                                  <div style={{ fontWeight:700,color:"#0369a1",fontSize:10 }}>@{a.provider}</div>
                                  <div style={{ color:"#0284c7",fontSize:10 }}>{a.alias}</div>
                                </div>
                              ))}
                              {isEmpty&&<div style={{ fontSize:10,color:NYU.gray200,fontStyle:"italic",marginTop:4 }}>+ Add</div>}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}

                {/* Month view */}
                {calView==="month"&&(
                  <div style={{ background:"white",borderRadius:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${NYU.gray100}` }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                        <div key={d} style={{ padding:"10px 0",textAlign:"center",fontSize:11,fontWeight:700,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.06em" }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)" }}>
                      {Array(firstDayOfWeek).fill(null).map((_,i)=>(
                        <div key={`e-${i}`} style={{ minHeight:100,borderRight:`1px solid ${NYU.gray100}`,borderBottom:`1px solid ${NYU.gray100}`,background:NYU.gray50 }}/>
                      ))}
                      {Array(totalDays).fill(null).map((_,i)=>{
                        const dayNum=i+1;
                        const d=new Date(calDate.getFullYear(),calDate.getMonth(),dayNum);
                        const dateStr=fmt(d);
                        const dayAppts=apptMap[dateStr]||[];
                        const isGrad=dateStr===gradDateStr;
                        const todayFlag=isToday(d);
                        const weekend=isWeekend(d);
                        const colIndex=(firstDayOfWeek+i)%7;
                        const isEmpty=!dayAppts.length&&!isGrad;
                        return (
                          <div key={dayNum}
                            onClick={isEmpty?()=>{ setApptModalMode("new"); setApptDraft({ patientId:"", date:dateStr, time:"" }); setShowApptModal(true); }:undefined}
                            style={{ minHeight:100,padding:"6px 6px 8px",borderRight:colIndex<6?`1px solid ${NYU.gray100}`:"none",borderBottom:`1px solid ${NYU.gray100}`,background:todayFlag?"#fdfcff":weekend?NYU.gray50:"white",cursor:isEmpty?"pointer":"default" }}
                            onMouseEnter={e=>{ if(isEmpty) e.currentTarget.style.background="#f5f0ff"; }}
                            onMouseLeave={e=>{ if(isEmpty) e.currentTarget.style.background=todayFlag?"#fdfcff":weekend?NYU.gray50:"white"; }}>
                            <div style={{ fontSize:13,fontWeight:700,color:todayFlag?T.purple:weekend?NYU.gray400:NYU.gray900,marginBottom:4,width:24,height:24,borderRadius:"50%",background:todayFlag?T.lavender:"transparent",display:"flex",alignItems:"center",justifyContent:"center" }}>{dayNum}</div>
                            {isGrad&&<div style={{ background:"#fef3c7",borderLeft:`3px solid #b45309`,borderRadius:4,padding:"2px 5px",marginBottom:3 }}><div style={{ fontSize:9,fontWeight:700,color:"#b45309" }}>🎓 Graduation</div></div>}
                            {getRotationsForDate(dateStr).map((r,ri)=>(
                              <div key={ri} onClick={()=>{ setRotationDraft({ id:r.id, site:r.site, startDate:r.startDate, endDate:r.endDate, time:r.time||"" }); setShowRotationModal(true); }}
                                style={{ background:"#ecfeff",borderLeft:`3px solid ${ROTATION_COLOR}`,borderRadius:4,padding:"2px 5px",marginBottom:3,cursor:"pointer" }}>
                                <div style={{ fontSize:9,fontWeight:700,color:ROTATION_COLOR,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>🏥 {r.site}</div>
                              </div>
                            ))}
                            {dayAppts.slice(0,2).map((appt,ai)=><ApptChip key={ai} appt={appt} compact={true}/>)}
                            {dayAppts.length>2&&<div style={{ fontSize:10,color:T.purple,fontWeight:600,marginTop:2 }}>+{dayAppts.length-2} more</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upcoming & Scheduled list with times and conflict flags */}
                <div style={{ marginTop:24 }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:NYU.gray600 }}>📋 Upcoming & Scheduled</div>
                    {patients.filter(p=>p.nextAppt&&p.nextApptTime).length>0&&(
                      <div style={{ fontSize:11,color:NYU.gray400 }}>Times shown · ⚠ = conflict</div>
                    )}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                    {Object.entries(apptMap).filter(([date])=>date>=fmt(new Date())).sort(([a],[b])=>a.localeCompare(b)).slice(0,10).map(([date,appts])=>{
                      // Check for conflicts on this date
                      const confirmedAppts = appts.filter(a=>a.type==="confirmed");
                      const timeCounts = {};
                      confirmedAppts.forEach(a=>{ if(a.time) timeCounts[a.time]=(timeCounts[a.time]||0)+1; });
                      const conflictTimes = new Set(Object.keys(timeCounts).filter(t=>timeCounts[t]>1));

                      return (
                        <div key={date} style={{ background:"white",borderRadius:14,padding:"14px 18px",border:`1px solid ${conflictTimes.size>0?"#fecaca":NYU.gray100}`,display:"flex",gap:16,alignItems:"flex-start" }}>
                          <div style={{ flexShrink:0,textAlign:"center",minWidth:44 }}>
                            <div style={{ fontSize:11,fontWeight:600,color:NYU.gray400,textTransform:"uppercase" }}>{new Date(date+"T12:00:00").toLocaleDateString("en-US",{ month:"short" })}</div>
                            <div style={{ fontSize:24,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif",lineHeight:1 }}>{new Date(date+"T12:00:00").getDate()}</div>
                          </div>
                          <div style={{ flex:1 }}>
                            {appts.sort((a,b)=>{ if(!a.time) return 1; if(!b.time) return -1; return a.time.localeCompare(b.time); }).map((appt,i)=>{
                              const isConflict = appt.type==="confirmed" && appt.time && conflictTimes.has(appt.time);
                              return (
                                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<appts.length-1?`1px solid ${NYU.gray100}`:"none" }}>
                                  <div style={{ width:8,height:8,borderRadius:"50%",background:isConflict?NYU.red:appt.color,flexShrink:0 }}/>
                                  <div style={{ flex:1 }}>
                                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                                      <span style={{ fontWeight:600,fontSize:13,color:NYU.gray900,cursor:"pointer" }} onClick={()=>setDetailPatient(appt.patient.id)}>{appt.label}</span>
                                      {appt.time&&<span style={{ fontSize:11,fontWeight:700,color:isConflict?NYU.red:T.purple,background:isConflict?"#fee2e2":T.lavender,borderRadius:99,padding:"2px 8px" }}>{isConflict?"⚠ ":""}{appt.time}</span>}
                                    </div>
                                    <div style={{ fontSize:12,color:NYU.gray400,marginTop:2 }}>{appt.sublabel} · {appt.duration} min</div>
                                  </div>
                                  <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                                    <span style={{ fontSize:10,fontWeight:600,color:appt.type==="suggested"?T.purpleMid:NYU.green,background:appt.type==="suggested"?"#f3e8ff":NYU.greenLight,borderRadius:99,padding:"2px 8px" }}>{appt.type==="suggested"?"Suggested":"Confirmed"}</span>
                                    {appt.type==="confirmed"&&(
                                      <button onClick={()=>{ setApptModalMode("edit"); setApptDraft({ patientId:appt.patient.id, date:appt.patient.nextAppt, time:appt.patient.nextApptTime||"" }); setShowApptModal(true); }}
                                        style={{ background:NYU.gray100,border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:11,color:NYU.gray600,fontFamily:"'Inter', sans-serif",fontWeight:600 }}>✎ Edit</button>
                                    )}
                                    {appt.type==="suggested"&&(
                                      <button onClick={()=>{ setApptModalMode("new"); setApptDraft({ patientId:appt.patient.id, date:appt.patient.nextAppt||date, time:"" }); setShowApptModal(true); }}
                                        style={{ background:T.lavender,border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:11,color:T.purple,fontFamily:"'Inter', sans-serif",fontWeight:600 }}>+ Confirm</button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {Object.entries(apptMap).filter(([date])=>date>=fmt(new Date())).length===0&&(
                      <div style={{ textAlign:"center",padding:"40px 20px",color:NYU.gray400 }}>
                        <div style={{ fontSize:32,marginBottom:8 }}>📅</div>
                        <div style={{ fontSize:14,fontWeight:500 }}>No upcoming appointments</div>
                        <div style={{ fontSize:12,marginTop:4 }}>Click any empty slot on the calendar to add one</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming rotations */}
                {(()=>{
                  const today2 = fmt(new Date());
                  // Build list of upcoming rotation dates in next 60 days
                  const upcomingRotations = [];
                  const end60 = new Date(Date.now()+60*86400000);
                  rotations.forEach(r=>{
                    if(r.recurring){
                      const DAY_IDX = { sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6 };
                      const targetDay = DAY_IDX[r.recurringDay];
                      let d = new Date(r.startDate+"T12:00:00");
                      const endD = new Date(r.endDate+"T12:00:00");
                      while(d<=endD && d<=end60){
                        if(d.getDay()===targetDay){
                          const ds = fmt(d);
                          if(ds>=today2) upcomingRotations.push({ dateStr:ds, rotation:r });
                        }
                        d.setDate(d.getDate()+1);
                      }
                    } else {
                      let d = new Date(r.startDate+"T12:00:00");
                      const endD = new Date(r.endDate+"T12:00:00");
                      while(d<=endD && d<=end60){
                        const ds = fmt(d);
                        if(ds>=today2) upcomingRotations.push({ dateStr:ds, rotation:r });
                        d.setDate(d.getDate()+1);
                      }
                    }
                  });
                  upcomingRotations.sort((a,b)=>a.dateStr.localeCompare(b.dateStr));
                  if(!upcomingRotations.length) return null;
                  return (
                    <div style={{ marginTop:24 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:NYU.gray600,marginBottom:12 }}>🏥 Upcoming Rotations</div>
                      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                        {upcomingRotations.slice(0,8).map(({ dateStr,rotation },i)=>(
                          <div key={i} style={{ background:"white",borderRadius:14,padding:"14px 18px",border:`1px solid #a5f3fc`,display:"flex",gap:16,alignItems:"center" }}>
                            <div style={{ flexShrink:0,textAlign:"center",minWidth:44 }}>
                              <div style={{ fontSize:11,fontWeight:600,color:"#0e7490",textTransform:"uppercase" }}>{new Date(dateStr+"T12:00:00").toLocaleDateString("en-US",{ month:"short" })}</div>
                              <div style={{ fontSize:24,fontWeight:700,color:ROTATION_COLOR,fontFamily:"'Fraunces', serif",lineHeight:1 }}>{new Date(dateStr+"T12:00:00").getDate()}</div>
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>{rotation.site}</div>
                              <div style={{ fontSize:12,color:"#0e7490",marginTop:2 }}>{rotation.type}{rotation.recurring?` · Every ${rotation.recurringDay.charAt(0).toUpperCase()+rotation.recurringDay.slice(1)}`:""}</div>
                              {rotation.notes&&<div style={{ fontSize:11,color:NYU.gray400,marginTop:4,fontStyle:"italic" }}>{rotation.notes}</div>}
                            </div>
                            <span style={{ fontSize:10,fontWeight:600,color:ROTATION_COLOR,background:"#ecfeff",borderRadius:99,padding:"3px 10px",flexShrink:0 }}>Rotation</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* ── NOTEBOOK TAB ── */}
          {tab==="notebook"&&(
            <div style={{ display:"flex",gap:20,alignItems:"flex-start" }}>
              <div style={{ width:280,flexShrink:0 }}>
                <div style={{ display:"flex",gap:8,marginBottom:16 }}>
                  <input style={{ ...inputStyle,fontSize:13,padding:"8px 12px",flex:1 }} placeholder="Search notes..." value={noteSearch} onChange={e=>setNoteSearch(e.target.value)}/>
                  <button className="action-btn" onClick={async()=>{ const id=`n${Date.now()}`; const todayStr=new Date().toISOString().split("T")[0]; const n={ id,title:"Untitled",body:"",category:"General",pinned:false,updatedAt:todayStr }; await fetch("/api/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}); setNotes(prev=>[n,...prev]); setActiveNote(id); setNoteDraft(n); }} style={{ background:T.purple,color:"white",padding:"8px 14px",fontSize:13,flexShrink:0 }}>+ New</button>
                </div>
                {notes.filter(n=>n.pinned).length>0&&(
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:10,fontWeight:700,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>Pinned</div>
                    {notes.filter(n=>n.pinned&&(!noteSearch||n.title.toLowerCase().includes(noteSearch.toLowerCase())||n.body.toLowerCase().includes(noteSearch.toLowerCase()))).map(note=>(
                      <NoteCard key={note.id} note={note} active={activeNote===note.id} onClick={()=>{ setActiveNote(note.id); setNoteDraft({...note}); }} activeBg={T.lavender}/>
                    ))}
                  </div>
                )}
                <div>
                  <div style={{ fontSize:10,fontWeight:700,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>All Notes</div>
                  {notes.filter(n=>!n.pinned&&(!noteSearch||n.title.toLowerCase().includes(noteSearch.toLowerCase())||n.body.toLowerCase().includes(noteSearch.toLowerCase()))).map(note=>(
                    <NoteCard key={note.id} note={note} active={activeNote===note.id} onClick={()=>{ setActiveNote(note.id); setNoteDraft({...note}); }} activeBg={T.lavender}/>
                  ))}
                </div>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                {!activeNote||!noteDraft?(
                  <div style={{ background:"white",borderRadius:16,border:`1px solid ${NYU.gray100}`,padding:"80px 40px",textAlign:"center" }}>
                    <div style={{ fontSize:40,marginBottom:16 }}>📓</div>
                    <div style={{ fontSize:16,fontWeight:600,color:NYU.gray900,marginBottom:8 }}>Your Notebook</div>
                    <div style={{ fontSize:13,color:NYU.gray400,marginBottom:24,lineHeight:1.6 }}>Jot down clinical thoughts, patient reminders, study notes.</div>
                    <button className="action-btn" onClick={async()=>{ const id=`n${Date.now()}`; const todayStr=new Date().toISOString().split("T")[0]; const n={ id,title:"Untitled",body:"",category:"General",pinned:false,updatedAt:todayStr }; await fetch("/api/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}); setNotes(prev=>[n,...prev]); setActiveNote(id); setNoteDraft(n); }} style={{ background:T.purple,color:"white" }}>Create your first note</button>
                  </div>
                ):(
                  <div style={{ background:"white",borderRadius:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                    <div style={{ padding:"14px 20px",borderBottom:`1px solid ${NYU.gray100}`,display:"flex",alignItems:"center",gap:10 }}>
                      <select value={noteDraft.category} onChange={e=>setNoteDraft(p=>({...p,category:e.target.value}))}
                        style={{ fontSize:12,fontWeight:600,border:"none",background:noteDraft.category==="Clinical"?"#e0f2fe":noteDraft.category==="Patient"?"#f3e8ff":noteDraft.category==="Study"?"#d1fae5":"#fef3c7",color:noteDraft.category==="Clinical"?"#0369a1":noteDraft.category==="Patient"?"#6d28d9":noteDraft.category==="Study"?"#065f46":"#92400e",borderRadius:99,padding:"4px 12px",cursor:"pointer",outline:"none",fontFamily:"'Inter', sans-serif" }}>
                        <option>Clinical</option><option>Patient</option><option>Study</option><option>General</option>
                      </select>
                      <button onClick={()=>setNoteDraft(p=>({...p,pinned:!p.pinned}))} style={{ background:noteDraft.pinned?NYU.amberLight:NYU.gray100,border:"none",borderRadius:99,padding:"4px 12px",cursor:"pointer",fontSize:12,color:noteDraft.pinned?NYU.amber:NYU.gray400,fontWeight:600,fontFamily:"'Inter', sans-serif" }}>{noteDraft.pinned?"📌 Pinned":"Pin"}</button>
                      <div style={{ flex:1 }}/>
                      <button onClick={()=>setConfirmDelete({ message:`Delete note "${noteDraft?.title||"Untitled"}"?`, onConfirm:async()=>{ logChange({ action_type:"NOTE_DELETED",patient_alias:"",description:`Deleted note "${noteDraft?.title||"Untitled"}"` }); await fetch(`/api/notes/${activeNote}`,{method:"DELETE"}); setNotes(prev=>prev.filter(n=>n.id!==activeNote)); setActiveNote(null); setNoteDraft(null); } })} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:NYU.gray400,fontFamily:"'Inter', sans-serif",padding:"4px 8px" }}>Delete</button>
                      <button className="action-btn" onClick={async()=>{ const updated={...noteDraft,updatedAt:new Date().toISOString().split("T")[0]}; await fetch(`/api/notes/${activeNote}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(updated)}); setNotes(prev=>prev.map(n=>n.id===activeNote?updated:n)); setNoteDraft(updated); }} style={{ background:T.purple,color:"white",padding:"7px 18px",fontSize:13 }}>Save</button>
                    </div>
                    <input style={{ width:"100%",fontSize:24,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif",border:"none",outline:"none",padding:"24px 28px 8px",letterSpacing:"-0.01em" }} placeholder="Untitled" value={noteDraft.title} onChange={e=>setNoteDraft(p=>({...p,title:e.target.value}))}/>
                    <div style={{ fontSize:11,color:NYU.gray400,paddingLeft:28,paddingBottom:12 }}>Last updated {noteDraft.updatedAt}</div>
                    <textarea style={{ width:"100%",minHeight:420,fontSize:15,color:NYU.gray600,border:"none",outline:"none",padding:"0 28px 28px",resize:"none",lineHeight:1.8,fontFamily:"'Inter', sans-serif",background:"transparent" }} placeholder="Start writing..." value={noteDraft.body} onChange={e=>setNoteDraft(p=>({...p,body:e.target.value}))}/>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── REQUIREMENTS TAB ── */}
          {tab==="requirements"&&(()=>{
            const getCompleted=(goal)=>patients.filter(p=>p.discipline===goal.discipline&&p.isPrimaryProvider!==false).reduce((s,p)=>s+(p.visitLog?.length||0),0);
            const visibleGoals=customGoals.filter(g=>g.visible);
            const complete=visibleGoals.filter(g=>getCompleted(g)>=g.required);
            const needsCases=visibleGoals.filter(g=>getCompleted(g)>0&&getCompleted(g)<g.required);
            const notStarted=visibleGoals.filter(g=>getCompleted(g)===0);
            const behindMost=needsCases.sort((a,b)=>(getCompleted(a)/a.required)-(getCompleted(b)/b.required))[0];
            return (
              <div style={{ padding:"20px 16px" }}>
                {/* Progress card */}
                <div style={{ background:"white",borderRadius:16,padding:"18px 20px",marginBottom:16,border:"1px solid rgba(107,33,168,0.08)" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                    <div style={{ fontSize:14,fontWeight:700,color:"#1e1428" }}>Graduation progress</div>
                    <div style={{ fontSize:22,fontWeight:700,color:T.purple,fontFamily:"'Fraunces', serif" }}>{velocityPct}%</div>
                  </div>
                  <div style={{ height:6,borderRadius:99,background:"#ede9f5",overflow:"hidden",marginBottom:8 }}>
                    <div style={{ height:"100%",borderRadius:99,width:`${velocityPct}%`,background:onTrack?"#534AB7":"#dc2626",transition:"width 0.6s ease" }}/>
                  </div>
                  <div style={{ fontSize:11,color:"#a89cbd" }}>{daysToGraduation} days to graduation · {totalCompleted}/{totalRequired} procedures complete</div>
                </div>
                {/* Focus nudge */}
                {behindMost&&(
                  <div style={{ background:"#FAEEDA",borderRadius:12,borderLeft:"3px solid #f59e0b",padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"flex-start",gap:10 }}>
                    <span style={{ fontSize:18,flexShrink:0 }}>🎯</span>
                    <div>
                      <div style={{ fontWeight:700,fontSize:13,color:"#633806",marginBottom:2 }}>Focus area: {behindMost.discipline}</div>
                      <div style={{ fontSize:12,color:"#92400e" }}>{getCompleted(behindMost)}/{behindMost.required} — {behindMost.required-getCompleted(behindMost)} more case{behindMost.required-getCompleted(behindMost)!==1?"s":""} needed</div>
                    </div>
                  </div>
                )}
                {/* Needs Cases section */}
                {needsCases.length>0&&(
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#b45309",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>Needs Cases ({needsCases.length})</div>
                    <div style={{ background:"white",borderRadius:16,border:"1px solid rgba(107,33,168,0.08)",overflow:"hidden" }}>
                      {needsCases.map((goal,i)=>{
                        const done=getCompleted(goal);
                        const pct=Math.min((done/goal.required)*100,100);
                        return (
                          <div key={goal.discipline} style={{ padding:"13px 16px",borderBottom:i<needsCases.length-1?"1px solid #f3f0f7":"none" }}>
                            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                              <span style={{ fontSize:13,color:"#1e1428",fontWeight:500 }}>{goal.discipline}</span>
                              <span style={{ fontSize:12,color:"#6b5f7a",fontWeight:600 }}>{done}/{goal.required}</span>
                            </div>
                            <div style={{ height:3,borderRadius:99,background:"#f3f0f7",overflow:"hidden" }}>
                              <div style={{ height:"100%",borderRadius:99,width:`${pct}%`,background:"#534AB7" }}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Complete section */}
                {complete.length>0&&(
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>Complete ({complete.length})</div>
                    <div style={{ background:"white",borderRadius:16,border:"1px solid rgba(107,33,168,0.08)",overflow:"hidden" }}>
                      {complete.map((goal,i)=>{
                        const done=getCompleted(goal);
                        return (
                          <div key={goal.discipline} style={{ padding:"13px 16px",borderBottom:i<complete.length-1?"1px solid #f3f0f7":"none",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                            <span style={{ fontSize:13,color:"#1e1428",fontWeight:500 }}>{goal.discipline}</span>
                            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                              <div style={{ height:3,width:80,borderRadius:99,background:"#ecfdf5",overflow:"hidden" }}>
                                <div style={{ height:"100%",borderRadius:99,width:"100%",background:"#059669" }}/>
                              </div>
                              <span style={{ fontSize:12,color:"#059669",fontWeight:700 }}>{done}/{goal.required}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Not started toggle */}
                {notStarted.length>0&&(
                  <div style={{ marginBottom:16 }}>
                    <button onClick={()=>setShowAllGoals(v=>!v)} style={{ fontSize:11,fontWeight:700,color:"#a89cbd",textTransform:"uppercase",letterSpacing:"0.07em",background:"none",border:"none",cursor:"pointer",padding:"0 0 8px",display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif" }}>
                      {showAllGoals?"▲ Hide":"▼ Show"} Not Started ({notStarted.length})
                    </button>
                    {showAllGoals&&(
                      <div style={{ background:"white",borderRadius:16,border:"1px solid rgba(107,33,168,0.08)",overflow:"hidden" }}>
                        {notStarted.map((goal,i)=>(
                          <div key={goal.discipline} style={{ padding:"13px 16px",borderBottom:i<notStarted.length-1?"1px solid #f3f0f7":"none",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                            <span style={{ fontSize:13,color:"#a89cbd",fontWeight:500 }}>{goal.discipline}</span>
                            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                              <div style={{ height:3,width:80,borderRadius:99,background:"#f3f0f7" }}/>
                              <span style={{ fontSize:12,color:"#a89cbd" }}>0/{goal.required}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Edit goals button */}
                <button onClick={()=>{ setEditGoalsDraft([...customGoals.map(g=>({...g}))]); setEditingGoals(true); setTab("requirements"); }}
                  style={{ width:"100%",background:"white",border:"1px solid rgba(107,33,168,0.15)",borderRadius:14,padding:"12px",cursor:"pointer",fontSize:13,fontWeight:600,color:T.purple,fontFamily:"'Inter',sans-serif",marginTop:4 }}>✎ Edit Goals & Targets</button>
                {editingGoals&&editGoalsDraft&&(
                  <div style={{ marginTop:16 }}>
                    <div style={{ display:"flex",gap:8,marginBottom:16 }}>
                      <button className="action-btn" onClick={()=>{ setEditingGoals(false); setEditGoalsDraft(null); }} style={{ flex:1,background:"white",color:"#6b5f7a",border:"1.5px solid #e5dff0",fontSize:13 }}>Cancel</button>
                      <button className="action-btn" onClick={()=>{ setCustomGoals(editGoalsDraft); setEditingGoals(false); setEditGoalsDraft(null); }} style={{ flex:2,background:T.purple,color:"white",fontSize:13 }}>✓ Save Goals</button>
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                      {editGoalsDraft.map((goal,index)=>(
                        <div key={goal.discipline+index} draggable onDragStart={()=>setDragIndex(index)} onDragOver={e=>e.preventDefault()} onDrop={()=>{ if(dragIndex===null||dragIndex===index) return; const updated=[...editGoalsDraft]; const [moved]=updated.splice(dragIndex,1); updated.splice(index,0,moved); setEditGoalsDraft(updated); setDragIndex(null); }}
                          className="card" style={{ padding:"14px 16px",display:"flex",alignItems:"center",gap:12,opacity:goal.visible?1:0.45,cursor:"grab" }}>
                          <span style={{ fontSize:18,color:"#a89cbd",cursor:"grab",userSelect:"none" }}>⠿</span>
                          <input type="checkbox" checked={goal.visible} onChange={()=>{ const updated=[...editGoalsDraft]; updated[index]={...updated[index],visible:!updated[index].visible}; setEditGoalsDraft(updated); }} style={{ width:16,height:16,accentColor:T.purple,cursor:"pointer" }}/>
                          <span style={{ flex:1,fontSize:14,fontWeight:500,color:"#1e1428" }}>{goal.discipline}</span>
                          <input type="number" min={1} max={99} value={goal.required} onChange={e=>{ const updated=[...editGoalsDraft]; updated[index]={...updated[index],required:parseInt(e.target.value)||1}; setEditGoalsDraft(updated); }} style={{ width:56,padding:"5px 8px",borderRadius:8,border:"1.5px solid #e5dff0",fontSize:14,fontWeight:600,color:T.purple,textAlign:"center",fontFamily:"'Inter',sans-serif",outline:"none" }}/>
                        </div>
                      ))}
                      <div className="card" style={{ padding:"14px 16px",display:"flex",alignItems:"center",gap:10,border:"1.5px dashed #e5dff0",boxShadow:"none" }}>
                        <span style={{ fontSize:18,color:"#e5dff0" }}>+</span>
                        <input style={{ flex:1,padding:"6px 10px",borderRadius:8,border:"1.5px solid #e5dff0",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none" }} placeholder="Add custom discipline..." value={newDisciplineName} onChange={e=>setNewDisciplineName(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&newDisciplineName.trim()){ setEditGoalsDraft([...editGoalsDraft,{discipline:newDisciplineName.trim(),required:5,visible:true,order:editGoalsDraft.length}]); setNewDisciplineName(""); } }}/>
                        <button className="action-btn" onClick={()=>{ if(!newDisciplineName.trim()) return; setEditGoalsDraft([...editGoalsDraft,{discipline:newDisciplineName.trim(),required:5,visible:true,order:editGoalsDraft.length}]); setNewDisciplineName(""); }} style={{ background:T.purple,color:"white",padding:"7px 14px" }}>Add</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          {/* ── AI TAB ── */}
          {tab==="ai"&&(
            <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 56px - 56px)" }}>
              {/* AI header */}
              <div style={{ background:"linear-gradient(135deg,#534AB7,#3C3489)",padding:"0 20px",height:72,display:"flex",flexDirection:"column",justifyContent:"center",flexShrink:0 }}>
                <div style={{ color:"white",fontWeight:700,fontSize:15 }}>ClinIQ Assistant</div>
                <div style={{ color:"rgba(255,255,255,0.65)",fontSize:11,marginTop:2 }}>HIPAA-safe · Caseload-aware</div>
              </div>
              {/* Message thread */}
              <div style={{ flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:12 }}>
                {chatMessages.length<=1&&(
                  <div style={{ padding:"0 0 12px" }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#a89cbd",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10 }}>Try asking</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                      {["Am I on track to graduate?","Which patients need follow-up?","Explain SRP aftercare in Spanish","Any pre-auths ready to check?"].map(q=>(
                        <button key={q} onClick={()=>setChatInput(q)} style={{ background:"white",border:"1px solid rgba(107,33,168,0.25)",borderRadius:99,padding:"8px 14px",fontSize:12,color:"#534AB7",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:500 }}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8 }}>
                    {msg.role==="assistant"&&(
                      <div style={{ width:28,height:28,borderRadius:8,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <span style={{ color:"white",fontSize:12,fontWeight:700 }}>✦</span>
                      </div>
                    )}
                    <div style={{ maxWidth:"82%",display:"flex",flexDirection:"column",gap:6,alignItems:msg.role==="user"?"flex-end":"flex-start" }}>
                      <div style={{ padding:"12px 16px",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.role==="user"?"#534AB7":"white",color:msg.role==="user"?"white":"#1e1428",fontSize:14,lineHeight:1.55,border:msg.role==="assistant"?"1px solid rgba(107,33,168,0.08)":"none",boxShadow:msg.role==="assistant"?"0 1px 4px rgba(107,33,168,0.05)":"none" }}>
                        {msg.content}
                      </div>
                      {msg.action&&(()=>{
                        const {type,alias}=msg.action;
                        if(type==="patient"||type==="logvisit"){
                          const p=patients.find(pt=>pt.alias===alias);
                          if(!p) return null;
                          return (
                            <button onClick={()=>{ setDetailPatient(p.id); if(type==="logvisit"){setShowLogModal(p.id);setNewVisit({date:"",procedure:"",notes:"",nextAppt:"",cdtCode:"",facultyName:""});setNlpInput("");setNlpParsed(null);setNlpError("");} }}
                              style={{ fontSize:11,fontWeight:600,color:T.purple,background:T.lavender,border:"1px solid #e5dff0",borderRadius:99,padding:"5px 12px",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:5 }}>
                              {type==="logvisit"?"📝 Log visit for ":"👤 View "}{alias} →
                            </button>
                          );
                        }
                        if(type==="calendar"){
                          return (
                            <button onClick={()=>setTab("calendar")} style={{ fontSize:11,fontWeight:600,color:T.purple,background:T.lavender,border:"1px solid #e5dff0",borderRadius:99,padding:"5px 12px",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:5 }}>
                              📅 Open Calendar →
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                ))}
                {chatLoading&&(
                  <div style={{ display:"flex",alignItems:"flex-end",gap:8 }}>
                    <div style={{ width:28,height:28,borderRadius:8,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><span style={{ color:"white",fontSize:12 }}>✦</span></div>
                    <div style={{ background:"white",border:"1px solid rgba(107,33,168,0.08)",borderRadius:"18px 18px 18px 4px",padding:"12px 16px",display:"flex",gap:4,alignItems:"center" }}>
                      {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:T.purple,opacity:0.5,animation:`bounce ${0.5+i*0.15}s ease-in-out infinite alternate` }}/>)}
                    </div>
                  </div>
                )}
              </div>
              {/* Input bar */}
              <div style={{ padding:"12px 16px",borderTop:"1px solid #f3f0f7",display:"flex",gap:8,alignItems:"flex-end",background:"white",flexShrink:0 }}>
                <button onClick={()=>setChatInput("Show me the NYUCD clinical quick reference guide")} title="Clinical Reference" style={{ background:"#ede9f5",border:"none",borderRadius:10,width:40,height:40,cursor:"pointer",color:T.purple,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>📚</button>
                <textarea rows={1} style={{ flex:1,borderRadius:12,border:"1.5px solid #e5dff0",padding:"10px 14px",fontSize:14,fontFamily:"'Inter',sans-serif",color:"#1e1428",resize:"none",outline:"none",lineHeight:1.4,background:"#f8f6fb" }}
                  placeholder="Ask about your caseload..."
                  value={chatInput}
                  onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();} }}
                />
                <button onClick={()=>{ if(isListening) return; setIsListening(true); startVoice((t)=>setChatInput(p=>p?p+" "+t:t),()=>setIsListening(false)); }}
                  style={{ background:isListening?"#dc2626":"#ede9f5",border:"none",borderRadius:10,width:40,height:40,cursor:"pointer",color:isListening?"white":"#6b5f7a",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s" }}>
                  {isListening?"⏹":"🎙"}
                </button>
                <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()}
                  style={{ background:"#534AB7",border:"none",borderRadius:10,width:40,height:40,cursor:"pointer",color:"white",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:(!chatInput.trim()||chatLoading)?0.5:1 }}>↑</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── PATIENT ROSTER PANEL ── */}
      {showRosterPanel&&(
        <div style={{ position:"fixed",inset:0,zIndex:800,background:"#f8f6fb",overflowY:"auto",animation:"slideInRight 0.25s ease" }}>
          <div style={{ background:"white",borderBottom:`1px solid ${NYU.gray100}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10 }}>
            <button onClick={()=>setShowRosterPanel(false)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:NYU.gray600 }}>←</button>
            <span style={{ fontWeight:600,fontSize:16,color:NYU.gray900,flex:1 }}>👤 Patient Roster</span>
            <button className="action-btn" onClick={()=>{ setShowAddModal(true); setShowRosterPanel(false); }} style={{ background:T.purple,color:"white",fontSize:12,padding:"7px 16px" }}>+ Add Patient</button>
          </div>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"28px 32px 80px" }}>
            <div style={{ display:"flex",gap:8,marginBottom:20,flexWrap:"wrap" }}>
              {["All","Active","Urgent","F/U Needed","Complete"].map(f=>(<button key={f} className="filter-btn" onClick={()=>setFilter(f)} style={{ background:filter===f?T.purple:NYU.gray100,color:filter===f?"white":NYU.gray600,border:"none",fontSize:12,padding:"6px 14px" }}>{f}</button>))}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {filtered.map(patient=>{
                const status=calculateStatus(patient);
                const meta=STATUS_META[status]||{ color:NYU.gray400,bg:NYU.gray100 };
                const urgency=calculateUrgency(patient);
                const avatarMeta=DISCIPLINE_AVATAR[patient.discipline]||{ bg:T.lavender,color:T.purple,initial:"??" };
                const preAuthNudge=getPreAuthNudge(patient);
                const labNudge=getLabNudge(patient);
                return (
                  <div key={patient.id} onClick={()=>{ setDetailPatient(patient.id); setShowRosterPanel(false); }} style={{ background:"white",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:`1px solid ${urgency?"#fed7aa":NYU.gray100}`,transition:"all 0.18s" }}>
                    <div style={{ width:46,height:46,borderRadius:14,background:avatarMeta.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative" }}>
                      <span style={{ fontSize:13,fontWeight:700,color:avatarMeta.color,letterSpacing:"0.04em" }}>{avatarMeta.initial}</span>
                      {urgency&&<div style={{ position:"absolute",top:-2,right:-2,width:10,height:10,borderRadius:"50%",background:NYU.orange,border:"2px solid white" }}/>}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                        <span style={{ fontWeight:700,fontSize:15,color:NYU.gray900 }}>{patient.alias}</span>
                        <span style={{ fontSize:10,color:NYU.gray400 }}>{patient.id}</span>
                        {patient.isPrimaryProvider!==false
                          ? <span style={{ fontSize:10,fontWeight:700,color:"#0f766e",background:"#ccfbf1",borderRadius:99,padding:"2px 7px" }}>Primary</span>
                          : patient.handoffPartner
                            ? <span style={{ fontSize:10,fontWeight:700,color:NYU.gray500,background:NYU.gray100,borderRadius:99,padding:"2px 7px" }}>Supporting</span>
                            : null
                        }
                      </div>
                      <div style={{ fontSize:12,color:NYU.gray400 }}>{patient.procedure||"No procedure"} · {patient.discipline}</div>
                      {(preAuthNudge||labNudge)&&(
                        <div style={{ display:"flex",gap:6,marginTop:4 }}>
                          {preAuthNudge&&<span style={{ fontSize:10,fontWeight:600,color:preAuthNudge.color,background:preAuthNudge.bg,borderRadius:99,padding:"2px 8px" }}>📄 {preAuthNudge.label}</span>}
                          {labNudge&&<span style={{ fontSize:10,fontWeight:600,color:labNudge.color,background:labNudge.bg,borderRadius:99,padding:"2px 8px" }}>🧪 {labNudge.label}</span>}
                        </div>
                      )}
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
                      <span style={{ fontSize:11,padding:"3px 10px",borderRadius:99,background:meta.bg,color:meta.color,fontWeight:600 }}>{status}</span>
                      <span style={{ color:NYU.gray200,fontSize:16 }}>›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── GRADUATION GOALS PANEL ── */}
      {showGoalsPanel&&(
        <div style={{ position:"fixed",inset:0,zIndex:800,background:"#f8f6fb",overflowY:"auto",animation:"slideInRight 0.25s ease" }}>
          <div style={{ background:"white",borderBottom:`1px solid ${NYU.gray100}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10 }}>
            <button onClick={()=>setShowGoalsPanel(false)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:NYU.gray600 }}>←</button>
            <span style={{ fontWeight:600,fontSize:16,color:NYU.gray900,flex:1 }}>🎓 Graduation Goals</span>
          </div>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"28px 32px 80px" }}>
            <div style={{ background:onTrack?T.lavender:NYU.redLight,borderRadius:16,padding:"20px 24px",marginBottom:24,border:`1px solid ${onTrack?NYU.gray200:"#fecaca"}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:15,color:NYU.gray900,fontFamily:"'Fraunces', serif",marginBottom:6 }}>{onTrack?"🎓 On track for graduation":"📋 Caseload needs attention"}</div>
                <div style={{ fontSize:13,color:NYU.gray600 }}>{totalCompleted} of {totalRequired} procedures complete · {daysToGraduation} days remaining</div>
                {atRiskRequirements.length>0&&<div style={{ fontSize:12,color:NYU.gray600,marginTop:6 }}>Focus on: {atRiskRequirements.slice(0,3).join(", ")}</div>}
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:40,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif",lineHeight:1 }}>{velocityPct}%</div>
                <div style={{ fontSize:11,color:NYU.gray400,marginTop:4 }}>overall complete</div>
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {customGoals.filter(g=>g.visible).map(goal=>{
                const completed=patients.filter(p=>p.discipline===goal.discipline).reduce((s,p)=>s+(p.visitLog?.length||0),0);
                const pct=Math.min((completed/goal.required)*100,100);
                const color=pct>=100?NYU.green:pct>=60?NYU.blue:pct>=30?NYU.amber:NYU.red;
                const activePts=patients.filter(p=>p.discipline===goal.discipline&&!p.treatmentComplete);
                return (
                  <div key={goal.discipline} className="card" style={{ padding:"16px 20px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                      <span style={{ fontWeight:600,fontSize:14,color:NYU.gray900 }}>{goal.discipline}</span>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        {pct>=100&&<span style={{ fontSize:12,color:NYU.green,fontWeight:600 }}>✓ Complete</span>}
                        {pct<100&&<span style={{ fontSize:12,color:NYU.gray400 }}>{goal.required-completed} remaining</span>}
                        <span style={{ fontSize:13,fontWeight:700,color }}>{completed}/{goal.required}</span>
                      </div>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%`,background:color }}/></div>
                    {activePts.length>0&&<div style={{ marginTop:10,fontSize:12,color:NYU.gray600 }}><span style={{ fontWeight:600,color:T.purple }}>Active: </span>{activePts.map(p=>p.alias).join(", ")}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── URGENT PANEL ── */}
      {showUrgentPanel&&(
        <div style={{ position:"fixed",inset:0,zIndex:800,background:"#f8f6fb",overflowY:"auto",animation:"slideInRight 0.25s ease" }}>
          <div style={{ background:"white",borderBottom:`1px solid ${NYU.gray100}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10 }}>
            <button onClick={()=>{ setShowUrgentPanel(false); setFilter("All"); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:NYU.gray600 }}>←</button>
            <span style={{ fontWeight:600,fontSize:16,color:NYU.gray900,flex:1 }}>⚠️ Urgent Patients</span>
            <span style={{ fontSize:12,color:NYU.orange,fontWeight:600,background:NYU.orangeLight,padding:"4px 12px",borderRadius:99 }}>{urgentPatients.length} need attention</span>
          </div>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"28px 32px 80px" }}>
            {urgentPatients.length===0?(
              <div style={{ textAlign:"center",padding:"80px 20px" }}>
                <div style={{ fontSize:48,marginBottom:16 }}>✅</div>
                <div style={{ fontSize:18,fontWeight:700,color:NYU.gray900,marginBottom:8 }}>All clear!</div>
                <div style={{ fontSize:14,color:NYU.gray400 }}>No patients need urgent attention.</div>
              </div>
            ):(
              <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                {urgentPatients.map(patient=>{
                  const urgency=calculateUrgency(patient);
                  const avatarMeta=DISCIPLINE_AVATAR[patient.discipline]||{ bg:T.lavender,color:T.purple,initial:"??" };
                  return (
                    <div key={patient.id} style={{ background:"white",borderRadius:16,border:`1px solid #fed7aa`,overflow:"hidden" }}>
                      <div style={{ padding:"16px 20px",display:"flex",alignItems:"center",gap:14 }}>
                        <div style={{ width:46,height:46,borderRadius:14,background:avatarMeta.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          <span style={{ fontSize:13,fontWeight:700,color:avatarMeta.color }}>{avatarMeta.initial}</span>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700,fontSize:15,color:NYU.gray900 }}>{patient.alias}</div>
                          <div style={{ fontSize:12,color:NYU.gray400,marginTop:2 }}>{patient.procedure} · {patient.discipline}</div>
                        </div>
                        <button className="action-btn" onClick={()=>{ setDetailPatient(patient.id); setShowUrgentPanel(false); }} style={{ background:T.purple,color:"white",fontSize:12,padding:"7px 16px" }}>View →</button>
                      </div>
                      <div style={{ background:NYU.orangeLight,padding:"10px 20px",borderTop:`1px solid #fed7aa`,display:"flex",flexWrap:"wrap",gap:8 }}>
                        {urgency.map((reason,i)=>(
                          <span key={i} style={{ fontSize:11,fontWeight:600,color:NYU.orange,background:"white",borderRadius:99,padding:"3px 10px",border:`1px solid #fed7aa` }}>⚠ {reason}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD PATIENT MODAL ── */}
      {showAddModal&&(
        <div className="modal-overlay" onClick={()=>{ setShowAddModal(false); setAddPatientError(""); setNewPatient(emptyPatient); }}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontSize:18,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>Add New Patient</h2>
              <button onClick={()=>{ setShowAddModal(false); setAddPatientError(""); setNewPatient(emptyPatient); }} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:NYU.gray400 }}>×</button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div>
                <label style={labelStyle}>Chart Number *</label>
                <input style={{ ...inputStyle, borderColor: addPatientError&&!newPatient.chartNumber.trim() ? NYU.red : undefined }} placeholder="e.g. 1047823" value={newPatient.chartNumber} onChange={e=>{ setNewPatient(p=>({...p,chartNumber:e.target.value})); setAddPatientError(""); }}/>
              </div>
              <div><label style={labelStyle}>Clinical Discipline</label><select style={inputStyle} value={newPatient.discipline} onChange={e=>setNewPatient(p=>({...p,discipline:e.target.value}))}>{DISCIPLINES.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
              <div>
                <label style={labelStyle}>Patient Type</label>
                <div style={{ display:"flex",gap:6 }}>
                  {["In-Clinic","Outreach","External"].map(opt=>(
                    <button key={opt} type="button" onClick={()=>setNewPatient(p=>({...p,patientType:opt}))}
                      style={{ flex:1,padding:"7px 0",borderRadius:99,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"'Inter',sans-serif",background:newPatient.patientType===opt?T.purple:NYU.gray100,color:newPatient.patientType===opt?"white":NYU.gray600,transition:"all 0.15s" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div><label style={labelStyle}>Referring Faculty <span style={{ fontWeight:400,color:NYU.gray400 }}>(optional)</span></label><input style={inputStyle} placeholder="e.g. Dr. Chen" value={newPatient.referringFaculty||""} onChange={e=>setNewPatient(p=>({...p,referringFaculty:e.target.value}))}/></div>
              <div><label style={labelStyle}>Treatment Phase</label><select style={inputStyle} value={newPatient.treatmentPhase} onChange={e=>setNewPatient(p=>({...p,treatmentPhase:e.target.value}))}>{PHASE_KEYS.map(k=><option key={k} value={k}>Phase {k} — {TREATMENT_PHASES[k]?.label||k}</option>)}</select></div>
              <div><label style={labelStyle}>First Procedure</label><input style={inputStyle} placeholder="e.g. Initial Exam..." value={newPatient.procedure} onChange={e=>setNewPatient(p=>({...p,procedure:e.target.value}))}/></div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div><label style={labelStyle}>Treatment Start</label><input type="date" style={inputStyle} value={newPatient.treatmentStart} onChange={e=>setNewPatient(p=>({...p,treatmentStart:e.target.value,lastVisit:e.target.value}))}/></div>
                <div><label style={labelStyle}>Expected Completion</label><input type="date" style={inputStyle} value={newPatient.expectedCompletion} onChange={e=>setNewPatient(p=>({...p,expectedCompletion:e.target.value}))}/></div>
              </div>
              {/* Primary provider checkbox */}
              <label style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 14px",borderRadius:10,background:newPatient.isPrimaryProvider?T.lavender:"#f9fafb",border:`1.5px solid ${newPatient.isPrimaryProvider?T.purpleLight:NYU.gray200}`,transition:"all 0.15s" }}>
                <input type="checkbox" checked={newPatient.isPrimaryProvider} onChange={e=>setNewPatient(p=>({...p,isPrimaryProvider:e.target.checked,sharedWithD3:e.target.checked?p.sharedWithD3:false}))} style={{ width:16,height:16,accentColor:T.purple,cursor:"pointer" }}/>
                <span style={{ fontSize:13,fontWeight:600,color:newPatient.isPrimaryProvider?T.purple:NYU.gray500 }}>I am the primary provider for this patient</span>
              </label>
              {/* D4 sharing prompt — only for D4 primary providers */}
              {newPatient.isPrimaryProvider && user?.year==="D4" && (
                <div style={{ borderRadius:12,border:`1.5px solid ${NYU.gray200}`,overflow:"hidden" }}>
                  <label style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 14px",background:"white" }}>
                    <input type="checkbox" checked={newPatient.sharedWithD3} onChange={e=>setNewPatient(p=>({...p,sharedWithD3:e.target.checked,handoffPartner:e.target.checked?p.handoffPartner:"",handoffNotes:""}))} style={{ width:16,height:16,accentColor:T.purple,cursor:"pointer" }}/>
                    <span style={{ fontSize:13,fontWeight:500,color:NYU.gray700 }}>Would you like to share this patient with a D3?</span>
                  </label>
                  {newPatient.sharedWithD3 && (
                    <div style={{ borderTop:`1px solid ${NYU.gray100}`,padding:"12px 14px",display:"flex",flexDirection:"column",gap:10,background:"#fafafa" }}>
                      <div>
                        <label style={{ ...labelStyle,marginBottom:4 }}>D3 Name</label>
                        <input style={inputStyle} placeholder="e.g. Marcus Reid" value={newPatient.handoffPartner||""} onChange={e=>setNewPatient(p=>({...p,handoffPartner:e.target.value,handoffPartnerYear:"D3"}))}/>
                      </div>
                      <div>
                        <label style={{ ...labelStyle,marginBottom:4 }}>Notes for D3 <span style={{ fontWeight:400,color:NYU.gray400 }}>(optional)</span></label>
                        <textarea rows={2} style={{ ...inputStyle,resize:"none",fontSize:13 }} placeholder="e.g. patient prefers morning appointments, crown still pending" value={newPatient.handoffNotes||""} onChange={e=>setNewPatient(p=>({...p,handoffNotes:e.target.value}))}/>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {addPatientError && (
                <div style={{ background:NYU.redLight,borderRadius:10,padding:"10px 14px",fontSize:13,color:NYU.red,display:"flex",alignItems:"center",gap:8 }}>
                  <span>⚠️</span><span>{addPatientError}</span>
                </div>
              )}
              <div style={{ display:"flex",gap:10,marginTop:4 }}>
                <button className="action-btn" onClick={()=>{ setShowAddModal(false); setAddPatientError(""); setNewPatient(emptyPatient); }} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Cancel</button>
                <button className="action-btn" onClick={addPatient} style={{ flex:1,background:T.purple,color:"white" }}>Add Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LOG VISIT MODAL ── */}
      {showLogModal&&(
        <div className="modal-overlay" onClick={()=>setShowLogModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontSize:18,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>Log New Visit</h2>
              <button onClick={()=>setShowLogModal(null)} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:NYU.gray400 }}>×</button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <div className="nlp-box">
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <span style={{ fontSize:16 }}>✦</span>
                  <span style={{ color:"white",fontWeight:600,fontSize:13 }}>Describe your visit</span>
                  <span style={{ color:NYU.gray400,fontSize:11,marginLeft:"auto" }}>AI auto-fills fields below</span>
                </div>
                <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
                <textarea rows={2} style={{ ...inputStyle,resize:"none",fontSize:13,flex:1 }} placeholder='e.g. "Saw patient today, did a crown placement, follow up in 3 weeks"' value={nlpInput} onChange={e=>setNlpInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); parseWithAI(); } }}/>
                <button onClick={()=>{ if(isListeningNlp) return; setIsListeningNlp(true); startVoice((t)=>setNlpInput(prev=>prev?prev+" "+t:t),()=>setIsListeningNlp(false)); }}
                  title="Speak your note"
                  style={{ background:isListeningNlp?NYU.red:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",color:"white",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,transition:"all 0.2s" }}>
                  {isListeningNlp?"⏹":"🎙"}
                </button>
                </div>
                <button className="action-btn" onClick={parseWithAI} disabled={nlpLoading||!nlpInput.trim()} style={{ background:nlpLoading?T.purpleMid:T.accent,color:"white",width:"100%",marginTop:8,fontSize:13 }}>
                  {nlpLoading?<><span className="spinner"/>Parsing...</>:"✦ Auto-fill from description"}
                </button>
                {nlpParsed&&!nlpLoading&&(
                  <div className="nlp-parsed">
                    <div style={{ fontSize:11,fontWeight:600,color:"#16a34a",marginBottom:6,textTransform:"uppercase" }}>✓ Fields auto-filled</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                      {nlpParsed.date&&<span style={{ fontSize:11,background:"#dcfce7",color:"#15803d",borderRadius:99,padding:"2px 10px",fontWeight:500 }}>📅 {nlpParsed.date}</span>}
                      {nlpParsed.procedure&&<span style={{ fontSize:11,background:"#dcfce7",color:"#15803d",borderRadius:99,padding:"2px 10px",fontWeight:500 }}>🦷 {nlpParsed.procedure}</span>}
                      {nlpParsed.nextAppt&&<span style={{ fontSize:11,background:"#dcfce7",color:"#15803d",borderRadius:99,padding:"2px 10px",fontWeight:500 }}>🔁 Follow-up {nlpParsed.nextAppt}</span>}
                    </div>
                  </div>
                )}
                {nlpError&&<div style={{ background:"#fee2e2",borderRadius:8,padding:"8px 12px",marginTop:8,fontSize:12,color:NYU.red }}>{nlpError}</div>}
              </div>
              <div style={{ borderTop:`1px solid ${NYU.gray100}`,paddingTop:16 }}>
                <div style={{ fontSize:11,fontWeight:600,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14 }}>Review & confirm</div>
                <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                  <div><label style={labelStyle}>Visit Date *</label><input type="date" style={inputStyle} value={newVisit.date} onChange={e=>setNewVisit(v=>({...v,date:e.target.value}))}/></div>
                  <div><label style={labelStyle}>Procedure Completed *</label><input style={inputStyle} placeholder="e.g. Crown Placement..." value={newVisit.procedure} onChange={e=>setNewVisit(v=>({...v,procedure:e.target.value}))}/></div>
                  <div>
                    <label style={labelStyle}>CDT Code <span style={{ fontWeight:400,textTransform:"none",letterSpacing:0 }}>(optional)</span></label>
                    <input style={inputStyle} placeholder="e.g. D3330..." value={newVisit.cdtCode} onChange={e=>{ const code=e.target.value.toUpperCase(); setNewVisit(v=>({...v,cdtCode:code})); if(CDT_CODES[code]){ setNewVisit(v=>({...v,cdtCode:code,procedure:CDT_CODES[code].procedure})); if(showLogModal) updateField(showLogModal,"discipline",CDT_CODES[code].discipline); } }}/>
                    {newVisit.cdtCode&&CDT_CODES[newVisit.cdtCode]&&<div style={{ fontSize:11,color:NYU.green,marginTop:4,fontWeight:500 }}>✓ {CDT_CODES[newVisit.cdtCode].procedure} — {CDT_CODES[newVisit.cdtCode].discipline}</div>}
                  </div>
                  <div><label style={labelStyle}>Next Appointment</label><input type="date" style={inputStyle} value={newVisit.nextAppt} onChange={e=>setNewVisit(v=>({...v,nextAppt:e.target.value}))}/></div>
                  <div><label style={labelStyle}>Visit Notes</label><textarea rows={2} style={{ ...inputStyle,resize:"vertical" }} placeholder="Optional notes..." value={newVisit.notes} onChange={e=>setNewVisit(v=>({...v,notes:e.target.value}))}/></div>
                  <div><label style={labelStyle}>Faculty Name <span style={{ fontWeight:400,textTransform:"none",letterSpacing:0 }}>(supervising attending)</span></label><input style={inputStyle} placeholder="e.g. Dr. Chen" value={newVisit.facultyName||""} onChange={e=>setNewVisit(v=>({...v,facultyName:e.target.value}))}/></div>
                </div>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="action-btn" onClick={()=>setShowLogModal(null)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Cancel</button>
                <button className="action-btn" onClick={()=>logVisit(showLogModal)} disabled={!newVisit.date||!newVisit.procedure} style={{ flex:1,background:T.purple,color:"white" }}>Save Visit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PATIENT DETAIL SCREEN ── */}
      {detailPatient&&(()=>{
        const patient=patients.find(p=>p.id===detailPatient);
        if(!patient) return null;
        const status=calculateStatus(patient);
        const meta=STATUS_META[status]||{ color:NYU.gray400,bg:NYU.gray100 };
        const urgency=calculateUrgency(patient);
        const avatarMeta=DISCIPLINE_AVATAR[patient.discipline]||{ bg:T.lavender,color:T.purple,initial:"??" };
        const preAuthNudge=getPreAuthNudge(patient);
        const labNudge=getLabNudge(patient);

        return (
          <div style={{ position:"fixed",inset:0,zIndex:800,background:"#f8f6fb",overflowY:"auto",animation:"slideInRight 0.25s ease" }}>
            <div style={{ background:"white",borderBottom:`1px solid ${NYU.gray100}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10 }}>
              <button onClick={()=>{ setDetailPatient(null); setSelectedVisit(null); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:NYU.gray600 }}>←</button>
              <span style={{ fontWeight:600,fontSize:16,color:NYU.gray900,flex:1 }}>Patient Detail</span>
              <button className="action-btn" onClick={()=>{ setShowLogModal(patient.id); setNewVisit({ date:"",procedure:"",notes:"",nextAppt:"",cdtCode:"",facultyName:"" }); setNlpInput(""); setNlpParsed(null); setNlpError(""); }} style={{ background:T.purple,color:"white",fontSize:12,padding:"7px 16px" }}>+ Log Visit</button>

            </div>

            <div style={{ maxWidth:1100,margin:"0 auto",padding:"28px 32px 80px" }}>

              {/* Hero card — shows alias prominently */}
              <div style={{ background:"white",borderRadius:20,padding:"24px 20px",marginBottom:16,border:`1px solid ${NYU.gray100}`,display:"flex",alignItems:"center",gap:16 }}>
                <div style={{ width:60,height:60,borderRadius:18,background:avatarMeta.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <span style={{ fontSize:16,fontWeight:700,color:avatarMeta.color,letterSpacing:"0.04em" }}>{avatarMeta.initial}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:22,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>{patient.alias}</div>
                  <div style={{ fontSize:13,color:NYU.gray400,marginTop:2 }}>{patient.id} · {patient.discipline}</div>
                  <div style={{ marginTop:8,display:"flex",gap:6,flexWrap:"wrap" }}>
                    <span style={{ fontSize:12,padding:"4px 12px",borderRadius:99,background:meta.bg,color:meta.color,fontWeight:600 }}>{status}</span>
                    {urgency&&<span style={{ fontSize:12,padding:"4px 12px",borderRadius:99,background:NYU.orangeLight,color:NYU.orange,fontWeight:600 }}>⚠ Urgent</span>}
                    {preAuthNudge&&<span style={{ fontSize:12,padding:"4px 12px",borderRadius:99,background:preAuthNudge.bg,color:preAuthNudge.color,fontWeight:600 }}>📄 {preAuthNudge.label}</span>}
                    {labNudge&&<span style={{ fontSize:12,padding:"4px 12px",borderRadius:99,background:labNudge.bg,color:labNudge.color,fontWeight:600 }}>🧪 {labNudge.label}</span>}
                  </div>
                </div>
              </div>

              {/* Urgency banner */}
              {urgency&&(
                <div style={{ background:NYU.orangeLight,border:`1px solid #fed7aa`,borderRadius:14,padding:"12px 16px",marginBottom:16 }}>
                  <div style={{ fontWeight:600,fontSize:13,color:NYU.orange,marginBottom:6 }}>⚠ Action Required</div>
                  {urgency.map((r,i)=><div key={i} style={{ fontSize:12,color:NYU.gray600,marginTop:3 }}>· {r}</div>)}
                </div>
              )}

              {/* Chart number — shown in detail for student reference */}
              <div style={{ background:T.lavender,borderRadius:14,padding:"12px 18px",marginBottom:16 }}>
                <div style={{ fontSize:11,fontWeight:600,color:T.purple,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2 }}>Axium Chart Number <span style={{ fontSize:10,fontWeight:400,color:NYU.gray400 }}>(student reference only — not displayed externally)</span></div>
                <div style={{ fontSize:16,fontWeight:700,color:NYU.gray900,letterSpacing:"0.05em" }}>{patient.chartNumber}</div>
              </div>

              {/* Treatment Info */}
              {(()=>{ const prediction=predictCompletion(patient); return (
                <div style={{ background:"white",borderRadius:16,padding:"18px 20px",marginBottom:16,border:`1px solid ${NYU.gray100}` }}>
                  <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900,marginBottom:14 }}>Treatment Info</div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:0 }}>
                    <div>
                      <div style={{ fontSize:11,color:NYU.gray400,fontWeight:500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>Discipline</div>
                      <select value={patient.discipline} onChange={e=>updateField(patient.id,"discipline",e.target.value)} style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }}>
                        {DISCIPLINES.map(d=><option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize:11,color:NYU.gray400,fontWeight:500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>Last Procedure</div>
                      <div style={{ fontSize:14,fontWeight:500,color:NYU.gray900,padding:"8px 0" }}>{patient.procedure||"—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:11,color:NYU.gray400,fontWeight:500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>Treatment Start</div>
                      <input type="date" value={patient.treatmentStart||""} onChange={e=>updateField(patient.id,"treatmentStart",e.target.value)} style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }}/>
                    </div>
                    <div>
                      <div style={{ fontSize:11,color:NYU.gray400,fontWeight:500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em" }}>Next Appointment</div>
                      <input type="date" value={patient.nextAppt||""} onChange={e=>updateField(patient.id,"nextAppt",e.target.value||null)} style={{ ...inputStyle,fontSize:13,padding:"8px 10px",color:patient.nextAppt?T.purple:NYU.gray400 }}/>
                      {prediction&&prediction.daysOut>0&&!patient.nextAppt&&(
                        <button onClick={()=>updateField(patient.id,"nextAppt",prediction.date)}
                          style={{ marginTop:6,fontSize:11,fontWeight:600,color:T.purple,background:T.lavender,border:`1px solid ${NYU.gray200}`,borderRadius:99,padding:"4px 12px",cursor:"pointer",fontFamily:"'Inter', sans-serif",display:"flex",alignItems:"center",gap:5,width:"100%" }}>
                          🔮 Suggested next: {prediction.date}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ); })()}

              {/* ── Predictive Analytics Card ── */}
              {(()=>{
                const pred = predictCompletion(patient);
                if (!pred) return null;
                const confColor = pred.confidence==="high" ? NYU.green : pred.confidence==="medium" ? NYU.amber : NYU.gray400;
                const confBg    = pred.confidence==="high" ? "#dcfce7" : pred.confidence==="medium" ? "#fef3c7" : NYU.gray100;
                const confLabel = pred.confidence==="high" ? "High confidence" : pred.confidence==="medium" ? "Medium confidence" : "Low confidence";
                const visitPct  = pred.benchmark > 0 ? Math.min(100, Math.round((pred.visitsLogged / pred.benchmark) * 100)) : 0;
                return (
                  <div style={{ background:`linear-gradient(135deg, ${T.purpleDeep}, ${T.purpleDark})`,borderRadius:16,padding:"18px 20px",marginBottom:16,color:"white" }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ fontSize:16 }}>🔮</span>
                        <span style={{ fontWeight:700,fontSize:13 }}>Completion Estimate</span>
                      </div>
                      <span style={{ fontSize:11,fontWeight:600,color:confColor,background:confBg,borderRadius:99,padding:"3px 10px" }}>{confLabel}</span>
                    </div>

                    {pred.daysOut===0 ? (
                      <div style={{ fontSize:20,fontWeight:700,marginBottom:4 }}>Ready for completion ✓</div>
                    ) : (
                      <>
                        <div style={{ marginBottom:12 }}>
                          <div style={{ fontSize:11,opacity:0.7,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em" }}>Projected date</div>
                          <div style={{ fontSize:22,fontWeight:700,letterSpacing:"-0.02em" }}>{pred.date}</div>
                          {pred.bestCaseDate && (
                            <div style={{ fontSize:12,opacity:0.75,marginTop:3 }}>
                              Best case (no delays): <span style={{ fontWeight:600 }}>{pred.bestCaseDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Visit progress bar */}
                        <div style={{ marginBottom:pred.factors.length>0?12:0 }}>
                          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,opacity:0.8,marginBottom:5 }}>
                            <span>Visit progress</span>
                            <span>{pred.visitsLogged} / {pred.benchmark} visits · {pred.avgInterval}d avg interval</span>
                          </div>
                          <div style={{ background:"rgba(255,255,255,0.2)",borderRadius:99,height:6,overflow:"hidden" }}>
                            <div style={{ width:`${visitPct}%`,height:"100%",background:"rgba(255,255,255,0.85)",borderRadius:99,transition:"width 0.5s ease" }}/>
                          </div>
                        </div>

                        {/* Delay factors */}
                        {pred.factors.length>0 && (
                          <div style={{ borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:10,marginTop:2 }}>
                            <div style={{ fontSize:11,opacity:0.7,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em" }}>Active delays (+{pred.delayDays}d total)</div>
                            {pred.factors.map((f,i)=>(
                              <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12,marginBottom:4 }}>
                                <span style={{ opacity:0.9 }}>{f.icon} {f.label}</span>
                                <span style={{ fontWeight:600,background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"2px 8px" }}>+{f.days}d</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Treatment Phase */}
              {(()=>{
                const phaseNudge = getPhaseNudge(patient);
                const predAppt = getPredictedNextAppt(patient);
                const isOpen = expandedSections.includes("treatmentPhase");
                return (
                  <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                    <div onClick={()=>setExpandedSections(prev=>isOpen?prev.filter(s=>s!=="treatmentPhase"):[...prev,"treatmentPhase"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>Treatment Phase</div>
                        {phaseNudge&&<span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,background:phaseNudge.level==="overdue"?"#fee2e2":phaseNudge.level==="due"?"#fef9c3":"#dcfce7",color:phaseNudge.level==="overdue"?NYU.red:phaseNudge.level==="due"?"#92400e":"#15803d" }}>{phaseNudge.label}</span>}
                      </div>
                      <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:isOpen?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                    </div>
                    {isOpen&&(
                      <div style={{ padding:"0 20px 18px" }}>
                        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
                          {Object.entries(TREATMENT_PHASES).map(([key,ph])=>{
                            const active = (patient.treatmentPhase||"IV")===key;
                            return <button key={key} className="pill-btn" onClick={()=>updateField(patient.id,"treatmentPhase",key)} style={{ background:active?T.purple:NYU.gray100,color:active?"white":NYU.gray600,fontSize:11,fontWeight:600 }}>{key}: {ph.label}</button>;
                          })}
                        </div>
                        {patient.treatmentPhase&&TREATMENT_PHASES[patient.treatmentPhase]&&(
                          <div style={{ fontSize:12,color:NYU.gray500,background:NYU.gray50,borderRadius:8,padding:"8px 12px",lineHeight:1.5 }}>
                            {TREATMENT_PHASES[patient.treatmentPhase].description}
                            {TREATMENT_PHASES[patient.treatmentPhase].followUpDays&&<span style={{ marginLeft:6,fontSize:11,fontWeight:600,color:T.purple }}>· Recall every {TREATMENT_PHASES[patient.treatmentPhase].followUpDays} days</span>}
                          </div>
                        )}
                        {predAppt&&(
                          <div style={{ marginTop:12,fontSize:12,color:NYU.gray600,display:"flex",alignItems:"center",gap:6 }}>
                            <span style={{ fontSize:14 }}>🔮</span>
                            <span><b>Predicted next visit:</b> {predAppt.date} ({predAppt.day}) — based on {predAppt.sampleSize} prior visits</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Specialty Referral */}
              {(()=>{
                const specNudge = getSpecialtyNudge(patient);
                const isOpen = expandedSections.includes("specialtyReferral");
                return (
                  <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                    <div onClick={()=>setExpandedSections(prev=>isOpen?prev.filter(s=>s!=="specialtyReferral"):[...prev,"specialtyReferral"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>Specialty Referral</div>
                        {specNudge&&<span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,background:specNudge.level==="overdue"?"#fee2e2":specNudge.level==="due"?"#fef9c3":"#dcfce7",color:specNudge.level==="overdue"?NYU.red:specNudge.level==="due"?"#92400e":"#15803d" }}>{specNudge.label}</span>}
                      </div>
                      <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:isOpen?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                    </div>
                    {isOpen&&(
                      <div style={{ padding:"0 20px 18px" }}>
                        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:10 }}>
                          {["None",...SPECIALTY_TYPES].map(t=>{
                            const active=(patient.specialtyType||"None")===t;
                            return <button key={t} className="pill-btn" onClick={()=>updateField(patient.id,"specialtyType",t==="None"?null:t)} style={{ background:active?T.purple:NYU.gray100,color:active?"white":NYU.gray600,fontSize:11 }}>{t}</button>;
                          })}
                        </div>
                        {patient.specialtyType&&patient.specialtyType!=="None"&&(
                          <div style={{ display:"flex",flexDirection:"column",gap:10,marginTop:8 }}>
                            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                              {SPECIALTY_STATUSES.map(s=>{
                                const active=(patient.specialtyStatus||"Pending")===s;
                                const colors={Pending:"#f59e0b",Scheduled:"#3b82f6","Awaiting Report":"#8b5cf6",Completed:"#10b981"};
                                return <button key={s} className="pill-btn" onClick={()=>updateField(patient.id,"specialtyStatus",s)} style={{ background:active?colors[s]||T.purple:NYU.gray100,color:active?"white":NYU.gray600,fontSize:11 }}>{s}</button>;
                              })}
                            </div>
                            <div style={{ display:"flex",gap:10 }}>
                              <div style={{ flex:1 }}><label style={{ ...labelStyle,fontSize:10,marginBottom:4 }}>Referral Date</label><input type="date" style={{ ...inputStyle,fontSize:12,padding:"6px 10px" }} value={patient.specialtyReferralDate||""} onChange={e=>updateField(patient.id,"specialtyReferralDate",e.target.value)}/></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Lab & Pre-Auth with date fields + nudge indicators */}
              <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                <div onClick={()=>setExpandedSections(prev=>prev.includes("labPreAuth")?prev.filter(s=>s!=="labPreAuth"):[...prev,"labPreAuth"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                  <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>Lab & Pre-Auth</div>
                  <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:expandedSections.includes("labPreAuth")?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                </div>
                {expandedSections.includes("labPreAuth")&&<div style={{ padding:"0 20px 18px" }}>

                {/* Lab */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11,color:NYU.gray400,fontWeight:500,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em" }}>Lab Status</div>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:10 }}>
                    {LAB_STATUSES.map(s=>{ const m=LAB_META[s]; const active=patient.labStatus===s; return <button key={s} className="pill-btn" onClick={()=>{ updateField(patient.id,"labStatus",s); if(!active) logChange({ action_type:"LAB_UPDATED",patient_alias:patient.alias,description:`Lab status for ${patient.alias} changed to ${s}` }); }} style={{ background:active?m.color:NYU.gray100,color:active?"white":NYU.gray600 }}>{s}</button>; })}
                  </div>
                  {["Sent","Pending"].includes(patient.labStatus)&&(
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                      <div>
                        <label style={labelStyle}>Date Sent to Lab</label>
                        <input type="date" style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }} value={patient.labSentDate||""} onChange={e=>updateField(patient.id,"labSentDate",e.target.value)}/>
                      </div>
                    </div>
                  )}
                  {patient.labStatus==="Received"&&(
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                      <div>
                        <label style={labelStyle}>Date Sent</label>
                        <input type="date" style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }} value={patient.labSentDate||""} onChange={e=>updateField(patient.id,"labSentDate",e.target.value)}/>
                      </div>
                      <div>
                        <label style={labelStyle}>Date Received</label>
                        <input type="date" style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }} value={patient.labReceivedDate||""} onChange={e=>updateField(patient.id,"labReceivedDate",e.target.value)}/>
                      </div>
                    </div>
                  )}
                  {labNudge&&(
                    <div style={{ marginTop:8,background:labNudge.bg,borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:600,color:labNudge.color }}>
                      🧪 {labNudge.label} — {labNudge.level==="overdue"?"Lab may be ready or delayed, follow up now":"Lab is likely ready to pick up"}
                    </div>
                  )}
                </div>

                {/* Pre-Auth */}
                <div>
                  <div style={{ fontSize:11,color:NYU.gray400,fontWeight:500,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em" }}>Pre-Authorization</div>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:10 }}>
                    {PREAUTH_STATUSES.map(s=>{ const m=PREAUTH_META[s]; const active=patient.preAuth===s; return <button key={s} className="pill-btn" onClick={()=>{ updateField(patient.id,"preAuth",s); if(!active) logChange({ action_type:"PREAUTH_UPDATED",patient_alias:patient.alias,description:`Pre-auth for ${patient.alias} changed to ${s}` }); }} style={{ background:active?m.color:NYU.gray100,color:active?"white":NYU.gray600 }}>{s}</button>; })}
                  </div>
                  {patient.preAuth==="Submitted"&&(
                    <div>
                      <label style={labelStyle}>Date Submitted</label>
                      <input type="date" style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }} value={patient.preAuthSubmittedDate||""} onChange={e=>updateField(patient.id,"preAuthSubmittedDate",e.target.value)}/>
                    </div>
                  )}
                  {preAuthNudge&&(
                    <div style={{ marginTop:8,background:preAuthNudge.bg,borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:600,color:preAuthNudge.color }}>
                      📄 {preAuthNudge.label} — {preAuthNudge.level==="ready"?"Pre-auth window has passed, follow up with insurance now":preAuthNudge.level==="soon"?"Pre-auth response expected soon":"Pre-auth submitted, monitoring"}
                    </div>
                  )}
                </div>
                </div>}
              </div>

              {/* Visit History */}
              <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                <div onClick={()=>setExpandedSections(prev=>prev.includes("visitHistory")?prev.filter(s=>s!=="visitHistory"):[...prev,"visitHistory"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                  <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>Visit History</div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:11,color:NYU.gray400 }}>{patient.visitLog?.length||0} visit{(patient.visitLog?.length||0)!==1?"s":""}</span>
                    <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:expandedSections.includes("visitHistory")?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                  </div>
                </div>
                {expandedSections.includes("visitHistory")&&<div style={{ padding:"0 20px 18px" }}>
                {(!patient.visitLog||patient.visitLog.length===0)?(
                  <div style={{ fontSize:13,color:NYU.gray400,textAlign:"center",padding:"20px 0" }}>
                    <div style={{ fontSize:28,marginBottom:8 }}>📋</div>No visits logged yet
                  </div>
                ):(
                  <div style={{ position:"relative" }}>
                    <div style={{ position:"absolute",left:17,top:8,bottom:8,width:2,background:NYU.gray100,borderRadius:99 }}/>
                    {[...patient.visitLog].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((v,i)=>(
                      <div key={i} onClick={()=>setSelectedVisit(selectedVisit===i?null:i)} style={{ display:"flex",gap:14,marginBottom:12,cursor:"pointer",position:"relative" }}>
                        <div style={{ width:36,height:36,borderRadius:"50%",background:i===0?T.purple:"white",border:`2px solid ${i===0?T.purple:NYU.gray200}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1 }}>
                          <span style={{ fontSize:11,color:i===0?"white":NYU.gray400,fontWeight:600 }}>{patient.visitLog.length-i}</span>
                        </div>
                        <div style={{ flex:1,background:selectedVisit===i?T.lavender:NYU.gray50,borderRadius:12,padding:"10px 14px",border:`1px solid ${selectedVisit===i?NYU.gray200:"transparent"}`,transition:"all 0.18s" }}>
                          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                            <div>
                              <div style={{ fontSize:13,fontWeight:600,color:NYU.gray900 }}>{v.procedure}</div>
                              <div style={{ fontSize:11,color:NYU.gray400,marginTop:2 }}>{v.date}</div>
                            </div>
                            <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:selectedVisit===i?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                          </div>
                          {selectedVisit===i&&(
                            <div style={{ marginTop:12,paddingTop:12,borderTop:`1px solid ${NYU.gray200}`,animation:"slideUp 0.15s ease" }}>
                              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:v.notes?10:0 }}>
                                <div><div style={{ fontSize:10,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3 }}>Date</div><div style={{ fontSize:13,fontWeight:500,color:NYU.gray900 }}>{v.date}</div></div>
                                <div><div style={{ fontSize:10,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3 }}>Procedure</div><div style={{ fontSize:13,fontWeight:500,color:NYU.gray900 }}>{v.procedure}</div></div>
                                {v.cdtCode&&<div><div style={{ fontSize:10,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3 }}>CDT Code</div><div style={{ fontSize:13,fontWeight:500,color:T.purple }}>{v.cdtCode}</div></div>}
                              </div>
                              {v.notes&&<div style={{ marginBottom:8 }}><div style={{ fontSize:10,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3 }}>Clinical Notes</div><div style={{ fontSize:13,color:NYU.gray600,lineHeight:1.5,background:"white",borderRadius:8,padding:"8px 10px" }}>{v.notes}</div></div>}
                              {v.facultyName&&<div style={{ marginBottom:8 }}><div style={{ fontSize:10,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3 }}>Supervising Faculty</div><div style={{ fontSize:13,fontWeight:600,color:T.purple }}>👨‍⚕️ {v.facultyName}</div></div>}
                              <div style={{ marginTop:8,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                                <div style={{ fontSize:11,color:T.purple,fontWeight:500 }}>Visit #{patient.visitLog.length-i} of {patient.visitLog.length}</div>
                                <button onClick={e=>{ e.stopPropagation(); setConfirmDelete({ message:`Delete this visit (${v.procedure} on ${v.date})?`, onConfirm:async()=>{ const updated={...patient,visitLog:patient.visitLog.filter((_,vi)=>vi!==i)}; await fetch(`/api/patients/${patient.id}`,{ method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(updated) }); logChange({ action_type:"VISIT_DELETED",patient_alias:patient.alias,description:`Deleted visit for ${patient.alias}: ${v.procedure} on ${v.date}` }); setPatients(prev=>prev.map(p=>p.id===patient.id?updated:p)); setSelectedVisit(null); } }); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,color:NYU.red,fontFamily:"'Inter', sans-serif",fontWeight:500 }}>Delete visit</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>}
              </div>

              {/* Notes */}
              <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                <div onClick={()=>setExpandedSections(prev=>prev.includes("notes")?prev.filter(s=>s!=="notes"):[...prev,"notes"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                  <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>Notes</div>
                  <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:expandedSections.includes("notes")?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                </div>
                {expandedSections.includes("notes")&&(
                  <div style={{ padding:"0 20px 18px" }}>
                    <textarea rows={3} value={patient.notes} onChange={e=>updateField(patient.id,"notes",e.target.value)} style={{ ...inputStyle,resize:"vertical",fontSize:13 }} placeholder="Add notes about this patient..."/>
                  </div>
                )}
              </div>

              {/* Patient Language */}
              <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                <div onClick={()=>setExpandedSections(prev=>prev.includes("patientLanguage")?prev.filter(s=>s!=="patientLanguage"):[...prev,"patientLanguage"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                  <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>🌐 Patient Language</div>
                  <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:expandedSections.includes("patientLanguage")?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                </div>
                {expandedSections.includes("patientLanguage")&&<div style={{ padding:"0 20px 18px" }}>
                <div style={{ marginBottom:8 }}>
                  <label style={labelStyle}>Preferred Language</label>
                  <select style={{ ...inputStyle,fontSize:13,padding:"8px 10px" }} value={patient.patientLanguage||"English"} onChange={e=>updateField(patient.id,"patientLanguage",e.target.value)}>
                    {SUPPORTED_LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                {patient.patientLanguage&&patient.patientLanguage!=="English"&&(
                  <div style={{ background:T.lavender,borderRadius:10,padding:"10px 14px",fontSize:12,color:NYU.gray600,lineHeight:1.5 }}>
                    💬 ClinIQ assistant can translate patient instructions and post-op care into <strong>{patient.patientLanguage}</strong>. Ask it: "Explain the post-op care for {patient.alias} in {patient.patientLanguage}."
                  </div>
                )}
                </div>}
              </div>

              {/* Paired Provider */}
              <div style={{ background:"white",borderRadius:16,marginBottom:16,border:`1px solid ${NYU.gray100}`,overflow:"hidden" }}>
                <div onClick={()=>setExpandedSections(prev=>prev.includes("pairedProvider")?prev.filter(s=>s!=="pairedProvider"):[...prev,"pairedProvider"])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>🤝 Paired Provider</div>
                    {patient.isPrimaryProvider!==false
                      ? <span style={{ fontSize:11,padding:"3px 10px",borderRadius:99,background:"#ccfbf1",color:"#0f766e",fontWeight:700 }}>Primary</span>
                      : patient.handoffPartner
                        ? <span style={{ fontSize:11,padding:"3px 10px",borderRadius:99,background:NYU.gray100,color:NYU.gray500,fontWeight:600 }}>Supporting</span>
                        : null
                    }
                  </div>
                  <span style={{ fontSize:14,color:NYU.gray400,transition:"transform 0.18s",transform:expandedSections.includes("pairedProvider")?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                </div>
                {expandedSections.includes("pairedProvider")&&<div style={{ padding:"0 20px 18px" }}>
                {/* Primary provider toggle */}
                <label style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 12px",borderRadius:10,background:patient.isPrimaryProvider!==false?T.lavender:"#f9fafb",border:`1.5px solid ${patient.isPrimaryProvider!==false?T.purpleLight:NYU.gray200}`,marginBottom:14,transition:"all 0.15s" }}>
                  <input type="checkbox" checked={patient.isPrimaryProvider!==false} onChange={e=>updateField(patient.id,"isPrimaryProvider",e.target.checked)} style={{ width:16,height:16,accentColor:T.purple,cursor:"pointer" }}/>
                  <span style={{ fontSize:13,fontWeight:600,color:patient.isPrimaryProvider!==false?T.purple:NYU.gray500 }}>I am the primary provider for this patient</span>
                </label>
                {/* Shared-with-D3 section (D4 primary providers only) */}
                {patient.isPrimaryProvider!==false && (
                  <>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginBottom:14 }}>
                      <div><div style={{ fontSize:11,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6 }}>D3 Partner Name</div><input style={inputStyle} placeholder="e.g. Marcus Reid" value={patient.handoffPartner||""} onChange={e=>updateField(patient.id,"handoffPartner",e.target.value)}/></div>
                      <div><div style={{ fontSize:11,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6 }}>Year</div><select style={{ ...inputStyle,width:80 }} value={patient.handoffPartnerYear||"D3"} onChange={e=>updateField(patient.id,"handoffPartnerYear",e.target.value)}><option>D3</option><option>D4</option></select></div>
                    </div>
                    <div><div style={{ fontSize:11,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6 }}>Shared Notes</div><textarea rows={3} style={{ ...inputStyle,resize:"vertical",fontSize:13 }} placeholder="Notes visible to your paired provider..." value={patient.handoffNotes||""} onChange={e=>updateField(patient.id,"handoffNotes",e.target.value)}/></div>
                    {patient.handoffPartner&&<div style={{ background:NYU.greenLight,borderRadius:10,padding:"10px 14px",marginTop:14,display:"flex",alignItems:"center",gap:8 }}><span>✅</span><span style={{ fontSize:13,fontWeight:600,color:NYU.green }}>Sharing active with @{patient.handoffPartner} ({patient.handoffPartnerYear})</span></div>}

                    {/* Quick Notes to Partner */}
                    <div style={{ marginTop:18 }}>
                      <div style={{ fontSize:11,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10 }}>Quick Notes to Partner</div>
                      <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                        <input style={{ flex:1,...inputStyle,fontSize:13,padding:"8px 12px" }} placeholder="Send a quick note…" value={partnerNoteInput[patient.id]||""} onChange={e=>setPartnerNoteInput(p=>({...p,[patient.id]:e.target.value}))} onKeyDown={e=>{ if(e.key==="Enter"&&(partnerNoteInput[patient.id]||"").trim()){ const msg=(partnerNoteInput[patient.id]||"").trim(); const ts=new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}); const note={sender:user?.name||"Me",timestamp:ts,text:msg}; const updated={...patient,partnerNotes:[...(patient.partnerNotes||[]),note]}; updateField(patient.id,"partnerNotes",updated.partnerNotes); setPartnerNoteInput(p=>({...p,[patient.id]:""})); } }}/>
                        <button className="action-btn" onClick={()=>{ const msg=(partnerNoteInput[patient.id]||"").trim(); if(!msg) return; const ts=new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}); const note={sender:user?.name||"Me",timestamp:ts,text:msg}; const updated={...patient,partnerNotes:[...(patient.partnerNotes||[]),note]}; updateField(patient.id,"partnerNotes",updated.partnerNotes); setPartnerNoteInput(p=>({...p,[patient.id]:""})); }} style={{ background:"#0d9488",color:"white",padding:"8px 14px",fontSize:13 }}>Send</button>
                      </div>
                      {(patient.partnerNotes||[]).slice(-5).map((n,i)=>{
                        const isMe=n.sender===user?.name;
                        return (
                          <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start",marginBottom:8 }}>
                            <div style={{ background:isMe?"#0d9488":"#f3f4f6",color:isMe?"white":NYU.gray900,borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"8px 12px",fontSize:13,maxWidth:"80%" }}>{n.text}</div>
                            <div style={{ fontSize:10,color:NYU.gray400,marginTop:3 }}>{n.sender} · {n.timestamp}</div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {/* Supporting provider view */}
                {patient.isPrimaryProvider===false && patient.handoffPartner && (
                  <div style={{ background:NYU.gray50||"#f9fafb",borderRadius:10,padding:"12px 14px",fontSize:13,color:NYU.gray600,lineHeight:1.6 }}>
                    <div style={{ fontWeight:600,color:NYU.gray900,marginBottom:4 }}>Shared by {patient.handoffPartner} ({patient.handoffPartnerYear})</div>
                    <div style={{ fontSize:12,color:NYU.gray400 }}>You have read access to all visits, notes, and the treatment plan for this patient.</div>
                    {patient.handoffNotes&&<div style={{ marginTop:8,padding:"8px 10px",background:"white",borderRadius:8,fontSize:12,color:NYU.gray700,border:`1px solid ${NYU.gray100}` }}>📝 {patient.handoffNotes}</div>}
                  </div>
                )}
                </div>}
              </div>

              {/* Mark Complete */}
              <div style={{ background:"white",borderRadius:16,padding:"16px 20px",marginBottom:16,border:`1px solid ${NYU.gray100}` }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontWeight:600,fontSize:13,color:NYU.gray900 }}>Treatment Complete</div>
                    <div style={{ fontSize:12,color:NYU.gray400,marginTop:2 }}>Mark when all treatment is finished</div>
                  </div>
                  <div onClick={()=>{ const markingComplete=!patient.treatmentComplete; updateField(patient.id,"treatmentComplete",markingComplete); logChange({ action_type:"TREATMENT_COMPLETE",patient_alias:patient.alias,description:`Marked ${patient.alias} treatment ${markingComplete?"complete":"incomplete"}` }); if(markingComplete&&user?.year==="D4"){ setShowTransferModal(patient.id); setTransferToName(""); } }} style={{ width:48,height:26,borderRadius:99,background:patient.treatmentComplete?NYU.green:NYU.gray200,cursor:"pointer",transition:"all 0.2s",position:"relative",flexShrink:0 }}>
                    <div style={{ position:"absolute",top:3,left:patient.treatmentComplete?24:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
                  </div>
                </div>
                {patient.transferredTo&&(
                  <div style={{ marginTop:12,fontSize:12,color:NYU.gray500,background:"#f3e8ff",borderRadius:8,padding:"8px 12px",display:"flex",gap:8,alignItems:"center" }}>
                    <span style={{ fontSize:14 }}>🎓</span>
                    <span><b>Transferred to:</b> {patient.transferredTo}{patient.transferDate?` on ${patient.transferDate}`:""}</span>
                  </div>
                )}
              </div>

              {/* Delete Patient */}
              {patient.isPrimaryProvider!==false&&(
                <div style={{ textAlign:"center",marginBottom:24 }}>
                  <button onClick={()=>setConfirmDelete({ message:`Delete patient "${patient.alias}"?`, onConfirm:async()=>{ await fetch(`/api/patients/${patient.id}`,{ method:"DELETE" }); logChange({ action_type:"PATIENT_DELETED",patient_alias:patient.alias,description:`Deleted patient ${patient.alias}` }); setPatients(prev=>prev.filter(p=>p.id!==patient.id)); setDetailPatient(null); } })} style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,color:NYU.red,fontFamily:"'Inter', sans-serif",fontWeight:500,padding:"8px 0" }}>Delete Patient</button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── CSV IMPORT MODAL ── */}
      {showImportModal&&(
        <>
          <div onClick={()=>{ setShowImportModal(false); setImportStep(1); setImportRawRows([]); setImportHeaders([]); setImportResult(null); }} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:2900 }}/>
          <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:2901,background:"white",borderRadius:20,padding:"28px 28px",maxWidth:520,width:"92%",boxShadow:"0 8px 40px rgba(0,0,0,0.2)",maxHeight:"90vh",overflowY:"auto" }}>
            {/* Header */}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
              <div>
                <div style={{ fontWeight:700,fontSize:18,color:NYU.gray900,fontFamily:"'Fraunces',serif" }}>Import Roster</div>
                <div style={{ fontSize:12,color:NYU.gray400,marginTop:2 }}>Step {importStep} of 4</div>
              </div>
              <button onClick={()=>{ setShowImportModal(false); setImportStep(1); setImportRawRows([]); setImportHeaders([]); setImportResult(null); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:20,color:NYU.gray400,lineHeight:1 }}>×</button>
            </div>
            {/* Progress */}
            <div style={{ display:"flex",gap:6,marginBottom:24 }}>
              {[1,2,3,4].map(s=>(
                <div key={s} style={{ flex:1,height:4,borderRadius:99,background:s<=importStep?T.purple:NYU.gray200,transition:"background 0.3s" }}/>
              ))}
            </div>

            {/* Step 1: Upload */}
            {importStep===1&&(
              <div>
                <div style={{ fontWeight:600,fontSize:14,color:NYU.gray900,marginBottom:8 }}>Upload your CSV file</div>
                <div style={{ fontSize:13,color:NYU.gray500,marginBottom:16,lineHeight:1.5 }}>Your CSV should have column headers in the first row. At minimum, include chart number, last visit date, procedure, and discipline columns. Export from AxiUm or any spreadsheet.</div>
                <label style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:"32px 24px",border:`2px dashed ${NYU.gray200}`,borderRadius:14,cursor:"pointer",background:NYU.gray50,transition:"border-color 0.2s" }}
                  onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=T.purple;}}
                  onDragLeave={e=>{e.currentTarget.style.borderColor=NYU.gray200;}}
                  onDrop={async e=>{ e.preventDefault(); e.currentTarget.style.borderColor=NYU.gray200; const file=e.dataTransfer.files[0]; if(!file) return; try{ const {headers,rows}=await parseCSVFile(file); setImportHeaders(headers); setImportRawRows(rows); const autoMap={}; ["chartNumber","lastVisit","procedure","discipline"].forEach(f=>{ const match=headers.find(h=>h.toLowerCase().replace(/[\s_-]/g,"").includes(f.replace(/([A-Z])/g,c=>c.toLowerCase()))); if(match) autoMap[f]=match; }); setImportMapping(autoMap); setImportStep(2); }catch(err){ showError(err); } }}>
                  <span style={{ fontSize:36 }}>📂</span>
                  <div style={{ fontWeight:600,fontSize:14,color:NYU.gray700 }}>Drop CSV here or click to browse</div>
                  <div style={{ fontSize:12,color:NYU.gray400 }}>Accepts .csv files</div>
                  <input type="file" accept=".csv" style={{ display:"none" }} onChange={async e=>{ const file=e.target.files[0]; if(!file) return; try{ const {headers,rows}=await parseCSVFile(file); setImportHeaders(headers); setImportRawRows(rows); const autoMap={}; ["chartNumber","lastVisit","procedure","discipline"].forEach(f=>{ const match=headers.find(h=>h.toLowerCase().replace(/[\s_-]/g,"").includes(f.replace(/([A-Z])/g,c=>c.toLowerCase()))); if(match) autoMap[f]=match; }); setImportMapping(autoMap); setImportStep(2); }catch(err){ showError(err); } }}/>
                </label>
                <div style={{ marginTop:16,fontSize:12,color:NYU.gray400 }}>
                  <strong>Tip:</strong> Export from AxiUm → Reports → Patient List → Save as CSV. Column names don't have to match exactly — you'll map them in the next step.
                </div>
              </div>
            )}

            {/* Step 2: Map columns */}
            {importStep===2&&(
              <div>
                <div style={{ fontWeight:600,fontSize:14,color:NYU.gray900,marginBottom:4 }}>Map your columns</div>
                <div style={{ fontSize:13,color:NYU.gray500,marginBottom:16 }}>{importRawRows.length} rows detected. Tell ClinIQ which column contains each field.</div>
                {[
                  { key:"chartNumber", label:"Chart Number", required:false },
                  { key:"lastVisit",   label:"Last Visit Date", required:false },
                  { key:"procedure",   label:"Procedure / Treatment", required:false },
                  { key:"discipline",  label:"Discipline", required:false },
                ].map(f=>(
                  <div key={f.key} style={{ marginBottom:14 }}>
                    <label style={{ ...labelStyle,marginBottom:6 }}>{f.label}{f.required&&<span style={{ color:NYU.red }}>*</span>}</label>
                    <select style={inputStyle} value={importMapping[f.key]||""} onChange={e=>setImportMapping(prev=>({...prev,[f.key]:e.target.value}))}>
                      <option value="">— skip this field —</option>
                      {importHeaders.map(h=><option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
                <div style={{ display:"flex",gap:10,marginTop:20 }}>
                  <button className="action-btn" onClick={()=>setImportStep(1)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>← Back</button>
                  <button className="action-btn" onClick={()=>{ setImportPreview(buildImportPreview(importRawRows,importMapping)); setImportStep(3); }} style={{ flex:2,background:T.purple,color:"white" }}>Preview →</button>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {importStep===3&&(
              <div>
                <div style={{ fontWeight:600,fontSize:14,color:NYU.gray900,marginBottom:4 }}>Preview</div>
                <div style={{ fontSize:13,color:NYU.gray500,marginBottom:16 }}>Showing first {importPreview.length} of {importRawRows.length} rows. Verify the data looks correct before importing.</div>
                <div style={{ overflowX:"auto",borderRadius:10,border:`1px solid ${NYU.gray200}`,marginBottom:16 }}>
                  <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
                    <thead>
                      <tr style={{ background:NYU.gray50 }}>
                        {["Alias","Chart #","Last Visit","Procedure","Discipline"].map(h=>(
                          <th key={h} style={{ padding:"8px 10px",textAlign:"left",color:NYU.gray400,fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:`1px solid ${NYU.gray200}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row,i)=>(
                        <tr key={i} style={{ borderBottom:i<importPreview.length-1?`1px solid ${NYU.gray100}`:"none" }}>
                          <td style={{ padding:"8px 10px",color:T.purple,fontWeight:600 }}>{row.alias}</td>
                          <td style={{ padding:"8px 10px",color:NYU.gray500 }}>{row.chartNumber||<span style={{ color:NYU.gray300 }}>—</span>}</td>
                          <td style={{ padding:"8px 10px",color:NYU.gray900 }}>{row.lastVisit||<span style={{ color:NYU.gray300 }}>—</span>}</td>
                          <td style={{ padding:"8px 10px",color:NYU.gray900 }}>{row.procedure||<span style={{ color:NYU.gray300 }}>—</span>}</td>
                          <td style={{ padding:"8px 10px",color:NYU.gray900 }}>{row.discipline||<span style={{ color:NYU.gray300 }}>—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background:"#fef9c3",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#92400e",marginBottom:16 }}>
                  ⚠️ This will create <strong>{importRawRows.length} new patient records</strong> in your caseload. Existing patients will not be affected.
                </div>
                <div style={{ display:"flex",gap:10 }}>
                  <button className="action-btn" onClick={()=>setImportStep(2)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>← Back</button>
                  <button className="action-btn" onClick={runImport} disabled={importLoading} style={{ flex:2,background:T.purple,color:"white",opacity:importLoading?0.6:1 }}>{importLoading?"Importing…":"Import All →"}</button>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {importStep===4&&importResult&&(
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:48,marginBottom:12 }}>{importResult.created>0?"✅":"⚠️"}</div>
                <div style={{ fontWeight:700,fontSize:20,color:NYU.gray900,marginBottom:8,fontFamily:"'Fraunces',serif" }}>
                  {importResult.created>0?`${importResult.created} patients imported!`:"Import complete"}
                </div>
                {importResult.skipped>0&&<div style={{ fontSize:13,color:NYU.gray500,marginBottom:4 }}>{importResult.skipped} rows skipped (empty or invalid)</div>}
                {importResult.errors&&importResult.errors.length>0&&<div style={{ fontSize:12,color:NYU.red,marginBottom:8 }}>{importResult.errors[0]}</div>}
                <div style={{ fontSize:13,color:NYU.gray500,marginBottom:24 }}>Your roster has been updated. Edit each patient record to fill in additional details.</div>
                <button className="action-btn" onClick={()=>{ setShowImportModal(false); setImportStep(1); setImportRawRows([]); setImportHeaders([]); setImportResult(null); }} style={{ background:T.purple,color:"white",padding:"10px 28px",fontSize:14 }}>Done</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── CONFIRM DELETE MODAL ── */}
      {confirmDelete&&(
        <>
          <div onClick={()=>setConfirmDelete(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:3000 }}/>
          <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:3001,background:"white",borderRadius:16,padding:"24px 24px",maxWidth:380,width:"90%",boxShadow:"0 8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ fontWeight:700,fontSize:16,color:NYU.gray900,marginBottom:8 }}>Confirm Delete</div>
            <div style={{ fontSize:14,color:NYU.gray600,marginBottom:6 }}>{confirmDelete.message}</div>
            <div style={{ fontSize:12,color:NYU.gray400,marginBottom:20 }}>This cannot be undone.</div>
            <div style={{ display:"flex",gap:10 }}>
              <button className="action-btn" onClick={()=>setConfirmDelete(null)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Cancel</button>
              <button className="action-btn" onClick={()=>{ confirmDelete.onConfirm(); setConfirmDelete(null); }} style={{ flex:1,background:NYU.red,color:"white" }}>Delete</button>
            </div>
          </div>
        </>
      )}

      {/* ── GRADUATION TRANSFER MODAL ── */}
      {showTransferModal&&(()=>{
        const pt=patients.find(p=>p.id===showTransferModal);
        if(!pt) return null;
        return (
          <>
            <div onClick={()=>setShowTransferModal(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:3100 }}/>
            <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:3101,background:"white",borderRadius:20,padding:"28px 28px 24px",maxWidth:420,width:"92%",boxShadow:"0 8px 40px rgba(0,0,0,0.18)" }}>
              <div style={{ fontSize:28,marginBottom:10,textAlign:"center" }}>🎓</div>
              <div style={{ fontWeight:700,fontSize:17,color:NYU.gray900,marginBottom:6,textAlign:"center" }}>Graduation Transfer</div>
              <div style={{ fontSize:13,color:NYU.gray500,marginBottom:20,textAlign:"center",lineHeight:1.5 }}>You marked <b>{pt.alias}</b> treatment complete. As a D4, you can log a transfer to a resident or faculty for continued care.</div>
              <div style={{ marginBottom:14 }}>
                <label style={{ ...labelStyle,fontSize:11 }}>Transfer to (resident / faculty name) <span style={{ fontWeight:400,textTransform:"none" }}>— optional</span></label>
                <input style={inputStyle} placeholder="e.g. Dr. Patel (GPR)" value={transferToName} onChange={e=>setTransferToName(e.target.value)}/>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="action-btn" onClick={()=>setShowTransferModal(null)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Skip</button>
                <button className="action-btn" onClick={()=>{
                  if(transferToName.trim()) updateField(pt.id,"transferredTo",transferToName.trim());
                  updateField(pt.id,"transferDate",new Date().toISOString().split("T")[0]);
                  logChange({ action_type:"TREATMENT_COMPLETE",patient_alias:pt.alias,description:`D4 graduation transfer: ${pt.alias}${transferToName.trim()?` → ${transferToName.trim()}`:""}` });
                  setShowTransferModal(null);
                }} style={{ flex:1,background:T.purple,color:"white" }}>Log Transfer</button>
              </div>
            </div>
          </>
        );
      })()}

      {/* ── QUICK LOG FLOATING BUTTON ── */}
      <div className="float-left" style={{ position:"fixed",bottom:84,left:16,zIndex:2000 }}>
        {quickLogOpen&&(
          <div className="quick-log-panel" style={{ position:"absolute",bottom:72,left:0,width:340,background:"white",borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.18)",overflow:"hidden",animation:"slideUp 0.2s ease" }}>
            <div style={{ background:"#0d9488",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ color:"white",fontWeight:700,fontSize:14 }}>✦ Quick Log Visit</div>
              <button onClick={()=>setQuickLogOpen(false)} style={{ background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:26,height:26,cursor:"pointer",color:"white",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
            </div>
            <div style={{ padding:"16px" }}>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11,fontWeight:700,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,display:"block" }}>Patient</label>
                <select value={quickLogPatientId} onChange={e=>setQuickLogPatientId(e.target.value)} style={{ width:"100%",border:`1.5px solid ${NYU.gray200}`,borderRadius:10,padding:"9px 12px",fontSize:13,fontFamily:"'Inter', sans-serif",color:NYU.gray900,background:"white",outline:"none" }}>
                  <option value="">Select patient…</option>
                  {(()=>{
                    const todayStr=new Date().toISOString().split("T")[0];
                    const todayPts=patients.filter(p=>p.nextAppt===todayStr);
                    const otherPts=patients.filter(p=>p.nextAppt!==todayStr&&!p.treatmentComplete);
                    return [
                      todayPts.length>0&&<optgroup key="today" label="📅 Today's patients">{todayPts.map(p=><option key={p.id} value={p.id}>{p.alias}</option>)}</optgroup>,
                      otherPts.length>0&&<optgroup key="other" label="All active patients">{otherPts.map(p=><option key={p.id} value={p.id}>{p.alias}</option>)}</optgroup>
                    ];
                  })()}
                </select>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11,fontWeight:700,color:NYU.gray400,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,display:"block" }}>Visit note</label>
                <textarea rows={3} value={quickLogNlp} onChange={e=>setQuickLogNlp(e.target.value)} placeholder='e.g. "Saw patient today, did a crown prep, follow up in 3 weeks"' style={{ width:"100%",boxSizing:"border-box",border:`1.5px solid ${NYU.gray200}`,borderRadius:10,padding:"9px 12px",fontSize:13,fontFamily:"'Inter', sans-serif",color:NYU.gray900,resize:"none",outline:"none" }}/>
              </div>
              <button className="action-btn" disabled={!quickLogPatientId||!quickLogNlp.trim()||quickLogLoading}
                onClick={async()=>{
                  setQuickLogLoading(true);
                  try {
                    const todayStr=new Date().toISOString().split("T")[0];
                    let parsed=null;
                    try {
                      const r=await fetch("/api/parse",{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{ role:"user",content:`Extract visit info as JSON only: {"date":"YYYY-MM-DD","procedure":"name","notes":"context"}\nNote: "${quickLogNlp}"` }] }) });
                      const d=await r.json();
                      parsed=JSON.parse(d.content[0].text.trim());
                    } catch(_){}
                    const visit={ date:parsed?.date||todayStr,procedure:parsed?.procedure||quickLogNlp.slice(0,60),notes:parsed?.notes||quickLogNlp,nextAppt:"",cdtCode:"" };
                    const res=await fetch(`/api/patients/${quickLogPatientId}/visits`,{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(visit) });
                    if(res.ok){
                      const vData=await res.json();
                      const pt=patients.find(p=>p.id===quickLogPatientId);
                      setPatients(prev=>prev.map(p=>p.id===quickLogPatientId?{ ...p,lastVisit:visit.date,procedure:visit.procedure,visitLog:[...(p.visitLog||[]),vData] }:p));
                      logChange({ action_type:"VISIT_LOGGED",patient_alias:pt?.alias||quickLogPatientId,description:`Quick logged visit for ${pt?.alias||quickLogPatientId}: ${visit.procedure}` });
                      const alias=pt?.alias||"patient";
                      setQuickLogToast(`Visit logged for ${alias} ✓`);
                      setTimeout(()=>setQuickLogToast(""),2500);
                      setQuickLogOpen(false);
                      setQuickLogNlp("");
                      setQuickLogPatientId("");
                    }
                  } catch(e){ console.error(e); }
                  setQuickLogLoading(false);
                }}
                style={{ width:"100%",background:"#0d9488",color:"white",fontSize:13,opacity:(!quickLogPatientId||!quickLogNlp.trim()||quickLogLoading)?0.6:1 }}>
                {quickLogLoading?"Logging…":"Submit Visit"}
              </button>
            </div>
          </div>
        )}
        {quickLogToast&&(
          <div style={{ position:"absolute",bottom:72,left:0,background:"#0d9488",color:"white",borderRadius:12,padding:"10px 16px",fontSize:13,fontWeight:600,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.15)",animation:"slideUp 0.2s ease" }}>{quickLogToast}</div>
        )}
        <button onClick={()=>setQuickLogOpen(v=>!v)} style={{ width:56,height:56,borderRadius:"50%",background:"#0d9488",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(13,148,136,0.45)",fontSize:22,color:"white" }}>✦</button>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,height:56,background:"white",borderTop:"1px solid #f3f0f7",display:"flex",alignItems:"center",zIndex:1000,boxShadow:"0 -2px 12px rgba(83,74,183,0.07)" }}>
        {[
          {key:"today",  icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="1.5" rx="0.75" fill="currentColor"/><rect x="3" y="9.25" width="10" height="1.5" rx="0.75" fill="currentColor"/><rect x="3" y="13.5" width="7" height="1.5" rx="0.75" fill="currentColor"/></svg>, label:"Today"},
          {key:"roster", icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3.5 17c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, label:"Roster"},
          {key:"requirements", icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3l1.8 3.6L16 7.3l-3 2.9.7 4.1L10 12.1 6.3 14.3l.7-4.1-3-2.9 4.2-.7L10 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>, label:"Goals"},
          {key:"ai",     icon:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10h.01M10 10h.01M13 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, label:"AI"},
        ].map(t=>{
          const active=tab===t.key;
          return (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"4px 0",color:active?"#534AB7":"#a89cbd",transition:"color 0.15s",minHeight:56 }}>
              {t.icon}
              <span style={{ fontSize:10,fontWeight:active?700:500,fontFamily:"'Inter',sans-serif",letterSpacing:"0.01em" }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── ROTATION EDIT MODAL ── */}
      {showRotationModal&&rotationDraft&&(
        <div className="modal-overlay" onClick={()=>setShowRotationModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:380 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div>
                <h2 style={{ fontSize:18,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>Edit Rotation</h2>
                <p style={{ fontSize:12,color:"#0e7490",marginTop:3 }}>{rotationDraft.site}</p>
              </div>
              <button onClick={()=>setShowRotationModal(false)} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:NYU.gray400 }}>×</button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input type="date" style={inputStyle} value={rotationDraft.startDate} onChange={e=>setRotationDraft(p=>({...p,startDate:e.target.value}))}/>
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input type="date" style={inputStyle} value={rotationDraft.endDate} onChange={e=>setRotationDraft(p=>({...p,endDate:e.target.value}))}/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Start Time <span style={{ fontWeight:400,textTransform:"none",letterSpacing:0 }}>(optional)</span></label>
                <input type="time" style={inputStyle} value={rotationDraft.time} onChange={e=>setRotationDraft(p=>({...p,time:e.target.value}))}/>
              </div>
              <div style={{ display:"flex",gap:10,marginTop:4 }}>
                <button className="action-btn" onClick={()=>setShowRotationModal(false)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Cancel</button>
                <button className="action-btn" onClick={()=>{
                  setRotations(prev=>prev.map(r=>r.id===rotationDraft.id?{ ...r,startDate:rotationDraft.startDate,endDate:rotationDraft.endDate,time:rotationDraft.time }:r));
                  setShowRotationModal(false);
                }} style={{ flex:1,background:ROTATION_COLOR,color:"white" }}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT ADD / EDIT MODAL ── */}
      {showApptModal&&(
        <div className="modal-overlay" onClick={()=>setShowApptModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:380 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <h2 style={{ fontSize:18,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>
                {apptModalMode==="edit"?"Edit Appointment":"Add Appointment"}
              </h2>
              <button onClick={()=>setShowApptModal(false)} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:NYU.gray400 }}>×</button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>

              {/* Patient selector — only for new */}
              {apptModalMode==="new"&&(
                <div>
                  <label style={labelStyle}>Patient</label>
                  <select style={inputStyle} value={apptDraft.patientId} onChange={e=>{
                    if(e.target.value==="__new__"){
                      setShowApptModal(false);
                      setShowAddModal(true);
                    } else {
                      setApptDraft(p=>({...p,patientId:e.target.value}));
                    }
                  }}>
                    <option value="">Select a patient...</option>
                    <option value="__new__">＋ Add new patient</option>
                    {patients.filter(p=>!p.treatmentComplete).map(p=>(
                      <option key={p.id} value={p.id}>{p.alias}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date */}
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={apptDraft.date} onChange={e=>setApptDraft(p=>({...p,date:e.target.value}))}/>
              </div>

              {/* Time */}
              <div>
                <label style={labelStyle}>Time <span style={{ fontWeight:400,textTransform:"none",letterSpacing:0 }}>(optional)</span></label>
                <input type="time" style={inputStyle} value={apptDraft.time} onChange={e=>setApptDraft(p=>({...p,time:e.target.value}))}/>
                {apptDraft.date&&apptDraft.time&&(()=>{
                  const conflict = patients.some(p=>
                    p.id!==(apptModalMode==="edit"?apptDraft.patientId:null) &&
                    p.nextAppt===apptDraft.date &&
                    p.nextApptTime===apptDraft.time
                  );
                  return conflict?(
                    <div style={{ marginTop:6,background:"#fee2e2",borderRadius:8,padding:"6px 10px",fontSize:12,color:NYU.red,fontWeight:500 }}>
                      ⚠ Another patient is already scheduled at this time on this date.
                    </div>
                  ):null;
                })()}
              </div>

              {/* Remove appointment option for edit mode */}
              {apptModalMode==="edit"&&(
                <button onClick={()=>{
                  const p=patients.find(x=>x.id===apptDraft.patientId);
                  setConfirmDelete({ message:`Remove appointment for ${p?.alias||"this patient"}?`, onConfirm:()=>{ updateField(apptDraft.patientId,"nextAppt",null); updateField(apptDraft.patientId,"nextApptTime",""); logChange({ action_type:"APPT_REMOVED",patient_alias:p?.alias||"",description:`Removed appointment for ${p?.alias||apptDraft.patientId}` }); setShowApptModal(false); } });
                }} style={{ background:"none",border:`1px solid #fecaca`,borderRadius:10,padding:"8px",cursor:"pointer",fontSize:12,color:NYU.red,fontFamily:"'Inter', sans-serif",fontWeight:500 }}>
                  Remove Appointment
                </button>
              )}

              <div style={{ display:"flex",gap:10,marginTop:4 }}>
                <button className="action-btn" onClick={()=>setShowApptModal(false)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Cancel</button>
                <button className="action-btn"
                  disabled={!apptDraft.date||(apptModalMode==="new"&&!apptDraft.patientId)}
                  onClick={()=>{
                    if(apptModalMode==="new"){
                      updateField(apptDraft.patientId,"nextAppt",apptDraft.date);
                      updateField(apptDraft.patientId,"nextApptTime",apptDraft.time);
                    } else {
                      updateField(apptDraft.patientId,"nextAppt",apptDraft.date);
                      updateField(apptDraft.patientId,"nextApptTime",apptDraft.time);
                    }
                    setShowApptModal(false);
                  }}
                  style={{ flex:1,background:T.purple,color:"white" }}>
                  {apptModalMode==="edit"?"Save Changes":"Add Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAIRED PROVIDER PANEL ── */}
      {showPairedPanel&&<div onClick={()=>setShowPairedPanel(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:199 }}/>}
      {showPairedPanel&&(
        <div style={{ position:"fixed",top:0,right:0,width:"100%",maxWidth:460,height:"100vh",background:"white",zIndex:200,boxShadow:"-4px 0 32px rgba(107,33,168,0.15)",overflowY:"auto",animation:"slideInRight 0.25s ease" }}>
          <div style={{ padding:"24px 24px 16px",borderBottom:`1px solid ${NYU.gray100}`,position:"sticky",top:0,background:"white",zIndex:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
              <button onClick={()=>{ setShowPairedPanel(false); setPairedViewingAs("me"); }} style={{ background:NYU.gray100,border:"none",borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:16 }}>←</button>
              <div>
                <div style={{ fontWeight:700,fontSize:18,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>Paired Provider View</div>
                <div style={{ fontSize:12,color:NYU.gray400 }}>Shared patients and partner access</div>
              </div>
            </div>
            {(()=>{
              const allPartners=[...new Set(patients.filter(p=>p.handoffPartner).map(p=>p.handoffPartner))];
              if(!allPartners.length) return null;
              const partnerName=allPartners[0];
              return (
                <div>
                  <div style={{ fontSize:11,color:NYU.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8 }}>Viewing As</div>
                  <div style={{ display:"flex",background:NYU.gray100,borderRadius:10,padding:3,gap:2 }}>
                    {[{ key:"me",label:"👤 My View" },{ key:"partner",label:`🤝 @${partnerName}` }].map(v=>(
                      <button key={v.key} onClick={()=>setPairedViewingAs(v.key)} style={{ flex:1,padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter', sans-serif",background:pairedViewingAs===v.key?"white":"transparent",color:pairedViewingAs===v.key?T.purple:NYU.gray400,boxShadow:pairedViewingAs===v.key?"0 1px 4px rgba(107,33,168,0.1)":"none",transition:"all 0.15s" }}>{v.label}</button>
                    ))}
                  </div>
                  {pairedViewingAs==="partner"&&(
                    <div style={{ marginTop:10,padding:"8px 12px",background:"#fef3c7",borderRadius:10,border:"1px solid #fde68a",display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontSize:14 }}>👁</span>
                      <span style={{ fontSize:11,color:"#92400e",fontWeight:500 }}>Simulated view — showing only what @{partnerName} can see</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          <div style={{ padding:24 }}>
            {(()=>{
              const sharedPatients=patients.filter(p=>p.handoffPartner);
              const needsPartner=patients.filter(p=>!p.handoffPartner&&!p.treatmentComplete);
              const partnerMap={};
              sharedPatients.forEach(p=>{ const key=p.handoffPartner; if(!partnerMap[key]) partnerMap[key]={ name:p.handoffPartner,year:p.handoffPartnerYear,patients:[] }; partnerMap[key].patients.push(p); });
              const partners=Object.values(partnerMap);

              if(pairedViewingAs==="partner"){
                if(!sharedPatients.length) return <div style={{ textAlign:"center",padding:"40px 20px",color:NYU.gray400 }}><div style={{ fontSize:36,marginBottom:12 }}>🔒</div><div style={{ fontSize:15,fontWeight:600,marginBottom:6 }}>Nothing shared yet</div></div>;
                return (
                  <div>
                    <div style={{ fontSize:13,fontWeight:600,color:NYU.gray900,marginBottom:16 }}>{sharedPatients.length} patient{sharedPatients.length!==1?"s":""} visible to your paired provider</div>
                    {sharedPatients.map(p=>{
                      const av=DISCIPLINE_AVATAR[p.discipline]||{ bg:T.lavender,color:T.purple,initial:"??" };
                      const fields=[
                        { key:"shareCalendar",label:"📅 Next Appointment",value:p.nextAppt||"Not scheduled" },
                        { key:"shareVisitHistory",label:"📋 Visit History",value:`${p.visitLog?.length||0} visits logged` },
                        { key:"shareTreatmentNotes",label:"📝 Procedure",value:p.procedure||"None logged" },
                        { key:"sharePreAuth",label:"📄 Pre-Auth Status",value:p.preAuth },
                      ];
                      return (
                        <div key={p.id} style={{ background:"white",border:`1px solid ${NYU.gray100}`,borderRadius:16,padding:"16px 18px",marginBottom:12 }}>
                          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                            <div style={{ width:38,height:38,borderRadius:10,background:av.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><span style={{ fontSize:12,fontWeight:700,color:av.color }}>{av.initial}</span></div>
                            <div><div style={{ fontWeight:700,fontSize:15,color:NYU.gray900 }}>{p.alias}</div><div style={{ fontSize:12,color:NYU.gray400 }}>{p.discipline}</div></div>
                          </div>
                          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                            {fields.map(({ key,label,value })=>{ const shared=p[key]!==false; return (
                              <div key={key} style={{ padding:"10px 12px",background:shared?NYU.gray50:"#f5f5f5",borderRadius:10,border:`1px solid ${NYU.gray100}`,opacity:shared?1:0.5 }}>
                                <div style={{ fontSize:11,color:NYU.gray400,marginBottom:4 }}>{label}</div>
                                {shared?<div style={{ fontSize:13,fontWeight:600,color:NYU.gray900 }}>{value}</div>:<div style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ fontSize:12 }}>🔒</span><span style={{ fontSize:12,color:NYU.gray300,fontStyle:"italic" }}>Not shared</span></div>}
                              </div>
                            ); })}
                          </div>
                          {p.handoffNotes&&<div style={{ padding:"10px 12px",background:T.lavender,borderRadius:10,fontSize:12,color:NYU.gray600,fontStyle:"italic",marginTop:8 }}>📌 "{p.handoffNotes}"</div>}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return (
                <div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24 }}>
                    {[{ label:"Shared",value:sharedPatients.length,color:NYU.green },{ label:"Partners",value:partners.length,color:T.purple },{ label:"Needs Partner",value:needsPartner.length,color:NYU.orange }].map(s=>(
                      <div key={s.label} style={{ background:NYU.gray50,borderRadius:12,padding:"14px 16px",textAlign:"center",border:`1px solid ${NYU.gray100}` }}>
                        <div style={{ fontSize:28,fontWeight:700,color:s.color,fontFamily:"'Fraunces', serif" }}>{s.value}</div>
                        <div style={{ fontSize:11,color:NYU.gray400,marginTop:4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {partners.length>0?partners.map(partner=>(
                    <div key={partner.name} style={{ marginBottom:24 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                        <div style={{ width:38,height:38,borderRadius:10,background:T.purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><span style={{ fontSize:15,color:"white",fontWeight:700 }}>{partner.name.charAt(0)}</span></div>
                        <div><div style={{ fontWeight:700,fontSize:15,color:NYU.gray900 }}>{partner.name}</div><div style={{ fontSize:12,color:T.purple }}>{partner.year} · {partner.patients.length} shared</div></div>
                      </div>
                      {partner.patients.map(p=>{
                        const av=DISCIPLINE_AVATAR[p.discipline]||{ bg:T.lavender,color:T.purple,initial:"??" };
                        return (
                          <div key={p.id} style={{ background:"white",border:`1px solid ${NYU.gray100}`,borderRadius:14,padding:"14px 16px",marginBottom:8 }}>
                            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                              <div style={{ width:36,height:36,borderRadius:10,background:av.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><span style={{ fontSize:11,fontWeight:700,color:av.color }}>{av.initial}</span></div>
                              <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:14,color:NYU.gray900 }}>{p.alias}</div><div style={{ fontSize:12,color:NYU.gray400 }}>{p.discipline}</div></div>
                              <button className="action-btn" onClick={()=>{ setDetailPatient(p.id); setShowPairedPanel(false); setTab("roster"); }} style={{ background:T.lavender,color:T.purple,fontSize:11 }}>View →</button>
                            </div>
                            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6 }}>
                              {[{ key:"shareCalendar",label:"📅 Next Appt",value:p.nextAppt||"Not scheduled" },{ key:"shareVisitHistory",label:"📋 Visits",value:`${p.visitLog?.length||0} logged` },{ key:"shareTreatmentNotes",label:"📝 Procedure",value:p.procedure||"None" },{ key:"sharePreAuth",label:"📄 Pre-Auth",value:p.preAuth }].map(({ key,label,value })=>{ const shared=p[key]!==false; return (
                                <div key={key} onClick={()=>updateField(p.id,key,!shared)} style={{ padding:"8px 10px",background:shared?T.lavender:NYU.gray50,borderRadius:8,cursor:"pointer",border:`1px solid ${shared?T.purple+"22":NYU.gray100}` }}>
                                  <div style={{ fontSize:10,color:NYU.gray400,marginBottom:2 }}>{label} {shared?"🔓":"🔒"}</div>
                                  <div style={{ fontSize:12,fontWeight:600,color:shared?NYU.gray900:NYU.gray300 }}>{shared?value:"Hidden"}</div>
                                </div>
                              ); })}
                            </div>
                            {p.handoffNotes&&<div style={{ marginTop:8,padding:"8px 10px",background:T.lavender,borderRadius:8,fontSize:12,color:NYU.gray600,fontStyle:"italic" }}>"{p.handoffNotes}"</div>}
                          </div>
                        );
                      })}
                    </div>
                  )):(
                    <div style={{ textAlign:"center",padding:"40px 20px",color:NYU.gray400 }}><div style={{ fontSize:36,marginBottom:12 }}>🤝</div><div style={{ fontSize:15,fontWeight:600,marginBottom:6 }}>No paired providers yet</div><div style={{ fontSize:13 }}>Open a patient and assign a paired provider</div></div>
                  )}
                  {needsPartner.length>0&&(
                    <div style={{ marginTop:16 }}>
                      <div style={{ fontSize:11,fontWeight:700,color:NYU.orange,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12 }}>⚠ No Partner Assigned</div>
                      {needsPartner.map(p=>(
                        <div key={p.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"white",border:`1px solid ${NYU.gray100}`,borderRadius:12,marginBottom:8 }}>
                          <div><div style={{ fontWeight:600,fontSize:14,color:NYU.gray900 }}>{p.alias}</div><div style={{ fontSize:12,color:NYU.gray400 }}>{p.discipline}</div></div>
                          <button className="action-btn" onClick={()=>{ setDetailPatient(p.id); setShowPairedPanel(false); setTab("roster"); }} style={{ background:T.lavender,color:T.purple,fontSize:11 }}>Assign →</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ── */}
      {showSettings&&settingsDraft&&(
        <div className="modal-overlay" onClick={()=>setShowSettings(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:440 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
              <div><h2 style={{ fontSize:18,fontWeight:700,color:NYU.gray900,fontFamily:"'Fraunces', serif" }}>Settings</h2><p style={{ fontSize:12,color:NYU.gray400,marginTop:3 }}>Personalize your ClinIQ experience</p></div>
              <button onClick={()=>setShowSettings(false)} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:NYU.gray400 }}>×</button>
            </div>
            {/* Settings tab row */}
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:20 }}>
              {[["profile","Profile"],["schedule","Schedule"],["rotations","Rotations"],["appearance","Appearance"],["activity","Activity"]].map(([key,label])=>(
                <button key={key} onClick={()=>setSettingsTab(key)}
                  style={{ padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"'Inter',sans-serif",background:settingsTab===key?T.purple:NYU.gray100,color:settingsTab===key?"white":NYU.gray600,transition:"all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
              {/* ── Profile tab ── */}
              {settingsTab==="profile"&&(<>
                <div style={{ background:T.lavender,borderRadius:14,padding:"16px 18px" }}>
                  <div style={{ fontSize:11,fontWeight:700,color:T.purple,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14 }}>Profile</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                    <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={settingsDraft.name} onChange={e=>setSettingsDraft(p=>({...p,name:e.target.value}))}/></div>
                    <div><label style={labelStyle}>Student Year</label><select style={inputStyle} value={settingsDraft.year} onChange={e=>setSettingsDraft(p=>({...p,year:e.target.value}))}><option>D3</option><option>D4</option><optgroup label="Post-Graduate Residents"><option>GPR Resident</option><option>OMFS Resident</option><option>Periodontics Resident</option><option>Endodontics Resident</option><option>Prosthodontics Resident</option><option>Orthodontics Resident</option><option>Pediatric Dentistry Resident</option></optgroup></select></div>
                  </div>
                </div>
                <div style={{ background:"white",borderRadius:14,padding:"16px 18px",border:`1px solid ${NYU.gray100}` }}>
                  <div style={{ fontSize:11,fontWeight:700,color:T.purple,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14 }}>Graduation</div>
                  <div><label style={labelStyle}>Expected Graduation Date</label><input type="date" style={inputStyle} value={settingsDraft.graduationDate} onChange={e=>setSettingsDraft(p=>({...p,graduationDate:e.target.value}))}/></div>
                </div>
                <div style={{ background:"white",borderRadius:14,padding:"16px 18px",border:`1px solid ${NYU.gray100}` }}>
                  <div style={{ fontSize:11,fontWeight:700,color:T.purple,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10 }}>Roster Data</div>
                  <div style={{ fontSize:12,color:NYU.gray500,marginBottom:12,lineHeight:1.5 }}>Import patients from a CSV file (e.g. AxiUm export) or export your current roster.</div>
                  <div style={{ display:"flex",gap:10 }}>
                    <button className="action-btn" onClick={()=>{ setShowSettings(false); setShowImportModal(true); setImportStep(1); }} style={{ flex:1,background:T.purple,color:"white",fontSize:13 }}>📂 Import CSV</button>
                    <button className="action-btn" onClick={()=>{ exportRoster(); }} style={{ flex:1,background:"white",color:NYU.gray700,border:`1.5px solid ${NYU.gray200}`,fontSize:13 }}>📥 Export CSV</button>
                  </div>
                </div>
                <div style={{ background:"#fef9c3",borderRadius:14,padding:"16px 18px",border:"1px solid #fde047" }}>
                  <div style={{ fontSize:11,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10 }}>Demo Data</div>
                  <div style={{ fontSize:12,color:"#78350f",marginBottom:12,lineHeight:1.5 }}>
                    Load 8 sample patients across all disciplines — complete with visit history, lab status, pre-auth data, and paired providers. Also loads 2 rotations and 3 notebook entries.<br/>
                    <strong style={{ color:"#b45309" }}>⚠ This will replace all your current patients, rotations, and notes.</strong>
                  </div>
                  <button className="action-btn" onClick={loadDemoData} disabled={demoSeeding}
                    style={{ background:"#92400e",color:"white",fontSize:13,width:"100%" }}>
                    {demoSeeding ? "Loading demo data…" : "🎓 Load Demo Caseload"}
                  </button>
                </div>
                <div style={{ background:NYU.gray50,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div><div style={{ fontSize:13,fontWeight:600,color:NYU.gray900 }}>ClinIQ</div><div style={{ fontSize:11,color:NYU.gray400,marginTop:2 }}>NYU College of Dentistry · v1.1</div></div>
                  <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg, ${T.purple}, ${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ color:"white",fontSize:16,fontWeight:700 }}>C</span></div>
                </div>
              </>)}

              {/* ── Schedule tab ── */}
              {settingsTab==="schedule"&&(
                <div style={{ background:"white",borderRadius:14,padding:"16px 18px",border:`1px solid ${NYU.gray100}` }}>
                  <div style={{ fontSize:11,fontWeight:700,color:T.purple,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4 }}>Clinic Schedule</div>
                  <div style={{ fontSize:12,color:NYU.gray400,marginBottom:14 }}>Set which days you have clinic and your hours.</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(day=>{
                      const sched=settingsDraft.clinicSchedule?.[day]||{ enabled:false,start:"09:00",end:"17:00" };
                      return (
                        <div key={day} style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div onClick={()=>setSettingsDraft(p=>({ ...p,clinicSchedule:{ ...p.clinicSchedule,[day]:{ ...sched,enabled:!sched.enabled } } }))} style={{ width:36,height:20,borderRadius:99,background:sched.enabled?T.purple:NYU.gray200,cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s" }}>
                            <div style={{ position:"absolute",top:2,left:sched.enabled?18:2,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
                          </div>
                          <span style={{ fontSize:13,fontWeight:600,color:sched.enabled?NYU.gray900:NYU.gray400,width:90,textTransform:"capitalize" }}>{day}</span>
                          {sched.enabled?(
                            <div style={{ display:"flex",alignItems:"center",gap:6,flex:1 }}>
                              <input type="time" value={sched.start} onChange={e=>setSettingsDraft(p=>({ ...p,clinicSchedule:{ ...p.clinicSchedule,[day]:{ ...sched,start:e.target.value } } }))} style={{ ...inputStyle,padding:"5px 8px",fontSize:12,flex:1 }}/>
                              <span style={{ fontSize:12,color:NYU.gray400 }}>to</span>
                              <input type="time" value={sched.end} onChange={e=>setSettingsDraft(p=>({ ...p,clinicSchedule:{ ...p.clinicSchedule,[day]:{ ...sched,end:e.target.value } } }))} style={{ ...inputStyle,padding:"5px 8px",fontSize:12,flex:1 }}/>
                            </div>
                          ):<span style={{ fontSize:12,color:NYU.gray200,fontStyle:"italic" }}>No clinic</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Rotations tab ── */}
              {settingsTab==="rotations"&&(
                <div style={{ background:"white",borderRadius:14,padding:"16px 18px",border:`1px solid ${NYU.gray100}` }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:ROTATION_COLOR,textTransform:"uppercase",letterSpacing:"0.07em" }}>Clinical Rotations</div>
                    <button onClick={()=>{
                      const newR = { id:`r${Date.now()}`,site:"",type:"Hospital Dentistry",startDate:"",endDate:"",recurring:false,recurringDay:"monday",notes:"",color:ROTATION_COLOR };
                      setRotations(prev=>[...prev,newR]);
                    }} style={{ background:"#ecfeff",border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:ROTATION_COLOR,fontFamily:"'Inter', sans-serif" }}>+ Add Rotation</button>
                  </div>
                  <div style={{ fontSize:12,color:NYU.gray400,marginBottom:14 }}>Track external rotation sites — these appear as teal blocks on your calendar.</div>
                  {rotations.length===0&&(
                    <div style={{ fontSize:12,color:NYU.gray400,fontStyle:"italic",textAlign:"center",padding:"12px 0" }}>No rotations added yet.</div>
                  )}
                  <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                    {rotations.map((r,idx)=>(
                      <div key={r.id} style={{ background:NYU.gray50,borderRadius:12,padding:"12px 14px",border:`1px solid #a5f3fc` }}>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                          <span style={{ fontSize:12,fontWeight:600,color:ROTATION_COLOR }}>Rotation {idx+1}</span>
                          <button onClick={()=>setConfirmDelete({ message:`Remove rotation at ${r.site||"this site"}?`, onConfirm:()=>{ logChange({ action_type:"ROTATION_REMOVED",patient_alias:"",description:`Removed rotation at ${r.site||"unknown site"}` }); setRotations(prev=>prev.filter(x=>x.id!==r.id)); } })} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:NYU.gray400,fontFamily:"'Inter', sans-serif" }}>Remove</button>
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                          <div><label style={labelStyle}>Site Name</label><input style={{ ...inputStyle,fontSize:12,padding:"7px 10px" }} placeholder="e.g. Bellevue Hospital" value={r.site} onChange={e=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,site:e.target.value}:x))}/></div>
                          <div><label style={labelStyle}>Rotation Type</label>
                            <select style={{ ...inputStyle,fontSize:12,padding:"7px 10px" }} value={r.type} onChange={e=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,type:e.target.value}:x))}>
                              {ROTATION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                            <div><label style={labelStyle}>Start Date</label><input type="date" style={{ ...inputStyle,fontSize:12,padding:"7px 10px" }} value={r.startDate} onChange={e=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,startDate:e.target.value}:x))}/></div>
                            <div><label style={labelStyle}>End Date</label><input type="date" style={{ ...inputStyle,fontSize:12,padding:"7px 10px" }} value={r.endDate} onChange={e=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,endDate:e.target.value}:x))}/></div>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                            <div onClick={()=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,recurring:!x.recurring}:x))}
                              style={{ width:36,height:20,borderRadius:99,background:r.recurring?ROTATION_COLOR:NYU.gray200,cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s" }}>
                              <div style={{ position:"absolute",top:2,left:r.recurring?18:2,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
                            </div>
                            <span style={{ fontSize:12,color:NYU.gray600 }}>Recurring</span>
                            {r.recurring&&(
                              <select style={{ ...inputStyle,fontSize:12,padding:"5px 8px",flex:1 }} value={r.recurringDay} onChange={e=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,recurringDay:e.target.value}:x))}>
                                {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(d=><option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
                              </select>
                            )}
                          </div>
                          <div><label style={labelStyle}>Notes</label><input style={{ ...inputStyle,fontSize:12,padding:"7px 10px" }} placeholder="Supervisor, address, what to bring..." value={r.notes} onChange={e=>setRotations(prev=>prev.map(x=>x.id===r.id?{...x,notes:e.target.value}:x))}/></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Appearance tab ── */}
              {settingsTab==="appearance"&&(
                <div style={{ background:NYU.gray50,borderRadius:14,padding:"16px 18px" }}>
                  <div style={{ fontSize:11,fontWeight:700,color:T.purple,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14 }}>Appearance</div>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:12,fontWeight:600,color:NYU.gray600,marginBottom:8 }}>Color Theme</div>
                    <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                      {Object.entries(THEMES).map(([key,th])=>(
                        <button key={key} onClick={()=>setThemePreset(key)} title={th.name}
                          style={{ width:32,height:32,borderRadius:99,background:th.purple,border:themePreset===key?`3px solid ${NYU.gray900}`:"3px solid transparent",cursor:"pointer",fontSize:14,transition:"all 0.15s",outline:"none" }}
                        >{themePreset===key?"✓":""}</button>
                      ))}
                    </div>
                    <div style={{ fontSize:11,color:NYU.gray400,marginTop:6 }}>Current: {THEMES[themePreset]?.name}</div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:12,fontWeight:600,color:NYU.gray600,marginBottom:8 }}>Tab Order</div>
                    {dashTabOrder.map((key,i)=>(
                      <div key={key} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                        <div style={{ flex:1,fontSize:13,color:NYU.gray600 }}>{TAB_DEFS[key]?.label}</div>
                        <button onClick={()=>setDashTabOrder(o=>{const a=[...o];if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];}return a;})} disabled={i===0} style={{ background:"none",border:`1px solid ${NYU.gray200}`,borderRadius:6,padding:"2px 6px",cursor:"pointer",fontSize:11,color:NYU.gray500 }}>▲</button>
                        <button onClick={()=>setDashTabOrder(o=>{const a=[...o];if(i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]];}return a;})} disabled={i===dashTabOrder.length-1} style={{ background:"none",border:`1px solid ${NYU.gray200}`,borderRadius:6,padding:"2px 6px",cursor:"pointer",fontSize:11,color:NYU.gray500 }}>▼</button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize:12,fontWeight:600,color:NYU.gray600,marginBottom:8 }}>Dashboard Stats</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                      {STAT_DEFS.map(s=>{
                        const on=visibleStats.includes(s.id);
                        return <button key={s.id} onClick={()=>setVisibleStats(v=>on?v.filter(x=>x!==s.id):[...v,s.id])}
                          style={{ padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:500,cursor:"pointer",border:`1.5px solid ${on?T.purple:NYU.gray200}`,background:on?T.purpleLight:"white",color:on?T.purple:NYU.gray500,transition:"all 0.15s" }}
                        >{s.label}</button>;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Activity tab ── */}
              {settingsTab==="activity"&&(
                <div style={{ background:NYU.gray50,borderRadius:14,padding:"16px 18px",border:`1px solid ${NYU.gray100}` }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:T.purple,textTransform:"uppercase",letterSpacing:"0.07em" }}>Activity Log</div>
                    {changelog.length>10&&<button onClick={()=>setChangelogExpanded(v=>!v)} style={{ background:"none",border:"none",fontSize:12,color:T.purple,cursor:"pointer",fontFamily:"'Inter', sans-serif" }}>{changelogExpanded?"Show less":"View all"}</button>}
                  </div>
                  {changelog.length===0?(
                    <div style={{ fontSize:13,color:NYU.gray400,textAlign:"center",padding:"12px 0" }}>No activity yet.</div>
                  ):(
                    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                      {(changelogExpanded?changelog:changelog.slice(0,10)).map((entry,i)=>{
                        const ICONS={PATIENT_ADDED:"👤",VISIT_LOGGED:"📋",PATIENT_DELETED:"🗑",VISIT_DELETED:"🗑",NOTE_DELETED:"🗑",APPT_REMOVED:"📅",ROTATION_REMOVED:"🔄",TREATMENT_COMPLETE:"✅",PREAUTH_UPDATED:"📄",LAB_UPDATED:"🧪"};
                        const icon=ICONS[entry.action_type]||"•";
                        const ts=new Date(entry.timestamp).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
                        return (
                          <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                            <span style={{ fontSize:14,flexShrink:0 }}>{icon}</span>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ fontSize:12,color:NYU.gray700||NYU.gray600,lineHeight:1.4 }}>{entry.description}</div>
                              <div style={{ fontSize:11,color:NYU.gray400,marginTop:2 }}>{ts}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ display:"flex",gap:10,marginTop:24 }}>
              <button className="action-btn" onClick={()=>setShowSettings(false)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Cancel</button>
              <button className="action-btn" onClick={async()=>{
                setUser(p=>({ ...p,name:settingsDraft.name,year:settingsDraft.year }));
                setGraduationDateStr(settingsDraft.graduationDate);
                if(settingsDraft.clinicSchedule) setClinicSchedule(settingsDraft.clinicSchedule);
                try {
                  await Promise.all([
                    fetch("/api/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({graduationDate:settingsDraft.graduationDate,customGoals,clinicSchedule:settingsDraft.clinicSchedule||clinicSchedule,themePreset,dashTabOrder,visibleStats})}),
                    fetch("/api/rotations",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(rotations)}),
                  ]);
                } catch(e){ console.error("Settings save error:",e); showError("Settings could not be saved — check your connection."); }
                setShowSettings(false);
              }} style={{ flex:1,background:T.purple,color:"white" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR TOAST ── */}
      {errorToast&&(
        <div style={{ position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:"#dc2626",color:"white",borderRadius:99,padding:"10px 20px",fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",whiteSpace:"nowrap",animation:"fadeIn 0.2s ease",pointerEvents:"none" }}>
          {errorToast}
        </div>
      )}

      {/* ── 4-STEP ONBOARDING MODAL ── */}
      {onboardingStep!==null&&(
        <div className="modal-overlay" style={{ zIndex:3000 }}>
          <div className="modal-box" style={{ maxWidth:480,padding:32 }}>
            {/* Step indicator */}
            <div style={{ display:"flex",gap:8,marginBottom:28 }}>
              {[1,2,3,4].map(n=>(
                <div key={n} style={{ flex:1,height:4,borderRadius:99,background:n<=onboardingStep?T.purple:NYU.gray200,transition:"background 0.3s" }}/>
              ))}
            </div>

            {/* Step 1: Welcome */}
            {onboardingStep===1&&(
              <div style={{ textAlign:"center" }}>
                <div style={{ width:64,height:64,borderRadius:18,background:`linear-gradient(135deg, ${T.purple}, ${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
                  <span style={{ color:"white",fontSize:28,fontWeight:700 }}>C</span>
                </div>
                <h2 style={{ fontFamily:"'Fraunces', serif",fontSize:26,fontWeight:700,color:NYU.gray900,letterSpacing:"-0.02em",marginBottom:10 }}>Welcome to ClinIQ</h2>
                <p style={{ color:NYU.gray600,fontSize:14,lineHeight:1.7,marginBottom:24 }}>
                  Your personal clinical caseload manager — built for NYU College of Dentistry students. Track patients, log visits, monitor graduation requirements, and let AI do the heavy lifting.
                </p>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28,textAlign:"left" }}>
                  {[
                    { icon:"👤", label:"Patient roster", desc:"Track every case" },
                    { icon:"🎓", label:"Grad requirements", desc:"Never miss a milestone" },
                    { icon:"✦",  label:"AI assistant", desc:"Ask anything, anytime" },
                    { icon:"📋", label:"Visit logging", desc:"NLP-powered notes" },
                  ].map(f=>(
                    <div key={f.label} style={{ background:T.lavender,borderRadius:12,padding:"12px 14px" }}>
                      <div style={{ fontSize:20,marginBottom:4 }}>{f.icon}</div>
                      <div style={{ fontSize:13,fontWeight:600,color:NYU.gray900 }}>{f.label}</div>
                      <div style={{ fontSize:11,color:NYU.gray400,marginTop:1 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
                <button className="action-btn" onClick={()=>setOnboardingStep(2)} style={{ width:"100%",background:T.purple,color:"white",fontSize:14 }}>Get started →</button>
              </div>
            )}

            {/* Step 2: Add first patient */}
            {onboardingStep===2&&(
              <div>
                <div style={{ fontSize:32,marginBottom:16 }}>👤</div>
                <h2 style={{ fontFamily:"'Fraunces', serif",fontSize:22,fontWeight:700,color:NYU.gray900,marginBottom:10 }}>Add your first patient</h2>
                <p style={{ color:NYU.gray600,fontSize:14,lineHeight:1.6,marginBottom:20 }}>
                  Each patient has a chart number, discipline, and visit log. Hit <strong>+ Add Patient</strong> from the toolbar anytime. You can also load a demo caseload from Settings to see ClinIQ in action.
                </p>
                <div style={{ background:NYU.gray100,borderRadius:14,padding:"14px 16px",marginBottom:20 }}>
                  <div style={{ fontSize:12,fontWeight:700,color:NYU.gray600,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em" }}>What you'll track</div>
                  {["Chart number & discipline","Procedure history & visit log","Pre-auth status & lab tracking","Next appointment & treatment phase"].map(item=>(
                    <div key={item} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                      <div style={{ width:6,height:6,borderRadius:"50%",background:T.purple,flexShrink:0 }}/>
                      <span style={{ fontSize:13,color:NYU.gray700 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex",gap:10 }}>
                  <button className="action-btn" onClick={()=>setOnboardingStep(3)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>Skip</button>
                  <button className="action-btn" onClick={()=>{ setOnboardingStep(null); localStorage.setItem("cliniq-onboarded","1"); setShowAddModal(true); }} style={{ flex:2,background:T.purple,color:"white" }}>+ Add a patient now</button>
                </div>
                <button onClick={()=>setOnboardingStep(3)} style={{ width:"100%",marginTop:10,background:"none",border:"none",cursor:"pointer",fontSize:12,color:NYU.gray400,fontFamily:"'Inter',sans-serif" }}>Continue setup →</button>
              </div>
            )}

            {/* Step 3: Set graduation goals */}
            {onboardingStep===3&&(
              <div>
                <div style={{ fontSize:32,marginBottom:16 }}>🎓</div>
                <h2 style={{ fontFamily:"'Fraunces', serif",fontSize:22,fontWeight:700,color:NYU.gray900,marginBottom:10 }}>Set your graduation goals</h2>
                <p style={{ color:NYU.gray600,fontSize:14,lineHeight:1.6,marginBottom:16 }}>
                  ClinIQ tracks progress toward NYU's graduation requirements across all 12 clinical disciplines. You can customize target visit counts in <strong>Graduation Goals</strong>.
                </p>
                <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:20 }}>
                  {[
                    { label:"General Dentistry", req:20, color:T.purple },
                    { label:"Periodontics", req:12, color:NYU.blue },
                    { label:"Endodontics", req:10, color:NYU.green },
                  ].map(g=>(
                    <div key={g.label} style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <span style={{ fontSize:12,fontWeight:600,color:NYU.gray600,width:160 }}>{g.label}</span>
                      <div style={{ flex:1,height:6,borderRadius:99,background:NYU.gray200 }}>
                        <div style={{ width:"0%",height:"100%",borderRadius:99,background:g.color }}/>
                      </div>
                      <span style={{ fontSize:11,color:NYU.gray400,width:40,textAlign:"right" }}>0/{g.req}</span>
                    </div>
                  ))}
                  <div style={{ fontSize:11,color:NYU.gray400,textAlign:"center",marginTop:4 }}>+ 9 more disciplines</div>
                </div>
                <div style={{ background:"#fef9c3",borderRadius:12,padding:"12px 14px",border:"1px solid #fde047",marginBottom:20 }}>
                  <div style={{ fontSize:13,color:"#78350f" }}>💡 Set your graduation date in Settings to see how many visits/week you need to stay on track.</div>
                </div>
                <div style={{ display:"flex",gap:10 }}>
                  <button className="action-btn" onClick={()=>setOnboardingStep(2)} style={{ flex:1,background:"white",color:NYU.gray600,border:`1.5px solid ${NYU.gray200}` }}>← Back</button>
                  <button className="action-btn" onClick={()=>setOnboardingStep(4)} style={{ flex:2,background:T.purple,color:"white" }}>Next →</button>
                </div>
              </div>
            )}

            {/* Step 4: Meet the AI assistant */}
            {onboardingStep===4&&(
              <div>
                <div style={{ fontSize:32,marginBottom:16 }}>✦</div>
                <h2 style={{ fontFamily:"'Fraunces', serif",fontSize:22,fontWeight:700,color:NYU.gray900,marginBottom:10 }}>Meet your AI assistant</h2>
                <p style={{ color:NYU.gray600,fontSize:14,lineHeight:1.6,marginBottom:16 }}>
                  ClinIQ uses Claude AI to understand your caseload and help you work smarter. Ask it anything — in plain English.
                </p>
                <div style={{ background:T.lavender,borderRadius:14,padding:"14px 16px",marginBottom:16 }}>
                  <div style={{ fontSize:12,fontWeight:700,color:T.purple,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em" }}>Try asking</div>
                  {["Am I on track to graduate?","Which patients need follow-up?","Parse this visit note: saw patient for crown prep, next in 3 weeks"].map(q=>(
                    <div key={q} style={{ background:"white",borderRadius:8,padding:"8px 12px",fontSize:12,color:NYU.gray700,marginBottom:6,border:`1px solid ${NYU.gray200}` }}>"{q}"</div>
                  ))}
                </div>
                <div style={{ background:NYU.gray100,borderRadius:12,padding:"12px 14px",marginBottom:20,fontSize:13,color:NYU.gray600,lineHeight:1.5 }}>
                  🔒 HIPAA-safe — no real patient names or chart numbers are sent to AI. Use patient aliases only.
                </div>
                <button className="action-btn" onClick={()=>{ setOnboardingStep(null); localStorage.setItem("cliniq-onboarded","1"); }} style={{ width:"100%",background:T.purple,color:"white",fontSize:14,marginBottom:10 }}>
                  Start using ClinIQ 🎉
                </button>
                <button onClick={()=>setOnboardingStep(3)} style={{ width:"100%",background:"none",border:"none",cursor:"pointer",fontSize:12,color:NYU.gray400,fontFamily:"'Inter',sans-serif" }}>← Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
