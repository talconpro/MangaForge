<script setup lang="ts">
import type { ProjectPageKey } from '@/types/mock'

defineProps<{ projectName: string; projectMeta: string; projectStage: string; page: string }>()
defineEmits<{ back: []; switchPage: [ProjectPageKey] }>()
</script>
<template>
  <header class="topbar">
    <div class="crumb">
      <button class="btn secondary" @click="$emit('back')">← 项目管理</button>
      <span style="display:block;margin-top:6px;">ProjectLayout / {{ projectName }}</span>
      <strong>{{ projectMeta }}</strong>
    </div>
    <div class="toolbar">
      <div class="chip">{{ projectStage }}</div>
      <button class="btn secondary" @click="$emit('switchPage','tasks')">项目任务</button>
      <button class="btn primary" @click="$emit('switchPage','storyboard')">继续分镜</button>
    </div>
  </header>
</template>
