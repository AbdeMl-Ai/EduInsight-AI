from datetime import datetime

from pydantic import BaseModel, Field, model_validator


class NotificationResponse(BaseModel):
    id: str
    admin_id: str
    sender_id: str | None = None
    receiver_id: str
    receiver_role: str
    notification_type: str
    message: str
    reference_link: str | None = None
    is_read: bool
    created_at: datetime
    notification_id: str | None = None
    title: str | None = None
    teacher_id: str | None = None
    teacher_name: str | None = None
    sender_name: str | None = None


class AdminNotificationCreate(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    class_id: str | None = None
    student_id: str | None = None
    teacher_id: str | None = None

    @model_validator(mode="after")
    def validate_recipient(self):
        recipients = [self.student_id, self.class_id, self.teacher_id]
        if sum(recipient is not None for recipient in recipients) != 1:
            raise ValueError("Provide exactly one student_id, class_id, or teacher_id.")
        return self


class NotificationCreate(BaseModel):
    receiver_id: str
    receiver_role: str = "student"
    message: str
    reference_link: str | None = None


class TeacherNotificationCreate(BaseModel):
    message: str
    class_id: str | None = None
    student_id: str | None = None
    reference_link: str | None = None


class TeacherMessageCreate(BaseModel):
    target_type: str
    target_id: str
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class NotificationUpdate(BaseModel):
    message: str | None = None
    reference_link: str | None = None
    is_read: bool | None = None
