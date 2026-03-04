import { useState } from "react";

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

const DISCIPLINES = [
  "Comprehensive Care",
  "Endodontics",
  "Oral & Maxillofacial Surgery",
  "Orthodontics",
  "Pediatric Dentistry",
  "Periodontics",
  "Prosthodontics",
  "Implant Dentistry",
  "Dental Hygiene",
  "Special Needs Dentistry",
  "Oral Medicine & Pathology",
  "General Dentistry",
];

const REQUIREMENTS = {
  "Comprehensive Care": { required: 10 },
  Endodontics: { required: 10 },
  "Oral & Maxillofacial Surgery": { required: 8 },
  Orthodontics: { required: 5 },
  "Pediatric Dentistry": { required: 8 },
  Periodontics: { required: 12 },
  Prosthodontics: { required: 10 },
  "Implant Dentistry": { required: 6 },
  "Dental Hygiene": { required: 15 },
  "Special Needs Dentistry": { required: 4 },
  "Oral Medicine & Pathology": { required: 4 },
  "General Dentistry": { required: 20 },
};


const CDT_CODES = {
  // Diagnostic
  "D0120": { procedure: "Periodic Oral Evaluation", discipline: "Comprehensive Care" },
  "D0140": { procedure: "Limited Oral Evaluation", discipline: "Comprehensive Care" },
  "D0150": { procedure: "Comprehensive Oral Evaluation", discipline: "Comprehensive Care" },
  "D0210": { procedure: "Full Mouth Radiographic Survey", discipline: "Comprehensive Care" },
  "D0220": { procedure: "Periapical Radiograph", discipline: "Comprehensive Care" },
  "D0330": { procedure: "Panoramic Radiographic Image", discipline: "Comprehensive Care" },
  // Preventive / Hygiene
  "D1110": { procedure: "Prophylaxis - Adult", discipline: "Dental Hygiene" },
  "D1120": { procedure: "Prophylaxis - Child", discipline: "Dental Hygiene" },
  "D1206": { procedure: "Topical Fluoride Varnish", discipline: "Dental Hygiene" },
  "D1351": { procedure: "Sealant", discipline: "Dental Hygiene" },
  // Restorative
  "D2140": { procedure: "Amalgam Restoration - 1 Surface", discipline: "General Dentistry" },
  "D2150": { procedure: "Amalgam Restoration - 2 Surfaces", discipline: "General Dentistry" },
  "D2160": { procedure: "Amalgam Restoration - 3 Surfaces", discipline: "General Dentistry" },
  "D2330": { procedure: "Resin Composite - 1 Surface Anterior", discipline: "General Dentistry" },
  "D2391": { procedure: "Resin Composite - 1 Surface Posterior", discipline: "General Dentistry" },
  "D2740": { procedure: "Crown - Porcelain/Ceramic", discipline: "Prosthodontics" },
  "D2750": { procedure: "Crown - Porcelain Fused to Metal", discipline: "Prosthodontics" },
  "D2930": { procedure: "Prefabricated Stainless Steel Crown - Primary", discipline: "Pediatric Dentistry" },
  // Endodontics
  "D3110": { procedure: "Pulp Cap - Direct", discipline: "Endodontics" },
  "D3220": { procedure: "Pulpotomy", discipline: "Endodontics" },
  "D3310": { procedure: "Root Canal - Anterior", discipline: "Endodontics" },
  "D3320": { procedure: "Root Canal - Premolar", discipline: "Endodontics" },
  "D3330": { procedure: "Root Canal - Molar", discipline: "Endodontics" },
  "D3410": { procedure: "Apicoectomy - Anterior", discipline: "Endodontics" },
  // Periodontics
  "D4210": { procedure: "Gingivectomy", discipline: "Periodontics" },
  "D4240": { procedure: "Gingival Flap Procedure", discipline: "Periodontics" },
  "D4341": { procedure: "Scaling & Root Planing - 4+ Teeth", discipline: "Periodontics" },
  "D4342": { procedure: "Scaling & Root Planing - 1-3 Teeth", discipline: "Periodontics" },
  "D4910": { procedure: "Periodontal Maintenance", discipline: "Periodontics" },
  // Prosthodontics
  "D5110": { procedure: "Complete Denture - Maxillary", discipline: "Prosthodontics" },
  "D5120": { procedure: "Complete Denture - Mandibular", discipline: "Prosthodontics" },
  "D5213": { procedure: "Partial Denture - Maxillary", discipline: "Prosthodontics" },
  "D6010": { procedure: "Implant Placement", discipline: "Implant Dentistry" },
  "D6065": { procedure: "Implant Crown - Porcelain/Ceramic", discipline: "Implant Dentistry" },
  "D6240": { procedure: "Pontic - Porcelain Fused to Metal", discipline: "Prosthodontics" },
  // Oral Surgery
  "D7140": { procedure: "Extraction - Erupted Tooth", discipline: "Oral & Maxillofacial Surgery" },
  "D7210": { procedure: "Extraction - Impacted Tooth, Soft Tissue", discipline: "Oral & Maxillofacial Surgery" },
  "D7240": { procedure: "Extraction - Impacted Tooth, Completely Bony", discipline: "Oral & Maxillofacial Surgery" },
  "D7310": { procedure: "Alveoloplasty", discipline: "Oral & Maxillofacial Surgery" },
  // Orthodontics
  "D8010": { procedure: "Limited Orthodontic Treatment - Primary", discipline: "Orthodontics" },
  "D8080": { procedure: "Comprehensive Orthodontic Treatment - Adolescent", discipline: "Orthodontics" },
  "D8090": { procedure: "Comprehensive Orthodontic Treatment - Adult", discipline: "Orthodontics" },
  // Pediatric
  "D9930": { procedure: "Treatment of Complications", discipline: "Comprehensive Care" },
  "D9951": { procedure: "Occlusal Adjustment - Limited", discipline: "Comprehensive Care" },
};


// ── Discipline Visit Benchmarks (typical visits to complete treatment) ──
const DISCIPLINE_BENCHMARKS = {
  "Comprehensive Care": { visits: 4, label: "4 visits typical" },
  "Endodontics": { visits: 3, label: "3 visits typical (RCT)" },
  "Oral & Maxillofacial Surgery": { visits: 2, label: "2 visits typical" },
  "Orthodontics": { visits: 18, label: "18+ visits typical" },
  "Pediatric Dentistry": { visits: 3, label: "3 visits typical" },
  "Periodontics": { visits: 5, label: "5 visits typical (SRP + re-eval)" },
  "Prosthodontics": { visits: 4, label: "4 visits typical (crown/denture)" },
  "Implant Dentistry": { visits: 5, label: "5 visits typical (staging)" },
  "Dental Hygiene": { visits: 2, label: "2 visits typical" },
  "Special Needs Dentistry": { visits: 4, label: "4 visits typical" },
  "Oral Medicine & Pathology": { visits: 3, label: "3 visits typical" },
  "General Dentistry": { visits: 3, label: "3 visits typical" },
};

// ── Predictive Completion Calculator ──
const predictCompletion = (patient) => {
  if (patient.treatmentComplete) return null;
  if (!patient.treatmentStart) return null;
  const visitLog = patient.visitLog || [];
  const benchmark = DISCIPLINE_BENCHMARKS[patient.discipline]?.visits || 3;
  const visitsLogged = visitLog.length;
  const visitsRemaining = Math.max(0, benchmark - visitsLogged);
  if (visitsRemaining === 0) return { date: "Soon", label: "Final visit approaching", daysOut: 0 };

  let avgInterval = 21; // default 3 weeks
  if (visitLog.length >= 2) {
    const sorted = [...visitLog].sort((a, b) => new Date(a.date) - new Date(b.date));
    const intervals = [];
    for (let i = 1; i < sorted.length; i++) {
      intervals.push((new Date(sorted[i].date) - new Date(sorted[i-1].date)) / 86400000);
    }
    avgInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
  }

  const daysOut = visitsRemaining * avgInterval;
  const projected = new Date(Date.now() + daysOut * 86400000);
  return {
    date: projected.toISOString().split("T")[0],
    label: `${benchmark} visits typical · ${visitsLogged} done · ${visitsRemaining} remaining`,
    daysOut,
    avgInterval,
    visitsRemaining,
    benchmark,
  };
};


const DISCIPLINE_AVATAR = {
  "Comprehensive Care":          { bg: "#e0f2fe", color: "#0369a1", initial: "CC" },
  "Endodontics":                 { bg: "#fce7f3", color: "#9d174d", initial: "En" },
  "Oral & Maxillofacial Surgery":{ bg: "#fee2e2", color: "#991b1b", initial: "OS" },
  "Orthodontics":                { bg: "#fef3c7", color: "#92400e", initial: "Or" },
  "Pediatric Dentistry":         { bg: "#dcfce7", color: "#166534", initial: "Pd" },
  "Periodontics":                { bg: "#ede9fe", color: "#5b21b6", initial: "Pe" },
  "Prosthodontics":              { bg: "#dbeafe", color: "#1e40af", initial: "Pr" },
  "Implant Dentistry":           { bg: "#d1fae5", color: "#065f46", initial: "Im" },
  "Dental Hygiene":              { bg: "#fef9c3", color: "#854d0e", initial: "Hy" },
  "Special Needs Dentistry":     { bg: "#ffe4e6", color: "#9f1239", initial: "SN" },
  "Oral Medicine & Pathology":   { bg: "#f3e8ff", color: "#6d28d9", initial: "OM" },
  "General Dentistry":           { bg: "#e0f2fe", color: "#075985", initial: "GD" },
};
const HANDOFF_STATUSES = ["Unassigned", "Active - Shared", "Needs Partner", "Transitioning"];
const HANDOFF_META = {
  "Unassigned":       { color: NYU.gray400, bg: NYU.gray100 },
  "Active - Shared":  { color: NYU.green,   bg: NYU.greenLight },
  "Needs Partner":    { color: NYU.orange,  bg: NYU.orangeLight },
  "Transitioning":    { color: NYU.blue,    bg: "#dbeafe" },
};
const LAB_STATUSES = ["None", "Pending", "Sent", "Received"];
const PREAUTH_STATUSES = ["Not Submitted", "Submitted", "Approved", "Denied"];


const generateId = (patients) =>
  `PT-${String(patients.length + 1).padStart(3, "0")}`;

const today = new Date();

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
  if (daysToCompletion !== null && daysToCompletion <= 30 && daysToCompletion >= 0)
    reasons.push(`Treatment due in ${daysToCompletion} days`);
  if (daysToCompletion !== null && daysToCompletion < 0)
    reasons.push("Treatment completion date passed");
  if (patient.preAuth === "Denied") reasons.push("Pre-auth denied");
  if (reasons.length === 0) return null;
  return reasons;
};

const calculateStatus = (patient) => {
  if (patient.treatmentComplete) return "Treatment Complete";
  const urgency = calculateUrgency(patient);
  if (urgency && urgency.length > 0) return "F/U Appt Needed";
  return "Active";
};

const STATUS_META = {
  Active: { color: NYU.green, bg: "#dcfce7" },
  "F/U Appt Needed": { color: NYU.amber, bg: "#fef3c7" },
  "Treatment Complete": { color: NYU.purple, bg: NYU.purpleLight },
};

const LAB_META = {
  None: { color: NYU.gray400, bg: NYU.gray100 },
  Pending: { color: NYU.amber, bg: "#fef3c7" },
  Sent: { color: NYU.blue, bg: "#dbeafe" },
  Received: { color: NYU.green, bg: "#dcfce7" },
};

const PREAUTH_META = {
  "Not Submitted": { color: NYU.gray400, bg: NYU.gray100 },
  Submitted: { color: NYU.blue, bg: "#dbeafe" },
  Approved: { color: NYU.green, bg: "#dcfce7" },
  Denied: { color: NYU.red, bg: "#fee2e2" },
};

const emptyPatient = {
  chartNumber: "",
  procedure: "",
  discipline: "General Dentistry",
  lastVisit: "",
  treatmentStart: "",
  expectedCompletion: "",
  nextAppt: null,
  treatmentComplete: false,
  labStatus: "None",
  preAuth: "Not Submitted",
  notes: "",
  visitLog: [],
  handoffStatus: "Unassigned",
  handoffPartner: "",
  handoffPartnerYear: "D3",
  handoffNotes: "",
};

