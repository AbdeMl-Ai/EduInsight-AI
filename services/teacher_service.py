from models.domain_models import Teacher
from utils.teacher_validation import TeacherValidator


class TeacherService:
    def __init__(self, teacher_repo):
        self.teacher_repo = teacher_repo

    async def create_teacher(self, full_name, email, phone_number, admin_id, specialties=None, age=0, is_state_teacher=False):
        if not admin_id:
            raise ValueError("admin_id is required")
        validator = TeacherValidator()
        validator.validate_name(full_name)
        validator.validate_email(email)
        if phone_number:
            validator.validate_phone_number(phone_number)
        document = Teacher(admin_id=admin_id, full_name=full_name.strip(), email=email.strip().lower(), phone_number=phone_number, specialties=specialties or [], age=age, is_state_teacher=is_state_teacher)
        return await self.teacher_repo.add_teacher(document, admin_id)

    async def get_teacher(self, teacher_id, admin_id):
        teacher = await self.teacher_repo.get_teacher(teacher_id, admin_id)
        if teacher is None:
            raise ValueError("Teacher not found.")
        return teacher

    async def get_all_teachers(self, admin_id):
        return await self.teacher_repo.get_all_teachers(admin_id)

    async def assign_to_classes(self, teacher_id, class_ids, admin_id):
        await self.get_teacher(teacher_id, admin_id)
        await self.validate_class_assignments(class_ids, admin_id=admin_id, teacher_id=teacher_id)
        return await self.teacher_repo.assign_teacher_to_classes(teacher_id, class_ids, admin_id)

    async def validate_class_assignments(self, class_ids, admin_id, teacher_id=None):
        if len(class_ids) != len(set(class_ids)):
            raise ValueError("Class IDs must be unique.")
        for class_id in class_ids:
            assigned = await self.teacher_repo.get_teacher_id_for_class(class_id, admin_id)
            if assigned is not None and assigned != teacher_id:
                raise ValueError(f"Class ID {class_id} is already assigned to another teacher.")

    async def update_teacher(self, teacher_id, admin_id, **updates):
        await self.get_teacher(teacher_id, admin_id)
        if "full_name" in updates:
            TeacherValidator.validate_name(updates["full_name"])
        if "email" in updates:
            TeacherValidator.validate_email(updates["email"])
            updates["email"] = updates["email"].strip().lower()
        if "phone_number" in updates and updates["phone_number"]:
            TeacherValidator.validate_phone_number(updates["phone_number"])
        await self.teacher_repo.update_teacher(teacher_id, admin_id, **updates)
        return "Teacher updated successfully."

    async def delete_teacher(self, teacher_id, admin_id):
        await self.get_teacher(teacher_id, admin_id)
        if not await self.teacher_repo.delete_teacher(teacher_id, admin_id):
            raise ValueError("Teacher not found.")
        return "Teacher deleted successfully."

    async def search_teacher(self, full_name, admin_id):
        TeacherValidator.validate_name(full_name)
        return await self.teacher_repo.search_teacher(full_name, admin_id)

    async def count_teachers(self, admin_id):
        return await self.teacher_repo.count_teacher(admin_id)
