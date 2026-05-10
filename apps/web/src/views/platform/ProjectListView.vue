<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import CreateProjectModal from '@/components/CreateProjectModal.vue'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()
const app = useAppStore()

const showModal = ref(false)

const statusLabels: Record<string, string> = {
  pending_upload: '待上传',
  parsing: '解析中',
  ready: '就绪',
  adapting: '改编中',
  completed: '已完成',
}

function statusLabel(s: string) {
  return statusLabels[s] || s
}

const hasItems = computed(() => store.items.length > 0)

function openProject(id: string) {
  app.setProject(id)
  router.push(`/projects/${id}/overview`)
}

function openCreate() {
  showModal.value = true
}

async function onCreated() {
  await store.fetchStats()
  app.showToast('项目已创建')
}

watch(
  () => route.query.create,
  (val) => {
    if (val === '1') {
      openCreate()
      router.replace({ query: {} })
    }
  },
)

onMounted(() => {
  store.fetchProjects()
  store.fetchStats()
  if (route.query.create === '1') {
    openCreate()
    router.replace({ query: {} })
  }
})
</script>

<template>
  <section>
    <PageHead eyebrow="Project Management" title="项目管理" description="管理所有小说漫改项目，快速查看状态、进度和下一步动作。">
      <button class="btn primary" @click="openCreate">+ 新增项目</button>
    </PageHead>

    <div v-if="store.loading" class="grid g3">
      <div v-for="n in 3" :key="n" class="skeleton" style="height: 220px" />
    </div>

    <div v-else-if="store.error && !hasItems" class="empty-state">
      <p>{{ store.error }}</p>
      <button class="btn primary" style="margin-top: 16px" @click="store.fetchProjects()">重试</button>
    </div>

    <div v-else-if="!hasItems" class="empty-state">
      <p>还没有项目，创建一个项目开始。</p>
      <button class="btn primary" style="margin-top: 16px" @click="openCreate">+ New Project</button>
    </div>

    <div v-else class="project-entry-grid">
      <div
        v-for="project in store.items"
        :key="project.id"
        class="project-entry-card"
        :class="{ featured: project.id === app.currentProjectId }"
        role="button"
        tabindex="0"
        @click="openProject(project.id)"
        @keyup.enter="openProject(project.id)"
        @keyup.space.prevent="openProject(project.id)"
      >
        <div class="project-entry-cover">
          <span class="chip project-entry-status" :class="{ warn: project.status !== 'completed' }">
            {{ statusLabel(project.status) }}
          </span>
        </div>
        <div class="project-entry-body">
          <h2 class="project-entry-title">{{ project.project_name }}</h2>
          <p class="project-entry-subtitle">
            {{ project.novel_name }}{{ project.author ? ' · ' + project.author : '' }}
          </p>
          <div class="project-entry-meta">
            {{ project.genre || '未分类' }}{{ project.comic_style ? ' · ' + project.comic_style : '' }}
          </div>
        </div>
      </div>
    </div>

    <CreateProjectModal
      v-model:visible="showModal"
      @created="onCreated"
    />
  </section>
</template>
