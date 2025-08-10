import { create } from 'zustand'
import { DiagramFile, Folder, Project, Workspace } from '@/types/workspace'
import { genId, loadWorkspace, newProject, saveWorkspace } from '@/lib/storage'

interface WorkspaceState extends Workspace {
  currentProjectId?: string
  currentFileId?: string
  setCurrent: (projectId?: string, fileId?: string) => void
  addProject: (name: string) => Project
  addFolder: (projectId: string, name: string) => Folder | undefined
  addFile: (projectId: string, folderId: string, name: string) => DiagramFile | undefined
  updateFileContent: (projectId: string, fileId: string, content: string) => void
}

const initial = loadWorkspace()

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  ...initial,
  currentProjectId: initial.projects[0]?.id,
  currentFileId: initial.projects[0]?.folders[0]?.files[0]?.id,
  setCurrent: (projectId, fileId) => set((state) => {
    const next = { ...state, currentProjectId: projectId, currentFileId: fileId }
    return persist(next)
  }),
  addProject: (name: string) => {
    const project = newProject(name)
    set((state) => persist({ ...state, projects: [project, ...state.projects] }))
    return project
  },
  addFolder: (projectId: string, name: string) => {
    let created: Folder | undefined
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id !== projectId) return p
        created = { id: genId(), name, files: [], createdAt: Date.now(), updatedAt: Date.now() }
        return { ...p, folders: [...p.folders, created!], updatedAt: Date.now() }
      })
      return persist({ ...state, projects })
    })
    return created
  },
  addFile: (projectId: string, folderId: string, name: string) => {
    let created: DiagramFile | undefined
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id !== projectId) return p
        const folders = p.folders.map((f) => {
          if (f.id !== folderId) return f
          created = { id: genId(), name, content: '', createdAt: Date.now(), updatedAt: Date.now() }
          return { ...f, files: [created!, ...f.files], updatedAt: Date.now() }
        })
        return { ...p, folders, updatedAt: Date.now() }
      })
      return persist({ ...state, projects })
    })
    return created
  },
  updateFileContent: (projectId: string, fileId: string, content: string) => {
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id !== projectId) return p
        const folders = p.folders.map((f) => ({
          ...f,
          files: f.files.map((file) => file.id === fileId ? { ...file, content, updatedAt: Date.now() } : file)
        }))
        return { ...p, folders, updatedAt: Date.now() }
      })
      return persist({ ...state, projects })
    })
  },
}))

function persist(state: WorkspaceState): WorkspaceState {
  saveWorkspace({ projects: state.projects })
  return state
}

export function selectCurrentProject(state: WorkspaceState): Project | undefined {
  return state.projects.find(p => p.id === state.currentProjectId)
}

export function selectCurrentFile(state: WorkspaceState): DiagramFile | undefined {
  const project = selectCurrentProject(state)
  if (!project) return undefined
  for (const folder of project.folders) {
    const hit = folder.files.find(f => f.id === state.currentFileId)
    if (hit) return hit
  }
  return undefined
}
