<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
onMounted(() => app.initTheme())
</script>

<template>
  <RouterView />
  <div class="toast" :class="{ show: app.toastVisible }">{{ app.toastMessage }}</div>
</template>
