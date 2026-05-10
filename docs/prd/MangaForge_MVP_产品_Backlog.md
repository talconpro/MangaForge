# MangaForge MVP 产品 Backlog

版本：V0.5 MVP  
项目名称：MangaForge  
产品定位：AI 长篇小说漫画改编工作台  
文档类型：Product Backlog  
适用阶段：MVP 开发阶段  

---

## 1. 文档目标

本文档用于将 MangaForge 的产品需求拆解为可执行的产品 Backlog，方便后续：

```text
产品范围冻结
Sprint 排期
GitHub Issue 拆分
前后端开发
AI Agent 开发
测试验收
版本管理
```

本文档重点回答：

```text
MVP 做什么
MVP 不做什么
每个功能优先级是什么
每个功能服务哪个用户故事
每个功能在哪个页面实现
每个功能依赖哪些接口
每个功能如何验收
```

---

## 2. MVP 范围冻结

### 2.1 MVP 必做范围

MVP 只做从小说到漫画分镜资料导出的核心闭环。

```text
用户登录
创建项目
上传 TXT 小说
自动拆章
章节管理
AI 章节解析
基础知识库
选择 1～3 章生成单话
生成漫画剧本
生成 30～60 格分镜
分镜编辑
Prompt 复制
导出 Excel / Word / HTML / JSON / Prompt TXT
AI 任务状态查看
```

---

### 2.2 MVP 暂不做范围

以下功能进入后续版本，不进入 MVP。

```text
图片生成
LoRA 训练
多人实时协作
复杂权限系统
支付系统
版权交易
自动发布到漫画平台
移动端 App
高级管理后台
完整团队空间
评论审核流
角色参考图训练
动态漫生成
```

---

## 3. 优先级定义

| 优先级 | 定义 | 处理原则 |
|---|---|---|
| P0 | 主流程必需，没有它 MVP 跑不通 | 必须进入 MVP |
| P1 | 明显提升体验，但不阻塞主流程 | MVP 尽量做，可视时间取舍 |
| P2 | 后续版本功能 | 不进入 MVP |
| P3 | 优化类、增强类、低优先级 | 进入长期 Backlog |

---

## 4. Backlog 字段说明

每条 Backlog 包含：

| 字段 | 说明 |
|---|---|
| ID | 功能编号 |
| 模块 | 所属业务模块 |
| 功能 | 功能名称 |
| 用户故事 | 从用户视角描述价值 |
| 优先级 | P0 / P1 / P2 / P3 |
| MVP | 是否进入 MVP |
| 页面 | 对应页面 |
| 接口依赖 | 后端接口 |
| 验收标准 | 完成判定 |
| Sprint 建议 | 建议开发阶段 |

---

## 5. 用户与认证模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| AUTH-001 | 用户登录 | 作为用户，我希望登录系统后管理自己的项目 | P0 | 是 | 登录页 | `POST /auth/login` | Sprint 1 |
| AUTH-002 | 获取当前用户 | 作为用户，我希望系统识别我的身份和权限 | P0 | 是 | 全局 | `GET /auth/me` | Sprint 1 |
| AUTH-003 | 用户退出 | 作为用户，我希望可以安全退出系统 | P0 | 是 | 全局顶部栏 | 前端清除 Token | Sprint 1 |
| AUTH-004 | 路由鉴权 | 作为用户，未登录时不能访问业务页面 | P0 | 是 | 全局路由 | 前端 Router Guard | Sprint 1 |
| AUTH-005 | 注册账号 | 作为新用户，我希望自行注册账号 | P2 | 否 | 注册页 | `POST /auth/register` | 后续 |
| AUTH-006 | 忘记密码 | 作为用户，我希望找回密码 | P2 | 否 | 忘记密码页 | 待定 | 后续 |

### 验收标准

```text
用户可以登录。
登录成功后跳转项目工作台。
登录失败有错误提示。
未登录访问业务页跳转登录页。
退出后 Token 被清除。
```

---

