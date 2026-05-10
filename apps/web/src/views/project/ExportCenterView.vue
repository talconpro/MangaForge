<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mockApi } from '@/api/mock'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import type { ExportAsset } from '@/types'
const app = useAppStore()
const assets = ref<ExportAsset[]>([])
onMounted(async()=>{ assets.value = await mockApi.getExports() })
</script>
<template>
<section>
  <PageHead eyebrow="Project / Production Export" title="导出中心" description="将单话漫画剧本、分镜表和 Prompt 导出为制作团队可交付资料。"><button class="btn primary" @click="app.showToast('导出任务已创建')">Start Export</button></PageHead>
  <div class="exports"><div class="card export active"><div class="cardhead"><h2>Excel</h2><span class="chip">Recommended</span></div><p>分镜表格，适合制作流转。</p></div><div class="card export"><div class="cardhead"><h2>Word</h2></div><p>漫画剧本 + 分镜说明。</p></div><div class="card export"><div class="cardhead"><h2>HTML</h2></div><p>竖版漫画结构预览。</p></div><div class="card export"><div class="cardhead"><h2>JSON</h2></div><p>结构化原始数据。</p></div><div class="card export"><div class="cardhead"><h2>Prompt TXT</h2></div><p>全部绘图提示词。</p></div></div>
  <div class="card" style="margin-top:24px"><div class="cardhead"><h2>Export History</h2></div><table class="table"><thead><tr><th>File</th><th>Type</th><th>Status</th><th>Size</th><th>Action</th></tr></thead><tbody><tr v-for="asset in assets" :key="asset.file"><td>{{ asset.file }}</td><td>{{ asset.type }}</td><td><span class="chip" :class="{ warn: asset.status === 'Running' }">{{ asset.status }}</span></td><td>{{ asset.size }}</td><td><button class="btn secondary" @click="app.showToast('原型不生成真实文件')">Download</button></td></tr></tbody></table></div>
</section>
</template>
