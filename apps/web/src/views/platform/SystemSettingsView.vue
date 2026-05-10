<script setup lang="ts">
import PageHead from '@/components/base/PageHead.vue'
</script>

<template>
  <section>
    <PageHead eyebrow="System Management" title="系统管理" description="系统级配置，例如模型配置、HermesAgent 状态、用户、角色、权限、运行参数等。" />
    <div class="grid g3">
      <div class="card"><div class="cardhead"><h2>模型配置</h2><span class="chip">LLM</span></div><p>OpenAI-compatible API、模型、温度、Token 限制。</p></div>
      <div class="card"><div class="cardhead"><h2>HermesAgent</h2><span class="chip">Online</span></div><p>Agent Endpoint、API Key、超时、重试策略。</p></div>
      <div class="card"><div class="cardhead"><h2>用户权限</h2><span class="chip secondary">Later</span></div><p>MVP 使用单用户 / 简化权限，后续扩展团队协作。</p></div>
    </div>
  </section>
</template>
