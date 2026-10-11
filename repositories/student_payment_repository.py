from datetime import date
from datetime import datetime, timezone
import re

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

    async def get_paid_months(self, student_id: str, admin_id: str, year: int):
        student_id = self._id(student_id)
        student = await self.students.find_one({
            "_id": ObjectId(student_id),
            "admin_id": admin_id,
        })
        if student is None:
            raise ValueError("Student not found in your workspace.")

        cursor = self.collection.find(
            {
                "admin_id": admin_id,
                "student_id": student_id,
                "month": {"$regex": f"^{year}-"},
            },
            {"month": 1},
        )
        months = {
            int(document["month"].split("-")[1])
            async for document in cursor
        }
        return sorted(months)

    async def get_recently_paid_student_ids(
        self, admin_id: str, current_month: str, cutoff_date: date
    ) -> set[str]:
        cutoff = cutoff_date.isoformat()
        now = datetime.now(timezone.utc)
        today = now.date().isoformat()
        cursor = self.collection.find(
            {
                "admin_id": admin_id,
                "$or": [
                    {"month": current_month},
                    {"payment_date": {"$gte": cutoff, "$lte": today}},
                    {"payment_date": {"$gte": cutoff_date, "$lte": now}},
                ],
            },
            {"student_id": 1},
        )
        return {
            str(document["student_id"])
            async for document in cursor
            if document.get("student_id") is not None
        }

    async def get_payment_history(self, student_id: str, admin_id: str):
        student_id = self._id(student_id)
        student = await self.students.find_one({
            "_id": ObjectId(student_id),
            "admin_id": admin_id,
        })
        if student is None:
            raise ValueError("Student not found in your workspace.")

        cursor = self.collection.find(
            {
                "admin_id": admin_id,
                "student_id": student_id,
            },
            {
                "_id": 1,
                "student_id": 1,
                "amount": 1,
                "payment_date": 1,
                "month": 1,
            },
        ).sort("payment_date", -1)
        return [
            {
                "id": str(document["_id"]),
                "student_id": student_id,
                "student_name": student.get("full_name", ""),
                "amount": document["amount"],
                "payment_date": document["payment_date"],
                "month": document["month"],
            }
            async for document in cursor
        ]

    async def sync_paid_months(
        self,
        student_id: str,
        admin_id: str,
        year: int,
        paid_months: list[int],
        monthly_amount: float,
    ):
        student_id = self._id(student_id)
        student = await self.students.find_one({
            "_id": ObjectId(student_id),
            "admin_id": admin_id,
        })
        if student is None:
            raise ValueError("Student not found in your workspace.")

        requested = sorted(set(paid_months))
        existing = await self.get_paid_months(student_id, admin_id, year)
        existing_set = set(existing)
        requested_set = set(requested)

        if requested_set - existing_set and monthly_amount <= 0:
            raise ValueError("Student monthly fee must be greater than zero.")

        for month_number in sorted(requested_set - existing_set):
            month = f"{year}-{month_number:02d}"
            payment = StudentPayment(
                admin_id=admin_id,
                student_id=student_id,
                amount=monthly_amount,
                month=month,
                payment_date=date(year, month_number, 1),
            )
            await self.create(payment, admin_id)

        deselected = existing_set - requested_set
        if deselected:
            await self.collection.delete_many(
                {
                    "admin_id": admin_id,
                    "student_id": student_id,
                    "month": {"$in": [f"{year}-{month:02d}" for month in deselected]},
                }
            )

        return requested

    async def delete_month_payment(
        self, student_id: str, admin_id: str, month: str
    ):
        if re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", month) is None:
            raise ValueError("Payment month must use YYYY-MM format.")
        student_id = self._id(student_id)
        student = await self.students.find_one({
            "_id": ObjectId(student_id),
            "admin_id": admin_id,
        })
        if student is None:
            raise ValueError("Student not found in your workspace.")
        await self.collection.delete_many(
            {
                "admin_id": admin_id,
                "student_id": student_id,
                "month": month,
            }
        )

    async def daily_revenue(self, admin_id: str, month: str):
        cursor = self.collection.aggregate([
            {"$match": {
                "admin_id": admin_id,
                "payment_date": {"$regex": f"^{month}"},
            }},
            {"$group": {"_id": "$payment_date", "revenue": {"$sum": "$amount"}}},
        ])
        return {row["_id"]: row["revenue"] async for row in cursor}
