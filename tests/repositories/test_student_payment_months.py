import asyncio
from datetime import date
from types import SimpleNamespace

from bson import ObjectId

from repositories.student_payment_repository import StudentPaymentRepo


class AsyncCursor:
    def __init__(self, documents):
        self.documents = iter(documents)

    def __aiter__(self):
        return self

    async def __anext__(self):
        try:
            return next(self.documents)
        except StopIteration:
            raise StopAsyncIteration from None


class FakeStudents:
    async def find_one(self, _query):
        return {"_id": STUDENT_ID, "full_name": "Student One"}


class FakePayments:
    def __init__(self, documents):
        self.documents = documents
        self.deleted_query = None
        self.inserted = []

    def find(self, query, _projection):
        prefix = query["month"]["$regex"].removeprefix("^")
        return AsyncCursor(
            [{"month": item["month"]} for item in self.documents if item["month"].startswith(prefix)]
        )

    async def delete_many(self, query):
        self.deleted_query = query
        months = set(query["month"]["$in"])
        self.documents = [
            item for item in self.documents if item["month"] not in months
        ]

    async def insert_one(self, document):
        self.inserted.append(document)
        self.documents.append(document)
        return SimpleNamespace(inserted_id=ObjectId())


STUDENT_ID = str(ObjectId())


def test_get_paid_months_reads_student_ledger_by_tenant_and_year():
    repository = StudentPaymentRepo.__new__(StudentPaymentRepo)
    repository.students = FakeStudents()
    repository.collection = FakePayments([
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2026-02"},
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2026-02"},
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2025-12"},
    ])

    months = asyncio.run(repository.get_paid_months(STUDENT_ID, "admin-a", 2026))

    assert months == [2]


def test_sync_paid_months_inserts_only_new_months_and_removes_unchecked():
    repository = StudentPaymentRepo.__new__(StudentPaymentRepo)
    repository.students = FakeStudents()
    repository.collection = FakePayments([
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2026-02"},
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2026-03"},
    ])

    paid_months = asyncio.run(
        repository.sync_paid_months(
            STUDENT_ID, "admin-a", 2026, [2, 4], 400.0
        )
    )

    assert paid_months == [2, 4]
    assert repository.collection.deleted_query["month"]["$in"] == ["2026-03"]
    assert len(repository.collection.inserted) == 1
    new_payment = repository.collection.inserted[0]
    assert new_payment["student_id"] == STUDENT_ID
    assert new_payment["month"] == "2026-04"
    assert new_payment["amount"] == 400.0
    assert new_payment["payment_date"] == date(2026, 4, 1).isoformat()
