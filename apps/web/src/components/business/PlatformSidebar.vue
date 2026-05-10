<script setup lang="ts">
import type { PlatformPageKey, ProjectPageKey } from '@/types/mock'

defineProps<{ page: PlatformPageKey; projectName: string }>()
defineEmits<{ switchPlatform: [PlatformPageKey]; enterProject: [string, ProjectPageKey] }>()
</script>

<template>
  <aside class="sidebar">
    <div class="brand"><div class="logo">MF</div><div><strong>MangaForge</strong><span>AI Comic Workbench</span></div></div>
    <div>
      <div class="nav-label">PlatformLayout</div>
      <nav class="nav" style="margin-top:10px;">
        <button class="nav-item" :class="{ active: page==='platform-dashboard' }" @click="$emit('switchPlatform','platform-dashboard')">⌘ 工作台</button>
        <button class="nav-item" :class="{ active: page==='platform-projects' }" @click="$emit('switchPlatform','platform-projects')">▣ 项目管理</button>
        <button class="nav-item" :class="{ active: page==='platform-assets' }" @click="$emit('switchPlatform','platform-assets')">◫ 资产库</button>
        <button class="nav-item" :class="{ active: page==='platform-system' }" @click="$emit('switchPlatform','platform-system')">⚙ 系统管理</button>
      </nav>
    </div>

    <div class="sidebox">
      <div class="nav-label" style="padding:0;margin-bottom:12px">快速项目入口</div>
      <div class="nav" style="margin-top:8px;">
        <button class="nav-item active" @click="$emit('enterProject','云州旧梦','overview')">云州旧梦</button>
        <button class="nav-item" @click="$emit('enterProject','霓虹尽头','analysis')">霓虹尽头</button>
        <button class="nav-item" @click="$emit('enterProject','社恐女孩与猫','export')">社恐女孩与猫</button>
      </div>
      <div class="sidebox-row"><span>Current</span><strong>{{ projectName }}</strong></div>
    </div>
  </aside>
</template>
