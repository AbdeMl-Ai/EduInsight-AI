import asyncio

from bson import ObjectId

from repositories.payment_repository import PaymentRepo


class EmptyCursor:
    def __aiter__(self):
        return self

    async def __anext__(self):
        raise StopAsyncIteration


class RecordingCollection:
    def __init__(self):
        self.query = None

    def find(self, query):
        self.query = query
        return EmptyCursor()


def test_get_for_users_matches_string_and_object_id_payment_keys():
    student_id = str(ObjectId())
    collection = RecordingCollection()
    repository = PaymentRepo.__new__(PaymentRepo)
    repository.collection = collection

    asyncio.run(repository.get_for_users([student_id], "student", "admin-a"))

    assert collection.query == {
        "admin_id": "admin-a",
        "user_role": "student",
        "user_id": {
            "$in": [student_id, ObjectId(student_id)],
        },
    }