## 6. 项目管理模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| PROJ-001 | 创建项目 | 作为用户，我希望创建一个小说漫改项目 | P0 | 是 | 创建项目页 | `POST /projects` | Sprint 1 |
| PROJ-002 | 项目列表 | 作为用户，我希望看到自己的所有项目 | P0 | 是 | 项目工作台 | `GET /projects` | Sprint 1 |
| PROJ-003 | 项目详情 | 作为用户，我希望查看项目进度和快捷入口 | P0 | 是 | 项目详情页 | `GET /projects/{id}` | Sprint 1 |
| PROJ-004 | 编辑项目 | 作为用户，我希望修改项目基础信息 | P1 | 是 | 项目详情页 | `PUT /projects/{id}` | Sprint 1 |
| PROJ-005 | 删除项目 | 作为用户，我希望删除不再需要的项目 | P0 | 是 | 项目工作台 | `DELETE /projects/{id}` | Sprint 1 |
| PROJ-006 | 项目搜索 | 作为用户，我希望快速搜索项目 | P1 | 是 | 项目工作台 | `GET /projects?keyword=` | Sprint 1 |
| PROJ-007 | 项目状态筛选 | 作为用户，我希望按状态筛选项目 | P1 | 是 | 项目工作台 | `GET /projects?status=` | Sprint 1 |
| PROJ-008 | 项目统计 | 作为用户，我希望看到项目总数、已生成话数等统计 | P1 | 是 | 项目工作台 | `GET /projects/stats` 或列表聚合 | Sprint 1 |
| PROJ-009 | 项目归档 | 作为用户，我希望归档已完成项目 | P2 | 否 | 项目详情页 | 待定 | 后续 |

### 验收标准

```text
用户可以创建项目。
项目列表只展示当前用户项目。
项目详情展示项目基础信息和进度。
删除项目需要二次确认。
用户不能访问他人项目。
```

---

## 7. 小说导入模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| NOVEL-001 | TXT 上传 | 作为用户，我希望上传 TXT 小说作为改编源文件 | P0 | 是 | 小说导入页 | `POST /projects/{id}/novel/upload` | Sprint 2 |
| NOVEL-002 | 文件格式校验 | 作为用户，我希望系统拒绝不支持的文件 | P0 | 是 | 小说导入页 | 上传接口 | Sprint 2 |
| NOVEL-003 | 文件大小校验 | 作为用户，我希望过大文件有明确提示 | P0 | 是 | 小说导入页 | 上传接口 | Sprint 2 |
| NOVEL-004 | 编码识别 | 作为用户，我希望 TXT 不乱码 | P0 | 是 | 小说导入页 | 上传接口 | Sprint 2 |
| NOVEL-005 | 上传进度 | 作为用户，我希望看到上传进度 | P1 | 是 | 小说导入页 | 前端上传事件 | Sprint 2 |
| NOVEL-006 | 文件信息展示 | 作为用户，我希望看到文件名、大小、字数、章节数 | P0 | 是 | 小说导入页 | 上传接口返回 | Sprint 2 |
| NOVEL-007 | EPUB 上传 | 作为用户，我希望上传 EPUB 小说 | P2 | 否 | 小说导入页 | 待定 | 后续 |
| NOVEL-008 | Word 上传 | 作为用户，我希望上传 Word 小说 | P2 | 否 | 小说导入页 | 待定 | 后续 |

### 验收标准

```text
用户可以上传 TXT 文件。
非 TXT 文件会被拒绝。
文件上传后系统返回文件信息。
UTF-8 / GBK 文件内容不乱码。
上传失败有明确错误提示。
```

---

## 8. 自动拆章模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| CHSPLIT-001 | 自动章节识别 | 作为用户，我希望系统自动把小说拆成章节 | P0 | 是 | 小说导入页 | 上传接口 / `POST /novel/parse-chapters` | Sprint 2 |
| CHSPLIT-002 | 拆章结果预览 | 作为用户，我希望确认拆章结果是否正确 | P0 | 是 | 小说导入页 | `GET /projects/{id}/chapters` | Sprint 2 |
| CHSPLIT-003 | 支持中文章节格式 | 作为用户，我希望识别“第1章 / 第一章”等格式 | P0 | 是 | 后端 | 拆章服务 | Sprint 2 |
| CHSPLIT-004 | 支持英文 Chapter 格式 | 作为用户，我希望识别 Chapter 1 | P1 | 是 | 后端 | 拆章服务 | Sprint 2 |
| CHSPLIT-005 | 重新拆章 | 作为用户，我希望拆错后可以重新拆章 | P1 | 是 | 小说导入页 | `POST /projects/{id}/novel/parse-chapters` | Sprint 2 |
| CHSPLIT-006 | 自定义拆章规则 | 作为高级用户，我希望自定义章节正则 | P2 | 否 | 小说导入页 | 待定 | 后续 |
| CHSPLIT-007 | 广告段落清洗 | 作为用户，我希望清理小说广告段落 | P2 | 否 | 小说导入页 | 待定 | 后续 |

### 验收标准

```text
系统可以识别常见中文网文章节格式。
章节列表顺序正确。
章节标题和字数显示正确。
常见格式拆章准确率 ≥ 95%。
未识别章节时有明确提示。
```

---

