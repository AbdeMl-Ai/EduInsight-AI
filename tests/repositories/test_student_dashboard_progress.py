import asyncio
from datetime import datetime, timezone

from bson import ObjectId

from repositories.student_repository import StudentRepo


class AsyncCursor:
    def __init__(self, documents):
        self.documents = list(documents)

    def sort(self, field, direction=1):
        self.documents.sort(
            key=lambda document: document[field],
            reverse=direction < 0,
        )
        return self

    def __aiter__(self):
        self.iterator = iter(self.documents)
        return self

    async def __anext__(self):
        try:
            return next(self.iterator)
        except StopIteration:
            raise StopAsyncIteration from None


class FakeCollection:
    def __init__(self, documents=(), database=None):
        self.documents = list(documents)
        self.database = database

    async def find_one(self, query):
        return next(
            (
                document
                for document in self.documents
                if all(document.get(key) == value for key, value in query.items())
            ),
            None,
        )

    def find(self, query):
        def matches(document):
            for key, value in query.items():
                actual = document.get(key)
                if isinstance(value, dict) and "$in" in value:
                    if actual not in value["$in"]:
                        return False
                elif actual != value:
                    return False
            return True

        return AsyncCursor(document for document in self.documents if matches(document))


def test_dashboard_progress_returns_chronological_per_class_scores():
    student_id = ObjectId()
    first_class_id = ObjectId()
    second_class_id = ObjectId()
    older_exercise_id = ObjectId()
    newer_exercise_id = ObjectId()
    ungraded_exercise_id = ObjectId()
    created_at = datetime(2026, 1, 1, tzinfo=timezone.utc)
    database = {
        "classes": FakeCollection([
            {
                "_id": first_class_id,
                "admin_id": "admin-id",
                "class_name": "Math A",
                "class_level": "2BAC",
                "subject": "Math",
            },
            {
                "_id": second_class_id,
                "admin_id": "admin-id",
                "class_name": "Physics B",
                "class_level": "2BAC",
                "subject": "PC",
            },
        ]),
        "exercises": FakeCollection([
            {
                "_id": newer_exercise_id,
                "admin_id": "admin-id",
                "class_id": str(first_class_id),
                "course_title": "Exercise 2",
                "max_score": 20,
                "created_at": datetime(2026, 2, 1, tzinfo=timezone.utc),
            },
            {
                "_id": older_exercise_id,
                "admin_id": "admin-id",
                "class_id": str(first_class_id),
                "course_title": "Exercise 1",
                "max_score": 20,
                "created_at": created_at,
            },
            {
                "_id": ungraded_exercise_id,
                "admin_id": "admin-id",
                "class_id": str(second_class_id),
                "course_title": "Lab 1",
                "max_score": 10,
                "created_at": created_at,
            },
        ]),
        "submissions": FakeCollection([
            {
                "admin_id": "admin-id",
                "student_id": str(student_id),
                "exercise_id": str(older_exercise_id),
                "score": 15,
            },
            {
                "admin_id": "admin-id",
                "student_id": str(student_id),
                "exercise_id": str(newer_exercise_id),
                "score": 18,
            },
        ]),
    }
    students = FakeCollection([
        {
            "_id": student_id,
            "admin_id": "admin-id",
            "full_name": "Student One",
            "level_academy": "2BAC",
            "level": "2BAC",
            "email": "student@example.com",
            "class_id": first_class_id,
            "class_ids": [first_class_id, second_class_id],
        }
    ], database=database)
    repository = StudentRepo.__new__(StudentRepo)
    repository.collection = students

    result = asyncio.run(
        repository.get_dashboard_progress(str(student_id), "admin-id")
    )

    assert [item["class_id"] for item in result["classes"]] == [
        str(first_class_id),
        str(second_class_id),
    ]
    math_exercises = result["classes"][0]["exercises"]
    assert [item["exercise_name"] for item in math_exercises] == [
        "Exercise 1",
        "Exercise 2",
    ]
    assert [item["sequence"] for item in math_exercises] == [1, 2]
    assert [item["percentage"] for item in math_exercises] == [75.0, 90.0]
    assert result["classes"][1]["exercises"][0]["percentage"] is None

