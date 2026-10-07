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

    def find(self, query):
        self.find_queries.append(query)
        return EmptyCursor()

    async def find_one(self, query):
        self.find_one_queries.append(query)
        return None

    async def count_documents(self, query):
        self.count_query = query
        return 0


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
