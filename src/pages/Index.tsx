import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderPlus, FilePlus, FileText } from "lucide-react";
import { useState } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

const Index = () => {
  const navigate = useNavigate();
  const store = useWorkspaceStore();
  const [name, setName] = useState("");

  const create = () => {
    const project = store.addProject(name || "My Workflow");
    const firstFolder = project.folders[0];
    const firstFile = firstFolder.files[0];
    store.setCurrent(project.id, firstFile.id);
    navigate(`/editor/${project.id}/${firstFile.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <div className="container max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mermaid Mobile Studio</h1>
          <p className="text-muted-foreground mt-2">Create, visualize, and manage Mermaid diagrams with a mobile-first workflow.</p>
        </header>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Start a new project</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={create}><Plus className="h-4 w-4 mr-2" />Create</Button>
          </CardContent>
        </Card>

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Your projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.projects.map((p) => {
              const firstFile = p.folders[0]?.files[0];
              return (
                <Card key={p.id} className="hover-scale cursor-pointer" onClick={() => {
                  if (firstFile) {
                    store.setCurrent(p.id, firstFile.id);
                    navigate(`/editor/${p.id}/${firstFile.id}`);
                  }
                }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> {p.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {p.folders.reduce((acc, f) => acc + f.files.length, 0)} files · Updated {new Date(p.updatedAt).toLocaleDateString()}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
