# MangaForge 技术架构设计文档

版本：V0.5 MVP  
项目名称：MangaForge  
前端技术栈：Vue 3  
后端技术栈：Python FastAPI  
文档类型：Technical Architecture Design  
适用阶段：MVP 开发阶段  

---

## 1. 文档目标

本文档用于说明 MangaForge MVP 阶段的整体技术架构、系统模块划分、前后端技术选型、后端服务设计、AI Agent 接入方案、数据库与文件存储方案、异步任务方案、导出服务方案、部署方案与安全设计。

MVP 阶段的技术目标是：

> 快速搭建一个稳定、可扩展、可演示、可继续迭代的 AI 漫改工作台。

MVP 需要跑通的核心链路：

```text
用户登录
→ 创建项目
→ 上传 TXT 小说
→ 自动拆章
→ AI 章节解析
→ 角色 / 事件知识库构建
→ 选择章节生成单话漫画剧本
→ 生成漫画分镜
→ 编辑分镜
→ 导出 Excel / Word / HTML / JSON / Prompt TXT
```

---

## 2. 总体技术架构

### 2.1 架构原则

MangaForge MVP 采用前后端分离架构。

核心原则：

```text
前端负责交互和编辑体验
后端负责业务逻辑和数据管理
AI Agent 负责长文本理解、改编和分镜生成
异步任务负责耗时任务调度
对象存储负责小说原文和导出文件
数据库负责结构化业务数据
```

---

### 2.2 总体架构图

```text
┌────────────────────────────────────────────┐
│                用户浏览器                  │
│             Vue 3 Web Client               │
└─────────────────────┬──────────────────────┘
                      │ HTTPS / REST API
                      ▼
┌────────────────────────────────────────────┐
│              FastAPI Backend               │
│                                            │
│  用户认证  项目管理  小说管理  分镜管理     │
│  知识库    导出管理  AI任务管理             │
└───────────────┬───────────────┬────────────┘
                │               │
                │               │
                ▼               ▼
┌──────────────────────┐   ┌──────────────────────┐
│     PostgreSQL        │   │ Redis / Task Queue    │
│  业务数据 / JSON 数据  │   │ 异步任务 / 状态缓存    │
└──────────────────────┘   └──────────┬───────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │   Worker Service      │
                            │ Celery / RQ / Dramatiq│
                            └──────────┬───────────┘
                                      │
                  ┌───────────────────┼───────────────────┐
                  ▼                   ▼                   ▼
       ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
       │  AI Agent Service │ │  Export Service  │ │  File Processor  │
       │  HermesAgent      │ │ Excel / Word /   │ │ TXT Parse /      │
       │  LLM API          │ │ HTML / JSON      │ │ Chapter Split    │
       └──────────────────┘ └──────────────────┘ └──────────────────┘
                  │
                  ▼
        ┌──────────────────────┐
        │  LLM Provider Layer   │
        │ OpenAI Compatible API │
        │ OpenRouter / vLLM     │
        └──────────────────────┘

┌────────────────────────────────────────────┐
│                MinIO / S3                  │
│       小说文件 / 导出文件 / 参考图          │
└────────────────────────────────────────────┘
```

---

## 3. 技术选型

### 3.1 前端技术栈

| 类型 | 技术 |
|---|---|
| 前端框架 | Vue 3 |
| 构建工具 | Vite |
| 语言 | TypeScript |
| UI 组件库 | Element Plus / Naive UI |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| HTTP 请求 | Axios |
| 富文本 / 长文本编辑 | Monaco Editor / CodeMirror / 自研 Textarea |
| 拖拽排序 | VueDraggable / SortableJS |
| 图标库 | Iconify / Element Plus Icons |
| 表格导出预览 | SheetJS 前端预览可选 |
| 样式方案 | SCSS / CSS Variables |
| 单元测试 | Vitest |
| E2E 测试 | Playwright，可后期加入 |

推荐 MVP 使用：

