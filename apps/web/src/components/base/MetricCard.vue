<script setup lang="ts">
defineProps<{ label: string; value: string | number; foot: string; featured?: boolean }>()
</script>
<template>
  <div class="card metric" :class="{ featured }">
    <div class="label">{{ label }}</div>
    <span class="value">{{ value }}</span>
    <div class="foot">{{ foot }}</div>
  </div>
</template>
