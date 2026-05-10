<script setup lang="ts">
defineProps<{ columns: string[]; rows: Record<string, string>[] }>()
</script>
<template>
  <table class="table">
    <thead><tr><th v-for="c in columns" :key="c">{{ c }}</th></tr></thead>
    <tbody>
      <tr v-for="(row, idx) in rows" :key="idx">
        <td v-for="c in columns" :key="c">{{ row[c] }}</td>
      </tr>
    </tbody>
  </table>
</template>