const initialPatients = [
  {
    id: "PT-001", handoffStatus: "Active - Shared", handoffPartner: "Marcus Reid", handoffPartnerYear: "D3", handoffNotes: "Crown placement still pending. Patient prefers morning appointments. Pre-auth approved.",
    chartNumber: "1047823",
    lastVisit: "2026-02-10",
    procedure: "Root Canal",
    discipline: "Endodontics",
    treatmentStart: "2026-01-15",
    expectedCompletion: "2026-04-01",
    nextAppt: "2026-03-05",
    treatmentComplete: false,
    labStatus: "Received",
    preAuth: "Approved",
    notes: "Patient responds well to treatment. Follow up on crown placement.",
    visitLog: [{ date: "2026-02-10", procedure: "Root Canal", notes: "Initial treatment complete." }],
    handoffStatus: "Active - Shared",
    handoffPartner: "Marcus Reid",
    handoffPartnerYear: "D3",
    handoffNotes: "Crown placement still pending. Patient prefers morning appointments. Pre-auth approved.",
  },
  {
    id: "PT-002", handoffStatus: "Unassigned", handoffPartner: "", handoffPartnerYear: "D3", handoffNotes: "",
    chartNumber: "1047824",
    lastVisit: "2026-01-15",
    procedure: "Crown Prep",
    discipline: "Prosthodontics",
    treatmentStart: "2026-01-15",
    expectedCompletion: "2026-03-15",
    nextAppt: null,
    treatmentComplete: false,
    labStatus: "Pending",
    preAuth: "Submitted",
    notes: "Waiting on lab. Need to schedule follow-up appointment.",
    visitLog: [{ date: "2026-01-15", procedure: "Crown Prep", notes: "Sent to lab." }],
    handoffStatus: "Unassigned",
    handoffPartner: "",
    handoffPartnerYear: "D3",
    handoffNotes: "",
  },
  {
    id: "PT-003", handoffStatus: "Needs Partner", handoffPartner: "Priya Patel", handoffPartnerYear: "D3", handoffNotes: "Osseointegration monitoring ongoing. Next stage in April. Needs experienced provider.",
    chartNumber: "1047825",
    lastVisit: "2025-12-20",
    procedure: "Implant Placement",
    discipline: "Implant Dentistry",
    treatmentStart: "2025-12-20",
    expectedCompletion: "2026-06-01",
    nextAppt: "2026-02-28",
    treatmentComplete: false,
    labStatus: "Sent",
    preAuth: "Approved",
    notes: "Stage 1 complete. Monitoring osseointegration.",
    visitLog: [{ date: "2025-12-20", procedure: "Implant Placement", notes: "Stage 1 placed." }],
    handoffStatus: "Needs Partner",
    handoffPartner: "Priya Patel",
    handoffPartnerYear: "D3",
    handoffNotes: "Osseointegration monitoring ongoing. Next stage in April. Needs experienced provider.",
  },
  {
    id: "PT-004", handoffStatus: "Unassigned", handoffPartner: "", handoffPartnerYear: "D3", handoffNotes: "",
    chartNumber: "1047826",
    lastVisit: "2026-02-01",
    procedure: "Scaling & Root Planing",
    discipline: "Periodontics",
    treatmentStart: "2026-02-01",
    expectedCompletion: "2026-04-15",
    nextAppt: null,
    treatmentComplete: false,
    labStatus: "None",
    preAuth: "Denied",
    notes: "Pre-auth denied — needs resubmission with additional documentation.",
    visitLog: [{ date: "2026-02-01", procedure: "Scaling & Root Planing", notes: "Pre-auth denied." }],
    handoffStatus: "Unassigned",
    handoffPartner: "",
    handoffPartnerYear: "D3",
    handoffNotes: "",
  },
  {
    id: "PT-005", handoffStatus: "Active - Shared", handoffPartner: "Jordan Kim", handoffPartnerYear: "D4", handoffNotes: "Post-op complete. Simple case — good for D3 handoff.",
    chartNumber: "1047827",
    lastVisit: "2026-01-05",
    procedure: "Extraction",
    discipline: "Oral & Maxillofacial Surgery",
    treatmentStart: "2026-01-05",
    expectedCompletion: "2026-02-15",
    nextAppt: "2026-03-10",
    treatmentComplete: false,
    labStatus: "None",
    preAuth: "Not Submitted",
    notes: "Post-op healing well. No complications.",
    visitLog: [{ date: "2026-01-05", procedure: "Extraction", notes: "Healing well." }],
    handoffStatus: "Active - Shared",
    handoffPartner: "Jordan Kim",
    handoffPartnerYear: "D4",
    handoffNotes: "Post-op complete. Simple case — good for D3 handoff.",
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f8f6fb; font-family: 'Inter', sans-serif; }
  .card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(107,33,168,0.06); transition: all 0.2s; border: 1px solid rgba(107,33,168,0.06); }
  .card:hover { box-shadow: 0 4px 16px rgba(107,33,168,0.1); transform: translateY(-1px); }
  .patient-card { cursor: pointer; border-left: 3px solid transparent; transition: all 0.18s ease; border-radius: 14px; }
  .patient-card:hover { box-shadow: 0 4px 20px rgba(107,33,168,0.1); }
  .pill-btn { border: none; border-radius: 99px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; padding: 5px 14px; transition: all 0.15s; }
  .pill-btn:hover { opacity: 0.85; }
  .filter-btn { border: 1.5px solid transparent; border-radius: 99px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 7px 18px; transition: all 0.15s; }
  .action-btn { border-radius: 12px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 20px; transition: all 0.18s; border: none; }
  .action-btn:hover { opacity: 0.92; transform: translateY(-1px); }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .bottom-nav-btn { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 16px; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  input, select, textarea { font-family: 'Inter', sans-serif; outline: none; }
  input:focus, select:focus, textarea:focus { border-color: ${NYU.purpleMid} !important; box-shadow: 0 0 0 3px rgba(107,33,168,0.08); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(30,20,40,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease; }
  .modal-box { background: white; border-radius: 24px; padding: 28px; width: 90%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 32px 80px rgba(107,33,168,0.15); animation: slideUp 0.22s ease; }
  .progress-bar { height: 6px; border-radius: 99px; background: ${NYU.gray100}; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
  .nlp-box { background: linear-gradient(135deg, ${NYU.purpleDeep}, ${NYU.purpleDark}); border-radius: 16px; padding: 16px; margin-bottom: 4px; }
  .nlp-parsed { background: ${NYU.greenLight}; border: 1px solid #6ee7b7; border-radius: 12px; padding: 12px 14px; margin-top: 8px; animation: slideUp 0.2s ease; }
  .urgency-banner { background: ${NYU.orangeLight}; border: 1px solid #fed7aa; border-radius: 10px; padding: 10px 14px; margin-top: 10px; }
  .section-label { font-size: 11px; font-weight: 600; color: ${NYU.gray400}; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes bounce { from { transform: translateY(0) } to { transform: translateY(-5px) } }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${NYU.gray200}; border-radius: 99px; }

  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .insights-grid { grid-template-columns: 1fr !important; }
    .page-header { flex-direction: column; align-items: flex-start !important; gap: 12px; }
    .page-header-actions { width: 100%; display: flex; gap: 8px; }
    .page-header-actions button { flex: 1; }
    .patient-card-header { flex-direction: column; align-items: flex-start !important; gap: 10px; }
    .patient-card-right { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .detail-grid-3 { grid-template-columns: 1fr 1fr !important; }
    .detail-grid-2 { grid-template-columns: 1fr !important; }
    .modal-box { padding: 20px !important; width: 95% !important; }
    .nav-inner { padding: 0 16px !important; }
    .page-inner { padding: 20px 16px !important; }
    .filter-row { overflow-x: auto; padding-bottom: 4px; flex-wrap: nowrap !important; }
    .urgent-banner { flex-direction: column; align-items: flex-start !important; gap: 8px; }
    .urgent-banner button { width: 100%; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
    .detail-grid-3 { grid-template-columns: 1fr !important; }
    .tab-btn { font-size: 13px; margin-right: 16px; }
  }
`;

const NoteCard = ({ note, active, onClick }) => {
  const catColors = {
    "Clinical": { color: "#0369a1", bg: "#e0f2fe" },
    "Patient":  { color: "#6d28d9", bg: "#f3e8ff" },
    "Study":    { color: "#065f46", bg: "#d1fae5" },
    "General":  { color: "#92400e", bg: "#fef3c7" },
  };
  const cat = catColors[note.category] || catColors["General"];
  return (
    <div onClick={onClick} style={{ padding: "12px 14px", borderRadius: 12, marginBottom: 6, cursor: "pointer", background: active ? NYU.lavender : "white", border: `1px solid ${active ? NYU.gray200 : NYU.gray100}`, transition: "all 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        {note.pinned && <span style={{ fontSize: 10 }}>📌</span>}
        <span style={{ fontSize: 10, fontWeight: 600, color: cat.color, background: cat.bg, borderRadius: 99, padding: "2px 8px" }}>{note.category}</span>
        <span style={{ fontSize: 10, color: NYU.gray400, marginLeft: "auto" }}>{note.updatedAt}</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note.title || "Untitled"}</div>
      <div style={{ fontSize: 12, color: NYU.gray400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note.body?.split("\n")[0] || "Empty note"}</div>
    </div>
  );
};

const Badge = ({ label, meta }) => (
  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: meta.bg, color: meta.color, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
    {label}
  </span>
);

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 12,
  border: `1px solid ${NYU.gray200}`, fontSize: 14,
  color: NYU.gray900, background: "white", transition: "all 0.15s",
};

const labelStyle = {
  fontSize: 11, fontWeight: 600, color: NYU.gray400,
  textTransform: "uppercase", letterSpacing: "0.07em",
  display: "block", marginBottom: 6,
};

export default function App() {
  const [user, setUser] = useState(null); // { name, year, email }
  const [loginForm, setLoginForm] = useState({ email: "", password: "", name: "", year: "D3" });
  const [loginError, setLoginError] = useState("");
  const [patients, setPatients] = useState(initialPatients);
  const [selected, setSelected] = useState(null);
  const [detailPatient, setDetailPatient] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("roster");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPairedPanel, setShowPairedPanel] = useState(false);
  const [showUrgentPanel, setShowUrgentPanel] = useState(false);
  const [showRosterPanel, setShowRosterPanel] = useState(false);
  const [showGoalsPanel, setShowGoalsPanel] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [showLogModal, setShowLogModal] = useState(null);
  const [newVisit, setNewVisit] = useState({ date: "", procedure: "", notes: "", nextAppt: "", cdtCode: "" });
  const [nlpInput, setNlpInput] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpParsed, setNlpParsed] = useState(null);
  const [nlpError, setNlpError] = useState("");

  // ── AI Chat ──
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hi! I'm your ClinIQ AI assistant. I can help you understand your caseload, track graduation requirements, and answer questions about dental procedures and CDT codes. What would you like to know?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // ── Custom Goals ──
  // ── Notebook ──
  const [notes, setNotes] = useState([
    { id: "n1", title: "Pre-clinic checklist", body: "- Review patient charts\n- Check lab status for PT-1047824\n- Confirm pre-auth for PT-1047826", category: "Clinical", pinned: true, updatedAt: "2026-03-03" },
    { id: "n2", title: "SRP technique notes", body: "Dr. Chen feedback: work on wrist angulation on posterior teeth. Practice on typodont Tuesday.", category: "Study", pinned: false, updatedAt: "2026-03-02" },
    { id: "n3", title: "PT-1047823 reminder", body: "Patient mentioned financial concerns — be sensitive when discussing crown treatment plan. Consider phasing.", category: "Patient", pinned: false, updatedAt: "2026-03-01" },
  ]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState(null);
  const [noteSearch, setNoteSearch] = useState("");
  const [calView, setCalView] = useState("week"); // "week" | "month"
  const [calCombinedView, setCalCombinedView] = useState(false);
  const [clinicSchedule, setClinicSchedule] = useState({
    monday:    { enabled: true,  start: "08:00", end: "20:00" },
    tuesday:   { enabled: true,  start: "08:00", end: "18:00" },
    wednesday: { enabled: true,  start: "08:00", end: "20:00" },
    thursday:  { enabled: true,  start: "08:00", end: "18:00" },
    friday:    { enabled: true,  start: "08:00", end: "18:00" },
    saturday:  { enabled: false, start: "09:00", end: "13:00" },
    sunday:    { enabled: false, start: "09:00", end: "13:00" },
  });
  const [calDate, setCalDate] = useState(new Date());

  const [editingGoals, setEditingGoals] = useState(false);
  const [customGoals, setCustomGoals] = useState(
    DISCIPLINES.map((d, i) => ({ discipline: d, required: REQUIREMENTS[d]?.required || 5, visible: true, order: i }))
  );
  const [editGoalsDraft, setEditGoalsDraft] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [newDisciplineName, setNewDisciplineName] = useState("");

  const updateField = (id, field, value) =>
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const toggleComplete = (id) =>
    setPatients((prev) => prev.map((p) => p.id === id ? { ...p, treatmentComplete: !p.treatmentComplete } : p));

  const addPatient = () => {
    if (!newPatient.chartNumber) return;
    const id = generateId(patients);
    setPatients((prev) => [...prev, {
      ...newPatient, id,
      visitLog: newPatient.lastVisit ? [{ date: newPatient.lastVisit, procedure: newPatient.procedure, notes: "Initial visit." }] : [],
    }]);
    setNewPatient(emptyPatient);
    setShowAddModal(false);
  };

  const logVisit = (id) => {
    if (!newVisit.date || !newVisit.procedure) return;
    setPatients((prev) => prev.map((p) =>
      p.id === id ? { 
        ...p, 
        lastVisit: newVisit.date, 
        procedure: newVisit.procedure, 
        nextAppt: newVisit.nextAppt || p.nextAppt,
        visitLog: [...(p.visitLog || []), { date: newVisit.date, procedure: newVisit.procedure, notes: newVisit.notes, cdtCode: newVisit.cdtCode || "" }] 
      } : p
    ));
    setNewVisit({ date: "", procedure: "", notes: "", nextAppt: "", cdtCode: "" });
    setNlpInput(""); setNlpParsed(null); setNlpError("");
    setShowLogModal(null);
  };

  // ── NLP via backend proxy ──
  const parseWithAI = async () => {
    if (!nlpInput.trim()) return;
    setNlpLoading(true); setNlpError(""); setNlpParsed(null);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a dental clinic assistant. Today is ${todayStr}. Extract visit info from this note and return ONLY valid JSON, no markdown, no backticks:
{
  "date": "YYYY-MM-DD — use today if 'today' mentioned, empty string if unclear",
  "procedure": "dental procedure name or empty string",
  "discipline": "one of: Comprehensive Care, Endodontics, Oral & Maxillofacial Surgery, Orthodontics, Pediatric Dentistry, Periodontics, Prosthodontics, Implant Dentistry, Dental Hygiene, Special Needs Dentistry, Oral Medicine & Pathology, General Dentistry",
  "nextAppt": "YYYY-MM-DD calculated from today if follow-up timeframe mentioned, empty string if not",
  "notes": "any additional context or empty string"
}
Note: "${nlpInput}"`
          }]
        })
      });
      const data = await response.json();
      const parsed = JSON.parse(data.content[0].text.trim());
      setNlpParsed(parsed);
      setNewVisit({ date: parsed.date || "", procedure: parsed.procedure || "", notes: parsed.notes || "", nextAppt: parsed.nextAppt || "" });
      if (parsed.discipline && showLogModal) updateField(showLogModal, "discipline", parsed.discipline);
      if (parsed.nextAppt && showLogModal) updateField(showLogModal, "nextAppt", parsed.nextAppt);
    } catch (err) {
      setNlpError("Couldn't parse that — please fill in the fields manually.");
      console.error("NLP error:", err);
    }
    setNlpLoading(false);
  };


  // ── AI Chat ──
  const [chatOpen, setChatOpen] = useState(false);
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    // Build velocity context
    const velocityContext = `Graduation date: ${graduationDateStr} (${daysToGraduation} days away). Current pace: ${visitsPerWeek.toFixed(1)} visits/week. Overall progress: ${totalCompleted}/${totalRequired} procedures (${velocityPct}%). ${onTrack ? "ON TRACK for graduation." : `AT RISK - projected to fall short by ${totalRemaining - projectedAdditional} procedures.`}${atRiskRequirements.length > 0 ? ` At-risk disciplines: ${atRiskRequirements.join(", ")}.` : ""}`;

    // Build caseload context (include full visit log per patient)
    const caseloadSummary = patients.map(p => {
      const completed = p.visitLog?.length || 0;
      const goal = customGoals.find(g => g.discipline === p.discipline);
      const required = goal?.required || 0;
      const visitHistory = (p.visitLog || []).map(v => `    • ${v.date}: ${v.procedure}${v.cdtCode ? ` (${v.cdtCode})` : ""}${v.notes ? ` — ${v.notes}` : ""}`).join("\n");
      const pred = predictCompletion(p);
      return `- ${p.chartNumber} (${p.id}): ${p.discipline}, ${completed}/${required} visits, last seen ${p.lastVisit || "never"}, next appt: ${p.nextAppt || "not scheduled"}, pre-auth: ${p.preAuth}, lab: ${p.labStatus}, status: ${calculateStatus(p)}${pred ? `, predicted completion: ${pred.date}` : ""}${visitHistory ? "\n  Visit history:\n" + visitHistory : ""}`;
    }).join("\n");

    const requirementsSummary = customGoals.filter(g => g.visible).map(g => {
      const completed = patients.filter(p => p.discipline === g.discipline).reduce((s, p) => s + (p.visitLog?.length || 0), 0);
      return `- ${g.discipline}: ${completed}/${g.required} complete`;
    }).join("\n");

    // Build calendar context — upcoming appointments + suggested slots
    const chatFmtDate = (d) => d.toISOString().split("T")[0];
    const upcomingAppts = patients
      .filter(p => p.nextAppt && p.nextAppt >= chatFmtDate(today))
      .sort((a, b) => a.nextAppt.localeCompare(b.nextAppt))
      .map(p => `- ${p.nextAppt}: ${p.chartNumber} (${p.procedure || p.discipline})`);
    const suggestedSlots = patients
      .filter(p => !p.treatmentComplete && !p.nextAppt)
      .map(p => {
        const pred = predictCompletion(p);
        if (!pred || !p.lastVisit) return null;
        const avgInterval = pred.avgInterval || 21;
        const suggested = new Date(new Date(p.lastVisit).getTime() + avgInterval * 86400000);
        return `- Suggested ~${chatFmtDate(suggested)}: Schedule ${p.chartNumber} (${p.discipline}, ${pred.visitsRemaining} visits remaining)`;
      }).filter(Boolean);

    // Build clinic schedule context
    const scheduleContext = Object.entries(clinicSchedule)
      .filter(([, s]) => s.enabled)
      .map(([day, s]) => `${day}: ${s.start}–${s.end}`)
      .join(", ");

    // Build notebook context
    const notebookContext = notes.map(n =>
      `- [${n.category}${n.pinned ? " 📌" : ""}] "${n.title}" (${n.updatedAt}): ${n.body?.slice(0, 200)}${n.body?.length > 200 ? "..." : ""}`
    ).join("\n");

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ClinIQ, an AI assistant for dental students at NYU College of Dentistry. You help students manage their patient caseload, calendar, notes, and graduation requirements. Today's date is ${chatFmtDate(today)}.

