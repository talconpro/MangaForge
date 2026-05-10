# MangaForge 详细需求规格说明书

版本：V0.5 MVP  
项目名称：MangaForge  
中文定位：AI 长篇小说漫画改编工作台  
英文定位：AI-powered long-form novel to comic adaptation workbench  
文档类型：产品需求规格说明书 / Software Requirement Specification  
适用阶段：MVP 开发阶段  

---

## 1. 项目概述

### 1.1 项目背景

长篇小说改编为条漫、漫画或动态漫前期需要大量人工工作，包括阅读原著、梳理人物、拆分剧情、设计分话、改写剧本、生成分镜、整理画面提示词和管理制作流程。

对于百万字级小说，这些工作成本很高，且容易出现以下问题：

- 小说内容过长，人工理解成本高。
- 角色关系、世界观、伏笔容易遗漏。
- 小说语言不能直接转化为漫画画面语言。
- 长篇连载需要分季、分卷、分话规划。
- 角色形象和设定容易前后不一致。
- 漫画制作团队协作流程复杂，缺少结构化工具支持。

MangaForge 旨在通过 AI + 工作台的方式，帮助用户把长篇小说改编成可连载的漫画剧本、条漫分镜、角色设定和绘图提示词。

### 1.2 产品定位

MangaForge 是一款面向网文作者、IP 版权方、漫画工作室和内容团队的 AI 漫改生产工作台。

一句话定位：

> 用 AI 把长篇小说锻造成可连载漫画。

核心能力：

```text
小说导入
→ 自动拆章
→ AI 章节解析
→ 小说知识库构建
→ 单话改编
→ 条漫分镜生成
→ 绘图 Prompt 生成
→ 人工编辑
→ 导出制作资料
```

### 1.3 MVP 核心目标

MVP 阶段只验证一个核心能力：

> 用户上传 TXT 小说后，选择 1～3 个章节，系统可以生成一话可编辑、可导出的条漫分镜。

MVP 主流程：

```text
用户登录
↓
创建小说项目
↓
上传 TXT 小说
↓
系统自动拆分章节
↓
用户选择章节进行 AI 解析
↓
系统生成章节摘要、人物、事件、场景
↓
用户选择 1～3 章生成一话漫画
↓
系统生成本话大纲
↓
系统生成漫画剧本
↓
系统生成 30～60 格分镜
↓
用户编辑分镜
↓
导出 Excel / Word / HTML / JSON / Prompt TXT
```

---

## 2. 产品范围

### 2.1 MVP 包含功能

| 模块 | 功能 | 优先级 |
|---|---|---|
| 用户模块 | 登录、退出、当前用户信息 | P0 |
| 项目模块 | 创建项目、项目列表、项目详情、删除项目 | P0 |
| 小说导入 | TXT 上传、自动拆章、章节列表 | P0 |
| 章节管理 | 查看章节、编辑章节、删除章节、合并章节 | P0 |
| AI 章节解析 | 摘要、人物、事件、场景、伏笔提取 | P0 |
| 知识库 | 角色库、事件库、场景库、禁改设定 | P0 / P1 |
| 单话改编 | 选择章节、生成本话大纲、漫画剧本 | P0 |
| 分镜生成 | 生成 30～60 格漫画分镜 | P0 |
| 分镜编辑器 | 编辑、新增、删除、排序、复制 Prompt | P0 |
| 预览 | HTML 漫画结构预览 | P1 |
| 导出 | Excel、Word、HTML、JSON、Prompt TXT | P0 |
| AI 任务 | 创建任务、任务状态、失败重试 | P0 |
| HermesAgent 接入 | 章节解析、单话改编、分镜生成 | P0 |

### 2.2 MVP 不包含功能

| 功能 | 是否包含 | 原因 |
|---|---:|---|
| 图片生成 | 否 | MVP 先生成 Prompt，不直接出图 |
| 支付系统 | 否 | 当前阶段不做商业化闭环 |
| 多人实时协作 | 否 | 成本高，后期团队版再做 |
| 复杂权限 | 否 | MVP 阶段单用户即可 |
| LoRA 训练 | 否 | 后期作为角色一致性高级能力 |
| EPUB / Word 导入 | 否 | MVP 先支持 TXT |
| 自动发布平台 | 否 | 商业化阶段再做 |
| 版权交易 | 否 | 非当前阶段目标 |
| 评论协作 | 否 | 后续团队版再做 |

---

## 3. 用户角色

### 3.1 普通用户

普通用户可以完成 MangaForge 的核心创作流程。

权限：

```text
创建项目
上传小说
管理章节
使用 AI 生成功能
编辑分镜
导出文件
删除自己的项目
```

### 3.2 管理员

MVP 阶段可以不做完整管理员后台，但建议数据库和权限字段预留管理员身份。

权限：

```text
查看全部项目
查看 AI 任务状态
查看失败日志
管理用户
查看系统配置
```

---

## 4. 页面结构

MVP 页面建议如下：

```text
登录页
项目工作台
创建项目页
项目详情页
小说导入页
章节管理页
章节解析页
小说知识库页
单话改编页
单话剧本页
分镜编辑器页
导出页
AI 任务记录页
```

---

## 5. 页面详细需求

## 5.1 登录页

### 页面目标

用户进入系统前完成身份验证。

### 页面路径

