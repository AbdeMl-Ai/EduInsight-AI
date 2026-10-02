class ExerciseController:
    def __init__(self, exercise_service):
        self.exercise_service = exercise_service

    async def create_exercise(self, teacher_id, course_id, file_path, max_score, admin_id):
        return await self.exercise_service.create_exercise(teacher_id, course_id, file_path, max_score, admin_id)

    async def create_graded_work(self, teacher_id, class_id, title, description, max_score, due_date, admin_id, file_path="", course_id=None):
        return await self.exercise_service.create_graded_work(teacher_id, class_id, title, description, max_score, due_date, admin_id, file_path, course_id)

    async def get_exercise(self, exercise_id, admin_id):
        return await self.exercise_service.get_exercise(exercise_id, admin_id)

    async def get_all_exercises(self, admin_id):
        return await self.exercise_service.get_all_exercises(admin_id)

    async def update_exercise(self, exercise_id, teacher_id, admin_id, **updates):
        return await self.exercise_service.update_exercise(exercise_id, teacher_id, admin_id, **updates)

    async def delete_exercise(self, exercise_id, teacher_id, admin_id):
        return await self.exercise_service.delete_exercise(exercise_id, teacher_id, admin_id)

    async def search_exercise(self, query, admin_id):
        return await self.exercise_service.search_exercise(query, admin_id)

    async def count_exercise(self, admin_id):
        return await self.exercise_service.count_exercise(admin_id)

    async def get_exercises_by_level(self, level, admin_id):
        return await self.exercise_service.get_exercises_by_level(level, admin_id)

    async def get_exercises_by_teacher(self, teacher_id, admin_id):
        return await self.exercise_service.get_exercises_by_teacher(teacher_id, admin_id)
