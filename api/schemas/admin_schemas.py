from datetime import date, datetime
from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator, model_validator

from utils.academic_catalog import normalize_academic_level, normalize_subject


class ClassCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    teacher_id: str
    class_name: str
    subject: str
    class_level: str
    center_rent_fee_per_student: float
    teacher_teaching_fee_per_student: float
    student_monthly_fee: float

    @field_validator("class_level")
    @classmethod
    def validate_class_level(cls, value: str) -> str:
        return normalize_academic_level(value)

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, value: str) -> str:
        return normalize_subject(value)


class ClassUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    teacher_id: str | None = None
    class_name: str | None = None
    subject: str | None = None
    class_level: str | None = None
    center_rent_fee_per_student: float | None = None
    teacher_teaching_fee_per_student: float | None = None
    student_monthly_fee: float | None = None

    @field_validator("class_level")
    @classmethod
    def validate_class_level(cls, value: str | None) -> str | None:
        return normalize_academic_level(value) if value is not None else None

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, value: str | None) -> str | None:
        return normalize_subject(value) if value is not None else None


class ClassResponse(BaseModel):
    id: str
    admin_id: str
    teacher_id: str
    teacher_name: str = ""
    class_name: str
    subject: str
    class_level: str
    center_rent_fee_per_student: float
    teacher_teaching_fee_per_student: float
    student_monthly_fee: float


class AdminScheduleCreate(BaseModel):
    teacher_id: str
    class_id: str
    level: str
    day: Literal["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    start_time: str = Field(pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$")
    end_time: str = Field(pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$")

    @field_validator("level")
    @classmethod
    def validate_level(cls, value: str) -> str:
        return normalize_academic_level(value)

    @model_validator(mode="after")
    def validate_time_range(self):
        if self.end_time <= self.start_time:
            raise ValueError("End time must be later than start time.")
        return self


class AdminScheduleResponse(AdminScheduleCreate):
    id: str
    teacher_name: str
    class_name: str


class AdminStudentCreate(BaseModel):
    full_name: str
    email: str
    phone_number: str
    level: str | None = Field(default=None, validation_alias=AliasChoices("level_academy", "level"))
    age: int = 0
    parent_id: str | None = None
    class_id: str | None = None
    class_ids: list[str] = Field(default_factory=list)

    @field_validator("level")
    @classmethod
    def validate_level(cls, value: str | None) -> str | None:
        return normalize_academic_level(value) if value is not None else None

    @model_validator(mode="before")
    @classmethod
    def include_legacy_class_id(cls, value):
        if not isinstance(value, dict):
            return value
        data = dict(value)
        class_ids = list(data.get("class_ids") or [])
        class_id = data.get("class_id")
        if class_id is not None and all(str(item) != str(class_id) for item in class_ids):
            class_ids.insert(0, class_id)
        data["class_ids"] = list(dict.fromkeys(class_ids))
        return data


class AdminProfileResponse(BaseModel):
    admin_id: str
    full_name: str
    email: str
    phone_number: str | None = None


class AdminProfileUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None


class AdminSetupRequest(BaseModel):
    name: str
    email: str
    phone_number: str

class AdminUserCreate(BaseModel):
    name: str
    email: str
    role: str
    password: str


class AdminStudentUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone_number: str | None = None
    level: str | None = Field(default=None, validation_alias=AliasChoices("level_academy", "level"))
    class_id: str | None = None
    class_ids: list[str] | None = None
    parent_id: str | None = None

    @field_validator("level")
    @classmethod
    def validate_level(cls, value: str | None) -> str | None:
        return normalize_academic_level(value) if value is not None else None

    @model_validator(mode="before")
    @classmethod
    def include_legacy_class_id(cls, value):
        if not isinstance(value, dict):
            return value
        data = dict(value)
        class_id = data.get("class_id")
        class_ids = data.get("class_ids")
        if class_id is not None:
            class_ids = list(class_ids or [])
            if all(str(item) != str(class_id) for item in class_ids):
                class_ids.insert(0, class_id)
            data["class_ids"] = list(dict.fromkeys(class_ids))
        return data


class AdminStudentPasswordReset(BaseModel):
    password: str = Field(min_length=8, max_length=72)


class AdminTeacherCreate(BaseModel):
    full_name: str
    email: str
    phone_number: str
    class_ids: list[str] | None = None
    specialties: list[str] = Field(default_factory=list)
    age: int = 0
    is_state_teacher: bool = False


class AdminTeacherUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone_number: str | None = None
    class_ids: list[str] | None = None
    specialties: list[str] | None = None


class TeacherClassAssignment(BaseModel):
    class_ids: list[str]


class ClassInfo(BaseModel):
    class_id: str
    name: str
    academic_year: str


class ExerciseGradeReport(BaseModel):
    exercise_id: str
    exercise_name: str
    subject: str
    class_id: str
    score: float | None
    max_score: float
    created_at: datetime | None = None


class AdminStudentReportResponse(BaseModel):
    student_id: str
    name: str
    email: str
    class_info: ClassInfo | None
    exercises_and_exams: list[ExerciseGradeReport]

class PaymentUpdate(BaseModel):
    user_role: Literal["student", "teacher"]
    paid_months: list[int] = Field(default_factory=list)

class PaymentSummary(BaseModel):
    user_id: str
    user_role: Literal["student", "teacher"]
    paid_months: list[int]
    last_payment_date: str | None
    monthly_amount: float
    total_amount: float
    base_date: str
    due: bool


class StudentPaymentCreate(BaseModel):
    student_id: str
    amount: float = Field(gt=0, allow_inf_nan=False)
    month: str = Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")
    payment_date: date = Field(default_factory=date.today)

    @model_validator(mode="after")
    def validate_payment_month(self):
        if self.payment_date.strftime("%Y-%m") != self.month:
            raise ValueError("Payment month must match the payment date.")
        return self


class StudentPaymentResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    amount: float
    payment_date: date
    month: str


class RevenueAttendanceDay(BaseModel):
    date: date
    attendance: int
    revenue: float


class RevenueAttendanceResponse(BaseModel):
    month: str
    days: list[RevenueAttendanceDay]
    total_attendance: int
    total_revenue: float