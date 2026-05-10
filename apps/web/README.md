# MangaForge Web

Vue 3 + Vite + TypeScript 版本的 MangaForge 高保真交互原型。

本项目由 `MangaForge_高保真交互原型projectlayout风格.html` 拆分而来，采用：

- 登录页
- PlatformLayout：工作台、项目管理、资产库、系统管理
- ProjectLayout：项目切换、项目内导航、项目状态、快捷操作全部放在同一个顶部栏
- Mock API：所有页面数据通过 `src/api/mock.ts` 模拟返回
- Pinia：维护登录状态、主题、当前项目、Toast
- Vue Router：平台路由和项目路由分离

## 启动

```bash
npm install
npm run dev
```

访问：

```text
http://localhost:5173/login
```

## 打包

```bash
npm run build
```

## 路由结构

```text
/login
/dashboard
/projects
/assets
/system

/projects/:projectId/overview
/projects/:projectId/import
/projects/:projectId/chapters
/projects/:projectId/analysis
/projects/:projectId/knowledge
/projects/:projectId/episodes
/projects/:projectId/storyboard
/projects/:projectId/export
/projects/:projectId/tasks
```

## Mock API

数据集中在：

```text
src/api/mock.ts
```

后续接真实 FastAPI 时，可以把 `mockApi` 替换为 axios 请求。
