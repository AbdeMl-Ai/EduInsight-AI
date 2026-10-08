from bson import ObjectId

from seed import ensure_login_user
from utils.passwords import verify_password


class FakeUsers:
    def __init__(self, documents=None):
        self.documents = list(documents or [])

    def find_one(self, query, _projection=None):
        for document in self.documents:
            if all(document.get(key) == value for key, value in query.items()):
                return document
        return None

    def update_one(self, query, update):
        for document in self.documents:
            if document["_id"] == query["_id"]:
                document.update(update["$set"])
                return
        raise AssertionError("User to update was not found.")

    def insert_one(self, document):
        self.documents.append(document)


def test_existing_seeded_login_is_refreshed_with_backend_password_hash():
    admin_id = ObjectId()
    user = {
        "_id": ObjectId(),
        "email": "demo@example.test",
        "role": "student",
        "hashed_password": "obsolete-password-hash",
        "admin_id": admin_id,
    }
    users = FakeUsers([user])

    inserted = ensure_login_user(
        users,
        account={"email": "demo@example.test", "full_name": "Demo Student"},
        role="student",
        admin_id=admin_id,
        password="DemoPass123!",
    )

    assert inserted is False
    assert user["hashed_password"] != "obsolete-password-hash"
    assert verify_password("DemoPass123!", user["hashed_password"])


def test_new_seeded_login_uses_backend_password_hash():
    admin_id = ObjectId()
    users = FakeUsers()

    inserted = ensure_login_user(
        users,
        account={"email": "demo@example.test", "full_name": "Demo Student"},
        role="student",
        admin_id=admin_id,
        password="DemoPass123!",
    )

    assert inserted is True
    assert len(users.documents) == 1
    assert verify_password("DemoPass123!", users.documents[0]["hashed_password"])
