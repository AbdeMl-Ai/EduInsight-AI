from datetime import date
from typing import Literal

from pydantic import BaseModel


class AttendanceRecord(BaseModel):
    student_id: str
    status: Literal["present", "absent"]


class AttendanceSaveRequest(BaseModel):
    class_id: str
    session_id: str | None = None
    date: date
    records: list[AttendanceRecord]


class AttendanceStudentSummary(BaseModel):
    student_id: str
    student_name: str
    present_sessions: int
    absent_sessions: int
    total_sessions: int
    attendance_percentage: float


class AttendanceClassSummary(BaseModel):
    class_id: str
    total_sessions: int
    students: list[AttendanceStudentSummary]