```text
Vue 3 + Vite + TypeScript + Pinia + Vue Router + Axios + Element Plus
```

原因：

- 开发效率高。
- 生态成熟。
- 对管理后台和复杂表单友好。
- 分镜编辑器、表格、上传、弹窗、抽屉等组件容易实现。

---

### 3.2 后端技术栈

| 类型 | 技术 |
|---|---|
| 后端框架 | Python FastAPI |
| 语言 | Python 3.11+ |
| ASGI Server | Uvicorn / Gunicorn + Uvicorn Worker |
| ORM | SQLAlchemy 2.x |
| 数据校验 | Pydantic v2 |
| 数据库迁移 | Alembic |
| 数据库 | PostgreSQL |
| 缓存 / 队列 | Redis |
| 异步任务 | Celery / RQ / Dramatiq |
| 文件存储 | MinIO / S3 |
| 鉴权 | JWT |
| Excel 导出 | openpyxl |
| Word 导出 | python-docx |
| HTML 导出 | Jinja2 Template |
| 日志 | Loguru / structlog |
| API 文档 | FastAPI OpenAPI / Swagger |
| 测试 | Pytest |
| 容器化 | Docker / Docker Compose |

推荐 MVP 使用：

```text
FastAPI + SQLAlchemy + PostgreSQL + Redis + Celery + MinIO
```

原因：

- FastAPI 适合快速开发 API。
- Pydantic 适合定义 AI JSON Schema。
- Python 生态适合文本处理、AI 调用、导出文件生成。
- Celery + Redis 适合处理 AI 生成、导出等耗时任务。

---

### 3.3 AI 与 Agent 技术栈

| 类型 | 技术 |
|---|---|
| Agent 层 | HermesAgent |
| 模型调用 | OpenAI-compatible API |
| 可选模型平台 | OpenRouter / vLLM / 本地模型服务 |
| Prompt 管理 | 文件模板 + 数据库版本记录 |
| JSON Schema 校验 | Pydantic Model / jsonschema |
| 长文本处理 | 分章解析 + 摘要聚合 |
| 向量检索 | MVP 可不做，V1 加 pgvector / Qdrant |
| 失败修复 | JSON Repair + 重试机制 |

MVP 阶段建议先不引入复杂 RAG，只做：

```text
章节级解析
角色库沉淀
单话生成时按章节 + 角色库 + 禁改设定拼接上下文
```

V1 阶段再加入：

```text
pgvector / Qdrant
章节向量检索
角色相关上下文检索
伏笔检索
世界观检索
```

---

## 4. 系统模块划分

### 4.1 前端模块

```text
apps/web/
├── src/
│   ├── api/                  # API 请求封装
│   ├── assets/               # 静态资源
│   ├── components/           # 通用组件
│   ├── layouts/              # 页面布局
│   ├── router/               # 路由配置
│   ├── stores/               # Pinia 状态管理
│   ├── styles/               # 全局样式
│   ├── utils/                # 工具函数
│   ├── views/                # 页面
│   │   ├── auth/             # 登录
│   │   ├── projects/         # 项目管理
│   │   ├── import/           # 小说导入
│   │   ├── chapters/         # 章节管理
│   │   ├── analysis/         # AI 解析
│   │   ├── knowledge/        # 知识库
│   │   ├── episodes/         # 单话改编
│   │   ├── storyboard/       # 分镜编辑器
│   │   ├── export/           # 导出中心
│   │   └── tasks/            # AI 任务记录
│   ├── App.vue
│   └── main.ts
```

---

### 4.2 后端模块

