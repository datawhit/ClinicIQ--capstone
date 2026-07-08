function PriorityItemCard({ item, theme }) {
  const levelColors = {
    High: { bg: "#fee2e2", color: "#b91c1c" },
    Medium: { bg: "#fef3c7", color: "#b45309" },
    Low: { bg: "#dcfce7", color: "#166534" },
  };

  const tone = levelColors[item.priorityLevel] || levelColors.Medium;

  return (
    <div style={{ background:"white", borderRadius:14, padding:"12px 14px", border:"1px solid rgba(107,33,168,0.08)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", marginBottom:6 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#1e1428", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {item.alias || item.relatedEntity || "Priority item"}
          </div>
          <div style={{ fontSize:11, color:"#a89cbd", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {item.procedure || item.chartNumber || "Needs review"}
          </div>
        </div>
        <span style={{ background: tone.bg, color: tone.color, borderRadius:999, padding:"4px 8px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
          {item.priorityLevel} · {item.priorityScore}
        </span>
      </div>
      <div style={{ fontSize:12, color:"#6b5f7a", marginBottom:6 }}>{item.reason}</div>
      <div style={{ fontSize:11, color:theme?.purple || "#6B21A8", fontWeight:600 }}>{item.recommendedAction}</div>
    </div>
  );
}

export default PriorityItemCard;
