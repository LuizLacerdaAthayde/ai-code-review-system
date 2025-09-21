import { useEffect, useState } from "react";
import { fetchStats } from "../services/reviewService";

export default function DashboardPage() {
  const [avg, setAvg] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const s = await fetchStats();
      setAvg(s.avgScore);
      setTotal(s.total);
    })();
  }, []);

  return (
    <div className="grid" style={{gap:18}}>
      <h1 style={{fontSize:28}}>Dashboard</h1>
      <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))"}}>
        <div className="card" style={{padding:18}}>
          <div style={{color:"var(--muted)", fontSize:13}}>Média de score</div>
          <div style={{fontSize:34, fontWeight:700}}>{avg ?? "-"}</div>
        </div>
        <div className="card" style={{padding:18}}>
          <div style={{color:"var(--muted)", fontSize:13}}>Total de reviews</div>
          <div style={{fontSize:34, fontWeight:700}}>{total}</div>
        </div>
      </div>
    </div>
  );
}