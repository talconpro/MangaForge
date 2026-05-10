<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
const router = useRouter()
const app = useAppStore()
function go(page: string) { router.push(`/projects/${app.currentProjectId}/${page}`) }
</script>
<template>
  <section>
    <PageHead eyebrow="Project / Overview" title="项目概览" description="这是独立 ProjectLayout。项目切换、项目内导航、状态和快捷操作都合并在同一个顶部栏。">
      <div class="toolbar"><button class="btn secondary" @click="go('tasks')">项目任务</button><button class="btn primary" @click="go('storyboard')">继续分镜</button></div>
    </PageHead>
    <div class="grid g4">
      <div class="card metric featured"><div class="label">总字数</div><span class="value">{{ app.currentProject.words }}</span><div class="foot">TXT uploaded</div></div>
      <div class="card metric"><div class="label">章节数</div><span class="value">{{ app.currentProject.chapters }}</span><div class="foot">{{ app.currentProject.parsedChapters }} parsed</div></div>
      <div class="card metric"><div class="label">角色卡</div><span class="value">42</span><div class="foot">12 reviewed</div></div>
      <div class="card metric"><div class="label">分镜格</div><span class="value">{{ app.currentProject.panels }}</span><div class="foot">42 active</div></div>
    </div>
    <div class="grid g2" style="margin-top:24px">
      <div class="card">
        <div class="cardhead"><h2>项目流程</h2><span class="chip warn">{{ app.currentProject.stage }}</span></div>
        <div class="pipeline">
          <div class="step"><div class="num">1</div><div><strong>小说导入</strong><div class="muted">{{ app.currentProject.words }} 字 / {{ app.currentProject.chapters }} 章</div></div><span class="chip">Done</span></div>
          <div class="step"><div class="num">2</div><div><strong>章节解析</strong><div class="muted">{{ app.currentProject.parsedChapters }} 章已完成</div></div><span class="chip">Done</span></div>
          <div class="step"><div class="num">3</div><div><strong>单话改编</strong><div class="muted">第 1 话剧本已生成</div></div><span class="chip">Done</span></div>
          <div class="step active"><div class="num">4</div><div><strong>分镜编辑</strong><div class="muted">42 格待审核</div></div><span class="chip warn">Active</span></div>
          <div class="step pending"><div class="num">5</div><div><strong>导出交付</strong><div class="muted">等待分镜确认</div></div><span class="chip secondary">Next</span></div>
        </div>
      </div>
      <div class="card featured"><div class="cardhead"><h2>下一步建议</h2><span class="chip">PM View</span></div><p>建议先完成第 1 话分镜编辑与 Prompt 质量检查，然后导出 Excel + Prompt TXT 作为样章制作资料。</p><div class="toolbar"><button class="btn primary" @click="go('storyboard')">进入分镜</button><button class="btn secondary" @click="go('export')">进入导出</button></div></div>
    </div>
  </section>
</template>
