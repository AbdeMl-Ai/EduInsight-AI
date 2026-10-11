import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace

from services.payment_service import PaymentService


class PaymentRepo:
    async def get(self, _user_id, _user_role, _admin_id):
        return None


class StudentRepo:
    async def get_student(self, _user_id, _admin_id):
        return SimpleNamespace(
            class_ids=["class-a", "class-a", "class-b"],
            class_id=None,
            date_enjoined=datetime(2026, 1, 1, tzinfo=timezone.utc),
        )


class ClassRepo:
    async def get_class(self, class_id, _admin_id):
        fees = {"class-a": 300.0, "class-b": 450.0}
        return SimpleNamespace(student_monthly_fee=fees[class_id])


def test_student_payment_summary_sums_unique_current_enrollments():
    service = PaymentService(
        PaymentRepo(),
        StudentRepo(),
        teacher_repo=None,
        class_repo=ClassRepo(),
        notification_service=None,
    )

    summary = asyncio.run(service.summary("student-id", "student", "admin-id"))

    assert summary["monthly_amount"] == 750.0
    assert summary["total_amount"] == 750.0
