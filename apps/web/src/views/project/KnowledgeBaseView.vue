<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mockApi } from '@/api/mock'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
import type { CharacterCard } from '@/types'
const app = useAppStore()
const characters = ref<CharacterCard[]>([])
onMounted(async()=>{ characters.value = await mockApi.getCharacters() })
</script>
<template>
<section>
  <PageHead eyebrow="Project / Narrative Memory" title="小说知识库" description="维护长篇漫改中的角色、事件、场景、伏笔与禁改设定。"><button class="btn primary" @click="app.showToast('角色卡已创建')">+ Character</button></PageHead>
  <div class="tabs"><button class="tab active">角色库</button><button class="tab">事件库</button><button class="tab">场景库</button><button class="tab">伏笔库</button><button class="tab">禁改设定</button></div>
  <div class="grid g3"><div v-for="(item,index) in characters" :key="item.name" class="card" :class="{ featured:index===0 }"><div class="cardhead"><h2>{{ item.name }}</h2><span class="chip">{{ item.role }}</span></div><p>{{ item.desc }}</p><div class="chips"><span v-for="rule in item.rules" :key="rule" class="chip warn">{{ rule }}</span></div><div class="code" style="margin-top:16px">{{ item.prompt }}</div></div></div>
</section>
</template>
