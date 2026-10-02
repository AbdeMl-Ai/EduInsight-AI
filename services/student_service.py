from models.domain_models import Student
from utils.student_validation import StudentValidator


class StudentService:
    def __init__(self, student_repo, exercise_repo, parent_repo=None):
        self.student_repo = student_repo
        self.exercise_repo = exercise_repo
        self.parent_repo = parent_repo

    async def create_student(self, full_name, email, phone_number, level, class_id=None, admin_id=None, age=0, parent_id=None, class_ids=None):
        if not admin_id:
            raise ValueError("admin_id is required")
        validator = StudentValidator()
        validator.validate_name(full_name)
        validator.validate_email(email)
        if phone_number:
            validator.validate_phone_number(phone_number)
        level = validator.validate_level(level)
        if parent_id and (self.parent_repo is None or await self.parent_repo.get_parent(parent_id, admin_id) is None):
            raise ValueError("Parent not found in your workspace.")
        ids = list(dict.fromkeys(class_ids or ([class_id] if class_id else [])))
        if class_id and class_id not in ids:
            ids.insert(0, class_id)
        document = Student(admin_id=admin_id, parent_id=parent_id, full_name=full_name.strip(), age=age, level_academy=level, email=email.strip().lower(), phone_number=phone_number, level=level, class_id=ids[0] if ids else None, class_ids=ids)
        return await self.student_repo.add_student(document, admin_id)

    async def get_student(self, student_id, admin_id):
        student = await self.student_repo.get_student(student_id, admin_id)
        if student is None:
            raise ValueError("Student not found.")
        return student

    async def get_all_students(self, admin_id):
        students = await self.student_repo.get_all_student(admin_id)
        for student in students:
            student.class_ids = await self.student_repo.get_student_class_ids(student.id, admin_id)
        return students

    async def set_student_classes(self, student_id, class_ids, admin_id):
        await self.get_student(student_id, admin_id)
        return await self.student_repo.set_student_class_ids(student_id, class_ids, admin_id)

    async def get_students_by_level(self, level, admin_id):
        return await self.student_repo.get_students_by_level(level, admin_id)

    async def get_students_by_class_ids(self, class_ids, admin_id):
        return await self.student_repo.get_students_by_class_ids(class_ids, admin_id)

    async def get_my_exercises(self, student_id, class_id=None, admin_id=None):
        student = await self.get_student(student_id, admin_id)
        selected_classes = class_id if isinstance(class_id, list) else ([class_id] if class_id else [])
        selected_classes = selected_classes or student.class_ids or ([student.class_id] if student.class_id else [])
        if selected_classes:
            return await self.exercise_repo.get_exercises_by_class_ids_for_student(selected_classes, student_id, admin_id)
        return await self.exercise_repo.get_exercises_by_level_for_student(student.level_academy, student_id, admin_id)

    async def assign_to_class(self, student_id, class_id, admin_id):
        await self.get_student(student_id, admin_id)
        student = await self.get_student(student_id, admin_id)
        class_ids = list(dict.fromkeys([*(student.class_ids or []), class_id]))
        return await self.student_repo.set_student_class_ids(student_id, class_ids, admin_id)

    async def get_academic_report(self, student_id, admin_id):
        await self.get_student(student_id, admin_id)
        return await self.student_repo.get_academic_report(student_id, admin_id)

    async def update_student(self, student_id, admin_id, **updates):
        await self.get_student(student_id, admin_id)
        if "full_name" in updates:
            StudentValidator.validate_name(updates["full_name"])
        if "email" in updates:
            StudentValidator.validate_email(updates["email"])
            updates["email"] = updates["email"].strip().lower()
        if "phone_number" in updates and updates["phone_number"]:
            StudentValidator.validate_phone_number(updates["phone_number"])
        level = updates.get("level_academy", updates.get("level"))
        if level:
            StudentValidator.validate_level(level)
            updates.setdefault("level", level)
            updates.setdefault("level_academy", level)
        await self.student_repo.update_student(student_id, admin_id, **updates)
        return "Student updated successfully."

    async def delete_student(self, student_id, admin_id):
        await self.get_student(student_id, admin_id)
        if not await self.student_repo.delete_student(student_id, admin_id):
            raise ValueError("Student not found.")
        return "Student deleted successfully."

    async def search_student(self, full_name, admin_id):
        StudentValidator.validate_name(full_name)
        return await self.student_repo.search_student(full_name, admin_id)

    async def count_students(self, admin_id):
        return await self.student_repo.count_students(admin_id)

    async def get_my_profile(self, user):
        return {"student_id": user.id, "admin_id": user.admin_id, "parent_id": user.parent_id, "full_name": user.full_name, "age": user.age, "level_academy": user.level_academy, "date_enjoined": user.date_enjoined, "email": user.email, "phone_number": user.phone_number, "level": user.level, "class_id": user.class_id, "class_ids": user.class_ids}

    async def update_my_profile(self, user, updates):
        if not updates:
            raise ValueError("No data to update")
        await self.update_student(user.id, user.admin_id, **updates)
        return await self.get_my_profile(await self.get_student(user.id, user.admin_id))
