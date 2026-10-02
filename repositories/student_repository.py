from bson import ObjectId

from models.domain_models import Student


class StudentRepo:
    def __init__(self, db):
        self.collection = db["students"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("student/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    @staticmethod
    def _model(document):
        return Student.model_validate(document) if document else None

    async def add_student(self, student: Student, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = student.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        duplicate_terms = [{"email": payload["email"]}]
        if payload.get("phone_number"):
            duplicate_terms.append({"phone_number": payload["phone_number"]})
        if await self.collection.find_one({"admin_id": admin_id, "$or": duplicate_terms}):
            raise ValueError("A student with this email or phone number already exists.")
        result = await self.collection.insert_one(payload)
        return self._model({"_id": result.inserted_id, **payload})

    async def get_student(self, student_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        return self._model(await self.collection.find_one({"_id": ObjectId(self._id(student_id)), "admin_id": admin_id}))

    async def get_all_student(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        return [self._model(doc) async for doc in self.collection.find({"admin_id": admin_id}).sort("full_name", 1)]

    async def get_all_students_for_admin(self, admin_id: str):
        return await self.get_all_student(admin_id)

    async def get_students_by_level(self, level: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        pattern = {"$regex": f"^{level.strip()}$", "$options": "i"}
        cursor = self.collection.find({"admin_id": admin_id, "$or": [{"level_academy": pattern}, {"level": pattern}]})
        return [self._model(doc) async for doc in cursor]

    async def get_students_by_class_ids(self, class_ids: list[str], admin_id: str):
        admin_id = self._tenant(admin_id)
        if not class_ids:
            return []
        values = [self._id(value) for value in class_ids]
        mongo_values = values + [ObjectId(value) for value in values]
        admin_values = [admin_id]
        if ObjectId.is_valid(admin_id):
            admin_values.append(ObjectId(admin_id))
        cursor = self.collection.find({"admin_id": {"$in": admin_values}, "$or": [{"class_id": {"$in": mongo_values}}, {"class_ids": {"$in": mongo_values}}]}).sort("full_name", 1)
        return [self._model(doc) async for doc in cursor]

    async def get_students_by_class_id(self, class_id: str, admin_id: str):
        return await self.get_students_by_class_ids([class_id], admin_id)

    async def get_student_class_ids(self, student_id: str, admin_id: str):
        student = await self.get_student(student_id, admin_id)
        return student.class_ids or ([student.class_id] if student and student.class_id else []) if student else []

    async def set_student_class_ids(self, student_id: str, class_ids: list[str], admin_id: str):
        admin_id = self._tenant(admin_id)
        values = list(dict.fromkeys(self._id(value) for value in class_ids))
        result = await self.collection.update_one({"_id": ObjectId(self._id(student_id)), "admin_id": admin_id}, {"$set": {"class_ids": values, "class_id": values[0] if values else None}})
        return result.matched_count == 1

    async def belongs_to_admin(self, student_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.collection.find_one({"_id": ObjectId(self._id(student_id)), "admin_id": admin_id}, {"_id": 1}) is not None

    async def update_student(self, student_id: str, admin_id: str, **updates):
        admin_id = self._tenant(admin_id)
        allowed = {"full_name", "email", "phone_number", "age", "level", "level_academy", "parent_id", "class_id", "class_ids"}
        updates = {k: ([self._id(v) for v in value] if k == "class_ids" else self._id(value) if k in {"parent_id", "class_id"} and value is not None else value) for k, value in updates.items() if k in allowed}
        if "class_ids" in updates:
            updates["class_ids"] = list(dict.fromkeys(updates["class_ids"]))
            updates["class_id"] = updates["class_ids"][0] if updates["class_ids"] else None
        elif updates.get("class_id") is not None:
            updates["class_ids"] = [updates["class_id"]]
        if not updates:
            return False
        result = await self.collection.update_one({"_id": ObjectId(self._id(student_id)), "admin_id": admin_id}, {"$set": updates})
        return result.matched_count == 1

    async def delete_student(self, student_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one({"_id": ObjectId(self._id(student_id)), "admin_id": admin_id})
        return result.deleted_count == 1

    async def search_student(self, name: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        return [self._model(doc) async for doc in self.collection.find({"admin_id": admin_id, "full_name": {"$regex": name, "$options": "i"}})]

    async def count_students(self, admin_id: str):
        return await self.collection.count_documents({"admin_id": self._tenant(admin_id)})

    async def get_student_by_email(self, email: str):
        return self._model(await self.collection.find_one({"email": email}))

    async def get_student_by_phone(self, phone_number: str):
        return self._model(await self.collection.find_one({"phone_number": phone_number}))

    async def get_academic_report(self, student_id: str, admin_id: str):
        student = await self.get_student(student_id, admin_id)
        if student is None:
            return None
        class_ids = student.class_ids or ([student.class_id] if student.class_id else [])
        classes = self.collection.database["classes"]
        exercises = self.collection.database["exercises"]
        submissions = self.collection.database["submissions"]
        class_docs = [
            document async for document in classes.find(
                {"admin_id": admin_id, "_id": {"$in": [ObjectId(class_id) for class_id in class_ids]}}
            )
        ] if class_ids else []
        class_by_id = {str(document["_id"]): document for document in class_docs}
        exercise_docs = [
            document async for document in exercises.find(
                {"admin_id": admin_id, "class_id": {"$in": class_ids}}
            ).sort("created_at", 1)
        ] if class_ids else []
        exercise_rows = []
        for exercise in exercise_docs:
            submission = await submissions.find_one({
                "admin_id": admin_id,
                "student_id": student.id,
                "exercise_id": str(exercise["_id"]),
            })
            class_doc = class_by_id.get(str(exercise["class_id"]), {})
            exercise_rows.append({
                "exercise_id": str(exercise["_id"]),
                "exercise_name": exercise.get("course_title", "Exercise"),
                "subject": class_doc.get("subject", "Unknown"),
                "class_id": str(exercise["class_id"]),
                "score": submission.get("score") if submission else None,
                "max_score": exercise.get("max_score", 100),
                "created_at": exercise.get("created_at"),
            })
        return {
            "student_id": student.id,
            "name": student.full_name,
            "email": student.email,
            "class_info": None,
            "exercises_and_exams": exercise_rows,
        }
