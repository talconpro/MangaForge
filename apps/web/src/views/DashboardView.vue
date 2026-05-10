<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import CreateProjectModal from '@/components/CreateProjectModal.vue'

const router = useRouter()
const store = useProjectsStore()

const showCreateModal = ref(false)

async function loadData() {
  await Promise.all([store.fetchProjects(), store.fetchStats()])
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <h1>MangaForge 控制台</h1>
        <p>面向长篇小说 IP 的 AI 漫画改编生产系统，聚焦项目管理与分镜生产链路。</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-secondary">View Queue</button>
        <button class="btn btn-primary" @click="showCreateModal = true">+ New Project</button>
      </div>
    </div>

    <div class="grid grid-4">
      <div class="card metric featured">
        <div class="label">Active Projects</div>
        <span class="value">{{ store.stats?.total_projects ?? 0 }}</span>
        <div class="foot">项目总数</div>
      </div>
      <div class="card metric">
        <div class="label">Parsed Chapters</div>
        <span class="value">{{ store.stats?.total_analyzed_chapters ?? 0 }}</span>
        <div class="foot">已解析章节</div>
      </div>
      <div class="card metric">
        <div class="label">Comic Episodes</div>
        <span class="value">{{ store.stats?.total_episodes ?? 0 }}</span>
        <div class="foot">改编话数</div>
      </div>
      <div class="card metric">
        <div class="label">Export Assets</div>
        <span class="value">{{ store.stats?.total_exports ?? 0 }}</span>
        <div class="foot">导出次数</div>
      </div>
    </div>

    <div class="card featured" style="margin-top: 24px;">
      <div class="card-head">
        <h2>Project Workspace</h2>
        <span class="chip">Live</span>
      </div>

      <div v-if="store.loading" class="grid grid-3">
        <div v-for="n in 3" :key="n" class="skeleton" style="height: 200px;" />
      </div>

      <div v-else-if="store.items.length === 0" class="empty-state">
        还没有项目，创建一个项目开始。
      </div>

      <div v-else class="grid grid-3">
        <article
          v-for="project in store.items"
          :key="project.id"
          class="card"
        >
          <div class="card-head">
            <h3 style="margin: 0;">{{ project.project_name }}</h3>
            <span class="chip">{{ project.status }}</span>
          </div>
          <p>{{ project.novel_name }} / {{ project.author || '未知作者' }}</p>
          <div class="progress">
            <span :style="{ width: `${project.chapter_count ? Math.round((project.analyzed_chapter_count / project.chapter_count) * 100) : 0}%` }" />
          </div>
          <p style="font-size: 12px;">章节进度 {{ project.analyzed_chapter_count }}/{{ project.chapter_count || 0 }}</p>
          <button class="btn btn-primary" @click="router.push(`/projects/${project.id}`)">进入项目</button>
        </article>
      </div>
    </div>

    <CreateProjectModal v-model:visible="showCreateModal" @created="loadData" />
  </section>
</template>