STUDENT PROFILE:
Name: ${user?.name}, Year: ${user?.year}

STUDENT'S CURRENT CASELOAD:
${caseloadSummary}

GRADUATION REQUIREMENT PROGRESS:
${requirementsSummary}

GRADUATION VELOCITY:
${velocityContext}

UPCOMING APPOINTMENTS (from calendar):
${upcomingAppts.length > 0 ? upcomingAppts.join("\n") : "No upcoming appointments scheduled."}

SUGGESTED APPOINTMENT SLOTS:
${suggestedSlots.length > 0 ? suggestedSlots.join("\n") : "No suggestions — all active patients have appointments scheduled."}

CLINIC SCHEDULE:
${scheduleContext || "No clinic days configured."}

NOTEBOOK NOTES:
${notebookContext || "No notes saved yet."}

CDT CODE KNOWLEDGE:
You understand ADA CDT codes and their discipline mappings:
- D0100-D0999: Diagnostic / Comprehensive Care
- D1000-D1999: Preventive / Dental Hygiene
- D2000-D2999: Restorative / General Dentistry
- D3000-D3999: Endodontics
- D4000-D4999: Periodontics
- D5000-D5899: Prosthodontics (removable)
- D6000-D6199: Implant Dentistry
- D6200-D6999: Prosthodontics (fixed)
- D7000-D7999: Oral & Maxillofacial Surgery
- D8000-D8999: Orthodontics
- D9000-D9999: Adjunctive / Comprehensive Care

NYU DENTISTRY POLICY GUIDANCE:
- All procedures must be documented with a CDT code for graduation requirement credit
- Pre-authorization is required for procedures over a certain fee threshold
- Patients must be seen within 60 days to maintain active status
- Treatment plans must be completed or formally transferred before graduation
- D3 students treat under supervision; D4 students have more clinical autonomy
- Roster reviews occur twice yearly with academic coordinators

RADIOGRAPHIC & DOCUMENTATION REQUIREMENTS BY PROCEDURE:

ENDODONTICS (D3000s):
- Root Canal (D3310/D3320/D3330): Requires preoperative periapical radiograph, working length radiograph (or electronic apex locator record), master cone radiograph, and final fill radiograph. Also requires pulp vitality testing notes and diagnosis documentation.
- Pulpotomy (D3220): Requires preoperative periapical radiograph and post-treatment radiograph.
- Apicoectomy (D3410): Requires preoperative periapical, surgical notes, and 6-month post-op radiograph.

PERIODONTICS (D4000s):
- Scaling & Root Planing (D4341/D4342): Requires full-mouth periodontal charting (6 points per tooth), radiographic bone level assessment (bitewings or periapicals within 12 months), and documentation of plaque/bleeding scores. Post-treatment charting required at re-evaluation (4-6 weeks after SRP).
- Periodontal Maintenance (D4910): Requires updated periodontal charting and current radiographs.
- Gingivectomy/Flap (D4210/D4240): Requires preoperative photos, periodontal charting, and surgical notes.

RESTORATIVE (D2000s):
- Crowns (D2740/D2750): Requires preoperative periapical radiograph, shade selection documentation, prep photos, and lab prescription. Post-cementation radiograph required.
- Composites/Amalgams: Requires preoperative bitewing radiographs showing caries, and documentation of cavity classification.

IMPLANTS (D6000s):
- Implant Placement (D6010): Requires preoperative CBCT or panoramic radiograph, implant placement record (torque, implant dimensions, position), and post-placement periapical radiograph. Medical history review required.
- Implant Crown (D6065): Requires periapical at time of restoration and torque documentation.

PROSTHODONTICS (D5000s/D6200s):
- Complete/Partial Dentures: Requires preoperative study models, photos, and jaw relation records. Post-insertion adjustments must be documented.
- Fixed Bridges (D6240): Requires periapical radiographs of abutment teeth and lab prescription.

ORAL SURGERY (D7000s):
- Simple Extraction (D7140): Requires preoperative periapical or panoramic radiograph and post-extraction notes.
- Surgical Extraction/Impacted (D7210/D7240): Requires panoramic radiograph, surgical notes including difficulty level, and post-op instructions given.

ORTHODONTICS (D8000s):
- Comprehensive Treatment (D8080/D8090): Requires preoperative records — panoramic, cephalometric radiograph, full-mouth photos (intraoral and extraoral), and study models.

PREVENTIVE/HYGIENE (D1000s):
- Prophylaxis (D1110/D1120): Requires periodontal screening and updated medical history.
- Sealants (D1351): Requires documentation of tooth number and surface sealed.

DIAGNOSTIC (D0000s):
- Full Mouth Series (D0210): 18-20 periapical and bitewing images. Required for comprehensive new patient exam.
- Periodic Exam (D0120): Requires updated radiographs per ADA guidelines — bitewings annually for high-risk, every 18-36 months for low-risk patients.

