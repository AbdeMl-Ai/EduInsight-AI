from api.main import app
from api.routes.admin_router import router as admin_router
from fastapi.testclient import TestClient


def test_student_payment_endpoint_is_registered_on_admin_api():
    operation = app.openapi()["paths"]["/admin/payments/transactions"]

    assert "post" in operation
    assert set(operation) == {"post"}
    schema = operation["post"]["requestBody"]["content"]["application/json"]["schema"]
    assert schema["$ref"].endswith("/StudentPaymentCreate")


def test_student_payment_accepts_trailing_slash_without_redirect():
    payment_routes = {
        route.path: route.methods
        for route in admin_router.routes
        if route.path in {
            "/admin/payments/transactions",
            "/admin/payments/transactions/",
        }
    }

    assert payment_routes == {
        "/admin/payments/transactions": {"POST"},
        "/admin/payments/transactions/": {"POST"},
    }


def test_student_payment_post_route_and_cors_preflight_are_supported():
    client = TestClient(app)

    response = client.options(
        "/admin/payments/transactions",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )

    assert response.status_code == 200
    assert "POST" in response.headers["access-control-allow-methods"]
    assert client.post("/admin/payments/transactions").status_code != 405
