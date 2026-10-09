import asyncio
from types import SimpleNamespace

import pytest

from controllers.exercise_controller import ExerciseController
from services.exercise_service import ExerciseService


class FakeCourseRepo:
    def __init__(self, course):
        self.course = course

    async def get_course(self, _course_id, _admin_id):
        return self.course


class FakeExerciseRepo:
    async def add_graded_work(self, exercise, _admin_id):
        return exercise


class FakeNotificationService:
    def __init__(self):
        self.notifications = []

    async def notify_admin_resource_added(
        self, teacher_id, resource_type, resource_title, admin_id
    ):
        self.notifications.append(
            (teacher_id, resource_type, resource_title, admin_id)
        )


class RecordingExerciseService:
    async def create_graded_work(self, *args):
        return args


def test_controller_forwards_selected_course_id():
    controller = ExerciseController(RecordingExerciseService())

    args = asyncio.run(
        controller.create_graded_work(
            "teacher-a",
            "class-a",
            "Exercise 1",
            "",
            20,
            None,
            "admin-a",
            "",
            "course-a",
        )
    )

    assert args[-1] == "course-a"


def test_graded_work_is_assigned_to_selected_course():
    course = SimpleNamespace(
        id="course-a",
        teacher_id="teacher-a",
        class_id="class-a",
    )
    notifications = FakeNotificationService()
    service = ExerciseService(
        FakeExerciseRepo(),
        FakeCourseRepo(course),
        notification_service=notifications,
    )

    exercise = asyncio.run(
        service.create_graded_work(
            "teacher-a",
            "class-a",
            "Exercise 1",
            "",
            20,
            None,
            "admin-a",
            course_id="course-a",
        )
    )

    assert exercise.class_id == "class-a"
    assert exercise.course_id == "course-a"
    assert exercise.course_title == "Exercise 1"
    assert notifications.notifications == [
        ("teacher-a", "exercise", "Exercise 1", "admin-a")
    ]


def test_graded_work_rejects_course_from_another_class():
    course = SimpleNamespace(
        id="course-b",
        teacher_id="teacher-a",
        class_id="class-b",
    )
    service = ExerciseService(FakeExerciseRepo(), FakeCourseRepo(course))

    with pytest.raises(ValueError, match="selected class"):
        asyncio.run(
            service.create_graded_work(
                "teacher-a",
                "class-a",
                "Exercise 1",
                "",
                20,
                None,
                "admin-a",
                course_id="course-b",
            )
        )