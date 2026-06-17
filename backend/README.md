# FastAPI Backend - AI Interview Question Generator

This is the backend service for the AI Interview Question Generator. It handles database records, interacts with OpenAI API, validates parameters, generates PDF packs, and evaluates user answers.

## Local Configuration

All configuration is managed in `app/config/settings.py` and loaded from the `.env` file.

1. Copy `.env` if not present.
2. If `SUPABASE_URL` and `SUPABASE_KEY` are not set, the service automatically initializes a local SQLite database (`local_interview.db`).
3. If `OPENAI_API_KEY` is not set, the service generates realistic mock interview questions matching your chosen criteria.

### Default Local Login Credentials

When running the application in local SQLite fallback mode, the local database is automatically seeded on first launch with these test credentials:
- **Email / Username**: `admin@interview.ai`
- **Password**: `adminpassword`

## Running the Server

Activate the virtual environment and start the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The server runs on http://localhost:8000. Access interactive API documentation at http://localhost:8000/docs.
