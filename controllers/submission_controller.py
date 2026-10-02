class SubmissionController:
    def __init__(self, submission_service):
        self.submission_service = submission_service

    async def create_submission(self, student_id, exercise_id, file_path, admin_id, student_note=""):
        return await self.submission_service.create_submission(student_id, exercise_id, file_path, admin_id, student_note)

    async def get_submission(self, submission_id, admin_id):
        return await self.submission_service.get_submission(submission_id, admin_id)

    async def get_all_submissions(self, admin_id):
        return await self.submission_service.get_all_submissions(admin_id)

    async def update_submission(self, submission_id, admin_id, **updates):
        return await self.submission_service.update_submission(submission_id, admin_id, **updates)

    async def delete_submission(self, submission_id, admin_id):
        return await self.submission_service.delete_submission(submission_id, admin_id)

    async def search_submission_by_student(self, student_id, admin_id):
        return await self.submission_service.search_submission_by_student(student_id, admin_id)

    async def search_submission_by_exercise(self, exercise_id, admin_id):
        return await self.submission_service.search_submission_by_exercise(exercise_id, admin_id)

    async def count_submissions(self, admin_id):
        return await self.submission_service.count_submissions(admin_id)

    async def get_submissions_by_student(self, student_id, admin_id):
        return await self.submission_service.get_submissions_by_student(student_id, admin_id)

    async def get_submissions_by_teacher(self, teacher_id, admin_id):
        return await self.submission_service.get_submissions_by_teacher(teacher_id, admin_id)

    async def grade_submission(self, student_id, exercise_id, score, teacher_id, admin_id):
        return await self.submission_service.grade_submission(student_id, exercise_id, score, teacher_id, admin_id)

    async def save_teacher_grade(self, student_id, exercise_id, score, teacher_id, admin_id):
        return await self.submission_service.save_teacher_grade(student_id, exercise_id, score, teacher_id, admin_id)
