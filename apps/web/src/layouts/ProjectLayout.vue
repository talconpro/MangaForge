<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const app = useAppStore()

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'import', label: '导入' },
  { key: 'chapters', label: '章节' },
  { key: 'analysis', label: '解析' },
  { key: 'knowledge', label: '知识库' },
  { key: 'episodes', label: '单话' },
  { key: 'storyboard', label: '分镜' },
  { key: 'export', label: '导出' },
  { key: 'tasks', label: '任务' },
  { key: 'settings', label: '设置' },
]

const activeTab = computed(() => String(route.path.split('/').pop() || 'overview'))

watch(
  () => route.params.projectId,
  (id) => {
    if (typeof id === 'string') app.setProject(id)
  },
  { immediate: true },
)

function switchProject(projectId: string) {
  app.setProject(projectId)
  const target = app.currentProject.status === 'exported' ? 'export' : app.currentProject.status === 'analyzing' ? 'analysis' : 'overview'
  router.push(`/projects/${projectId}/${target}`)
  app.showToast(`已切换项目：${app.currentProject.name}`)
}

function goTab(tab: string) {
  router.push(`/projects/${app.currentProjectId}/${tab}`)
}

function handleProjectChange(event: Event) {
  const target = event.target as HTMLSelectElement
  switchProject(target.value)
}
</script>

<template>
  <section class="project-layout">
    <header class="project-topbar">
      <button class="back-btn" @click="router.push('/projects')">← 项目管理</button>
      <div class="project-select-wrap">
        <div class="project-mark">IP</div>
        <select class="project-switcher" :value="app.currentProjectId" @change="handleProjectChange">
          <option v-for="project in app.projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
      </div>
      <nav class="project-tabs">
        <button v-for="tab in tabs" :key="tab.key" class="project-tab" :class="{ active: activeTab === tab.key }" @click="goTab(tab.key)">{{ tab.label }}</button>
      </nav>
      <div class="project-status">
        <span>{{ app.currentProject.type }} · {{ app.currentProject.stage }} · {{ app.currentProject.progress }}%</span>
        <span class="chip warn">{{ app.currentProject.stage }}</span>
      </div>
      <div class="project-actions">
        <!-- <button class="btn ghost" @click="goTab('settings')">设置</button> -->
        <!-- <button class="btn primary" @click="goTab('export')">导出</button> -->
        <!-- <button class="btn ghost" @click="app.toggleTheme">{{ app.isLight ? 'Dark' : 'Light' }}</button> -->
        <div class="avatar">P</div>
      </div>
    </header>
    <main class="project-main"><RouterView /></main>
  </section>
</template>
