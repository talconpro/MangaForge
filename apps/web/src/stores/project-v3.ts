import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectsMock } from '@/mock/api'
import type { ProjectDatasetDTO } from '@/types/mock'

export const useProjectStore = defineStore('project-v3', () => {
  const currentName = ref('云州旧梦')
  const data = ref<ProjectDatasetDTO | null>(null)
  const uploadProgress = ref(78)
  const uploadStatus = ref('Uploading')
  const uploadText = ref('Upload progress: 78%')
  const selectedExportType = ref('Excel')

  async function loadProject(name: string) {
    currentName.value = name
    data.value = await projectsMock.getProjectDetail(name)
  }

  async function runSimulateUpload() {
    const payload = await projectsMock.simulateUpload(currentName.value)
    uploadStatus.value = payload.status
    uploadProgress.value = payload.progress
    uploadText.value = payload.text
  }

  async function runRerunAnalysis() {
    if (!data.value) return
    data.value.analysis.status = 'Running'
    const result = await projectsMock.rerunAnalysis(currentName.value)
    data.value.analysis = result
  }

  async function retryTask(taskId: string) {
    if (!data.value) return
    data.value.tasks = await projectsMock.retryTask(currentName.value, taskId)
  }

  return {
    currentName,
    data,
    uploadProgress,
    uploadStatus,
    uploadText,
    selectedExportType,
    loadProject,
    runSimulateUpload,
    runRerunAnalysis,
    retryTask,
  }
})
