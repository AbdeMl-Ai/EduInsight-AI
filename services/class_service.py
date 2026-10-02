from models.domain_models import ClassDocument


class ClassService:
    def __init__(self, class_repo, teacher_repo):
        self.class_repo = class_repo
        self.teacher_repo = teacher_repo

    async def _validate_teacher(self, teacher_id: str, admin_id: str) -> None:
        if not isinstance(teacher_id, str) or not teacher_id.strip():
            raise ValueError("A primary teacher is required for each class.")
        teacher = await self.teacher_repo.get_teacher(teacher_id, admin_id)
        if teacher is None:
            raise ValueError("Teacher not found in your workspace.")

    async def create_class(
        self, class_document: ClassDocument, admin_id: str
    ) -> ClassDocument:
        if not class_document.class_name.strip():
            raise ValueError("Class name is required.")
        if not class_document.subject.strip():
            raise ValueError("Class subject is required.")
        await self._validate_teacher(class_document.teacher_id, admin_id)
        return await self.class_repo.add_class(class_document, admin_id)

    async def get_class(self, class_id: str, admin_id: str) -> ClassDocument:
        class_document = await self.class_repo.get_class(class_id, admin_id)
        if class_document is None:
            raise ValueError("Class not found.")
        return class_document

    async def get_all_classes(self, admin_id: str) -> list[ClassDocument]:
        return await self.class_repo.get_all_classes(admin_id)

    async def search_classes(
        self, query: str, admin_id: str
    ) -> list[ClassDocument]:
        if not isinstance(query, str) or not query.strip():
            raise ValueError("Search query cannot be empty.")
        normalized_query = query.strip().casefold()
        classes = await self.class_repo.get_all_classes(admin_id)
        return [
            class_document
            for class_document in classes
            if normalized_query in class_document.class_name.casefold()
            or normalized_query in class_document.subject.casefold()
            or normalized_query in class_document.class_level.casefold()
        ]

    async def update_class(
        self, class_id: str, admin_id: str, updates: dict
    ) -> str:
        await self.get_class(class_id, admin_id)
        if "teacher_id" in updates:
            await self._validate_teacher(updates["teacher_id"], admin_id)
        if "class_name" in updates and not updates["class_name"].strip():
            raise ValueError("Class name is required.")
        if "subject" in updates and not updates["subject"].strip():
            raise ValueError("Class subject is required.")
        updated = await self.class_repo.update_class(class_id, admin_id, updates)
        if updated is None:
            raise ValueError("Class not found.")
        return "Class updated successfully."

    async def delete_class(self, class_id: str, admin_id: str) -> str:
        await self.get_class(class_id, admin_id)
        deleted = await self.class_repo.delete_class(class_id, admin_id)
        if not deleted:
            raise ValueError("Class not found.")
        return "Class deleted successfully."