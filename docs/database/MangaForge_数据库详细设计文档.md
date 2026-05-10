# MangaForge 数据库详细设计文档

版本：V0.5 MVP  
项目名称：MangaForge  
数据库：PostgreSQL 16+  
ORM：SQLAlchemy 2.x  
迁移工具：Alembic  
文档类型：Database Design Document  
外键策略：逻辑外键，不使用数据库物理外键  

---

## 1. 文档目标

本文档用于定义 MangaForge MVP 阶段的数据库结构、表关系、字段说明、索引设计、状态枚举、数据约束、逻辑外键策略、删除策略、孤儿数据巡检方案和后续扩展方向。

MVP 核心数据链路：

```text
用户
→ 项目
→ 小说文件
→ 章节
→ 章节解析
→ 知识库
→ 单话
→ 分镜
→ AI 任务
→ 导出文件
```

---

## 2. 数据库设计原则

```text
1. 业务数据结构化存储。
2. AI 输出原始结果保留，便于追溯和调试。
3. 长文本字段独立存储，避免影响列表查询性能。
4. 半结构化字段使用 JSONB。
5. 所有核心表保留 created_at / updated_at。
6. 所有用户资源必须关联 user_id 或 project_id，便于权限校验。
7. MVP 先保证业务闭环，后续可扩展向量检索。
8. MangaForge 采用逻辑外键设计，不使用数据库物理外键。
9. 所有关联字段必须建立索引。
10. 所有资源关系由 Service 层校验。
11. 删除动作必须通过统一业务服务执行。
12. 定期执行孤儿数据巡检脚本。
```

---

## 3. 外键设计策略

### 3.1 总体策略

MangaForge MVP 阶段采用：

> **逻辑外键设计，不使用数据库物理外键。**

也就是说，数据库表中会保留关联字段，例如：

```text
user_id
project_id
chapter_id
episode_id
character_id
file_id
```

但不会在建表 SQL 中使用：

```sql
REFERENCES xxx(id)
ON DELETE CASCADE
```

---

### 3.2 为什么不使用物理外键

MangaForge 包含大量异步 AI 任务和批量生成操作，例如：

```text
章节解析
批量章节解析
角色库构建
单话改编
分镜生成
导出文件
```

这些任务具有以下特点：

```text
执行时间长
任务可能失败
任务可能重试
用户可能在任务执行中删除资源
后续可能拆分 Worker、Agent、Export 服务
```

如果大量使用数据库物理外键，会带来：

```text
异步任务写入时容易被约束阻塞
删除链路复杂
级联删除风险高
数据库迁移不灵活
后期服务拆分成本更高
```

因此 MVP 阶段采用逻辑外键，由业务层保证数据关系。

---

### 3.3 逻辑外键设计要求

所有逻辑外键字段必须满足：

```text
1. 字段必须保留。
2. 字段类型统一使用 BIGINT。
3. 高频查询字段必须建立索引。
4. 写入前必须由 Service 层检查关联资源是否存在。
5. 查询时必须校验资源归属和用户权限。
6. 删除时必须走统一删除服务，不允许直接删除主表。
7. 定期通过巡检 SQL 检查孤儿数据。
```

示例：

```sql
project_id BIGINT NOT NULL
episode_id BIGINT NOT NULL
chapter_id BIGINT NOT NULL
```

不写：

```sql
project_id BIGINT NOT NULL REFERENCES novel_project(id)
```

---

### 3.4 Service 层校验要求

创建、更新、删除资源时，Service 层必须校验逻辑外键关系。

例如创建分镜前：

```python
episode = await episode_repo.get_by_id(episode_id)

if not episode:
    raise NotFoundError("单话不存在")

if episode.project_id != project_id:
    raise PermissionDenied("无权操作该单话")
```

创建章节解析前：

```python
chapter = await chapter_repo.get_by_id(chapter_id)

if not chapter:
    raise NotFoundError("章节不存在")

project = await project_repo.get_by_id(chapter.project_id)

if project.user_id != current_user.id:
    raise PermissionDenied("无权操作该章节")
```

