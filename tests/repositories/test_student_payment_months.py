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

    def sort(self, field, direction=1):
        documents = list(self.documents)
        documents.sort(key=lambda document: document[field], reverse=direction < 0)
        self.documents = iter(documents)
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

    def find(self, query, projection):
        if "month" in query and isinstance(query["month"], dict):
            prefix = query["month"]["$regex"].removeprefix("^")
            documents = [
                {"month": item["month"]}
                for item in self.documents
                if item["month"].startswith(prefix)
            ]
        else:
            documents = [
                {key: value for key, value in item.items() if key in projection}
                for item in self.documents
                if all(item.get(key) == value for key, value in query.items())
            ]
        return AsyncCursor(documents)

    async def delete_many(self, query):
        self.deleted_query = query
        month_filter = query["month"]
        months = (
            set(month_filter["$in"])
            if isinstance(month_filter, dict)
            else {month_filter}
        )
        self.documents = [
            item for item in self.documents if item["month"] not in months
        ]

    async def insert_one(self, document):
        self.inserted.append(document)
        self.documents.append(document)
        return SimpleNamespace(inserted_id=ObjectId())


class RecentPaymentCursor:
    def __init__(self, documents):
        self.documents = iter(documents)

    def __aiter__(self):
        return self

    async def __anext__(self):
        try:
            return next(self.documents)
        except StopIteration:
            raise StopAsyncIteration from None


class RecentPayments:
    def __init__(self):
        self.query = None

    def find(self, query, _projection):
        self.query = query
        return RecentPaymentCursor([{"student_id": STUDENT_ID}])


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


def test_get_recently_paid_student_ids_checks_current_month_and_date_window():
    repository = StudentPaymentRepo.__new__(StudentPaymentRepo)
    repository.collection = RecentPayments()
    cutoff_date = date(2026, 9, 11)

    paid_ids = asyncio.run(
        repository.get_recently_paid_student_ids(
            "admin-a", "2026-10", cutoff_date
        )
    )

    assert paid_ids == {STUDENT_ID}
    assert repository.collection.query["admin_id"] == "admin-a"
    assert {"month": "2026-10"} in repository.collection.query["$or"]
    assert {
        "payment_date": {
            "$gte": cutoff_date.isoformat(),
            "$lte": date.today().isoformat(),
        }
    } in repository.collection.query["$or"]


def test_get_payment_history_returns_exact_dates_and_amounts_for_student():
    repository = StudentPaymentRepo.__new__(StudentPaymentRepo)
    repository.students = FakeStudents()
    first_id = ObjectId()
    second_id = ObjectId()
    repository.collection = FakePayments([
        {
            "_id": first_id,
            "admin_id": "admin-a",
            "student_id": STUDENT_ID,
            "amount": 600.0,
            "payment_date": "2026-02-17",
            "month": "2026-02",
        },
        {
            "_id": second_id,
            "admin_id": "admin-a",
            "student_id": STUDENT_ID,
            "amount": 450.0,
            "payment_date": "2026-01-08",
            "month": "2026-01",
        },
        {
            "_id": ObjectId(),
            "admin_id": "admin-b",
            "student_id": STUDENT_ID,
            "amount": 900.0,
            "payment_date": "2026-03-01",
            "month": "2026-03",
        },
    ])

    payments = asyncio.run(
        repository.get_payment_history(STUDENT_ID, "admin-a")
    )

    assert payments == [
        {
            "id": str(first_id),
            "student_id": STUDENT_ID,
            "student_name": "Student One",
            "amount": 600.0,
            "payment_date": "2026-02-17",
            "month": "2026-02",
        },
        {
            "id": str(second_id),
            "student_id": STUDENT_ID,
            "student_name": "Student One",
            "amount": 450.0,
            "payment_date": "2026-01-08",
            "month": "2026-01",
        },
    ]


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


def test_delete_month_payment_is_scoped_to_student_tenant_and_month():
    repository = StudentPaymentRepo.__new__(StudentPaymentRepo)
    repository.students = FakeStudents()
    repository.collection = FakePayments([
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2026-02"},
        {"admin_id": "admin-a", "student_id": STUDENT_ID, "month": "2026-03"},
    ])

    asyncio.run(
        repository.delete_month_payment(STUDENT_ID, "admin-a", "2026-02")
    )

    assert repository.collection.deleted_query == {
        "admin_id": "admin-a",
        "student_id": STUDENT_ID,
        "month": "2026-02",
    }
    assert [item["month"] for item in repository.collection.documents] == [
        "2026-03"
    ]