## 9. 章节管理模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| CH-001 | 章节列表 | 作为用户，我希望查看小说所有章节 | P0 | 是 | 章节管理页 | `GET /projects/{id}/chapters` | Sprint 2 |
| CH-002 | 章节详情 | 作为用户，我希望阅读章节正文 | P0 | 是 | 章节管理页 | `GET /chapters/{id}` | Sprint 2 |
| CH-003 | 编辑章节 | 作为用户，我希望修改章节标题和正文 | P0 | 是 | 章节管理页 | `PUT /chapters/{id}` | Sprint 2 |
| CH-004 | 删除章节 | 作为用户，我希望删除错误章节 | P1 | 是 | 章节管理页 | `DELETE /chapters/{id}` | Sprint 2 |
| CH-005 | 合并章节 | 作为用户，我希望合并过短章节 | P1 | 是 | 章节管理页 | `POST /chapters/merge` | Sprint 2 |
| CH-006 | 拆分章节 | 作为用户，我希望拆分过长章节 | P1 | 是 | 章节管理页 | `POST /chapters/{id}/split` | Sprint 2 |
| CH-007 | 章节搜索 | 作为用户，我希望按标题搜索章节 | P1 | 是 | 章节管理页 | `GET /chapters?keyword=` | Sprint 2 |
| CH-008 | 批量选择章节 | 作为用户，我希望选择多章进行解析 | P0 | 是 | 章节管理页 | 前端状态 | Sprint 3 |
| CH-009 | 章节锁定 | 作为用户，我希望锁定已确认章节 | P2 | 否 | 章节管理页 | 待定 | 后续 |

### 验收标准

```text
用户可以查看章节列表和正文。
用户可以编辑章节标题和正文。
删除章节需要二次确认。
章节修改后刷新页面仍保留。
章节状态显示正确。
```

---

## 10. AI 任务模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| TASK-001 | 创建 AI 任务 | 作为用户，我希望 AI 操作异步执行 | P0 | 是 | 多页面 | 各 AI 创建接口 | Sprint 3 |
| TASK-002 | 查询任务状态 | 作为用户，我希望看到 AI 是否完成 | P0 | 是 | 多页面 | `GET /ai-tasks/{id}` | Sprint 3 |
| TASK-003 | 任务状态轮询 | 作为用户，我希望页面自动更新任务状态 | P0 | 是 | 多页面 | 前端轮询 | Sprint 3 |
| TASK-004 | 任务失败展示 | 作为用户，我希望知道 AI 为什么失败 | P0 | 是 | 多页面 | `GET /ai-tasks/{id}` | Sprint 3 |
| TASK-005 | 失败任务重试 | 作为用户，我希望重新执行失败任务 | P0 | 是 | AI 任务页 / 结果页 | `POST /ai-tasks/{id}/retry` | Sprint 3 |
| TASK-006 | AI 任务记录页 | 作为用户，我希望查看所有 AI 任务历史 | P1 | 是 | AI 任务记录页 | `GET /projects/{id}/ai-tasks` | Sprint 3 |
| TASK-007 | 取消任务 | 作为用户，我希望取消等待中的任务 | P1 | 是 | AI 任务记录页 | `POST /ai-tasks/{id}/cancel` | Sprint 3 |
| TASK-008 | 任务进度百分比 | 作为用户，我希望看到更细的进度 | P2 | 否 | 多页面 | 待定 | 后续 |

### 验收标准

```text
AI 操作返回 task_id。
前端可以轮询任务状态。
任务成功后展示结果。
任务失败展示错误信息。
失败任务可以重试。
```

---

## 11. AI 章节解析模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| ANA-001 | 单章解析 | 作为用户，我希望 AI 解析某一章内容 | P0 | 是 | 章节管理 / AI 解析页 | `POST /chapters/{id}/analyze` | Sprint 3 |
| ANA-002 | 批量解析 | 作为用户，我希望一次解析多个章节 | P0 | 是 | 章节管理页 | `POST /chapters/batch-analyze` | Sprint 3 |
| ANA-003 | 解析结果展示 | 作为用户，我希望看到摘要、人物、事件、场景 | P0 | 是 | AI 解析页 | `GET /chapters/{id}/analysis` | Sprint 3 |
| ANA-004 | 重新解析 | 作为用户，我希望覆盖错误解析结果 | P0 | 是 | AI 解析页 | `POST /chapters/{id}/analyze?force=true` | Sprint 3 |
| ANA-005 | 复制解析 JSON | 作为用户，我希望复制 AI 原始结构化结果 | P1 | 是 | AI 解析页 | 前端复制 | Sprint 3 |
| ANA-006 | 查看原文 | 作为用户，我希望对照原文检查解析结果 | P1 | 是 | AI 解析页 | `GET /chapters/{id}` | Sprint 3 |
| ANA-007 | 分段解析超长章节 | 作为用户，我希望超长章节也能解析 | P2 | 否 | 后端 | 后续 | 后续 |

### 验收标准

```text
章节解析可返回 summary、characters、events、scenes、props、conflicts、emotions、foreshadowing、visual_moments。
解析结果可保存。
解析失败可重试。
重新解析需要二次确认。
```

