<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import type { ProjectResponse } from '@/types/project'

const props = defineProps<{
  visible: boolean
  project?: ProjectResponse | null
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  created: []
  updated: []
}>()

const store = useProjectsStore()
const isEdit = ref(false)

const form = reactive({
  project_name: '',
  novel_name: '',
  author: '',
  genre: '',
  comic_style: '',
  target_reader: '',
  adaptation_goal: '',
})

const loading = ref(false)
const errorMsg = ref('')

function resetForm(project?: ProjectResponse | null) {
  errorMsg.value = ''
  isEdit.value = Boolean(project)
  form.project_name = project?.project_name ?? ''
  form.novel_name = project?.novel_name ?? ''
  form.author = project?.author ?? ''
  form.genre = project?.genre ?? ''
  form.comic_style = project?.comic_style ?? ''
  form.target_reader = project?.target_reader ?? ''
  form.adaptation_goal = project?.adaptation_goal ?? ''
}

watch(
  [() => props.visible, () => props.project],
  ([visible]) => {
    if (visible) resetForm(props.project)
  },
)

function close() {
  emit('update:visible', false)
}

async function submit() {
  if (!form.project_name || !form.novel_name) {
    errorMsg.value = '请填写项目名称和小说名称'
    return
  }

  loading.value = true
  errorMsg.value = ''

  if (isEdit.value && props.project) {
    const result = await store.update(props.project.id, { ...form })
    loading.value = false
    if (!result) {
      errorMsg.value = store.error ?? '更新失败'
      return
    }
    emit('updated')
  } else {
    const result = await store.create({ ...form })
    loading.value = false
    if (!result) {
      errorMsg.value = store.error ?? '创建失败'
      return
    }
    emit('created')
  }

  close()
}
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="close">
    <div class="modal project-form-modal">
      <div class="modal-head">
        <div>
          <div class="eyebrow">{{ isEdit ? 'Update Project' : 'New Project' }}</div>
          <h2>{{ isEdit ? '编辑项目' : '创建 MangaForge 项目' }}</h2>
          <p>{{ isEdit ? '修改项目基础信息。' : '建立小说漫画改编项目后，即可进入导入与分析流程。' }}</p>
        </div>
        <button class="modal-close" @click="close">&times;</button>
      </div>

      <div class="project-form-grid">
        <div class="form-group">
          <label>项目名称</label>
          <input v-model="form.project_name" placeholder="例如：云州旧梦漫改" />
        </div>
        <div class="form-group">
          <label>小说名称</label>
          <input v-model="form.novel_name" placeholder="例如：云州旧梦" />
        </div>
        <div class="form-group">
          <label>作者</label>
          <input v-model="form.author" placeholder="例如：佚名" />
        </div>
        <div class="form-group">
          <label>题材</label>
          <input v-model="form.genre" placeholder="例如：古风、悬疑、都市" />
        </div>
        <div class="form-group">
          <label>漫画风格</label>
          <input v-model="form.comic_style" placeholder="例如：国漫条漫、日系清新" />
        </div>
        <div class="form-group">
          <label>目标读者</label>
          <input v-model="form.target_reader" placeholder="例如：女频读者、青年读者" />
        </div>
      </div>

      <div class="form-group project-form-full">
        <label>改编目标</label>
        <textarea
          v-model="form.adaptation_goal"
          placeholder="例如：改编为适合平台连载的竖版条漫，第一阶段先完成 3 话样章。"
        />
      </div>

      <p v-if="errorMsg" style="color: var(--error); margin: 12px 0;">{{ errorMsg }}</p>

      <div class="toolbar" style="justify-content: flex-end; margin-top: 18px;">
        <button class="btn btn-ghost" :disabled="loading" @click="close">取消</button>
        <button class="btn btn-primary" :disabled="loading" @click="submit">
          {{ loading ? '保存中...' : isEdit ? '保存修改' : '创建项目' }}
        </button>
      </div>
    </div>
  </div>
</template>
