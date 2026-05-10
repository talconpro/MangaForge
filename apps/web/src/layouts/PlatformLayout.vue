<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const route = useRoute()
const app = useAppStore()

const titleMap: Record<string, string> = {
  dashboard: '工作台',
  projects: '项目管理',
  assets: '资产库',
  system: '系统管理',
}

const currentTitle = computed(() => titleMap[String(route.name)] || '工作台')

const currentRoute = computed(() => String(route.path).replace(/^\//, '') || 'Dashboard')


function enterProject(projectId = app.currentProjectId, page = 'overview') {
  app.setProject(projectId)
  router.push(`/projects/${projectId}/${page}`)
}
</script>

<template>
  <section class="platform-layout">
    <aside class="sidebar">
      <div class="brand">
        <img src="@/assets/images/logo.png" alt="MangaForge Logo" class="logo" />
        <div><strong>MangaForge</strong></div>
      </div>

      <div>
        <nav class="nav" style="margin-top:10px">
          <RouterLink custom to="/dashboard" v-slot="{ navigate, isActive }"><button :class="{ active: isActive }" @click="navigate">工作台 <small>Home</small></button></RouterLink>
          <RouterLink custom to="/projects" v-slot="{ navigate, isActive }"><button :class="{ active: isActive }" @click="navigate">项目管理 <small>Projects</small></button></RouterLink>
          <RouterLink custom to="/assets" v-slot="{ navigate, isActive }"><button :class="{ active: isActive }" @click="navigate">资产库 <small>Assets</small></button></RouterLink>
          <RouterLink custom to="/system" v-slot="{ navigate, isActive }"><button :class="{ active: isActive }" @click="navigate">系统管理 <small>Admin</small></button></RouterLink>
        </nav>
      </div>

    </aside>

    <main class="platform-main">
      <header class="platform-topbar">
        <div class="crumb"><span>MangaForge / {{currentRoute}}</span><strong>{{ currentTitle }}</strong></div>
        <div class="actions">
          <input v-show="false" class="search" placeholder="Search projects, assets, agents..." />
          <!-- <button class="btn primary" @click="router.push('/projects?create=1')">+ 新增项目</button> -->
          <!-- <button class="btn ghost" @click="app.toggleTheme">{{ app.isLight ? 'Dark' : 'Light' }}</button> -->
          <div class="avatar">P</div>
        </div>
      </header>
      <div class="content"><RouterView /></div>
    </main>
  </section>
</template>