---

## 12. 知识库模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| KB-001 | 保存解析结果到知识库 | 作为用户，我希望将 AI 提取的人物和事件沉淀下来 | P0 | 是 | AI 解析页 | `POST /analysis/{id}/save-to-knowledge` | Sprint 3 |
| KB-002 | 角色列表 | 作为用户，我希望查看小说角色库 | P0 | 是 | 知识库页 | `GET /projects/{id}/characters` | Sprint 3 |
| KB-003 | 新增角色 | 作为用户，我希望手动新增角色 | P0 | 是 | 知识库页 | `POST /projects/{id}/characters` | Sprint 3 |
| KB-004 | 编辑角色 | 作为用户，我希望修改角色外貌、性格和 Prompt | P0 | 是 | 知识库页 | `PUT /characters/{id}` | Sprint 3 |
| KB-005 | 删除角色 | 作为用户，我希望删除错误角色 | P1 | 是 | 知识库页 | `DELETE /characters/{id}` | Sprint 3 |
| KB-006 | 事件列表 | 作为用户，我希望查看关键事件 | P1 | 是 | 知识库页 | `GET /projects/{id}/events` | Sprint 3 |
| KB-007 | 场景列表 | 作为用户，我希望查看场景设定 | P1 | 是 | 知识库页 | `GET /projects/{id}/scenes` | Sprint 3 |
| KB-008 | 禁改设定列表 | 作为用户，我希望管理不能改动的设定 | P1 | 是 | 知识库页 | `GET /projects/{id}/forbidden-rules` | Sprint 3 |
| KB-009 | 新增禁改设定 | 作为用户，我希望新增禁止改动规则 | P1 | 是 | 知识库页 | `POST /projects/{id}/forbidden-rules` | Sprint 3 |
| KB-010 | 角色合并 | 作为用户，我希望合并重复角色 | P2 | 否 | 知识库页 | 待定 | 后续 |
| KB-011 | 角色参考图 | 作为用户，我希望上传角色参考图 | P2 | 否 | 知识库页 | 待定 | 后续 |

### 验收标准

```text
用户可以查看角色库。
用户可以新增和编辑角色。
角色 Prompt 可以保存。
解析结果可以生成角色和事件。
禁改设定可以新增。
```

---

## 13. 单话改编模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| EP-001 | 选择源章节 | 作为用户，我希望选择 1～3 章生成一话 | P0 | 是 | 单话改编页 | `GET /projects/{id}/chapters` | Sprint 4 |
| EP-002 | 限制章节数量 | 作为用户，我希望系统防止一次选择过多章节 | P0 | 是 | 单话改编页 | 前端校验 | Sprint 4 |
| EP-003 | 改编参数设置 | 作为用户，我希望设置目标格数、风格和改编强度 | P0 | 是 | 单话改编页 | 前端表单 | Sprint 4 |
| EP-004 | 生成单话方案 | 作为用户，我希望 AI 生成本话标题、梗概和钩子 | P0 | 是 | 单话改编页 | `POST /projects/{id}/episodes/generate-plan` | Sprint 4 |
| EP-005 | 创建单话 | 作为用户，我希望保存生成结果为一话 | P0 | 是 | 单话改编页 | `POST /projects/{id}/episodes` | Sprint 4 |
| EP-006 | 单话详情 | 作为用户，我希望查看单话内容 | P0 | 是 | 单话剧本页 | `GET /episodes/{id}` | Sprint 4 |
| EP-007 | 编辑单话 | 作为用户，我希望修改本话标题、梗概、剧本 | P0 | 是 | 单话剧本页 | `PUT /episodes/{id}` | Sprint 4 |
| EP-008 | 单话列表 | 作为用户，我希望查看项目下所有话 | P1 | 是 | 项目详情页 | `GET /projects/{id}/episodes` | Sprint 4 |
| EP-009 | 删除单话 | 作为用户，我希望删除错误生成的话 | P1 | 是 | 单话列表 | `DELETE /episodes/{id}` | Sprint 4 |
| EP-010 | 分季规划 | 作为用户，我希望系统生成整季规划 | P2 | 否 | 漫改规划页 | 后续 | 后续 |

### 验收标准

```text
用户只能选择 1～3 章。
用户可以设置目标格数 30～60。
AI 可以生成标题、梗概、冲突、情绪曲线、钩子、剧本。
生成结果可以保存为单话。
单话剧本可以编辑。
```

---

