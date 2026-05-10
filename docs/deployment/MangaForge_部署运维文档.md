# MangaForge 部署运维文档

版本：V0.5 MVP  
项目名称：MangaForge  
部署方式：Docker Compose  
前端：Vue 3  
后端：FastAPI  
数据库：PostgreSQL  
队列：Redis + Celery  
存储：MinIO  
文档类型：Deployment & Operations Guide  

---

## 1. 文档目标

本文档用于指导 MangaForge MVP 的本地部署、测试环境部署、基础运维、日志查看、备份恢复和常见问题排查。

---

## 2. 部署架构

MVP 使用 Docker Compose 部署。

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
用户浏览器
↓
Nginx
├── Vue Web 静态资源
└── /api 反向代理到 FastAPI
        ↓
      FastAPI
      ├── PostgreSQL
      ├── Redis
      ├── MinIO
      └── Celery Worker
              ↓
          HermesAgent / LLM
```

---

## 3. 目录结构

```text
manga-forge/
├── apps/
│   └── web/
├── services/
│   └── api/
├── docker/
│   ├── nginx/
│   └── minio/
├── docs/
├── scripts/
├── docker-compose.yml
├── .env
├── .env.example
└── README.md
```

---

## 4. 环境要求

### 4.1 本地开发环境

```text
Docker 24+
Docker Compose v2+
Node.js 20+
Python 3.11+
PostgreSQL Client，可选
Redis Client，可选
```

### 4.2 服务器环境

推荐最低配置：

```text
CPU：4 Core
内存：8GB
磁盘：100GB
系统：Ubuntu 22.04+
Docker：24+
```

如果 AI 模型本地部署，需要额外 GPU 环境；MVP 默认使用外部 LLM API。

---

## 5. 环境变量

### 5.1 .env.example

```env
APP_ENV=development
APP_NAME=MangaForge
API_PREFIX=/api/v1

POSTGRES_DB=mangaforge
POSTGRES_USER=mangaforge
POSTGRES_PASSWORD=mangaforge_password
DATABASE_URL=postgresql+psycopg://mangaforge:mangaforge_password@postgres:5432/mangaforge

REDIS_URL=redis://redis:6379/0

JWT_SECRET_KEY=change_me
JWT_EXPIRE_SECONDS=86400

MINIO_ENDPOINT=minio:9000
MINIO_PUBLIC_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=manga-forge

LLM_PROVIDER=openai_compatible
LLM_API_BASE=https://api.example.com/v1
LLM_API_KEY=change_me
LLM_MODEL=gpt-4.1
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=8192

HERMES_AGENT_ENABLED=true
HERMES_AGENT_ENDPOINT=http://agent:9000
HERMES_AGENT_API_KEY=change_me
HERMES_AGENT_TIMEOUT_SECONDS=180

VITE_APP_NAME=MangaForge
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 6. Docker Compose 示例

```yaml
services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: mangaforge-web
    ports:
      - "3000:80"
    depends_on:
      - api

  api:
    build:
      context: ./services/api
      dockerfile: Dockerfile
    container_name: mangaforge-api
    env_file:
      - .env
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
      - minio
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000

  worker:
    build:
      context: ./services/api
      dockerfile: Dockerfile
    container_name: mangaforge-worker
    env_file:
      - .env
    depends_on:
      - api
      - redis
      - postgres
    command: celery -A app.workers.celery_app worker --loglevel=info

  postgres:
    image: postgres:16
    container_name: mangaforge-postgres
    environment:
      POSTGRES_DB: mangaforge
      POSTGRES_USER: mangaforge
      POSTGRES_PASSWORD: mangaforge_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: mangaforge-redis
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    container_name: mangaforge-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  minio_data:
```

---

## 7. 部署步骤

### 7.1 克隆代码

```bash
git clone https://github.com/your-org/manga-forge.git
cd manga-forge
```

### 7.2 创建环境变量

```bash
cp .env.example .env
```

修改 `.env` 中的：

```text
DATABASE_URL
JWT_SECRET_KEY
MINIO_ACCESS_KEY
MINIO_SECRET_KEY
LLM_API_KEY
HERMES_AGENT_ENDPOINT
```

### 7.3 启动服务

```bash
docker compose up -d
```

### 7.4 执行数据库迁移

```bash
docker compose exec api alembic upgrade head
```

### 7.5 创建 MinIO Bucket

进入 MinIO Console：

```text
http://localhost:9001
```

创建 Bucket：

```text
manga-forge
```

### 7.6 检查服务

```bash
docker compose ps
```

健康检查：

```bash
curl http://localhost:8000/health
```

前端访问：

```text
http://localhost:3000
```

后端 API 文档：

```text
http://localhost:8000/docs
```

---

## 8. 常用运维命令

### 8.1 查看日志

```bash
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f web
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f minio
```

### 8.2 重启服务

```bash
docker compose restart api
docker compose restart worker
```

### 8.3 停止服务

```bash
docker compose down
```

### 8.4 停止并删除数据卷

谨慎执行：

```bash
docker compose down -v
```

### 8.5 进入容器