```text
services/api/
├── app/
│   ├── main.py                       # FastAPI 入口
│   ├── core/                         # 核心配置
│   │   ├── config.py                 # 环境变量配置
│   │   ├── security.py               # JWT / 密码加密
│   │   ├── logging.py                # 日志配置
│   │   └── exceptions.py             # 统一异常
│   │
│   ├── db/                           # 数据库
│   │   ├── session.py                # DB Session
│   │   ├── base.py                   # Base Model
│   │   └── migrations/               # Alembic
│   │
│   ├── models/                       # SQLAlchemy 模型
│   ├── schemas/                      # Pydantic Schema
│   ├── api/                          # API 路由
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── novels.py
│   │   │   ├── chapters.py
│   │   │   ├── analysis.py
│   │   │   ├── knowledge.py
│   │   │   ├── episodes.py
│   │   │   ├── storyboards.py
│   │   │   ├── exports.py
│   │   │   └── ai_tasks.py
│   │
│   ├── services/                     # 业务服务
│   │   ├── auth_service.py
│   │   ├── project_service.py
│   │   ├── novel_service.py
│   │   ├── chapter_service.py
│   │   ├── analysis_service.py
│   │   ├── knowledge_service.py
│   │   ├── episode_service.py
│   │   ├── storyboard_service.py
│   │   ├── export_service.py
│   │   └── ai_task_service.py
│   │
│   ├── workers/                      # 异步任务
│   │   ├── celery_app.py
│   │   ├── ai_tasks.py
│   │   └── export_tasks.py
│   │
│   ├── agents/                       # AI Agent 接入
│   │   ├── base_agent.py
│   │   ├── novel_chapter_analysis_agent.py
│   │   ├── character_build_agent.py
│   │   ├── episode_adapt_agent.py
│   │   ├── storyboard_agent.py
│   │   └── consistency_check_agent.py
│   │
│   ├── prompts/                      # Prompt 模板
│   ├── exporters/                    # 导出器
│   │   ├── excel_exporter.py
│   │   ├── word_exporter.py
│   │   ├── html_exporter.py
│   │   └── json_exporter.py
│   │
│   ├── storage/                      # MinIO / S3
│   └── utils/                        # 工具函数
│
├── tests/
├── pyproject.toml
├── Dockerfile
└── README.md
```

---

## 5. 前端架构设计

### 5.1 前端页面路由

```text
/login                                      登录页
/projects                                   项目工作台
/projects/create                            创建项目
/projects/:projectId                        项目详情
/projects/:projectId/import                 小说导入
/projects/:projectId/chapters               章节管理
/projects/:projectId/analysis               AI 章节解析
/projects/:projectId/knowledge              小说知识库
/projects/:projectId/episodes/create        单话改编
/episodes/:episodeId/script                 单话剧本
/episodes/:episodeId/storyboard             分镜编辑器
/episodes/:episodeId/export                 导出页
/projects/:projectId/ai-tasks               AI 任务记录
```

---

### 5.2 前端核心页面

| 页面 | 说明 |
|---|---|
| 登录页 | 用户登录 |
| 项目工作台 | 查看项目列表和项目状态 |
| 创建项目页 | 创建小说漫改项目 |
| 项目详情页 | 项目内部首页 |
| 小说导入页 | 上传 TXT，拆章预览 |
| 章节管理页 | 查看、编辑、解析章节 |
| AI 章节解析页 | 查看结构化解析结果 |
| 小说知识库页 | 角色库、事件库、场景库、禁改设定 |
| 单话改编页 | 选择章节生成单话方案 |
| 单话剧本页 | 编辑漫画剧本 |
| 分镜编辑器页 | 生成和编辑分镜 |
| 导出页 | 导出分镜资料 |
| AI 任务记录页 | 查看任务状态和失败原因 |

---

### 5.3 前端状态管理

使用 Pinia。

建议 Store：

```text
stores/
├── auth.ts             # 用户登录状态
├── project.ts          # 当前项目
├── chapter.ts          # 章节列表和当前章节
├── knowledge.ts        # 角色库 / 事件库
├── episode.ts          # 当前单话
├── storyboard.ts       # 分镜列表
├── aiTask.ts           # AI 任务状态
└── app.ts              # 全局设置
```

---

### 5.4 前端 API 封装

