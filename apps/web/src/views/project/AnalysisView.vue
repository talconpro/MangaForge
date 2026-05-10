<script setup lang="ts">
import { ref } from 'vue'
import { mockApi } from '@/api/mock'
import { useAppStore } from '@/stores/app'
import PageHead from '@/components/base/PageHead.vue'
const app = useAppStore()
const status = ref('Success')
async function run() {
  status.value = 'Running'
  app.showToast('NovelChapterAnalysisAgent 已入队')
  await mockApi.runAnalysis()
  status.value = 'Success'
  app.showToast('AI 解析完成，JSON Schema 校验通过')
}
</script>
<template>
  <section>
    <PageHead eyebrow="Project / HermesAgent Analysis" title="AI 章节解析" description="将小说章节转为漫画改编所需的结构化资产。">
      <div class="toolbar"><button class="btn secondary" @click="run">Re-run Agent</button><button class="btn primary"
          @click="app.showToast('已写入知识库')">Save to Knowledge</button></div>
    </PageHead>
    <div class="card featured">
      <div class="cardhead">
        <h2>NovelChapterAnalysisAgent</h2><span class="chip" :class="{ warn: status === 'Running' }">{{ status }}</span>
      </div>
      <p>任务 #1021 · JSON Schema validated · Duration 46s · Model route: HermesAgent / OpenAI-compatible</p>
    </div>
    <div class="analysis" style="margin-top:24px">
      <div class="card">
        <div class="cardhead">
          <h3>章节摘要</h3>
        </div>
        <p>沈青禾在雨夜回到沈家，当众拒绝被安排的婚事，与沈夫人发生第一次正面冲突。</p>
      </div>
      <div class="card">
        <div class="cardhead">
          <h3>出场人物</h3>
        </div>
        <div class="chips"><span class="chip">沈青禾</span><span class="chip">沈夫人</span><span class="chip">顾长渊</span><span
            class="chip secondary">春桃</span></div>
      </div>
      <div class="card">
        <div class="cardhead">
          <h3>关键事件</h3>
        </div>
        <p>雨夜归家、正厅逼婚、当众退婚、顾长渊注意到玉佩。</p>
      </div>
      <div class="card">
        <div class="cardhead">
          <h3>漫改建议</h3>
        </div>
        <p>前 5 格快速建立雨夜、压迫和反抗。心理描写改为眼神、动作和道具特写。</p>
      </div>
    </div>
  </section>
</template>
