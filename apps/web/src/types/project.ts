export interface ProjectCreate {
  project_name: string
  novel_name: string
  author?: string
  genre?: string
  comic_style?: string
  target_reader?: string
  adaptation_goal?: string
}

export interface ProjectUpdate {
  project_name?: string
  novel_name?: string
  author?: string
  genre?: string
  comic_style?: string
  target_reader?: string
  adaptation_goal?: string
  status?: string
}

export interface ProjectResponse {
  id: string
  user_id: string
  project_name: string
  novel_name: string
  author: string
  genre: string
  comic_style: string
  target_reader: string
  adaptation_goal: string
  word_count: number
  chapter_count: number
  analyzed_chapter_count: number
  episode_count: number
  export_count: number
  status: string
  created_at: string
  updated_at: string
}

export interface ProjectStats {
  total_projects: number
  total_analyzed_chapters: number
  total_episodes: number
  total_exports: number
}