```text
api/
├── auth.ts
├── projects.ts
├── novels.ts
├── chapters.ts
├── analysis.ts
├── knowledge.ts
├── episodes.ts
├── storyboards.ts
├── exports.ts
└── aiTasks.ts
```

Axios 统一处理：

```text
Base URL
Token 注入
请求 Loading
错误提示
401 跳转登录
文件下载
```

---

### 5.5 分镜编辑器前端设计

分镜编辑器是 MVP 核心页面。

推荐三栏布局：

```text
┌──────────────┬────────────────────────┬──────────────┐
│ 本话信息       │ 分镜卡片列表             │ 漫画预览       │
│ 角色设定       │ 可编辑字段               │ Prompt 面板    │
│ 禁改提醒       │ 拖拽排序                 │ 复制 / 导出    │
└──────────────┴────────────────────────┴──────────────┘
```

核心组件：

```text
StoryboardLayout.vue
EpisodeInfoPanel.vue
StoryboardPanelList.vue
StoryboardPanelCard.vue
StoryboardPanelEditor.vue
ComicPreview.vue
PromptPanel.vue
RegeneratePanelButton.vue
```

分镜编辑器需要支持：

```text
新增分镜
删除分镜
复制分镜
拖拽排序
编辑字段
保存分镜
复制单格 Prompt
复制全部 Prompt
重新生成单格
生成全部分镜
```

---

## 6. 后端架构设计

### 6.1 FastAPI 分层架构

后端采用经典分层结构：

```text
Router 层
↓
Service 层
↓
Repository / ORM 层
↓
Database
```

每层职责：

| 层级 | 职责 |
|---|---|
| Router | 接收 HTTP 请求、参数校验、返回响应 |
| Service | 业务逻辑、权限校验、状态流转 |
| ORM Model | 数据库实体映射 |
| Schema | 请求 / 响应数据结构 |
| Worker | 异步执行 AI / 导出任务 |
| Agent | 封装 AI 调用逻辑 |
| Exporter | 生成导出文件 |

---

### 6.2 API 统一响应格式

