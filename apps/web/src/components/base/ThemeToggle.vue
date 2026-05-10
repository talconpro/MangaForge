<script setup lang="ts">
defineProps<{ label: string }>()
defineEmits<{ toggle: [] }>()
</script>
<template><button class="btn ghost" @click="$emit('toggle')">{{ label }}</button></template>
