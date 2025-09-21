import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { Row, Select } from "../components/ui/Field";
import { listReviews } from "../services/reviewService";
import type {ReviewDoc} from "../types/review";

function exportCsv(rows: ReviewDoc[]) {
  const header = ["id", "language", "status", "score", "created_at"];
  const lines = rows.map((r) =>
    [
      r.id,
      r.language,
      r.status,
      r.result?.score ?? "",
      r.created_at,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reviews.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistoryPage() {
  const [items, setItems] = useState<ReviewDoc[]>([]);
  const [language, setLanguage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { items } = await listReviews({
        language: language || undefined,
        page: 1,
        page_size: 20,
      });
      setItems(items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <h1 style={{ fontSize: 28 }}>Histórico</h1>

      <div className="card" style={{ padding: 18 }}>
        <Row>
          <div style={{ minWidth: 220 }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </Select>
          </div>
          <Button onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Filtrar"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => exportCsv(items)}
            disabled={!items.length}
          >
            Exportar CSV
          </Button>
        </Row>

        <div style={{ overflow: "auto", marginTop: 14 }}>
          <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "var(--muted)" }}>
                <th style={{ textAlign: "left", padding: "10px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Linguagem</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Score</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Criado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #1f2430" }}>
                  <td style={{ padding: "10px" }}>{r.id}</td>
                  <td style={{ padding: "10px" }}>{r.language}</td>
                  <td style={{ padding: "10px" }}>{r.status}</td>
                  <td style={{ padding: "10px" }}>{r.result?.score ?? "-"}</td>
                  <td style={{ padding: "10px" }}>
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {!items.length && !loading && (
                <tr>
                  <td colSpan={5} style={{ padding: "10px", color: "var(--muted)" }}>
                    Sem registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
