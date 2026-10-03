import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import (
    auth, profiles, signs, words, lessons, progress, practice, streaks, family, admin, recognition
)
from app.seed import seed_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Signalingo API — Secure Sign Language Learning and Recognition Platform Backend",
    version="1.0.0"
)

# Configure CORS securely - Allow only configured frontend origin
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profiles.router, prefix=settings.API_V1_STR)
app.include_router(signs.router, prefix=settings.API_V1_STR)
app.include_router(words.router, prefix=settings.API_V1_STR)
app.include_router(lessons.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(practice.router, prefix=settings.API_V1_STR)
app.include_router(streaks.router, prefix=settings.API_V1_STR)
app.include_router(family.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(recognition.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Auto-initialize SQLite database tables and seed initial content
    Base.metadata.create_all(bind=engine)
    try:
        seed_db()
    except Exception as e:
        print(f"Database startup seeding note: {e}")

@app.get("/")
def root():
    return {
        "project": "Signalingo",
        "description": "Secure Sign Language Learning and Recognition Platform",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }
