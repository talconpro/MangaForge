import { defineStore } from 'pinia'
import { ref } from 'vue'
import { platformMock } from '@/mock/api'
import type { PlatformDashboardDTO, PlatformProjectDTO } from '@/types/mock'

export const usePlatformStore = defineStore('platform', () => {
  const dashboard = ref<PlatformDashboardDTO | null>(null)
  const projects = ref<PlatformProjectDTO[]>([])

  async function load() {
    dashboard.value = await platformMock.getPlatformDashboard()
    projects.value = await platformMock.listProjects()
  }

  return { dashboard, projects, load }
})
