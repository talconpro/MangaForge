# MangaForge 前端页面与组件设计文档

版本：V0.5 MVP  
项目名称：MangaForge  
前端技术栈：Vue 3 + Vite + TypeScript  
UI 组件库：Element Plus / Naive UI  
状态管理：Pinia  
文档类型：Frontend Page & Component Design  

---

## 1. 文档目标

本文档用于指导 MangaForge MVP 前端开发，明确页面结构、路由、组件拆分、状态管理、交互逻辑、空状态、加载状态和异常提示。

---

## 2. 前端技术栈

```text
Vue 3
Vite
TypeScript
Pinia
Vue Router
Axios
Element Plus / Naive UI
SortableJS / VueDraggable
SCSS / CSS Variables
```

---

## 3. 前端目录结构

```text
apps/web/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── router/
│   ├── stores/
│   ├── styles/
│   ├── utils/
│   ├── views/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── import/
│   │   ├── chapters/
│   │   ├── analysis/
│   │   ├── knowledge/
│   │   ├── episodes/
│   │   ├── storyboard/
│   │   ├── export/
│   │   └── tasks/
│   ├── App.vue
│   └── main.ts
```

---

## 4. 路由设计

| 路由 | 页面 | 鉴权 |
|---|---|---|
| /login | 登录页 | 否 |
| /projects | 项目工作台 | 是 |
| /projects/create | 创建项目 | 是 |
| /projects/:projectId | 项目详情 | 是 |
| /projects/:projectId/import | 小说导入 | 是 |
| /projects/:projectId/chapters | 章节管理 | 是 |
| /projects/:projectId/analysis | AI 章节解析 | 是 |
| /projects/:projectId/knowledge | 小说知识库 | 是 |
| /projects/:projectId/episodes/create | 单话改编 | 是 |
| /episodes/:episodeId/script | 单话剧本 | 是 |
| /episodes/:episodeId/storyboard | 分镜编辑器 | 是 |
| /episodes/:episodeId/export | 导出页 | 是 |
| /projects/:projectId/ai-tasks | AI 任务记录 | 是 |

---

## 5. 全局布局

### 5.1 AuthLayout

用于登录页。

```text
居中卡片
产品 Logo
登录表单
背景插画 / 渐变背景
```

### 5.2 AppLayout

用于业务页面。

```text
顶部导航
左侧菜单
主内容区
全局消息提示
全局加载状态
```

左侧菜单：

```text
项目工作台
小说导入
章节管理
AI 解析
小说知识库
单话改编
分镜编辑器
导出中心
AI 任务
```

---

## 6. 状态管理 Pinia

### 6.1 authStore

```ts
state:
- token
- userInfo
- isLoggedIn

actions:
- login
- logout
- fetchMe
```

### 6.2 projectStore

```ts
state:
- projectList
- currentProject
- projectStats

actions:
- fetchProjects
- createProject
- fetchProjectDetail
- updateProject
- deleteProject
```

### 6.3 chapterStore

```ts
state:
- chapterList
- currentChapter
- chapterPagination

actions:
- uploadNovel
- fetchChapters
- fetchChapterDetail
- updateChapter
- deleteChapter
```

### 6.4 aiTaskStore

```ts
state:
- taskMap
- currentTask

actions:
- fetchTask
- pollTask
- retryTask
- cancelTask
```

### 6.5 storyboardStore

```ts
state:
- panels
- currentPanel
- hasUnsavedChanges

actions:
- fetchPanels
- updatePanel
- createPanel
- deletePanel
- reorderPanels
- copyPrompts
```

---

## 7. 页面设计

---

## 7.1 登录页

### 页面路径

```text
/login
```

### 组件

```text
LoginForm
LogoPanel
```

### 字段

```text
账号
密码
登录按钮
```

### 交互

```text
点击登录
↓
调用 /auth/login
↓
保存 token
↓
跳转 /projects
```

### 状态

| 状态 | 表现 |
|---|---|
| 加载中 | 登录按钮 loading |
| 登录失败 | 表单下方错误提示 |
| 未填写 | 表单校验 |

---

## 7.2 项目工作台

### 页面路径

```text
/projects
```

### 组件

