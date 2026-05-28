import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="h-full pt-2 pb-2 bg-[#1e1e1e] border-4 border-zinc-900 rounded-xl overflow-hidden">
    <Editor
      height="100%"
      defaultLanguage="python"
      theme="vs-dark"
      defaultValue={``}
      value={code}
      onChange={(value) => onChange(value || "")}
      options={{
        fontSize: 14,
        fontFamily: 'Jetbrains-Mono',
        fontLigatures: true,
        minimap: { enabled: false },
        wordWrap: "off",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
    </div>
  );
}