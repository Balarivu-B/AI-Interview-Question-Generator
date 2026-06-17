import sys
import os

# Add the 'backend' folder to the Python path so app imports resolve correctly
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

# Import the FastAPI app instance from backend/app/main.py
from app.main import app
