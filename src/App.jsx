import { useState } from "react";

const NYU = {
  purple: "#57068C",
  purpleDark: "#3d0466",
  purpleDeep: "#2a0047",
  purpleLight: "#f3e8ff",
  purpleMid: "#8b2fc9",
  accent: "#8900e1",
  white: "#ffffff",
  offWhite: "#faf9fb",
  gray50: "#f8f7fa",
  gray100: "#ede9f3",
  gray200: "#d4cce0",
  gray400: "#9b8fb0",
  gray600: "#5c5270",
  gray900: "#1a1225",
  green: "#16a34a",
  amber: "#d97706",
  red: "#dc2626",
  blue: "#2563eb",
  orange: "#ea580c",
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

// Urgency calculation
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
  nickname: "",
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
};

const initialPatients = [
  {
    id: "PT-001",
    nickname: "Blue",
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
    visitLog: [
      { date: "2026-02-10", procedure: "Root Canal", notes: "Initial treatment complete." },
    ],
  },
  {
    id: "PT-002",
    nickname: "Delta",
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
    visitLog: [
      { date: "2026-01-15", procedure: "Crown Prep", notes: "Sent to lab." },
    ],
  },
  {
    id: "PT-003",
    nickname: "Echo",
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
    visitLog: [
      { date: "2025-12-20", procedure: "Implant Placement", notes: "Stage 1 placed." },
    ],
  },
  {
    id: "PT-004",
    nickname: "Foxtrot",
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
    visitLog: [
      { date: "2026-02-01", procedure: "Scaling & Root Planing", notes: "Pre-auth denied." },
    ],
  },
  {
    id: "PT-005",
    nickname: "Golf",
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
    visitLog: [
      { date: "2026-01-05", procedure: "Extraction", notes: "Healing well." },
    ],
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${NYU.gray50}; font-family: 'DM Sans', sans-serif; }
  .card { background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(87,6,140,0.07), 0 4px 16px rgba(87,6,140,0.04); transition: box-shadow 0.2s; }
  .card:hover { box-shadow: 0 2px 8px rgba(87,6,140,0.12), 0 8px 24px rgba(87,6,140,0.06); }
  .patient-card { cursor: pointer; border-left: 4px solid transparent; transition: all 0.18s ease; }
  .pill-btn { border: none; border-radius: 99px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; padding: 4px 12px; transition: all 0.15s; }
  .pill-btn:hover { opacity: 0.85; }
  .filter-btn { border: none; border-radius: 99px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 7px 18px; transition: all 0.15s; }
  .action-btn { border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 9px 18px; transition: all 0.15s; border: none; }
  .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; padding: 10px 4px; margin-right: 24px; transition: all 0.15s; color: ${NYU.gray400}; }
  .tab-btn.active { color: ${NYU.purple}; border-bottom-color: ${NYU.purple}; font-weight: 600; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; outline: none; }
  input:focus, select:focus, textarea:focus { border-color: ${NYU.purpleMid} !important; box-shadow: 0 0 0 3px rgba(87,6,140,0.1); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(26,18,37,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease; }
  .modal-box { background: white; border-radius: 16px; padding: 28px; width: 90%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(87,6,140,0.18); animation: slideUp 0.2s ease; }
  .progress-bar { height: 8px; border-radius: 99px; background: ${NYU.gray100}; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
  .nlp-box { background: linear-gradient(135deg, ${NYU.purpleDeep}, ${NYU.purpleDark}); border-radius: 12px; padding: 16px; margin-bottom: 4px; }
  .nlp-parsed { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 12px 14px; margin-top: 8px; animation: slideUp 0.2s ease; }
  .urgency-banner { background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 8px; padding: 8px 12px; margin-top: 10px; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${NYU.gray50}; } ::-webkit-scrollbar-thumb { background: ${NYU.gray200}; border-radius: 3px; }
`;

const Badge = ({ label, meta }) => (
  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: meta.bg, color: meta.color, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
    {label}
  </span>
);

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: `1.5px solid ${NYU.gray200}`, fontSize: 14,
  color: NYU.gray900, background: "white", transition: "all 0.15s",
};

const labelStyle = {
  fontSize: 11, fontWeight: 600, color: NYU.gray600,
  textTransform: "uppercase", letterSpacing: "0.06em",
  display: "block", marginBottom: 6,
};

export default function App() {
  const [patients, setPatients] = useState(initialPatients);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("roster");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [showLogModal, setShowLogModal] = useState(null);
  const [newVisit, setNewVisit] = useState({ date: "", procedure: "", notes: "" });
  const [nlpInput, setNlpInput] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpParsed, setNlpParsed] = useState(null);
  const [nlpError, setNlpError] = useState("");

  const updateField = (id, field, value) =>
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const toggleComplete = (id) =>
    setPatients((prev) => prev.map((p) => p.id === id ? { ...p, treatmentComplete: !p.treatmentComplete } : p));

  const addPatient = () => {
    if (!newPatient.nickname) return;
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
      p.id === id ? { ...p, lastVisit: newVisit.date, procedure: newVisit.procedure, visitLog: [...(p.visitLog || []), { ...newVisit }] } : p
    ));
    setNewVisit({ date: "", procedure: "", notes: "" });
    setNlpInput(""); setNlpParsed(null); setNlpError("");
    setShowLogModal(null);
  };

  const parseWithAI = async () => {
    if (!nlpInput.trim()) return;
    setNlpLoading(true); setNlpError(""); setNlpParsed(null);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey || apiKey === "your_api_key_here") {
        throw new Error("API Key not configured. Please add VITE_ANTHROPIC_API_KEY to Secrets.");
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a dental clinic assistant. Today is ${todayStr}. Extract visit info from this note and return ONLY valid JSON, no markdown. 
Ensure the "discipline" matches one of the provided options exactly.
{
  "date": "YYYY-MM-DD or empty string",
  "procedure": "procedure name or empty string",
  "discipline": "one of: Comprehensive Care, Endodontics, Oral & Maxillofacial Surgery, Orthodontics, Pediatric Dentistry, Periodontics, Prosthodontics, Implant Dentistry, Dental Hygiene, Special Needs Dentistry, Oral Medicine & Pathology, General Dentistry",
  "nextAppt": "YYYY-MM-DD calculated from today if follow-up timeframe mentioned, or empty string",
  "notes": "additional notes or empty string"
}
Note: "${nlpInput}"`
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();
      const parsed = JSON.parse(data.content[0].text.trim());
      setNlpParsed(parsed);
      setNewVisit({ date: parsed.date || "", procedure: parsed.procedure || "", notes: parsed.notes || "" });
      if (parsed.discipline && showLogModal) updateField(showLogModal, "discipline", parsed.discipline);
      if (parsed.nextAppt && showLogModal) updateField(showLogModal, "nextAppt", parsed.nextAppt);
    } catch (err) {
      console.error("AI Parsing Error:", err);
      setNlpError(err.message || "Couldn't parse that — please fill in the fields manually.");
    }
    setNlpLoading(false);
  };

  const exportRoster = () => {
    const rows = ["Patient ID,Nickname,Discipline,Last Visit,Next Appt,Treatment Start,Expected Completion,Status,Lab,Pre-Auth,Complete"];
    patients.forEach((p) => rows.push(`${p.id},${p.nickname},${p.discipline},${p.lastVisit},${p.nextAppt || "Not scheduled"},${p.treatmentStart || ""},${p.expectedCompletion || ""},${calculateStatus(p)},${p.labStatus},${p.preAuth},${p.treatmentComplete ? "Yes" : "No"}`));
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" })),
      download: "ClinIQ_Roster_Export.csv",
    });
    a.click();
  };

  const filtered = filter === "All" ? patients : filter === "Urgent" ? patients.filter(p => calculateUrgency(p)) : patients.filter((p) => calculateStatus(p) === filter);

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

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: NYU.gray50 }}>

        {/* Top Nav */}
        <div style={{ background: NYU.purpleDeep, borderBottom: `3px solid ${NYU.accent}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: NYU.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 16, fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>C</span>
              </div>
              <span style={{ color: "white", fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}>ClinIQ</span>
              <span style={{ color: NYU.gray400, fontSize: 13, marginLeft: 4 }}>by NYU College of Dentistry</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: NYU.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>W</span>
              </div>
              <span style={{ color: NYU.gray200, fontSize: 13 }}>D3 · Spring 2026</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px" }}>

          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: NYU.gray900, fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Patient Caseload</h1>
              <p style={{ color: NYU.gray400, fontSize: 14, marginTop: 4 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="action-btn" onClick={exportRoster} style={{ background: "white", color: NYU.gray600, border: `1.5px solid ${NYU.gray200}` }}>↓ Export Roster</button>
              <button className="action-btn" onClick={() => setShowAddModal(true)} style={{ background: NYU.purple, color: "white" }}>+ Add Patient</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 }}>
            {stats.map((s) => (
              <div key={s.label} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: NYU.gray400, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                <div style={{ height: 3, borderRadius: 99, background: s.bg, marginTop: 10 }} />
              </div>
            ))}
          </div>

          {/* Urgent Banner */}
          {urgentPatients.length > 0 && (
            <div style={{ background: "#fff7ed", border: `1.5px solid #fed7aa`, borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: NYU.orange }}>
                  {urgentPatients.length} patient{urgentPatients.length !== 1 ? "s" : ""} need urgent attention
                </div>
                <div style={{ fontSize: 12, color: NYU.gray600, marginTop: 2 }}>
                  {urgentPatients.map(p => p.nickname).join(", ")}
                </div>
              </div>
              <button className="filter-btn" onClick={() => { setFilter("Urgent"); setTab("roster"); }} style={{ marginLeft: "auto", background: NYU.orange, color: "white" }}>View Urgent</button>
            </div>
          )}

          {/* Tabs */}
          <div style={{ borderBottom: `1.5px solid ${NYU.gray100}`, marginBottom: 24 }}>
            {[["roster", "Patient Roster"], ["requirements", "Graduation Requirements"]].map(([key, label]) => (
              <button key={key} className={`tab-btn ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>
            ))}
          </div>

          {/* ROSTER TAB */}
          {tab === "roster" && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {["All", "Active", "Urgent", "F/U Appt Needed", "Treatment Complete"].map((f) => (
                  <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{ background: filter === f ? (f === "Urgent" ? NYU.orange : NYU.purple) : "white", color: filter === f ? "white" : NYU.gray600, boxShadow: filter === f ? `0 2px 8px rgba(87,6,140,0.25)` : "0 1px 3px rgba(0,0,0,0.07)" }}>{f}</button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 13, color: NYU.gray400, alignSelf: "center" }}>{filtered.length} patient{filtered.length !== 1 ? "s" : ""}</span>
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
                  const isOpen = selected === patient.id;
                  const daysToCompletion = daysUntil(patient.expectedCompletion);

                  return (
                    <div key={patient.id} className="card patient-card" style={{ borderLeftColor: urgency ? NYU.orange : meta.color, overflow: "hidden" }}>
                      <div onClick={() => setSelected(isOpen ? null : patient.id)} style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", background: urgency ? "#ffedd5" : NYU.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: urgency ? NYU.orange : NYU.purple }}>{patient.nickname[0]}</span>
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontWeight: 600, fontSize: 15, color: NYU.gray900 }}>{patient.nickname}</span>
                              <span style={{ color: NYU.gray400, fontSize: 12, fontWeight: 500 }}>{patient.id}</span>
                              {urgency && <span style={{ fontSize: 11, color: NYU.orange, fontWeight: 600 }}>⚠ Urgent</span>}
                            </div>
                            <div style={{ fontSize: 12, color: NYU.gray400, marginTop: 2 }}>
                              {patient.discipline} · Last seen {patient.lastVisit || "—"} · {patient.procedure || "No procedure"}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {daysToCompletion !== null && !patient.treatmentComplete && (
                            <span style={{ fontSize: 11, color: daysToCompletion <= 14 ? NYU.red : daysToCompletion <= 30 ? NYU.amber : NYU.gray400, fontWeight: 500 }}>
                              {daysToCompletion < 0 ? "Overdue" : `Due in ${daysToCompletion}d`}
                            </span>
                          )}
                          <Badge label={status} meta={meta} />
                          <span style={{ color: NYU.gray200, fontSize: 14, marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{ padding: "0 20px 20px 20px", borderTop: `1px solid ${NYU.gray100}` }}>

                          {/* Urgency Banner */}
                          {urgency && (
                            <div className="urgency-banner" style={{ marginTop: 16 }}>
                              <div style={{ fontWeight: 600, fontSize: 12, color: NYU.orange, marginBottom: 4 }}>⚠ Urgent — Action Required</div>
                              {urgency.map((r, i) => (
                                <div key={i} style={{ fontSize: 12, color: NYU.gray600 }}>• {r}</div>
                              ))}
                            </div>
                          )}

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
                            <div>
                              <label style={labelStyle}>Clinical Discipline</label>
                              <select value={patient.discipline} onChange={(e) => updateField(patient.id, "discipline", e.target.value)} style={{ ...inputStyle, fontSize: 13 }}>
                                {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={labelStyle}>Treatment Start</label>
                              <input type="date" value={patient.treatmentStart || ""} onChange={(e) => updateField(patient.id, "treatmentStart", e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                              <label style={labelStyle}>Expected Completion</label>
                              <input type="date" value={patient.expectedCompletion || ""} onChange={(e) => updateField(patient.id, "expectedCompletion", e.target.value)} style={inputStyle} />
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
                            <div>
                              <label style={labelStyle}>Last Visit</label>
                              <div style={{ fontSize: 14, fontWeight: 500, color: NYU.gray900 }}>{patient.lastVisit || "—"}</div>
                            </div>
                            <div>
                              <label style={labelStyle}>Last Procedure</label>
                              <div style={{ fontSize: 14, fontWeight: 500, color: NYU.gray900 }}>{patient.procedure || "—"}</div>
                            </div>
                            <div>
                              <label style={labelStyle}>Next Appointment</label>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <input type="checkbox" checked={!!patient.nextAppt} onChange={() => updateField(patient.id, "nextAppt", patient.nextAppt ? null : "")} style={{ width: 16, height: 16, cursor: "pointer", accentColor: NYU.purple }} />
                                {patient.nextAppt !== null ? (
                                  <input type="date" value={patient.nextAppt || ""} onChange={(e) => updateField(patient.id, "nextAppt", e.target.value)} style={{ ...inputStyle, width: "auto", padding: "5px 10px", fontSize: 13 }} />
                                ) : (
                                  <span style={{ fontSize: 13, color: NYU.gray400 }}>Not scheduled</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
                            <div>
                              <label style={labelStyle}>Lab Case Status</label>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {LAB_STATUSES.map((s) => { const m = LAB_META[s]; const active = patient.labStatus === s; return <button key={s} className="pill-btn" onClick={() => updateField(patient.id, "labStatus", s)} style={{ background: active ? m.color : NYU.gray100, color: active ? "white" : NYU.gray600 }}>{s}</button>; })}
                              </div>
                            </div>
                            <div>
                              <label style={labelStyle}>Pre-Authorization</label>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {PREAUTH_STATUSES.map((s) => { const m = PREAUTH_META[s]; const active = patient.preAuth === s; return <button key={s} className="pill-btn" onClick={() => updateField(patient.id, "preAuth", s)} style={{ background: active ? m.color : NYU.gray100, color: active ? "white" : NYU.gray600 }}>{s}</button>; })}
                              </div>
                            </div>
                          </div>

                          <div style={{ marginTop: 20 }}>
                            <label style={labelStyle}>Treatment Notes</label>
                            <textarea value={patient.notes} onChange={(e) => updateField(patient.id, "notes", e.target.value)} rows={3} placeholder="Add notes from this patient's treatment..." style={{ ...inputStyle, resize: "vertical" }} />
                          </div>

                          {patient.visitLog?.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                              <label style={labelStyle}>Visit History ({patient.visitLog.length})</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {patient.visitLog.map((v, i) => (
                                  <div key={i} style={{ background: NYU.gray50, borderRadius: 8, padding: "10px 14px", fontSize: 13, border: `1px solid ${NYU.gray100}` }}>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                      <span style={{ fontWeight: 600, color: NYU.purple }}>{v.date}</span>
                                      <span style={{ color: NYU.gray600 }}>{v.procedure}</span>
                                    </div>
                                    {v.notes && <div style={{ color: NYU.gray400, marginTop: 3, fontSize: 12 }}>{v.notes}</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button className="action-btn" onClick={() => { setShowLogModal(patient.id); setNewVisit({ date: "", procedure: "", notes: "" }); setNlpInput(""); setNlpParsed(null); setNlpError(""); }} style={{ background: "white", color: NYU.purple, border: `1.5px solid ${NYU.purple}`, flex: 1 }}>+ Log New Visit</button>
                            <div style={{ flex: 2, background: NYU.gray50, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${NYU.gray100}` }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: NYU.gray900 }}>Mark Treatment Complete</div>
                                <div style={{ fontSize: 11, color: NYU.gray400, marginTop: 1 }}>Patient ready for handoff if needed</div>
                              </div>
                              <input type="checkbox" checked={patient.treatmentComplete} onChange={() => toggleComplete(patient.id)} style={{ width: 20, height: 20, cursor: "pointer", accentColor: NYU.purple }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* REQUIREMENTS TAB */}
          {tab === "requirements" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: NYU.purpleDeep, borderRadius: 12, padding: "20px 24px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif" }}>Graduation Requirement Progress</div>
                  <div style={{ color: NYU.gray400, fontSize: 13, marginTop: 2 }}>Procedures completed across all disciplines</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "white", fontSize: 26, fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>
                    {requirementProgress.filter((r) => r.pct >= 100).length}
                    <span style={{ fontSize: 15, color: NYU.gray400, fontWeight: 400 }}>/{requirementProgress.length}</span>
                  </div>
                  <div style={{ color: NYU.gray400, fontSize: 12 }}>disciplines complete</div>
                </div>
              </div>
              {requirementProgress.map(({ discipline, required, completed, pct }) => {
                const color = pct >= 100 ? NYU.green : pct >= 60 ? NYU.blue : pct >= 30 ? NYU.amber : NYU.red;
                const qualifyingPatients = patients.filter(p => p.discipline === discipline && !p.treatmentComplete);
                return (
                  <div key={discipline} className="card" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: NYU.gray900 }}>{discipline}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {pct >= 100 && <span style={{ fontSize: 12, color: NYU.green, fontWeight: 600 }}>✓ Complete</span>}
                        {pct < 100 && <span style={{ fontSize: 12, color: NYU.gray400 }}>{required - completed} remaining</span>}
                        <span style={{ fontSize: 13, fontWeight: 700, color }}>{completed}/{required}</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    {qualifyingPatients.length > 0 && (
                      <div style={{ marginTop: 10, fontSize: 12, color: NYU.gray600 }}>
                        <span style={{ fontWeight: 600, color: NYU.purple }}>Active patients: </span>
                        {qualifyingPatients.map(p => p.nickname).join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD PATIENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, fontFamily: "'DM Serif Display', serif" }}>Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: NYU.gray400 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Patient Nickname *</label>
                <input style={inputStyle} placeholder="e.g. Hotel, India, Juliet..." value={newPatient.nickname} onChange={(e) => setNewPatient((p) => ({ ...p, nickname: e.target.value }))} />
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              <h2 style={{ fontSize: 18, fontWeight: 700, color: NYU.gray900, fontFamily: "'DM Serif Display', serif" }}>Log New Visit</h2>
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
    </>
  );
}