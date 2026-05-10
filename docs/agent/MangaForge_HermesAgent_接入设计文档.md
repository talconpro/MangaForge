# MangaForge HermesAgent 接入设计文档

版本：V0.5 MVP  
项目名称：MangaForge  
AI 执行层：HermesAgent  
后端框架：Python FastAPI  
文档类型：AI Agent Integration Design  

---

## 1. 文档目标

本文档定义 MangaForge 如何接入 HermesAgent，将其作为 AI 任务执行层，用于处理长篇小说解析、角色构建、单话改编、漫画分镜生成、Prompt 生成与一致性检查。

MangaForge 的核心原则：

> FastAPI 负责业务系统，HermesAgent 负责 AI 任务执行。

HermesAgent 不承担：

```text
用户系统
项目管理
数据库管理
文件管理
前端页面
权限控制
导出服务
```

HermesAgent 承担：

```text
章节解析
角色提取
单话改编
漫画分镜生成
Prompt 生成
一致性检查
```

---

## 2. HermesAgent 在系统中的定位

### 2.1 总体调用链路

```text
Vue 3 前端
↓
FastAPI Backend
↓
AI Task Service
↓
Celery Worker
↓
Agent Adapter
↓
HermesAgent
↓
LLM Provider
↓
结构化 JSON 返回
↓
FastAPI 写入数据库
↓
前端展示和编辑
```

---

### 2.2 设计原则

```text
1. 业务数据只由 FastAPI 写数据库。
2. HermesAgent 只返回结构化结果，不直接操作数据库。
3. 所有 AI 任务必须异步执行。
4. 所有 AI 输出必须经过 JSON Schema 校验。
5. 所有 AI 原始输入输出必须保存到 ai_task。
6. HermesAgent 调用失败必须可重试。
7. 保留直接调用 LLM Provider 的备用方案。
```

---

## 3. 接入架构

```text
┌─────────────┐
│  FastAPI    │
└──────┬──────┘
       │ create ai_task
       ▼
┌─────────────┐
│   Redis      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ CeleryWorker │
└──────┬──────┘
       │
       ▼
┌────────────────────┐
│ Agent Adapter       │
│ - 统一请求           │
│ - 超时控制           │
│ - 错误处理           │
│ - 输出校验           │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ HermesAgent         │
│ - Skill / Agent     │
│ - Memory            │
│ - Tool Execution    │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ LLM Provider        │
│ OpenAI-Compatible   │
│ OpenRouter / vLLM   │
└────────────────────┘
```

---

## 4. 环境变量

```env
HERMES_AGENT_ENABLED=true
HERMES_AGENT_ENDPOINT=http://agent:9000
HERMES_AGENT_API_KEY=change_me
HERMES_AGENT_TIMEOUT_SECONDS=180

LLM_PROVIDER=openai_compatible
LLM_API_BASE=https://api.example.com/v1
LLM_API_KEY=change_me
LLM_MODEL=gpt-4.1
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=8192
```

---

## 5. Agent Adapter 设计

### 5.1 Adapter 职责

```text
统一封装 HermesAgent 调用
组装 Agent 请求
设置模型参数
设置超时时间
处理网络异常
处理业务异常
保存原始响应
返回标准结构
```

### 5.2 Python 伪代码

```python
class HermesAgentAdapter:
    def __init__(self, endpoint: str, api_key: str, timeout: int):
        self.endpoint = endpoint
        self.api_key = api_key
        self.timeout = timeout

    async def run_agent(self, agent_name: str, payload: dict) -> dict:
        request_body = {
            "agent_name": agent_name,
            "input": payload,
            "response_format": "json"
        }

        response = await self._post("/agents/run", request_body)
        return response

    async def _post(self, path: str, body: dict) -> dict:
        pass
```

---

## 6. AI 任务类型

MVP 任务类型：

```text
chapter_analysis
character_build
episode_adapt
storyboard_generate
panel_regenerate
consistency_check
prompt_generate
```

---

## 7. Agent 清单

| Agent | 优先级 | 说明 |
|---|---|---|
| NovelChapterAnalysisAgent | P0 | 章节解析 |
| EpisodeAdaptAgent | P0 | 单话改编 |
| StoryboardAgent | P0 | 分镜生成 |
| CharacterBuildAgent | P1 | 角色库构建 |
| PanelRegenerateAgent | P1 | 单格重生成 |
| ConsistencyCheckAgent | P1 | 一致性检查 |
| PromptGenerateAgent | P1 | Prompt 独立生成 |

