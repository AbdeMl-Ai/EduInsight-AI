from bson import ObjectId

from models.domain_models import Parent


class ParentRepo:
    def __init__(self, db):
        self.collection = db["parents"]

    @staticmethod
    def _id(value: str) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("parent_id must be a valid MongoDB ObjectId")
        return ObjectId(value)

    @staticmethod
    def _tenant(admin_id: str) -> str:
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    @staticmethod
    def _model(document):
        return Parent.model_validate(document) if document else None

    async def add_parent(self, parent: Parent, admin_id: str) -> Parent:
        admin_id = self._tenant(admin_id)
        payload = parent.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        result = await self.collection.insert_one(payload)
        return self._model({"_id": result.inserted_id, **payload})

    async def get_parent(self, parent_id: str, admin_id: str) -> Parent | None:
        admin_id = self._tenant(admin_id)
        document = await self.collection.find_one({"_id": self._id(parent_id), "admin_id": admin_id})
        return self._model(document)

    async def get_parent_by_phone(self, contact_number: str) -> Parent | None:
        return self._model(await self.collection.find_one({"contact_number": contact_number}))

    async def get_parent_by_email(self, email: str) -> Parent | None:
        return self._model(await self.collection.find_one({"email": email}))

    async def get_all_parents(self, admin_id: str) -> list[Parent]:
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id}).sort("full_name", 1)
        return [self._model(document) async for document in cursor]

    async def update_parent(self, parent_id: str, admin_id: str, **updates) -> bool:
        admin_id = self._tenant(admin_id)
        allowed = {"full_name", "email", "contact_number", "student_ids"}
        updates = {key: value for key, value in updates.items() if key in allowed}
        if not updates:
            return False
        result = await self.collection.update_one(
            {"_id": self._id(parent_id), "admin_id": admin_id}, {"$set": updates}
        )
        return result.modified_count == 1

    async def delete_parent(self, parent_id: str, admin_id: str) -> bool:
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one(
            {"_id": self._id(parent_id), "admin_id": admin_id}
        )
        return result.deleted_count == 1

    async def add_student(self, parent_id: str, student_id: str, admin_id: str) -> bool:
        admin_id = self._tenant(admin_id)
        result = await self.collection.update_one(
            {"_id": self._id(parent_id), "admin_id": admin_id},
            {"$addToSet": {"student_ids": student_id}},
        )
        return result.matched_count == 1