RESPONSE RULES — follow these strictly:
- Max 2-3 sentences for simple questions. Max 4-5 sentences for complex ones. Never more.
- Never use bullet points, headers, bold, or lists of any kind. Plain sentences only.
- Lead with the direct answer first, then add one line of context if needed. Never build up to the answer.
- If referencing patients, use chart numbers only. Never describe the full patient record.
- If asked about the calendar, give the date and patient — nothing else unless asked.
- If asked about a note, quote the relevant part briefly — don't summarize the whole note.
- Speak like a sharp colleague who respects your time. Confident, brief, useful.
- If you don't have enough info to answer, say so in one sentence and suggest what to check.`,
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      const reply = data.content[0].text;
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting. Please try again." }]);
    }
    setChatLoading(false);
  };

  // ── Auth ──
  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password || !loginForm.name) {
      setLoginError("Please fill in all fields.");
      return;
    }
    setUser({ name: loginForm.name, year: loginForm.year, email: loginForm.email });
    setLoginError("");
  };

  const handleLogout = () => {
    setUser(null);
    setLoginForm({ email: "", password: "", name: "", year: "D3" });
  };

  const exportRoster = () => {
    const rows = ["Patient ID,Nickname,Discipline,Last Visit,Next Appt,Treatment Start,Expected Completion,Status,Lab,Pre-Auth,Complete"];
    patients.forEach((p) => rows.push(`${p.id},${p.chartNumber},${p.discipline},${p.lastVisit},${p.nextAppt || "Not scheduled"},${p.treatmentStart || ""},${p.expectedCompletion || ""},${calculateStatus(p)},${p.labStatus},${p.preAuth},${p.treatmentComplete ? "Yes" : "No"}`));
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" })),
      download: "ClinIQ_Roster_Export.csv",
    });
    a.click();
  };

  const filtered = filter === "All" ? patients
    : filter === "Urgent" ? patients.filter(p => calculateUrgency(p))
    : patients.filter((p) => calculateStatus(p) === filter);

  const requirementProgress = Object.entries(REQUIREMENTS).map(([discipline, { required }]) => {
    const completed = patients.filter((p) => p.discipline === discipline).reduce((sum, p) => sum + (p.visitLog?.length || 0), 0);
    return { discipline, required, completed, pct: Math.min((completed / required) * 100, 100) };
  });

  const urgentPatients = patients.filter(p => calculateUrgency(p) && !p.treatmentComplete);

  const stats = [
    { label: "Total Patients", value: patients.length, color: NYU.purple, bg: NYU.purpleLight },
    { label: "Active", value: patients.filter((p) => calculateStatus(p) === "Active").length, color: NYU.green, bg: "#dcfce7" },
    { label: "Urgent / F/U Needed", value: urgentPatients.length, color: NYU.orange, bg: "#ffedd5" },
    { label: "Treatment Complete", value: patients.filter((p) => calculateStatus(p) === "Treatment Complete").length, color: NYU.purpleMid, bg: "#f3e8ff" },
    { label: "Pre-Auth Denied", value: patients.filter((p) => p.preAuth === "Denied").length, color: NYU.red, bg: "#fee2e2" },
  ];


  // ── Graduation Velocity ──
  const [graduationDateStr, setGraduationDateStr] = useState("2026-05-15");
  const graduationDate = new Date(graduationDateStr);
  const daysToGraduation = Math.floor((graduationDate - today) / 86400000);
  const weeksToGraduation = Math.max(1, Math.floor(daysToGraduation / 7));

  // Total visits logged in last 4 weeks
  const fourWeeksAgo = new Date(today - 28 * 86400000).toISOString().split("T")[0];
  const recentVisits = patients.flatMap(p => p.visitLog || []).filter(v => v.date >= fourWeeksAgo).length;
  const visitsPerWeek = recentVisits / 4;

  // Requirements analysis
  const totalRequired = customGoals.filter(g => g.visible).reduce((s, g) => s + g.required, 0);
  const totalCompleted = customGoals.filter(g => g.visible).reduce((s, g) => {
    return s + patients.filter(p => p.discipline === g.discipline).reduce((sum, p) => sum + (p.visitLog?.length || 0), 0);
  }, 0);
  const totalRemaining = Math.max(0, totalRequired - totalCompleted);
  const projectedAdditional = Math.floor(visitsPerWeek * weeksToGraduation);
  const onTrack = projectedAdditional >= totalRemaining;
  const velocityPct = Math.min(100, Math.round((totalCompleted / totalRequired) * 100));

  // Which requirements are at risk
  const atRiskRequirements = customGoals.filter(g => g.visible).filter(g => {
    const completed = patients.filter(p => p.discipline === g.discipline).reduce((s, p) => s + (p.visitLog?.length || 0), 0);
    const remaining = g.required - completed;
    const projectedForThis = Math.floor((completed / Math.max(totalCompleted, 1)) * projectedAdditional);
    return remaining > 0 && projectedForThis < remaining;
  }).map(g => g.discipline);

  // ── Login Screen ──
  if (!user) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f6fb 0%, #ede8f5 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 420 }}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${NYU.purple}, ${NYU.accent})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>C</span>
              </div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: NYU.gray900, letterSpacing: "-0.02em" }}>ClinIQ</h1>
              <p style={{ color: NYU.gray400, fontSize: 14, marginTop: 6 }}>NYU College of Dentistry · Clinical Caseload Manager</p>
            </div>

            {/* Login Card */}
            <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 8px 40px rgba(107,33,168,0.1)", border: `1px solid ${NYU.gray100}` }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, marginBottom: 6 }}>Sign in</h2>
              <p style={{ fontSize: 13, color: NYU.gray400, marginBottom: 24 }}>Use your NYU credentials to continue</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} placeholder="e.g. Whitney Johnson" value={loginForm.name} onChange={e => setLoginForm(p => ({...p, name: e.target.value}))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                <div>
                  <label style={labelStyle}>NYU Email</label>
                  <input style={inputStyle} type="email" placeholder="wj1234@nyu.edu" value={loginForm.email} onChange={e => setLoginForm(p => ({...p, email: e.target.value}))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm(p => ({...p, password: e.target.value}))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                <div>
                  <label style={labelStyle}>Student Year</label>
                  <select style={inputStyle} value={loginForm.year} onChange={e => setLoginForm(p => ({...p, year: e.target.value}))}>
                    <option>D2</option>
                    <option>D3</option>
                    <option>D4</option>
                  </select>
                </div>

                {loginError && (
                  <div style={{ background: NYU.redLight, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: NYU.red }}>{loginError}</div>
                )}

                <button className="action-btn" onClick={handleLogin} style={{ background: NYU.purple, color: "white", width: "100%", marginTop: 4, padding: "13px 20px", fontSize: 15 }}>
                  Sign In
                </button>
              </div>

              <p style={{ fontSize: 11, color: NYU.gray400, textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>
                For production use, this will authenticate via NYU SSO.<br/>Patient data is de-identified — no PHI is stored or transmitted.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: NYU.gray50 }}>

        {/* Top Header */}
        <div style={{ background: "white", borderBottom: `1px solid ${NYU.gray100}`, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={e => e.currentTarget.style.background = NYU.gray100}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="5" width="14" height="1.5" rx="0.75" fill={NYU.gray600} />
                  <rect x="3" y="9.25" width="14" height="1.5" rx="0.75" fill={NYU.gray600} />
                  <rect x="3" y="13.5" width="14" height="1.5" rx="0.75" fill={NYU.gray600} />
                </svg>
              </button>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: `linear-gradient(135deg, ${NYU.purple}, ${NYU.accent})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>C</span>
              </div>
              <span style={{ color: NYU.gray900, fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em" }}>ClinIQ</span>

              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 199 }} />
                  <div style={{ position: "absolute", top: 44, left: 0, background: "white", borderRadius: 14, boxShadow: "0 8px 32px rgba(87,6,140,0.15)", border: `1px solid ${NYU.gray100}`, width: 220, padding: "6px 0", zIndex: 200, animation: "slideUp 0.15s ease" }}>
                    {[
                      { label: "Patient Roster", icon: "📋", action: () => { setShowRosterPanel(true); setFilter("All"); setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"}); } },
                      { label: "Graduation Goals", icon: "🎓", action: () => { setShowGoalsPanel(true); setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"}); } },
                      { label: "Notebook", icon: "📓", action: () => { setTab("notebook"); setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"}); } },
                      { label: "Calendar", icon: "📅", action: () => { setTab("calendar"); setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"}); } },
                      { label: "Paired Provider View", icon: "🤝", action: () => { setShowPairedPanel(true); setMenuOpen(false); } },
                      { label: "Urgent Patients", icon: "⚠️", action: () => { setTab("roster"); setFilter("Urgent"); setMenuOpen(false); setShowUrgentPanel(true); window.scrollTo({top:0,behavior:"smooth"}); } },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: NYU.gray900, fontFamily: "'Inter', sans-serif", textAlign: "left" }}
                        onMouseEnter={e => e.currentTarget.style.background = NYU.gray50}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: NYU.gray100, margin: "4px 12px" }} />
                    {[
                      { label: "Add Patient", icon: "➕", action: () => { setShowAddModal(true); setMenuOpen(false); } },
                      { label: "Export Roster", icon: "📥", action: () => { exportRoster(); setMenuOpen(false); } },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: NYU.gray900, fontFamily: "'Inter', sans-serif", textAlign: "left" }}
                        onMouseEnter={e => e.currentTarget.style.background = NYU.gray50}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: NYU.gray100, margin: "4px 12px" }} />
                    <button onClick={() => { setSettingsDraft({ year: user.year, graduationDate: "2026-05-15", name: user.name }); setShowSettings(true); setMenuOpen(false); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: NYU.gray900, fontFamily: "'Inter', sans-serif", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.background = NYU.gray50}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <span style={{ fontSize: 15 }}>⚙️</span>Settings
                    </button>
                    <div style={{ height: 1, background: NYU.gray100, margin: "4px 12px" }} />
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: NYU.red, fontFamily: "'Inter', sans-serif", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.background = NYU.gray50}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <span style={{ fontSize: 15 }}>🚪</span>Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: NYU.gray400 }}>{user?.year} · {user?.name}</span>
              <button onClick={() => { setSettingsDraft({ year: user.year, graduationDate: graduationDateStr, name: user.name, clinicSchedule: JSON.parse(JSON.stringify(clinicSchedule)) }); setShowSettings(true); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: NYU.gray400, fontSize: 16 }} title="Settings">⚙️</button>
              <button onClick={handleLogout} style={{ background: NYU.gray100, border: "none", borderRadius: 99, padding: "5px 14px", cursor: "pointer", color: NYU.gray600, fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Sign Out</button>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: NYU.lavender, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: NYU.purple, fontSize: 13, fontWeight: 700 }}>{user?.name?.[0] || "?"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="page-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>

          {/* Page Header */}
          <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <p style={{ color: NYU.gray400, fontSize: 13, marginBottom: 2 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{tab === "notebook" ? "Notebook" : tab === "requirements" ? "Graduation Goals" : tab === "calendar" ? "Calendar" : "My Caseload"}</h1>
            </div>
            {tab !== "notebook" && tab !== "calendar" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="action-btn" onClick={exportRoster} style={{ background: NYU.gray100, color: NYU.gray600, fontSize: 12, padding: "8px 14px" }}>↓ Export</button>
                <button className="action-btn" onClick={() => setShowAddModal(true)} style={{ background: NYU.purple, color: "white", fontSize: 12, padding: "8px 16px" }}>+ Add Patient</button>
              </div>
            )}
          </div>

          {tab !== "notebook" && tab !== "calendar" && <>{/* Stats */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: `1px solid ${NYU.gray100}` }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: NYU.gray400, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>


</>}

          {tab !== "notebook" && tab !== "calendar" && <>{/* Graduation Velocity Banner */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: 24, background: onTrack ? NYU.lavender : NYU.redLight, border: `1px solid ${onTrack ? NYU.gray200 : '#fecaca'}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>🎓</span>
                  <span style={{ color: NYU.gray900, fontWeight: 700, fontSize: 15, fontFamily: "'Fraunces', serif" }}>Your Progress</span>
                  <span style={{ fontSize: 11, color: NYU.gray400, marginLeft: 4 }}>{daysToGraduation} days to go</span>
                </div>
                <div style={{ color: NYU.gray600, fontSize: 13, lineHeight: 1.5 }}>
                  {onTrack
                    ? `Great momentum — you're averaging ${visitsPerWeek.toFixed(1)} visits/week and projected to meet your requirements by graduation.`
                    : `You're building your caseload — ${totalCompleted} of ${totalRequired} procedures complete. A few more patients this semester will get you on track.`
                  }
                </div>
                {atRiskRequirements.length > 0 && !onTrack && (
                  <div style={{ marginTop: 8, fontSize: 12, color: NYU.gray600 }}>
                    Disciplines to focus on: {atRiskRequirements.slice(0, 2).join(", ")}{atRiskRequirements.length > 2 ? ` and ${atRiskRequirements.length - 2} more` : ""}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ color: NYU.gray900, fontSize: 36, fontWeight: 700, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{velocityPct}%</div>
                <div style={{ color: NYU.gray400, fontSize: 11, marginTop: 2 }}>overall complete</div>
                <div style={{ marginTop: 10, width: 140, height: 6, borderRadius: 99, background: NYU.gray200, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${velocityPct}%`, background: onTrack ? NYU.green : NYU.red, transition: "width 0.6s ease" }} />
                </div>
              </div>
            </div>
          </div>

</>}

          {tab !== "notebook" && tab !== "calendar" && <>{/* AI Insights Panel */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: NYU.gray600 }}>✦ AI Insights</span>
              <span style={{ fontSize: 11, color: NYU.gray400 }}>for your caseload</span>
            </div>
            <div className="insights-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>

              {(() => {
                const noFollowUp = patients.filter(p => !p.nextAppt && !p.treatmentComplete);
                if (noFollowUp.length === 0) return null;
                return (
                  <div key="followup" className="card" style={{ padding: "16px 20px", borderLeft: `4px solid ${NYU.orange}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NYU.orange, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>⚠ Follow-up Needed</div>
                    <div style={{ fontSize: 14, color: NYU.gray900, lineHeight: 1.5 }}>
                      <strong>{noFollowUp.map(p => p.chartNumber).join(", ")}</strong> {noFollowUp.length === 1 ? "has" : "have"} no follow-up appointment scheduled — consider reaching out this week.
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const overdue = patients.filter(p => daysUntil(p.expectedCompletion) < 0 && !p.treatmentComplete);
                if (overdue.length === 0) return null;
                return (
                  <div key="overdue" className="card" style={{ padding: "16px 20px", borderLeft: `4px solid ${NYU.red}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NYU.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>⛔ Overdue</div>
                    <div style={{ fontSize: 14, color: NYU.gray900, lineHeight: 1.5 }}>
                      <strong>{overdue.map(p => p.chartNumber).join(", ")}</strong> {overdue.length === 1 ? "has" : "have"} passed {overdue.length === 1 ? "its" : "their"} treatment completion date — action required.
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const gaps = requirementProgress.filter(r => r.pct < 30 && r.completed > 0);
                if (gaps.length === 0) return null;
                const worst = gaps.sort((a, b) => a.pct - b.pct)[0];
                return (
                  <div key="gap" className="card" style={{ padding: "16px 20px", borderLeft: `4px solid ${NYU.amber}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NYU.amber, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>📋 Requirement Gap</div>
                    <div style={{ fontSize: 14, color: NYU.gray900, lineHeight: 1.5 }}>
                      Your <strong>{worst.discipline}</strong> requirement is only {Math.round(worst.pct)}% complete — you need {worst.required - worst.completed} more {worst.required - worst.completed === 1 ? "case" : "cases"} to meet this goal.
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const close = requirementProgress.filter(r => r.pct >= 60 && r.pct < 100);
                if (close.length === 0) return null;
                const nearest = close.sort((a, b) => b.pct - a.pct)[0];
                return (
                  <div key="close" className="card" style={{ padding: "16px 20px", borderLeft: `4px solid ${NYU.green}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NYU.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>🎯 Almost There</div>
                    <div style={{ fontSize: 14, color: NYU.gray900, lineHeight: 1.5 }}>
                      You're <strong>{nearest.required - nearest.completed} case{nearest.required - nearest.completed !== 1 ? "s" : ""} away</strong> from completing your <strong>{nearest.discipline}</strong> requirement — keep going!
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const denied = patients.filter(p => p.preAuth === "Denied");
                if (denied.length === 0) return null;
                return (
                  <div key="denied" className="card" style={{ padding: "16px 20px", borderLeft: `4px solid ${NYU.red}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NYU.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>🚫 Pre-Auth Denied</div>
                    <div style={{ fontSize: 14, color: NYU.gray900, lineHeight: 1.5 }}>
                      <strong>{denied.map(p => p.chartNumber).join(", ")}</strong> {denied.length === 1 ? "has a" : "have"} denied pre-authorization — resubmission with additional documentation may be needed.
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const noFollowUp = patients.filter(p => !p.nextAppt && !p.treatmentComplete);
                const overdue = patients.filter(p => daysUntil(p.expectedCompletion) < 0 && !p.treatmentComplete);
                const denied = patients.filter(p => p.preAuth === "Denied");
                if (noFollowUp.length > 0 || overdue.length > 0 || denied.length > 0) return null;
                return (
                  <div key="allgood" className="card" style={{ padding: "16px 20px", borderLeft: `4px solid ${NYU.green}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NYU.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>✓ Caseload On Track</div>
                    <div style={{ fontSize: 14, color: NYU.gray900, lineHeight: 1.5 }}>
                      All patients have follow-up appointments scheduled and no urgent flags. Great work staying on top of your caseload!
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Urgent Banner */}
          {urgentPatients.length > 0 && (
            <div style={{ background: NYU.orangeLight, border: `1px solid #fed7aa`, borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: NYU.orange }}>{urgentPatients.length} patient{urgentPatients.length !== 1 ? "s" : ""} need urgent attention</div>
                <div style={{ fontSize: 12, color: NYU.gray600, marginTop: 2 }}>{urgentPatients.map(p => p.chartNumber).join(", ")}</div>
              </div>
              <button className="filter-btn" onClick={() => { setFilter("Urgent"); setTab("roster"); }} style={{ marginLeft: "auto", background: NYU.orange, color: "white" }}>View Urgent</button>
            </div>
          )}

</>}

          {/* Tab Nav */}
          <div style={{ borderBottom: `1.5px solid ${NYU.gray100}`, marginBottom: 24, display: "flex", gap: 0 }}>
            {[["roster", "👤  Patient Roster"], ["requirements", "🎓  Graduation Goals"], ["calendar", "📅  Calendar"], ["notebook", "📓  Notebook"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ background: "none", border: "none", borderBottom: tab === key ? `2px solid ${NYU.purple}` : "2px solid transparent", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: tab === key ? 600 : 400, padding: "10px 20px", marginBottom: -2, color: tab === key ? NYU.purple : NYU.gray400, transition: "all 0.15s" }}>{label}</button>
            ))}
          </div>

          {/* ROSTER TAB */}
          {tab === "roster" && (
            <>
              <div className="filter-row" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", overflowX: "auto", paddingBottom: 4 }}>
                {["All", "Active", "Urgent", "F/U Needed", "Complete"].map((f) => (
                  <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{ background: filter === f ? NYU.purple : NYU.gray100, color: filter === f ? "white" : NYU.gray600, border: "none", whiteSpace: "nowrap", fontSize: 12, padding: "6px 14px" }}>{f}</button>
                ))}
              </div>

              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: NYU.gray400 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>No patients in this category</div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map((patient) => {
                  const status = calculateStatus(patient);
                  const meta = STATUS_META[status] || { color: NYU.gray400, bg: NYU.gray100 };
                  const urgency = calculateUrgency(patient);
                  const daysToCompletion = daysUntil(patient.expectedCompletion);
                  const avatarMeta = DISCIPLINE_AVATAR[patient.discipline] || { bg: NYU.lavender, color: NYU.purple, initial: "??" };

                  return (
                    <div key={patient.id} onClick={() => setDetailPatient(patient.id)} style={{ background: "white", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: `1px solid ${urgency ? "#fed7aa" : NYU.gray100}`, transition: "all 0.18s", boxShadow: urgency ? "0 2px 12px rgba(194,65,12,0.08)" : "0 1px 3px rgba(107,33,168,0.05)" }}>
                      {/* Avatar */}
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: avatarMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: avatarMeta.color, letterSpacing: "0.04em" }}>{avatarMeta.initial}</span>
                        {urgency && <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: NYU.orange, border: "2px solid white" }} />}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <span style={{ fontWeight: 600, fontSize: 15, color: NYU.gray900 }}>{patient.chartNumber}</span>
                          <span style={{ fontSize: 10, color: NYU.gray400, fontWeight: 500 }}>{patient.id}</span>
                        </div>
                        <div style={{ fontSize: 12, color: NYU.gray400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {patient.procedure || "No procedure"} · {patient.discipline}
                        </div>
                        {patient.nextAppt && (
                          <div style={{ fontSize: 11, color: NYU.purple, marginTop: 3, fontWeight: 500 }}>
                            📅 {patient.nextAppt}
                          </div>
                        )}
                      </div>
                      {/* Right side */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: meta.bg, color: meta.color, fontWeight: 600, whiteSpace: "nowrap" }}>{status}</span>
                        {daysToCompletion !== null && !patient.treatmentComplete && (
                          <span style={{ fontSize: 11, color: daysToCompletion < 0 ? NYU.red : daysToCompletion <= 30 ? NYU.amber : NYU.gray400, fontWeight: 500 }}>
                            {daysToCompletion < 0 ? "Overdue" : `Due ${daysToCompletion}d`}
                          </span>
                        )}
                        <span style={{ color: NYU.gray200, fontSize: 16 }}>›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}


          {/* CALENDAR TAB */}
          {tab === "calendar" && (() => {

            const PROCEDURE_DURATIONS = {
              "Root Canal": 120, "Crown Prep": 90, "Implant Placement": 120,
              "Scaling & Root Planing": 90, "Extraction": 60, "Cleaning": 60,
              "Exam": 45, "Consultation": 30, "default": 60,
            };

            // ── helpers ──
            const startOfWeek = (d) => {
              const day = new Date(d);
              const diff = day.getDate() - day.getDay() + (day.getDay() === 0 ? -6 : 1);
              day.setDate(diff); day.setHours(0,0,0,0); return day;
            };
            const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
            const fmt = (d) => d.toISOString().split("T")[0];
            const fmtDisplay = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const fmtMonth = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            const isToday = (d) => fmt(d) === fmt(new Date());
            const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

            const weekStart = startOfWeek(calDate);
            const weekDays = [0,1,2,3,4,5,6].map(i => addDays(weekStart, i));

            // ── Schedule helpers ──
            const DAY_NAMES = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
            const todaySchedule = (d) => clinicSchedule[DAY_NAMES[d.getDay()]] || { enabled: false, start: "09:00", end: "17:00" };
            const parseHour = (t) => parseInt(t.split(":")[0]);
            const getSessionsForDay = (d) => {
              const sched = todaySchedule(d);
              if (!sched.enabled) return [];
              const s = parseHour(sched.start);
              const e = parseHour(sched.end);
              const mid = Math.floor((s + e) / 2);
              return [
                { label: "Morning Session", start: s, end: mid },
                { label: "Afternoon Session", start: mid, end: e },
              ];
            };
            const CLINIC_SESSIONS = getSessionsForDay(weekDays[0]).length > 0
              ? getSessionsForDay(weekDays[0])
              : [{ label: "Morning Session", start: 9, end: 13 }, { label: "Afternoon Session", start: 13, end: 17 }];

            // Build paired provider appointment map
            const pairedApptMap = {};
            if (calCombinedView) {
              patients.filter(p => p.handoffPartner && p.shareCalendar !== false).forEach(p => {
                if (p.nextAppt) {
                  if (!pairedApptMap[p.nextAppt]) pairedApptMap[p.nextAppt] = [];
                  pairedApptMap[p.nextAppt].push({ chartNumber: p.chartNumber, procedure: p.procedure, discipline: p.discipline, provider: p.handoffPartner, providerYear: p.handoffPartnerYear });
                }
              });
            }

            // Build appointment map: date -> list of appt objects
            const apptMap = {};
            patients.forEach(p => {
              if (p.nextAppt) {
                if (!apptMap[p.nextAppt]) apptMap[p.nextAppt] = [];
                apptMap[p.nextAppt].push({
                  type: "confirmed",
                  patient: p,
                  duration: PROCEDURE_DURATIONS[p.procedure] || PROCEDURE_DURATIONS.default,
                  label: p.chartNumber,
                  sublabel: p.procedure || p.discipline,
                  color: NYU.purple,
                  bg: NYU.purpleLight,
                });
              }
            });

            // Suggested slots — patients whose predicted next visit falls within 2 weeks
            patients.filter(p => !p.treatmentComplete && !p.nextAppt).forEach(p => {
              const pred = predictCompletion(p);
              if (!pred) return;
              const avgInterval = pred.avgInterval || 21;
              const lastVisit = p.lastVisit ? new Date(p.lastVisit) : null;
              if (!lastVisit) return;
              const suggestedDate = fmt(addDays(lastVisit, avgInterval));
              if (!apptMap[suggestedDate]) apptMap[suggestedDate] = [];
              apptMap[suggestedDate].push({
                type: "suggested",
                patient: p,
                duration: PROCEDURE_DURATIONS[p.procedure] || PROCEDURE_DURATIONS.default,
                label: `Schedule ${p.chartNumber}`,
                sublabel: `Suggested · ${p.discipline}`,
                color: NYU.purpleMid,
                bg: "#f3e8ff",
              });
            });

            const gradDateStr = graduationDateStr;

            // Month helpers
            const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
            const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
            const monthStart = startOfMonth(calDate);
            const firstDayOfWeek = (monthStart.getDay() + 6) % 7; // Mon=0
            const totalDays = daysInMonth(calDate);

            const ApptChip = ({ appt, compact }) => (
              <div onClick={() => { setDetailPatient(appt.patient.id); }} style={{ background: appt.bg, borderLeft: `3px solid ${appt.color}`, borderRadius: 6, padding: compact ? "2px 6px" : "5px 8px", marginBottom: 3, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <div style={{ fontSize: compact ? 10 : 11, fontWeight: 700, color: appt.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {appt.type === "suggested" ? "💡 " : "📌 "}{appt.label}
                </div>
                {!compact && <div style={{ fontSize: 10, color: NYU.gray400, marginTop: 1 }}>{appt.sublabel}</div>}
              </div>
            );

            return (
              <div>
                {/* Calendar toolbar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => setCalDate(d => calView === "week" ? addDays(d, -7) : new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                      style={{ background: NYU.gray100, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                    <span style={{ fontWeight: 700, fontSize: 15, color: NYU.gray900, minWidth: 180, textAlign: "center" }}>
                      {calView === "week"
                        ? `${fmtDisplay(weekDays[0])} — ${fmtDisplay(weekDays[4])}`
                        : fmtMonth(calDate)}
                    </span>
                    <button onClick={() => setCalDate(d => calView === "week" ? addDays(d, 7) : new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                      style={{ background: NYU.gray100, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                    <button onClick={() => setCalDate(new Date())} style={{ background: NYU.lavender, border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: NYU.purple, fontFamily: "'Inter', sans-serif" }}>Today</button>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {/* Week/Month toggle */}
                    <div style={{ display: "flex", background: NYU.gray100, borderRadius: 10, padding: 3 }}>
                      {["week", "month"].map(v => (
                        <button key={v} onClick={() => setCalView(v)} style={{ background: calView === v ? "white" : "transparent", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: calView === v ? NYU.purple : NYU.gray400, fontFamily: "'Inter', sans-serif", boxShadow: calView === v ? "0 1px 4px rgba(107,33,168,0.1)" : "none", transition: "all 0.15s" }}>
                          {v === "week" ? "Week" : "Month"}
                        </button>
                      ))}
                    </div>
                    {/* Combined view — only if paired providers exist */}
                    {patients.some(p => p.handoffPartner) && (
                      <button onClick={() => setCalCombinedView(!calCombinedView)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 10, border: `1px solid ${calCombinedView ? "#0ea5e9" : NYU.gray200}`, background: calCombinedView ? "#e0f2fe" : "white", color: calCombinedView ? "#0369a1" : NYU.gray400, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif", transition: "all 0.15s" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ea5e9", display: "inline-block" }} />
                        Combined
                      </button>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                  {[
                    { color: NYU.purple, bg: NYU.purpleLight, label: "Confirmed appointment" },
                    { color: NYU.purpleMid, bg: "#f3e8ff", label: "Suggested — schedule soon" },
                    { color: NYU.green, bg: NYU.greenLight, label: "Available slot" },
                    { color: "#b45309", bg: "#fef3c7", label: "Graduation deadline" },
                  ].concat(calCombinedView ? [{ color: "#0ea5e9", bg: "#e0f2fe", label: "Paired provider" }] : []).map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                      <span style={{ fontSize: 11, color: NYU.gray600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* ── WEEK VIEW ── */}
                {calView === "week" && (
                  <div style={{ background: "white", borderRadius: 16, border: `1px solid ${NYU.gray100}`, overflow: "hidden" }}>
                    {/* Day headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", borderBottom: `1px solid ${NYU.gray100}` }}>
                      <div style={{ padding: "10px 0", borderRight: `1px solid ${NYU.gray100}` }} />
                      {weekDays.map((d, i) => (
                        <div key={i} style={{ padding: "10px 12px", borderRight: i < 4 ? `1px solid ${NYU.gray100}` : "none", background: isToday(d) ? NYU.lavender : "white" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: isToday(d) ? NYU.purple : NYU.gray900, fontFamily: "'Fraunces', serif", lineHeight: 1.2 }}>
                            {d.getDate()}
                          </div>
                          {fmt(d) === gradDateStr && (
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#b45309", background: "#fef3c7", borderRadius: 99, padding: "1px 8px", marginTop: 2, display: "inline-block" }}>🎓 Graduation</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Sessions */}
                    {CLINIC_SESSIONS.map((session, si) => (
                      <div key={si} style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", borderBottom: si < CLINIC_SESSIONS.length - 1 ? `1px solid ${NYU.gray100}` : "none" }}>
                        {/* Time label */}
                        <div style={{ padding: "12px 8px", borderRight: `1px solid ${NYU.gray100}`, background: NYU.gray50 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.4 }}>
                            {session.label.split(" ")[0]}<br/>{session.label.split(" ")[1]}
                          </div>
                          <div style={{ fontSize: 10, color: NYU.gray400, marginTop: 4 }}>{session.start}:00–{session.end}:00</div>
                        </div>
                        {/* Day cells */}
                        {weekDays.map((d, di) => {
                          const dateStr = fmt(d);
                          const dayAppts = (apptMap[dateStr] || []);
                          const hasAppt = dayAppts.length > 0;
                          const isGrad = dateStr === gradDateStr;
                          const daySched = todaySchedule(d);
                          const dayDisabled = !daySched.enabled;
                          return (
                            <div key={di} style={{ padding: "10px 8px", borderRight: di < 6 ? `1px solid ${NYU.gray100}` : "none", minHeight: 90, background: dayDisabled ? NYU.gray50 : isToday(d) ? "#fdfcff" : "white", position: "relative" }}>
                              {dayDisabled && <div style={{ fontSize: 10, color: NYU.gray200, fontStyle: "italic" }}>No clinic</div>}
                              {!dayDisabled && daySched && <div style={{ fontSize: 9, color: NYU.gray400, marginBottom: 4 }}>{daySched.start}–{daySched.end}</div>}
                              {isGrad && (
                                <div style={{ background: "#fef3c7", borderLeft: `3px solid #b45309`, borderRadius: 6, padding: "4px 8px", marginBottom: 4 }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: "#b45309" }}>🎓 Graduation Day</div>
                                </div>
                              )}
                              {dayAppts.map((appt, ai) => <ApptChip key={ai} appt={appt} compact={false} />)}
                              {calCombinedView && (pairedApptMap[dateStr] || []).length > 0 && (
                                <div>
                                  {(pairedApptMap[dateStr] || []).map((a, ai) => (
                                    <div key={"paired"+ai} style={{ background: "#e0f2fe", borderLeft: "3px solid #0ea5e9", borderRadius: 8, padding: "4px 8px", marginBottom: 3, fontSize: 11 }}>
                                      <div style={{ fontWeight: 700, color: "#0369a1", fontSize: 10 }}>@{a.provider} · {a.providerYear}</div>
                                      <div style={{ color: "#0284c7", fontSize: 10 }}>{a.chartNumber}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {!hasAppt && !isGrad && !(calCombinedView && (pairedApptMap[dateStr] || []).length > 0) && (
                                <div style={{ fontSize: 10, color: NYU.gray200, fontStyle: "italic", marginTop: 4 }}>Available</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── MONTH VIEW ── */}
                {calView === "month" && (
                  <div style={{ background: "white", borderRadius: 16, border: `1px solid ${NYU.gray100}`, overflow: "hidden" }}>
                    {/* Weekday headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${NYU.gray100}` }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                        <div key={d} style={{ padding: "10px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</div>
                      ))}
                    </div>
                    {/* Day grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                      {/* Empty cells before month starts */}
                      {Array(firstDayOfWeek).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} style={{ minHeight: 100, borderRight: `1px solid ${NYU.gray100}`, borderBottom: `1px solid ${NYU.gray100}`, background: NYU.gray50 }} />
                      ))}
                      {Array(totalDays).fill(null).map((_, i) => {
                        const dayNum = i + 1;
                        const d = new Date(calDate.getFullYear(), calDate.getMonth(), dayNum);
                        const dateStr = fmt(d);
                        const dayAppts = apptMap[dateStr] || [];
                        const isGrad = dateStr === gradDateStr;
                        const todayFlag = isToday(d);
                        const weekend = isWeekend(d);
                        const colIndex = (firstDayOfWeek + i) % 7;
                        return (
                          <div key={dayNum} style={{ minHeight: 100, padding: "6px 6px 8px", borderRight: colIndex < 6 ? `1px solid ${NYU.gray100}` : "none", borderBottom: `1px solid ${NYU.gray100}`, background: todayFlag ? "#fdfcff" : weekend ? NYU.gray50 : "white" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: todayFlag ? NYU.purple : weekend ? NYU.gray400 : NYU.gray900, marginBottom: 4, width: 24, height: 24, borderRadius: "50%", background: todayFlag ? NYU.lavender : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {dayNum}
                            </div>
                            {isGrad && (
                              <div style={{ background: "#fef3c7", borderLeft: `3px solid #b45309`, borderRadius: 4, padding: "2px 5px", marginBottom: 3 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "#b45309" }}>🎓 Graduation</div>
                              </div>
                            )}
                            {dayAppts.slice(0, 2).map((appt, ai) => <ApptChip key={ai} appt={appt} compact={true} />)}
                            {dayAppts.length > 2 && (
                              <div style={{ fontSize: 10, color: NYU.purple, fontWeight: 600, marginTop: 2 }}>+{dayAppts.length - 2} more</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upcoming appointments list */}
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NYU.gray600, marginBottom: 12 }}>📋 Upcoming & Suggested</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {Object.entries(apptMap)
                      .filter(([date]) => date >= fmt(new Date()))
                      .sort(([a], [b]) => a.localeCompare(b))
                      .slice(0, 8)
                      .map(([date, appts]) => (
                        <div key={date} style={{ background: "white", borderRadius: 14, padding: "14px 18px", border: `1px solid ${NYU.gray100}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                          <div style={{ flexShrink: 0, textAlign: "center", minWidth: 44 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: NYU.gray400, textTransform: "uppercase" }}>
                              {new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>
                              {new Date(date + "T12:00:00").getDate()}
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            {appts.map((appt, i) => (
                              <div key={i} onClick={() => setDetailPatient(appt.patient.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < appts.length - 1 ? `1px solid ${NYU.gray100}` : "none", cursor: "pointer" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: appt.color, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                  <span style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900 }}>{appt.label}</span>
                                  <span style={{ fontSize: 12, color: NYU.gray400, marginLeft: 8 }}>{appt.sublabel}</span>
                                </div>
                                <span style={{ fontSize: 11, color: NYU.gray400 }}>{appt.duration} min</span>
                                {appt.type === "suggested" && (
                                  <span style={{ fontSize: 10, fontWeight: 600, color: NYU.purpleMid, background: "#f3e8ff", borderRadius: 99, padding: "2px 8px" }}>Suggested</span>
                                )}
                                {appt.type === "confirmed" && (
                                  <span style={{ fontSize: 10, fontWeight: 600, color: NYU.green, background: NYU.greenLight, borderRadius: 99, padding: "2px 8px" }}>Confirmed</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    {Object.entries(apptMap).filter(([date]) => date >= fmt(new Date())).length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px 20px", color: NYU.gray400 }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>No upcoming appointments</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>Log next appointments on patient records to see them here</div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}


          {/* NOTEBOOK TAB */}
          {tab === "notebook" && (
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

              {/* Left sidebar — note list */}
              <div style={{ width: 280, flexShrink: 0 }}>
                {/* Search + New */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <input
                    style={{ ...inputStyle, fontSize: 13, padding: "8px 12px", flex: 1 }}
                    placeholder="Search notes..."
                    value={noteSearch}
                    onChange={e => setNoteSearch(e.target.value)}
                  />
                  <button className="action-btn" onClick={() => {
                    const id = `n${Date.now()}`;
                    const newNote = { id, title: "Untitled", body: "", category: "General", pinned: false, updatedAt: new Date().toISOString().split("T")[0] };
                    setNotes(prev => [newNote, ...prev]);
                    setActiveNote(id);
                    setNoteDraft(newNote);
                  }} style={{ background: NYU.purple, color: "white", padding: "8px 14px", fontSize: 13, flexShrink: 0 }}>+ New</button>
                </div>

                {/* Pinned */}
                {notes.filter(n => n.pinned).length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Pinned</div>
                    {notes.filter(n => n.pinned && (!noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.body.toLowerCase().includes(noteSearch.toLowerCase()))).map(note => (
                      <NoteCard key={note.id} note={note} active={activeNote === note.id} onClick={() => { setActiveNote(note.id); setNoteDraft({...note}); }} />
                    ))}
                  </div>
                )}

                {/* All notes */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>All Notes</div>
                  {notes.filter(n => !n.pinned && (!noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.body.toLowerCase().includes(noteSearch.toLowerCase()))).length === 0 && (
                    <div style={{ fontSize: 13, color: NYU.gray400, textAlign: "center", padding: "24px 0" }}>No notes yet</div>
                  )}
                  {notes.filter(n => !n.pinned && (!noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.body.toLowerCase().includes(noteSearch.toLowerCase()))).map(note => (
                    <NoteCard key={note.id} note={note} active={activeNote === note.id} onClick={() => { setActiveNote(note.id); setNoteDraft({...note}); }} />
                  ))}
                </div>
              </div>

              {/* Right — note editor */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {!activeNote || !noteDraft ? (
                  <div style={{ background: "white", borderRadius: 16, border: `1px solid ${NYU.gray100}`, padding: "80px 40px", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📓</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: NYU.gray900, marginBottom: 8 }}>Your Notebook</div>
                    <div style={{ fontSize: 13, color: NYU.gray400, marginBottom: 24, lineHeight: 1.6 }}>Jot down clinical thoughts, patient reminders,<br/>study notes — all in one place.</div>
                    <button className="action-btn" onClick={() => {
                      const id = `n${Date.now()}`;
                      const newNote = { id, title: "Untitled", body: "", category: "General", pinned: false, updatedAt: new Date().toISOString().split("T")[0] };
                      setNotes(prev => [newNote, ...prev]);
                      setActiveNote(id);
                      setNoteDraft(newNote);
                    }} style={{ background: NYU.purple, color: "white" }}>Create your first note</button>
                  </div>
                ) : (
                  <div style={{ background: "white", borderRadius: 16, border: `1px solid ${NYU.gray100}`, overflow: "hidden" }}>
                    {/* Note toolbar */}
                    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${NYU.gray100}`, display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Category selector */}
                      <select value={noteDraft.category} onChange={e => setNoteDraft(p => ({...p, category: e.target.value}))}
                        style={{ fontSize: 12, fontWeight: 600, border: "none", background: noteDraft.category === "Clinical" ? "#e0f2fe" : noteDraft.category === "Patient" ? "#f3e8ff" : noteDraft.category === "Study" ? "#d1fae5" : "#fef3c7", color: noteDraft.category === "Clinical" ? "#0369a1" : noteDraft.category === "Patient" ? "#6d28d9" : noteDraft.category === "Study" ? "#065f46" : "#92400e", borderRadius: 99, padding: "4px 12px", cursor: "pointer", outline: "none", fontFamily: "'Inter', sans-serif" }}>
                        <option>Clinical</option>
                        <option>Patient</option>
                        <option>Study</option>
                        <option>General</option>
                      </select>

                      {/* Pin toggle */}
                      <button onClick={() => setNoteDraft(p => ({...p, pinned: !p.pinned}))} style={{ background: noteDraft.pinned ? NYU.amberLight : NYU.gray100, border: "none", borderRadius: 99, padding: "4px 12px", cursor: "pointer", fontSize: 12, color: noteDraft.pinned ? NYU.amber : NYU.gray400, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                        {noteDraft.pinned ? "📌 Pinned" : "Pin"}
                      </button>

                      <div style={{ flex: 1 }} />

                      {/* Delete */}
                      <button onClick={() => { setNotes(prev => prev.filter(n => n.id !== activeNote)); setActiveNote(null); setNoteDraft(null); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: NYU.gray400, fontFamily: "'Inter', sans-serif", padding: "4px 8px" }}>Delete</button>

                      {/* Save */}
                      <button className="action-btn" onClick={() => {
                        const updated = { ...noteDraft, updatedAt: new Date().toISOString().split("T")[0] };
                        setNotes(prev => prev.map(n => n.id === activeNote ? updated : n));
                        setNoteDraft(updated);
                      }} style={{ background: NYU.purple, color: "white", padding: "7px 18px", fontSize: 13 }}>Save</button>
                    </div>

                    {/* Title */}
                    <input
                      style={{ width: "100%", fontSize: 24, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif", border: "none", outline: "none", padding: "24px 28px 8px", letterSpacing: "-0.01em" }}
                      placeholder="Untitled"
                      value={noteDraft.title}
                      onChange={e => setNoteDraft(p => ({...p, title: e.target.value}))}
                    />

                    {/* Updated at */}
                    <div style={{ fontSize: 11, color: NYU.gray400, paddingLeft: 28, paddingBottom: 12 }}>Last updated {noteDraft.updatedAt}</div>

                    {/* Body */}
                    <textarea
                      style={{ width: "100%", minHeight: 420, fontSize: 15, color: NYU.gray600, border: "none", outline: "none", padding: "0 28px 28px", resize: "none", lineHeight: 1.8, fontFamily: "'Inter', sans-serif", background: "transparent" }}
                      placeholder="Start writing... Use - for bullets, [ ] for checkboxes"
                      value={noteDraft.body}
                      onChange={e => setNoteDraft(p => ({...p, body: e.target.value}))}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* REQUIREMENTS TAB */}
          {tab === "requirements" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Header */}
              <div style={{ background: NYU.lavender, borderRadius: 16, padding: "20px 24px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${NYU.gray200}` }}>
                <div>
                  <div style={{ color: NYU.gray900, fontWeight: 700, fontSize: 16, fontFamily: "'Fraunces', serif" }}>Graduation Requirement Progress</div>
                  <div style={{ color: NYU.gray600, fontSize: 13, marginTop: 2 }}>
                    {editingGoals ? "Drag to reorder · Toggle visibility · Edit targets" : "Personalized to your clinical path"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {!editingGoals && (
                    <div style={{ textAlign: "right", marginRight: 12 }}>
                      <div style={{ color: "white", fontSize: 26, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>
                        {customGoals.filter(g => g.visible && (patients.filter(p => p.discipline === g.discipline).reduce((s, p) => s + (p.visitLog?.length || 0), 0) >= g.required)).length}
                        <span style={{ fontSize: 15, color: NYU.gray400, fontWeight: 400 }}>/{customGoals.filter(g => g.visible).length}</span>
                      </div>
                      <div style={{ color: NYU.gray400, fontSize: 12 }}>disciplines complete</div>
                    </div>
                  )}
                  {!editingGoals ? (
                    <button className="action-btn" onClick={() => { setEditGoalsDraft([...customGoals.map(g => ({...g}))]); setEditingGoals(true); }} style={{ background: "white", color: NYU.purple, fontSize: 13 }}>
                      ✎ Edit Goals
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="action-btn" onClick={() => { setEditingGoals(false); setEditGoalsDraft(null); }} style={{ background: "white", color: NYU.gray600, fontSize: 13 }}>Cancel</button>
                      <button className="action-btn" onClick={() => { setCustomGoals(editGoalsDraft); setEditingGoals(false); setEditGoalsDraft(null); }} style={{ background: NYU.green, color: "white", fontSize: 13 }}>✓ Save</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Mode */}
              {editingGoals && editGoalsDraft && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {editGoalsDraft.map((goal, index) => (
                    <div
                      key={goal.discipline + index}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex === null || dragIndex === index) return;
                        const updated = [...editGoalsDraft];
                        const [moved] = updated.splice(dragIndex, 1);
                        updated.splice(index, 0, moved);
                        setEditGoalsDraft(updated);
                        setDragIndex(null);
                      }}
                      className="card"
                      style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, opacity: goal.visible ? 1 : 0.45, cursor: "grab", border: dragIndex === index ? `2px dashed ${NYU.purple}` : "none" }}
                    >
                      <span style={{ fontSize: 18, color: NYU.gray400, cursor: "grab", userSelect: "none" }}>⠿</span>
                      <input
                        type="checkbox"
                        checked={goal.visible}
                        onChange={() => {
                          const updated = [...editGoalsDraft];
                          updated[index] = { ...updated[index], visible: !updated[index].visible };
                          setEditGoalsDraft(updated);
                        }}
                        style={{ width: 16, height: 16, accentColor: NYU.purple, cursor: "pointer" }}
                      />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: NYU.gray900 }}>{goal.discipline}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: NYU.gray400 }}>Target:</span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={goal.required}
                          onChange={(e) => {
                            const updated = [...editGoalsDraft];
                            updated[index] = { ...updated[index], required: parseInt(e.target.value) || 1 };
                            setEditGoalsDraft(updated);
                          }}
                          style={{ width: 56, padding: "5px 8px", borderRadius: 8, border: `1.5px solid ${NYU.gray200}`, fontSize: 14, fontWeight: 600, color: NYU.purple, textAlign: "center", fontFamily: "'Inter', sans-serif", outline: "none" }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Custom Discipline */}
                  <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, border: `1.5px dashed ${NYU.gray200}`, boxShadow: "none" }}>
                    <span style={{ fontSize: 18, color: NYU.gray200 }}>+</span>
                    <input
                      style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${NYU.gray200}`, fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none" }}
                      placeholder="Add custom discipline..."
                      value={newDisciplineName}
                      onChange={(e) => setNewDisciplineName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newDisciplineName.trim()) {
                          setEditGoalsDraft([...editGoalsDraft, { discipline: newDisciplineName.trim(), required: 5, visible: true, order: editGoalsDraft.length }]);
                          setNewDisciplineName("");
                        }
                      }}
                    />
                    <button className="action-btn" onClick={() => {
                      if (!newDisciplineName.trim()) return;
                      setEditGoalsDraft([...editGoalsDraft, { discipline: newDisciplineName.trim(), required: 5, visible: true, order: editGoalsDraft.length }]);
                      setNewDisciplineName("");
                    }} style={{ background: NYU.purple, color: "white", padding: "7px 14px" }}>Add</button>
                  </div>
                </div>
              )}

              {/* Normal View */}
              {!editingGoals && customGoals.filter(g => g.visible).map((goal) => {
                const completed = patients.filter(p => p.discipline === goal.discipline).reduce((s, p) => s + (p.visitLog?.length || 0), 0);
                const pct = Math.min((completed / goal.required) * 100, 100);
                const color = pct >= 100 ? NYU.green : pct >= 60 ? NYU.blue : pct >= 30 ? NYU.amber : NYU.red;
                const qualifyingPatients = patients.filter(p => p.discipline === goal.discipline && !p.treatmentComplete);
                return (
                  <div key={goal.discipline} className="card" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: NYU.gray900 }}>{goal.discipline}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {pct >= 100 && <span style={{ fontSize: 12, color: NYU.green, fontWeight: 600 }}>✓ Complete</span>}
                        {pct < 100 && <span style={{ fontSize: 12, color: NYU.gray400 }}>{goal.required - completed} remaining</span>}
                        <span style={{ fontSize: 13, fontWeight: 700, color }}>{completed}/{goal.required}</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    {qualifyingPatients.length > 0 && (
                      <div style={{ marginTop: 10, fontSize: 12, color: NYU.gray600 }}>
                        <span style={{ fontWeight: 600, color: NYU.purple }}>Active patients: </span>
                        {qualifyingPatients.map(p => p.chartNumber).join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* PATIENT ROSTER PANEL */}
      {showRosterPanel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 800, background: "#f8f6fb", overflowY: "auto", animation: "slideInRight 0.25s ease" }}>
          <div style={{ background: "white", borderBottom: `1px solid ${NYU.gray100}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
            <button onClick={() => setShowRosterPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NYU.gray600, padding: 0 }}>←</button>
            <span style={{ fontWeight: 600, fontSize: 16, color: NYU.gray900, flex: 1 }}>👤 Patient Roster</span>
            <button className="action-btn" onClick={() => { setShowAddModal(true); setShowRosterPanel(false); }} style={{ background: NYU.purple, color: "white", fontSize: 12, padding: "7px 16px" }}>+ Add Patient</button>
          </div>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 80px" }}>

            {/* Stats row */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: `1px solid ${NYU.gray100}` }}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: NYU.gray400, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filter row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {["All", "Active", "Urgent", "F/U Needed", "Complete"].map(f => (
                <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{ background: filter === f ? NYU.purple : NYU.gray100, color: filter === f ? "white" : NYU.gray600, border: "none", fontSize: 12, padding: "6px 14px" }}>{f}</button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: NYU.gray400 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>No patients in this category</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(patient => {
                const status = calculateStatus(patient);
                const meta = STATUS_META[status] || { color: NYU.gray400, bg: NYU.gray100 };
                const urgency = calculateUrgency(patient);
                const daysToCompletion = daysUntil(patient.expectedCompletion);
                const avatarMeta = DISCIPLINE_AVATAR[patient.discipline] || { bg: NYU.lavender, color: NYU.purple, initial: "??" };
                return (
                  <div key={patient.id} onClick={() => { setDetailPatient(patient.id); setShowRosterPanel(false); }} style={{ background: "white", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: `1px solid ${urgency ? "#fed7aa" : NYU.gray100}`, transition: "all 0.18s", boxShadow: urgency ? "0 2px 12px rgba(194,65,12,0.08)" : "0 1px 3px rgba(107,33,168,0.05)" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: avatarMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: avatarMeta.color, letterSpacing: "0.04em" }}>{avatarMeta.initial}</span>
                      {urgency && <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: NYU.orange, border: "2px solid white" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, fontSize: 15, color: NYU.gray900 }}>{patient.chartNumber}</span>
                        <span style={{ fontSize: 10, color: NYU.gray400, fontWeight: 500 }}>{patient.id}</span>
                      </div>
                      <div style={{ fontSize: 12, color: NYU.gray400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.procedure || "No procedure"} · {patient.discipline}</div>
                      {patient.handoffPartner && <div style={{ fontSize: 11, color: "#0369a1", marginTop: 2, fontWeight: 600 }}>🤝 @{patient.handoffPartner} · {patient.handoffPartnerYear}</div>}
                      {patient.nextAppt && <div style={{ fontSize: 11, color: NYU.purple, marginTop: 3, fontWeight: 500 }}>📅 {patient.nextAppt}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: meta.bg, color: meta.color, fontWeight: 600, whiteSpace: "nowrap" }}>{status}</span>
                      {daysToCompletion !== null && !patient.treatmentComplete && (
                        <span style={{ fontSize: 11, color: daysToCompletion < 0 ? NYU.red : daysToCompletion <= 30 ? NYU.amber : NYU.gray400, fontWeight: 500 }}>
                          {daysToCompletion < 0 ? "Overdue" : `Due ${daysToCompletion}d`}
                        </span>
                      )}
                      <span style={{ color: NYU.gray200, fontSize: 16 }}>›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* GRADUATION GOALS PANEL */}
      {showGoalsPanel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 800, background: "#f8f6fb", overflowY: "auto", animation: "slideInRight 0.25s ease" }}>
          <div style={{ background: "white", borderBottom: `1px solid ${NYU.gray100}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
            <button onClick={() => setShowGoalsPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NYU.gray600, padding: 0 }}>←</button>
            <span style={{ fontWeight: 600, fontSize: 16, color: NYU.gray900, flex: 1 }}>🎓 Graduation Goals</span>
            <button className="action-btn" onClick={() => { setEditGoalsDraft([...customGoals.map(g => ({...g}))]); setEditingGoals(true); setShowGoalsPanel(false); setTab("requirements"); }} style={{ background: "white", color: NYU.purple, border: `1.5px solid ${NYU.purple}`, fontSize: 12, padding: "7px 16px" }}>✎ Edit Goals</button>
          </div>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 80px" }}>

            {/* Velocity summary */}
            <div style={{ background: onTrack ? NYU.lavender : NYU.redLight, borderRadius: 16, padding: "20px 24px", marginBottom: 24, border: `1px solid ${onTrack ? NYU.gray200 : "#fecaca"}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: NYU.gray900, fontFamily: "'Fraunces', serif", marginBottom: 6 }}>
                  {onTrack ? "🎓 On track for graduation" : "📋 Caseload needs attention"}
                </div>
                <div style={{ fontSize: 13, color: NYU.gray600 }}>
                  {totalCompleted} of {totalRequired} procedures complete · {daysToGraduation} days remaining
                </div>
                {atRiskRequirements.length > 0 && (
                  <div style={{ fontSize: 12, color: NYU.gray600, marginTop: 6 }}>
                    Focus on: {atRiskRequirements.slice(0, 3).join(", ")}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{velocityPct}%</div>
                <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 4 }}>overall complete</div>
              </div>
            </div>

            {/* Requirements list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {customGoals.filter(g => g.visible).map(goal => {
                const completed = patients.filter(p => p.discipline === goal.discipline).reduce((s, p) => s + (p.visitLog?.length || 0), 0);
                const pct = Math.min((completed / goal.required) * 100, 100);
                const color = pct >= 100 ? NYU.green : pct >= 60 ? NYU.blue : pct >= 30 ? NYU.amber : NYU.red;
                const activePts = patients.filter(p => p.discipline === goal.discipline && !p.treatmentComplete);
                return (
                  <div key={goal.discipline} className="card" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: NYU.gray900 }}>{goal.discipline}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {pct >= 100 && <span style={{ fontSize: 12, color: NYU.green, fontWeight: 600 }}>✓ Complete</span>}
                        {pct < 100 && <span style={{ fontSize: 12, color: NYU.gray400 }}>{goal.required - completed} remaining</span>}
                        <span style={{ fontSize: 13, fontWeight: 700, color }}>{completed}/{goal.required}</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    {activePts.length > 0 && (
                      <div style={{ marginTop: 10, fontSize: 12, color: NYU.gray600 }}>
                        <span style={{ fontWeight: 600, color: NYU.purple }}>Active patients: </span>
                        {activePts.map(p => p.chartNumber).join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* URGENT PATIENTS PANEL */}
      {showUrgentPanel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 800, background: "#f8f6fb", overflowY: "auto", animation: "slideInRight 0.25s ease" }}>
          <div style={{ background: "white", borderBottom: `1px solid ${NYU.gray100}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
            <button onClick={() => { setShowUrgentPanel(false); setFilter("All"); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NYU.gray600, padding: 0 }}>←</button>
            <span style={{ fontWeight: 600, fontSize: 16, color: NYU.gray900, flex: 1 }}>⚠️ Urgent Patients</span>
            <span style={{ fontSize: 12, color: NYU.orange, fontWeight: 600, background: NYU.orangeLight, padding: "4px 12px", borderRadius: 99 }}>{urgentPatients.length} need attention</span>
          </div>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 80px" }}>

            {urgentPatients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, marginBottom: 8 }}>All clear!</div>
                <div style={{ fontSize: 14, color: NYU.gray400 }}>No patients need urgent attention right now.</div>
              </div>
            ) : (
              <>
                <div style={{ background: NYU.orangeLight, borderRadius: 16, padding: "16px 20px", marginBottom: 24, border: `1px solid #fed7aa` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: NYU.orange, marginBottom: 4 }}>Action required on {urgentPatients.length} patient{urgentPatients.length !== 1 ? "s" : ""}</div>
                  <div style={{ fontSize: 13, color: NYU.gray600 }}>Each patient below has at least one flag that needs your attention before your next clinic session.</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {urgentPatients.map(patient => {
                    const urgency = calculateUrgency(patient);
                    const avatarMeta = DISCIPLINE_AVATAR[patient.discipline] || { bg: NYU.lavender, color: NYU.purple, initial: "??" };
                    return (
                      <div key={patient.id} style={{ background: "white", borderRadius: 16, border: `1px solid #fed7aa`, overflow: "hidden", boxShadow: "0 2px 12px rgba(194,65,12,0.08)" }}>
                        {/* Patient row */}
                        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 46, height: 46, borderRadius: 14, background: avatarMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: avatarMeta.color, letterSpacing: "0.04em" }}>{avatarMeta.initial}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: NYU.gray900 }}>{patient.chartNumber}</div>
                            <div style={{ fontSize: 12, color: NYU.gray400, marginTop: 2 }}>{patient.procedure} · {patient.discipline}</div>
                          </div>
                          <button className="action-btn" onClick={() => { setDetailPatient(patient.id); setShowUrgentPanel(false); }} style={{ background: NYU.purple, color: "white", fontSize: 12, padding: "7px 16px" }}>View Patient →</button>
                        </div>
                        {/* Urgency flags */}
                        <div style={{ background: NYU.orangeLight, padding: "10px 20px", borderTop: `1px solid #fed7aa`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {urgency.map((reason, i) => (
                            <span key={i} style={{ fontSize: 11, fontWeight: 600, color: NYU.orange, background: "white", borderRadius: 99, padding: "3px 10px", border: `1px solid #fed7aa` }}>⚠ {reason}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* ADD PATIENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif" }}>Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: NYU.gray400 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Chart Number *</label>
                <input style={inputStyle} placeholder="e.g. 1047823" value={newPatient.chartNumber} onChange={(e) => setNewPatient((p) => ({ ...p, chartNumber: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Clinical Discipline</label>
                <select style={inputStyle} value={newPatient.discipline} onChange={(e) => setNewPatient((p) => ({ ...p, discipline: e.target.value }))}>
                  {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>First Procedure</label>
                <input style={inputStyle} placeholder="e.g. Initial Exam, Cleaning..." value={newPatient.procedure} onChange={(e) => setNewPatient((p) => ({ ...p, procedure: e.target.value }))} />
              </div>
              <div className="insights-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Treatment Start Date</label>
                  <input type="date" style={inputStyle} value={newPatient.treatmentStart} onChange={(e) => setNewPatient((p) => ({ ...p, treatmentStart: e.target.value, lastVisit: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Expected Completion</label>
                  <input type="date" style={inputStyle} value={newPatient.expectedCompletion} onChange={(e) => setNewPatient((p) => ({ ...p, expectedCompletion: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button className="action-btn" onClick={() => setShowAddModal(false)} style={{ flex: 1, background: "white", color: NYU.gray600, border: `1.5px solid ${NYU.gray200}` }}>Cancel</button>
                <button className="action-btn" onClick={addPatient} style={{ flex: 1, background: NYU.purple, color: "white" }}>Add Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG VISIT MODAL WITH NLP */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif" }}>Log New Visit</h2>
              <button onClick={() => setShowLogModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: NYU.gray400 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="nlp-box">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>✦</span>
                  <span style={{ color: "white", fontWeight: 600, fontSize: 13 }}>Describe your visit</span>
                  <span style={{ color: NYU.gray400, fontSize: 11, marginLeft: "auto" }}>AI will auto-fill the fields below</span>
                </div>
                <textarea rows={2} style={{ ...inputStyle, resize: "none", fontSize: 13 }} placeholder='e.g. "Saw Blue today, did a crown placement, follow up in 3 weeks"' value={nlpInput} onChange={(e) => setNlpInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); parseWithAI(); } }} />
                <button className="action-btn" onClick={parseWithAI} disabled={nlpLoading || !nlpInput.trim()} style={{ background: nlpLoading ? NYU.purpleMid : NYU.accent, color: "white", width: "100%", marginTop: 8, fontSize: 13 }}>
                  {nlpLoading ? <><span className="spinner" />Parsing your note...</> : "✦ Auto-fill from description"}
                </button>
                {nlpParsed && !nlpLoading && (
                  <div className="nlp-parsed">
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>✓ Fields auto-filled — review below</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {nlpParsed.date && <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", borderRadius: 99, padding: "2px 10px", fontWeight: 500 }}>📅 {nlpParsed.date}</span>}
                      {nlpParsed.procedure && <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", borderRadius: 99, padding: "2px 10px", fontWeight: 500 }}>🦷 {nlpParsed.procedure}</span>}
                      {nlpParsed.discipline && <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", borderRadius: 99, padding: "2px 10px", fontWeight: 500 }}>📋 {nlpParsed.discipline}</span>}
                      {nlpParsed.nextAppt && <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", borderRadius: 99, padding: "2px 10px", fontWeight: 500 }}>🔁 Follow-up {nlpParsed.nextAppt}</span>}
                    </div>
                  </div>
                )}
                {nlpError && <div style={{ background: "#fee2e2", borderRadius: 8, padding: "8px 12px", marginTop: 8, fontSize: 12, color: NYU.red }}>{nlpError}</div>}
              </div>

              <div style={{ borderTop: `1px solid ${NYU.gray100}`, paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Review & confirm</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Visit Date *</label>
                    <input type="date" style={inputStyle} value={newVisit.date} onChange={(e) => setNewVisit((v) => ({ ...v, date: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Procedure Completed *</label>
                    <input style={inputStyle} placeholder="e.g. Crown Placement, Scaling..." value={newVisit.procedure} onChange={(e) => setNewVisit((v) => ({ ...v, procedure: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>CDT Code <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <input style={inputStyle} placeholder="e.g. D3330, D4341..." value={newVisit.cdtCode}
                      onChange={(e) => {
                        const code = e.target.value.toUpperCase();
                        setNewVisit((v) => ({ ...v, cdtCode: code }));
                        if (CDT_CODES[code]) {
                          setNewVisit((v) => ({ ...v, cdtCode: code, procedure: CDT_CODES[code].procedure }));
                          if (showLogModal) updateField(showLogModal, "discipline", CDT_CODES[code].discipline);
                        }
                      }}
                    />
                    {newVisit.cdtCode && CDT_CODES[newVisit.cdtCode] && (
                      <div style={{ fontSize: 11, color: NYU.green, marginTop: 4, fontWeight: 500 }}>
                        ✓ {CDT_CODES[newVisit.cdtCode].procedure} — {CDT_CODES[newVisit.cdtCode].discipline}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Next Appointment</label>
                    <input type="date" style={inputStyle} value={newVisit.nextAppt} onChange={(e) => setNewVisit((v) => ({ ...v, nextAppt: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Visit Notes</label>
                    <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Optional notes from this visit..." value={newVisit.notes} onChange={(e) => setNewVisit((v) => ({ ...v, notes: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="action-btn" onClick={() => setShowLogModal(null)} style={{ flex: 1, background: "white", color: NYU.gray600, border: `1.5px solid ${NYU.gray200}` }}>Cancel</button>
                <button className="action-btn" onClick={() => logVisit(showLogModal)} disabled={!newVisit.date || !newVisit.procedure} style={{ flex: 1, background: NYU.purple, color: "white" }}>Save Visit</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ── Patient Detail Screen (slide-over) ── */}
      {detailPatient && (() => {
        const patient = patients.find(p => p.id === detailPatient);
        if (!patient) return null;
        const status = calculateStatus(patient);
        const meta = STATUS_META[status] || { color: NYU.gray400, bg: NYU.gray100 };
        const urgency = calculateUrgency(patient);
        const avatarMeta = DISCIPLINE_AVATAR[patient.discipline] || { bg: NYU.lavender, color: NYU.purple, initial: "??" };

        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 800, background: "#f8f6fb", overflowY: "auto", animation: "slideInRight 0.25s ease" }}>
            <style>{`@keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

            {/* Detail Header */}
            <div style={{ background: "white", borderBottom: `1px solid ${NYU.gray100}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
              <button onClick={() => { setDetailPatient(null); setSelectedVisit(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NYU.gray600, padding: 0 }}>←</button>
              <span style={{ fontWeight: 600, fontSize: 16, color: NYU.gray900, flex: 1 }}>Patient Detail</span>
              <button className="action-btn" onClick={() => { setShowLogModal(patient.id); setNewVisit({ date: "", procedure: "", notes: "", nextAppt: "", cdtCode: "" }); setNlpInput(""); setNlpParsed(null); setNlpError(""); }} style={{ background: NYU.purple, color: "white", fontSize: 12, padding: "7px 16px" }}>+ Log Visit</button>
            </div>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 80px" }}>

              {/* Patient Hero Card */}
              <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}`, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: avatarMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: avatarMeta.color, letterSpacing: "0.04em" }}>{avatarMeta.initial}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 20, color: NYU.gray900, fontFamily: "'Fraunces', serif" }}>{patient.chartNumber}</div>
                  <div style={{ fontSize: 13, color: NYU.gray400, marginTop: 2 }}>{patient.id} · {patient.discipline}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99, background: meta.bg, color: meta.color, fontWeight: 600 }}>{status}</span>
                    {urgency && <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99, background: NYU.orangeLight, color: NYU.orange, fontWeight: 600, marginLeft: 6 }}>⚠ Urgent</span>}
                  </div>
                </div>
              </div>

              {/* Urgency Banner */}
              {urgency && (
                <div style={{ background: NYU.orangeLight, border: `1px solid #fed7aa`, borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: NYU.orange, marginBottom: 6 }}>⚠ Action Required</div>
                  {urgency.map((r, i) => <div key={i} style={{ fontSize: 12, color: NYU.gray600, marginTop: 3 }}>· {r}</div>)}
                </div>
              )}

              {/* Chart Number */}
              <div style={{ background: NYU.lavender, borderRadius: 14, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: NYU.purple, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>AxiUm Chart Number</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NYU.gray900, letterSpacing: "0.05em" }}>{patient.chartNumber}</div>
                </div>
              </div>

              {/* Treatment Info */}
              {(() => {
                const prediction = predictCompletion(patient);
                return (
                  <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}` }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900, marginBottom: 14 }}>Treatment Info</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Discipline</div>
                        <select value={patient.discipline} onChange={(e) => updateField(patient.id, "discipline", e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: "8px 10px" }}>
                          {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Last Procedure</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: NYU.gray900, padding: "8px 0" }}>{patient.procedure || "—"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Treatment Start</div>
                        <input type="date" value={patient.treatmentStart || ""} onChange={(e) => updateField(patient.id, "treatmentStart", e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: "8px 10px" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Next Appointment</div>
                        {patient.nextAppt
                          ? <div style={{ fontSize: 14, fontWeight: 500, color: NYU.purple, padding: "8px 0" }}>📅 {patient.nextAppt}</div>
                          : <div style={{ fontSize: 13, color: NYU.gray400, padding: "8px 0" }}>Not scheduled</div>
                        }
                      </div>
                    </div>

                    {/* Predicted Completion */}
                    <div style={{ background: NYU.lavender, borderRadius: 12, padding: "12px 16px", border: `1px solid ${NYU.gray200}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 12 }}>🔮</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: NYU.purple, textTransform: "uppercase", letterSpacing: "0.06em" }}>Predicted Completion</span>
                      </div>
                      {prediction ? (
                        <>
                          <div style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif" }}>{prediction.date}</div>
                          <div style={{ fontSize: 11, color: NYU.gray600, marginTop: 4, lineHeight: 1.4 }}>{prediction.label}</div>
                          {prediction.avgInterval && <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 2 }}>Avg. visit interval: every {prediction.avgInterval} days</div>}
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: NYU.gray400 }}>
                          {patient.treatmentComplete ? "Treatment complete ✓" : "Log at least one visit to generate prediction"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Lab & Pre-Auth */}
              <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}` }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900, marginBottom: 14 }}>Lab & Pre-Auth</div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Lab Status</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {LAB_STATUSES.map((s) => { const m = LAB_META[s]; const active = patient.labStatus === s; return <button key={s} className="pill-btn" onClick={() => updateField(patient.id, "labStatus", s)} style={{ background: active ? m.color : NYU.gray100, color: active ? "white" : NYU.gray600 }}>{s}</button>; })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pre-Authorization</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {PREAUTH_STATUSES.map((s) => { const m = PREAUTH_META[s]; const active = patient.preAuth === s; return <button key={s} className="pill-btn" onClick={() => updateField(patient.id, "preAuth", s)} style={{ background: active ? m.color : NYU.gray100, color: active ? "white" : NYU.gray600 }}>{s}</button>; })}
                  </div>
                </div>
              </div>

              {/* Visit History */}
              <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900 }}>Visit History</div>
                  <span style={{ fontSize: 11, color: NYU.gray400 }}>{patient.visitLog?.length || 0} visit{(patient.visitLog?.length || 0) !== 1 ? "s" : ""}</span>
                </div>
                {(!patient.visitLog || patient.visitLog.length === 0) ? (
                  <div style={{ fontSize: 13, color: NYU.gray400, textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                    No visits logged yet
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 17, top: 8, bottom: 8, width: 2, background: NYU.gray100, borderRadius: 99 }} />
                    {[...patient.visitLog].sort((a, b) => new Date(b.date) - new Date(a.date)).map((v, i) => (
                      <div key={i} onClick={() => setSelectedVisit(selectedVisit === i ? null : i)}
                        style={{ display: "flex", gap: 14, marginBottom: 12, cursor: "pointer", position: "relative" }}>
                        {/* Timeline dot */}
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 0 ? NYU.purple : "white", border: `2px solid ${i === 0 ? NYU.purple : NYU.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                          <span style={{ fontSize: 11, color: i === 0 ? "white" : NYU.gray400, fontWeight: 600 }}>{patient.visitLog.length - i}</span>
                        </div>
                        {/* Visit card */}
                        <div style={{ flex: 1, background: selectedVisit === i ? NYU.lavender : NYU.gray50, borderRadius: 12, padding: "10px 14px", border: `1px solid ${selectedVisit === i ? NYU.gray200 : "transparent"}`, transition: "all 0.18s" }}>
                          {/* Overview row */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: NYU.gray900 }}>{v.procedure}</div>
                              <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 2 }}>{v.date}</div>
                            </div>
                            <span style={{ fontSize: 14, color: NYU.gray400, transition: "transform 0.18s", transform: selectedVisit === i ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                          </div>
                          {/* Expanded detail */}
                          {selectedVisit === i && (
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${NYU.gray200}`, animation: "slideUp 0.15s ease" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: v.notes ? 10 : 0 }}>
                                <div>
                                  <div style={{ fontSize: 10, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Date</div>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: NYU.gray900 }}>{v.date}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 10, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Procedure</div>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: NYU.gray900 }}>{v.procedure}</div>
                                </div>
                                {v.cdtCode && (
                                  <div>
                                    <div style={{ fontSize: 10, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>CDT Code</div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: NYU.purple }}>{v.cdtCode}</div>
                                  </div>
                                )}
                              </div>
                              {v.notes && (
                                <div>
                                  <div style={{ fontSize: 10, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Clinical Notes</div>
                                  <div style={{ fontSize: 13, color: NYU.gray600, lineHeight: 1.5, background: "white", borderRadius: 8, padding: "8px 10px" }}>{v.notes}</div>
                                </div>
                              )}
                              <div style={{ marginTop: 8, fontSize: 11, color: NYU.purple, fontWeight: 500 }}>Visit #{patient.visitLog.length - i} of {patient.visitLog.length}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}` }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900, marginBottom: 12 }}>Notes</div>
                <textarea rows={3} value={patient.notes} onChange={(e) => updateField(patient.id, "notes", e.target.value)} style={{ ...inputStyle, resize: "vertical", fontSize: 13 }} placeholder="Add notes about this patient..." />
              </div>


              {/* Paired Provider Section */}
              <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900 }}>🤝 Paired Provider</div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: patient.handoffPartner ? NYU.greenLight : NYU.gray100, color: patient.handoffPartner ? NYU.green : NYU.gray400, fontWeight: 600 }}>{patient.handoffPartner ? "Active" : "Not Assigned"}</span>
                </div>

                {/* Partner assignment */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Paired Provider Name</div>
                    <input style={inputStyle} placeholder="e.g. Marcus Reid" value={patient.handoffPartner || ""} onChange={e => updateField(patient.id, "handoffPartner", e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Year</div>
                    <select style={{ ...inputStyle, width: 80 }} value={patient.handoffPartnerYear || "D3"} onChange={e => updateField(patient.id, "handoffPartnerYear", e.target.value)}>
                      <option>D2</option><option>D3</option><option>D4</option>
                    </select>
                  </div>
                </div>



                {/* Shared Notes */}
                <div>
                  <div style={{ fontSize: 11, color: NYU.gray400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Shared Notes</div>
                  <textarea rows={3} style={{ ...inputStyle, resize: "vertical", fontSize: 13 }}
                    placeholder="Notes visible to your paired provider — treatment status, preferences, next steps..."
                    value={patient.handoffNotes || ""}
                    onChange={e => updateField(patient.id, "handoffNotes", e.target.value)}
                  />
                </div>

                {patient.handoffPartner && (
                  <div style={{ background: NYU.greenLight, borderRadius: 10, padding: "10px 14px", marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>✅</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NYU.green }}>Sharing active with @{patient.handoffPartner} ({patient.handoffPartnerYear})</span>
                  </div>
                )}
              </div>

              {/* Mark Complete */}
              <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", marginBottom: 16, border: `1px solid ${NYU.gray100}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900 }}>Treatment Complete</div>
                  <div style={{ fontSize: 12, color: NYU.gray400, marginTop: 2 }}>Mark when all treatment is finished</div>
                </div>
                <div onClick={() => updateField(patient.id, "treatmentComplete", !patient.treatmentComplete)} style={{ width: 48, height: 26, borderRadius: 99, background: patient.treatmentComplete ? NYU.green : NYU.gray200, cursor: "pointer", transition: "all 0.2s", position: "relative", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: patient.treatmentComplete ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── Floating Chat Bot ── */}
      {/* Chat Toggle Button */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000 }}>
        {chatOpen && (
          <div style={{
            position: "absolute", bottom: 72, right: 0,
            width: 360, height: 520,
            background: "white", borderRadius: 20,
            boxShadow: "0 8px 40px rgba(87,6,140,0.22), 0 2px 12px rgba(87,6,140,0.1)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            animation: "slideUp 0.2s ease"
          }}>

            {/* Chat Header */}
            <div style={{ background: `linear-gradient(135deg, ${NYU.purpleDeep}, ${NYU.accent})`, padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>✦</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>ClinIQ Assistant</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Powered by AI · Always available</div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>

            {/* Suggested Questions - only show if first message */}
            {chatMessages.length <= 1 && (
              <div style={{ padding: "12px 14px", background: NYU.gray50, borderBottom: `1px solid ${NYU.gray100}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: NYU.gray400, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Try asking</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    "What's on my calendar this week?",
                    "Which patients need follow-up?",
                    "Am I on track to graduate?",
                    "What did I note about PT-1047823?",
                  ].map((q) => (
                    <button key={q} onClick={() => setChatInput(q)} style={{ background: "white", border: `1px solid ${NYU.gray200}`, borderRadius: 99, padding: "4px 10px", fontSize: 11, color: NYU.purple, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{q}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: NYU.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>✦</span>
                    </div>
                  )}
                  <div style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user" ? NYU.purple : NYU.gray50,
                    color: msg.role === "user" ? "white" : NYU.gray900,
                    fontSize: 13,
                    lineHeight: 1.5,
                    border: msg.role === "assistant" ? `1px solid ${NYU.gray100}` : "none",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: NYU.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "white", fontSize: 11 }}>✦</span>
                  </div>
                  <div style={{ background: NYU.gray50, border: `1px solid ${NYU.gray100}`, borderRadius: "16px 16px 16px 4px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: NYU.purple, opacity: 0.5, animation: `bounce ${0.5 + i * 0.15}s ease-in-out infinite alternate` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 14px", borderTop: `1px solid ${NYU.gray100}`, display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                rows={1}
                style={{ ...inputStyle, flex: 1, resize: "none", fontSize: 13, padding: "8px 12px", lineHeight: 1.4 }}
                placeholder="Ask about patients, requirements, CDT codes..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
              />
              <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ background: NYU.purple, border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: (!chatInput.trim() || chatLoading) ? 0.5 : 1 }}>↑</button>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: `linear-gradient(135deg, ${NYU.purple}, ${NYU.accent})`,
            border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(137,0,225,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
            transform: chatOpen ? "rotate(45deg) scale(0.95)" : "scale(1)",
          }}
        >
          <span style={{ color: "white", fontSize: chatOpen ? 22 : 20, fontWeight: 700, lineHeight: 1 }}>
            {chatOpen ? "×" : "✦"}
          </span>
        </button>
      </div>


      {/* PAIRED PROVIDER SLIDE-IN PANEL */}
      {showPairedPanel && (
        <div onClick={() => setShowPairedPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 199 }} />
      )}
      {showPairedPanel && (
        <div style={{ position: "fixed", top: 0, right: 0, width: "100%", maxWidth: 460, height: "100vh", background: "white", zIndex: 200, boxShadow: "-4px 0 32px rgba(107,33,168,0.15)", overflowY: "auto", animation: "slideInRight 0.25s ease" }}>
          <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${NYU.gray100}`, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, background: "white", zIndex: 10 }}>
            <button onClick={() => setShowPairedPanel(false)} style={{ background: NYU.gray100, border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 16, fontFamily: "'Inter', sans-serif" }}>←</button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: NYU.gray900, fontFamily: "'Fraunces', serif" }}>Paired Provider View</div>
              <div style={{ fontSize: 12, color: NYU.gray400, fontFamily: "'Inter', sans-serif" }}>Shared patients and partner access</div>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            {(() => {
              const sharedPatients = patients.filter(p => p.handoffPartner);
              const needsPartner = patients.filter(p => !p.handoffPartner && !p.treatmentComplete);
              const partnerMap = {};
              sharedPatients.forEach(p => {
                const key = p.handoffPartner;
                if (!partnerMap[key]) partnerMap[key] = { name: p.handoffPartner, year: p.handoffPartnerYear, patients: [] };
                partnerMap[key].patients.push(p);
              });
              const partners = Object.values(partnerMap);

              return (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "Shared Patients", value: sharedPatients.length, color: NYU.green },
                      { label: "Partners", value: partners.length, color: NYU.purple },
                      { label: "Needs Partner", value: needsPartner.length, color: NYU.orange },
                    ].map(s => (
                      <div key={s.label} style={{ background: NYU.gray50, borderRadius: 12, padding: "14px 16px", textAlign: "center", border: `1px solid ${NYU.gray100}` }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Fraunces', serif" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {partners.length > 0 ? partners.map(partner => (
                    <div key={partner.name} style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: NYU.purple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 15, color: "white", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{partner.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: NYU.gray900, fontFamily: "'Inter', sans-serif" }}>{partner.name}</div>
                          <div style={{ fontSize: 12, color: NYU.purple, fontFamily: "'Inter', sans-serif" }}>{partner.year} · {partner.patients.length} shared patient{partner.patients.length !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                      {partner.patients.map(p => {
                        const av = DISCIPLINE_AVATAR[p.discipline] || { bg: NYU.lavender, color: NYU.purple, initial: "??" };
                        return (
                          <div key={p.id} style={{ background: "white", border: `1px solid ${NYU.gray100}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 10, background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: av.color, fontFamily: "'Inter', sans-serif" }}>{av.initial}</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: NYU.gray900, fontFamily: "'Inter', sans-serif" }}>{p.chartNumber}</div>
                                <div style={{ fontSize: 12, color: NYU.gray400, fontFamily: "'Inter', sans-serif" }}>{p.discipline} · {p.procedure || "No procedure"}</div>
                              </div>
                              <button className="action-btn" onClick={() => { setDetailPatient(p.id); setShowPairedPanel(false); setTab("roster"); }} style={{ background: NYU.lavender, color: NYU.purple, fontSize: 11 }}>View →</button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                              {[
                                { key: "shareCalendar", label: "📅 Next Appt", value: p.nextAppt || "Not scheduled" },
                                { key: "shareVisitHistory", label: "📋 Visits", value: `${p.visitLog?.length || 0} logged` },
                                { key: "shareTreatmentNotes", label: "📝 Procedure", value: p.procedure || "None" },
                                { key: "sharePreAuth", label: "📄 Pre-Auth", value: p.preAuth },
                              ].map(({ key, label, value }) => {
                                const shared = p[key] !== false;
                                return (
                                  <div key={key} onClick={() => updateField(p.id, key, !shared)}
                                    style={{ padding: "8px 10px", background: shared ? NYU.lavender : NYU.gray50, borderRadius: 8, cursor: "pointer", border: `1px solid ${shared ? NYU.purple + "22" : NYU.gray100}` }}>
                                    <div style={{ fontSize: 10, color: NYU.gray400, marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>{label} {shared ? "🔓" : "🔒"}</div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: shared ? NYU.gray900 : NYU.gray300, fontFamily: "'Inter', sans-serif" }}>{shared ? value : "Hidden"}</div>
                                  </div>
                                );
                              })}
                            </div>
                            {p.handoffNotes && (
                              <div style={{ marginTop: 8, padding: "8px 10px", background: NYU.lavender, borderRadius: 8, fontSize: 12, color: NYU.gray700, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>"{p.handoffNotes}"</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: NYU.gray400 }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>🤝</div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>No paired providers yet</div>
                      <div style={{ fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Open a patient and assign a paired provider to get started</div>
                    </div>
                  )}

                  {needsPartner.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: NYU.orange, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>⚠ No Partner Assigned</div>
                      {needsPartner.map(p => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "white", border: `1px solid ${NYU.gray100}`, borderRadius: 12, marginBottom: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: NYU.gray900, fontFamily: "'Inter', sans-serif" }}>{p.chartNumber}</div>
                            <div style={{ fontSize: 12, color: NYU.gray400, fontFamily: "'Inter', sans-serif" }}>{p.discipline}</div>
                          </div>
                          <button className="action-btn" onClick={() => { setDetailPatient(p.id); setShowPairedPanel(false); setTab("roster"); }} style={{ background: NYU.lavender, color: NYU.purple, fontSize: 11 }}>Assign →</button>
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

      {/* SETTINGS MODAL */}
      {showSettings && settingsDraft && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, fontFamily: "'Fraunces', serif" }}>Settings</h2>
                <p style={{ fontSize: 12, color: NYU.gray400, marginTop: 3 }}>Personalize your ClinIQ experience</p>
              </div>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: NYU.gray400 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Profile */}
              <div style={{ background: NYU.lavender, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NYU.purple, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Profile</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input style={inputStyle} value={settingsDraft.name} onChange={e => setSettingsDraft(p => ({...p, name: e.target.value}))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Student Year</label>
                    <select style={inputStyle} value={settingsDraft.year} onChange={e => setSettingsDraft(p => ({...p, year: e.target.value}))}>
                      <option>D2</option>
                      <option>D3</option>
                      <option>D4</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Graduation */}
              <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: `1px solid ${NYU.gray100}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NYU.purple, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Graduation</div>
                <div>
                  <label style={labelStyle}>Expected Graduation Date</label>
                  <input type="date" style={inputStyle} value={settingsDraft.graduationDate} onChange={e => setSettingsDraft(p => ({...p, graduationDate: e.target.value}))} />
                  <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 6 }}>
                    Used to calculate your graduation velocity and pace tracking.
                  </div>
                </div>
              </div>

              {/* Clinic Schedule */}
              <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", border: `1px solid ${NYU.gray100}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: NYU.purple, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Clinic Schedule</div>
                <div style={{ fontSize: 12, color: NYU.gray400, marginBottom: 14 }}>Set which days you have clinic and your hours. Used by the calendar.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(day => {
                    const sched = settingsDraft.clinicSchedule?.[day] || { enabled: false, start: "09:00", end: "17:00" };
                    return (
                      <div key={day} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Toggle */}
                        <div onClick={() => setSettingsDraft(p => ({ ...p, clinicSchedule: { ...p.clinicSchedule, [day]: { ...sched, enabled: !sched.enabled } } }))}
                          style={{ width: 36, height: 20, borderRadius: 99, background: sched.enabled ? NYU.purple : NYU.gray200, cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                          <div style={{ position: "absolute", top: 2, left: sched.enabled ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                        </div>
                        {/* Day name */}
                        <span style={{ fontSize: 13, fontWeight: 600, color: sched.enabled ? NYU.gray900 : NYU.gray400, width: 90, textTransform: "capitalize" }}>{day}</span>
                        {/* Time inputs */}
                        {sched.enabled ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                            <input type="time" value={sched.start}
                              onChange={e => setSettingsDraft(p => ({ ...p, clinicSchedule: { ...p.clinicSchedule, [day]: { ...sched, start: e.target.value } } }))}
                              style={{ ...inputStyle, padding: "5px 8px", fontSize: 12, flex: 1 }} />
                            <span style={{ fontSize: 12, color: NYU.gray400 }}>to</span>
                            <input type="time" value={sched.end}
                              onChange={e => setSettingsDraft(p => ({ ...p, clinicSchedule: { ...p.clinicSchedule, [day]: { ...sched, end: e.target.value } } }))}
                              style={{ ...inputStyle, padding: "5px 8px", fontSize: 12, flex: 1 }} />
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: NYU.gray200, fontStyle: "italic" }}>No clinic</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* App info */}
              <div style={{ background: NYU.gray50, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NYU.gray900 }}>ClinIQ</div>
                  <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 2 }}>NYU College of Dentistry · Capstone v1.0</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${NYU.purple}, ${NYU.accent})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>C</span>
                </div>
              </div>

            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="action-btn" onClick={() => setShowSettings(false)} style={{ flex: 1, background: "white", color: NYU.gray600, border: `1.5px solid ${NYU.gray200}` }}>Cancel</button>
              <button className="action-btn" onClick={() => {
                setUser(p => ({ ...p, name: settingsDraft.name, year: settingsDraft.year }));
                setGraduationDateStr(settingsDraft.graduationDate);
                if (settingsDraft.clinicSchedule) setClinicSchedule(settingsDraft.clinicSchedule);
                setShowSettings(false);
              }} style={{ flex: 1, background: NYU.purple, color: "white" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}