```text
ProjectStats
ProjectFilterBar
ProjectCard
ProjectEmptyState
CreateProjectButton
```

### 展示字段

```text
项目名称
小说名称
小说类型
漫画风格
总字数
章节数
已解析章节数
已生成话数
项目状态
更新时间
```

### 交互

```text
创建项目
搜索项目
筛选状态
进入项目
删除项目
```

### 空状态

```text
暂无 MangaForge 项目，创建第一个项目开始改编。
```

---

## 7.3 创建项目页

### 页面路径

```text
/projects/create
```

### 组件

```text
ProjectCreateForm
```

### 字段

```text
项目名称
小说名称
作者名称
小说类型
漫画风格
目标读者
改编目标
备注
```

### 交互

```text
提交成功 → 跳转小说导入页
取消 → 返回项目工作台
```

---

## 7.4 项目详情页

### 页面路径

```text
/projects/:projectId
```

### 组件

```text
ProjectOverview
ProjectProgress
ProjectQuickActions
RecentEpisodes
RecentTasks
```

### 快捷入口

```text
小说导入
章节管理
AI 解析
知识库
单话改编
分镜编辑
导出中心
```

---

## 7.5 小说导入页

### 页面路径

```text
/projects/:projectId/import
```

### 组件

```text
NovelUploadPanel
FileInfoCard
ChapterParsePreview
UploadProgress
```

### 页面布局

```text
左侧：上传区域
右侧：文件信息
下方：章节识别预览
```

### 交互

```text
选择 TXT 文件
↓
上传
↓
显示上传进度
↓
后端自动拆章
↓
展示章节预览
↓
保存并进入章节管理
```

### 异常提示

| 异常 | 提示 |
|---|---|
| 非 TXT | 仅支持 TXT 文件 |
| 文件过大 | 文件大小超过限制 |
| 编码失败 | 文件编码识别失败 |
| 拆章失败 | 未识别到章节，请手动调整规则 |

---

## 7.6 章节管理页

### 页面路径

```text
/projects/:projectId/chapters
```

### 组件

```text
ChapterToolbar
ChapterList
ChapterDetail
ChapterEditorDialog
ChapterAnalysisButton
```

### 页面布局

```text
左侧：章节列表
右侧：章节详情
顶部：批量操作
```

### 章节列表字段

```text
章节序号
章节标题
字数
解析状态
更新时间
```

### 章节详情字段

```text
卷名
章节标题
章节正文
字数
章节摘要
出场人物
关键事件
场景地点
伏笔
```

### 交互

```text
点击章节 → 查看详情
编辑章节 → 保存
点击解析 → 创建 AI 任务
批量选择 → 批量解析
```

---

## 7.7 AI 章节解析页

### 页面路径

```text
/projects/:projectId/analysis
```

### 组件

```text
AnalysisTaskPanel
AnalysisResultCard
AnalysisJsonViewer
SaveToKnowledgeButton
```

### 展示内容

```text
章节摘要
出场人物
新增人物
关键事件
场景地点
道具
冲突点
情绪变化
伏笔
可视化画面
漫改建议
```

### 交互

```text
开始解析
重新解析
保存到知识库
复制 JSON
查看原文
```

### 任务状态表现

| 状态 | UI |
|---|---|
| waiting | 等待中 Tag |
| running | Loading |
| success | 展示结果 |
| failed | 错误提示 + 重试按钮 |

---

## 7.8 小说知识库页

### 页面路径

```text
/projects/:projectId/knowledge
```

### 组件

```text
KnowledgeTabs
CharacterList
CharacterEditor
EventList
SceneList
ForbiddenRuleList
```

### Tab

```text
角色库
事件库
场景库
道具库
伏笔库
禁改设定
```

### 角色卡字段

```text
姓名
身份
性格
外貌摘要
Prompt 摘要
禁改项数量
```

### 交互

```text
新增角色
编辑角色
删除角色
合并角色
生成角色 Prompt
新增禁改设定
```

---

## 7.9 单话改编页

### 页面路径

```text
/projects/:projectId/episodes/create
```

### 组件

```text
ChapterSelector
EpisodeParamForm
EpisodePlanResult
EpisodeScriptPreview
```

### 页面布局

```text
左侧：章节选择
中间：改编参数
右侧：生成结果
```

