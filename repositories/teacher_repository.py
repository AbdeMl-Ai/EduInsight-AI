from bson import ObjectId

from models.domain_models import Teacher


class TeacherRepo:
    def __init__(self, db):
        self.collection = db["teachers"]
        self.classes = db["classes"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("teacher/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_teacher(self, teacher: Teacher, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = teacher.model_dump(exclude={"id", "classes"})
        payload["admin_id"] = admin_id
        duplicate_terms = [{"email": payload["email"]}]
        if payload.get("phone_number"):
            duplicate_terms.append({"phone_number": payload["phone_number"]})
        if await self.collection.find_one({"admin_id": admin_id, "$or": duplicate_terms}):
            raise ValueError("A teacher with this email or phone number already exists.")
        result = await self.collection.insert_one(payload)
        return Teacher.model_validate({"_id": result.inserted_id, **payload})

    async def _with_classes(self, teacher, admin_id):
        if teacher is None:
            return None
        teacher_ids = [teacher.id]
        if ObjectId.is_valid(teacher.id):
            teacher_ids.append(ObjectId(teacher.id))
        admin_ids = [admin_id]
        if ObjectId.is_valid(admin_id):
            admin_ids.append(ObjectId(admin_id))
        cursor = self.classes.find({"admin_id": {"$in": admin_ids}, "teacher_id": {"$in": teacher_ids}})
        teacher.classes = [{"class_id": str(doc["_id"]), "name": doc.get("class_name", ""), "academic_year": doc.get("class_level", ""), "subject": doc.get("subject", "")} async for doc in cursor]
        return teacher

    async def get_teacher(self, teacher_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one({"_id": ObjectId(self._id(teacher_id)), "admin_id": admin_id})
        return await self._with_classes(Teacher.model_validate(doc) if doc else None, admin_id)

    async def get_all_teachers(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        docs = [Teacher.model_validate(doc) async for doc in self.collection.find({"admin_id": admin_id}).sort("full_name", 1)]
        for teacher in docs:
            await self._with_classes(teacher, admin_id)
        return docs

    async def get_all_teachers_for_admin(self, admin_id: str):
        return await self.get_all_teachers(admin_id)

    async def get_teacher_id_for_class(self, class_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.classes.find_one({"_id": ObjectId(self._id(class_id)), "admin_id": admin_id}, {"teacher_id": 1})
        return doc.get("teacher_id") if doc else None

    async def update_teacher(self, teacher_id: str, admin_id: str, **updates):
        admin_id = self._tenant(admin_id)
        allowed = {"full_name", "email", "phone_number", "age", "is_state_teacher", "specialties"}
        updates = {k: v for k, v in updates.items() if k in allowed}
        if not updates:
            return False
        result = await self.collection.update_one({"_id": ObjectId(self._id(teacher_id)), "admin_id": admin_id}, {"$set": updates})
        return result.matched_count == 1

    async def assign_teacher_to_classes(self, teacher_id: str, class_ids: list[str], admin_id: str):
        admin_id = self._tenant(admin_id)
        teacher = await self.get_teacher(teacher_id, admin_id)
        if teacher is None:
            return False
        ids = [ObjectId(self._id(value)) for value in class_ids]
        await self.classes.update_many({"_id": {"$in": ids}, "admin_id": admin_id}, {"$set": {"teacher_id": teacher.id}})
        return True

    async def delete_teacher(self, teacher_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one({"_id": ObjectId(self._id(teacher_id)), "admin_id": admin_id})
        return result.deleted_count == 1

    async def belongs_to_admin(self, teacher_id: str, admin_id: str):
        return await self.get_teacher(teacher_id, admin_id) is not None

    async def search_teacher(self, full_name: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        docs = [Teacher.model_validate(doc) async for doc in self.collection.find({"admin_id": admin_id, "full_name": {"$regex": full_name, "$options": "i"}}).sort("full_name", 1)]
        for teacher in docs:
            await self._with_classes(teacher, admin_id)
        return docs

    async def count_teacher(self, admin_id: str):
        return await self.collection.count_documents({"admin_id": self._tenant(admin_id)})

    async def get_teacher_by_email(self, email: str):
        doc = await self.collection.find_one({"email": email})
        return Teacher.model_validate(doc) if doc else None

    async def get_teacher_by_phone(self, phone_number: str):
        doc = await self.collection.find_one({"phone_number": phone_number})
        return Teacher.model_validate(doc) if doc else None
