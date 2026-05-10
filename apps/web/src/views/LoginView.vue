<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const app = useAppStore()

const account = ref('demo@mangaforge.ai')
const password = ref('123456')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  await app.login()
  loading.value = false
  app.showToast('登录成功')
  router.push('/dashboard')
}
</script>

<template>
  <section class="login-layout">
    <div class="login-hero">
      <div class="brand">
        <div class="logo">MF</div>
        <div>
          <strong>MangaForge</strong>
          <span>AI Comic Workbench</span>
        </div>
      </div>
      <h1>用 AI 把长篇小说锻造成漫画生产资料</h1>
      <p>
        MangaForge 面向网文作者、IP 方和漫画工作室，提供小说拆章、AI 解析、知识库、单话改编、漫画分镜、Prompt 与导出的完整工作流。
      </p>
      <div class="login-stats">
        <div class="card"><div class="label">Novel Scale</div><span class="value">500W+</span><div class="foot">长篇小说处理</div></div>
        <div class="card"><div class="label">Panels</div><span class="value">30-60</span><div class="foot">单话分镜范围</div></div>
        <div class="card"><div class="label">Exports</div><span class="value">5</span><div class="foot">交付格式</div></div>
      </div>
    </div>
    <div class="login-panel">
      <div class="login-card">
        <div class="eyebrow">Sign in</div>
        <h2>进入 MangaForge</h2>
        <p>使用演示账号 demo@mangaforge.ai / 123456 登录。</p>
        <div class="form-group"><label>账号</label><input v-model="account" /></div>
        <div class="form-group"><label>密码</label><input v-model="password" type="password" /></div>
        <button class="btn primary" style="width:100%" :disabled="loading" @click="handleLogin">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <button class="btn ghost" style="width:100%;margin-top:12px" @click="app.toggleTheme">切换暗色 / 亮色</button>
      </div>
    </div>
  </section>
</template>
