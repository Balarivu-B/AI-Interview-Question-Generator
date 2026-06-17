import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load env variables from backend/.env if it exists
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Interview Question Generator"
    API_V1_STR: str = "/api"
    
    # OpenAI config
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # Supabase config
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")  # Can be anon key or service role key
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "") # Optional secret to verify Supabase tokens locally
    
    # Local fallback config
    LOCAL_JWT_SECRET: str = os.getenv("LOCAL_JWT_SECRET", "super-secret-key-for-local-development-only-change-me")
    LOCAL_DB_FILE: str = "local_interview.db"
    
    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY)

    @property
    def is_openai_configured(self) -> bool:
        return bool(self.OPENAI_API_KEY)

settings = Settings()