## 14. 分镜生成模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| SBGEN-001 | 生成分镜 | 作为用户，我希望 AI 把漫画剧本拆成分镜 | P0 | 是 | 分镜编辑器 | `POST /episodes/{id}/storyboards/generate` | Sprint 5 |
| SBGEN-002 | 控制目标格数 | 作为用户，我希望分镜接近目标格数 | P0 | 是 | 分镜编辑器 | 生成接口参数 | Sprint 5 |
| SBGEN-003 | 生成绘图 Prompt | 作为用户，我希望每格都有绘图提示词 | P0 | 是 | 分镜编辑器 | StoryboardAgent | Sprint 5 |
| SBGEN-004 | 生成负面 Prompt | 作为用户，我希望减少出图错误 | P1 | 是 | 分镜编辑器 | StoryboardAgent | Sprint 5 |
| SBGEN-005 | 生成音效字 | 作为用户，我希望分镜包含漫画音效 | P1 | 是 | 分镜编辑器 | StoryboardAgent | Sprint 5 |
| SBGEN-006 | 一致性检查 | 作为用户，我希望检查分镜是否违背设定 | P1 | 可选 | 分镜编辑器 | ConsistencyCheckAgent | Sprint 5 / 后续 |
| SBGEN-007 | 单格重新生成 | 作为用户，我希望只重生成某一格 | P1 | 可选 | 分镜编辑器 | `POST /storyboards/{id}/regenerate` | Sprint 5 / 后续 |
| SBGEN-008 | 分镜质量评分 | 作为用户，我希望知道分镜质量 | P2 | 否 | 分镜编辑器 | 后续 | 后续 |

### 验收标准

```text
系统可以生成 30～60 格分镜。
实际分镜数量误差不超过目标格数 ±10%。
每格包含画面描述、景别、对白/旁白、Prompt。
分镜生成失败可重试。
```

---

## 15. 分镜编辑器模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| SB-001 | 分镜列表 | 作为用户，我希望查看本话所有分镜 | P0 | 是 | 分镜编辑器 | `GET /episodes/{id}/storyboards` | Sprint 5 |
| SB-002 | 分镜卡片展示 | 作为用户，我希望每格信息清晰展示 | P0 | 是 | 分镜编辑器 | 分镜列表接口 | Sprint 5 |
| SB-003 | 编辑分镜字段 | 作为用户，我希望修改画面、对白、Prompt | P0 | 是 | 分镜编辑器 | `PUT /storyboards/{id}` | Sprint 5 |
| SB-004 | 新增分镜 | 作为用户，我希望手动增加一格 | P0 | 是 | 分镜编辑器 | `POST /episodes/{id}/storyboards` | Sprint 5 |
| SB-005 | 删除分镜 | 作为用户，我希望删除多余分镜 | P0 | 是 | 分镜编辑器 | `DELETE /storyboards/{id}` | Sprint 5 |
| SB-006 | 复制分镜 | 作为用户，我希望复制已有分镜作为模板 | P1 | 是 | 分镜编辑器 | 新增接口 | Sprint 5 |
| SB-007 | 拖拽排序 | 作为用户，我希望调整分镜顺序 | P0 | 是 | 分镜编辑器 | `POST /episodes/{id}/storyboards/reorder` | Sprint 5 |
| SB-008 | 保存提示 | 作为用户，我希望知道修改是否已保存 | P0 | 是 | 分镜编辑器 | 更新接口 | Sprint 5 |
| SB-009 | 离开未保存提醒 | 作为用户，我希望避免误丢修改 | P1 | 是 | 分镜编辑器 | 前端路由守卫 | Sprint 5 |
| SB-010 | 漫画预览 | 作为用户，我希望看到竖版漫画结构预览 | P1 | 是 | 分镜编辑器 | 分镜列表接口 | Sprint 5 |
| SB-011 | 批量编辑 | 作为用户，我希望批量修改分镜状态 | P2 | 否 | 分镜编辑器 | 后续 | 后续 |

### 验收标准

```text
用户可以查看分镜列表。
用户可以编辑每格核心字段。
用户可以新增、删除、复制分镜。
用户可以拖拽调整顺序。
修改后可以保存。
未保存离开有提示。
```

---

## 16. Prompt 管理模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| PROMPT-001 | 单格 Prompt 展示 | 作为用户，我希望看到每格绘图 Prompt | P0 | 是 | 分镜编辑器 | 分镜列表接口 | Sprint 5 |
| PROMPT-002 | 编辑 Prompt | 作为用户，我希望手动修改 Prompt | P0 | 是 | 分镜编辑器 | `PUT /storyboards/{id}` | Sprint 5 |
| PROMPT-003 | 复制单格 Prompt | 作为用户，我希望复制某一格 Prompt | P0 | 是 | 分镜编辑器 | 前端复制 | Sprint 5 |
| PROMPT-004 | 复制全部 Prompt | 作为用户，我希望一次复制全部 Prompt | P0 | 是 | 分镜编辑器 | `GET /episodes/{id}/storyboards/prompts` | Sprint 5 |
| PROMPT-005 | 导出 Prompt TXT | 作为用户，我希望导出 Prompt 文件 | P0 | 是 | 导出页 | `POST /episodes/{id}/export/prompts` | Sprint 6 |
| PROMPT-006 | Prompt 模板管理 | 作为用户，我希望配置 Prompt 风格模板 | P2 | 否 | 设置页 | 后续 | 后续 |

