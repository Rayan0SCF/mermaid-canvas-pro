import { useMemo } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = useMemo(() => ({
    fontSize: 14,
    lineNumbers: "on" as const,
    minimap: { enabled: true },
    wordWrap: "on" as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    roundedSelection: true,
    tabSize: 2,
    folding: true,
  }), []);

  return (
    <div className="rounded-lg border overflow-hidden">
      <Editor
        height="60vh"
        defaultLanguage="markdown"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v || "")}
        options={options}
      />
    </div>
  );
}