```bash
docker compose exec api bash
docker compose exec postgres psql -U mangaforge -d mangaforge
```

---

## 9. 数据库运维

### 9.1 备份数据库

```bash
docker compose exec postgres pg_dump -U mangaforge mangaforge > backup.sql
```

### 9.2 恢复数据库

```bash
cat backup.sql | docker compose exec -T postgres psql -U mangaforge -d mangaforge
```

### 9.3 执行迁移

```bash
docker compose exec api alembic upgrade head
```

### 9.4 回滚迁移

```bash
docker compose exec api alembic downgrade -1
```

---

## 10. MinIO 运维

### 10.1 访问控制台

```text
http://localhost:9001
```

### 10.2 Bucket 规划

```text
manga-forge
```

### 10.3 文件路径规范

```text
projects/{project_id}/novels/{file_id}.txt
projects/{project_id}/exports/{episode_id}/{file_name}
projects/{project_id}/characters/{character_id}/references/{image_name}
```

### 10.4 文件备份

MinIO 数据保存在 Docker volume：

```text
minio_data
```

生产环境建议挂载到宿主机目录，并定期备份。

---

## 11. Celery Worker 运维

### 11.1 查看 Worker 日志

```bash
docker compose logs -f worker
```

### 11.2 重启 Worker

```bash
docker compose restart worker
```

### 11.3 常见问题

| 问题 | 处理 |
|---|---|
| 任务不执行 | 检查 worker 是否启动 |
| Redis 连接失败 | 检查 REDIS_URL |
| AI 任务失败 | 查看 ai_task.error_message |
| 任务卡住 | 重启 worker，并重试任务 |

---

## 12. HermesAgent 运维

### 12.1 检查 HermesAgent 连接

```bash
curl $HERMES_AGENT_ENDPOINT/health
```

### 12.2 常见问题

| 问题 | 处理 |
|---|---|
| 调用超时 | 增加 HERMES_AGENT_TIMEOUT_SECONDS |
| 返回非 JSON | 检查 Prompt 和 Agent 配置 |
| 任务失败 | 查看 worker 日志和 ai_task |
| Agent 不可用 | 切换 AI_EXECUTOR=direct_llm |

---

## 13. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 14. 日志策略

### 14.1 日志类型

```text
API 请求日志
错误日志
AI 任务日志
导出任务日志
上传日志
Worker 日志
```

### 14.2 日志字段

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

### 14.3 日志查看

```bash
docker compose logs -f api
docker compose logs -f worker
```

---

## 15. 监控指标

MVP 阶段至少关注：

```text
API 可用性
接口错误率
AI 任务成功率
AI 任务平均耗时
导出成功率
上传失败率
章节解析失败率
分镜生成失败率
磁盘空间
数据库连接数
Redis 可用性
```

---

## 16. 安全建议

```text
生产环境必须修改 JWT_SECRET_KEY。
生产环境必须修改 MinIO 默认账号密码。
LLM_API_KEY 不得提交到 GitHub。
.env 不得提交。
生产环境建议启用 HTTPS。
限制上传文件大小。
限制上传文件类型。
定期备份数据库和 MinIO 数据。
```

---

## 17. 发布流程

### 17.1 开发环境

```text
feature 分支开发
本地自测
提交 PR
Code Review
合并 develop
```

### 17.2 测试环境

```text
develop 分支构建镜像
部署测试环境
执行测试用例
修复 Bug
```

### 17.3 演示环境

```text
打 tag
构建 release 镜像
部署演示服务器
导入演示数据
执行主流程验收
```

---

## 18. 备份策略

### 18.1 数据库备份

建议：

```text
开发环境：手动备份
测试环境：每日备份
生产环境：每日自动备份 + 保留 7～30 天
```

### 18.2 文件备份

备份内容：

```text
小说原始 TXT
导出文件
后期参考图和生成图
```

---

## 19. 故障排查

### 19.1 前端页面打不开

检查：

```text
web 容器是否运行
Nginx 配置是否正确
浏览器控制台是否有资源错误
VITE_API_BASE_URL 是否正确
```

### 19.2 API 无法访问

检查：

```text
api 容器是否运行
端口是否暴露
数据库是否连接成功
环境变量是否正确
```

### 19.3 上传失败

检查：

```text
MinIO 是否运行
Bucket 是否存在
文件大小是否超限
文件类型是否正确
```

### 19.4 AI 任务失败

检查：

```text
worker 是否运行
Redis 是否连接
HermesAgent 是否可访问
LLM_API_KEY 是否有效
ai_task.error_message
```

### 19.5 导出失败

检查：

```text
导出 Worker 日志
MinIO 写入权限
分镜数据是否完整
模板文件是否存在
```

---

## 20. MVP 部署验收标准

```text
docker compose up -d 可成功启动全部服务。
前端可访问。
后端 /health 正常。
Swagger 文档可访问。
PostgreSQL 可连接。
Redis 可连接。
MinIO 可上传文件。
Worker 可执行任务。
HermesAgent 可调用。
完整主流程可跑通。
导出文件可下载。
```