建议所有接口返回统一结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "request_id": "uuid"
}
```

错误示例：

```json
{
  "code": 40001,
  "message": "项目不存在或无权限访问",
  "data": null,
  "request_id": "uuid"
}
```

---

### 6.3 错误码设计

| 错误码 | 含义 |
|---:|---|
| 0 | 成功 |
| 40000 | 参数错误 |
| 40001 | 资源不存在 |
| 40002 | 无权限 |
| 40003 | 文件格式不支持 |
| 40004 | 上传失败 |
| 40005 | 章节解析失败 |
| 40006 | AI 任务不存在 |
| 40007 | AI 任务执行失败 |
| 40008 | 导出失败 |
| 40100 | 未登录 |
| 40300 | 禁止访问 |
| 50000 | 服务内部错误 |

---

## 7. 核心业务流程设计

### 7.1 小说上传与拆章流程

```text
用户上传 TXT
↓
FastAPI 接收文件
↓
保存原始文件到 MinIO
↓
检测编码 UTF-8 / GBK
↓
读取文本内容
↓
按章节正则拆分
↓
生成 novel_chapter 记录
↓
更新 novel_project 字数和章节数
↓
返回拆章结果
```

章节识别正则需要支持：

```text
第1章
第 1 章
第一章
第001章
卷一
第一卷
Chapter 1
CHAPTER 1
```

---

### 7.2 AI 章节解析流程

```text
用户点击解析章节
↓
后端创建 ai_task
↓
任务状态：等待中
↓
Celery Worker 获取任务
↓
调用 NovelChapterAnalysisAgent
↓
Agent 构建 Prompt
↓
调用 LLM / HermesAgent
↓
返回 JSON
↓
Pydantic Schema 校验
↓
写入 chapter_analysis
↓
更新章节 analysis_status
↓
任务状态：成功
```

失败流程：

```text
AI 调用失败 / JSON 校验失败
↓
记录 error_message
↓
任务状态：失败
↓
允许用户重试
```

---

### 7.3 单话改编流程

```text
用户选择 1～3 章
↓
设置目标格数 / 漫画风格 / 改编强度
↓
后端读取章节正文 + 章节解析 + 角色库 + 禁改设定
↓
创建 ai_task
↓
调用 EpisodeAdaptAgent
↓
生成本话标题 / 梗概 / 冲突 / 剧本
↓
写入 comic_episode
↓
返回 episode_id
```

---

### 7.4 分镜生成流程

```text
用户点击生成分镜
↓
后端读取 comic_episode.script
↓
读取角色库 / 禁改设定 / 风格参数
↓
创建 ai_task
↓
调用 StoryboardAgent
↓
生成 panels JSON
↓
校验分镜数量和字段完整性
↓
写入 storyboard_panel
↓
前端展示分镜列表
```

---

### 7.5 导出流程

```text
用户选择导出格式
↓
后端创建导出任务
↓
Worker 读取 episode + storyboard_panel
↓
根据格式调用 Exporter
↓
生成文件
↓
上传到 MinIO
↓
写入 export_file
↓
返回下载地址
```

---

## 8. AI Agent 架构设计

### 8.1 Agent 总体设计

AI Agent 层封装所有 AI 调用能力。

MVP 需要以下 Agent：

```text
NovelChapterAnalysisAgent
CharacterBuildAgent
EpisodeAdaptAgent
StoryboardAgent
ConsistencyCheckAgent
```

Agent 基础结构：

```python
class BaseAgent:
    name: str
    version: str

    def build_prompt(self, input_data: dict) -> str:
        pass

    def call_model(self, prompt: str) -> dict:
        pass

    def validate_output(self, output: dict) -> dict:
        pass

    def run(self, input_data: dict) -> dict:
        prompt = self.build_prompt(input_data)
        output = self.call_model(prompt)
        return self.validate_output(output)
