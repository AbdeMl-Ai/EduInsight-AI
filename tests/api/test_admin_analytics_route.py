from datetime import date
from types import SimpleNamespace

from fastapi.testclient import TestClient

from api.main import app
from api.routes import admin_router


def test_revenue_attendance_route_is_registered_and_returns_chart_data(monkeypatch):
    class FakeAnalyticsService:
        async def revenue_attendance(self, admin_id, month):
            assert admin_id == "admin-id"
            assert month == "2026-10"
            return {
                "month": month,
                "days": [
                    {
                        "date": date(2026, 10, 1),
                        "attendance": 3,
                        "revenue": 150.5,
                    }
                ],
                "total_attendance": 3,
                "total_revenue": 150.5,
            }

    monkeypatch.setattr(admin_router, "analytics_service", FakeAnalyticsService())
    monkeypatch.setitem(
        app.dependency_overrides,
        admin_router.get_current_admin,
        lambda: SimpleNamespace(admin_id="admin-id"),
    )

    response = TestClient(app).get(
        "/admin/analytics/revenue-attendance",
        params={"month": "2026-10"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "month": "2026-10",
        "days": [
            {
                "date": "2026-10-01",
                "attendance": 3,
                "revenue": 150.5,
            }
        ],
        "total_attendance": 3,
        "total_revenue": 150.5,
    }

    operation = app.openapi()["paths"][
        "/admin/analytics/revenue-attendance"
    ]["get"]
    month_parameter = next(
        parameter
        for parameter in operation["parameters"]
        if parameter["name"] == "month"
    )
    assert month_parameter["required"] is True
    assert month_parameter["schema"]["pattern"] == (
        r"^\d{4}-(0[1-9]|1[0-2])$"
    )
