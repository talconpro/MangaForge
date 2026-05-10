<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'warn' | 'error' }>(), { variant: 'default' })
</script>
<template><span class="chip" :class="variant"><slot /></span></template>
