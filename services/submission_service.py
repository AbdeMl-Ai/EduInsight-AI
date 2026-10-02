from datetime import datetime, timezone

from models.domain_models import Submission
from utils.submission_validation import SubmissionValidator


class SubmissionService:
    def __init__(self, submission_repo, student_repo, exercise_repo):
        self.submission_repo = submission_repo
        self.student_repo = student_repo
        self.exercise_repo = exercise_repo

    async def create_submission(
        self, student_id, exercise_id, file_path, admin_id, student_note=""
    ):
        student = await self.student_repo.get_student(student_id, admin_id)
        if student is None:
            raise ValueError("Student not found in your workspace.")
        exercise = await self.exercise_repo.get_exercise(exercise_id, admin_id)
        if exercise is None:
            raise ValueError("Exercise not found in your workspace.")
        enrolled_class_ids = student.class_ids or ([student.class_id] if student.class_id else [])
        if exercise.class_id not in enrolled_class_ids:
            raise ValueError("Exercise is not assigned to this student.")
        submission = Submission(
            admin_id=admin_id,
            student_id=student.id,
            class_id=exercise.class_id,
            exercise_id=exercise.id,
            submission_status="submitted",
            file_path=file_path,
            student_note=student_note.strip(),
            submitted_at=datetime.now(timezone.utc),
        )
        return await self.submission_repo.add_submission(submission, admin_id)

    async def get_submission(self, submission_id, admin_id):
        item = await self.submission_repo.get_submission(
            submission_id, admin_id
        )
        if item is None:
            raise ValueError("Submission not found.")
        return item

    async def get_all_submissions(self, admin_id):
        return await self.submission_repo.get_all_submissions(admin_id)

    async def update_submission(self, submission_id, admin_id, **updates):
        submission = await self.get_submission(submission_id, admin_id)

        if "submission_status" in updates:
            SubmissionValidator.validation_status(updates["submission_status"])

        if "score" in updates and updates["score"] is not None:
            if updates["score"] < 0:
                raise ValueError("Score cannot be negative.")

            exercise = await self.exercise_repo.get_exercise(
                submission.exercise_id, admin_id
            )

            if exercise is None or updates["score"] > exercise.max_score:
                raise ValueError("Score cannot exceed the exercise maximum.")
            updates["graded_at"] = datetime.now(timezone.utc)

        updated = await self.submission_repo.update_submission(
            submission_id, admin_id, **updates
        )
        if not updated:
            raise ValueError("Submission not found or unchanged.")
        return "Submission updated successfully."

    async def delete_submission(self, submission_id, admin_id):
        await self.get_submission(submission_id, admin_id)
        deleted = await self.submission_repo.delete_submission(
            submission_id, admin_id
        )
        if not deleted:
            raise ValueError("Submission not found.")
        return "Submission deleted successfully."

    async def search_submission_by_student(self, student_id, admin_id):
        if await self.student_repo.get_student(student_id, admin_id) is None:
            raise ValueError("Student not found.")
        return await self.submission_repo.search_submission_by_student(
            student_id, admin_id
        )

    async def search_submission_by_exercise(self, exercise_id, admin_id):
        if await self.exercise_repo.get_exercise(
            exercise_id, admin_id
        ) is None:
            raise ValueError("Exercise not found.")
        return await self.submission_repo.search_submission_by_exercise(
            exercise_id, admin_id
        )

    async def count_submissions(self, admin_id):
        return await self.submission_repo.count_submissions(admin_id)

    async def get_submissions_by_student(self, student_id, admin_id):
        return await self.search_submission_by_student(student_id, admin_id)

    async def get_submissions_by_teacher(self, teacher_id, admin_id):
        submissions = await self.submission_repo.get_submissions_by_teacher(
            teacher_id, admin_id
        )
        if not submissions:
            raise ValueError("No submissions found.")
        return submissions

    async def grade_submission(
        self, student_id, exercise_id, score, teacher_id, admin_id
    ):
        exercise = await self.exercise_repo.get_exercise(
            exercise_id, admin_id
        )
        if exercise is None:
            raise ValueError("Exercise not found.")
        if exercise.teacher_id != teacher_id:
            raise ValueError(
                "You can only score submissions for your own exercises."
            )
        if score < 0 or score > exercise.max_score:
            raise ValueError(
                "Score must be between zero and the exercise maximum."
            )
        submission = (
            await self.submission_repo.get_submission_by_student_and_exercise(
                student_id, exercise_id, admin_id
            )
        )
        if submission is None:
            raise ValueError(
                "The student must submit the exercise before it can be scored."
            )
        return await self.update_submission(
            submission.id, admin_id, score=score
        )

    async def save_teacher_grade(self, student_id, exercise_id, score, teacher_id, admin_id):
        exercise = await self.exercise_repo.get_exercise(exercise_id, admin_id)
        if exercise is None:
            raise ValueError("Exercise not found.")
        if exercise.teacher_id != teacher_id:
            raise ValueError("You can only score submissions for your own exercises.")
        student = await self.student_repo.get_student(student_id, admin_id)
        enrolled_ids = student.class_ids or ([student.class_id] if student and student.class_id else []) if student else []
        if student is None or exercise.class_id not in enrolled_ids:
            raise ValueError("Student is not enrolled in this class.")
        if score < 0 or score > exercise.max_score:
            raise ValueError("Score must be between zero and the exercise maximum.")
        await self.submission_repo.upsert_grade(student_id, exercise_id, exercise.class_id, score, admin_id)
        return "Grade saved successfully."
