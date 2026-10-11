import asyncio
from types import SimpleNamespace

import pytest

from services.notification_service import NotificationService


class FakeStudentRepo:
    def __init__(self, class_ids):
        self.student = SimpleNamespace(
            id="student-a",
            full_name="Student One",
            class_id=class_ids[0] if class_ids else None,
            class_ids=class_ids,
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

    assert result == {
        "message": "Message sent to student.",
        "recipient_name": "Student One",
    }
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
import asyncio
from types import SimpleNamespace

from services.notification_service import NotificationService


class FakeClassRepo:
    async def get_class(self, class_id, _admin_id):
        return SimpleNamespace(
            id=class_id,
            teacher_id="teacher-a",
            embedded_students=[
                {"student_id": "student-a"},
                {"student_id": "student-b"},
            ],
        )


class FakeResourceTeacherRepo:
    async def get_teacher(self, teacher_id, _admin_id):
        return SimpleNamespace(id=teacher_id, full_name="Teacher One")


class FakeStudentMessageClassRepo:
    async def get_class(self, class_id, _admin_id):
        if class_id == "enrolled-class":
            return SimpleNamespace(teacher_id="teacher-a")
        if class_id == "other-class":
            return SimpleNamespace(teacher_id="teacher-b")
        return None


class FakeStudentMessageTeacherRepo:
    async def get_teacher(self, teacher_id, _admin_id):
        return SimpleNamespace(id=teacher_id, full_name=f"Teacher {teacher_id}")


class FakeAdminRepo:
    async def get_admin(self, admin_id):
        return SimpleNamespace(id=admin_id, full_name="Center Admin")


class FakeStudentMessageStudentRepo:
    async def get_student(self, _student_id, _admin_id):
        return SimpleNamespace(
            id="student-a",
            full_name="Student One",
            class_ids=["enrolled-class"],
            class_id="enrolled-class",
        )


class RecordingMessageNotificationRepo:
    async def add_notification(self, notification, _admin_id):
        self.saved = notification
        return notification


def test_resource_added_notification_reaches_every_class_student():
    service = NotificationService(
        notification_repo=None,
        student_repo=None,
        teacher_repo=FakeResourceTeacherRepo(),
        class_repo=FakeClassRepo(),
    )
    notifications = []

    async def record_notification(*args):
        notifications.append(args)

    service._create = record_notification

    asyncio.run(
        service.notify_class_resource_added(
            "teacher-a",
            "class-a",
            "exercise",
            "Exercise 1",
            "admin-a",
            "/student/exercises?class_id=class-a&exercise_id=exercise-a",
        )
    )

    assert notifications == [
        (
            "admin-a",
            "teacher-a",
            "student-a",
            "student",
            "exercise_added",
            "Teacher Teacher One added a new exercise: Exercise 1",
            "/student/exercises?class_id=class-a&exercise_id=exercise-a",
            "Exercise 1",
        ),
        (
            "admin-a",
            "teacher-a",
            "student-b",
            "student",
            "exercise_added",
            "Teacher Teacher One added a new exercise: Exercise 1",
            "/student/exercises?class_id=class-a&exercise_id=exercise-a",
            "Exercise 1",
        ),
    ]


def test_student_message_teacher_list_is_limited_to_enrolled_classes():
    service = NotificationService(
        notification_repo=None,
        student_repo=FakeStudentMessageStudentRepo(),
        teacher_repo=FakeStudentMessageTeacherRepo(),
        class_repo=FakeStudentMessageClassRepo(),
    )

    teachers = asyncio.run(
        service.get_student_message_teachers("student-a", "admin-a")
    )

    assert [teacher.id for teacher in teachers] == ["teacher-a"]


def test_student_can_send_teacher_message_to_enrolled_class_teacher():
    notification_repo = RecordingMessageNotificationRepo()
    service = NotificationService(
        notification_repo=notification_repo,
        student_repo=FakeStudentMessageStudentRepo(),
        teacher_repo=FakeStudentMessageTeacherRepo(),
        class_repo=FakeStudentMessageClassRepo(),
    )

    result = asyncio.run(
        service.send_student_message(
            "student-a",
            "teacher-a",
            "teacher",
            "Please help with this exercise.",
            "admin-a",
        )
    )

    assert result == {"message": "Message sent to teacher."}
    assert notification_repo.saved.receiver_id == "teacher-a"
    assert notification_repo.saved.receiver_role == "teacher"
    assert notification_repo.saved.message == (
        "Student One: Please help with this exercise."
    )


def test_student_cannot_send_teacher_message_outside_enrolled_classes():
    service = NotificationService(
        notification_repo=RecordingMessageNotificationRepo(),
        student_repo=FakeStudentMessageStudentRepo(),
        teacher_repo=FakeStudentMessageTeacherRepo(),
        class_repo=FakeStudentMessageClassRepo(),
    )

    with pytest.raises(ValueError, match="enrolled classes"):
        asyncio.run(
            service.send_student_message(
                "student-a",
                "teacher-b",
                "teacher",
                "Hello.",
                "admin-a",
            )
        )


def test_student_can_send_message_to_admin_portal():
    notification_repo = RecordingMessageNotificationRepo()
    service = NotificationService(
        notification_repo=notification_repo,
        student_repo=FakeStudentMessageStudentRepo(),
        teacher_repo=FakeStudentMessageTeacherRepo(),
        admin_repo=FakeAdminRepo(),
    )

    result = asyncio.run(
        service.send_student_message(
            "student-a",
            None,
            "admin",
            "I need some help.",
            "admin-a",
        )
    )

    assert result == {"message": "Message sent to admin."}
    assert notification_repo.saved.receiver_id == "admin-a"
    assert notification_repo.saved.receiver_role == "admin"