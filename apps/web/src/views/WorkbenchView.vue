<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/base/AppButton.vue'
import MetricCard from '@/components/base/MetricCard.vue'
import Modal from '@/components/base/Modal.vue'
import ThemeToggle from '@/components/base/ThemeToggle.vue'
import Toast from '@/components/base/Toast.vue'
import ExportFormatCards from '@/components/business/ExportFormatCards.vue'
import PlatformSidebar from '@/components/business/PlatformSidebar.vue'
import ProjectTabs from '@/components/business/ProjectTabs.vue'
import ProjectTopbar from '@/components/business/ProjectTopbar.vue'
import StoryboardPanelEditor from '@/components/business/StoryboardPanelEditor.vue'
import VerticalPreview from '@/components/business/VerticalPreview.vue'
import { useMockAuthStore } from '@/stores/mock-auth'
import { usePlatformStore } from '@/stores/platform'
import { useProjectStore } from '@/stores/project-v3'
import { useUiStore } from '@/stores/ui'
import type { PlatformPageKey, ProjectPageKey } from '@/types/mock'

const ui = useUiStore()
const platform = usePlatformStore()
const project = useProjectStore()
const auth = useMockAuthStore()

const { theme, layoutMode, platformPage, projectPage, toastMessage, toastVisible, createModalVisible } = storeToRefs(ui)
const { dashboard, projects } = storeToRefs(platform)
const { data, currentName, uploadProgress, uploadStatus, uploadText, selectedExportType } = storeToRefs(project)

const loginForm = reactive({ account: 'demo@mangaforge.ai', password: '123456' })

const pageTitle = computed(() => {
  const map: Record<PlatformPageKey, string> = {
    'platform-dashboard': '工作台',
    'platform-projects': '项目管理',
    'platform-assets': '资产库',
    'platform-system': '系统管理',
  }
  return map[platformPage.value]
})

const projectMeta = computed(() => data.value?.overview.meta ?? '')
const projectStage = computed(() => data.value?.overview.stage ?? '')

function themeLabel() {
  return theme.value === 'light' ? 'Dark' : 'Light'
}

async function handleLogin() {
  await auth.login(loginForm.account, loginForm.password)
  layoutMode.value = 'platform'
  ui.showToast('登录成功，进入 PlatformLayout')
}

function showPlatformPage(page: PlatformPageKey) {
  layoutMode.value = 'platform'
  platformPage.value = page
}

async function enterProject(name = '云州旧梦', page: ProjectPageKey = 'overview') {
  await project.loadProject(name)
  layoutMode.value = 'project'
  projectPage.value = page
  ui.showToast(`进入 ProjectLayout：${name}`)
}

function backToPlatform() {
  layoutMode.value = 'platform'
  platformPage.value = 'platform-projects'
  ui.showToast('已返回 PlatformLayout / 项目管理')
}

function showProjectPage(page: ProjectPageKey) {
  projectPage.value = page
}

onMounted(async () => {
  document.body.classList.toggle('light', theme.value === 'light')
  await platform.load()
  await project.loadProject('云州旧梦')
})

function toggleTheme() {
  ui.toggleTheme()
  document.body.classList.toggle('light', theme.value === 'light')
}
</script>

