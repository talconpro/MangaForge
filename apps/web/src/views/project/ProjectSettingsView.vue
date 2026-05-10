<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import type { ProjectResponse } from '@/types/project'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()
const app = useAppStore()

const project = ref<ProjectResponse | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const saveError = ref('')
const saved = ref(false)

const deleting = ref(false)
const deleteConfirm = ref(false)
const deleteError = ref('')

const statusOptions = [
  { value: 'pending_upload', label: '待上传' },
  { value: 'parsing', label: '解析中' },
  { value: 'ready', label: '就绪' },
  { value: 'adapting', label: '改编中' },
  { value: 'completed', label: '已完成' },
]

const form = reactive({
  project_name: '',
  novel_name: '',
  author: '',
  genre: '',
  comic_style: '',
  target_reader: '',
  adaptation_goal: '',
  status: '',
})

const hasChanges = computed(() => {
  if (!project.value) return false
  const p = project.value
  return (
    form.project_name !== p.project_name ||
    form.novel_name !== p.novel_name ||
    form.author !== p.author ||
    form.genre !== p.genre ||
    form.comic_style !== p.comic_style ||
    form.target_reader !== p.target_reader ||
    form.adaptation_goal !== p.adaptation_goal ||
    form.status !== p.status
  )
})

watch(
  () => route.params.projectId,
  (id) => {
    if (typeof id === 'string') loadProject(id)
  },
)

function fill(project: ProjectResponse) {
  form.project_name = project.project_name
  form.novel_name = project.novel_name
  form.author = project.author
  form.genre = project.genre
  form.comic_style = project.comic_style
  form.target_reader = project.target_reader
  form.adaptation_goal = project.adaptation_goal
  form.status = project.status
}

async function loadProject(id: string) {
  loading.value = true
  error.value = ''
  saved.value = false
  saveError.value = ''
  const data = await store.fetchDetail(id)
  if (!data) {
    error.value = '项目不存在或无权限访问'
    loading.value = false
    return
  }
  project.value = data
  fill(data)
  loading.value = false
}

async function handleSave() {
  if (!project.value) return
  if (!form.project_name || !form.novel_name) {
    saveError.value = '项目名称和小说名称为必填'
    return
  }
  saving.value = true
  saveError.value = ''
  saved.value = false
  const result = await store.update(project.value.id, { ...form })
  saving.value = false
  if (!result) {
    saveError.value = store.error ?? '保存失败'
    return
  }
  project.value = result
  fill(result)
  saved.value = true
  app.showToast('项目设置已保存')
  setTimeout(() => { saved.value = false }, 3000)
}

async function handleDelete() {
  if (!project.value) return
  deleting.value = true
  deleteError.value = ''
  const ok = await store.remove(project.value.id)
  deleting.value = false
  if (!ok) {
    deleteError.value = store.error ?? '删除失败'
    return
  }
  app.showToast('项目已删除')
  router.push('/projects')
}

onMounted(() => {
  loadProject(route.params.projectId as string)
})
</script>

<template>
  <section>
    <PageHead eyebrow="Project / Settings" title="项目设置" description="修改项目基本信息、状态，或删除项目。">
      <div class="toolbar">
        <button
          class="btn primary"
          :disabled="!hasChanges || saving"
          @click="handleSave"
        >
          {{ saving ? '保存中...' : saved ? '✓ 已保存' : '保存设置' }}
        </button>
      </div>
    </PageHead>

    <div v-if="loading" class="skeleton" style="height: 320px" />
    <div v-else-if="error" class="empty-state">
      <p>{{ error }}</p>
    </div>

    <template v-else-if="project">
      <!-- Edit form -->
      <div class="card featured" style="margin-bottom: 24px">
        <div class="cardhead">
          <h2>基本信息</h2>
          <span class="chip" :class="{ warn: project.status !== 'completed' }">
            {{ project.status }}
          </span>
        </div>

        <div class="grid g2">
          <div class="form-group">
            <label>项目名称</label>
            <input v-model="form.project_name" />
          </div>
          <div class="form-group">
            <label>小说名称</label>
            <input v-model="form.novel_name" />
          </div>
          <div class="form-group">
            <label>作者</label>
            <input v-model="form.author" />
          </div>
          <div class="form-group">
            <label>题材</label>
            <input v-model="form.genre" />
          </div>
          <div class="form-group">
            <label>漫画风格</label>
            <input v-model="form.comic_style" />
          </div>
          <div class="form-group">
            <label>目标读者</label>
            <input v-model="form.target_reader" />
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="form.status">
              <option v-for="s in statusOptions" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>改编目标</label>
          <textarea v-model="form.adaptation_goal" />
        </div>

        <p v-if="saveError" style="color: var(--error); font-size: 13px">{{ saveError }}</p>
      </div>

      <!-- Stats card -->
      <div class="card" style="margin-bottom: 24px">
        <div class="cardhead"><h2>项目统计</h2></div>
        <table class="table">
          <thead>
            <tr><th>指标</th><th>值</th></tr>
          </thead>
          <tbody>
            <tr><td>ID</td><td style="font-family: monospace; font-size: 12px">{{ project.id }}</td></tr>
            <tr><td>总字数</td><td>{{ project.word_count.toLocaleString() }}</td></tr>
            <tr><td>章节数</td><td>{{ project.chapter_count }}</td></tr>
            <tr><td>已解析章节</td><td>{{ project.analyzed_chapter_count }}</td></tr>
            <tr><td>话数</td><td>{{ project.episode_count }}</td></tr>
            <tr><td>导出次数</td><td>{{ project.export_count }}</td></tr>
            <tr><td>创建时间</td><td>{{ new Date(project.created_at).toLocaleString('zh-CN') }}</td></tr>
            <tr><td>更新时间</td><td>{{ new Date(project.updated_at).toLocaleString('zh-CN') }}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Danger zone -->
      <div class="card" style="border-color: rgba(255, 180, 171, 0.4)">
        <div class="cardhead">
          <h2 style="color: var(--error)">删除项目</h2>
        </div>
        <p style="margin-bottom: 14px">删除后所有章节、解析、分镜、导出数据将永久丢失，不可恢复。</p>

        <div v-if="!deleteConfirm">
          <button class="btn btn-danger" @click="deleteConfirm = true">删除此项目</button>
        </div>
        <div v-else>
          <p style="color: var(--error); font-size: 13px; margin-bottom: 12px">
            确认删除「{{ project.project_name }}」？此操作不可撤销。
          </p>
          <p v-if="deleteError" style="color: var(--error); font-size: 12px; margin-bottom: 12px">
            {{ deleteError }}
          </p>
          <div class="toolbar">
            <button class="btn btn-danger" :disabled="deleting" @click="handleDelete">
              {{ deleting ? '删除中...' : '确认删除' }}
            </button>
            <button class="btn btn-ghost" :disabled="deleting" @click="deleteConfirm = false; deleteError = ''">
              取消
            </button>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
