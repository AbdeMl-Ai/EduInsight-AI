from bson import ObjectId

from models.domain_models import Course


class CourseRepo:
    def __init__(self, db):
        self.collection = db["courses"]
        self.classes = db["classes"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("course/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_course(self, course: Course, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = course.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        payload["teacher_id"] = self._id(payload["teacher_id"])
        payload["class_id"] = self._id(payload["class_id"])
        result = await self.collection.insert_one(payload)
        return Course.model_validate({"_id": result.inserted_id, **payload})

    async def get_course(self, course_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one({"_id": ObjectId(self._id(course_id)), "admin_id": admin_id})
        return Course.model_validate(doc) if doc else None

    async def get_all_courses(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id}).sort("title", 1)
        return [Course.model_validate(doc) async for doc in cursor]

    async def update_course(self, course_id: str, admin_id: str, **updates):
        admin_id = self._tenant(admin_id)
        allowed = {"teacher_id", "class_id", "title", "description"}
        updates = {k: self._id(v) if k in {"teacher_id", "class_id"} else v for k, v in updates.items() if k in allowed}
        if not updates:
            return False
        result = await self.collection.update_one({"_id": ObjectId(self._id(course_id)), "admin_id": admin_id}, {"$set": updates})
        return result.modified_count == 1

    async def delete_course(self, course_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one({"_id": ObjectId(self._id(course_id)), "admin_id": admin_id})
        return result.deleted_count == 1

    async def search_course(self, query: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "title": {"$regex": query, "$options": "i"}})
        return [Course.model_validate(doc) async for doc in cursor]

    async def count_courses(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.collection.count_documents({"admin_id": admin_id})

    async def get_courses_by_level(self, level: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        class_cursor = self.classes.find({"admin_id": admin_id, "class_level": {"$regex": f"^{level.strip()}$", "$options": "i"}}, {"_id": 1})
        class_ids = [str(doc["_id"]) async for doc in class_cursor]
        if not class_ids:
            return []
        cursor = self.collection.find({"admin_id": admin_id, "class_id": {"$in": class_ids}}).sort("created_at", -1)
        return [Course.model_validate(doc) async for doc in cursor]

    async def class_exists(self, class_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.classes.find_one({"_id": ObjectId(self._id(class_id)), "admin_id": admin_id})

    async def get_courses_by_class_id(self, class_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "class_id": self._id(class_id)}).sort("created_at", -1)
        return [Course.model_validate(doc) async for doc in cursor]

    async def get_courses_by_class_ids(self, class_ids: list[str], admin_id: str):
        admin_id = self._tenant(admin_id)
        values = list(dict.fromkeys(self._id(class_id) for class_id in class_ids))
        if not values:
            return []
        cursor = self.collection.find(
            {"admin_id": admin_id, "class_id": {"$in": values}}
        ).sort("created_at", -1)
        return [Course.model_validate(doc) async for doc in cursor]

    async def get_courses_by_teacher(self, teacher_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "teacher_id": self._id(teacher_id)}).sort("created_at", -1)
        return [Course.model_validate(doc) async for doc in cursor]
