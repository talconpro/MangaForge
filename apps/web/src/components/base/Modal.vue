<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <div v-if="visible" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal"><slot /></div>
  </div>
</template>
