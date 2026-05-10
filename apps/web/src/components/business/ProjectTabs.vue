<script setup lang="ts">
import type { ProjectPageKey } from '@/types/mock'
defineProps<{ page: ProjectPageKey }>()
defineEmits<{ switchPage: [ProjectPageKey] }>()
const tabs: { key: ProjectPageKey; label: string }[] = [
  { key: 'overview', label: '概览' },
  { key: 'import', label: '导入' },
  { key: 'chapters', label: '章节' },
  { key: 'analysis', label: '解析' },
  { key: 'knowledge', label: '知识库' },
  { key: 'episode', label: '单话' },
  { key: 'storyboard', label: '分镜' },
  { key: 'export', label: '导出' },
  { key: 'tasks', label: '任务' },
]
</script>
<template>
  <div class="toolbar" style="margin-bottom:20px;">
    <button v-for="t in tabs" :key="t.key" class="btn secondary" :class="{ active: page===t.key }" @click="$emit('switchPage',t.key)">{{ t.label }}</button>
  </div>
</template>
