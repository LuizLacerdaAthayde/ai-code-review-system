import { useState } from "react";
import { Select, TextArea, Label, Row } from "../components/ui/Field";
import Button from "../components/ui/Button";
import { submitReview } from "../services/reviewService";
import { usePollReview } from "../hooks/usePollReview";
import ReviewCard from "../components/ReviewCard";

export default function SubmitPage() {
  const [language, setLanguage] = useState<"python"|"javascript"|"typescript">("python");
  const [code, setCode] = useState("");
  const [currentId, setCurrentId] = useState<string>();
  const { data, loading, error } = usePollReview(currentId);

  async function onSend(){
    const { id } = await submitReview(code, language);
    setCurrentId(id);
  }

  return (
    <div className="grid" style={{gap:18}}>
      <h1 style={{fontSize:28, margin:"6px 0 4px"}}>Code Review</h1>

      <div className="card" style={{padding:18}}>
        <Row>
          <div style={{minWidth:180}}>
            <Label>Language</Label>
            <Select value={language} onChange={e=>setLanguage(e.target.value as any)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </Select>
          </div>
        </Row>

        <div style={{marginTop:14}}>
          <Label>Code</Label>
          <TextArea placeholder="Paste your code here..." value={code} onChange={e=>setCode(e.target.value)} />
        </div>

        <div style={{display:"flex", gap:10, marginTop:14}}>
          <Button onClick={onSend} disabled={!code.trim()}>Send for Review</Button>
          <Button variant="ghost" onClick={()=>setCode("")}>Clear</Button>
        </div>
      </div>

      {currentId && (
        <div className="card" style={{padding:18}}>
          <div style={{color:"var(--muted)", fontSize:13, marginBottom:8}}>ID: {currentId}</div>
          {loading && <div>⏳ Loading…</div>}
          {error && <div style={{color:"var(--danger)"}}>{error}</div>}
          {data && <ReviewCard review={data} />}
        </div>
      )}
    </div>
  );
}