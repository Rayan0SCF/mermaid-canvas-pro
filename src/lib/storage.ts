import { Workspace, Project, Folder, DiagramFile, ID } from '@/types/workspace'

const KEY = 'mm_workspace_v1'
const BACKUP_KEY = 'mm_workspace_backup'

export function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { projects: [] }
    const ws = JSON.parse(raw) as Workspace
    if (!ws.projects) return { projects: [] }
    return ws
  } catch (e) {
    console.warn('Failed to parse workspace; attempting backup recovery', e)
    const backup = localStorage.getItem(BACKUP_KEY)
    if (backup) {
      try { return JSON.parse(backup) as Workspace } catch {}
    }
    return { projects: [] }
  }
}

export function saveWorkspace(ws: Workspace) {
  try {
    const payload = JSON.stringify(ws)
    localStorage.setItem(KEY, payload)
    localStorage.setItem(BACKUP_KEY, payload)
  } catch (e) {
    console.error('Failed saving workspace', e)
  }
}

export const genId = (): ID => Math.random().toString(36).slice(2, 10)

export function createBoilerplateFile(name = 'main.mmd'): DiagramFile {
  const now = Date.now()
  const content = `%% Mermaid sample (LTR with orthogonal routing)\n%% Learn: https://mermaid.js.org/\nflowchart LR\n  classDef trigger fill:#ffffff,stroke:#2563eb,stroke-width:2,color:#111,border-radius:8px;\n  classDef action fill:#ffffff,stroke:#06b6d4,stroke-width:2,color:#111,border-radius:8px;\n  classDef condition fill:#ffffff,stroke:#f59e0b,stroke-width:2,color:#111,border-radius:8px;\n\n  T((Start)):::trigger --- A[Capture lead]\n  A:::action --> B{Qualified?}:::condition\n  B -- Yes --> C[Send welcome]\n  B -- No --> D[Ask for more info]\n  C:::action --> E[End]\n  D:::action --> E[End]\n`
  return { id: genId(), name, content, createdAt: now, updatedAt: now }
}

export function newProject(name: string): Project {
  const now = Date.now()
  const file = createBoilerplateFile()
  const folder: Folder = { id: genId(), name: 'Flows', files: [file], createdAt: now, updatedAt: now }
  return { id: genId(), name, description: 'Mermaid diagrams', folders: [folder], createdAt: now, updatedAt: now }
}
