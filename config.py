import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Based Multi-Modal Rockfall Risk Prediction and Early Warning System"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # SQLite Database
    DATABASE_URL: str = f"sqlite:///{(BASE_DIR / 'data' / 'rockfall_risk.db').as_posix()}"
    
    # GenAI Settings
    GENAI_API_KEY: str = ""
    GENAI_PROVIDER: str = "fallback"  # 'anthropic', 'openai', or 'fallback'
    GENAI_MODEL: str = "claude-3-haiku-20240307"
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-haiku-20240307"
    
    # Weather Settings
    OPENWEATHER_API_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return [item.rstrip("/") for item in json.loads(v)]
                except Exception:
                    pass
            return [item.strip().rstrip("/") for item in v.split(",") if item.strip()]
        elif isinstance(v, (list, set, tuple)):
            return [str(item).strip().rstrip("/") for item in v if item]
        return v
    
    # Paths
    BASE_DIR: Path = BASE_DIR
    DATA_DIR: Path = BASE_DIR / "data"
    MODELS_DIR: Path = BASE_DIR / "models"
    
    class Config:
        env_file = str(BASE_DIR / ".env")
        extra = "ignore"

settings = Settings()

# Ensure SQLite path resolves reliably across all execution working directories
if settings.DATABASE_URL.startswith("sqlite:///") and not settings.DATABASE_URL.startswith("sqlite:///:memory:"):
    db_path_str = settings.DATABASE_URL.replace("sqlite:///", "")
    db_path = Path(db_path_str)
    if not db_path.is_absolute():
        db_path = (BASE_DIR / db_path).resolve()
        settings.DATABASE_URL = f"sqlite:///{db_path.as_posix()}"
    db_path.parent.mkdir(parents=True, exist_ok=True)

# Ensure required directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
(settings.DATA_DIR / "raw").mkdir(parents=True, exist_ok=True)
(settings.DATA_DIR / "processed").mkdir(parents=True, exist_ok=True)
(settings.DATA_DIR / "synthetic").mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
