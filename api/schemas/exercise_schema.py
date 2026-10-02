from datetime import datetime

from pydantic import BaseModel


class ExerciseResponse(BaseModel):
    id: str
    admin_id: str
    teacher_id: str
    class_id: str
    course_id: str
    course_title: str
    file_path: str
    max_score: float
    description: str = ""
    due_date: datetime | None = None
    created_at: datetime


class ExerciseCreate(BaseModel):
    teacher_id: str | None = None
    class_id: str | None = None
    course_id: str
    course_title: str = ""
    file_path: str = ""
    max_score: float = 20


class TeacherExerciseCreate(BaseModel):
    course_id: str
    course_title: str = ""
    file_path: str = ""
    max_score: float = 20


class ExerciseUpdate(BaseModel):
    teacher_id: str | None = None
    class_id: str | None = None
    course_id: str | None = None
    course_title: str | None = None
    file_path: str | None = None
    max_score: float | None = None
