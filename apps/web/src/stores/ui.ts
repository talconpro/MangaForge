import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LayoutMode, PlatformPageKey, ProjectPageKey, ThemeMode } from '@/types/mock'

export const useUiStore = defineStore('ui', () => {
  const theme = ref<ThemeMode>('dark')
  const layoutMode = ref<LayoutMode>('login')
  const platformPage = ref<PlatformPageKey>('platform-dashboard')
  const projectPage = ref<ProjectPageKey>('overview')
  const toastMessage = ref('')
  const toastVisible = ref(false)
  const createModalVisible = ref(false)

  function showToast(message: string) {
    toastMessage.value = message
    toastVisible.value = true
    setTimeout(() => {
      toastVisible.value = false
    }, 2200)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    showToast(theme.value === 'light' ? '已切换到亮色模式' : '已切换到暗色模式')
  }

  return {
    theme,
    layoutMode,
    platformPage,
    projectPage,
    toastMessage,
    toastVisible,
    createModalVisible,
    showToast,
    toggleTheme,
  }
})