---

## 8. NovelChapterAnalysisAgent

### 8.1 作用

解析单个小说章节，提取漫画改编所需的结构化信息。

### 8.2 输入

```json
{
  "project_id": 1,
  "chapter_id": 1001,
  "chapter_title": "第1章 雨夜退婚",
  "content": "章节正文",
  "genre": "古风",
  "comic_style": "古风国漫条漫",
  "existing_characters": [],
  "forbidden_rules": []
}
```

### 8.3 输出

```json
{
  "summary": "章节摘要",
  "characters": ["沈青禾", "沈夫人"],
  "new_characters": [],
  "events": ["沈青禾回到沈家"],
  "scenes": ["雨夜府门"],
  "props": ["玉佩"],
  "conflicts": ["家族压迫"],
  "emotions": ["压抑", "爆发"],
  "foreshadowing": ["玉佩来源未解释"],
  "visual_moments": ["雨夜府门前少女抬头"],
  "adaptation_notes": "适合强冲突开场"
}
```

### 8.4 Prompt 模板核心要求

```text
你是资深漫画改编编剧。
请阅读输入的小说章节，输出适合漫画改编的结构化信息。
必须严格返回 JSON。
不要输出 Markdown。
不要解释。
字段必须完整。
```

### 8.5 校验规则

```text
summary 必须非空
characters 必须为数组
events 必须为数组
visual_moments 至少 1 条
raw_result 必须保存
```

---

## 9. EpisodeAdaptAgent

### 9.1 作用

将 1～3 个章节改编为一话漫画剧本。

### 9.2 输入

```json
{
  "project_id": 1,
  "source_chapter_ids": [1, 2, 3],
  "chapters": [],
  "chapter_analysis": [],
  "characters": [],
  "forbidden_rules": [],
  "target_panels": 40,
  "comic_style": "古风国漫",
  "adaptation_level": "medium",
  "rhythm_type": "strong_conflict",
  "keep_original_dialogue": true
}
```

### 9.3 输出

```json
{
  "episode_title": "雨夜退婚",
  "summary": "本话梗概",
  "main_conflict": "女主反抗家族安排",
  "characters": ["沈青禾", "沈夫人"],
  "scenes": ["雨夜府门", "沈家正厅"],
  "emotion_curve": "压抑 → 试探 → 爆发",
  "rhythm": "强冲突开场，中段对峙，结尾钩子",
  "hook": "顾长渊看到玉佩",
  "adaptation_notes": "心理描写改成眼神和动作",
  "script": [
    {
      "scene_name": "沈家府门",
      "purpose": "建立女主归来氛围",
      "characters": ["沈青禾"],
      "dialogue": "",
      "narration": "她终于回来了。",
      "transition": "雨声转入正厅"
    }
  ]
}
```

### 9.4 生成要求

```text
必须保留原著核心冲突
必须避免违背禁改设定
必须输出漫画化剧本，不要照搬小说叙述
必须包含结尾钩子
script 至少包含 3 个场景段落
```

---

## 10. StoryboardAgent

### 10.1 作用

把单话漫画剧本拆解为 30～60 格漫画分镜，并生成每格绘图 Prompt。

### 10.2 输入

```json
{
  "episode_id": 1,
  "episode_title": "雨夜退婚",
  "summary": "本话梗概",
  "script": [],
  "target_panels": 40,
  "characters": [],
  "comic_style": "古风国漫",
  "prompt_style": "cinematic comic panel",
  "forbidden_rules": []
}
```

### 10.3 输出

```json
{
  "panels": [
    {
      "panel_index": 1,
      "scene": "沈家府门",
      "characters": ["沈青禾"],
      "camera": "远景",
      "shot_type": "远景",
      "image_description": "雨夜，沈家府门前，少女独自站在雨幕中。",
      "action": "沈青禾抬头看向府门",
      "expression": "平静但压抑",
      "dialogue": "",
      "narration": "她终于回来了。",
      "sound_effect": "哗——",
      "prompt": "古风国漫，雨夜府门，清冷少女...",
      "negative_prompt": "现代服装，短发，蓝眼睛"
    }
  ]
}
```

### 10.4 分镜规则

```text
panel_index 必须连续
分镜数量应接近 target_panels，误差不超过 ±10%
每格必须包含 image_description
每格必须包含 prompt
关键人物必须使用角色库设定
不得提前泄露伏笔
```

---

## 11. CharacterBuildAgent

### 11.1 作用

根据章节解析结果生成或更新角色库。

### 11.2 输入

