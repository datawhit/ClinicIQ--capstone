import { useEffect, useState } from "react";
import PriorityItemCard from "./PriorityItemCard.jsx";

function formatTimestamp(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function DailyPrioritySummary({ theme }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/v2/dashboard/summary");
        if (!res.ok) throw new Error("Summary unavailable");
        const data = await res.json();
        if (active) setSummary(data);
      } catch (err) {
        if (active) setError(err.message || "Unable to load workflow summary");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ background:"white", borderRadius:16, padding:"16px 18px", border:"1px solid rgba(107,33,168,0.08)", marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#1e1428", marginBottom:8 }}>Daily workflow priorities</div>
        <div style={{ fontSize:12, color:"#a89cbd" }}>Loading today’s priorities…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background:"white", borderRadius:16, padding:"16px 18px", border:"1px solid rgba(107,33,168,0.08)", marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#1e1428", marginBottom:8 }}>Daily workflow priorities</div>
        <div style={{ fontSize:12, color:"#b45309" }}>{error}</div>
      </div>
    );
  }

  if (!summary || !summary.priorityItems?.length) {
    return (
      <div style={{ background:"white", borderRadius:16, padding:"16px 18px", border:"1px solid rgba(107,33,168,0.08)", marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#1e1428", marginBottom:6 }}>{summary?.summaryTitle || "Daily workflow priorities"}</div>
        <div style={{ fontSize:12, color:"#a89cbd" }}>No workflow priorities were detected for this view.</div>
      </div>
    );
  }

  const urgencyCounts = summary.urgencyCounts || { High: 0, Medium: 0, Low: 0 };

  return (
    <div style={{ background:"white", borderRadius:16, padding:"16px 18px", border:"1px solid rgba(107,33,168,0.08)", marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", marginBottom:12 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#1e1428" }}>{summary.summaryTitle}</div>
          <div style={{ fontSize:11, color:"#a89cbd", marginTop:3 }}>Updated {formatTimestamp(summary.freshnessTimestamp)}</div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {Object.entries(urgencyCounts).map(([level, count]) => (
            <span key={level} style={{ background: level === "High" ? "#fee2e2" : level === "Medium" ? "#fef3c7" : "#dcfce7", color: level === "High" ? "#b91c1c" : level === "Medium" ? "#b45309" : "#166534", borderRadius:999, padding:"4px 8px", fontSize:10, fontWeight:700 }}>
              {level}: {count}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gap:8, marginBottom:12 }}>
        {summary.priorityItems.slice(0, 4).map((item) => (
          <PriorityItemCard key={item.id} item={item} theme={theme} />
        ))}
      </div>

      {summary.reasons?.length > 0 && (
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#6b5f7a", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Why these are flagged</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {summary.reasons.slice(0, 3).map((reason) => (
              <span key={reason} style={{ background:"#f3f0f7", color:"#6b5f7a", borderRadius:999, padding:"4px 8px", fontSize:10 }}>{reason}</span>
            ))}
          </div>
        </div>
      )}

      {summary.recommendedActions?.length > 0 && (
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"#6b5f7a", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Recommended actions</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {summary.recommendedActions.slice(0, 3).map((action) => (
              <span key={action} style={{ background:"#eef2ff", color:"#4338ca", borderRadius:999, padding:"4px 8px", fontSize:10 }}>{action}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
