from models.domain_models import Exercise
from utils.validation_exercise import ExerciseValidator
from utils.validators import validate_max_score


class ExerciseService:
    def __init__(
        self, exercise_repo, course_repo, teacher_repo=None, notification_service=None
    ):
        self.exercise_repo = exercise_repo
        self.course_repo = course_repo
        self.teacher_repo = teacher_repo
        self.notification_service = notification_service

    async def _notify_admin(self, teacher_id, resource_title, admin_id):
        if self.notification_service is not None:
            await self.notification_service.notify_admin_resource_added(
                teacher_id, "exercise", resource_title, admin_id
            )

    async def create_exercise(self, teacher_id, course_id, file_path, max_score, admin_id):
        validate_max_score(max_score)
        course = await self.course_repo.get_course(course_id, admin_id)
        if course is None:
            raise ValueError("Course not found in your workspace.")
        if course.teacher_id != teacher_id:
            raise ValueError("You can only create exercises for your own courses.")
        exercise = Exercise(admin_id=admin_id, teacher_id=teacher_id, class_id=course.class_id, course_id=course.id, course_title=course.title, file_path=file_path, max_score=max_score)
        created_exercise = await self.exercise_repo.add_exercise(exercise, admin_id)
        await self._notify_admin(teacher_id, created_exercise.course_title, admin_id)
        return created_exercise

    async def create_graded_work(self, teacher_id, class_id, title, description, max_score, due_date, admin_id, file_path="", course_id=None):
        validate_max_score(max_score)
        if course_id:
            course = await self.course_repo.get_course(course_id, admin_id)
            if course is None:
                raise ValueError("Course not found in your workspace.")
            if course.teacher_id != teacher_id:
                raise ValueError("You can only create exercises for your own courses.")
            if course.class_id != class_id:
                raise ValueError("Choose a course from the selected class.")
            course_id = course.id
        else:
            course_id = class_id
        exercise = Exercise(
            admin_id=admin_id,
            teacher_id=teacher_id,
            class_id=class_id,
            course_id=course_id,
            course_title=title,
            file_path=file_path,
            max_score=max_score,
            description=description,
            due_date=due_date,
        )
        created_exercise = await self.exercise_repo.add_graded_work(exercise, admin_id)
        await self._notify_admin(teacher_id, created_exercise.course_title, admin_id)
        return created_exercise

    async def get_exercise(self, exercise_id, admin_id):
        exercise = await self.exercise_repo.get_exercise(exercise_id, admin_id)
        if exercise is None:
            raise ValueError("Exercise not found.")
        return exercise

    async def get_all_exercises(self, admin_id):
        return await self.exercise_repo.get_all_exercises(admin_id)

    async def update_exercise(self, exercise_id, teacher_id, admin_id, **updates):
        exercise = await self.get_exercise(exercise_id, admin_id)
        if exercise.teacher_id != teacher_id:
            raise ValueError("You can only manage your own exercises.")
        if "max_score" in updates:
            validate_max_score(updates["max_score"])
        if "course_id" in updates:
            course = await self.course_repo.get_course(updates["course_id"], admin_id)
            if course is None or course.teacher_id != teacher_id:
                raise ValueError("Course not found in your workspace.")
            updates.update(class_id=course.class_id, teacher_id=teacher_id, course_title=course.title)
        if not await self.exercise_repo.update_exercise(exercise_id, admin_id, **updates):
            raise ValueError("Exercise not found or unchanged.")
        return "Exercise updated successfully."

    async def delete_exercise(self, exercise_id, teacher_id, admin_id):
        exercise = await self.get_exercise(exercise_id, admin_id)
        if exercise.teacher_id != teacher_id:
            raise ValueError("You can only manage your own exercises.")
        if not await self.exercise_repo.delete_exercise(exercise_id, admin_id):
            raise ValueError("Exercise not found.")
        return "Exercise deleted successfully."

    async def search_exercise(self, query, admin_id):
        if not query.strip():
            raise ValueError("Search query cannot be empty.")
        return await self.exercise_repo.search_exercise(query.strip(), admin_id)

    async def count_exercise(self, admin_id):
        return await self.exercise_repo.count_exercises(admin_id)

    async def get_exercises_by_level(self, level, admin_id):
        ExerciseValidator.validation_level(level)
        return await self.exercise_repo.get_exercises_by_level(level, admin_id)

    async def get_exercises_by_teacher(self, teacher_id, admin_id):
        return await self.exercise_repo.get_exercises_by_teacher(teacher_id, admin_id)
