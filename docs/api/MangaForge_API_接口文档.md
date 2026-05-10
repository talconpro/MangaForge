# MangaForge API 接口文档

版本：V0.5 MVP  
项目名称：MangaForge  
后端框架：Python FastAPI  
接口风格：RESTful API  
鉴权方式：JWT Bearer Token  
文档类型：API Reference  

---

## 1. 基础信息

### 1.1 Base URL

开发环境：

```text
http://localhost:8000/api/v1
```

生产环境示例：

```text
https://api.mangaforge.example.com/api/v1
```

---

## 2. 通用规范

### 2.1 请求头

需要鉴权的接口必须携带：

```http
Authorization: Bearer <access_token>
```

文件上传：

```http
Content-Type: multipart/form-data
```

JSON 请求：

```http
Content-Type: application/json
```

---

### 2.2 统一响应格式

成功：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "request_id": "uuid"
}
```

失败：

```json
{
  "code": 40001,
  "message": "项目不存在或无权限访问",
  "data": null,
  "request_id": "uuid"
}
```

---

### 2.3 常用错误码

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

## 3. 认证接口

---

### 3.1 用户登录

```http
POST /auth/login
```

#### 请求参数

```json
{
  "account": "demo@example.com",
  "password": "123456"
}
```

#### 返回参数

```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "username": "demo",
    "role": "user"
  }
}
```

---

### 3.2 获取当前用户

```http
GET /auth/me
```

#### 返回参数

```json
{
  "id": 1,
  "username": "demo",
  "email": "demo@example.com",
  "role": "user"
}
```

---

## 4. 项目接口

---

### 4.1 创建项目

```http
POST /projects
```

#### 请求参数

```json
{
  "project_name": "云州旧梦漫改",
  "novel_name": "云州旧梦",
  "author": "佚名",
  "genre": "古风",
  "comic_style": "古风国漫",
  "target_reader": "女频",
  "adaptation_goal": "改编为竖版连载漫画"
}
```

#### 返回参数

```json
{
  "id": 1,
  "project_name": "云州旧梦漫改",
  "novel_name": "云州旧梦",
  "status": "pending_upload",
  "created_at": "2026-05-10T10:00:00"
}
```

---

### 4.2 项目列表

```http
GET /projects
```

#### Query 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| keyword | string | 否 | 项目名称搜索 |
| status | string | 否 | 项目状态 |
| page | int | 否 | 默认 1 |
| page_size | int | 否 | 默认 20 |

#### 返回参数

```json
{
  "items": [
    {
      "id": 1,
      "project_name": "云州旧梦漫改",
      "novel_name": "云州旧梦",
      "genre": "古风",
      "comic_style": "古风国漫",
      "word_count": 120000,
      "chapter_count": 30,
      "analyzed_chapter_count": 10,
      "episode_count": 2,
      "status": "analyzed",
      "updated_at": "2026-05-10T10:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

---

### 4.3 项目详情

```http
GET /projects/{project_id}
```

---

### 4.4 更新项目

```http
PUT /projects/{project_id}
```

---

### 4.5 删除项目

```http
DELETE /projects/{project_id}
```

---

## 5. 小说上传与章节接口

---

### 5.1 上传小说 TXT

```http
POST /projects/{project_id}/novel/upload
```

#### 请求方式

```http
multipart/form-data
```

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| file | file | 是 | TXT 文件 |

#### 返回参数

```json
{
  "file_id": 1,
  "file_name": "yunzhou.txt",
  "file_size": 102400,
  "encoding": "utf-8",
  "word_count": 120000,
  "chapter_count": 30
}
```

---

### 5.2 重新拆章

```http
POST /projects/{project_id}/novel/parse-chapters
```

#### 请求参数

```json
{
  "file_id": 1,
  "rules": ["第\\s*\\d+\\s*章", "第[一二三四五六七八九十百千]+章"]
}
```

---

### 5.3 获取章节列表

```http
GET /projects/{project_id}/chapters
```

#### Query 参数

| 参数 | 类型 | 说明 |
|---|---|---|
| keyword | string | 章节标题搜索 |
| analysis_status | string | 解析状态 |
| page | int | 页码 |
| page_size | int | 每页数量 |

#### 返回参数

```json
{
  "items": [
    {
      "id": 1,
      "chapter_index": 1,
      "volume_name": "第一卷",
      "chapter_title": "第1章 雨夜退婚",
      "word_count": 3800,
      "analysis_status": "not_analyzed",
      "updated_at": "2026-05-10T10:00:00"
    }
  ],
  "total": 30
}
```

---

### 5.4 获取章节详情

```http
GET /chapters/{chapter_id}
```

#### 返回参数

```json
{
  "id": 1,
  "project_id": 1,
  "chapter_index": 1,
  "volume_name": "第一卷",
  "chapter_title": "第1章 雨夜退婚",
  "content": "章节正文...",
  "word_count": 3800,
  "analysis_status": "not_analyzed"
}
```

---

### 5.5 更新章节

```http
PUT /chapters/{chapter_id}
```

#### 请求参数

```json
{
  "volume_name": "第一卷",
  "chapter_title": "第1章 雨夜退婚",
  "content": "修改后的正文"
}
```

---

### 5.6 删除章节

```http
DELETE /chapters/{chapter_id}
```

---

### 5.7 合并章节

```http
POST /chapters/merge
```

#### 请求参数

```json
{
  "chapter_ids": [1, 2],
  "new_title": "第1章 雨夜归来"
}
```

---

### 5.8 拆分章节

```http
POST /chapters/{chapter_id}/split
```

#### 请求参数

```json
{
  "split_position": 1200,
  "new_chapter_title": "第2章 正厅对峙"
}
```

---

## 6. AI 解析接口

---

### 6.1 创建章节解析任务

```http
POST /chapters/{chapter_id}/analyze
```

#### 请求参数

```json
{
  "force": false
}
```

#### 返回参数

```json
{
  "task_id": 1001,
  "status": "waiting"
}
```

---

### 6.2 批量解析章节

```http
POST /chapters/batch-analyze
```

#### 请求参数

```json
{
  "chapter_ids": [1, 2, 3],
  "force": false
}
```

---

### 6.3 获取章节解析结果

```http
GET /chapters/{chapter_id}/analysis
```

#### 返回参数

```json
{
  "chapter_id": 1,
  "summary": "沈青禾在雨夜回到沈家...",
  "characters": ["沈青禾", "沈夫人"],
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

---

### 6.4 保存解析结果到知识库

```http
POST /analysis/{analysis_id}/save-to-knowledge
```

#### 返回参数

```json
{
  "created_characters": 3,
  "created_events": 5,
  "created_scenes": 2
}
```

---

## 7. 知识库接口

---

### 7.1 获取角色列表

```http
GET /projects/{project_id}/characters
```

---

### 7.2 新增角色

```http
POST /projects/{project_id}/characters
```

#### 请求参数

```json
{
  "name": "沈青禾",
  "gender": "女",
  "identity_desc": "沈家庶女",
  "personality": "隐忍、聪慧、外柔内刚",
  "appearance": "黑色长发，浅棕色眼睛",
  "prompt": "古风国漫，清冷少女..."
}
```

---

### 7.3 获取角色详情

```http
GET /characters/{character_id}
```

---

### 7.4 更新角色

```http
PUT /characters/{character_id}
```

---

### 7.5 删除角色

```http
DELETE /characters/{character_id}
```

---

### 7.6 获取事件列表

```http
GET /projects/{project_id}/events
```

---

### 7.7 获取场景列表

```http
GET /projects/{project_id}/scenes
```

---

### 7.8 获取禁改设定

```http
GET /projects/{project_id}/forbidden-rules
```

---

### 7.9 新增禁改设定

```http
POST /projects/{project_id}/forbidden-rules
```

#### 请求参数

```json
{
  "rule_content": "沈青禾不能改成短发",
  "rule_type": "角色设定",
  "related_object_type": "character",
  "related_object_id": 1,
  "severity": "high"
}
```

---

## 8. 单话接口

---

### 8.1 生成单话方案

```http
POST /projects/{project_id}/episodes/generate-plan
```

#### 请求参数

```json
{
  "source_chapter_ids": [1, 2, 3],
  "target_panels": 40,
  "comic_style": "古风国漫",
  "adaptation_level": "medium",
  "rhythm_type": "strong_conflict",
  "keep_original_dialogue": true
}
```

#### 返回参数

```json
{
  "task_id": 2001,
  "status": "waiting"
}
```

---

### 8.2 创建单话

```http
POST /projects/{project_id}/episodes
```

#### 请求参数

```json
{
  "episode_title": "雨夜退婚",
  "source_chapter_ids": [1, 2],
  "target_panels": 40,
  "summary": "本话梗概",
  "main_conflict": "女主反抗家族婚约",
  "hook": "顾长渊看到玉佩",
  "script": []
}
```

---

### 8.3 获取单话列表

```http
GET /projects/{project_id}/episodes
```

---

### 8.4 获取单话详情

```http
GET /episodes/{episode_id}
```

---

### 8.5 更新单话

```http
PUT /episodes/{episode_id}
```

---

### 8.6 删除单话

```http
DELETE /episodes/{episode_id}
```

---

## 9. 分镜接口

---

### 9.1 生成分镜

```http
POST /episodes/{episode_id}/storyboards/generate
```

#### 请求参数

```json
{
  "target_panels": 40,
  "density": "standard",
  "dialogue_style": "comic",
  "generate_sound_effect": true,
  "generate_negative_prompt": true
}
```

#### 返回参数

```json
{
  "task_id": 3001,
  "status": "waiting"
}
```

---

### 9.2 获取分镜列表

```http
GET /episodes/{episode_id}/storyboards
```

#### 返回参数

```json
{
  "items": [
    {
      "id": 1,
      "panel_index": 1,
      "scene": "沈家府门",
      "characters": [{"id": 1, "name": "沈青禾"}],
      "shot_type": "远景",
      "image_description": "雨夜，沈家府门前...",
      "dialogue": "",
      "narration": "她终于回来了。",
      "prompt": "古风国漫，雨夜府门...",
      "status": "ai_draft"
    }
  ]
}
```

---

### 9.3 新增分镜

```http
POST /episodes/{episode_id}/storyboards
```

---

### 9.4 更新分镜

```http
PUT /storyboards/{panel_id}
```

---

### 9.5 删除分镜

```http
DELETE /storyboards/{panel_id}
```

---

### 9.6 分镜排序

```http
POST /episodes/{episode_id}/storyboards/reorder
```

#### 请求参数

```json
{
  "panel_orders": [
    {"panel_id": 3, "panel_index": 1},
    {"panel_id": 1, "panel_index": 2}
  ]
}
```

---

### 9.7 重新生成单格

```http
POST /storyboards/{panel_id}/regenerate
```

---

### 9.8 获取全部 Prompt

```http
GET /episodes/{episode_id}/storyboards/prompts
```

#### 返回参数

```json
{
  "text": "第1格：...\n\n第2格：..."
}
```

---

## 10. 导出接口

---

### 10.1 导出 Excel

```http
POST /episodes/{episode_id}/export/excel
```

---

### 10.2 导出 Word

```http
POST /episodes/{episode_id}/export/word
```

---

### 10.3 导出 HTML

```http
POST /episodes/{episode_id}/export/html
```

---

### 10.4 导出 JSON

```http
POST /episodes/{episode_id}/export/json
```

---

### 10.5 导出 Prompt TXT

```http
POST /episodes/{episode_id}/export/prompts
```

---

### 10.6 下载导出文件

```http
GET /export-files/{file_id}/download
```

---

### 10.7 获取导出历史

```http
GET /projects/{project_id}/exports
```

---

## 11. AI 任务接口

---

### 11.1 获取项目 AI 任务列表

```http
GET /projects/{project_id}/ai-tasks
```

---

### 11.2 获取 AI 任务详情

```http
GET /ai-tasks/{task_id}
```

#### 返回参数

```json
{
  "id": 1,
  "task_type": "chapter_analysis",
  "related_type": "chapter",
  "related_id": 1,
  "status": "success",
  "input_payload": {},
  "output_payload": {},
  "error_message": null,
  "retry_count": 0,
  "created_at": "2026-05-10T10:00:00",
  "started_at": "2026-05-10T10:00:05",
  "finished_at": "2026-05-10T10:01:20"
}
```

---

### 11.3 重试 AI 任务

```http
POST /ai-tasks/{task_id}/retry
```

---

### 11.4 取消 AI 任务

```http
POST /ai-tasks/{task_id}/cancel
```

---

## 12. 前端联调建议

```text
1. 所有列表接口支持分页。
2. 所有异步任务接口返回 task_id。
3. 前端通过轮询 /ai-tasks/{task_id} 获取任务状态。
4. AI 任务成功后再请求对应业务详情接口。
5. 文件下载接口返回流或临时下载 URL。
6. 所有接口错误使用统一响应格式。
```

---

## 13. MVP API 验收标准

```text
Swagger / OpenAPI 文档可访问。
所有 P0 接口可联调。
所有需要鉴权的接口必须校验 Token。
用户不能访问他人项目。
文件上传、AI 任务、导出任务均可查询状态。
主流程接口可完整串联。
```