```text
/login
```

### 页面元素

| 元素 | 类型 | 说明 |
|---|---|---|
| 手机号 / 邮箱 | 输入框 | MVP 可二选一 |
| 密码 | 输入框 | 密码输入 |
| 登录按钮 | 按钮 | 提交登录 |
| 注册入口 | 链接 | MVP 可选 |
| 忘记密码 | 链接 | MVP 可不做 |

### 交互逻辑

登录成功：

```text
跳转到项目工作台
```

登录失败：

```text
提示：账号或密码错误
```

### 表单校验

| 字段 | 校验 |
|---|---|
| 账号 | 必填 |
| 密码 | 必填，最少 6 位 |

---

## 5.2 项目工作台

### 页面目标

展示用户所有小说漫改项目。

### 页面路径

```text
/projects
```

### 页面布局

```text
顶部操作区
项目统计区
项目列表区
```

### 顶部操作区

| 元素 | 类型 | 说明 |
|---|---|---|
| 页面标题 | 文本 | 我的 MangaForge 项目 |
| 创建项目 | 按钮 | 跳转创建项目页 |
| 搜索框 | 输入框 | 搜索项目名称 |
| 类型筛选 | 下拉框 | 按小说类型筛选 |
| 状态筛选 | 下拉框 | 按项目状态筛选 |

### 项目统计区

展示：

```text
项目总数
已上传小说数
解析中项目数
已生成话数
已导出文件数
```

### 项目卡片字段

| 字段 | 说明 |
|---|---|
| 项目名称 | 小说 / 漫改项目名称 |
| 小说类型 | 古风、都市、玄幻、悬疑等 |
| 目标漫画风格 | 国漫、韩漫、日系、Q版等 |
| 总字数 | 上传后统计 |
| 章节数 | 自动拆章后统计 |
| 已解析章节 | AI 已解析章节数量 |
| 已生成话数 | 已生成 comic_episode 数量 |
| 当前状态 | 项目状态 |
| 更新时间 | 最近编辑时间 |

### 项目状态

```text
待上传
已上传
章节已识别
解析中
已解析
改编中
分镜中
已导出
已归档
```

### 操作按钮

| 按钮 | 说明 |
|---|---|
| 进入项目 | 进入项目详情 |
| 继续编辑 | 进入最近编辑页面 |
| 删除 | 删除项目 |
| 导出资料 | 查看导出记录 |

### 空状态

当没有项目时，展示：

```text
暂无 MangaForge 项目，创建第一个项目开始改编。
```

按钮：

```text
创建项目
```

---

## 5.3 创建项目页

### 页面目标

创建一个新的小说漫改项目。

### 页面路径

```text
/projects/create
```

### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| 项目名称 | 输入框 | 是 | 项目名称 |
| 小说名称 | 输入框 | 是 | 原著名称 |
| 作者名称 | 输入框 | 否 | 原著作者 |
| 小说类型 | 下拉框 | 是 | 古风、玄幻、都市等 |
| 漫画风格 | 下拉框 | 是 | 国漫、韩漫、日系等 |
| 目标读者 | 多选 | 否 | 女频、男频、青少年等 |
| 改编目标 | 文本域 | 否 | 用户的改编诉求 |
| 备注 | 文本域 | 否 | 其他说明 |

### 小说类型枚举

```text
古风
玄幻
仙侠
都市
悬疑
恋爱
校园
科幻
末世
无限流
游戏
历史
其他
```

### 漫画风格枚举

```text
国漫条漫
韩漫竖条
日系清新
古风唯美
赛博朋克
Q版搞笑
水彩治愈
黑白漫画
```

### 按钮

| 按钮 | 说明 |
|---|---|
| 创建项目 | 保存并进入小说导入页 |
| 取消 | 返回项目工作台 |

### 表单校验

| 字段 | 校验 |
|---|---|
| 项目名称 | 必填，1～50 字 |
| 小说名称 | 必填，1～50 字 |
| 小说类型 | 必选 |
| 漫画风格 | 必选 |

---

## 5.4 项目详情页

### 页面目标

作为项目内部首页，展示当前项目整体状态和快捷入口。

### 页面路径

```text
/projects/{projectId}
```

### 项目信息

```text
项目名称
小说名称
小说类型
漫画风格
项目状态
创建时间
最近编辑时间
```

### 项目进度

```text
小说上传状态
章节识别状态
AI 解析进度
角色库完成度
已生成单话数量
已生成分镜数量
已导出文件数量
```

### 快捷入口

| 入口 | 说明 |
|---|---|
| 小说导入 | 上传或查看原著 |
| 章节管理 | 查看章节列表 |
| AI 解析 | 批量解析章节 |
| 小说知识库 | 查看角色、事件、场景 |
| 单话改编 | 创建漫画话数 |
| 分镜编辑 | 编辑漫画分镜 |
| 导出中心 | 下载导出文件 |

---

## 5.5 小说导入页

### 页面目标

上传 TXT 小说，并自动识别章节。

### 页面路径

```text
/projects/{projectId}/import
```

### 页面布局

```text
左侧：上传区域
右侧：文件信息 / 解析结果
底部：章节识别预览
```

### 上传区域

