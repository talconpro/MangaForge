# MangaForge

AI-powered long-form novel to comic adaptation workbench.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.11+

## Quick Start

### 1. Configure environment

```bash
cp .env.example .env
```

### 2. Start infrastructure

```bash
docker compose up -d
```

| Service    | Port | Console              |
| ---------- | ---- | -------------------- |
| PostgreSQL | 5432 | —                    |
| Redis      | 6379 | —                    |
| MinIO      | 9000 | http://localhost:9001 |

### 3. Start the API

```bash
cd services/api
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs
Health check: `curl http://localhost:8000/health`

### 4. Start the frontend

```bash
cd apps/web
npm install
npm run dev
```

Dev server: http://localhost:5173

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   apps/web   │────▶│ services/api │────▶│  PostgreSQL  │
│   Vue 3 +    │     │  FastAPI +   │     │              │
│   Vite       │     │  SQLAlchemy  │     ├──────────────┤
└──────────────┘     │              │────▶│    Redis     │
                     │              │     ├──────────────┤
                     │              │────▶│    MinIO     │
                     └──────────────┘     └──────────────┘
```

## Repository Structure

```
MangaForge/
├── apps/web/                     # Vue 3 + Vite + TypeScript frontend
├── services/api/                 # FastAPI backend
├── docker/                       # Docker configs
├── docker-compose.yml
├── .env.example
└── README.md
```

## Tech Stack

- **Frontend**: Vue 3, Vite, TypeScript, Pinia, Vue Router, Axios, Tailwind CSS
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2
- **Infrastructure**: PostgreSQL, Redis, MinIO, Celery
- **Deployment**: Docker, Docker Compose

## Sprint Plan

| Sprint | Focus                                              |
| ------ | -------------------------------------------------- |
| 0      | Project initialization (current)                   |
| 1      | Login + project management                         |
| 2      | Novel upload + chapter splitting + chapter management |
| 3      | AI tasks + chapter analysis + knowledge base       |
| 4      | Episode adaptation + manga script                  |
| 5      | Storyboard generation + storyboard editor          |
| 6      | Export + testing + deployment                      |

## License

MIT — see [LICENSE](./LICENSE).
