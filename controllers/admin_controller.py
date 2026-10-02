class AdminController:
    def __init__(self, admin_service):
        self.admin_service = admin_service

    async def create_student(self, data, admin_id):
        return await self.admin_service.create_student(data, admin_id)

    async def setup_admin(self, full_name, email, phone_number):
        return await self.admin_service.setup_admin(full_name, email, phone_number)

    async def create_teacher(self, data, admin_id):
        return await self.admin_service.create_teacher(data, admin_id)

    async def update_student(self, student_id, updates, admin_id):
        return await self.admin_service.update_student(student_id, updates, admin_id)

    async def update_teacher(self, teacher_id, updates, admin_id):
        return await self.admin_service.update_teacher(teacher_id, updates, admin_id)

    async def get_student_report(self, student_id, admin_id):
        return await self.admin_service.get_student_report(student_id, admin_id)

    async def assert_student_access(self, student_id, admin_id):
        return await self.admin_service.assert_student_access(student_id, admin_id)

    async def assert_teacher_access(self, teacher_id, admin_id):
        return await self.admin_service.assert_teacher_access(teacher_id, admin_id)

    async def assert_class_access(self, class_id, admin_id):
        return await self.admin_service.class_service.get_class(class_id, admin_id)

    async def get_students(self, admin_id):
        students = await self.admin_service.student_service.student_repo.get_all_students_for_admin(admin_id)
        for student in students:
            student.class_ids = await self.admin_service.student_service.student_repo.get_student_class_ids(student.id, admin_id)
        return students

    async def get_teachers(self, admin_id):
        return await self.admin_service.teacher_service.teacher_repo.get_all_teachers_for_admin(admin_id)

    async def get_classes(self, admin_id):
        return await self.admin_service.class_service.get_all_classes(admin_id)

    async def create_class(self, class_document, admin_id):
        return await self.admin_service.class_service.create_class(class_document, admin_id)

    async def get_profile(self, admin_id):
        return await self.admin_service.get_profile(admin_id)

    async def update_profile(self, admin_id, updates):
        return await self.admin_service.update_profile(admin_id, updates)

    async def assign_student_to_class(self, student_id, class_id, admin_id):
        return await self.admin_service.assign_student_to_class(student_id, class_id, admin_id)

    async def assign_teacher_to_classes(self, teacher_id, class_ids, admin_id):
        return await self.admin_service.assign_teacher_to_classes(teacher_id, class_ids, admin_id)