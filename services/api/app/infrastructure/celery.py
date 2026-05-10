from app.config import settings


def get_celery_config() -> dict:
    return {
        "broker_url": settings.celery_broker_url,
        "result_backend": settings.celery_result_backend,
    }
