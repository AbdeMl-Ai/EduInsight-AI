from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TeacherResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    teacher_id: str
    admin_id: str
    full_name: str
    email: str
    phone_number: str = ""
    age: int = 0
    is_state_teacher: bool = False
    specialties: list[str] = Field(default_factory=list)
    date_enjoined: datetime | None = None
    classes: list[dict] = Field(default_factory=list)
    active_classes: int = 0
    total_students: int = 0


class TeacherCreate(BaseModel):
    full_name: str
    email: str
    phone_number: str = ""
    age: int = 0
    is_state_teacher: bool = False
    specialties: list[str] = []

class TeacherUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone_number: str | None = None
    age: int | None = None
    is_state_teacher: bool | None = None
    specialties: list[str] | None = None


class TeacherGradedWorkCreate(BaseModel):
    class_id: str
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    max_score: float = Field(default=20, gt=0)
    due_date: datetime | None = None
