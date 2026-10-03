import asyncio
from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from bson import ObjectId

from api.routes import auth_router
from api.schemas.auth_schema import RegistrationRequest
from repositories.user_repository import UserRepo


class FakeUserRepo:
    def __init__(self, existing=None):
        self.existing = existing
        self.created = None

    async def get_by_email(self, email):
        assert email == "person@example.com"
        return self.existing

    async def create(self, **user_data):
        self.created = user_data
        return SimpleNamespace(email=user_data["email"])


def registration_request():
    request = RegistrationRequest(
        full_name=" Example Person ",
        email="Person@Example.com",
        phone_number="+1 (555) 123-4567",
        password="strong-password",
    )
    assert set(request.model_dump()) == {
        "full_name",
        "email",
        "phone_number",
        "password",
    }
    return request


def test_register_stores_a_hashed_password_and_pending_account(monkeypatch):
    repository = FakeUserRepo()
    monkeypatch.setattr(auth_router, "user_repo", repository)

    result = asyncio.run(auth_router.register(registration_request()))

    assert repository.created["email"] == "person@example.com"
    assert repository.created["full_name"] == "Example Person"
    assert repository.created["phone_number"] == "+1 (555) 123-4567"
    assert repository.created["role"] == "user"
    assert repository.created["account_status"] == "pending"
    assert auth_router.password_context.verify(
        "strong-password", repository.created["hashed_password"]
    )
    assert result["account_status"] == "pending"


def test_register_rejects_existing_email(monkeypatch):
    repository = FakeUserRepo(existing=object())
    monkeypatch.setattr(auth_router, "user_repo", repository)

    with pytest.raises(HTTPException) as error:
        asyncio.run(auth_router.register(registration_request()))

    assert error.value.status_code == 409
    assert repository.created is None


@pytest.mark.parametrize("failure_method", ["get_by_email", "create"])
def test_register_logs_unexpected_errors_and_returns_safe_500(
    monkeypatch, caplog, failure_method
):
    class BrokenUserRepo:
        async def get_by_email(self, _email):
            if failure_method == "get_by_email":
                raise RuntimeError("database connection details")
            return None

        async def create(self, **_user_data):
            if failure_method == "create":
                raise RuntimeError("database connection details")
            raise AssertionError("create should not be called")

    monkeypatch.setattr(auth_router, "user_repo", BrokenUserRepo())

    with pytest.raises(HTTPException) as error:
        asyncio.run(auth_router.register(registration_request()))

    assert error.value.status_code == 500
    assert error.value.detail == "Unable to create your account. Please try again later."
    assert "Unexpected error while creating a registration account" in caplog.text
    assert "database connection details" in caplog.text


def test_google_callback_uri_uses_local_default_and_requires_production_config(monkeypatch):
    monkeypatch.delenv("GOOGLE_CALLBACK_URL", raising=False)
    monkeypatch.delenv("RENDER_EXTERNAL_URL", raising=False)
    monkeypatch.delenv("VERCEL", raising=False)
    monkeypatch.setenv("APP_ENV", "development")
    assert auth_router._google_callback_uri() == "http://localhost:8000/auth/google/callback"

    monkeypatch.setenv("APP_ENV", "production")
    with pytest.raises(HTTPException) as error:
        auth_router._google_callback_uri()
    assert error.value.status_code == 503

    monkeypatch.setenv(
        "GOOGLE_CALLBACK_URL", "https://api.example.com/auth/google/callback"
    )
    assert (
        auth_router._google_callback_uri()
        == "https://api.example.com/auth/google/callback"
    )


@pytest.mark.parametrize(
    ("method_name", "role"),
    [
        ("set_student_password", "student"),
        ("set_teacher_password", "teacher"),
    ],
)
def test_admin_password_setup_activates_matching_pending_registration(method_name, role):
    pending_user = {
        "_id": ObjectId(),
        "email": "person@example.com",
        "role": "user",
        "account_status": "pending",
    }

    class FakeCollection:
        update = None

        async def find_one(self, _query):
            return pending_user

        async def update_one(self, query, update):
            self.update = (query, update)
            return SimpleNamespace(matched_count=1)

    collection = FakeCollection()

    class FakeDatabase:
        def __getitem__(self, _name):
            return collection

    repository = UserRepo(FakeDatabase())
    method = getattr(repository, method_name)
    asyncio.run(
        method(
            email="person@example.com",
            full_name="Example Person",
            admin_id=str(ObjectId()),
            hashed_password="bcrypt-hash",
        )
    )

    assert collection.update[1]["$set"]["role"] == role
    assert collection.update[1]["$set"]["account_status"] == "active"
    assert collection.update[1]["$set"]["hashed_password"] == "bcrypt-hash"