```

---

### 8.2 NovelChapterAnalysisAgent

作用：

```text
解析单个章节，提取摘要、人物、事件、场景、冲突、伏笔和可视化画面。
```

输入：

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

输出：

```json
{
  "summary": "",
  "characters": [],
  "new_characters": [],
  "events": [],
  "scenes": [],
  "props": [],
  "conflicts": [],
  "emotions": [],
  "foreshadowing": [],
  "visual_moments": [],
  "adaptation_notes": ""
}
```

---

### 8.3 EpisodeAdaptAgent

作用：

```text
将指定 1～3 个章节改编成一话漫画剧本。
```

输入：

```json
{
  "project_id": 1,
  "source_chapter_ids": [1, 2, 3],
  "target_panels": 40,
  "comic_style": "古风国漫条漫",
  "adaptation_level": "中等",
  "rhythm_type": "强冲突",
  "keep_original_dialogue": true,
  "characters": [],
  "forbidden_rules": []
}
```

输出：

```json
{
  "episode_title": "",
  "summary": "",
  "main_conflict": "",
  "characters": [],
  "scenes": [],
  "emotion_curve": "",
  "rhythm": "",
  "hook": "",
  "adaptation_notes": "",
  "script": []
}
```

---

### 8.4 StoryboardAgent

作用：

```text
把漫画剧本拆成 30～60 格漫画分镜，并生成每格绘图 Prompt。
```

输出：

```json
{
  "panels": [
    {
      "panel_index": 1,
      "scene": "",
      "characters": [],
      "camera": "",
      "shot_type": "",
      "image_description": "",
      "action": "",
      "expression": "",
      "dialogue": "",
      "narration": "",
      "sound_effect": "",
      "prompt": "",
      "negative_prompt": ""
    }
  ]
}
```

---

### 8.5 AI 输出校验

所有 AI 输出必须经过：

```text
JSON 解析
Schema 校验
字段完整性检查
业务规则检查
失败重试
原始输出保存
```

校验失败时：

```text
尝试 JSON 修复
↓
重新校验
↓
仍失败则重试 AI
↓
重试失败则任务失败
```

---

### 8.6 HermesAgent 接入方式

MangaForge 不把 HermesAgent 作为主业务系统，而是作为 AI 任务执行层。

推荐接入方式：

```text
FastAPI
↓
AI Task Service
↓
Agent Adapter
↓
HermesAgent / LLM Provider
↓
返回结构化 JSON
```

Agent Adapter 负责：

```text
统一请求 HermesAgent
统一模型参数
统一超时设置
统一错误处理
统一日志记录
统一返回结构
```

---

## 9. 异步任务架构

### 9.1 为什么需要异步任务

以下操作耗时较长，不适合同步 HTTP 请求执行：

```text
AI 章节解析
批量章节解析
角色库构建
单话改编
分镜生成
导出 Excel / Word / HTML
```

因此需要异步任务系统。

---

### 9.2 推荐方案

MVP 推荐：

```text
Celery + Redis
```

原因：

- Python 生态成熟。
- 与 FastAPI 配合容易。
- 支持任务重试。
- 支持任务状态记录。
- 适合 AI 生成和导出任务。

---

### 9.3 任务类型

```text
chapter_analysis
batch_chapter_analysis
character_build
episode_adapt
storyboard_generate
panel_regenerate
consistency_check
export_excel
export_word
export_html
export_json
export_prompts
```

---

### 9.4 任务状态

```text
waiting
running
success
failed
cancelled
retried
```

---

### 9.5 ai_task 表职责

ai_task 表用于记录所有 AI 和导出任务：

```text
任务类型
关联对象
输入参数
输出结果
错误信息
任务状态
重试次数
开始时间
完成时间
```

---

## 10. 数据库架构

### 10.1 数据库选型

MVP 使用：

```text
PostgreSQL
```

原因：

- 支持 JSON 字段。
- 适合结构化 + 半结构化数据。
- 后续可扩展 pgvector。
- 稳定可靠。

---

### 10.2 核心数据表

```text
app_user
novel_project
novel_file
novel_chapter
chapter_analysis
character_profile
story_event
story_scene
forbidden_rule
comic_episode
storyboard_panel
ai_task
export_file
```

---

### 10.3 表关系说明

```text
app_user 1 - N novel_project
novel_project 1 - N novel_file
novel_project 1 - N novel_chapter
novel_chapter 1 - 1 chapter_analysis
novel_project 1 - N character_profile
novel_project 1 - N story_event
novel_project 1 - N story_scene
novel_project 1 - N forbidden_rule
novel_project 1 - N comic_episode
comic_episode 1 - N storyboard_panel
novel_project 1 - N ai_task
comic_episode 1 - N export_file
```

---

### 10.4 索引建议

| 表 | 索引 |
|---|---|
| novel_project | user_id, status |
| novel_chapter | project_id, chapter_index, analysis_status |
| chapter_analysis | project_id, chapter_id |
| character_profile | project_id, name |
| comic_episode | project_id, episode_index, status |
| storyboard_panel | episode_id, panel_index |
| ai_task | project_id, task_type, status |
| export_file | project_id, episode_id |

---

## 11. 文件存储架构

### 11.1 文件存储选型

MVP 推荐：

```text
MinIO
```

也可以兼容：

```text
AWS S3
阿里云 OSS
腾讯云 COS
```

---

### 11.2 文件类型

```text
小说原始 TXT
导出的 Excel
导出的 Word
导出的 HTML
导出的 JSON
导出的 Prompt TXT
后期角色参考图
后期生成图片
```

---

### 11.3 存储路径建议

```text
projects/{project_id}/novels/{file_id}.txt
projects/{project_id}/exports/{episode_id}/{file_name}
projects/{project_id}/characters/{character_id}/references/{image_name}
projects/{project_id}/images/{episode_id}/{panel_id}.png
```

---

## 12. 导出服务设计

### 12.1 导出格式

MVP 支持：

```text
Excel
Word
HTML
JSON
Prompt TXT
```

---

### 12.2 导出器设计

```python
class BaseExporter:
    export_type: str

    def build(self, episode, panels) -> bytes:
        pass

