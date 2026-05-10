<script setup lang="ts">
defineProps<{ active: string }>()
defineEmits<{ select: [string] }>()
const formats = ['Excel', 'Word', 'HTML', 'JSON', 'Prompt TXT']
</script>
<template>
  <div class="exports">
    <div v-for="f in formats" :key="f" class="card export" :class="{ active: active===f }" @click="$emit('select',f)">
      <div class="card-head"><h3>{{ f }}</h3></div>
      <p>导出 {{ f }} 交付物</p>
    </div>
  </div>
</template>
