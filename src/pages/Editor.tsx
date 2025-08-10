import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore, selectCurrentFile, selectCurrentProject } from "@/store/useWorkspaceStore";
import { AppHeader } from "@/components/layout/AppHeader";
import CodeEditor from "@/components/editor/CodeEditor";
import MermaidPreview from "@/components/editor/MermaidPreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert, Download } from "lucide-react";
import { saveSvgAsPng } from "save-svg-as-png";

export default function Editor() {
  const params = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("preview");
  const state = useWorkspaceStore();

  // Ensure correct selection based on URL
  if (state.currentProjectId !== params.projectId || state.currentFileId !== params.fileId) {
    state.setCurrent(params.projectId, params.fileId);
  }

  const project = selectCurrentProject(state);
  const file = selectCurrentFile(state);

  const [error, setError] = useState<string | null>(null);

  const onChange = (value: string) => {
    if (!project || !file) return;
    useWorkspaceStore.getState().updateFileContent(project.id, file.id, value);
  };

  const onExport = async (type: "svg" | "png") => {
    const svgEl = document.querySelector("#mm-preview svg") as SVGSVGElement | null;
    if (!svgEl) return;
    if (type === "svg") {
      const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${file?.name.replace(/\.[^/.]+$/, '') || 'diagram'}.svg`;
      a.click(); URL.revokeObjectURL(url);
    } else {
      await saveSvgAsPng(svgEl, `${file?.name.replace(/\.[^/.]+$/, '') || 'diagram'}.png`, { encoderOptions: 1, backgroundColor: "white" });
    }
  };

  if (!project || !file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Nothing to edit yet</AlertTitle>
          <AlertDescription>
            Create a project and a file first. Redirecting to dashboard…
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader projectName={project.name} onBack={() => navigate('/')} />

      <main className="flex-1 container max-w-4xl w-full px-4 pb-16">
        <div className="flex items-center justify-between mt-4 mb-2">
          <h1 className="text-xl font-semibold">{file.name}</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => onExport("svg")}>
              <Download className="mr-2 h-4 w-4" /> Export SVG
            </Button>
            <Button onClick={() => onExport("png")}>
              <Download className="mr-2 h-4 w-4" /> Export PNG
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-4">
            <CodeEditor value={file.content} onChange={onChange} />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div id="mm-preview" className="w-full overflow-auto rounded-lg border bg-card p-2">
              <MermaidPreview code={file.content} onError={setError} />
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Mermaid error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
