from bson import ObjectId

from models.domain_models import Admin


class AdminRepo:
    def __init__(self, db):
        self.collection = db["admins"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("admin_id must be a valid MongoDB ObjectId")
        return ObjectId(value)

    async def add_admin(self, admin: Admin):
        payload = admin.model_dump(exclude={"id"})
        duplicate_terms = [{"email": payload["email"]}]
        if payload.get("phone_number"):
            duplicate_terms.append({"phone_number": payload["phone_number"]})
        if await self.collection.find_one({"$or": duplicate_terms}):
            raise ValueError("An admin with this email or phone number already exists.")
        result = await self.collection.insert_one(payload)
        return Admin.model_validate({"_id": result.inserted_id, **payload})

    async def get_admin(self, admin_id: str):
        doc = await self.collection.find_one({"_id": self._id(admin_id)})
        return Admin.model_validate(doc) if doc else None

    async def get_admin_by_email(self, email: str):
        doc = await self.collection.find_one({"email": email})
        return Admin.model_validate(doc) if doc else None

    async def get_admin_by_phone(self, phone_number: str):
        doc = await self.collection.find_one({"phone_number": phone_number})
        return Admin.model_validate(doc) if doc else None

    async def has_admins(self):
        return await self.collection.count_documents({}) > 0

    async def get_all_admins(self):
        return [Admin.model_validate(doc) async for doc in self.collection.find({})]

    async def update_admin(self, admin_id: str, **updates):
        allowed = {"full_name", "username", "email", "phone_number", "role"}
        updates = {key: value for key, value in updates.items() if key in allowed}
        if not updates:
            return False
        result = await self.collection.update_one({"_id": self._id(admin_id)}, {"$set": updates})
        return result.matched_count == 1

    async def create_organization(self, name=None):
        raise NotImplementedError("Organizations are not part of the v2 MongoDB schema.")