### 改编参数

```text
本话标题
目标格数
漫画风格
改编强度
节奏类型
结尾钩子
保留原文对白
```

### 交互

```text
选择 1～3 章
设置参数
点击生成本话方案
轮询 AI 任务
展示本话方案
保存为新话
进入分镜生成
```

---

## 7.10 单话剧本页

### 页面路径

```text
/episodes/:episodeId/script
```

### 组件

```text
EpisodeHeader
ScriptSceneList
ScriptSceneEditor
ScriptActionBar
```

### 交互

```text
编辑本话标题
编辑本话梗概
编辑场景段落
优化对白
增强冲突
保存剧本
生成分镜
```

---

## 7.11 分镜编辑器页

### 页面路径

```text
/episodes/:episodeId/storyboard
```

### 页面目标

MVP 核心页面，用于生成和编辑漫画分镜。

### 页面布局

```text
┌──────────────┬────────────────────────┬──────────────┐
│ 本话信息       │ 分镜卡片列表             │ 漫画预览       │
│ 角色设定       │ 可编辑字段               │ Prompt 面板    │
│ 禁改提醒       │ 拖拽排序                 │ 复制 / 导出    │
└──────────────┴────────────────────────┴──────────────┘
```

### 核心组件

```text
StoryboardLayout
EpisodeInfoPanel
CharacterContextPanel
ForbiddenRulePanel
StoryboardPanelList
StoryboardPanelCard
StoryboardPanelEditor
ComicPreview
PromptPanel
StoryboardActionBar
```

### 分镜卡片字段

```text
格号
场景
人物
镜头
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

### 交互

```text
生成分镜
新增分镜
删除分镜
复制分镜
拖拽排序
编辑字段
保存分镜
复制单格 Prompt
复制全部 Prompt
重新生成单格
进入导出页
```

### 保存策略

```text
字段修改后标记 hasUnsavedChanges
点击保存批量提交
离开页面前如果未保存，弹窗提醒
```

---

## 7.12 导出页

### 页面路径

```text
/episodes/:episodeId/export
```

### 组件

```text
ExportFormatSelector
ExportTaskStatus
ExportHistoryList
DownloadButton
```

### 导出格式

```text
Excel
Word
HTML
JSON
Prompt TXT
```

### 交互

```text
选择格式
点击导出
轮询导出任务
成功后下载
查看历史导出
```

---

## 7.13 AI 任务记录页

### 页面路径

```text
/projects/:projectId/ai-tasks
```

### 组件

```text
AiTaskFilter
AiTaskTable
AiTaskDetailDrawer
RetryTaskButton
```

### 字段

```text
任务 ID
任务类型
关联对象
状态
创建时间
开始时间
完成时间
错误信息
重试次数
```

---

## 8. 通用组件设计

### 8.1 StatusTag

用于展示状态。

```text
项目状态
章节状态
AI 任务状态
分镜状态
导出状态
```

### 8.2 JsonViewer

用于展示 AI 原始 JSON。

### 8.3 ConfirmDeleteButton

用于删除确认。

### 8.4 AsyncTaskPoller

用于轮询 AI 任务。

### 8.5 FileDownloadButton

用于下载导出文件。

---

## 9. 交互规范

### 9.1 加载状态

```text
按钮级 loading
页面级 skeleton
任务级进度状态
```

### 9.2 空状态

```text
暂无项目
暂无章节
暂无解析结果
暂无角色
暂无分镜
暂无导出文件
```

### 9.3 错误提示

```text
接口错误：Message 弹窗
表单错误：字段下方提示
任务失败：结果区域展示失败原因
权限错误：跳转或提示无权限
```

### 9.4 二次确认

以下操作必须二次确认：

```text
删除项目
删除章节
删除角色
删除单话
删除分镜
重新解析覆盖结果
重新生成覆盖分镜
```

---

## 10. 前端验收标准

```text
所有 P0 页面可访问。
所有 P0 表单有基础校验。
所有 P0 接口可联调。
AI 任务状态能正确展示。
分镜编辑器可以编辑、保存、排序。
Prompt 可以复制。
导出文件可以下载。
未登录访问业务页会跳转登录。
用户体验有加载、空状态、错误提示。
```
