import asyncio
from types import SimpleNamespace

from services.course_service import CourseService


class FakeTeacherRepo:
    async def get_teacher(self, teacher_id, _admin_id):
        return SimpleNamespace(id=teacher_id, full_name="Teacher One")


class FakeCourseRepo:
    async def class_exists(self, _class_id, _admin_id):
        return {"teacher_id": "teacher-a"}

    async def add_course(self, course, _admin_id):
        return course.model_copy(update={"id": "course-a"})


class FakeNotificationService:
    def __init__(self):
        self.notifications = []

    async def notify_admin_resource_added(
        self, teacher_id, resource_type, resource_title, admin_id
    ):
        self.notifications.append(
            (teacher_id, resource_type, resource_title, admin_id)
        )


def test_course_creation_notifies_the_admin():
    notifications = FakeNotificationService()
    service = CourseService(
        FakeCourseRepo(), FakeTeacherRepo(), notifications
    )

    course = asyncio.run(
        service.create_course(
            "Algebra", "", "teacher-a", "class-a", "admin-a"
        )
    )

    assert course.id == "course-a"
    assert notifications.notifications == [
        ("teacher-a", "course", "Algebra", "admin-a")
    ]
