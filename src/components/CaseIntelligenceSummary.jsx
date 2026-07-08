/**
 * CaseIntelligenceSummary.jsx
 *
 * Renders a deterministic case summary card for a single patient.
 * Fetches GET /api/v2/patients/:id/summary (requireAuth, server-scoped by user).
 *
 * Props:
 *   patientId  {string}  — the patient's id (e.g. "PT-abc123")
 *   theme      {object}  — the active color theme from App.jsx (T.purple, T.lavender, etc.)
 *
 * States: loading | error | riskLevel=None | riskLevel=Low/Medium/High
 * No AI calls — all output is deterministic from caseIntelligenceService.
 */

import { useEffect, useState } from "react";

const RISK_COLORS = {
  High:   { bg: "#fee2e2", color: "#b91c1c", dot: "#dc2626" },
  Medium: { bg: "#fef3c7", color: "#b45309", dot: "#d97706" },
  Low:    { bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
  None:   { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

const SEVERITY_COLORS = {
  High:   { bg: "#fee2e2", color: "#b91c1c" },
  Medium: { bg: "#fef3c7", color: "#b45309" },
  Low:    { bg: "#e0f2fe", color: "#0369a1" },
};

export default function CaseIntelligenceSummary({ patientId, theme }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const purple = theme?.purple || "#6B21A8";
  const lavender = theme?.lavender || "#f3f0f7";

  useEffect(() => {
    if (!patientId) return;

    let active = true;
    setSummary(null);
    setLoading(true);
    setError("");

    fetch(`/api/v2/patients/${encodeURIComponent(patientId)}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error("Summary unavailable");
        return res.json();
      })
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load case summary");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [patientId]);

  // ── Container shell ─────────────────────────────────────────────────────────

  const shell = (children) => (
    <div style={{
      background: "white",
      borderRadius: 16,
      marginBottom: 16,
      border: "1px solid rgba(107,33,168,0.08)",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );

  const header = (extra) => (
    <div
      onClick={() => !loading && !error && setExpanded((e) => !e)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        cursor: loading || error ? "default" : "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e1428" }}>
          Case Intelligence
        </div>
        {extra}
      </div>
      {!loading && !error && (
        <span style={{
          fontSize: 14,
          color: "#a89cbd",
          transition: "transform 0.18s",
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        }}>›</span>
      )}
    </div>
  );

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return shell(
      <div style={{ padding: "14px 20px 16px" }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e1428", marginBottom: 6 }}>
          Case Intelligence
        </div>
        <div style={{ fontSize: 12, color: "#a89cbd" }}>Loading case summary…</div>
      </div>
    );
  }

  // ── Error (non-blocking) ─────────────────────────────────────────────────────

  if (error) {
    return shell(
      <div style={{ padding: "14px 20px 16px" }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e1428", marginBottom: 6 }}>
          Case Intelligence
        </div>
        <div style={{ fontSize: 12, color: "#b45309" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const { riskLevel, riskFlags = [], nextSteps = [], timeline, visitCount } = summary;
  const tone = RISK_COLORS[riskLevel] || RISK_COLORS.None;
  const hasFlags = riskFlags.length > 0;

  // ── Risk badge (always visible in header) ────────────────────────────────────

  const riskBadge = (
    <span style={{
      background: tone.bg,
      color: tone.color,
      borderRadius: 999,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: tone.dot,
        display: "inline-block",
      }} />
      {riskLevel === "None" ? "No active flags" : `${riskLevel} risk · ${riskFlags.length} flag${riskFlags.length !== 1 ? "s" : ""}`}
    </span>
  );

  // ── Collapsed view: just the header + badge ──────────────────────────────────

  if (!expanded) {
    return shell(
      <>
        {header(riskBadge)}
        {/* Collapsed peek: top next step only, if any */}
        {hasFlags && !expanded && (
          <div style={{ padding: "0 20px 14px" }}>
            <div style={{
              fontSize: 12,
              color: purple,
              fontWeight: 600,
              background: lavender,
              borderRadius: 10,
              padding: "8px 12px",
            }}>
              → {nextSteps[0]}
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Expanded view ────────────────────────────────────────────────────────────

  return shell(
    <>
      {header(riskBadge)}

      <div style={{ padding: "0 20px 18px" }}>

        {/* No flags state */}
        {!hasFlags && (
          <div style={{ fontSize: 12, color: "#a89cbd", marginBottom: 12 }}>
            No active workflow flags for this patient.
          </div>
        )}

        {/* Risk flags */}
        {hasFlags && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#a89cbd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Active Flags
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {riskFlags.map((f) => {
                const ft = SEVERITY_COLORS[f.severity] || SEVERITY_COLORS.Low;
                return (
                  <span
                    key={f.flag}
                    title={f.label}
                    style={{
                      background: ft.bg,
                      color: ft.color,
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {f.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Next steps */}
        {nextSteps.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#a89cbd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Recommended Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {nextSteps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    color: purple,
                    fontWeight: 600,
                    background: lavender,
                    borderRadius: 10,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 6,
                  }}
                >
                  <span style={{ opacity: 0.5, flexShrink: 0 }}>→</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline highlights */}
        {timeline && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#a89cbd", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Timeline
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Last Visit", value: timeline.lastVisit ? `${timeline.lastVisit}${timeline.daysSinceLastVisit !== null ? ` (${timeline.daysSinceLastVisit}d ago)` : ""}` : "None on record" },
                { label: "Next Appt", value: timeline.nextAppt ? `${timeline.nextAppt}${timeline.daysUntilNextAppt !== null ? ` (in ${timeline.daysUntilNextAppt}d)` : ""}` : "Not scheduled" },
                { label: "Visit Count", value: visitCount !== undefined ? `${visitCount} visit${visitCount !== 1 ? "s" : ""}` : "—" },
                { label: "Expected Completion", value: timeline.expectedCompletion || "Not set" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#c4b5d6", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#1e1428" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