class ExcelExporter(BaseExporter):
    pass

class WordExporter(BaseExporter):
    pass

class HtmlExporter(BaseExporter):
    pass

class JsonExporter(BaseExporter):
    pass

class PromptTxtExporter(BaseExporter):
    pass
```

---

### 12.3 导出内容

Excel 字段：

```text
格号
场景
人物
景别
画面描述
动作
表情
对白
旁白
音效
Prompt
负面 Prompt
状态
```

Word 内容：

```text
项目名称
小说名称
本话标题
本话梗概
出场人物
核心冲突
结尾钩子
漫画剧本
分镜表
Prompt 附录
```

HTML 内容：

```text
竖版漫画预览
分镜画面描述
对白气泡
旁白
Prompt 简略显示
```

---

## 13. 安全架构

### 13.1 认证方式

MVP 使用：

```text
JWT Token
```

登录后返回：

```json
{
  "access_token": "",
  "token_type": "bearer",
  "expires_in": 86400
}
```

---

### 13.2 权限控制

MVP 阶段采用简单权限：

```text
用户只能访问自己的项目
管理员可以访问全部项目
```

后端所有 project_id、chapter_id、episode_id 相关接口都需要校验资源归属。

---

### 13.3 上传安全

```text
限制文件类型为 .txt
限制文件大小
检查文件编码
禁止执行上传文件
文件名重命名为系统 ID
原始文件存储在对象存储
```

---

### 13.4 AI Key 安全

```text
AI API Key 只存服务端环境变量
前端不暴露任何模型 Key
日志中不能打印完整 Key
异常信息不能返回敏感配置
```

---

## 14. 日志与监控

### 14.1 日志内容

后端需要记录：

```text
请求日志
错误日志
AI 调用日志
任务执行日志
导出日志
文件上传日志
```

---

### 14.2 关键日志字段

```text
request_id
user_id
project_id
task_id
endpoint
method
status_code
duration_ms
error_message
created_at
```

---

### 14.3 MVP 监控指标

```text
接口错误率
AI 任务成功率
AI 任务平均耗时
导出成功率
上传失败率
章节解析失败率
分镜生成失败率
```

---

## 15. 部署架构

### 15.1 MVP Docker Compose 部署

MVP 推荐使用 Docker Compose。

服务列表：

```text
nginx
web
api
worker
postgres
redis
minio
```

部署结构：

```text
┌─────────────┐
│   Nginx     │
└──────┬──────┘
       │
 ┌─────▼─────┐
 │ Vue Web   │
 └───────────┘

       │ /api
 ┌─────▼─────┐
 │ FastAPI   │
 └─────┬─────┘
       │
 ┌─────▼─────┐
 │ PostgreSQL│
 └───────────┘

 ┌───────────┐
 │ Redis     │
 └─────┬─────┘
       │
 ┌─────▼─────┐
 │ Worker    │
 └───────────┘

 ┌───────────┐
 │ MinIO     │
 └───────────┘
```

---

### 15.2 docker-compose 服务

```yaml
services:
  web:
    image: manga-forge-web
    ports:
      - "3000:80"

  api:
    image: manga-forge-api
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
      - minio

  worker:
    image: manga-forge-api
    command: celery -A app.workers.celery_app worker --loglevel=info
    depends_on:
      - api
      - redis
      - postgres

  postgres:
    image: postgres:16

  redis:
    image: redis:7

  minio:
    image: minio/minio
```

---

## 16. 环境变量设计

### 16.1 后端环境变量

```env
APP_ENV=development
APP_NAME=MangaForge
API_PREFIX=/api/v1

