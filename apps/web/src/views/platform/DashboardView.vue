<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'

const router = useRouter()
const app = useAppStore()
function enter(page = 'overview') {
  router.push(`/projects/${app.currentProjectId}/${page}`)
}
</script>

<template>
  <section>
    <PageHead eyebrow="AI Novel-to-Comic Pipeline" title="MangaForge工作台" description="面向长篇小说 IP 的 AI 漫画改编生产系统：拆章、解析、知识库、单话改编、分镜、Prompt 与导出。">
      <div class="toolbar">
        <!-- <button class="btn secondary" @click="router.push('/projects')">Open Projects</button> -->
        <!-- <button class="btn primary" @click="enter('overview')">Enter Active Project</button> -->
      </div>
    </PageHead>

    <div class="grid g4">
      <div class="card metric featured">
        <div class="label">Active Projects</div><span class="value">12</span>
        <div class="foot">3 active</div>
      </div>
      <div class="card metric">
        <div class="label">AI Jobs</div><span class="value">47</span>
        <div class="foot">3 running</div>
      </div>
      <div class="card metric">
        <div class="label">Export Assets</div><span class="value">91</span>
        <div class="foot">23 this week</div>
      </div>
      <div class="card metric">
        <div class="label">Team Members</div><span class="value">8</span>
        <div class="foot">MVP demo</div>
      </div>
    </div>

    <div class="grid g2" style="margin-top:24px">
      <div class="card hero featured">
        <div class="eyebrow">Featured Project</div>
        <div class="hero-title">{{ app.currentProject.name }} · 第 1 话正在进入分镜精修</div>
        <p>点击进入项目后，会跳转到独立 ProjectLayout：项目切换、项目内导航、状态和快捷操作都在同一个顶部栏。</p>
        <div class="chips" style="margin:22px 0"><span class="chip">{{ app.currentProject.style }}</span><span
            class="chip">42 Panels</span><span class="chip warn">Review Needed</span></div>
        <div class="progress"><span :style="{ width: app.currentProject.progress + '%' }"></span></div>
        <p class="muted" style="margin-top:12px">Project progress: {{ app.currentProject.progress }}%</p>
        <div class="toolbar" style="margin-top:22px"><button class="btn primary" @click="enter('storyboard')">
          进入项目
        </button><button class="btn secondary" @click="enter('export')">查看导出</button></div>
      </div>

      <div class="card">
        <div class="cardhead">
          <h2>全局任务队列</h2><span class="chip">Live</span>
        </div>
        <div class="pipeline">
          <div class="step">
            <div class="num">1</div>
            <div><strong>NovelChapterAnalysisAgent</strong>
              <div class="muted">霓虹尽头 · 第 19 章</div>
            </div><span class="chip warn">Running</span>
          </div>
          <div class="step active">
            <div class="num">2</div>
            <div><strong>StoryboardAgent</strong>
              <div class="muted">云州旧梦 · 第 1 话</div>
            </div><span class="chip warn">Review</span>
          </div>
          <div class="step">
            <div class="num">3</div>
            <div><strong>ExportWorker</strong>
              <div class="muted">社恐女孩与猫 · HTML</div>
            </div><span class="chip">Done</span>
          </div>
          <div class="step pending">
            <div class="num">4</div>
            <div><strong>ConsistencyCheckAgent</strong>
              <div class="muted">等待执行</div>
            </div><span class="chip secondary">Queued</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
