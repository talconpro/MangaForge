<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import { mockApi } from '@/api/mock'
const router = useRouter()
const app = useAppStore()
const progress = ref(78)
const status = ref('Ready')
const uploadText = ref('Upload progress: 78%')
async function simulateUpload(){
  const result = await mockApi.uploadNovel()
  progress.value = result.progress
  status.value = 'Uploaded'
  uploadText.value = `Upload progress: ${result.progress}% · ${result.chapters} chapters detected`
  app.showToast('TXT 上传完成，章节识别成功')
}
function goChapters(){ router.push(`/projects/${app.currentProjectId}/chapters`) }
</script>
<template>
<section>
  <PageHead eyebrow="Project / Novel Import" title="小说导入" description="上传 TXT 小说，系统自动识别编码、统计字数并拆分章节。"><button class="btn primary" @click="app.showToast('章节结构已保存')">Save Chapters</button></PageHead>
  <div class="grid g2">
    <div class="card featured"><div class="upload"><div><div class="uploadicon">⇧</div><h2>Drop TXT Novel Here</h2><p>支持 UTF-8 / GBK。MVP 阶段建议文件 ≤ 50MB。</p><button class="btn primary" @click="simulateUpload">Select File</button></div></div></div>
    <div class="card"><div class="cardhead"><h2>File Telemetry</h2><span class="chip" :class="{ warn: status === 'Ready' }">{{ status }}</span></div><table class="table"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody><tr><td>File</td><td>yunzhou_old_dream.txt</td></tr><tr><td>Size</td><td>32.8 MB</td></tr><tr><td>Encoding</td><td>UTF-8</td></tr><tr><td>Word Count</td><td>1,280,000</td></tr><tr><td>Detected Chapters</td><td>120</td></tr></tbody></table><div class="progress" style="margin-top:18px"><span :style="{ width: progress + '%' }"></span></div><p class="muted" style="margin-top:12px">{{ uploadText }}</p></div>
  </div>
  <div class="card" style="margin-top:24px"><div class="cardhead"><h2>Chapter Detection Preview</h2><button class="btn secondary" @click="goChapters">Open Chapter Manager</button></div><table class="table"><thead><tr><th>#</th><th>Volume</th><th>Chapter</th><th>Words</th><th>Status</th></tr></thead><tbody><tr><td>001</td><td>第一卷</td><td>第1章 雨夜退婚</td><td>3,820</td><td><span class="chip">Normal</span></td></tr><tr><td>002</td><td>第一卷</td><td>第2章 重回沈家</td><td>4,120</td><td><span class="chip">Normal</span></td></tr><tr><td>003</td><td>第一卷</td><td>第3章 玉佩旧事</td><td>5,240</td><td><span class="chip warn">Long</span></td></tr></tbody></table></div>
</section>
</template>