DATABASE_URL=postgresql+psycopg://user:password@postgres:5432/mangaforge
REDIS_URL=redis://redis:6379/0

JWT_SECRET_KEY=change_me
JWT_EXPIRE_SECONDS=86400

MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=manga-forge

LLM_PROVIDER=openai_compatible
LLM_API_BASE=https://api.example.com/v1
LLM_API_KEY=change_me
LLM_MODEL=gpt-4.1

HERMES_AGENT_ENDPOINT=http://agent:9000
HERMES_AGENT_API_KEY=change_me
```

---

### 16.2 前端环境变量

```env
VITE_APP_NAME=MangaForge
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 17. GitHub 仓库结构

推荐仓库名：

```text
manga-forge
```

推荐 Monorepo 结构：

```text
manga-forge/
├── apps/
│   ├── web/                  # Vue 3 前端
│   └── admin/                # 管理后台，后期可加
│
├── services/
│   ├── api/                  # FastAPI 后端
│   ├── agent/                # HermesAgent / AI 工作流服务
│   ├── worker/               # 异步任务服务，可与 api 共镜像
│   └── export/               # 导出服务，可后期拆分
│
├── packages/
│   ├── shared/               # 公共类型、工具函数
│   ├── prompts/              # Prompt 模板
│   └── schemas/              # JSON Schema
│
├── docs/
│   ├── prd/                  # 产品需求文档
│   ├── architecture/         # 架构设计文档
│   ├── api/                  # API 文档
│   ├── database/             # 数据库设计
│   └── deployment/           # 部署文档
│
├── docker/
│   ├── nginx/
│   └── minio/
│
├── scripts/
├── README.md
├── docker-compose.yml
└── .gitignore
```

---

## 18. MVP 开发阶段技术里程碑

### M1：基础框架完成

交付：

```text
Vue 3 项目初始化
FastAPI 项目初始化
PostgreSQL 接入
Redis 接入
MinIO 接入
JWT 登录
项目管理 API
```

---

### M2：小说导入完成

交付：

```text
TXT 上传
文件存储
自动拆章
章节列表
章节详情
章节编辑
```

---

### M3：AI 任务系统完成

交付：

```text
ai_task 表
Celery Worker
任务创建接口
任务状态查询
NovelChapterAnalysisAgent
章节解析结果保存
```

---

### M4：单话改编完成

交付：

```text
章节选择
EpisodeAdaptAgent
单话大纲生成
漫画剧本生成
comic_episode 保存
```

---

### M5：分镜编辑器完成

交付：

```text
StoryboardAgent
分镜生成
分镜列表
分镜编辑
拖拽排序
Prompt 复制
漫画预览
```

---

### M6：导出与测试完成

交付：

```text
Excel 导出
Word 导出
HTML 导出
JSON 导出
Prompt TXT 导出
测试用例
演示项目
部署文档
```

---

## 19. 后续架构演进方向

### V1.0

```text
引入 pgvector / Qdrant
支持全文向量检索
支持更完整的世界观知识库
支持一致性检查 Agent
支持批量章节解析
支持团队空间
```

---

### V2.0

```text
图片生成服务
角色参考图管理
LoRA / 风格模型绑定
多人协作
评论审核流
商业化套餐
私有化部署
API 开放平台
```

---

## 20. 结论

MangaForge MVP 技术架构建议采用：

```text
Vue 3 + Vite + TypeScript
FastAPI + SQLAlchemy + PostgreSQL
Redis + Celery
MinIO
HermesAgent / OpenAI-compatible LLM
Docker Compose
```

该架构可以支撑 MVP 的核心闭环：

```text
小说上传
→ 自动拆章
→ AI 解析
→ 单话改编
→ 分镜生成
→ 人工编辑
→ 导出制作资料
```

MVP 阶段应优先保证主流程稳定、AI 输出可控、分镜编辑体验可用、导出资料完整。后续再逐步扩展向量检索、图片生成、角色一致性、多人协作和商业化能力。
