import asyncio
import calendar
from datetime import date


class AnalyticsService:
    def __init__(self, attendance_repo, student_payment_repo):
        self.attendance_repo = attendance_repo
        self.student_payment_repo = student_payment_repo

    async def revenue_attendance(self, admin_id: str, month: str):
        year, month_number = (int(part) for part in month.split("-"))
        days_in_month = calendar.monthrange(year, month_number)[1]
        attendance_by_date, revenue_by_date = await asyncio.gather(
            self.attendance_repo.daily_present_counts(admin_id, month),
            self.student_payment_repo.daily_revenue(admin_id, month),
        )
        days = [
            {
                "date": date(year, month_number, day),
                "attendance": attendance_by_date.get(f"{month}-{day:02d}", 0),
                "revenue": round(revenue_by_date.get(f"{month}-{day:02d}", 0), 2),
            }
            for day in range(1, days_in_month + 1)
        ]
        return {
            "month": month,
            "days": days,
            "total_attendance": sum(day["attendance"] for day in days),
            "total_revenue": round(sum(day["revenue"] for day in days), 2),
        }