### 验收标准

```text
每格 Prompt 可见。
Prompt 可编辑和保存。
单格 Prompt 可复制。
全部 Prompt 可复制。
Prompt TXT 可导出。
```

---

## 17. 导出模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| EXPORT-001 | 导出 Excel | 作为用户，我希望导出分镜表格 | P0 | 是 | 导出页 | `POST /episodes/{id}/export/excel` | Sprint 6 |
| EXPORT-002 | 导出 Word | 作为用户，我希望导出漫画剧本和分镜说明 | P0 | 是 | 导出页 | `POST /episodes/{id}/export/word` | Sprint 6 |
| EXPORT-003 | 导出 HTML | 作为用户，我希望导出可预览的漫画结构 | P0 | 是 | 导出页 | `POST /episodes/{id}/export/html` | Sprint 6 |
| EXPORT-004 | 导出 JSON | 作为用户，我希望导出结构化原始数据 | P0 | 是 | 导出页 | `POST /episodes/{id}/export/json` | Sprint 6 |
| EXPORT-005 | 导出 Prompt TXT | 作为用户，我希望导出全部 Prompt | P0 | 是 | 导出页 | `POST /episodes/{id}/export/prompts` | Sprint 6 |
| EXPORT-006 | 导出进度展示 | 作为用户，我希望知道导出是否完成 | P0 | 是 | 导出页 | AI 任务 / 导出任务状态 | Sprint 6 |
| EXPORT-007 | 下载文件 | 作为用户，我希望下载导出文件 | P0 | 是 | 导出页 | `GET /export-files/{id}/download` | Sprint 6 |
| EXPORT-008 | 导出历史 | 作为用户，我希望查看历史导出文件 | P1 | 是 | 导出页 | `GET /projects/{id}/exports` | Sprint 6 |
| EXPORT-009 | 批量导出多话 | 作为用户，我希望批量导出多话资料 | P2 | 否 | 导出中心 | 后续 | 后续 |

### 验收标准

```text
Excel 可下载且字段完整。
Word 可下载且包含剧本和分镜。
HTML 可打开预览。
JSON 格式正确。
Prompt TXT 包含全部 Prompt。
导出失败可提示并重试。
```

---

## 18. 权限与安全模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| SEC-001 | 用户资源隔离 | 作为用户，我不能看到他人项目 | P0 | 是 | 全局 | 后端权限校验 | Sprint 1 |
| SEC-002 | 项目权限校验 | 作为用户，我只能操作自己的项目 | P0 | 是 | 全局 | 后端 Service 校验 | Sprint 1 |
| SEC-003 | 文件类型限制 | 作为系统，我需要拒绝非法文件 | P0 | 是 | 小说导入页 | 上传接口 | Sprint 2 |
| SEC-004 | 文件大小限制 | 作为系统，我需要防止超大文件影响服务 | P0 | 是 | 小说导入页 | 上传接口 | Sprint 2 |
| SEC-005 | 删除二次确认 | 作为用户，我希望避免误删 | P0 | 是 | 多页面 | 前端 Confirm | Sprint 1～5 |
| SEC-006 | 操作日志 | 作为管理员，我希望追踪重要操作 | P2 | 否 | 后台 | 后续 | 后续 |
| SEC-007 | 团队权限 | 作为团队成员，我希望不同成员有不同权限 | P2 | 否 | 团队设置 | 后续 | 后续 |

### 验收标准

```text
用户不能访问他人项目。
所有 project_id 相关接口必须校验权限。
非法文件无法上传。
删除操作必须二次确认。
```

---

## 19. 数据一致性与逻辑外键模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| DB-001 | 逻辑外键字段保留 | 作为系统，我需要通过 ID 维护表关系 | P0 | 是 | 后端 | 数据库 | Sprint 0 |
| DB-002 | 关联字段索引 | 作为系统，我需要保证查询性能 | P0 | 是 | 后端 | 数据库 | Sprint 0 |
| DB-003 | Service 层资源校验 | 作为系统，我需要保证资源关系正确 | P0 | 是 | 后端 | Service 层 | Sprint 1～5 |
| DB-004 | 统一删除服务 | 作为系统，我需要避免残留数据 | P0 | 是 | 后端 | DeleteService | Sprint 1～5 |
| DB-005 | 软删除字段 | 作为系统，我希望删除后可追溯 | P1 | 是 | 后端 | 数据库 | Sprint 1 |
| DB-006 | 孤儿数据巡检脚本 | 作为系统，我需要定期发现脏数据 | P1 | 是 | 运维脚本 | SQL 脚本 | Sprint 6 |
| DB-007 | 自动清理任务 | 作为系统，我希望自动处理孤儿数据 | P2 | 否 | 运维 | 后续 | 后续 |

