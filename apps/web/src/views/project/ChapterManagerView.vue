<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockApi } from '@/api/mock'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import type { Chapter } from '@/types'
const router = useRouter()
const app = useAppStore()
const chapters = ref<Chapter[]>([])
onMounted(async()=>{ chapters.value = await mockApi.getChapters() })
</script>
<template>
<section>
  <PageHead eyebrow="Project / Chapter Operations" title="章节管理" description="查看、编辑、合并、拆分章节，并批量创建 AI 解析任务。"><div class="toolbar"><button class="btn secondary" @click="app.showToast('批量解析任务已入队')">Batch Analyze</button><button class="btn primary" @click="router.push(`/projects/${app.currentProjectId}/analysis`)">Analyze Current</button></div></PageHead>
  <div class="split">
    <div class="card"><div class="cardhead"><h2>Chapter List</h2><span class="chip">{{ chapters.length || 120 }}</span></div><div class="list"><div v-for="(chapter,index) in chapters" :key="chapter.no" class="item" :class="{ active:index===0 }"><strong>{{ chapter.title }}</strong><div class="muted">{{ chapter.words }} words · {{ chapter.status }}</div></div></div></div>
    <div class="card featured"><div class="cardhead"><h2>第1章 雨夜退婚</h2><span class="chip">Analyzed</span></div><p>卷名：第一卷 · 字数：3,820 · 更新时间：今天 14:32</p><div class="code">雨下得很急。\n\n沈青禾站在沈家府门前，任由雨水顺着发梢落下。朱红大门缓缓打开，门内灯火通明，却没有一盏灯是为她而点。\n\n“小姐，夫人已经在正厅等您。”\n\n她握紧袖中的玉佩，轻声道：“知道了。”</div><div class="grid g2" style="margin-top:24px"><div class="card"><h3>AI Summary</h3><p>沈青禾雨夜回到沈家，被沈夫人逼迫接受婚约，最终当众退婚。</p></div><div class="card"><h3>Key Events</h3><div class="chips"><span class="chip">雨夜归家</span><span class="chip">正厅对峙</span><span class="chip">当众退婚</span></div></div></div></div>
  </div>
</section>
</template>
