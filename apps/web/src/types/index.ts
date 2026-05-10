export type ProjectStatus = 'storyboarding' | 'analyzing' | 'exported'

export interface Project {
  id: string
  name: string
  type: string
  style: string
  chapters: number
  words: string
  progress: number
  stage: string
  status: ProjectStatus
  parsedChapters: number
  episodes: number
  panels: number
  latest: string
}

export interface AgentTask {
  id: string
  agent: string
  target: string
  status: 'success' | 'running' | 'failed' | 'queued'
  duration: string
  retry: number
}

export interface Chapter {
  no: string
  title: string
  words: number
  status: string
}

export interface CharacterCard {
  name: string
  role: string
  desc: string
  rules: string[]
  prompt: string
}

export interface ExportAsset {
  file: string
  type: string
  status: string
  size: string
}
