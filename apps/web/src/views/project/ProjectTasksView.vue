<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mockApi } from '@/api/mock'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import type { AgentTask } from '@/types'
const app = useAppStore()
const tasks = ref<AgentTask[]>([])
onMounted(async()=>{ tasks.value = await mockApi.getTasks() })
</script>
<template>
<section>
  <PageHead eyebrow="Project / Agent Queue" title="项目 AI 任务" description="只展示当前项目下的 HermesAgent 调用、耗时、失败原因与重试记录。"><button class="btn secondary" @click="app.showToast('任务列表已刷新')">Refresh</button></PageHead>
  <div class="card"><table class="table"><thead><tr><th>ID</th><th>Agent</th><th>Target</th><th>Status</th><th>Duration</th><th>Retry</th><th>Action</th></tr></thead><tbody><tr v-for="task in tasks" :key="task.id"><td>{{ task.id }}</td><td>{{ task.agent }}</td><td>{{ task.target }}</td><td><span class="chip" :class="{ warn: task.status === 'running', error: task.status === 'failed' }">{{ task.status }}</span></td><td>{{ task.duration }}</td><td>{{ task.retry }}</td><td><button class="btn secondary" @click="app.showToast(task.id + ' 操作已触发')">{{ task.status === 'failed' ? 'Retry' : 'Output' }}</button></td></tr></tbody></table></div>
</section>
</template>
