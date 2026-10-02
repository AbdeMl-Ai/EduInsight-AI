import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

load_dotenv()

from utils.submission_storage import UPLOAD_ROOT
from api.routes.student_router import router as student_router
from api.routes.teacher_router import router as teacher_router
from api.routes.course_router import router as course_router
from api.routes.exercise_router import router as exercise_router
from api.routes.notification_router import router as notification_router
from api.routes.submission_router import router as submission_router
from api.routes.auth_router import router as auth_router
from api.routes.admin_router import router as admin_router
from api.routes.attendance_router import router as attendance_router
from api.routes.parent_router import router as parent_router

from api.dependencies import close_database, connect_to_database


@asynccontextmanager
async def lifespan(_app):
    await connect_to_database()
    try:
        yield
    finally:
        close_database()


app = FastAPI(
    title = "EduAnalytics API",
    description="Backend API for EduAnalytics",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "change-this-secret-key"),
    same_site="lax",
    https_only=os.getenv("SESSION_HTTPS_ONLY", "false").lower() == "true",
)

UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_ROOT), name="uploads")

configured_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
)
allow_all_origins = configured_origins.strip() == "*"
allowed_origins = (
    ["*"]
    if allow_all_origins
    else [origin.strip().rstrip("/") for origin in configured_origins.split(",") if origin.strip()]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(teacher_router, prefix="/teachers")
app.include_router(teacher_router, prefix="/teacher")
app.include_router(course_router)
app.include_router(exercise_router)
app.include_router(notification_router)
app.include_router(submission_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(attendance_router)
app.include_router(parent_router)

@app.get("/")
def root():
    return {
        "message": "EduAnalytics API is running"
    }

