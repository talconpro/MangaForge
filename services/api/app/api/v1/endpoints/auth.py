from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.config import settings
from app.core.exceptions import BadRequestException, UnauthorizedException
from app.core.response import ApiResponse
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserInfo,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=ApiResponse[TokenResponse])
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise BadRequestException(message="Email already registered")

    user = User(
        username=req.username,
        email=req.email,
    )
    user.set_password(req.password)
    db.add(user)
    await db.flush()
    await db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    expires_in = settings.jwt_access_token_expire_minutes * 60

    return ApiResponse.success(
        data=TokenResponse(
            access_token=access_token,
            expires_in=expires_in,
            user=UserInfo.model_validate(user),
        )
    ).model_dump()


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await db.execute(
        select(User).where(
            (User.email == req.account) | (User.username == req.account)
        )
    )
    user = user.scalar_one_or_none()
    if not user or not user.check_password(req.password):
        raise UnauthorizedException(message="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user.id)})
    expires_in = settings.jwt_access_token_expire_minutes * 60

    return ApiResponse.success(
        data=TokenResponse(
            access_token=access_token,
            expires_in=expires_in,
            user=UserInfo.model_validate(user),
        )
    ).model_dump()


@router.get("/me", response_model=ApiResponse[UserInfo])
async def me(current_user: User = Depends(get_current_user)):
    return ApiResponse.success(data=UserInfo.model_validate(current_user)).model_dump()
