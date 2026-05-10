import uuid
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    code: int = 0
    message: str = "success"
    data: T | None = None
    request_id: str = ""

    @classmethod
    def success(cls, data: T, message: str = "success") -> "ApiResponse[T]":
        return cls(
            code=0,
            message=message,
            data=data,
            request_id=str(uuid.uuid4()),
        )

    @classmethod
    def error(cls, code: int, message: str, data: T | None = None) -> "ApiResponse[T]":
        return cls(
            code=code,
            message=message,
            data=data,
            request_id=str(uuid.uuid4()),
        )
