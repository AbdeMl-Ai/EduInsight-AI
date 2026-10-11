from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import asyncio

from api.routes import admin_router


class FakeAdminController:
    async def get_students(self, _admin_id):
        return [
            SimpleNamespace(
                id=f"student-{index}",
                admin_id="admin-a",
                parent_id=None,
                full_name=f"Student {index}",
                age=12,
                level_academy="1AC",
                date_enjoined=datetime.now(timezone.utc),
                email=f"student{index}@example.com",
                phone_number="",
                level="1AC",
                class_id=None,
                class_ids=[],
            )
            for index in range(4)
        ]


class FakePaymentRepo:
    async def get_for_users(self, user_ids, user_role, admin_id):
        assert user_ids == [f"student-{index}" for index in range(4)]
        assert user_role == "student"
        assert admin_id == "admin-a"
        now = datetime.now(timezone.utc)
        return [
            SimpleNamespace(
                user_id="student-0",
                last_payment_date=now - timedelta(days=10),
                paid_months=[],
            ),
            SimpleNamespace(
                user_id="student-1",
                last_payment_date=None,
                paid_months=[now.month],
            ),
            SimpleNamespace(
                user_id="student-2",
                last_payment_date=now - timedelta(days=31),
                paid_months=[],
            ),
        ]


def test_admin_student_list_includes_current_month_payment_status(monkeypatch):
    monkeypatch.setattr(admin_router, "admin_controller", FakeAdminController())
    monkeypatch.setattr(admin_router, "payment_repo", FakePaymentRepo())

    students = asyncio.run(
        admin_router.list_students(
            _admin=SimpleNamespace(id="admin-a", admin_id="admin-a")
        )
    )

    assert [
        student["has_paid_current_month"] for student in students
    ] == [True, True, False, False]