| 元素 | 类型 | 说明 |
|---|---|---|
| 拖拽上传区 | 上传组件 | 支持拖拽 TXT |
| 选择文件按钮 | 按钮 | 本地选择文件 |
| 上传说明 | 文本 | 仅支持 TXT，建议小于 50MB |
| 上传进度 | 进度条 | 显示上传百分比 |

### 支持格式

MVP 仅支持：

```text
.txt
```

### 上传限制

| 项目 | 限制 |
|---|---|
| 文件大小 | 建议 ≤ 50MB |
| 编码 | UTF-8，兼容 GBK 转码 |
| 文件数量 | 单项目 MVP 只支持 1 个主文件 |
| 内容 | 不支持图片、压缩包 |

### 上传成功后展示

```text
文件名
文件大小
文本编码
总字数
初步识别章节数
上传时间
```

### 自动拆章规则

系统需要支持以下章节格式：

```text
第1章 标题
第 1 章 标题
第一章 标题
第001章 标题
卷一
第一卷
Chapter 1
CHAPTER 1
```

### 拆章结果字段

| 字段 | 说明 |
|---|---|
| 章节序号 | 系统生成 |
| 卷名 | 可为空 |
| 章节标题 | 识别出的标题 |
| 字数 | 章节字数 |
| 起始位置 | 文本位置 |
| 状态 | 正常 / 异常 |
| 操作 | 查看、编辑、合并、删除 |

### 拆章异常情况

| 异常 | 处理 |
|---|---|
| 未识别章节 | 提示用户手动设置拆分规则 |
| 章节过短 | 标记异常，可合并 |
| 章节过长 | 标记异常，可拆分 |
| 编码乱码 | 提示切换编码 |
| 文件为空 | 上传失败 |

### 按钮

| 按钮 | 说明 |
|---|---|
| 上传小说 | 上传 TXT |
| 重新拆章 | 重新识别章节 |
| 保存章节 | 确认拆章结果 |
| 进入章节管理 | 跳转章节列表 |

---

## 5.6 章节管理页

### 页面目标

管理小说章节，查看和编辑章节正文。

### 页面路径

```text
/projects/{projectId}/chapters
```

### 页面布局

```text
左侧：章节列表
右侧：章节详情
顶部：批量操作
```

### 章节列表字段

| 字段 | 说明 |
|---|---|
| 章节序号 | 第几章 |
| 章节标题 | 章节名称 |
| 字数 | 当前章节字数 |
| 解析状态 | 未解析 / 解析中 / 已解析 / 失败 |
| 更新时间 | 最近修改时间 |

### 章节状态