### 验收标准

```text
数据库不使用物理外键。
所有逻辑外键字段有索引。
创建资源前 Service 层校验父资源存在。
删除项目、章节、单话走统一服务。
孤儿数据巡检 SQL 可执行。
```

---

## 20. 部署与运维模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| OPS-001 | Docker Compose | 作为开发者，我希望一键启动本地环境 | P0 | 是 | 无 | Docker | Sprint 0 |
| OPS-002 | PostgreSQL 服务 | 作为系统，我需要持久化业务数据 | P0 | 是 | 无 | Docker | Sprint 0 |
| OPS-003 | Redis 服务 | 作为系统，我需要异步任务队列 | P0 | 是 | 无 | Docker | Sprint 0 |
| OPS-004 | MinIO 服务 | 作为系统，我需要存储文件 | P0 | 是 | 无 | Docker | Sprint 0 |
| OPS-005 | FastAPI 服务 | 作为系统，我需要提供 API | P0 | 是 | 无 | Docker | Sprint 0 |
| OPS-006 | Celery Worker | 作为系统，我需要执行异步任务 | P0 | 是 | 无 | Docker | Sprint 3 |
| OPS-007 | Vue Web 服务 | 作为用户，我需要访问前端系统 | P0 | 是 | 无 | Docker | Sprint 1 |
| OPS-008 | .env.example | 作为开发者，我需要知道环境变量 | P0 | 是 | 无 | 文件 | Sprint 0 |
| OPS-009 | 日志查看 | 作为开发者，我希望快速排查问题 | P1 | 是 | 无 | Docker logs | Sprint 6 |
| OPS-010 | 生产 HTTPS | 作为用户，我希望安全访问 | P2 | 否 | 无 | Nginx | 后续 |

### 验收标准

```text
docker compose up -d 可以启动基础环境。
FastAPI /health 正常。
前端可访问。
PostgreSQL、Redis、MinIO 可用。
Worker 可执行任务。
```

---

## 21. 测试验收模块

| ID | 功能 | 用户故事 | 优先级 | MVP | 页面 | 接口依赖 | Sprint |
|---|---|---|---|---|---|---|---|
| QA-001 | 主流程测试用例 | 作为项目团队，我需要验证完整闭环 | P0 | 是 | 无 | 全流程 | Sprint 6 |
| QA-002 | 登录测试 | 作为项目团队，我需要验证认证可用 | P0 | 是 | 登录页 | Auth API | Sprint 1 |
| QA-003 | 上传测试 | 作为项目团队，我需要验证小说上传 | P0 | 是 | 小说导入页 | 上传 API | Sprint 2 |
| QA-004 | 拆章测试 | 作为项目团队，我需要验证章节识别 | P0 | 是 | 小说导入页 | 拆章服务 | Sprint 2 |
| QA-005 | AI 任务测试 | 作为项目团队，我需要验证 AI 异步任务 | P0 | 是 | 多页面 | AI Task API | Sprint 3 |
| QA-006 | 分镜测试 | 作为项目团队，我需要验证分镜生成和编辑 | P0 | 是 | 分镜编辑器 | Storyboard API | Sprint 5 |
| QA-007 | 导出测试 | 作为项目团队，我需要验证导出文件 | P0 | 是 | 导出页 | Export API | Sprint 6 |
| QA-008 | 权限测试 | 作为项目团队，我需要验证资源隔离 | P0 | 是 | 全局 | 权限校验 | Sprint 6 |
| QA-009 | 性能测试 | 作为项目团队，我需要验证基础性能 | P1 | 是 | 全局 | 全流程 | Sprint 6 |
| QA-010 | 自动化测试 | 作为项目团队，我希望自动回归 | P2 | 否 | 无 | 后续 | 后续 |

### 验收标准

```text
主流程测试通过。
P0 缺陷全部修复。
P1 缺陷无重大阻塞。
导出文件完整。
MVP 可稳定演示。
```

---

## 22. GitHub Issue 拆分建议

### 22.1 Issue 标题格式

```text
[模块] 功能名称
```

示例：

```text
[Project] 创建项目接口
[Novel] TXT 上传与自动拆章
[AI] NovelChapterAnalysisAgent 初版
[Storyboard] 分镜卡片编辑组件
[Export] Excel 导出
```

---

### 22.2 Issue 内容模板

```md
## 背景

## 用户故事

## 功能说明

## 页面 / 接口

## 验收标准

## 优先级

## Sprint

## 依赖
```

