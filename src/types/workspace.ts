export type ID = string

export interface DiagramFile {
  id: ID
  name: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: ID
  name: string
  files: DiagramFile[]
  createdAt: number
  updatedAt: number
}

export interface Project {
  id: ID
  name: string
  description?: string
  folders: Folder[]
  createdAt: number
  updatedAt: number
}

export interface Workspace {
  projects: Project[]
}