```text
未解析
解析中
已解析
解析失败
已修改
已锁定
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

### 操作功能

| 操作 | 说明 |
|---|---|
| 查看章节 | 查看章节正文 |
| 编辑章节 | 修改标题和正文 |
| 删除章节 | 删除当前章节 |
| 合并章节 | 与上一章或下一章合并 |
| 拆分章节 | 根据光标位置拆分 |
| 解析章节 | 单章 AI 解析 |
| 批量解析 | 多选章节解析 |

### 批量操作

```text
批量解析
批量删除
批量设置卷名
批量导出章节
```

---

## 5.7 AI 章节解析页

### 页面目标

展示 AI 对章节的结构化解析结果。

### 页面路径

```text
/projects/{projectId}/analysis
```

也可以从章节详情页进入。

### 解析输入

```text
章节标题
章节正文
项目基础信息
小说类型
漫画风格
已有角色库
已有禁改设定
```

### 解析输出

| 字段 | 类型 | 说明 |
|---|---|---|
| summary | 文本 | 章节摘要 |
| characters | 数组 | 出场人物 |
| new_characters | 数组 | 新增人物 |
| events | 数组 | 关键事件 |
| scenes | 数组 | 场景地点 |
| props | 数组 | 道具 |
| conflicts | 数组 | 冲突点 |
| emotions | 数组 | 情绪变化 |
| foreshadowing | 数组 | 伏笔 |
| visual_moments | 数组 | 适合漫画化画面 |
| adaptation_notes | 文本 | 漫改建议 |

### 示例输出

```json
{
  "summary": "沈青禾在雨夜回到沈家，当众拒绝被安排的婚事，与沈夫人发生第一次正面冲突。",
  "characters": ["沈青禾", "沈夫人", "顾长渊"],
  "events": [
    "沈青禾回到沈家",
    "沈夫人逼她接受婚约",
    "沈青禾当众退婚"
  ],
  "scenes": ["雨夜府门", "沈家正厅"],
  "props": ["玉佩"],
  "conflicts": ["家族压迫", "婚约冲突"],
  "emotions": ["压抑", "隐忍", "爆发"],
  "foreshadowing": ["玉佩来源未解释"],
  "visual_moments": [
    "雨夜府门前少女抬头",
    "沈青禾将玉佩握在掌心"
  ],
  "adaptation_notes": "本章适合改编为强冲突开场，前 5 格应快速建立雨夜、压迫与女主反抗。"
}
```

### 操作按钮

| 按钮 | 说明 |
|---|---|
| 开始解析 | 创建 AI 解析任务 |
| 重新解析 | 覆盖当前解析结果 |
| 保存到知识库 | 将人物、事件、场景写入知识库 |
| 查看原文 | 展开原章节正文 |
| 复制 JSON | 复制解析结果 |

### 异常处理

| 异常 | 处理 |
|---|---|
| AI 解析失败 | 显示失败原因，支持重试 |
| JSON 格式错误 | 后端自动修复或重试 |
| 章节过长 | 自动分段解析后合并 |
| 输出为空 | 提示重新解析 |
| 任务超时 | 标记失败，可重试 |

---

## 5.8 小说知识库页

### 页面目标

管理由 AI 提取和人工维护的小说设定资产。

### 页面路径

```text
/projects/{projectId}/knowledge
```

### 页面 Tab

```text
角色库
事件库
场景库
道具库
伏笔库
禁改设定
```

MVP 优先级：

| Tab | 优先级 |
|---|---|
| 角色库 | P0 |
| 事件库 | P0 |
| 场景库 | P1 |
| 道具库 | P1 |
| 伏笔库 | P1 |
| 禁改设定 | P0 |

### 5.8.1 角色库

#### 角色字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| 角色姓名 | 输入框 | 是 | 角色主名称 |
| 别名 | 输入框 | 否 | 多个别名 |
| 性别 | 下拉 | 否 | 男 / 女 / 其他 / 未知 |
| 年龄 | 输入框 | 否 | 可填写模糊年龄 |
| 身份 | 输入框 | 否 | 如沈家庶女 |
| 阵营 | 输入框 | 否 | 所属势力 |
| 性格 | 文本域 | 否 | 性格描述 |
| 外貌 | 文本域 | 否 | 绘图重要字段 |
| 服装 | 文本域 | 否 | 常见服饰 |
| 口头禅 | 文本域 | 否 | 常用语气 |
| 人物目标 | 文本域 | 否 | 角色动机 |
| 人物弧光 | 文本域 | 否 | 角色成长线 |
| 主要关系 | 文本域 | 否 | 与其他角色关系 |
| 重要剧情节点 | 文本域 | 否 | 角色关键事件 |
| 绘图 Prompt | 文本域 | 否 | 角色专属提示词 |
| 负面 Prompt | 文本域 | 否 | 避免画错 |
| 禁止变化项 | 文本域 | 否 | 不允许改动 |
| 参考图 | 图片 | 否 | P1 支持 |

#### 角色操作

```text
新增角色
编辑角色
删除角色
合并角色
从章节解析导入
生成角色 Prompt
重新生成角色设定
```

### 5.8.2 事件库

#### 事件字段

```text
事件名称
事件摘要
发生章节
涉及人物
涉及场景
事件影响
是否主线事件
是否已改编
```

### 5.8.3 场景库

#### 场景字段

```text
场景名称
场景类型
首次出现章节
场景描述
视觉特征
相关人物
绘图 Prompt
```

### 5.8.4 伏笔库

#### 伏笔字段

```text
伏笔名称
首次出现章节
伏笔描述
关联人物
关联道具
回收章节
是否已回收
是否允许提前透露
```

### 5.8.5 禁改设定

#### 字段

```text
禁改内容
禁改类型
关联对象
严重程度
说明
```

#### 禁改类型

```text
角色设定
剧情设定
世界观设定
时间线设定
伏笔设定
关系设定
```

#### 严重程度

```text
高
中
低
```

---

## 5.9 单话改编页

### 页面目标

用户选择 1～3 个章节，生成一话漫画改编方案。

### 页面路径

```text
/projects/{projectId}/episodes/create
```

### 页面布局

```text
左侧：章节选择
中间：改编参数
右侧：生成结果
```

### 章节选择

| 字段 | 说明 |
|---|---|
| 选择章节 | 可多选 1～3 章 |
| 章节摘要 | 展示已解析摘要 |
| 出场人物 | 展示章节人物 |
| 关键事件 | 展示章节事件 |

### 改编参数

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| 本话标题 | 输入框 | AI 自动生成 | 可手填 |
| 目标格数 | 数字 | 40 | 30～60 |
| 漫画风格 | 下拉 | 项目默认 | 可覆盖 |
| 改编强度 | 单选 | 中等 | 保守 / 中等 / 大胆 |
| 节奏类型 | 下拉 | 强冲突 | 强冲突 / 治愈 / 悬疑 / 搞笑 |
| 结尾钩子 | 开关 | 开 | 是否生成强钩子 |
| 保留原文对白 | 开关 | 开 | 尽量保留原文名台词 |

### 改编强度说明

```text
保守：尽量遵循原文，不大幅调整剧情。
中等：压缩心理描写，适度调整节奏。
大胆：增强冲突，重组部分情节，提高漫画爽感。
```

### 生成结果字段

```text
本话标题
本话梗概
核心冲突
出场人物
场景列表
情绪曲线
剧情节奏
结尾钩子
改编说明
漫画剧本
```

### 按钮

| 按钮 | 说明 |
|---|---|
| 生成本话方案 | 调用 EpisodeAdaptAgent |
| 重新生成 | 重新生成改编方案 |
| 保存为新话 | 创建 comic_episode |
| 进入分镜生成 | 跳转分镜编辑器 |

---

## 5.10 单话剧本页

### 页面目标

展示和编辑 AI 生成的本话漫画剧本。

### 页面路径

```text
/episodes/{episodeId}/script
```

### 剧本结构

```text
本话标题
本话梗概
场景段落
对白
旁白
转场说明
节奏说明
结尾钩子
```

### 场景段落字段

| 字段 | 说明 |
|---|---|
| 场景序号 | 第几个场景 |
| 场景名称 | 如沈家正厅 |
| 涉及人物 | 本场景人物 |
| 剧情目的 | 这段剧情承担什么作用 |
| 对白 | 漫画对白 |
| 旁白 | 漫画旁白 |
| 转场 | 与下一场景如何连接 |

### 操作

```text
编辑剧本
重新生成剧本
优化对白
增强冲突
压缩剧情
生成分镜
保存
```

---

## 5.11 分镜编辑器页

### 页面目标

生成并编辑单话漫画分镜，是 MVP 最核心页面。

### 页面路径

```text
/episodes/{episodeId}/storyboard
```

### 页面布局

建议三栏：

```text
左栏：本话信息 / 角色 / 原著摘要
中栏：分镜列表
右栏：漫画预览 / Prompt 面板
```

### 左栏内容

```text
本话标题
本话梗概
核心冲突
出场人物
相关角色设定
相关场景设定
原著章节摘要
禁改设定提醒
```

### 中栏：分镜列表

每个分镜卡片展示：

```text
格号
场景
人物
景别
画面描述
对白
旁白
音效
Prompt
状态
```

### 右栏：预览

展示一个竖版漫画结构：

```text
标题
第 1 格
第 2 格
第 3 格
...
```

每格预览包含：

```text
画面描述
对白气泡
旁白
Prompt 简略展示
```

### 分镜字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| 格号 | 数字 | 是 | panel_index |
| 场景 | 输入框 | 否 | 当前所在场景 |
| 人物 | 多选 | 否 | 当前格出现人物 |
| 镜头 | 下拉 | 否 | 镜头描述 |
| 景别 | 下拉 | 否 | 远景 / 中景等 |
| 画面描述 | 文本域 | 是 | 核心字段 |
| 人物动作 | 文本域 | 否 | 动作说明 |
| 人物表情 | 文本域 | 否 | 表情说明 |
| 对白 | 文本域 | 否 | 角色对白 |
| 旁白 | 文本域 | 否 | 叙述文字 |
| 音效字 | 输入框 | 否 | 如“轰”“啪” |
| 绘图 Prompt | 文本域 | 是 | AI 出图提示词 |
| 负面 Prompt | 文本域 | 否 | 避免错误 |
| 状态 | 下拉 | 是 | 当前分镜状态 |

### 景别枚举

```text
远景
全景
中景
近景
特写
大特写
俯视
仰视
过肩镜头
主观镜头
```

### 分镜状态

```text
AI 初稿
已编辑
待审核
需修改
已确认
已导出
```

### 分镜操作

| 操作 | 说明 |
|---|---|
| 生成分镜 | 调用 StoryboardAgent |
| 新增分镜 | 新增空白分镜 |
| 删除分镜 | 删除当前格 |
| 复制分镜 | 复制当前格 |
| 拖拽排序 | 调整分镜顺序 |
| 重新生成单格 | 只重生成当前格 |
| 批量生成 Prompt | 重新生成所有 Prompt |
| 复制 Prompt | 复制当前格 Prompt |
| 复制全部 Prompt | 复制所有格 Prompt |
| 保存 | 保存所有改动 |
| 进入导出 | 跳转导出页 |

### 分镜生成参数

| 参数 | 说明 |
|---|---|
| 目标格数 | 30～60 |
| 分镜密度 | 简略 / 标准 / 细致 |
| 对白风格 | 原著向 / 漫画化 / 爽文向 |
| 画面风格 | 项目默认，可覆盖 |
| 是否生成音效 | 是 / 否 |
| 是否生成负面 Prompt | 是 / 否 |

---

## 5.12 导出页

### 页面目标

导出单话制作资料。

### 页面路径

```text
/episodes/{episodeId}/export
```

### 导出格式

| 格式 | 内容 |
|---|---|
| Excel | 分镜表格 |
| Word | 漫画剧本 + 分镜说明 |
| HTML | 漫画结构预览 |
| JSON | 原始结构化数据 |
| TXT | 全部分镜 Prompt |

### Excel 字段

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

### Word 内容

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

### HTML 预览内容

```text
竖版漫画预览
分镜画面描述
对白气泡
旁白
Prompt 简略显示
```

### 导出操作

```text
选择导出格式
生成导出文件
查看导出进度
下载文件
查看历史导出
```

---

## 5.13 AI 任务记录页

### 页面目标

查看 AI 任务状态、失败原因和重试。

### 页面路径

```text
/projects/{projectId}/ai-tasks
```

### 任务类型

```text
章节解析
角色提取
单话改编
剧本生成
分镜生成
Prompt 生成
一致性检查
导出生成
```

### 任务状态

```text
等待中
执行中
成功
失败
已取消
已重试
```

### 任务字段

| 字段 | 说明 |
|---|---|
| 任务 ID | 系统 ID |
| 任务类型 | 章节解析等 |
| 关联对象 | chapter_id / episode_id |
| 状态 | 当前任务状态 |
| 创建时间 | 任务创建时间 |
| 开始时间 | 实际开始时间 |
| 完成时间 | 任务结束时间 |
| 错误信息 | 失败时展示 |
| 重试次数 | 当前重试次数 |

### 操作

```text
查看详情
重试任务
取消任务
复制错误信息
查看 AI 输入
查看 AI 输出
```

---

## 6. AI Agent 需求

## 6.1 NovelChapterAnalysisAgent

### 作用

解析单个小说章节，生成结构化信息。

### 输入

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

### 输出

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

## 6.2 CharacterBuildAgent

### 作用

根据章节解析结果生成角色库。

### 输入

```json
{
  "project_id": 1,
  "chapter_analysis_list": []
}
```

### 输出

```json
{
  "characters": [
    {
      "name": "",
      "alias": [],
      "gender": "",
      "identity": "",
      "personality": "",
      "appearance": "",
      "costume": "",
      "relationships": [],
      "character_arc": "",
      "prompt": "",
      "negative_prompt": "",
      "forbidden_changes": []
    }
  ]
}
```

---

## 6.3 EpisodeAdaptAgent

### 作用

将指定章节改编成一话漫画。

### 输入

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

### 输出

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
  "script": [
    {
      "scene_name": "",
      "purpose": "",
      "characters": [],
      "dialogue": "",
      "narration": "",
      "transition": ""
    }
  ]
}
```

