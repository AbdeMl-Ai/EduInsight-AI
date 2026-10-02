from datetime import date

from bson import ObjectId


class AttendanceRepo:
    def __init__(self, db):
        self.collection = db["attendance"]
        self.students = db["students"]

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def get_students_by_class(self, class_id, admin_id):
        admin_id = self._tenant(admin_id)
        class_id = str(ObjectId(class_id))
        cursor = self.students.find({"admin_id": admin_id, "$or": [{"class_id": class_id}, {"class_ids": class_id}]}).sort("full_name", 1)
        return [{"student_id": student["_id"].__str__(), "full_name": student.get("full_name", ""), "email": student.get("email", ""), "phone_number": student.get("phone_number", ""), "level": student.get("level_academy", ""), "class_id": class_id} async for student in cursor]

    async def save_attendance(self, class_id, attendance_date, records, admin_id):
        admin_id = self._tenant(admin_id)
        class_id = str(ObjectId(class_id))
        saved = []
        for record in records:
            student_id = str(ObjectId(record["student_id"]))
            await self.collection.update_one(
                {"admin_id": admin_id, "student_id": student_id, "class_id": class_id, "date": str(attendance_date)},
                {"$set": {"admin_id": admin_id, "student_id": student_id, "class_id": class_id, "date": str(attendance_date), "status": record["status"]}},
                upsert=True,
            )
            saved.append(student_id)
        return saved

    async def get_teacher_history(self, teacher_id, class_id=None, month=None, admin_id=None):
        admin_id = self._tenant(admin_id)
        classes_cursor = self.collection.database["classes"].find({"admin_id": admin_id, "teacher_id": str(ObjectId(teacher_id))}, {"_id": 1})
        class_ids = [str(item["_id"]) async for item in classes_cursor]
        query = {"admin_id": admin_id, "class_id": {"$in": class_ids}}
        if class_id is not None:
            query["class_id"] = str(ObjectId(class_id))
        if month is not None:
            query["date"] = {"$regex": f"^{month}"}
        return await self._rows(query)

    async def get_monthly_report(self, class_id, month, admin_id):
        return await self._rows({"admin_id": self._tenant(admin_id), "class_id": str(ObjectId(class_id)), "date": {"$regex": f"^{month}"}})

    async def _rows(self, query):
        cursor = self.collection.find(query).sort([("date", 1), ("student_id", 1)])
        rows = []
        async for item in cursor:
            student = await self.students.find_one({"_id": ObjectId(item["student_id"]), "admin_id": query["admin_id"]})
            rows.append({"student_id": item["student_id"], "student_name": student.get("full_name", "") if student else "", "class_id": item["class_id"], "date": item["date"], "status": item["status"]})
        return rows
