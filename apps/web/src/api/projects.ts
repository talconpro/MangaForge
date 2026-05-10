import client from './client'
import type { ApiResponse } from '@/types/api'
import type { ProjectCreate, ProjectUpdate, ProjectResponse, ProjectStats } from '@/types/project'

export function createProjectApi(data: ProjectCreate) {
  return client.post<ApiResponse<ProjectResponse>>('/v1/projects/', data)
}

export function listProjectsApi(params?: { keyword?: string; status?: string; page?: number; page_size?: number }) {
  return client.get<ApiResponse<ProjectResponse[]>>('/v1/projects/', { params })
}

export function getProjectStatsApi() {
  return client.get<ApiResponse<ProjectStats>>('/v1/projects/stats')
}

export function getProjectDetailApi(id: string) {
  return client.get<ApiResponse<ProjectResponse>>(`/v1/projects/${id}`)
}

export function updateProjectApi(id: string, data: ProjectUpdate) {
  return client.put<ApiResponse<ProjectResponse>>(`/v1/projects/${id}`, data)
}

export function deleteProjectApi(id: string) {
  return client.delete<ApiResponse<null>>(`/v1/projects/${id}`)
}
