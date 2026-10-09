import asyncio

from bson import ObjectId

from repositories.notification_repository import NotificationRepo


class EmptyCursor:
    def sort(self, *_args):
        return self

    def __aiter__(self):
        return self

    async def __anext__(self):
        raise StopAsyncIteration


class RecordingCollection:
    def __init__(self):
        self.find_queries = []
        self.find_one_queries = []
        self.count_query = None
        self.update_many_query = None

    def find(self, query):
        self.find_queries.append(query)
        return EmptyCursor()

    async def find_one(self, query):
        self.find_one_queries.append(query)
        return None

    async def count_documents(self, query):
        self.count_query = query
        return 0

    async def update_many(self, query, update):
        self.update_many_query = (query, update)
        return type("Result", (), {"modified_count": 2})()


def test_notification_reads_search_and_count_are_scoped_to_recipient():
    admin_id = str(ObjectId())
    recipient_id = str(ObjectId())
    collection = RecordingCollection()
    repository = NotificationRepo.__new__(NotificationRepo)
    repository.collection = collection

    async def run_queries():
        await repository.get_all_notifications(admin_id, recipient_id)
        await repository.search_notification("message", admin_id, recipient_id)
        await repository.count_notifications(admin_id, recipient_id)
        await repository.get_notification_for_receiver(
            str(ObjectId()), recipient_id, admin_id
        )

    asyncio.run(run_queries())

    assert len(collection.find_queries) == 2
    assert all(query["receiver_id"] == recipient_id for query in collection.find_queries)
    assert collection.count_query == {
        "admin_id": admin_id,
        "receiver_id": recipient_id,
    }
    assert collection.find_one_queries[0]["receiver_id"] == recipient_id


def test_admin_notification_list_is_scoped_to_admin_recipient():
    admin_id = str(ObjectId())
    collection = RecordingCollection()
    repository = NotificationRepo.__new__(NotificationRepo)
    repository.collection = collection

    asyncio.run(repository.get_admin_notifications(admin_id))

    assert collection.find_queries[0] == {
        "admin_id": admin_id,
        "receiver_id": admin_id,
    }


def test_mark_all_read_is_scoped_to_teacher_and_tenant():
    admin_id = str(ObjectId())
    teacher_id = str(ObjectId())
    collection = RecordingCollection()
    repository = NotificationRepo.__new__(NotificationRepo)
    repository.collection = collection

    updated = asyncio.run(
        repository.mark_all_as_read(teacher_id, "teacher", admin_id)
    )

    assert updated == 2
    assert collection.update_many_query == (
        {
            "admin_id": admin_id,
            "receiver_id": teacher_id,
            "receiver_role": "teacher",
            "is_read": False,
        },
        {"$set": {"is_read": True}},
    )
