<script setup lang="ts">
defineProps<{ bubbles: string[] }>()
</script>
<template>
  <aside class="card sticky">
    <div class="card-head"><h3>Vertical Preview</h3><span class="chip">42 Panels</span></div>
    <div class="upload-zone" style="min-height:180px;align-content:start;">
      <div v-for="(b,idx) in bubbles" :key="idx" class="list-item" style="margin-bottom:8px;">
        <strong>{{ String(idx+1).padStart(2,'0') }}</strong>
        <div>{{ b }}</div>
      </div>
    </div>
  </aside>
</template>
