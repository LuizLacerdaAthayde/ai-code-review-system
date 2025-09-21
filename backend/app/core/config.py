from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str = Field("", alias="OPENAI_API_KEY")
    openai_base_url: str = Field("https://api.openai.com", alias="OPENAI_BASE_URL")
    openai_model: str = Field("gpt-4o-mini", alias="OPENAI_MODEL")

    mongodb_uri: str = Field(..., alias="MONGODB_URI")
    mongodb_db: str = Field("ai_code_review", alias="MONGODB_DB")
    frontend_url: str = Field("http://localhost:5173", alias="FRONTEND_URL")
    backend_url: str = Field("http://localhost:8000", alias="BACKEND_URL")


@lru_cache
def get_settings() -> Settings:
    return Settings()
