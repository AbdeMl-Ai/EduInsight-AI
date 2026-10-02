from datetime import date
from typing import Literal

from pydantic import BaseModel


class AttendanceRecord(BaseModel):
    student_id: str
    status: Literal["present", "absent"]


class AttendanceSaveRequest(BaseModel):
    class_id: str
    date: date
    records: list[AttendanceRecord]