---

### 3.5 删除服务要求

删除动作必须通过统一业务服务执行，不允许在业务代码中随意直接删除主表。

建议提供：

```text
ProjectDeleteService
ChapterDeleteService
EpisodeDeleteService
ExportFileDeleteService
```

删除项目时，统一流程：

```text
校验项目归属
↓
标记项目删除或执行删除
↓
删除 / 清理 novel_file
↓
删除 / 清理 novel_chapter
↓
删除 / 清理 chapter_analysis
↓
删除 / 清理 character_profile
↓
删除 / 清理 story_event
↓
删除 / 清理 story_scene
↓
删除 / 清理 forbidden_rule
↓
删除 / 清理 comic_episode
↓
删除 / 清理 storyboard_panel
↓
删除 / 清理 export_file
↓
保留或归档 ai_task
↓
异步清理 MinIO 文件
↓
记录操作日志
```

删除单话时，统一流程：

```text
校验单话归属
↓
删除 storyboard_panel
↓
删除 export_file
↓
取消或标记相关 ai_task
↓
删除 comic_episode
↓
异步清理导出文件
```

删除章节时，统一流程：

```text
校验章节归属
↓
删除 chapter_analysis
↓
更新相关 story_event / story_scene
↓
取消或标记相关 ai_task
↓
删除 novel_chapter
```

---

### 3.6 孤儿数据巡检要求

由于不使用物理外键，必须定期执行孤儿数据巡检。

建议巡检频率：

```text
开发环境：手动执行
测试环境：每周执行
生产环境：每日或每周定时执行
```

巡检目标：

```text
孤儿章节
孤儿章节解析
孤儿角色
孤儿事件
孤儿场景
孤儿单话
孤儿分镜
孤儿导出文件
孤儿 AI 任务
```

巡检 SQL 示例见本文第 13 节。

---

## 4. 表关系总览

以下为逻辑关系，不代表数据库物理外键约束。

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

说明：

```text
以上关系由 Service 层维护，不依赖数据库 REFERENCES 约束。
```

---

## 5. 命名规范

| 类型 | 规范 | 示例 |
|---|---|---|
| 表名 | 小写蛇形命名 | novel_project |
| 字段名 | 小写蛇形命名 | project_name |
| 主键 | id | id |
| 逻辑外键 | 关联表名_id | project_id |
| 状态字段 | status / xxx_status | analysis_status |
| 时间字段 | created_at / updated_at | created_at |
| JSON 字段 | JSONB | characters |

---

## 6. 状态枚举

### 6.1 项目状态 project_status

```text
pending_upload      待上传
uploaded            已上传
chapters_parsed     章节已识别
analyzing           解析中
analyzed            已解析
adapting            改编中
storyboarding       分镜中
exported            已导出
archived            已归档
deleted             已删除
```

### 6.2 章节解析状态 analysis_status

```text
not_analyzed        未解析
analyzing           解析中
analyzed            已解析
failed              解析失败
modified            已修改
locked              已锁定
deleted             已删除
```

### 6.3 AI 任务状态 ai_task_status

```text
waiting             等待中
running             执行中
success             成功
failed              失败
cancelled           已取消
retried             已重试
related_deleted     关联资源已删除
```

### 6.4 单话状态 episode_status

```text
draft               草稿
plan_generated      大纲已生成
script_generated    剧本已生成
storyboard_generated 分镜已生成
edited              已编辑
exported            已导出
deleted             已删除
```

### 6.5 分镜状态 storyboard_status

```text
ai_draft            AI 初稿
edited              已编辑
review_pending      待审核
need_revision       需修改
confirmed           已确认
exported            已导出
deleted             已删除
```

### 6.6 导出状态 export_status

```text
waiting             等待中
running             生成中
success             成功
failed              失败
deleted             已删除
```

---

## 7. 数据表详细设计

---

## 7.1 app_user 用户表

### 用途

存储用户登录信息和基础权限信息。

### 建表 SQL

