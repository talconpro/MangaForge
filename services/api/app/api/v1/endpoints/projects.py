from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.core.exceptions import NotFoundException
from app.core.response import ApiResponse
from app.models.project import Project
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectStatsResponse,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ApiResponse[ProjectResponse])
async def create_project(
    req: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = Project(user_id=current_user.id, **req.model_dump())
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return ApiResponse.success(data=ProjectResponse.model_validate(project)).model_dump()


@router.get("/", response_model=ApiResponse[list[ProjectResponse]])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    keyword: str = Query("", description="Search keyword"),
    status: str = Query("", description="Filter by status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    query = select(Project).where(
        Project.user_id == current_user.id,
        Project.deleted_at.is_(None),
    )
    if keyword:
        query = query.where(
            (Project.project_name.ilike(f"%{keyword}%"))
            | (Project.novel_name.ilike(f"%{keyword}%"))
        )
    if status:
        query = query.where(Project.status == status)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()

    query = query.order_by(Project.updated_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size)
    result = await db.execute(query)
    projects = result.scalars().all()

    return ApiResponse.success(
        data=[ProjectResponse.model_validate(p) for p in projects],
        message=f"Total: {total}",
    ).model_dump()


@router.get("/stats", response_model=ApiResponse[ProjectStatsResponse])
async def get_project_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(
            func.count(Project.id).label("total_projects"),
            func.coalesce(func.sum(Project.analyzed_chapter_count), 0).label("total_analyzed"),
            func.coalesce(func.sum(Project.episode_count), 0).label("total_episodes"),
            func.coalesce(func.sum(Project.export_count), 0).label("total_exports"),
        ).where(
            Project.user_id == current_user.id,
            Project.deleted_at.is_(None),
        )
    )
    row = result.one()
    return ApiResponse.success(
        data=ProjectStatsResponse(
            total_projects=row.total_projects,
            total_analyzed_chapters=row.total_analyzed,
            total_episodes=row.total_episodes,
            total_exports=row.total_exports,
        )
    ).model_dump()


@router.get("/{project_id}", response_model=ApiResponse[ProjectResponse])
async def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
            Project.deleted_at.is_(None),
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise NotFoundException(message="Project not found")
    return ApiResponse.success(data=ProjectResponse.model_validate(project)).model_dump()


@router.put("/{project_id}", response_model=ApiResponse[ProjectResponse])
async def update_project(
    project_id: UUID,
    req: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
            Project.deleted_at.is_(None),
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise NotFoundException(message="Project not found")

    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    await db.flush()
    await db.refresh(project)
    return ApiResponse.success(data=ProjectResponse.model_validate(project)).model_dump()


@router.delete("/{project_id}", response_model=ApiResponse[None])
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id,
            Project.deleted_at.is_(None),
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise NotFoundException(message="Project not found")

    from datetime import datetime, timezone
    project.deleted_at = datetime.now(timezone.utc)
    await db.flush()
    return ApiResponse.success(data=None).model_dump()
