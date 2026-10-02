import asyncio
from types import SimpleNamespace

from services.submission_service import SubmissionService


class FakeSubmissionRepo:
    async def add_submission(self, submission, _admin_id):
        return submission


class FakeStudentRepo:
    async def get_student(self, student_id, _admin_id):
        return SimpleNamespace(id=student_id, class_id="class-a", class_ids=["class-a"])


class FakeExerciseRepo:
    async def get_exercise(self, exercise_id, _admin_id):
        return SimpleNamespace(id=exercise_id, class_id="class-a")


def test_create_submission_persists_trimmed_student_note():
    service = SubmissionService(
        FakeSubmissionRepo(), FakeStudentRepo(), FakeExerciseRepo()
    )

    submission = asyncio.run(
        service.create_submission(
            "student-a", "exercise-a", "/uploads/submissions/answer.pdf", "admin-a", "  Please check question 2.  "
        )
    )

    assert submission.student_note == "Please check question 2."