```json
{
  "project_id": 1,
  "chapter_analysis_list": []
}
```

### 11.3 输出

```json
{
  "characters": [
    {
      "name": "沈青禾",
      "alias": [],
      "gender": "女",
      "identity": "沈家庶女",
      "personality": "隐忍、聪慧、外柔内刚",
      "appearance": "黑色长发，浅棕色眼睛",
      "costume": "浅青色古风衣裙",
      "relationships": [],
      "character_arc": "从隐忍到主动反抗",
      "prompt": "古风国漫，清冷少女...",
      "negative_prompt": "短发，蓝眼睛，现代服装",
      "forbidden_changes": ["不能改成短发", "不能改成活泼搞笑人设"]
    }
  ]
}
```

---

## 12. ConsistencyCheckAgent

### 12.1 作用

检查分镜内容是否违背原著、角色库和禁改设定。

### 12.2 输入

```json
{
  "episode_id": 1,
  "panels": [],
  "characters": [],
  "forbidden_rules": [],
  "chapter_summaries": []
}
```

### 12.3 输出

```json
{
  "passed": true,
  "issues": [
    {
      "panel_index": 3,
      "issue_type": "角色设定冲突",
      "description": "沈青禾被描述为短发，与角色设定冲突。",
      "suggestion": "改为黑色长发，发尾微卷。",
      "severity": "high"
    }
  ]
}
```

---

## 13. ai_task 执行流程

### 13.1 创建任务

```text
FastAPI 接收请求
↓
校验权限
↓
创建 ai_task
↓
写入 input_payload
↓
发送 Celery 任务
↓
返回 task_id
```

### 13.2 执行任务

```text
Worker 获取任务
↓
更新状态 running
↓
调用对应 Agent
↓
调用 HermesAgent
↓
校验输出
↓
写入业务表
↓
更新 ai_task success
```

### 13.3 失败处理

```text
捕获异常
↓
写入 error_message
↓
保存 raw output
↓
更新状态 failed
↓
允许用户重试
```

---

## 14. JSON Schema 校验

### 14.1 校验位置

```text
HermesAgent 返回后
↓
Agent Adapter 校验
↓
业务 Service 再次校验
↓
写入数据库
```

### 14.2 校验策略

```text
必须字段检查
字段类型检查
数组长度检查
分镜数量检查
业务规则检查
```

### 14.3 JSON 修复策略

当返回不是合法 JSON：

```text
1. 尝试截取 JSON 主体
2. 尝试 json repair
3. 仍失败则重新调用一次
4. 再失败则任务失败
```

---

## 15. 超时与重试

### 15.1 超时配置

| 任务 | 超时时间 |
|---|---:|
| 章节解析 | 180 秒 |
| 单话改编 | 240 秒 |
| 分镜生成 | 300 秒 |
| 单格重生成 | 120 秒 |
| 一致性检查 | 180 秒 |

### 15.2 重试策略

```text
默认最多重试 2 次
网络错误可自动重试
JSON 校验失败可自动重试 1 次
用户可手动重试失败任务
```

---

## 16. 日志要求

每次 HermesAgent 调用需要记录：

```text
task_id
agent_name
project_id
related_type
related_id
request_payload
raw_response
validated_output
duration_ms
status
error_message
```

注意：

```text
日志不得输出完整 API Key
小说正文可以存在 input_payload，但生产环境需注意隐私和访问控制
```

---

## 17. 备用方案

如果 HermesAgent 不稳定，保留直连 LLM Provider 能力。

```text
Agent Adapter
├── HermesAgentClient
└── DirectLLMClient
```

通过环境变量切换：

```env
AI_EXECUTOR=hermes
# AI_EXECUTOR=direct_llm
```

---

## 18. MVP 验收标准

```text
FastAPI 可以创建 AI 任务
Worker 可以执行 AI 任务
HermesAgent 可以被成功调用
章节解析能返回结构化 JSON
单话改编能返回漫画剧本
分镜生成能返回 30～60 格分镜
AI 输出可通过 Schema 校验
失败任务可以重试
AI 原始输入输出可以追踪
业务结果可以写入数据库
```

---

## 19. 后续扩展

V1 可增加：

```text
长期记忆
项目级 Agent Memory
角色一致性 Agent
伏笔追踪 Agent
向量检索增强
批量章节解析调度
Agent 编排工作流
```

V2 可增加：

```text
图片生成 Agent
参考图管理 Agent
分镜质量评分 Agent
商业化自动样章生成 Agent
```
