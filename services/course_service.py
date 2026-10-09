from models.domain_models import Course
from utils.validation_course import CourseValidator


class CourseService:
    def __init__(self, course_repo, teacher_repo, notification_service=None):
        self.course_repo = course_repo
        self.teacher_repo = teacher_repo
        self.notification_service = notification_service

    async def create_course(self, title, description, teacher_id, class_id, admin_id, content_url=""):
        CourseValidator.validate_course_name(title)
        teacher = await self.teacher_repo.get_teacher(teacher_id, admin_id)
        if teacher is None:
            raise ValueError("Teacher not found in your workspace.")
        class_doc = await self.course_repo.class_exists(class_id, admin_id)
        if class_doc is None:
            raise ValueError("Class not found in your workspace.")
        if class_doc.get("teacher_id") != teacher_id:
            raise ValueError("You can only create courses for your assigned classes.")
        course = Course(admin_id=admin_id, teacher_id=teacher.id, class_id=class_id, title=title.strip(), description=description, content_url=content_url.strip())
        created_course = await self.course_repo.add_course(course, admin_id)
        if self.notification_service is not None:
            await self.notification_service.notify_admin_resource_added(
                teacher.id, "course", created_course.title, admin_id
            )
        return created_course

    async def get_course(self, course_id, admin_id):
        course = await self.course_repo.get_course(course_id, admin_id)
        if course is None:
            raise ValueError("Course not found.")
        return course

    async def get_all_courses(self, admin_id):
        return await self.course_repo.get_all_courses(admin_id)

    async def update_course(self, course_id, admin_id, teacher_id, **updates):
        course = await self.get_course(course_id, admin_id)
        if course.teacher_id != teacher_id:
            raise ValueError("You can only manage your own courses.")
        if "teacher_id" in updates and await self.teacher_repo.get_teacher(updates["teacher_id"], admin_id) is None:
            raise ValueError("Teacher not found in your workspace.")
        if "teacher_id" in updates and updates["teacher_id"] != teacher_id:
            raise ValueError("You cannot transfer a course to another teacher.")
        if "class_id" in updates:
            class_doc = await self.course_repo.class_exists(updates["class_id"], admin_id)
            if class_doc is None or class_doc.get("teacher_id") != teacher_id:
                raise ValueError("Class not found in your assigned classes.")
        if "title" in updates:
            CourseValidator.validate_course_name(updates["title"])
        if not await self.course_repo.update_course(course_id, admin_id, **updates):
            raise ValueError("Course not found or unchanged.")
        return "Course updated successfully."

    async def delete_course(self, course_id, admin_id, teacher_id):
        course = await self.get_course(course_id, admin_id)
        if course.teacher_id != teacher_id:
            raise ValueError("You can only manage your own courses.")
        if not await self.course_repo.delete_course(course_id, admin_id):
            raise ValueError("Course not found.")
        return "Course deleted successfully."

    async def search_course(self, query, admin_id):
        if not query.strip():
            raise ValueError("Search query cannot be empty.")
        return await self.course_repo.search_course(query.strip(), admin_id)

    async def count_courses(self, admin_id):
        return await self.course_repo.count_courses(admin_id)

    async def get_courses_by_level(self, level, admin_id):
        return await self.course_repo.get_courses_by_level(level, admin_id)

    async def get_courses_by_class_id(self, class_id, admin_id):
        return await self.course_repo.get_courses_by_class_id(class_id, admin_id)

    async def get_courses_by_class_ids(self, class_ids, admin_id):
        return await self.course_repo.get_courses_by_class_ids(class_ids, admin_id)

    async def get_courses_by_teacher(self, teacher_id, admin_id):
        return await self.course_repo.get_courses_by_teacher(teacher_id, admin_id)
