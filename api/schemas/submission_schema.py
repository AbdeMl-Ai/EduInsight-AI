from datetime import datetime

from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    student_id: str | None = None
    class_id: str | None = None
    exercise_id: str
    file_path: str


class SubmissionUpdate(BaseModel):
    submission_status: str | None = None
    file_path: str | None = None
    student_note: str | None = None
    score: float | None = None


class SubmissionResponse(BaseModel):
    id: str
    admin_id: str
    student_id: str
    class_id: str
    exercise_id: str
    submission_status: str
    file_path: str
    student_note: str = ""
    score: float | None = None
    submitted_at: datetime | None = None
    graded_at: datetime | None = None
