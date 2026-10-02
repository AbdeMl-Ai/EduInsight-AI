import asyncio
from types import SimpleNamespace

import pytest

from services.notification_service import NotificationService


class FakeStudentRepo:
    def __init__(self, class_ids):
        self.student = SimpleNamespace(
            id="student-a", class_id=class_ids[0] if class_ids else None, class_ids=class_ids
        )

    async def get_student(self, _student_id, _admin_id):
        return self.student


class FakeTeacherRepo:
    async def get_teacher(self, _teacher_id, _admin_id):
        return SimpleNamespace(
            id="teacher-a", classes=[{"class_id": "class-a"}]
        )


class FakeNotificationRepo:
    async def add_notification(self, notification, _admin_id):
        return notification


class RecordingNotificationService(NotificationService):
    async def create_notification(
        self, message, teacher_id, receiver_id, admin_id, receiver_role="student", reference_link=None
    ):
        self.sent = (message, teacher_id, receiver_id, receiver_role)
        return self.sent


def test_teacher_can_message_student_in_assigned_class():
    service = RecordingNotificationService(
        FakeNotificationRepo(),
        FakeStudentRepo(["class-a"]),
        FakeTeacherRepo(),
    )

    result = asyncio.run(
        service.send_teacher_message(
            "teacher-a", "student", "student-a", "Check-in", "Hello", "admin-a"
        )
    )

    assert result == "Notification sent to student."
    assert service.sent == ("Check-in\n\nHello", "teacher-a", "student-a", "student")


def test_teacher_cannot_message_student_outside_assigned_classes():
    service = RecordingNotificationService(
        FakeNotificationRepo(),
        FakeStudentRepo(["class-b"]),
        FakeTeacherRepo(),
    )

    with pytest.raises(ValueError, match="assigned classes"):
        asyncio.run(
            service.send_teacher_message(
                "teacher-a", "student", "student-a", "Check-in", "Hello", "admin-a"
            )
        )