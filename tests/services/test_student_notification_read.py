import asyncio
from types import SimpleNamespace

import pytest

from services.notification_service import NotificationService


class FakeStudentRepo:
    async def get_student(self, student_id, admin_id):
        if (student_id, admin_id) == ("student-a", "admin-a"):
            return SimpleNamespace(id=student_id)
        return None


class RecordingNotificationRepo:
    async def mark_all_as_read(self, receiver_id, receiver_role, admin_id):
        self.args = (receiver_id, receiver_role, admin_id)
        return 2


def test_mark_student_notifications_as_read_uses_student_scope():
    notifications = RecordingNotificationRepo()
    service = NotificationService(
        notifications,
        FakeStudentRepo(),
        None,
    )

    updated_count = asyncio.run(
        service.mark_student_notifications_as_read("student-a", "admin-a")
    )

    assert updated_count == 2
    assert notifications.args == ("student-a", "student", "admin-a")


def test_mark_student_notifications_as_read_rejects_unknown_student():
    service = NotificationService(
        RecordingNotificationRepo(),
        FakeStudentRepo(),
        None,
    )

    with pytest.raises(ValueError, match="Student not found"):
        asyncio.run(
            service.mark_student_notifications_as_read("unknown", "admin-a")
        )


def test_mark_admin_notifications_as_read_uses_admin_recipient_scope():
    notifications = RecordingNotificationRepo()
    service = NotificationService(
        notifications,
        FakeStudentRepo(),
        None,
    )

    updated_count = asyncio.run(
        service.mark_admin_notifications_as_read("admin-a")
    )

    assert updated_count == 2
    assert notifications.args == ("admin-a", "admin", "admin-a")
