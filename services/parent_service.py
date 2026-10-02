from models.domain_models import Parent


class ParentService:
    def __init__(self, parent_repo, student_repo):
        self.parent_repo = parent_repo
        self.student_repo = student_repo

    async def create_parent(self, full_name: str, email: str, contact_number: str, admin_id: str, student_ids=None):
        if not full_name.strip():
            raise ValueError("Parent name is required.")
        if "@" not in email or "." not in email:
            raise ValueError("A valid parent email is required.")
        if not contact_number.strip():
            raise ValueError("Parent contact number is required.")
        for student_id in student_ids or []:
            student = await self.student_repo.get_student(student_id, admin_id)
            if student is None:
                raise ValueError("Student not found in your workspace.")
            if student.parent_id is not None:
                raise ValueError("Student is already linked to a parent.")
        parent = Parent(admin_id=admin_id, full_name=full_name.strip(), email=email.strip().lower(), contact_number=contact_number.strip(), student_ids=student_ids or [])
        created = await self.parent_repo.add_parent(parent, admin_id)
        for student_id in created.student_ids:
            await self.student_repo.update_student(student_id, admin_id, parent_id=created.id)
        return created

    async def get_parent(self, parent_id: str, admin_id: str):
        parent = await self.parent_repo.get_parent(parent_id, admin_id)
        if parent is None:
            raise ValueError("Parent not found.")
        return parent

    async def get_all_parents(self, admin_id: str):
        return await self.parent_repo.get_all_parents(admin_id)

    async def update_parent(self, parent_id: str, admin_id: str, updates: dict):
        await self.get_parent(parent_id, admin_id)
        if "email" in updates:
            email = updates["email"].strip()
            if "@" not in email or "." not in email:
                raise ValueError("A valid parent email is required.")
            updates["email"] = email.lower()
        if "student_ids" in updates:
            for student_id in updates["student_ids"]:
                student = await self.student_repo.get_student(student_id, admin_id)
                if student is None:
                    raise ValueError("Student not found in your workspace.")
                if student.parent_id not in (None, parent_id):
                    raise ValueError("Student is already linked to another parent.")
        existing = await self.get_parent(parent_id, admin_id)
        if not await self.parent_repo.update_parent(parent_id, admin_id, **updates):
            raise ValueError("Parent not found or no fields changed.")
        updated = await self.get_parent(parent_id, admin_id)
        if "student_ids" in updates:
            removed = set(existing.student_ids) - set(updated.student_ids)
            added = set(updated.student_ids) - set(existing.student_ids)
            for student_id in removed:
                await self.student_repo.update_student(student_id, admin_id, parent_id=None)
            for student_id in added:
                await self.student_repo.update_student(student_id, admin_id, parent_id=updated.id)
        return updated

    async def add_student(self, parent_id: str, student_id: str, admin_id: str):
        await self.get_parent(parent_id, admin_id)
        student = await self.student_repo.get_student(student_id, admin_id)
        if student is None:
            raise ValueError("Student not found in your workspace.")
        if student.parent_id not in (None, parent_id):
            raise ValueError("Student is already linked to another parent.")
        if not await self.parent_repo.add_student(parent_id, student_id, admin_id):
            raise ValueError("Parent not found.")
        await self.student_repo.update_student(student_id, admin_id, parent_id=parent_id)
        return await self.get_parent(parent_id, admin_id)

    async def delete_parent(self, parent_id: str, admin_id: str):
        parent = await self.get_parent(parent_id, admin_id)
        if not await self.parent_repo.delete_parent(parent_id, admin_id):
            raise ValueError("Parent not found.")
        for student_id in parent.student_ids:
            await self.student_repo.update_student(student_id, admin_id, parent_id=None)