```sql
CREATE TABLE app_user (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'user',
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| id | BIGSERIAL | 是 | 用户 ID |
| username | VARCHAR(100) | 是 | 用户名 |
| email | VARCHAR(100) | 否 | 邮箱 |
| phone | VARCHAR(30) | 否 | 手机号 |
| password_hash | VARCHAR(255) | 是 | 密码哈希 |
| role | VARCHAR(30) | 是 | user / admin |
| status | VARCHAR(30) | 是 | active / disabled |
| created_at | TIMESTAMP | 是 | 创建时间 |
| updated_at | TIMESTAMP | 是 | 更新时间 |

### 索引

```sql
CREATE UNIQUE INDEX idx_app_user_email ON app_user(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_app_user_phone ON app_user(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_app_user_status ON app_user(status);
```

---

## 7.2 novel_project 项目表

### 用途

存储 MangaForge 小说漫改项目。

### 建表 SQL

```sql
CREATE TABLE novel_project (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  project_name VARCHAR(100) NOT NULL,
  novel_name VARCHAR(100) NOT NULL,
  author VARCHAR(100),
  genre VARCHAR(50),
  comic_style VARCHAR(50),
  target_reader VARCHAR(255),
  adaptation_goal TEXT,
  word_count INT NOT NULL DEFAULT 0,
  chapter_count INT NOT NULL DEFAULT 0,
  analyzed_chapter_count INT NOT NULL DEFAULT 0,
  episode_count INT NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'pending_upload',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 字段说明

| 字段 | 说明 |
|---|---|
| user_id | 项目所属用户 ID，逻辑关联 app_user.id |
| project_name | 项目名称 |
| novel_name | 原著小说名称 |
| author | 原著作者 |
| genre | 小说类型 |
| comic_style | 目标漫画风格 |
| target_reader | 目标读者 |
| adaptation_goal | 改编目标 |
| word_count | 小说总字数 |
| chapter_count | 章节数量 |
| analyzed_chapter_count | 已解析章节数 |
| episode_count | 已生成单话数 |
| status | 项目状态 |
| deleted_at | 软删除时间 |

### 索引

```sql
CREATE INDEX idx_novel_project_user_id ON novel_project(user_id);
CREATE INDEX idx_novel_project_status ON novel_project(status);
CREATE INDEX idx_novel_project_updated_at ON novel_project(updated_at DESC);
CREATE INDEX idx_novel_project_deleted_at ON novel_project(deleted_at);
```

---

## 7.3 novel_file 小说文件表

### 用途

存储用户上传的小说原始文件信息。

```sql
CREATE TABLE novel_file (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  encoding VARCHAR(50),
  word_count INT NOT NULL DEFAULT 0,
  upload_status VARCHAR(30) NOT NULL DEFAULT 'success',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
novel_file.project_id → novel_project.id
```

### 索引

```sql
CREATE INDEX idx_novel_file_project_id ON novel_file(project_id);
CREATE INDEX idx_novel_file_deleted_at ON novel_file(deleted_at);
```

---

## 7.4 novel_chapter 章节表

### 用途

存储拆章后的章节正文。

```sql
CREATE TABLE novel_chapter (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  volume_name VARCHAR(100),
  chapter_title VARCHAR(200) NOT NULL,
  chapter_index INT NOT NULL,
  content TEXT NOT NULL,
  word_count INT NOT NULL DEFAULT 0,
  parse_status VARCHAR(30) NOT NULL DEFAULT 'normal',
  analysis_status VARCHAR(30) NOT NULL DEFAULT 'not_analyzed',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
novel_chapter.project_id → novel_project.id
```

### 索引

```sql
CREATE INDEX idx_novel_chapter_project_id ON novel_chapter(project_id);
CREATE INDEX idx_novel_chapter_project_index ON novel_chapter(project_id, chapter_index);
CREATE INDEX idx_novel_chapter_analysis_status ON novel_chapter(analysis_status);
CREATE INDEX idx_novel_chapter_deleted_at ON novel_chapter(deleted_at);
```

### 约束

```sql
ALTER TABLE novel_chapter
ADD CONSTRAINT uq_project_chapter_index UNIQUE(project_id, chapter_index);
```

---

## 7.5 chapter_analysis 章节解析表

### 用途

存储 AI 对章节的结构化解析结果。

```sql
CREATE TABLE chapter_analysis (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  chapter_id BIGINT NOT NULL,
  summary TEXT,
  characters JSONB,
  new_characters JSONB,
  events JSONB,
  scenes JSONB,
  props JSONB,
  conflicts JSONB,
  emotions JSONB,
  foreshadowing JSONB,
  visual_moments JSONB,
  adaptation_notes TEXT,
  raw_result JSONB,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
chapter_analysis.project_id → novel_project.id
chapter_analysis.chapter_id → novel_chapter.id
```

### 索引

```sql
CREATE UNIQUE INDEX idx_chapter_analysis_chapter_id ON chapter_analysis(chapter_id);
CREATE INDEX idx_chapter_analysis_project_id ON chapter_analysis(project_id);
CREATE INDEX idx_chapter_analysis_raw_result_gin ON chapter_analysis USING GIN(raw_result);
CREATE INDEX idx_chapter_analysis_deleted_at ON chapter_analysis(deleted_at);
```

---

## 7.6 character_profile 角色表

### 用途

存储角色档案、绘图 Prompt、禁改项等。

```sql
CREATE TABLE character_profile (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  alias JSONB,
  gender VARCHAR(30),
  age VARCHAR(50),
  identity_desc VARCHAR(255),
  faction VARCHAR(100),
  personality TEXT,
  appearance TEXT,
  costume TEXT,
  catchphrase TEXT,
  goal_desc TEXT,
  character_arc TEXT,
  relationships JSONB,
  important_events JSONB,
  prompt TEXT,
  negative_prompt TEXT,
  forbidden_changes JSONB,
  reference_images JSONB,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
character_profile.project_id → novel_project.id
```

### 索引

```sql
CREATE INDEX idx_character_profile_project_id ON character_profile(project_id);
CREATE INDEX idx_character_profile_name ON character_profile(project_id, name);
CREATE INDEX idx_character_profile_alias_gin ON character_profile USING GIN(alias);
CREATE INDEX idx_character_profile_deleted_at ON character_profile(deleted_at);
```

---

## 7.7 story_event 事件表

```sql
CREATE TABLE story_event (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  event_name VARCHAR(200) NOT NULL,
  event_summary TEXT,
  chapter_ids JSONB,
  character_ids JSONB,
  scene_ids JSONB,
  impact TEXT,
  is_main_event BOOLEAN NOT NULL DEFAULT FALSE,
  adapted_status VARCHAR(30) NOT NULL DEFAULT 'not_adapted',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
story_event.project_id → novel_project.id
story_event.chapter_ids → novel_chapter.id 数组
story_event.character_ids → character_profile.id 数组
story_event.scene_ids → story_scene.id 数组
```

### 索引

```sql
CREATE INDEX idx_story_event_project_id ON story_event(project_id);
CREATE INDEX idx_story_event_main ON story_event(project_id, is_main_event);
CREATE INDEX idx_story_event_deleted_at ON story_event(deleted_at);
```

---

## 7.8 story_scene 场景表

```sql
CREATE TABLE story_scene (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  scene_name VARCHAR(200) NOT NULL,
  scene_type VARCHAR(50),
  first_chapter_id BIGINT,
  description TEXT,
  visual_features TEXT,
  related_characters JSONB,
  prompt TEXT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
story_scene.project_id → novel_project.id
story_scene.first_chapter_id → novel_chapter.id
story_scene.related_characters → character_profile.id 数组
```

### 索引

```sql
CREATE INDEX idx_story_scene_project_id ON story_scene(project_id);
CREATE INDEX idx_story_scene_name ON story_scene(project_id, scene_name);
CREATE INDEX idx_story_scene_first_chapter_id ON story_scene(first_chapter_id);
CREATE INDEX idx_story_scene_deleted_at ON story_scene(deleted_at);
```

---

## 7.9 forbidden_rule 禁改设定表

```sql
CREATE TABLE forbidden_rule (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  rule_content TEXT NOT NULL,
  rule_type VARCHAR(50),
  related_object_type VARCHAR(50),
  related_object_id BIGINT,
  severity VARCHAR(30) NOT NULL DEFAULT 'medium',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
forbidden_rule.project_id → novel_project.id
forbidden_rule.related_object_id → 根据 related_object_type 逻辑关联角色 / 章节 / 单话 / 场景等
```

### 索引

```sql
CREATE INDEX idx_forbidden_rule_project_id ON forbidden_rule(project_id);
CREATE INDEX idx_forbidden_rule_type ON forbidden_rule(rule_type);
CREATE INDEX idx_forbidden_rule_related ON forbidden_rule(related_object_type, related_object_id);
CREATE INDEX idx_forbidden_rule_severity ON forbidden_rule(severity);
CREATE INDEX idx_forbidden_rule_deleted_at ON forbidden_rule(deleted_at);
```

---

## 7.10 comic_episode 单话表

```sql
CREATE TABLE comic_episode (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  season_index INT NOT NULL DEFAULT 1,
  episode_index INT NOT NULL,
  episode_title VARCHAR(200),
  source_chapter_ids JSONB,
  target_panels INT NOT NULL DEFAULT 40,
  summary TEXT,
  main_conflict TEXT,
  characters JSONB,
  scenes JSONB,
  emotion_curve TEXT,
  rhythm TEXT,
  hook TEXT,
  adaptation_notes TEXT,
  script JSONB,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
comic_episode.project_id → novel_project.id
comic_episode.source_chapter_ids → novel_chapter.id 数组
comic_episode.characters → character_profile.id 数组或角色快照
comic_episode.scenes → story_scene.id 数组或场景快照
```

### 索引

```sql
CREATE INDEX idx_comic_episode_project_id ON comic_episode(project_id);
CREATE INDEX idx_comic_episode_project_episode ON comic_episode(project_id, episode_index);
CREATE INDEX idx_comic_episode_status ON comic_episode(status);
CREATE INDEX idx_comic_episode_deleted_at ON comic_episode(deleted_at);
```

### 约束

```sql
ALTER TABLE comic_episode
ADD CONSTRAINT uq_project_episode_index UNIQUE(project_id, season_index, episode_index);
```

---

## 7.11 storyboard_panel 分镜表

```sql
CREATE TABLE storyboard_panel (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  episode_id BIGINT NOT NULL,
  panel_index INT NOT NULL,
  scene VARCHAR(200),
  characters JSONB,
  camera VARCHAR(100),
  shot_type VARCHAR(50),
  image_description TEXT,
  action_desc TEXT,
  expression_desc TEXT,
  dialogue TEXT,
  narration TEXT,
  sound_effect VARCHAR(100),
  prompt TEXT,
  negative_prompt TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'ai_draft',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
storyboard_panel.project_id → novel_project.id
storyboard_panel.episode_id → comic_episode.id
storyboard_panel.characters → character_profile.id 数组或角色快照
```

### 索引

```sql
CREATE INDEX idx_storyboard_panel_project_id ON storyboard_panel(project_id);
CREATE INDEX idx_storyboard_panel_episode_id ON storyboard_panel(episode_id);
CREATE INDEX idx_storyboard_panel_episode_index ON storyboard_panel(episode_id, panel_index);
CREATE INDEX idx_storyboard_panel_status ON storyboard_panel(status);
CREATE INDEX idx_storyboard_panel_deleted_at ON storyboard_panel(deleted_at);
```

### 约束

```sql
ALTER TABLE storyboard_panel
ADD CONSTRAINT uq_episode_panel_index UNIQUE(episode_id, panel_index);
```

---

## 7.12 ai_task AI 任务表

```sql
CREATE TABLE ai_task (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT,
  task_type VARCHAR(50) NOT NULL,
  related_type VARCHAR(50),
  related_id BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'waiting',
  input_payload JSONB,
  output_payload JSONB,
  error_message TEXT,
  retry_count INT NOT NULL DEFAULT 0,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
ai_task.project_id → novel_project.id
ai_task.related_id → 根据 related_type 逻辑关联 chapter / episode / panel / export 等
```

### 索引

```sql
CREATE INDEX idx_ai_task_project_id ON ai_task(project_id);
CREATE INDEX idx_ai_task_type ON ai_task(task_type);
CREATE INDEX idx_ai_task_status ON ai_task(status);
CREATE INDEX idx_ai_task_related ON ai_task(related_type, related_id);
CREATE INDEX idx_ai_task_created_at ON ai_task(created_at DESC);
```

---

## 7.13 export_file 导出文件表

```sql
CREATE TABLE export_file (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  episode_id BIGINT,
  export_type VARCHAR(30) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'success',
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 逻辑关联

```text
export_file.project_id → novel_project.id
export_file.episode_id → comic_episode.id
```

### 索引

```sql
CREATE INDEX idx_export_file_project_id ON export_file(project_id);
CREATE INDEX idx_export_file_episode_id ON export_file(episode_id);
CREATE INDEX idx_export_file_type ON export_file(export_type);
CREATE INDEX idx_export_file_created_at ON export_file(created_at DESC);
CREATE INDEX idx_export_file_deleted_at ON export_file(deleted_at);
```

---

## 8. JSONB 字段结构建议

### 8.1 chapter_analysis.characters

```json
[
  {
    "name": "沈青禾",
    "role": "女主",
    "description": "沈家庶女，隐忍聪慧"
  }
]
```

### 8.2 comic_episode.script

```json
[
  {
    "scene_name": "沈家正厅",
    "purpose": "建立女主与沈夫人的正面冲突",
    "characters": ["沈青禾", "沈夫人"],
    "dialogue": "沈青禾：这门婚事，我不认。",
    "narration": "这一刻，她终于不再低头。",
    "transition": "玉佩特写转场"
  }
]
```

### 8.3 storyboard_panel.characters

```json
[
  {
    "id": 1,
    "name": "沈青禾"
  }
]
```

---

## 9. 更新时间处理

建议在应用层统一更新 `updated_at`，或使用 PostgreSQL Trigger。

示例：

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## 10. 删除策略

### 10.1 MVP 推荐策略

MVP 推荐使用软删除 + 异步清理。

核心业务表增加：

```sql
deleted_at TIMESTAMP
```

删除时不直接物理删除数据，而是：

```text
设置 deleted_at
设置 status = deleted
隐藏前端展示
异步清理关联文件
定期物理归档或清理
```

---

### 10.2 项目删除策略

删除项目必须通过 `ProjectDeleteService`。

流程：

```text
校验项目归属
↓
将 novel_project 标记 deleted
↓
将 novel_file 标记 deleted
↓
将 novel_chapter 标记 deleted
↓
将 chapter_analysis 标记 deleted
↓
将 character_profile 标记 deleted
↓
将 story_event 标记 deleted
↓
将 story_scene 标记 deleted
↓
将 forbidden_rule 标记 deleted
↓
将 comic_episode 标记 deleted
↓
将 storyboard_panel 标记 deleted
↓
将 export_file 标记 deleted
↓
将 running / waiting 的 ai_task 标记 related_deleted 或 cancelled
↓
异步清理 MinIO 文件
```

---

### 10.3 AI 任务处理策略

AI 任务建议不物理删除。

当关联资源被删除：

```text
waiting / running → cancelled 或 related_deleted
success / failed → 保留，用于日志追溯
```

---

## 11. Service 层校验规范

### 11.1 查询项目资源

所有项目内资源查询必须校验用户权限。

示例：

```python
project = await project_repo.get_by_id(project_id)

if not project or project.deleted_at:
    raise NotFoundError("项目不存在")

if project.user_id != current_user.id and current_user.role != "admin":
    raise PermissionDenied("无权访问该项目")
```

---

### 11.2 创建章节解析

```python
chapter = await chapter_repo.get_by_id(chapter_id)

if not chapter or chapter.deleted_at:
    raise NotFoundError("章节不存在")

await project_service.check_project_permission(
    project_id=chapter.project_id,
    user=current_user
)
```

---

### 11.3 创建分镜

```python
episode = await episode_repo.get_by_id(episode_id)

if not episode or episode.deleted_at:
    raise NotFoundError("单话不存在")

await project_service.check_project_permission(
    project_id=episode.project_id,
    user=current_user
)
```

---

## 12. 索引设计总览

所有逻辑外键字段必须建立索引。

```sql
CREATE INDEX idx_novel_project_user_id ON novel_project(user_id);

CREATE INDEX idx_novel_file_project_id ON novel_file(project_id);

CREATE INDEX idx_novel_chapter_project_id ON novel_chapter(project_id);
CREATE INDEX idx_novel_chapter_project_index ON novel_chapter(project_id, chapter_index);

CREATE INDEX idx_chapter_analysis_project_id ON chapter_analysis(project_id);
CREATE UNIQUE INDEX idx_chapter_analysis_chapter_id ON chapter_analysis(chapter_id);

CREATE INDEX idx_character_profile_project_id ON character_profile(project_id);
CREATE INDEX idx_character_profile_name ON character_profile(project_id, name);

CREATE INDEX idx_story_event_project_id ON story_event(project_id);

CREATE INDEX idx_story_scene_project_id ON story_scene(project_id);
CREATE INDEX idx_story_scene_first_chapter_id ON story_scene(first_chapter_id);

CREATE INDEX idx_forbidden_rule_project_id ON forbidden_rule(project_id);
CREATE INDEX idx_forbidden_rule_related ON forbidden_rule(related_object_type, related_object_id);

CREATE INDEX idx_comic_episode_project_id ON comic_episode(project_id);
CREATE INDEX idx_comic_episode_project_episode ON comic_episode(project_id, episode_index);

CREATE INDEX idx_storyboard_panel_project_id ON storyboard_panel(project_id);
CREATE INDEX idx_storyboard_panel_episode_id ON storyboard_panel(episode_id);
CREATE INDEX idx_storyboard_panel_episode_index ON storyboard_panel(episode_id, panel_index);

CREATE INDEX idx_ai_task_project_id ON ai_task(project_id);
CREATE INDEX idx_ai_task_related ON ai_task(related_type, related_id);

CREATE INDEX idx_export_file_project_id ON export_file(project_id);
CREATE INDEX idx_export_file_episode_id ON export_file(episode_id);
```

---

## 13. 孤儿数据巡检脚本

### 13.1 孤儿项目

检查项目是否关联不存在的用户：

```sql
SELECT np.*
FROM novel_project np
LEFT JOIN app_user u ON np.user_id = u.id
WHERE u.id IS NULL;
```

---

### 13.2 孤儿小说文件

```sql
SELECT nf.*
FROM novel_file nf
LEFT JOIN novel_project np ON nf.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.3 孤儿章节

```sql
SELECT nc.*
FROM novel_chapter nc
LEFT JOIN novel_project np ON nc.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.4 孤儿章节解析

```sql
SELECT ca.*
FROM chapter_analysis ca
LEFT JOIN novel_chapter nc ON ca.chapter_id = nc.id
WHERE nc.id IS NULL;
```

也可以检查 project_id 不一致：

```sql
SELECT ca.*
FROM chapter_analysis ca
JOIN novel_chapter nc ON ca.chapter_id = nc.id
WHERE ca.project_id <> nc.project_id;
```

---

### 13.5 孤儿角色

```sql
SELECT cp.*
FROM character_profile cp
LEFT JOIN novel_project np ON cp.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.6 孤儿事件

```sql
SELECT se.*
FROM story_event se
LEFT JOIN novel_project np ON se.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.7 孤儿场景

```sql
SELECT ss.*
FROM story_scene ss
LEFT JOIN novel_project np ON ss.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.8 孤儿禁改设定

```sql
SELECT fr.*
FROM forbidden_rule fr
LEFT JOIN novel_project np ON fr.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.9 孤儿单话

```sql
SELECT ce.*
FROM comic_episode ce
LEFT JOIN novel_project np ON ce.project_id = np.id
WHERE np.id IS NULL;
```

---

### 13.10 孤儿分镜

```sql
SELECT sp.*
FROM storyboard_panel sp
LEFT JOIN comic_episode ce ON sp.episode_id = ce.id
WHERE ce.id IS NULL;
```

检查 project_id 不一致：

```sql
SELECT sp.*
FROM storyboard_panel sp
JOIN comic_episode ce ON sp.episode_id = ce.id
WHERE sp.project_id <> ce.project_id;
```

---

### 13.11 孤儿导出文件

```sql
SELECT ef.*
FROM export_file ef
LEFT JOIN novel_project np ON ef.project_id = np.id
WHERE np.id IS NULL;
```

检查 episode_id 不存在：

```sql
SELECT ef.*
FROM export_file ef
LEFT JOIN comic_episode ce ON ef.episode_id = ce.id
WHERE ef.episode_id IS NOT NULL
  AND ce.id IS NULL;
```

---

### 13.12 孤儿 AI 任务

检查关联章节不存在：

```sql
SELECT t.*
FROM ai_task t
LEFT JOIN novel_chapter nc ON t.related_id = nc.id
WHERE t.related_type = 'chapter'
  AND nc.id IS NULL;
```

检查关联单话不存在：

```sql
SELECT t.*
FROM ai_task t
LEFT JOIN comic_episode ce ON t.related_id = ce.id
WHERE t.related_type = 'episode'
  AND ce.id IS NULL;
```

检查关联分镜不存在：

```sql
SELECT t.*
FROM ai_task t
LEFT JOIN storyboard_panel sp ON t.related_id = sp.id
WHERE t.related_type = 'panel'
  AND sp.id IS NULL;
```

---

## 14. 孤儿数据修复建议

### 14.1 修复原则

```text
1. 不自动物理删除生产数据。
2. 先导出巡检结果。
3. 标记异常数据。
4. 由管理员确认后清理。
5. 清理动作记录日志。
```

---

### 14.2 AI 任务修复

如果 AI 任务关联资源已删除：

```sql
UPDATE ai_task
SET status = 'related_deleted',
    error_message = '关联资源已删除',
    updated_at = CURRENT_TIMESTAMP
WHERE related_type = 'chapter'
  AND related_id IN (
    SELECT t.related_id
    FROM ai_task t
    LEFT JOIN novel_chapter nc ON t.related_id = nc.id
    WHERE t.related_type = 'chapter'
      AND nc.id IS NULL
  );
```

---

### 14.3 分镜修复

孤儿分镜建议先导出，再软删除：

```sql
UPDATE storyboard_panel
SET deleted_at = CURRENT_TIMESTAMP,
    status = 'deleted',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT sp.id
  FROM storyboard_panel sp
  LEFT JOIN comic_episode ce ON sp.episode_id = ce.id
  WHERE ce.id IS NULL
);
```

---

## 15. 后续扩展

### 15.1 向量检索扩展

V1 可增加：

```text
pgvector
chapter_embedding
character_embedding
scene_embedding
```

新增字段示例：

```sql
ALTER TABLE novel_chapter ADD COLUMN embedding vector(1536);
```

### 15.2 团队协作扩展

后续可增加：

```text
team
team_member
project_member
comment
review_record
operation_log
```

### 15.3 图片生成扩展

后续可增加：

```text
generated_image
panel_image
character_reference_image
style_preset
```

---

## 16. MVP 数据库验收标准

```text
所有 P0 表可通过 Alembic 创建。
建表 SQL 不包含 REFERENCES 物理外键。
所有逻辑外键字段存在。
所有逻辑外键字段均建立索引。
项目、章节、单话、分镜主链路数据可正常写入。
JSONB 字段可正常存储 AI 输出。
Service 层已实现资源归属校验。
删除动作已通过统一 DeleteService 执行。
孤儿数据巡检 SQL 可执行。
AI 任务状态可追踪。
导出文件记录可查询和下载。
```
