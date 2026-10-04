import asyncio
from types import SimpleNamespace

import pytest

from services.auth_service import AuthService
from utils.passwords import hash_password
from utils.security import decode_access_token


class FakeAccountRepo:
    def __init__(self, account=None):
        self.account = account
        self.created_admin = None

    async def get_admin_by_email(self, _email):
        return self.account

    async def get_or_create_registered_admin(self, **admin_data):
        self.created_admin = admin_data
        if self.account is None:
            self.account = SimpleNamespace(id="google-admin-id", full_name=admin_data["full_name"])
        return self.account

    async def get_student_by_email(self, _email):
        return self.account

    async def get_teacher_by_email(self, _email):
        return self.account


class FakeGoogleUserRepo:
    def __init__(self):
        self.created = None

    async def get_or_create(self, **user_data):
        self.created = user_data
        return SimpleNamespace(id="google-user-id", role=user_data["role"])


class FakeLoginUserRepo:
    def __init__(self, user):
        self.user = user
        self.activated_user_id = None

    async def get_by_email(self, _email):
        return self.user

    async def activate_registered_user(self, user_id):
        self.activated_user_id = user_id


def make_auth_service(admin=None, student=None, teacher=None):
    google_user_repo = FakeGoogleUserRepo()
    service = AuthService(
        FakeAccountRepo(student),
        FakeAccountRepo(teacher),
        FakeAccountRepo(admin),
        google_user_repo,
    )
    return service, google_user_repo


def test_google_login_creates_active_admin_and_returns_bearer_jwt():
    service, user_repo = make_auth_service()
    profile = {
        "sub": "google-subject",
        "email": "Person@Example.com",
        "name": "Example Person",
        "picture": "https://example.com/photo.png",
    }

    result = asyncio.run(service.login_with_google(profile))
    payload = decode_access_token(result["access_token"])

    assert result["token_type"] == "bearer"
    assert result["role"] == "admin"
    assert payload["sub"] == "google-admin-id"
    assert payload["role"] == "admin"
    assert user_repo.created["email"] == "person@example.com"
    assert user_repo.created["google_sub"] == "google-subject"
    assert user_repo.created["role"] == "admin"
    assert user_repo.created["admin_id"] == "google-admin-id"


@pytest.mark.parametrize("account_status", ["active", "pending"])
def test_manual_user_login_issues_student_workspace_compatible_token(account_status):
    user = SimpleNamespace(
        id="registered-user-id",
        role="user",
        account_status=account_status,
        hashed_password=hash_password("strong-password"),
    )
    user_repo = FakeLoginUserRepo(user)
    service = AuthService(
        FakeAccountRepo(),
        FakeAccountRepo(),
        FakeAccountRepo(),
        user_repo,
    )

    result = asyncio.run(service.login("Person@Example.com", "strong-password"))
    payload = decode_access_token(result["access_token"])

    assert result["role"] == "user"
    assert payload["sub"] == "registered-user-id"
    assert payload["role"] == "user"
    assert user_repo.activated_user_id == (
        "registered-user-id" if account_status == "pending" else None
    )


def test_manual_user_login_rejects_an_incorrect_password():
    user = SimpleNamespace(
        id="registered-user-id",
        role="user",
        account_status="active",
        hashed_password=hash_password("strong-password"),
    )
    service = AuthService(
        FakeAccountRepo(),
        FakeAccountRepo(),
        FakeAccountRepo(),
        FakeLoginUserRepo(user),
    )

    with pytest.raises(ValueError, match="Invalid email or password"):
        asyncio.run(service.login("person@example.com", "wrong-password"))


def test_manual_user_login_rejects_explicitly_inactive_account():
    user = SimpleNamespace(
        id="registered-user-id",
        role="user",
        account_status="inactive",
        hashed_password=hash_password("strong-password"),
    )
    service = AuthService(
        FakeAccountRepo(),
        FakeAccountRepo(),
        FakeAccountRepo(),
        FakeLoginUserRepo(user),
    )

    with pytest.raises(ValueError, match="This account is inactive"):
        asyncio.run(service.login("person@example.com", "strong-password"))


def test_active_admin_login_uses_the_admin_profile_id():
    user = SimpleNamespace(
        id="login-user-id",
        role="admin",
        account_status="active",
        hashed_password=hash_password("strong-password"),
    )
    admin = SimpleNamespace(id="admin-profile-id")
    user_repo = FakeLoginUserRepo(user)
    service = AuthService(
        FakeAccountRepo(),
        FakeAccountRepo(),
        FakeAccountRepo(admin),
        user_repo,
    )

    result = asyncio.run(service.login("admin@example.com", "strong-password"))
    payload = decode_access_token(result["access_token"])

    assert result["role"] == "admin"
    assert payload["sub"] == "admin-profile-id"
    assert payload["role"] == "admin"


def test_google_login_links_existing_admin_by_verified_email():
    admin = SimpleNamespace(id="admin-id")
    service, user_repo = make_auth_service(admin=admin)

    result = asyncio.run(
        service.login_with_google(
            {"sub": "google-subject", "email": "admin@example.com"}
        )
    )
    payload = decode_access_token(result["access_token"])

    assert result["role"] == "admin"
    assert payload["sub"] == "admin-id"
    assert user_repo.created is None


def test_google_login_rejects_duplicate_emails_across_roles():
    service, user_repo = make_auth_service(
        admin=SimpleNamespace(id="admin-id"),
        student=SimpleNamespace(id="student-id", admin_id="tenant-id"),
    )

    with pytest.raises(ValueError, match="multiple application accounts"):
        asyncio.run(
            service.login_with_google(
                {"sub": "google-subject", "email": "shared@example.com"}
            )
        )
    assert user_repo.created is None


def test_startup_creates_phone_and_google_identity_indexes(monkeypatch):
    from api import dependencies

    class FakeCollection:
        def __init__(self):
            self.indexes = []
            self.updates = []

        async def create_index(self, keys, **options):
            self.indexes.append((keys, options))

        async def update_many(self, query, update):
            self.updates.append((query, update))

    class FakeDatabase(dict):
        async def command(self, command):
            assert command == "ping"

        def __getitem__(self, name):
            return self.setdefault(name, FakeCollection())

    fake_db = FakeDatabase()
    monkeypatch.setattr(dependencies, "db", fake_db)
    asyncio.run(dependencies.connect_to_database())

    assert [index[1]["name"] for index in fake_db["users"].indexes] == [
        "unique_users_email",
        "unique_users_google_sub",
    ]
    google_sub_index = fake_db["users"].indexes[1][1]
    assert google_sub_index["unique"] is True
    assert google_sub_index["partialFilterExpression"] == {
        "google_sub": {"$type": "string", "$gt": ""}
    }
    assert fake_db["users"].updates == [
        ({}, {"$unset": {"password": "", "password_hash": ""}})
    ]
