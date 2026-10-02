from datetime import datetime

from pydantic import BaseModel


class CourseResponse(BaseModel):
    id: str
    admin_id: str
    teacher_id: str
    class_id: str
    title: str
    description: str
    content_url: str = ""
    created_at: datetime


class CourseCreate(BaseModel):
    teacher_id: str | None = None
    class_id: str
    title: str
    description: str = ""


class TeacherCourseCreate(BaseModel):
    class_id: str
    title: str
    description: str = ""
    content_url: str = ""


class CourseUpdate(BaseModel):
    teacher_id: str | None = None
    class_id: str | None = None
    title: str | None = None
    description: str | None = None