---

### 22.3 标签建议

```text
type:feature
type:bug
type:docs
type:refactor
type:test
type:infra
type:ai

module:web
module:api
module:agent
module:worker
module:export
module:database
module:deployment

priority:P0
priority:P1
priority:P2
priority:P3

sprint:0
sprint:1
sprint:2
sprint:3
sprint:4
sprint:5
sprint:6
```

---

## 23. Sprint 分配建议

### Sprint 0：项目初始化

```text
OPS-001
OPS-002
OPS-003
OPS-004
OPS-008
DB-001
DB-002
```

---

### Sprint 1：基础平台

```text
AUTH-001
AUTH-002
AUTH-003
AUTH-004
PROJ-001
PROJ-002
PROJ-003
PROJ-004
PROJ-005
SEC-001
SEC-002
```

---

### Sprint 2：小说导入与章节管理

```text
NOVEL-001
NOVEL-002
NOVEL-003
NOVEL-004
NOVEL-005
NOVEL-006
CHSPLIT-001
CHSPLIT-002
CHSPLIT-003
CHSPLIT-004
CHSPLIT-005
CH-001
CH-002
CH-003
CH-004
CH-005
CH-006
```

---

### Sprint 3：AI 解析与知识库

```text
TASK-001
TASK-002
TASK-003
TASK-004
TASK-005
TASK-006
ANA-001
ANA-002
ANA-003
ANA-004
KB-001
KB-002
KB-003
KB-004
KB-006
KB-008
KB-009
OPS-006
```

---

### Sprint 4：单话改编

```text
EP-001
EP-002
EP-003
EP-004
EP-005
EP-006
EP-007
EP-008
```

---

### Sprint 5：分镜生成与编辑

```text
SBGEN-001
SBGEN-002
SBGEN-003
SBGEN-004
SBGEN-005
SB-001
SB-002
SB-003
SB-004
SB-005
SB-006
SB-007
SB-008
SB-009
SB-010
PROMPT-001
PROMPT-002
PROMPT-003
PROMPT-004
```

---

### Sprint 6：导出、测试、部署

```text
EXPORT-001
EXPORT-002
EXPORT-003
EXPORT-004
EXPORT-005
EXPORT-006
EXPORT-007
EXPORT-008
PROMPT-005
DB-006
QA-001
QA-002
QA-003
QA-004
QA-005
QA-006
QA-007
QA-008
QA-009
OPS-009
```

---

## 24. MVP 发布验收标准

MVP 版本发布前必须满足：

```text
1. 用户可以登录。
2. 用户可以创建项目。
3. 用户可以上传 TXT 小说。
4. 系统可以自动拆章。
5. 用户可以查看和编辑章节。
6. 用户可以 AI 解析章节。
7. 用户可以保存角色到知识库。
8. 用户可以选择 1～3 章生成一话。
9. 系统可以生成漫画剧本。
10. 系统可以生成 30～60 格分镜。
11. 用户可以编辑分镜。
12. 用户可以复制 Prompt。
13. 用户可以导出 Excel。
14. 用户可以导出 Word。
15. 用户可以导出 HTML。
16. 用户可以导出 JSON。
17. 用户可以导出 Prompt TXT。
18. 用户不能访问他人项目。
19. AI 失败任务可以重试。
20. Docker Compose 可启动演示环境。
```

---

## 25. 产品经理验收关注点

产品经理验收时重点看：

```text
主流程是否顺畅
AI 结果是否可编辑
分镜字段是否完整
导出资料是否真的可交付给漫画制作
失败状态是否可恢复
用户是否知道下一步该做什么
MVP 是否出现范围膨胀
```

---

## 26. Backlog 后续版本池

### V1.0 候选功能

```text
整季漫改规划
批量章节解析
高级角色一致性检查
向量检索知识库
场景库增强
伏笔库增强
团队空间
评论审核流
图片生成接入
角色参考图管理
```

### V2.0 候选功能

```text
LoRA / 风格模型绑定
批量出图
动态漫脚本生成
商业化套餐
私有化部署
API 开放平台
漫画平台发布对接
IP 评估报告
```

---

## 27. 结论

MangaForge MVP 的产品 Backlog 应围绕一个目标推进：

> 让用户可以把小说章节稳定转成可编辑、可导出的漫画分镜制作资料。

当前阶段必须坚持：

```text
先 P0，后 P1，再 P2。
先主流程，后高级能力。
先 Prompt，后出图。
先单用户，后团队协作。
先可编辑，后全自动。
```

只要 MVP 跑通从“TXT 小说 → 章节解析 → 单话剧本 → 分镜 → Prompt → 导出”的闭环，MangaForge 就具备继续迭代为完整 AI 漫改生产平台的基础。
