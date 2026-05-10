import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createProjectApi,
  listProjectsApi,
  getProjectStatsApi,
  getProjectDetailApi,
  updateProjectApi,
  deleteProjectApi,
} from '@/api/projects'
import type { ProjectCreate, ProjectResponse, ProjectStats, ProjectUpdate } from '@/types/project'

export const useProjectsStore = defineStore('projects', () => {
  const items = ref<ProjectResponse[]>([])
  const total = ref(0)
  const stats = ref<ProjectStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects(params?: { keyword?: string; status?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await listProjectsApi(params)
      const body = res.data
      if (body.code === 0 && body.data) {
        items.value = body.data
        // Extract total from message (e.g., "Total: 5")
        const match = body.message?.match(/Total:\s*(\d+)/)
        total.value = match ? parseInt(match[1]) : body.data.length
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res = await getProjectStatsApi()
      const body = res.data
      if (body.code === 0 && body.data) {
        stats.value = body.data
      }
    } catch {
      // Stats are non-critical
    }
  }

  async function fetchDetail(id: string): Promise<ProjectResponse | null> {
    try {
      const res = await getProjectDetailApi(id)
      const body = res.data
      if (body.code === 0 && body.data) {
        return body.data
      }
    } catch {
      // handled by caller
    }
    return null
  }

  async function create(data: ProjectCreate): Promise<ProjectResponse | null> {
    loading.value = true
    error.value = null
    try {
      const res = await createProjectApi(data)
      const body = res.data
      if (body.code === 0 && body.data) {
        items.value.unshift(body.data)
        total.value++
        return body.data
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to create project'
    } finally {
      loading.value = false
    }
    return null
  }

  async function update(id: string, data: ProjectUpdate): Promise<ProjectResponse | null> {
    try {
      const res = await updateProjectApi(id, data)
      const body = res.data
      if (body.code === 0 && body.data) {
        const idx = items.value.findIndex((p) => p.id === id)
        if (idx !== -1) items.value[idx] = body.data
        return body.data
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to update project'
    }
    return null
  }

  async function remove(id: string): Promise<boolean> {
    try {
      const res = await deleteProjectApi(id)
      const body = res.data
      if (body.code === 0) {
        items.value = items.value.filter((p) => p.id !== id)
        total.value--
        return true
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to delete project'
    }
    return false
  }

  return { items, total, stats, loading, error, fetchProjects, fetchStats, fetchDetail, create, update, remove }
})
