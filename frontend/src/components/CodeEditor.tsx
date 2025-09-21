import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function CodeEditor({
  language,
  onSubmit,
}: {
  language: string;
  onSubmit: (code: string) => void;
}) {
  const [code, setCode] = useState("");

  return (
    <div className="space-y-3">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        className="w-full border rounded p-2 font-mono text-sm"
        placeholder="Paste your code here..."
      />
      <div className="text-xs text-gray-500">Pré-visualização:</div>
      <SyntaxHighlighter language={language}>{code || "// vazio"}</SyntaxHighlighter>
      <button
        onClick={() => onSubmit(code)}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        disabled={!code.trim()}
      >
        Send for Review
      </button>
    </div>
  );
}