---

## 6.4 StoryboardAgent

### 作用

把漫画剧本拆成漫画分镜。

### 输入

```json
{
  "episode_id": 1,
  "episode_title": "",
  "script": [],
  "target_panels": 40,
  "characters": [],
  "comic_style": "",
  "prompt_style": "",
  "forbidden_rules": []
}
```

### 输出

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

## 6.5 ConsistencyCheckAgent

MVP 可作为 P1。

### 作用

检查分镜是否违背原著和角色设定。

### 输入

```json
{
  "episode_id": 1,
  "panels": [],
  "characters": [],
  "forbidden_rules": [],
  "chapter_summaries": []
}
```

### 输出

```json
{
  "passed": true,
  "issues": [
    {
      "panel_index": 3,
      "issue_type": "角色设定冲突",
      "description": "",
      "suggestion": "",
      "severity": "高"
    }
  ]
}
```

---

## 7. 数据库设计

## 7.1 app_user 用户表

```sql
CREATE TABLE app_user (
  id BIGINT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(30),
  password_hash VARCHAR(255),
  role VARCHAR(30),
  status VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.2 novel_project 项目表

```sql
CREATE TABLE novel_project (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  project_name VARCHAR(100) NOT NULL,
  novel_name VARCHAR(100) NOT NULL,
  author VARCHAR(100),
  genre VARCHAR(50),
  comic_style VARCHAR(50),
  target_reader VARCHAR(255),
  adaptation_goal TEXT,
  word_count INT DEFAULT 0,
  chapter_count INT DEFAULT 0,
  status VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.3 novel_file 小说文件表

```sql
CREATE TABLE novel_file (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  file_name VARCHAR(255),
  file_url VARCHAR(500),
  file_size BIGINT,
  encoding VARCHAR(50),
  word_count INT,
  upload_status VARCHAR(30),
  created_at TIMESTAMP
);
```

## 7.4 novel_chapter 章节表

```sql
CREATE TABLE novel_chapter (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  volume_name VARCHAR(100),
  chapter_title VARCHAR(200),
  chapter_index INT,
  content LONGTEXT,
  word_count INT,
  parse_status VARCHAR(30),
  analysis_status VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.5 chapter_analysis 章节解析表

```sql
CREATE TABLE chapter_analysis (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  chapter_id BIGINT NOT NULL,
  summary TEXT,
  characters JSON,
  new_characters JSON,
  events JSON,
  scenes JSON,
  props JSON,
  conflicts JSON,
  emotions JSON,
  foreshadowing JSON,
  visual_moments JSON,
  adaptation_notes TEXT,
  raw_result JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.6 character_profile 角色表

```sql
CREATE TABLE character_profile (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  alias JSON,
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
  relationships JSON,
  important_events JSON,
  prompt TEXT,
  negative_prompt TEXT,
  forbidden_changes JSON,
  reference_images JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.7 story_event 事件表

```sql
CREATE TABLE story_event (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  event_name VARCHAR(200),
  event_summary TEXT,
  chapter_ids JSON,
  character_ids JSON,
  scene_ids JSON,
  impact TEXT,
  is_main_event BOOLEAN DEFAULT FALSE,
  adapted_status VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.8 story_scene 场景表

```sql
CREATE TABLE story_scene (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  scene_name VARCHAR(200),
  scene_type VARCHAR(50),
  first_chapter_id BIGINT,
  description TEXT,
  visual_features TEXT,
  related_characters JSON,
  prompt TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.9 forbidden_rule 禁改设定表

```sql
CREATE TABLE forbidden_rule (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  rule_content TEXT NOT NULL,
  rule_type VARCHAR(50),
  related_object_type VARCHAR(50),
  related_object_id BIGINT,
  severity VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.10 comic_episode 单话表

```sql
CREATE TABLE comic_episode (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  season_index INT DEFAULT 1,
  episode_index INT,
  episode_title VARCHAR(200),
  source_chapter_ids JSON,
  target_panels INT,
  summary TEXT,
  main_conflict TEXT,
  characters JSON,
  scenes JSON,
  emotion_curve TEXT,
  rhythm TEXT,
  hook TEXT,
  adaptation_notes TEXT,
  script JSON,
  status VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.11 storyboard_panel 分镜表

```sql
CREATE TABLE storyboard_panel (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  episode_id BIGINT NOT NULL,
  panel_index INT,
  scene VARCHAR(200),
  characters JSON,
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
  status VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.12 ai_task AI 任务表

```sql
CREATE TABLE ai_task (
  id BIGINT PRIMARY KEY,
  project_id BIGINT,
  task_type VARCHAR(50),
  related_type VARCHAR(50),
  related_id BIGINT,
  status VARCHAR(30),
  input_payload JSON,
  output_payload JSON,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 7.13 export_file 导出文件表

```sql
CREATE TABLE export_file (
  id BIGINT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  episode_id BIGINT,
  export_type VARCHAR(30),
  file_name VARCHAR(255),
  file_url VARCHAR(500),
  file_size BIGINT,
  status VARCHAR(30),
  created_at TIMESTAMP
);
```

---

## 8. API 接口需求

## 8.1 项目接口

```http
POST /api/projects
GET /api/projects
GET /api/projects/{projectId}
PUT /api/projects/{projectId}
DELETE /api/projects/{projectId}
```

## 8.2 小说上传接口

```http
POST /api/projects/{projectId}/novel/upload
POST /api/projects/{projectId}/novel/parse-chapters
GET /api/projects/{projectId}/chapters
GET /api/chapters/{chapterId}
PUT /api/chapters/{chapterId}
DELETE /api/chapters/{chapterId}
POST /api/chapters/{chapterId}/split
POST /api/chapters/merge
```

## 8.3 AI 解析接口

```http
POST /api/chapters/{chapterId}/analyze
POST /api/chapters/batch-analyze
GET /api/chapters/{chapterId}/analysis
POST /api/analysis/{analysisId}/save-to-knowledge
```

## 8.4 知识库接口

```http
GET /api/projects/{projectId}/characters
POST /api/projects/{projectId}/characters
GET /api/characters/{characterId}
PUT /api/characters/{characterId}
DELETE /api/characters/{characterId}

GET /api/projects/{projectId}/events
GET /api/projects/{projectId}/scenes
GET /api/projects/{projectId}/forbidden-rules
POST /api/projects/{projectId}/forbidden-rules
PUT /api/forbidden-rules/{ruleId}
DELETE /api/forbidden-rules/{ruleId}
```

## 8.5 单话接口

```http
POST /api/projects/{projectId}/episodes/generate-plan
POST /api/projects/{projectId}/episodes
GET /api/projects/{projectId}/episodes
GET /api/episodes/{episodeId}
PUT /api/episodes/{episodeId}
DELETE /api/episodes/{episodeId}
POST /api/episodes/{episodeId}/generate-script
```

## 8.6 分镜接口

```http
POST /api/episodes/{episodeId}/storyboards/generate
GET /api/episodes/{episodeId}/storyboards
POST /api/episodes/{episodeId}/storyboards
PUT /api/storyboards/{panelId}
DELETE /api/storyboards/{panelId}
POST /api/episodes/{episodeId}/storyboards/reorder
POST /api/storyboards/{panelId}/regenerate
POST /api/episodes/{episodeId}/storyboards/copy-prompts
```

## 8.7 导出接口

```http
POST /api/episodes/{episodeId}/export/excel
POST /api/episodes/{episodeId}/export/word
POST /api/episodes/{episodeId}/export/html
POST /api/episodes/{episodeId}/export/json
POST /api/episodes/{episodeId}/export/prompts
GET /api/export-files/{fileId}/download
GET /api/projects/{projectId}/exports
```

## 8.8 AI 任务接口

```http
GET /api/projects/{projectId}/ai-tasks
GET /api/ai-tasks/{taskId}
POST /api/ai-tasks/{taskId}/retry
POST /api/ai-tasks/{taskId}/cancel
```

---

## 9. 状态流转

### 9.1 项目状态流转

```text
待上传
↓
已上传
↓
章节已识别
↓
解析中
↓
已解析
↓
改编中
↓
分镜中
↓
已导出
```

### 9.2 章节状态流转

```text
未解析
↓
解析中
↓
已解析

解析中
↓
解析失败
↓
重新解析
```

### 9.3 单话状态流转

```text
待生成
↓
大纲已生成
↓
剧本已生成
↓
分镜已生成
↓
已编辑
↓
已导出
```

### 9.4 分镜状态流转

```text
AI 初稿
↓
已编辑
↓
待审核
↓
已确认
↓
已导出
```

### 9.5 AI 任务状态流转

```text
等待中
↓
执行中
↓
成功

执行中
↓
失败
↓
重试中
↓
成功 / 失败
```

---

## 10. 非功能需求

### 10.1 性能需求

| 项目 | 要求 |
|---|---|
| 项目列表加载 | 2 秒内 |
| 章节列表加载 | 3 秒内 |
| TXT 上传 | 支持 50MB |
| 自动拆章 | 50MB 文件 30 秒内完成 |
| AI 任务 | 异步执行 |
| 分镜编辑保存 | 1 秒内响应 |

### 10.2 稳定性需求

```text
AI 任务失败不能影响项目数据
AI 输出必须保存原始结果
编辑内容必须支持手动保存
导出失败必须可重试
上传失败不得生成脏数据
```

### 10.3 安全需求

```text
用户只能访问自己的项目
上传文件需要限制格式
接口需要鉴权
删除操作需要二次确认
敏感配置不能暴露到前端
AI 调用 Key 只能存在服务端
```

### 10.4 可维护性需求

```text
AI Prompt 模板可配置
AI JSON Schema 可版本化
任务失败日志可查看
数据库字段预留扩展能力
导出模板可替换
```

---

## 11. 验收标准

### 11.1 主流程验收

必须完整跑通：

```text
创建项目
上传 TXT
自动拆章
查看章节
AI 解析章节
生成角色库
选择 1～3 章
生成一话改编方案
生成漫画剧本
生成 30～60 格分镜
编辑分镜
复制 Prompt
导出 Excel
导出 Word
导出 HTML
```

### 11.2 功能验收标准

| 功能 | 验收标准 |
|---|---|
| TXT 上传 | 可成功上传并保存 |
| 自动拆章 | 常见章节格式识别准确率 ≥ 95% |
| 章节编辑 | 修改后可保存 |
| AI 解析 | 成功返回结构化 JSON |
| 角色库 | 可自动生成并人工编辑 |
| 单话改编 | 可根据 1～3 章生成大纲 |
| 分镜生成 | 可生成指定数量范围内分镜 |
| 分镜编辑 | 所有核心字段可编辑 |
| Prompt 复制 | 可复制单条和全部 Prompt |
| 导出 Excel | 内容完整，字段正确 |
| 导出 Word | 剧本和分镜完整 |
| 导出 HTML | 可打开预览 |
| AI 任务 | 可查看状态和失败原因 |

### 11.3 AI 输出验收标准

| 项目 | 标准 |
|---|---|
| JSON 格式正确率 | ≥ 95% |
| 章节解析成功率 | ≥ 90% |
| 单话生成成功率 | ≥ 90% |
| 分镜生成成功率 | ≥ 90% |
| 分镜数量误差 | 不超过目标格数 ±10% |
| 角色名称一致性 | 主要角色不得混淆 |
| 禁改设定遵守 | 高级别禁改设定不得违反 |

---

## 12. MVP 开发优先级

### 12.1 P0 必须完成

```text
用户登录
项目管理
TXT 上传
自动拆章
章节管理
章节解析
角色库
单话改编
分镜生成
分镜编辑
Prompt 生成
Excel 导出
Word 导出
HTML 导出
AI 任务状态
```

### 12.2 P1 建议完成

```text
事件库
场景库
禁改设定
单格重新生成
批量复制 Prompt
导出 JSON
导出 Prompt TXT
HTML 漫画预览优化
任务失败重试
```

### 12.3 P2 后续版本

```text
多人协作
评论系统
图片生成
角色参考图
LoRA 绑定
权限管理
支付系统
发布平台
数据看板
API 开放
```

---

## 13. 第一版开发排期建议

### Sprint 1：基础框架与项目模块

周期：2 周

交付：

```text
登录
项目工作台
创建项目
项目详情
数据库基础表
后端基础接口
```

### Sprint 2：小说上传与章节管理

周期：2 周

交付：

```text
TXT 上传
自动拆章
章节列表
章节详情
章节编辑
章节删除
```

### Sprint 3：AI 章节解析与知识库

周期：2 周

交付：

```text
AI 任务系统
HermesAgent 接入
章节解析
角色库
事件库基础版
解析结果展示
```

### Sprint 4：单话改编与剧本生成

周期：1～2 周

交付：

```text
章节选择
改编参数
本话大纲
漫画剧本
保存单话
```

### Sprint 5：分镜编辑器

周期：2 周

交付：

```text
分镜生成
分镜列表
分镜编辑
拖拽排序
Prompt 编辑
漫画预览
```

### Sprint 6：导出与测试

周期：1～2 周

交付：

```text
Excel 导出
Word 导出
HTML 导出
JSON 导出
Prompt TXT 导出
测试修复
演示项目
```

---

## 14. MVP 最终交付物

```text
Web 前端系统
后端 API 服务
数据库表结构
AI Agent 工作流
Prompt 模板
JSON Schema
导出模板
测试用例
测试报告
演示小说项目
部署文档
```

---

## 15. GitHub 项目建议

### 仓库名

```text
manga-forge
```

### 推荐目录结构

```text
manga-forge/
├── apps/
│   ├── web/              # 前端项目
│   └── admin/            # 管理后台，后期可加
│
├── services/
│   ├── api/              # 后端 API 服务
│   ├── agent/            # HermesAgent / AI 工作流服务
│   ├── worker/           # 异步任务服务
│   └── export/           # 导出服务
│
├── packages/
│   ├── shared/           # 公共类型、工具函数
│   ├── prompts/          # Prompt 模板
│   └── schemas/          # JSON Schema
│
├── docs/
│   ├── prd/
│   ├── api/
│   ├── database/
│   └── deployment/
│
├── docker/
├── scripts/
├── README.md
├── docker-compose.yml
└── .gitignore
```

---

## 16. 结论

MangaForge 的 MVP 核心不是做一个完整漫画平台，而是先完成一个可靠闭环：

```text
小说章节
→ AI 理解
→ 漫画改编
→ 漫画分镜
→ Prompt 生成
→ 人工编辑
→ 导出制作资料
```

只要这个闭环跑通，产品就具备验证价值。后续再逐步扩展图片生成、角色一致性、团队协作、商业化和发布能力。
