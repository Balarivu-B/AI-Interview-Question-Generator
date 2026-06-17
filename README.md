# AI Interview Question Generator

This is a premium, AI-powered web application that automatically generates interview questions, model answers, and hints. It is designed to assist candidates, recruiters, and HR professionals.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router, jsPDF.
- **Backend**: FastAPI, Uvicorn, Pydantic, Python-dotenv, ReportLab.
- **Database**: Supabase PostgreSQL (with a transparent local SQLite fallback).
- **Authentication**: Supabase Auth (with a local fallback session provider).
- **AI Engine**: OpenAI API (with a realistic, structured mock question fallback).

## Default Local Login Credentials

When running the application in local fallback mode (default startup without live Supabase API configurations), the local SQLite database is automatically seeded on first launch with the following test credentials:

- **Username / Email**: `admin@interview.ai`
- **Password**: `adminpassword`

*(You can also use the **Create Account** screen to register any other custom credentials locally.)*

---

## Getting Started

### Prerequisites

- Node.js (v18+) and npm
- Python (3.9+)

### Installation

#### 1. Backend Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the `.env` template and add your credentials (optional):
   - By default, the application runs in **local fallback mode** using a local SQLite database (`local_interview.db`) and realistic mock questions, allowing immediate testing without API keys.
   - To connect live APIs, configure `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` in `backend/.env`.

#### 2. Frontend Setup

1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install --legacy-peer-deps
   ```

---

## Running the Application

### 1. Run the Backend Server

From the `backend/` directory (with the virtual environment activated):
```bash
uvicorn app.main:app --reload --port 8000
```
The FastAPI documentation will be available at: http://localhost:8000/docs

### 2. Run the Frontend Development Server

From the `frontend/` directory:
```bash
npm run dev
```
Open your browser and navigate to http://localhost:5173 to start using the app.

---

## Live API Configurations & Supabase Schema

If you wish to configure a live database in Supabase, execute the SQL script in `schema.sql` inside the Supabase SQL editor.
Make sure your environment variables in `backend/.env` point to your live Supabase project.
