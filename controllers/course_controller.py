class CourseController:
    def __init__(self, course_service):
        self.course_service = course_service

    async def create_course(self, title, description, teacher_id, class_id, admin_id, content_url=""):
        return await self.course_service.create_course(title, description, teacher_id, class_id, admin_id, content_url)

    async def get_course(self, course_id, admin_id):
        return await self.course_service.get_course(course_id, admin_id)

    async def get_all_courses(self, admin_id):
        return await self.course_service.get_all_courses(admin_id)

    async def update_course(self, course_id, admin_id, teacher_id, **updates):
        return await self.course_service.update_course(course_id, admin_id, teacher_id, **updates)

    async def delete_course(self, course_id, admin_id, teacher_id):
        return await self.course_service.delete_course(course_id, admin_id, teacher_id)

    async def search_course(self, query, admin_id):
        return await self.course_service.search_course(query, admin_id)

    async def count_courses(self, admin_id):
        return await self.course_service.count_courses(admin_id)

    async def get_courses_by_level(self, level, admin_id):
        return await self.course_service.get_courses_by_level(level, admin_id)

    async def get_courses_by_class_id(self, class_id, admin_id):
        return await self.course_service.get_courses_by_class_id(class_id, admin_id)

    async def get_courses_by_class_ids(self, class_ids, admin_id):
        return await self.course_service.get_courses_by_class_ids(class_ids, admin_id)

    async def get_courses_by_teacher(self, teacher_id, admin_id):
        return await self.course_service.get_courses_by_teacher(teacher_id, admin_id)
