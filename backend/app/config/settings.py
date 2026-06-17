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
    
    @property
    def LOCAL_DB_FILE(self) -> str:
        db_name = "local_interview.db"
        if os.getenv("VERCEL"):
            tmp_db = os.path.join("/tmp", db_name)
            if not os.path.exists(tmp_db):
                import shutil
                # The bundled db should be in the backend root
                bundled_db = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), db_name)
                if os.path.exists(bundled_db):
                    try:
                        shutil.copy2(bundled_db, tmp_db)
                    except Exception as e:
                        print(f"Error copying SQLite database on Vercel: {e}")
                elif os.path.exists(db_name):
                    try:
                        shutil.copy2(db_name, tmp_db)
                    except Exception as e:
                        print(f"Error copying SQLite database on Vercel: {e}")
            return tmp_db
        return db_name

    
    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY)

    @property
    def is_openai_configured(self) -> bool:
        return bool(self.OPENAI_API_KEY)

settings = Settings()
