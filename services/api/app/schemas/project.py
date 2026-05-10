import uuid
from datetime import datetime

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    project_name: str
    novel_name: str
    author: str = ""
    genre: str = ""
    comic_style: str = ""
    target_reader: str = ""
    adaptation_goal: str = ""


class ProjectUpdate(BaseModel):
    project_name: str | None = None
    novel_name: str | None = None
    author: str | None = None
    genre: str | None = None
    comic_style: str | None = None
    target_reader: str | None = None
    adaptation_goal: str | None = None
    status: str | None = None


class ProjectResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    project_name: str
    novel_name: str
    author: str
    genre: str
    comic_style: str
    target_reader: str
    adaptation_goal: str
    word_count: int
    chapter_count: int
    analyzed_chapter_count: int
    episode_count: int
    export_count: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectStatsResponse(BaseModel):
    total_projects: int
    total_analyzed_chapters: int
    total_episodes: int
    total_exports: int
