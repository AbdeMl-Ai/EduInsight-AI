from datetime import datetime, timezone

from bson import ObjectId

from models.domain_models import Submission


class SubmissionRepo:
    def __init__(self, db, student_repo=None, exercise_repo=None):
        self.collection = db["submissions"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("submission/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_submission(self, submission: Submission, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = submission.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        for field in ("student_id", "class_id", "exercise_id"):
            payload[field] = self._id(payload[field])
        result = await self.collection.insert_one(payload)
        return Submission.model_validate({"_id": result.inserted_id, **payload})

    async def get_submission(self, submission_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one({"_id": ObjectId(self._id(submission_id)), "admin_id": admin_id})
        return Submission.model_validate(doc) if doc else None

    async def get_submission_by_student_and_exercise(self, student_id: str, exercise_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one({"admin_id": admin_id, "student_id": self._id(student_id), "exercise_id": self._id(exercise_id)})
        return Submission.model_validate(doc) if doc else None

    async def get_all_submissions(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id}).sort("submitted_at", -1)
        return [Submission.model_validate(doc) async for doc in cursor]

    async def update_submission(self, submission_id: str, admin_id: str, **updates):
        admin_id = self._tenant(admin_id)
        allowed = {"student_id", "class_id", "exercise_id", "submission_status", "file_path", "student_note", "score", "submitted_at", "graded_at"}
        updates = {k: self._id(v) if k in {"student_id", "class_id", "exercise_id"} else v for k, v in updates.items() if k in allowed}
        if not updates:
            return False
        result = await self.collection.update_one({"_id": ObjectId(self._id(submission_id)), "admin_id": admin_id}, {"$set": updates})
        return result.modified_count == 1

    async def upsert_grade(self, student_id: str, exercise_id: str, class_id: str, score: float, admin_id: str):
        query = {"admin_id": admin_id, "student_id": self._id(student_id), "exercise_id": self._id(exercise_id)}
        return await self.collection.update_one(
            query,
            {"$set": {"class_id": self._id(class_id), "score": score, "submission_status": "graded", "graded_at": datetime.now(timezone.utc)}},
            upsert=True,
        )

    async def delete_submission(self, submission_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one({"_id": ObjectId(self._id(submission_id)), "admin_id": admin_id})
        return result.deleted_count == 1

    async def search_submission_by_student(self, student_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "student_id": self._id(student_id)}).sort("submitted_at", -1)
        return [Submission.model_validate(doc) async for doc in cursor]

    async def search_submission_by_exercise(self, exercise_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find({"admin_id": admin_id, "exercise_id": self._id(exercise_id)}).sort("submitted_at", -1)
        return [Submission.model_validate(doc) async for doc in cursor]

    async def count_submissions(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.collection.count_documents({"admin_id": admin_id})

    async def get_submissions_by_student(self, student_id: str, admin_id: str):
        return await self.search_submission_by_student(student_id, admin_id)

    async def get_submissions_by_teacher(self, teacher_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        exercises = self.collection.database["exercises"].find({"admin_id": admin_id, "teacher_id": self._id(teacher_id)}, {"_id": 1})
        exercise_ids = [str(doc["_id"]) async for doc in exercises]
        cursor = self.collection.find({"admin_id": admin_id, "exercise_id": {"$in": exercise_ids}}).sort("submitted_at", -1)
        return [Submission.model_validate(doc) async for doc in cursor]
