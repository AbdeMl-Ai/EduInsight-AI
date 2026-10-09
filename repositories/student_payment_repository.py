from bson import ObjectId

from models.domain_models import StudentPayment


class StudentPaymentRepo:
    def __init__(self, db):
        self.collection = db["student_payments"]
        self.students = db["students"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("Student ID must be a valid ObjectId.")
        return str(ObjectId(value))

    async def create(self, payment: StudentPayment, admin_id: str):
        student_id = self._id(payment.student_id)
        student = await self.students.find_one({
            "_id": ObjectId(student_id),
            "admin_id": admin_id,
        })
        if student is None:
            raise ValueError("Student not found in your workspace.")

        document = payment.model_dump(exclude={"id"}, mode="json")
        document["student_id"] = student_id
        document["admin_id"] = admin_id
        result = await self.collection.insert_one(document)
        return {
            "id": str(result.inserted_id),
            "student_id": student_id,
            "student_name": student.get("full_name", ""),
            "amount": payment.amount,
            "payment_date": payment.payment_date,
            "month": payment.month,
        }

    async def daily_revenue(self, admin_id: str, month: str):
        cursor = self.collection.aggregate([
            {"$match": {
                "admin_id": admin_id,
                "payment_date": {"$regex": f"^{month}"},
            }},
            {"$group": {"_id": "$payment_date", "revenue": {"$sum": "$amount"}}},
        ])
        return {row["_id"]: row["revenue"] async for row in cursor}
