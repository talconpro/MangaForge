from app.config import settings


def get_minio_config() -> dict:
    return {
        "endpoint": settings.minio_endpoint,
        "access_key": settings.minio_access_key,
        "secret_key": settings.minio_secret_key,
        "bucket": settings.minio_bucket,
        "secure": settings.minio_secure,
    }
