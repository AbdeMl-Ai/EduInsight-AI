from datetime import date, datetime, timezone
from typing import Annotated, Any

from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, PrivateAttr, field_validator, model_validator

from utils.academic_catalog import normalize_academic_level, normalize_subject


def _stringify_id(value: Any) -> Any:
    return str(value) if isinstance(value, ObjectId) else value


MongoId = Annotated[str, BeforeValidator(_stringify_id)]


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class MongoDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: MongoId | None = Field(default=None, alias="_id")
    _token_role: str | None = PrivateAttr(default=None)


class User(MongoDocument):
    email: str
    full_name: str
    role: str
    hashed_password: str | None = None
    phone_number: str | None = None
    account_status: str | None = None
    google_sub: str | None = None
    admin_id: MongoId | None = None
    created_at: datetime = Field(default_factory=_utc_now)


class Admin(MongoDocument):
    username: str = ""
    email: str
    role: str = "admin"
    full_name: str = ""
    phone_number: str | None = None
    created_at: datetime = Field(default_factory=_utc_now)

    @property
    def admin_id(self) -> str | None:
        return self.id


class Student(MongoDocument):
    admin_id: MongoId
    parent_id: MongoId | None = None
    full_name: str
    age: int = 0
    level_academy: str
    date_enjoined: datetime = Field(default_factory=_utc_now)
    email: str
    phone_number: str = ""
    level: str
    class_id: MongoId | None = None
    class_ids: list[MongoId] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def normalize_legacy_fields(cls, value: Any) -> Any:
        if not isinstance(value, dict):
            return value
        document = dict(value)
        if not document.get("level_academy") and document.get("level"):
            document["level_academy"] = document["level"]
        if not document.get("level") and document.get("level_academy"):
            document["level"] = document["level_academy"]

        class_ids = list(document.get("class_ids") or [])
        legacy_class_id = document.get("class_id")
        if legacy_class_id is not None and all(str(item) != str(legacy_class_id) for item in class_ids):
            class_ids.insert(0, legacy_class_id)
        unique_ids = []
        seen_ids = set()
        for class_id in class_ids:
            if str(class_id) not in seen_ids:
                unique_ids.append(class_id)
                seen_ids.add(str(class_id))
        document["class_ids"] = unique_ids
        document["class_id"] = unique_ids[0] if unique_ids else None
        return document

    @field_validator("level_academy", "level")
    @classmethod
    def validate_student_level(cls, value: str) -> str:
        return normalize_academic_level(value)

    @property
    def student_id(self) -> str | None:
        return self.id


class Parent(MongoDocument):
    admin_id: MongoId
    full_name: str
    email: str = ""
    contact_number: str = ""
    student_ids: list[MongoId] = Field(default_factory=list)
    date_enjoin: datetime = Field(default_factory=_utc_now)


class Teacher(MongoDocument):
    admin_id: MongoId
    full_name: str
    age: int = 0
    is_state_teacher: bool = False
    specialties: list[str] = Field(default_factory=list)
    date_enjoined: datetime = Field(default_factory=_utc_now)
    email: str
    phone_number: str = ""
    classes: list[dict[str, Any]] = Field(default_factory=list)

    @property
    def teacher_id(self) -> str | None:
        return self.id


class ClassDocument(MongoDocument):
    admin_id: MongoId
    teacher_id: MongoId
    class_name: str
    subject: str
    class_level: str
    center_rent_fee_per_student: float
    teacher_teaching_fee_per_student: float
    student_monthly_fee: float
    embedded_students: list[dict[str, str]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=_utc_now)

    @field_validator("class_level")
    @classmethod
    def validate_class_level(cls, value: str) -> str:
        return normalize_academic_level(value)

    @field_validator("subject")
    @classmethod
    def validate_class_subject(cls, value: str) -> str:
        return normalize_subject(value)

    @field_validator("embedded_students")
    @classmethod
    def validate_embedded_students(
        cls, students: list[dict[str, str]]
    ) -> list[dict[str, str]]:
        for student in students:
            if not {"student_id", "origin"}.issubset(student):
                raise ValueError("each embedded student requires student_id and origin")
        return students


class ScheduleSession(MongoDocument):
    admin_id: MongoId
    teacher_id: MongoId
    class_id: MongoId
    level: str
    day: str
    start_time: str
    end_time: str
    created_at: datetime = Field(default_factory=_utc_now)

    @field_validator("level")
    @classmethod
    def validate_schedule_level(cls, value: str) -> str:
        return normalize_academic_level(value)


class Course(MongoDocument):
    admin_id: MongoId
    teacher_id: MongoId
    class_id: MongoId
    title: str
    description: str
    content_url: str = ""
    created_at: datetime = Field(default_factory=_utc_now)


class Exercise(MongoDocument):
    admin_id: MongoId
    teacher_id: MongoId
    class_id: MongoId
    course_id: MongoId
    course_title: str
    file_path: str
    max_score: float
    description: str = ""
    due_date: datetime | None = None
    created_at: datetime = Field(default_factory=_utc_now)
    score: float | None = None
    submission_status: str = "pending"


class Submission(MongoDocument):
    admin_id: MongoId
    student_id: MongoId
    class_id: MongoId
    exercise_id: MongoId
    submission_status: str
    file_path: str = ""
    student_note: str = ""
    score: float | None = None
    submitted_at: datetime | None = None
    graded_at: datetime | None = None


class Notification(MongoDocument):
    admin_id: MongoId
    sender_id: MongoId | None = None
    receiver_id: MongoId
    receiver_role: str
    notification_type: str
    message: str
    reference_link: str | None = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=_utc_now)

    @property
    def notification_id(self) -> str | None:
        return self.id

    @property
    def title(self) -> str:
        return self.notification_type

class PaymentState(MongoDocument):
    admin_id: MongoId
    user_id: MongoId
    user_role: str
    paid_months: list[int] = Field(default_factory=list)
    last_payment_date: datetime | None = None
    created_at: datetime = Field(default_factory=_utc_now)

    @field_validator("paid_months")
    @classmethod
    def validate_paid_months(cls, value: list[int]) -> list[int]:
        if any(month < 1 or month > 12 for month in value):
            raise ValueError("Payment months must be between 1 and 12.")
        return sorted(set(value))


class StudentPayment(MongoDocument):
    admin_id: MongoId
    student_id: MongoId
    amount: float = Field(gt=0)
    payment_date: date
    month: str = Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")
    created_at: datetime = Field(default_factory=_utc_now)