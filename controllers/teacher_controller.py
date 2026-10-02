class TeacherController:
    def __init__(self, teacher_service):
        self.teacher_service = teacher_service

    async def create_teacher(self, full_name, email, phone_number, admin_id, specialties=None, age=0, is_state_teacher=False):
        return await self.teacher_service.create_teacher(full_name, email, phone_number, admin_id, specialties, age, is_state_teacher)

    async def get_teacher(self, teacher_id, admin_id):
        return await self.teacher_service.get_teacher(teacher_id, admin_id)

    async def get_all_teachers(self, admin_id):
        return await self.teacher_service.get_all_teachers(admin_id)

    async def update_teacher(self, teacher_id, admin_id, **updates):
        return await self.teacher_service.update_teacher(teacher_id, admin_id, **updates)

    async def delete_teacher(self, teacher_id, admin_id):
        return await self.teacher_service.delete_teacher(teacher_id, admin_id)

    async def search_teacher(self, full_name, admin_id):
        return await self.teacher_service.search_teacher(full_name, admin_id)

    async def count_teachers(self, admin_id):
        return await self.teacher_service.count_teachers(admin_id)

    async def assign_teacher_to_classes(self, teacher_id, class_ids, admin_id):
        return await self.teacher_service.assign_to_classes(teacher_id, class_ids, admin_id)
