from typing import Any

from bson import ObjectId

from models.domain_models import ClassDocument


class ClassRepo:
    def __init__(self, db):
        self.collection = db["classes"]

    @staticmethod
    def _class_object_id(class_id: str) -> ObjectId:
        if not ObjectId.is_valid(class_id):
            raise ValueError("class_id must be a valid MongoDB ObjectId")
        return ObjectId(class_id)

    @staticmethod
    def _require_admin_id(admin_id: str) -> str:
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_class(
        self, class_document: ClassDocument, admin_id: str
    ) -> ClassDocument:
        admin_id = self._require_admin_id(admin_id)
        document = class_document.model_copy(update={"admin_id": admin_id})
        payload = document.model_dump(exclude={"id"})
        result = await self.collection.insert_one(payload)
        return ClassDocument.model_validate({"_id": result.inserted_id, **payload})

    async def get_class(self, class_id: str, admin_id: str) -> ClassDocument | None:
        admin_id = self._require_admin_id(admin_id)
        document = await self.collection.find_one(
            {"_id": self._class_object_id(class_id), "admin_id": admin_id}
        )
        return ClassDocument.model_validate(document) if document else None

    async def get_all_classes(self, admin_id: str) -> list[ClassDocument]:
        admin_id = self._require_admin_id(admin_id)
        cursor = self.collection.find({"admin_id": admin_id}).sort("class_name", 1)
        return [ClassDocument.model_validate(document) async for document in cursor]

    async def add_embedded_student(
        self, class_id: str, admin_id: str, student_id: str, origin: str
    ) -> ClassDocument | None:
        admin_id = self._require_admin_id(admin_id)
        await self.collection.update_one(
            {"_id": self._class_object_id(class_id), "admin_id": admin_id},
            {
                "$addToSet": {
                    "embedded_students": {"student_id": student_id, "origin": origin}
                }
            },
        )
        return await self.get_class(class_id, admin_id)

    async def remove_embedded_student(
        self, class_id: str, admin_id: str, student_id: str
    ) -> bool:
        admin_id = self._require_admin_id(admin_id)
        result = await self.collection.update_one(
            {"_id": self._class_object_id(class_id), "admin_id": admin_id},
            {"$pull": {"embedded_students": {"student_id": student_id}}},
        )
        return result.matched_count == 1

    async def update_class(
        self, class_id: str, admin_id: str, updates: dict[str, Any]
    ) -> ClassDocument | None:
        admin_id = self._require_admin_id(admin_id)
        allowed_fields = set(ClassDocument.model_fields) - {
            "id",
            "admin_id",
            "created_at",
        }
        safe_updates = {key: value for key, value in updates.items() if key in allowed_fields}
        if safe_updates:
            await self.collection.update_one(
                {"_id": self._class_object_id(class_id), "admin_id": admin_id},
                {"$set": safe_updates},
            )
        return await self.get_class(class_id, admin_id)

    async def delete_class(self, class_id: str, admin_id: str) -> bool:
        admin_id = self._require_admin_id(admin_id)
        result = await self.collection.delete_one(
            {"_id": self._class_object_id(class_id), "admin_id": admin_id}
        )
        return result.deleted_count == 1