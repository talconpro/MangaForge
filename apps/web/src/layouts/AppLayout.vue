<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const userInitial = computed(() => authStore.user?.username?.charAt(0).toUpperCase() ?? 'U')
const title = computed(() => (route.name === 'project-detail' ? '项目工作台 / 详情' : '项目工作台'))
const kicker = computed(() => (route.name === 'project-detail' ? 'MangaForge / Storyboard' : 'MangaForge / Projects'))

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">MF</div>
        <div>
          <div class="brand-title">MangaForge</div>
          <div class="brand-sub">AI Comic Workbench</div>
        </div>
      </div>

      <div>
        <div class="nav-label">Workspace</div>
        <nav class="nav" style="margin-top: 10px;">
          <router-link to="/projects" class="nav-item" active-class="active">项目总览</router-link>
        </nav>
      </div>

      <div class="sidebox">
        <div class="nav-label" style="padding: 0; margin-bottom: 12px;">System Status</div>
        <div class="sidebox-row"><span>HermesAgent</span><strong style="color: var(--primary);">Online</strong></div>
        <div class="sidebox-row"><span>User</span><strong>{{ authStore.user?.username ?? 'Demo' }}</strong></div>
        <div class="sidebox-row"><span>Current Route</span><strong>{{ route.name }}</strong></div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div class="crumb">
          <span>{{ kicker }}</span>
          <strong>{{ title }}</strong>
        </div>
        <div class="toolbar">
          <input class="search" placeholder="Search projects, chapters, agents..." />
          <button class="btn btn-secondary" @click="logout">退出</button>
          <div class="avatar">{{ userInitial }}</div>
        </div>
      </header>

      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>
