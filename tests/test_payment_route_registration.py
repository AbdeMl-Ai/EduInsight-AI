from api.main import app


def test_student_payment_endpoint_is_registered_on_admin_api():
    operation = app.openapi()["paths"]["/admin/payments/transactions"]

    assert "post" in operation
    schema = operation["post"]["requestBody"]["content"]["application/json"]["schema"]
    assert schema["$ref"].endswith("/StudentPaymentCreate")