<template>
  <section v-if="layoutMode==='login'" class="login-layout">
    <div class="login-hero">
      <div class="brand"><div class="logo">MF</div><div><strong>MangaForge</strong><span>AI Comic Workbench</span></div></div>
      <h1>用 AI 把长篇小说锻造成可连载漫画</h1>
      <p>MangaForge 面向网文作者、IP 方和漫画工作室，提供小说导入、AI 解析、知识库、单话改编、分镜与导出能力。</p>
      <div class="grid grid-3" style="margin-top:32px;">
        <div class="card"><strong>500W+</strong><p>支持百万字小说拆解</p></div>
        <div class="card"><strong>30-60</strong><p>单话分镜格数</p></div>
        <div class="card"><strong>5种</strong><p>导出交付格式</p></div>
      </div>
    </div>
    <div class="login-panel">
      <div class="login-card">
        <h2>进入工作台</h2>
        <div class="form-group"><label>账号</label><input v-model="loginForm.account" /></div>
        <div class="form-group"><label>密码</label><input v-model="loginForm.password" type="password" /></div>
        <AppButton variant="primary" style="width:100%;" @click="handleLogin">登录</AppButton>
        <ThemeToggle :label="'切换暗色 / 亮色'" @toggle="toggleTheme" style="margin-top:12px;width:100%;" />
      </div>
    </div>
  </section>

  <section v-else-if="layoutMode==='platform'" class="app-shell">
    <PlatformSidebar :page="platformPage" :project-name="currentName" @switch-platform="showPlatformPage" @enter-project="enterProject" />
    <main class="main">
      <header class="topbar">
        <div class="crumb"><span>MangaForge / PlatformLayout</span><strong>{{ pageTitle }}</strong></div>
        <div class="toolbar">
          <AppButton variant="secondary">Share</AppButton>
          <AppButton variant="primary" @click="createModalVisible=true">+ New Project</AppButton>
          <ThemeToggle :label="themeLabel()" @toggle="toggleTheme" />
        </div>
      </header>
      <div class="content" v-if="platformPage==='platform-dashboard'">
        <div class="page-head"><div><h1>平台工作台</h1><p>查看全局项目与生产态势。</p></div><AppButton variant="primary" @click="enterProject('云州旧梦','overview')">进入 ProjectLayout</AppButton></div>
        <div class="grid grid-4" v-if="dashboard">
          <MetricCard label="Active Projects" :value="dashboard.activeProjects" foot="+2 this week" :featured="true" />
          <MetricCard label="Parsed Chapters" :value="dashboard.parsedChapters" foot="92.4% success" />
          <MetricCard label="Comic Episodes" :value="dashboard.comicEpisodes" foot="1,642 panels" />
          <MetricCard label="Export Assets" :value="dashboard.exportAssets" foot="Excel / Word / HTML" />
        </div>
      </div>
      <div class="content" v-else-if="platformPage==='platform-projects'">
        <div class="page-head"><div><h1>项目管理</h1><p>管理所有小说改编项目。</p></div><AppButton variant="primary" @click="createModalVisible=true">Create Project</AppButton></div>
        <div class="grid grid-3">
          <div class="card" v-for="p in projects" :key="p.id">
            <div class="card-head"><h3>{{ p.name }}</h3><span class="chip warn">{{ p.status }}</span></div>
            <p>{{ p.subtitle }}</p>
            <div class="progress"><span :style="{ width: `${p.progress}%` }" /></div>
            <div class="toolbar"><AppButton variant="primary" @click="enterProject(p.name,'overview')">进入项目</AppButton><AppButton variant="secondary">Settings</AppButton></div>
          </div>
        </div>
      </div>
      <div class="content" v-else-if="platformPage==='platform-assets'">
        <div class="page-head"><div><h1>资产库</h1><p>统一管理角色卡、风格、Prompt模板。</p></div></div>
        <div class="card">资产库原型区块（按 v0.3 静态还原）</div>
      </div>
      <div class="content" v-else>
        <div class="page-head"><div><h1>系统管理</h1><p>平台状态、队列与管理员设置。</p></div></div>
        <div class="card">系统管理原型区块（按 v0.3 静态还原）</div>
      </div>
    </main>
  </section>

  <section v-else class="main" style="min-height:100vh;">
    <ProjectTopbar :project-name="currentName" :project-meta="projectMeta" :project-stage="projectStage" :page="projectPage" @back="backToPlatform" @switch-page="showProjectPage" />
    <div class="content">
      <ProjectTabs :page="projectPage" @switch-page="showProjectPage" />

      <section v-if="projectPage==='overview'">
        <div class="page-head"><div><h1>项目概览</h1><p>{{ projectMeta }}</p></div><AppButton variant="primary" @click="showProjectPage('storyboard')">进入分镜</AppButton></div>
        <div class="grid grid-4">
          <MetricCard label="章节进度" :value="data?.overview.chapterProgress || '-'" foot="已解析/总章节" :featured="true" />
          <MetricCard label="单话进度" :value="data?.overview.episodeProgress || '-'" foot="已完成/计划" />
          <MetricCard label="当前阶段" :value="data?.overview.stage || '-'" foot="Pipeline Stage" />
          <MetricCard label="当前项目" :value="currentName" foot="Active Project" />
        </div>
      </section>

      <section v-else-if="projectPage==='import'" class="grid grid-2">
        <div class="card upload-zone"><div><h3>拖拽或选择小说文件</h3><p>{{ uploadText }}</p><AppButton variant="primary" @click="project.runSimulateUpload(); ui.showToast('TXT 上传完成，章节识别成功')">Select File</AppButton></div></div>
        <div class="card"><h3>导入状态</h3><p><span class="chip">{{ uploadStatus }}</span></p><div class="progress"><span :style="{ width: `${uploadProgress}%` }" /></div></div>
      </section>

      <section v-else-if="projectPage==='chapters'" class="card">
        <div class="card-head"><h3>章节列表</h3><AppButton variant="primary" @click="ui.showToast('章节结构已保存')">Save Chapters</AppButton></div>
        <div class="list"><div class="list-item" v-for="c in data?.chapters" :key="c.id"><strong>{{ c.title }}</strong><p>{{ c.words }} words · {{ c.status }}</p></div></div>
      </section>

      <section v-else-if="projectPage==='analysis'" class="grid grid-2">
        <div class="card featured"><div class="card-head"><h3>NovelChapterAnalysisAgent</h3><span class="chip" :class="{ warn: data?.analysis.status==='Running' }">{{ data?.analysis.status }}</span></div><p>{{ data?.analysis.summary }}</p><AppButton variant="secondary" @click="project.runRerunAnalysis(); ui.showToast('AI 解析完成，JSON Schema 校验通过')">Re-run Agent</AppButton></div>
        <div class="card"><h3>人物</h3><div class="toolbar"><span v-for="c in data?.analysis.characters" :key="c" class="chip">{{ c }}</span></div><h3 style="margin-top:18px;">关键事件</h3><div class="list"><div class="list-item" v-for="e in data?.analysis.events" :key="e">{{ e }}</div></div></div>
      </section>

      <section v-else-if="projectPage==='knowledge'" class="card">
        <div class="card-head"><h3>小说知识库</h3><AppButton variant="primary" @click="ui.showToast('角色卡已创建')">+ Character</AppButton></div>
        <p>维护角色、事件、场景、伏笔与禁改设定。</p>
      </section>

      <section v-else-if="projectPage==='episode'" class="card">
        <div class="card-head"><h3>单话改编</h3><AppButton variant="primary" @click="ui.showToast('EpisodeAdaptAgent 已生成方案')">Generate Plan</AppButton></div>
        <p>选择章节生成单话方案、剧本与结尾钩子。</p>
      </section>

      <section v-else-if="projectPage==='storyboard'" class="grid" style="grid-template-columns:1fr 1fr 360px;">
        <div class="card"><div class="card-head"><h3>Episode Context</h3></div><p>目标 40 格，当前 42 格。核心冲突：女主公开反抗家族婚约。</p><AppButton variant="primary" @click="ui.showToast('StoryboardAgent 已入队')">Regenerate</AppButton></div>
        <div class="grid" style="gap:16px;">
          <StoryboardPanelEditor v-for="p in data?.storyboardPanels" :key="p.id" :panel="p" @copy="ui.showToast('Prompt 已复制')" @save="ui.showToast('分镜已保存')" />
        </div>
        <VerticalPreview :bubbles="['她终于回来了。','咔——','这门婚事，由不得你。','那我偏不认。']" />
      </section>

      <section v-else-if="projectPage==='export'">
        <div class="page-head"><div><h1>导出中心</h1><p>将分镜表和 Prompt 导出为交付资料。</p></div><AppButton variant="primary" @click="ui.showToast('导出任务已创建')">Start Export</AppButton></div>
        <ExportFormatCards :active="selectedExportType" @select="selectedExportType=$event" />
        <div class="card" style="margin-top:24px;">
          <div class="card-head"><h3>Export History</h3></div>
          <table class="table"><thead><tr><th>File</th><th>Type</th><th>Status</th><th>Size</th><th>Action</th></tr></thead><tbody><tr v-for="r in data?.exports" :key="r.file"><td>{{ r.file }}</td><td>{{ r.type }}</td><td><span class="chip" :class="{ warn: r.status==='Running' }">{{ r.status }}</span></td><td>{{ r.size }}</td><td><AppButton variant="secondary" @click="ui.showToast('原型不生成真实文件')">Download</AppButton></td></tr></tbody></table>
        </div>
      </section>

      <section v-else class="card">
        <div class="card-head"><h3>项目 AI 任务</h3><AppButton variant="secondary" @click="ui.showToast('任务列表已刷新')">Refresh</AppButton></div>
        <table class="table"><thead><tr><th>ID</th><th>Agent</th><th>Target</th><th>Status</th><th>Duration</th><th>Retry</th><th>Action</th></tr></thead><tbody><tr v-for="t in data?.tasks" :key="t.id"><td>{{ t.id }}</td><td>{{ t.agent }}</td><td>{{ t.target }}</td><td><span class="chip" :class="{ warn: t.status==='Running', error: t.status==='Failed' }">{{ t.status }}</span></td><td>{{ t.duration }}</td><td>{{ t.retry }}</td><td><AppButton v-if="t.status==='Failed'" variant="primary" @click="project.retryTask(t.id); ui.showToast(`任务 ${t.id} 已重试`)">Retry</AppButton><AppButton v-else variant="secondary">Trace</AppButton></td></tr></tbody></table>
      </section>
    </div>
  </section>

  <Modal :visible="createModalVisible" @close="createModalVisible=false">
    <div class="modal-head"><div><div class="nav-label" style="padding:0;">New Project</div><h2>创建 MangaForge 项目</h2><p>建立项目后即可进入小说导入与 AI 解析流程。</p></div><button class="modal-close" @click="createModalVisible=false">×</button></div>
    <div class="grid grid-2">
      <div class="form-group"><label>项目名称</label><input value="云州旧梦漫改" /></div>
      <div class="form-group"><label>小说名称</label><input value="云州旧梦" /></div>
      <div class="form-group"><label>作者名</label><input value="佚名" /></div>
      <div class="form-group"><label>小说类型</label><input value="古风" /></div>
    </div>
    <div class="toolbar" style="justify-content:flex-end;margin-top:16px;"><AppButton variant="secondary" @click="createModalVisible=false">Cancel</AppButton><AppButton variant="primary" @click="createModalVisible=false; enterProject('云州旧梦','import')">Create</AppButton></div>
  </Modal>

  <Toast :text="toastMessage" :visible="toastVisible" />
</template>
