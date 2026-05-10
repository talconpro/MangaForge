<script setup lang="ts">
import type { StoryboardPanelDTO } from '@/types/mock'
defineProps<{ panel: StoryboardPanelDTO }>()
defineEmits<{ save: []; copy: [] }>()
</script>
<template>
  <div class="panel" :class="{ active: panel.status==='AI Draft' }">
    <div class="card-head"><strong>{{ panel.title }}</strong><span class="chip" :class="{ warn: panel.status==='Edited' }">{{ panel.status }}</span></div>
    <div class="form-group"><label>Image Description</label><textarea :value="panel.imageDescription" /></div>
    <div class="form-group"><label>Prompt</label><textarea :value="panel.prompt" /></div>
    <div class="toolbar"><button class="btn secondary" @click="$emit('copy')">Copy Prompt</button><button class="btn primary" @click="$emit('save')">Save</button></div>
  </div>
</template>
