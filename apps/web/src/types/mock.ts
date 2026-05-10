export type ThemeMode = 'dark' | 'light'
export type LayoutMode = 'login' | 'platform' | 'project'

export type PlatformPageKey = 'platform-dashboard' | 'platform-projects' | 'platform-assets' | 'platform-system'
export type ProjectPageKey =
  | 'overview'
  | 'import'
  | 'chapters'
  | 'analysis'
  | 'knowledge'
  | 'episode'
  | 'storyboard'
  | 'export'
  | 'tasks'

export type ProjectStage = 'Storyboarding' | 'Analyzing' | 'Exported'
export type AgentTaskStatus = 'Success' | 'Running' | 'Failed'

export interface PlatformDashboardDTO {
  activeProjects: number
  parsedChapters: number
  comicEpisodes: number
  exportAssets: number
}

export interface PlatformProjectDTO {
  id: string
  name: string
  subtitle: string
  status: string
  progress: number
}

export interface ChapterItemDTO {
  id: string
  title: string
  words: number
  status: string
}

export interface AnalysisResultDTO {
  summary: string
  characters: string[]
  events: string[]
  suggestion: string
  status: 'Success' | 'Running'
}

export interface StoryboardPanelDTO {
  id: string
  title: string
  status: 'AI Draft' | 'Edited'
  shot: string
  characters: string
  imageDescription: string
  narration: string
  sfx: string
  prompt: string
}

export interface ExportRecordDTO {
  file: string
  type: string
  status: 'Success' | 'Running'
  size: string
}

export interface AgentTaskDTO {
  id: string
  agent: string
  target: string
  status: AgentTaskStatus
  duration: string
  retry: number
}

export interface ProjectOverviewDTO {
  name: string
  meta: string
  stage: ProjectStage
  chapterProgress: string
  episodeProgress: string
}

export interface ProjectDatasetDTO {
  overview: ProjectOverviewDTO
  chapters: ChapterItemDTO[]
  analysis: AnalysisResultDTO
  storyboardPanels: StoryboardPanelDTO[]
  exports: ExportRecordDTO[]
  tasks: AgentTaskDTO[]
}
