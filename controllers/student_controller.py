class StudentController:
    def __init__(self, student_service):
        self.student_service = student_service

    async def create_student(self, full_name, email, phone_number, level, class_id=None, admin_id=None, age=0, parent_id=None, class_ids=None):
        return await self.student_service.create_student(full_name, email, phone_number, level, class_id, admin_id, age, parent_id, class_ids)

    async def get_student(self, student_id, admin_id):
        return await self.student_service.get_student(student_id, admin_id)

    async def get_all_students(self, admin_id):
        return await self.student_service.get_all_students(admin_id)

    async def get_students_by_level(self, level, admin_id):
        return await self.student_service.get_students_by_level(level, admin_id)

    async def get_students_by_class_ids(self, class_ids, admin_id):
        return await self.student_service.get_students_by_class_ids(class_ids, admin_id)

    async def get_my_exercises(self, student_id, class_id, admin_id):
        return await self.student_service.get_my_exercises(student_id, class_id, admin_id)

    async def update_student(self, student_id, admin_id, **updates):
        return await self.student_service.update_student(student_id, admin_id, **updates)

    async def delete_student(self, student_id, admin_id):
        return await self.student_service.delete_student(student_id, admin_id)

    async def search_student(self, full_name, admin_id):
        return await self.student_service.search_student(full_name, admin_id)

    async def count_students(self, admin_id):
        return await self.student_service.count_students(admin_id)

    async def get_my_profile(self, user):
        return await self.student_service.get_my_profile(user)

    async def update_my_profile(self, user, updates):
        return await self.student_service.update_my_profile(user, updates)
