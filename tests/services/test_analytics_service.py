import asyncio
from datetime import date

import pytest
from pydantic import ValidationError

from api.schemas.admin_schemas import StudentPaymentCreate
from services.analytics_service import AnalyticsService


class FakeAttendanceRepo:
    def __init__(self, daily_counts):
        self.daily_counts = daily_counts
        self.calls = []

    async def daily_present_counts(self, admin_id, month):
        self.calls.append((admin_id, month))
        return self.daily_counts


class FakeStudentPaymentRepo:
    def __init__(self, daily_totals):
        self.daily_totals = daily_totals
        self.calls = []

    async def daily_revenue(self, admin_id, month):
        self.calls.append((admin_id, month))
        return self.daily_totals


def test_revenue_attendance_returns_every_day_and_combines_daily_totals():
    attendance_repo = FakeAttendanceRepo({"2024-02-01": 4, "2024-02-29": 2})
    payment_repo = FakeStudentPaymentRepo({"2024-02-01": 300, "2024-02-29": 125.5})
    service = AnalyticsService(
        attendance_repo,
        payment_repo,
    )

    result = asyncio.run(service.revenue_attendance("admin-id", "2024-02"))

    assert result["month"] == "2024-02"
    assert len(result["days"]) == 29
    assert result["days"][0] == {
        "date": date(2024, 2, 1),
        "attendance": 4,
        "revenue": 300,
    }
    assert result["days"][-1] == {
        "date": date(2024, 2, 29),
        "attendance": 2,
        "revenue": 125.5,
    }
    assert result["total_attendance"] == 6
    assert result["total_revenue"] == 425.5
    assert attendance_repo.calls == [("admin-id", "2024-02")]
    assert payment_repo.calls == [("admin-id", "2024-02")]


def test_revenue_attendance_defaults_missing_days_to_zero():
    service = AnalyticsService(FakeAttendanceRepo({}), FakeStudentPaymentRepo({}))

    result = asyncio.run(service.revenue_attendance("admin-id", "2025-01"))

    assert len(result["days"]) == 31
    assert all(day["attendance"] == 0 and day["revenue"] == 0 for day in result["days"])
    assert result["total_attendance"] == 0
    assert result["total_revenue"] == 0


def test_student_payment_requires_month_to_match_payment_date():
    payment = StudentPaymentCreate(
        student_id="507f1f77bcf86cd799439011",
        amount=300,
        month="2024-02",
        payment_date=date(2024, 2, 29),
    )
    assert payment.amount == 300

    with pytest.raises(ValidationError, match="Payment month must match the payment date"):
        StudentPaymentCreate(
            student_id="507f1f77bcf86cd799439011",
            amount=300,
            month="2024-02",
            payment_date=date(2024, 3, 1),
        )
