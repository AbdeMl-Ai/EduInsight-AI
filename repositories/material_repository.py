from bson import ObjectId


class MaterialRepo:
    def __init__(self, db):
        self.collection = db["learning_materials"]

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_material(self, owner_type: str, owner_id: str, file_path: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        if not ObjectId.is_valid(owner_id):
            raise ValueError("owner_id must be a valid ObjectId")
        doc = {"admin_id": admin_id, "owner_type": owner_type, "owner_id": str(ObjectId(owner_id)), "file_path": file_path}
        result = await self.collection.insert_one(doc)
        return {"_id": result.inserted_id, **doc}

    async def get_latest_path(self, owner_type: str, owner_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        if not ObjectId.is_valid(owner_id):
            return None
        doc = await self.collection.find_one({"admin_id": admin_id, "owner_type": owner_type, "owner_id": str(ObjectId(owner_id))}, sort=[("_id", -1)])
        return doc.get("file_path") if doc else None
