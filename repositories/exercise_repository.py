from bson import ObjectId

from models.domain_models import Exercise


class ExerciseRepo:
    def __init__(self, db):
        self.collection = db["exercises"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("exercise/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_exercise(self, exercise: Exercise, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = exercise.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        for field in ("teacher_id", "class_id", "course_id"):
            payload[field] = self._id(payload[field])
        result = await self.collection.insert_one(payload)
        return Exercise.model_validate({"_id": result.inserted_id, **payload})

    async def add_graded_work(self, exercise: Exercise, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = exercise.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        for field in ("teacher_id", "class_id", "course_id"):
            payload[field] = self._id(payload[field])
        result = await self.collection.insert_one(payload)
        return Exercise.model_validate({"_id": result.inserted_id, **payload})

    async def get_exercise(self, exercise_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one({"_id": ObjectId(self._id(exercise_id)), "admin_id": admin_id})
        return Exercise.model_validate(doc) if doc else None

    async def get_all_exercises(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id}).sort("created_at", -1)
        return [Exercise.model_validate(doc) async for doc in cursor]

    async def update_exercise(self, exercise_id: str, admin_id: str, **updates):
        admin_id = self._tenant(admin_id)
        allowed = {"teacher_id", "class_id", "course_id", "course_title", "file_path", "max_score"}
        updates = {k: self._id(v) if k in {"teacher_id", "class_id", "course_id"} else v for k, v in updates.items() if k in allowed}
        if not updates:
            return False
        result = await self.collection.update_one({"_id": ObjectId(self._id(exercise_id)), "admin_id": admin_id}, {"$set": updates})
        return result.modified_count == 1

    async def delete_exercise(self, exercise_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one({"_id": ObjectId(self._id(exercise_id)), "admin_id": admin_id})
        return result.deleted_count == 1

    async def search_exercise(self, query: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "course_title": {"$regex": query, "$options": "i"}})
        return [Exercise.model_validate(doc) async for doc in cursor]

    async def count_exercises(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.collection.count_documents({"admin_id": admin_id})

    async def get_exercises_by_level(self, level: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "course_title": {"$regex": level, "$options": "i"}})
        return [Exercise.model_validate(doc) async for doc in cursor]

    async def _student_exercises(self, query, student_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, **query}).sort("created_at", -1)
        exercises = [Exercise.model_validate(doc) async for doc in cursor]
        for exercise in exercises:
            submission = await self.collection.database["submissions"].find_one({"admin_id": admin_id, "student_id": student_id, "exercise_id": exercise.id})
            exercise.score = submission.get("score") if submission else None
            exercise.submission_status = submission.get("submission_status", "pending") if submission else "pending"
        return exercises

    async def get_exercises_by_level_for_student(self, level: str, student_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        classes = self.collection.database["classes"].find({"admin_id": admin_id, "class_level": {"$regex": f"^{level.strip()}$", "$options": "i"}}, {"_id": 1})
        class_ids = [str(doc["_id"]) async for doc in classes]
        if not class_ids:
            return []
        return await self._student_exercises({"class_id": {"$in": class_ids}}, student_id, admin_id)

    async def get_exercises_by_class_id_for_student(self, class_id: str, student_id: str, admin_id: str):
        return await self._student_exercises({"class_id": self._id(class_id)}, student_id, admin_id)

    async def get_exercises_by_class_ids_for_student(self, class_ids: list[str], student_id: str, admin_id: str):
        values = list(dict.fromkeys(self._id(class_id) for class_id in class_ids))
        if not values:
            return []
        return await self._student_exercises({"class_id": {"$in": values}}, student_id, admin_id)

    async def get_exercises_by_teacher(self, teacher_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "teacher_id": self._id(teacher_id)}).sort("created_at", -1)
        return [Exercise.model_validate(doc) async for doc in cursor]
