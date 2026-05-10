import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
import LoginView from '@/views/LoginView.vue'
import PlatformLayout from '@/layouts/PlatformLayout.vue'
import ProjectLayout from '@/layouts/ProjectLayout.vue'
import DashboardView from '@/views/platform/DashboardView.vue'
import ProjectListView from '@/views/platform/ProjectListView.vue'
import AssetLibraryView from '@/views/platform/AssetLibraryView.vue'
import SystemSettingsView from '@/views/platform/SystemSettingsView.vue'
import ProjectOverviewView from '@/views/project/ProjectOverviewView.vue'
import NovelImportView from '@/views/project/NovelImportView.vue'
import ChapterManagerView from '@/views/project/ChapterManagerView.vue'
import AnalysisView from '@/views/project/AnalysisView.vue'
import KnowledgeBaseView from '@/views/project/KnowledgeBaseView.vue'
import EpisodeAdaptView from '@/views/project/EpisodeAdaptView.vue'
import StoryboardEditorView from '@/views/project/StoryboardEditorView.vue'
import ExportCenterView from '@/views/project/ExportCenterView.vue'
import ProjectTasksView from '@/views/project/ProjectTasksView.vue'
import ProjectSettingsView from '@/views/project/ProjectSettingsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    {
      path: '/',
      component: PlatformLayout,
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: DashboardView },
        { path: 'projects', name: 'projects', component: ProjectListView },
        { path: 'assets', name: 'assets', component: AssetLibraryView },
        { path: 'system', name: 'system', component: SystemSettingsView },
      ],
    },
    {
      path: '/projects/:projectId',
      component: ProjectLayout,
      children: [
        { path: '', redirect: (to) => `/projects/${to.params.projectId}/overview` },
        { path: 'overview', name: 'project-overview', component: ProjectOverviewView },
        { path: 'import', name: 'project-import', component: NovelImportView },
        { path: 'chapters', name: 'project-chapters', component: ChapterManagerView },
        { path: 'analysis', name: 'project-analysis', component: AnalysisView },
        { path: 'knowledge', name: 'project-knowledge', component: KnowledgeBaseView },
        { path: 'episodes', name: 'project-episodes', component: EpisodeAdaptView },
        { path: 'storyboard', name: 'project-storyboard', component: StoryboardEditorView },
        { path: 'export', name: 'project-export', component: ExportCenterView },
        { path: 'tasks', name: 'project-tasks', component: ProjectTasksView },
        { path: 'settings', name: 'project-settings', component: ProjectSettingsView },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const app = useAppStore()
  if (!to.meta.public && !app.token) return '/login'
  return true
})

export default router
