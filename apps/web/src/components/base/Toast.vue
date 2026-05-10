<script setup lang="ts">
defineProps<{ text: string; visible: boolean }>()
</script>
<template><div class="toast" :class="{ show: visible }">{{ text }}</div></template>
