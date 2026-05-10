<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
const router = useRouter()
const app = useAppStore()
function goExport(){ router.push(`/projects/${app.currentProjectId}/export`) }
</script>
<template>
<section>
  <PageHead eyebrow="Project / Storyboard Editor" title="分镜编辑器" description="MVP 核心工作台：编辑分镜、维护角色一致性、复制 Prompt、进入导出。"><div class="toolbar"><button class="btn secondary" @click="app.showToast('全部 Prompt 已复制')">Copy All Prompts</button><button class="btn primary" @click="goExport">Export</button></div></PageHead>
  <div class="story">
    <aside class="card sticky"><div class="cardhead"><h2>Episode Context</h2></div><h3>第 1 话：雨夜退婚</h3><p>目标 40 格，当前 42 格。核心冲突：女主公开反抗家族婚约。</p><div class="chips"><span class="chip">沈青禾</span><span class="chip">沈夫人</span><span class="chip">顾长渊</span></div><div style="height:20px"></div><h3>Forbidden Rules</h3><p>沈青禾不能短发；顾长渊真实身份不能提前暴露；玉佩来源不能在第 1 话解释。</p><button class="btn primary" @click="app.showToast('StoryboardAgent 已入队')">Regenerate</button></aside>
    <div class="panels">
      <div class="panel active"><div class="ptop"><strong>Panel 01 · 沈家府门</strong><span class="chip">AI Draft</span></div><div class="fields"><div class="formrow"><div><label>Shot</label><input value="远景"></div><div><label>Characters</label><input value="沈青禾"></div></div><div><label>Image Description</label><textarea>雨夜，沈家府门前，少女独自站在雨幕中，朱红大门在闪电下显得压抑。</textarea></div><div class="formrow"><div><label>Narration</label><input value="她终于回来了。"></div><div><label>SFX</label><input value="哗——"></div></div><div><label>Prompt</label><textarea>古风国漫，雨夜府门，清冷少女，黑色长发，浅青色衣裙，电影感远景，雨水，朱红大门，高质量条漫分镜</textarea></div><div class="toolbar"><button class="btn secondary" @click="app.showToast('第 1 格 Prompt 已复制')">Copy Prompt</button><button class="btn primary" @click="app.showToast('分镜已保存')">Save</button><button class="btn danger">Delete</button></div></div></div>
      <div class="panel"><div class="ptop"><strong>Panel 02 · 玉佩特写</strong><span class="chip warn">Edited</span></div><div class="fields"><div><label>Image Description</label><textarea>少女袖中手指握紧玉佩，玉佩上旧纹在雨光中一闪而过。</textarea></div><div><label>Prompt</label><textarea>玉佩特写，少女手指，雨夜冷光，古风道具，细节丰富，悬念氛围</textarea></div><div class="toolbar"><button class="btn secondary" @click="app.showToast('第 2 格 Prompt 已复制')">Copy Prompt</button><button class="btn secondary">Regenerate Panel</button></div></div></div>
    </div>
    <aside class="card sticky"><div class="cardhead"><h2>Vertical Preview</h2><span class="chip">42 Panels</span></div><div class="phone"><div class="screen"><div class="comic"><strong>01 / 雨夜府门</strong><span class="bubble">她终于回来了。</span></div><div class="comic"><strong>02 / 玉佩特写</strong><span class="bubble">哗——</span></div><div class="comic"><strong>03 / 正厅对峙</strong><span class="bubble">这门婚事，由不得你。</span></div><div class="comic"><strong>04 / 女主抬眼</strong><span class="bubble">那我偏不认。</span></div></div></div><div style="height:20px"></div><h3>Active Prompt</h3><div class="code">古风国漫，雨夜府门，清冷少女，黑色长发，浅青色衣裙，电影感远景，雨水，朱红大门...</div></aside>
  </div>
</section>
</template>
