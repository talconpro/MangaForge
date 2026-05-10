from app.config import settings


def get_redis_config() -> dict:
    return {
        "host": settings.redis_host,
        "port": settings.redis_port,
        "db": settings.redis_db,
    }
