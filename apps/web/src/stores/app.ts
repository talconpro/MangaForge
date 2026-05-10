import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { mockApi, mockProjects } from '@/api/mock'
import { loginApi } from '@/api/auth'
import type { Project } from '@/types'

export const useAppStore = defineStore('app', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isLight = ref(localStorage.getItem('mf_theme') === 'light')
  const projects = ref<Project[]>(mockProjects)
  const currentProjectId = ref(localStorage.getItem('mf_project_id') || 'yunzhou')
  const toastMessage = ref('')
  const toastVisible = ref(false)

  const currentProject = computed(() =>
    projects.value.find((project) => project.id === currentProjectId.value) || projects.value[0],
  )

  async function login() {
    try {
      const res = await loginApi({ account: 'demo@mangaforge.ai', password: '123456' })
      const body = res.data
      if (body.code === 0 && body.data) {
        token.value = body.data.access_token
        localStorage.setItem('access_token', body.data.access_token)
        return
      }
    } catch {
      // Fall back to mock
    }
    const result = await mockApi.login()
    token.value = result.token
    localStorage.setItem('access_token', result.token)
  }

  function logout() {
    token.value = null
    localStorage.removeItem('access_token')
  }

  function setProject(projectId: string) {
    currentProjectId.value = projectId
    localStorage.setItem('mf_project_id', projectId)
  }

  function toggleTheme() {
    isLight.value = !isLight.value
    localStorage.setItem('mf_theme', isLight.value ? 'light' : 'dark')
    document.body.classList.toggle('light', isLight.value)
    showToast(isLight.value ? '已切换到亮色模式' : '已切换到暗色模式')
  }

  function initTheme() {
    document.body.classList.toggle('light', isLight.value)
  }

  function showToast(message: string) {
    toastMessage.value = message
    toastVisible.value = true
    window.setTimeout(() => {
      toastVisible.value = false
    }, 2200)
  }

  return {
    token,
    isLight,
    projects,
    currentProjectId,
    currentProject,
    toastMessage,
    toastVisible,
    login,
    logout,
    setProject,
    toggleTheme,
    initTheme,
    showToast,
  }
})
