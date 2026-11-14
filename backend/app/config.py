"""Safe, overridable development configuration."""
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_env: str
    origins: tuple[str, ...]
    log_level: str
    operator_key: str


def load_settings() -> Settings:
    origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    return Settings(
        app_env=os.getenv("APP_ENV", "local"),
        origins=tuple(item.strip() for item in origins.split(",") if item.strip()),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
        operator_key=os.getenv("OPERATOR_API_KEY", ""),
    )
