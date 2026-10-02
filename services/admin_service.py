import re

from models.domain_models import Admin
from utils.student_validation import StudentValidator


class AdminService:
    def __init__(self, admin_repo, student_service, teacher_service, class_service):
        self.admin_repo = admin_repo
        self.student_service = student_service
        self.teacher_service = teacher_service
        self.class_service = class_service

    async def create_admin(self, full_name, email, phone_number):
        if not full_name.strip() or not email.strip():
            raise ValueError("Admin name and email are required.")
        if phone_number:
            StudentValidator.validate_phone_number(phone_number)
        document = Admin(username=full_name.strip(), full_name=full_name.strip(), email=email.strip().lower(), phone_number=phone_number or None)
        return await self.admin_repo.add_admin(document)

    async def setup_admin(self, full_name, email, phone_number):
        email = email.strip().lower()
        existing = await self.admin_repo.get_admin_by_email(email)
        if existing is not None:
            updates = {
                "full_name": full_name.strip(),
                "username": full_name.strip(),
            }
            if phone_number:
                StudentValidator.validate_phone_number(phone_number)
                updates["phone_number"] = phone_number
            await self.admin_repo.update_admin(existing.id, **updates)
            updated = await self.admin_repo.get_admin(existing.id)
            return updated
        return await self.create_admin(full_name, email, phone_number)

    async def get_admin(self, admin_id):
        admin = await self.admin_repo.get_admin(admin_id)
        if admin is None:
            raise ValueError("Admin not found.")
        return admin

    async def get_profile(self, admin_id):
        admin = await self.get_admin(admin_id)
        return {"admin_id": admin.id, "full_name": admin.full_name, "email": admin.email, "phone_number": admin.phone_number}

    async def update_profile(self, admin_id, updates):
        if not updates:
            raise ValueError("No data to update.")
        if "email" in updates:
            updates["email"] = updates["email"].strip().lower()
        await self.get_admin(admin_id)
        await self.admin_repo.update_admin(admin_id, **updates)
        return await self.get_profile(admin_id)

    async def create_student(self, data, admin_id):
        class_ids = list(dict.fromkeys(data.class_ids or ([data.class_id] if data.class_id else [])))
        class_docs = [await self.class_service.get_class(cid, admin_id) for cid in class_ids]
        self._validate_one_class_per_subject(class_docs)
        level = data.level or (class_docs[0].class_level if class_docs else None)
        if level is None:
            raise ValueError("An academic level is required when no classes are selected.")
        student = await self.student_service.create_student(
            data.full_name,
            data.email,
            data.phone_number,
            level,
            admin_id=admin_id,
            age=data.age,
            parent_id=data.parent_id,
            class_ids=class_ids,
        )
        if class_ids:
            for class_id in class_ids:
                await self.class_service.class_repo.add_embedded_student(class_id, admin_id, student.id, "admin")
        return student

    async def create_teacher(self, data, admin_id):
        class_ids = getattr(data, "class_ids", None) or []
        for class_id in class_ids:
            await self.class_service.get_class(class_id, admin_id)
        await self.teacher_service.validate_class_assignments(class_ids, admin_id=admin_id)
        teacher = await self.teacher_service.create_teacher(data.full_name, data.email, data.phone_number, admin_id, getattr(data, "specialties", []), getattr(data, "age", 0), getattr(data, "is_state_teacher", False))
        if class_ids:
            await self.teacher_service.assign_to_classes(teacher.id, class_ids, admin_id)
        return teacher

    async def update_student(self, student_id, updates, admin_id):
        await self.assert_student_access(student_id, admin_id)
        existing = await self.student_service.get_student(student_id, admin_id)
        class_ids = updates.pop("class_ids", None)
        class_id = updates.pop("class_id", None)
        if class_id is not None:
            class_ids = list(dict.fromkeys([class_id, *(class_ids or [])]))
        if class_ids is not None:
            class_ids = list(dict.fromkeys(class_ids))
            class_docs = [
                await self.class_service.get_class(class_id, admin_id)
                for class_id in class_ids
            ]
            self._validate_one_class_per_subject(class_docs)
        result = await self.student_service.update_student(student_id, admin_id, **updates)
        if class_ids is not None:
            await self.student_service.set_student_classes(student_id, class_ids, admin_id)
            prior_ids = set(existing.class_ids or ([existing.class_id] if existing.class_id else []))
            next_ids = set(class_ids)
            for prior_id in prior_ids - next_ids:
                await self.class_service.class_repo.remove_embedded_student(prior_id, admin_id, student_id)
            for next_id in next_ids - prior_ids:
                await self.class_service.class_repo.add_embedded_student(next_id, admin_id, student_id, "admin")
        elif class_id is not None:
            await self.class_service.get_class(class_id, admin_id)
            await self.student_service.assign_to_class(student_id, class_id, admin_id)
            if existing.class_id and existing.class_id != class_id:
                await self.class_service.class_repo.remove_embedded_student(existing.class_id, admin_id, student_id)
            await self.class_service.class_repo.add_embedded_student(class_id, admin_id, student_id, "admin")
        return result

    async def update_teacher(self, teacher_id, updates, admin_id):
        await self.assert_teacher_access(teacher_id, admin_id)
        class_ids = updates.pop("class_ids", None)
        result = await self.teacher_service.update_teacher(teacher_id, admin_id, **updates)
        if class_ids is not None:
            for class_id in class_ids:
                await self.class_service.get_class(class_id, admin_id)
            await self.teacher_service.assign_to_classes(teacher_id, class_ids, admin_id)
        return result

    async def assign_student_to_class(self, student_id, class_id, admin_id):
        await self.assert_student_access(student_id, admin_id)
        student = await self.student_service.get_student(student_id, admin_id)
        selected_class = await self.class_service.get_class(class_id, admin_id)
        existing_ids = student.class_ids or ([student.class_id] if student.class_id else [])
        existing_classes = [
            await self.class_service.get_class(existing_id, admin_id)
            for existing_id in existing_ids
            if existing_id != class_id
        ]
        self._validate_one_class_per_subject([*existing_classes, selected_class])
        await self.student_service.assign_to_class(student_id, class_id, admin_id)
        await self.class_service.class_repo.add_embedded_student(class_id, admin_id, student_id, "admin")
        return "Student assigned to class successfully."

    @staticmethod
    def _validate_one_class_per_subject(class_docs):
        seen_combinations = set()
        for class_doc in class_docs:
            combination = (
                class_doc.class_level.strip().upper(),
                class_doc.subject.strip().upper(),
            )
            if combination in seen_combinations:
                raise ValueError("A student can only join one class per subject.")
            seen_combinations.add(combination)

    async def assign_teacher_to_classes(self, teacher_id, class_ids, admin_id):
        await self.assert_teacher_access(teacher_id, admin_id)
        for class_id in class_ids:
            await self.class_service.get_class(class_id, admin_id)
        await self.teacher_service.assign_to_classes(teacher_id, class_ids, admin_id)
        return "Teacher assigned to classes successfully."

    async def get_student_report(self, student_id, admin_id):
        return await self.student_service.get_academic_report(student_id, admin_id)

    async def assert_student_access(self, student_id, admin_id):
        if not await self.student_service.student_repo.belongs_to_admin(student_id, admin_id):
            raise ValueError("Student not found in your workspace.")

    async def assert_teacher_access(self, teacher_id, admin_id):
        if not await self.teacher_service.teacher_repo.belongs_to_admin(teacher_id, admin_id):
            raise ValueError("Teacher not found in your workspace.")

    async def assert_class_access(self, class_id, admin_id):
        await self.class_service.get_class(class_id, admin_id)

    @staticmethod
    def _level(value):
        return re.split(r"[\s_.·-]+", value.strip().upper(), maxsplit=1)[0]
