<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import type { ProjectResponse } from '@/types/project'

const route = useRoute()
const store = useProjectsStore()

const project = ref<ProjectResponse | null>(null)
const loading = ref(false)
const error = ref('')

async function loadProject() {
  loading.value = true
  error.value = ''
  try {
    const data = await store.fetchDetail(route.params.id as string)
    if (!data) {
      error.value = '项目不存在或无权限访问'
      return
    }
    project.value = data
  } catch (e: any) {
    error.value = e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProject()
})
</script>

<template>
  <section>
    <div v-if="loading" class="skeleton" style="height: 320px;" />
    <div v-else-if="error" class="empty-state">{{ error }}</div>

    <template v-else-if="project">
      <div class="page-head">
        <div>
          <h1>{{ project.project_name }}</h1>
          <p>{{ project.novel_name }} / {{ project.author || '未知作者' }}</p>
        </div>
        <span class="chip warn">{{ project.status }}</span>
      </div>

      <div class="grid grid-3">
        <aside class="card">
          <div class="card-head">
            <h3>Episode Context</h3>
          </div>
          <p>目标章节：{{ project.chapter_count || 0 }}</p>
          <p>已解析：{{ project.analyzed_chapter_count }}</p>
          <p>已改编：{{ project.episode_count }}</p>
          <button class="btn btn-primary">Regenerate</button>
        </aside>

        <div class="card featured">
          <div class="card-head">
            <h3>Storyboard Editor</h3>
            <span class="chip">MVP</span>
          </div>
          <div class="form-group">
            <label>Panel Description</label>
            <textarea>雨夜，府门前，主角站在雨幕中，门内灯火通明。</textarea>
          </div>
          <div class="form-group">
            <label>Prompt</label>
            <textarea>古风国漫，雨夜府门，黑发少女，电影感构图，高质量条漫分镜。</textarea>
          </div>
          <div class="toolbar">
            <button class="btn btn-secondary">Copy Prompt</button>
            <button class="btn btn-primary">Save Panel</button>
          </div>
        </div>

        <aside class="card">
          <div class="card-head">
            <h3>Vertical Preview</h3>
          </div>
          <div class="upload-zone" style="min-height: 240px;">
            漫画预览区域
          </div>
        </aside>
      </div>

      <div class="card" style="margin-top: 24px;">
        <div class="card-head">
          <h3>Project Stats</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>指标</th>
              <th>数值</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>总字数</td><td>{{ project.word_count.toLocaleString() }}</td></tr>
            <tr><td>章节数</td><td>{{ project.chapter_count }}</td></tr>
            <tr><td>已解析章节</td><td>{{ project.analyzed_chapter_count }}</td></tr>
            <tr><td>导出次数</td><td>{{ project.export_count }}</td></tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>
