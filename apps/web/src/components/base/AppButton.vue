<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; type?: 'button' | 'submit' }>(), {
  variant: 'secondary',
  type: 'button',
})
</script>

<template>
  <button :type="type" class="btn" :class="variant"><slot /></button>
</template>
