<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
const router = useRouter()
const app = useAppStore()
function goStoryboard(){ router.push(`/projects/${app.currentProjectId}/storyboard`) }
</script>
<template>
<section>
  <PageHead eyebrow="Project / Episode Adaptation" title="单话改编" description="选择 1～3 个章节，生成漫画单话方案、剧本与结尾钩子。"><button class="btn primary" @click="app.showToast('EpisodeAdaptAgent 已生成方案')">Generate Plan</button></PageHead>
  <div class="episode">
    <div class="card"><div class="cardhead"><h2>Source Chapters</h2></div><div class="list"><div class="item active"><strong>第1章 雨夜退婚</strong><div class="muted">selected</div></div><div class="item active"><strong>第2章 重回沈家</strong><div class="muted">selected</div></div><div class="item"><strong>第3章 玉佩旧事</strong><div class="muted">available</div></div></div></div>
    <div class="card"><div class="cardhead"><h2>Adapt Params</h2></div><div class="formrow"><div><label>Target Panels</label><input value="40"></div><div><label>Style</label><select><option>古风国漫条漫</option></select></div></div><div style="height:16px"></div><label>Adaptation Level</label><select><option>中等：压缩心理描写，强化冲突</option></select><div style="height:16px"></div><label>Rhythm Type</label><select><option>强冲突开场</option></select><div class="chips" style="margin-top:16px"><span class="chip">Hook enabled</span><span class="chip">Keep dialogue</span></div></div>
    <div class="card featured"><div class="cardhead"><h2>第 1 话：雨夜退婚</h2><span class="chip">Generated</span></div><p>沈青禾雨夜回到沈家，被迫面对家族安排的婚约，她在正厅中第一次公开反抗沈夫人。</p><div class="grid g2"><div><h3>Core Conflict</h3><p>女主反抗家族婚约。</p></div><div><h3>Ending Hook</h3><p>顾长渊看到她手中的玉佩。</p></div></div><div class="toolbar"><button class="btn secondary" @click="app.showToast('剧本页后续可独立实现')">Open Script</button><button class="btn primary" @click="goStoryboard">Generate Storyboard</button></div></div>
  </div>
</section>
</template>
