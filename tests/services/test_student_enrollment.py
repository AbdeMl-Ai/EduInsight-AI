import asyncio
from types import SimpleNamespace

import pytest
from bson import ObjectId
from pydantic import ValidationError

from api.schemas.admin_schemas import AdminStudentCreate, ClassCreate, ClassUpdate
from api.schemas.student_schema import StudentCreate, StudentUpdate
from api.routes import student_router
from models.domain_models import Student
from repositories.course_repository import CourseRepo
from repositories.exercise_repository import ExerciseRepo
from repositories.student_repository import StudentRepo
from services.admin_service import AdminService


def test_student_schemas_accept_multiple_class_ids_and_canonicalize_levels():
    admin_student = AdminStudentCreate(
        full_name="Ayoub Student",
        email="ayoub@example.com",
        phone_number="0612345678",
        level="1_bac",
        class_ids=["class-math", "class-pc"],
    )
    student = StudentCreate(
        full_name="Ayoub Student",
        email="ayoub@example.com",
        level_academy="2bac",
        class_ids=["class-math", "class-pc"],
    )
    update = StudentUpdate(class_ids=["class-math", "class-pc"], level="TRC")

    assert admin_student.level == "1BAC"
    assert admin_student.class_ids == ["class-math", "class-pc"]
    assert student.level_academy == "2BAC"
    assert student.class_ids == ["class-math", "class-pc"]
    assert update.level_academy == "TRC"
    assert update.class_ids == ["class-math", "class-pc"]


@pytest.mark.parametrize("level", ["TC", "4AC", "2_BAC_MATH", ""])
def test_student_schemas_reject_unsupported_levels(level):
    with pytest.raises(ValidationError):
        StudentCreate(
            full_name="Ayoub Student",
            email="ayoub@example.com",
            level_academy=level,
        )


@pytest.mark.parametrize("subject", ["Physics", "Arabic", ""])
def test_class_schema_rejects_unsupported_subjects(subject):
    with pytest.raises(ValidationError):
        ClassCreate(
            teacher_id="teacher-id",
            class_name="2 BAC class",
            subject=subject,
            class_level="2bac",
            center_rent_fee_per_student=0,
            teacher_teaching_fee_per_student=0,
            student_monthly_fee=0,
        )


def test_class_schemas_accept_only_standard_levels_and_subjects():
    created = ClassCreate(
        teacher_id="teacher-id",
        class_name="2 BAC science",
        subject="pc",
        class_level="2_bac",
        center_rent_fee_per_student=0,
        teacher_teaching_fee_per_student=0,
        student_monthly_fee=0,
    )
    updated = ClassUpdate(class_level="trc", subject="french")

    assert created.class_level == "2BAC"
    assert created.subject == "PC"
    assert updated.class_level == "TRC"
    assert updated.subject == "French"


@pytest.mark.parametrize(
    ("stored_subject", "canonical_subject"),
    [("2 bac math ", "Math"), ("2 bac physique ", "PC")],
)
def test_class_schema_normalizes_legacy_level_prefixed_subjects(stored_subject, canonical_subject):
    class_document = ClassCreate(
        teacher_id="teacher-id",
        class_name="Legacy class",
        subject=stored_subject,
        class_level="2BAC",
        center_rent_fee_per_student=0,
        teacher_teaching_fee_per_student=0,
        student_monthly_fee=0,
    )

    assert class_document.subject == canonical_subject


def test_student_model_upgrades_legacy_class_id_and_preserves_multiple_ids():
    legacy = Student(
        admin_id="admin-id",
        full_name="Legacy Student",
        email="legacy@example.com",
        level="3ac",
        level_academy="3AC",
        class_id="class-one",
    )
    multi_class = Student(
        admin_id="admin-id",
        full_name="Ayoub Student",
        email="ayoub@example.com",
        level="2BAC",
        level_academy="2BAC",
        class_ids=["class-math", "class-pc"],
    )

    assert legacy.class_ids == ["class-one"]
    assert multi_class.class_ids == ["class-math", "class-pc"]
    assert multi_class.class_id == "class-math"


def test_admin_create_student_allows_different_subjects_at_same_level():
    class FakeClassRepo:
        def __init__(self):
            self.enrollments = []

        async def add_embedded_student(self, class_id, _admin_id, student_id, _origin):
            self.enrollments.append((class_id, student_id))

    class FakeClassService:
        def __init__(self):
            self.class_repo = FakeClassRepo()

        async def get_class(self, class_id, _admin_id):
            classes = {
                "class-one": ("1AC", "Math"),
                "class-two": ("1AC", "PC"),
                "class-three": ("1AC", "Math"),
            }
            if class_id not in classes:
                raise ValueError("Class not found")
            level, subject = classes[class_id]
            return SimpleNamespace(class_level=level, subject=subject)

    class FakeStudentService:
        created = None

        async def create_student(self, *args, **kwargs):
            self.created = (args, kwargs)
            return SimpleNamespace(id="student-id")

    student_service = FakeStudentService()
    class_service = FakeClassService()
    service = AdminService(None, student_service, None, class_service)
    data = AdminStudentCreate(
        full_name="Ayoub Student",
        email="ayoub@example.com",
        phone_number="0612345678",
        level="1AC",
        class_ids=["class-one", "class-two"],
    )

    asyncio.run(service.create_student(data, "admin-id"))

    assert student_service.created[1]["class_ids"] == ["class-one", "class-two"]
    assert class_service.class_repo.enrollments == [
        ("class-one", "student-id"),
        ("class-two", "student-id"),
    ]

    student_service.created = None
    with pytest.raises(ValueError, match="A student can only join one class per subject"):
        asyncio.run(
            service.create_student(
                data.model_copy(update={"class_ids": ["class-one", "class-three"]}),
                "admin-id",
            )
        )
    assert student_service.created is None


def test_admin_update_student_allows_different_subjects_at_same_level():
    class FakeStudentRepo:
        async def belongs_to_admin(self, _student_id, _admin_id):
            return True

    class FakeStudentService:
        student_repo = FakeStudentRepo()
        student = SimpleNamespace(
            id="student-id",
            class_id="class-old",
            class_ids=["class-old"],
        )

        async def get_student(self, _student_id, _admin_id):
            return self.student

        async def update_student(self, _student_id, _admin_id, **_updates):
            self.update_called = True
            return "Student updated successfully."

        async def set_student_classes(self, _student_id, class_ids, _admin_id):
            self.student.class_ids = class_ids
            self.student.class_id = class_ids[0] if class_ids else None

    class FakeClassRepo:
        async def remove_embedded_student(self, *_args):
            return None

        async def add_embedded_student(self, *_args):
            return None

    class FakeClassService:
        class_repo = FakeClassRepo()

        async def get_class(self, class_id, _admin_id):
            classes = {
                "class-one": ("1AC", "Math"),
                "class-two": ("1AC", "PC"),
                "class-three": ("1AC", "Math"),
            }
            level, subject = classes[class_id]
            return SimpleNamespace(class_level=level, subject=subject)

    student_service = FakeStudentService()
    service = AdminService(None, student_service, None, FakeClassService())

    result = asyncio.run(
        service.update_student(
            "student-id",
            {"class_ids": ["class-one", "class-two"]},
            "admin-id",
        )
    )

    assert result == "Student updated successfully."
    assert student_service.student.class_ids == ["class-one", "class-two"]
    assert student_service.student.class_id == "class-one"

    student_service.update_called = False
    with pytest.raises(ValueError, match="A student can only join one class per subject"):
        asyncio.run(
            service.update_student(
                "student-id",
                {"class_ids": ["class-one", "class-three"]},
                "admin-id",
            )
        )
    assert student_service.update_called is False


def test_admin_single_class_assignment_rejects_second_class_at_same_level():
    class FakeStudentRepo:
        async def belongs_to_admin(self, _student_id, _admin_id):
            return True

    class FakeStudentService:
        student_repo = FakeStudentRepo()
        student = SimpleNamespace(
            id="student-id",
            class_id="class-one",
            class_ids=["class-one"],
        )
        assignment_called = False

        async def get_student(self, _student_id, _admin_id):
            return self.student

        async def assign_to_class(self, _student_id, _class_id, _admin_id):
            self.assignment_called = True

    class FakeClassRepo:
        async def add_embedded_student(self, *_args):
            raise AssertionError("Invalid enrollment must not be written")

    class FakeClassService:
        class_repo = FakeClassRepo()

        async def get_class(self, class_id, _admin_id):
            classes = {
                "class-one": ("2BAC", "PC"),
                "class-two": ("2BAC", "PC"),
            }
            level, subject = classes[class_id]
            return SimpleNamespace(class_level=level, subject=subject)

    student_service = FakeStudentService()
    service = AdminService(None, student_service, None, FakeClassService())

    with pytest.raises(ValueError, match="A student can only join one class per subject"):
        asyncio.run(service.assign_student_to_class("student-id", "class-two", "admin-id"))
    assert student_service.assignment_called is False


def test_student_repository_persists_class_ids_and_primary_compatibility_id():
    class Result:
        matched_count = 1

    class FakeCollection:
        update = None

        async def update_one(self, query, update):
            self.query = query
            self.update = update
            return Result()

    collection = FakeCollection()
    repo = StudentRepo({"students": collection})
    student_id = str(ObjectId())
    admin_id = "admin-id"
    class_one = str(ObjectId())
    class_two = str(ObjectId())

    assert asyncio.run(
        repo.set_student_class_ids(
            student_id,
            [class_one, class_two, class_one],
            admin_id,
        )
    )
    assert collection.update["$set"] == {
        "class_ids": [class_one, class_two],
        "class_id": class_one,
    }


def test_student_update_persists_multiple_class_ids():
    class Result:
        matched_count = 1

    class FakeCollection:
        update = None

        async def update_one(self, query, update):
            self.query = query
            self.update = update
            return Result()

    collection = FakeCollection()
    repo = StudentRepo({"students": collection})
    student_id = str(ObjectId())
    class_one = str(ObjectId())
    class_two = str(ObjectId())

    assert asyncio.run(
        repo.update_student(
            student_id,
            "admin-id",
            class_ids=[class_one, class_two, class_one],
        )
    )
    assert collection.update["$set"] == {
        "class_ids": [class_one, class_two],
        "class_id": class_one,
    }


def test_student_classes_route_returns_only_enrolled_class_details(monkeypatch):
    class FakeClassController:
        async def get_class(self, class_id, admin_id):
            assert admin_id == "admin-id"
            return SimpleNamespace(
                id=class_id,
                class_name=f"Class {class_id}",
                class_level="2BAC",
                subject="Math",
            )

    monkeypatch.setattr(student_router, "class_controller", FakeClassController())

    result = asyncio.run(
        student_router.get_my_classes(
            SimpleNamespace(
                class_ids=["class-one", "class-two"],
                class_id="class-one",
                admin_id="admin-id",
            )
        )
    )

    assert [item["id"] for item in result] == ["class-one", "class-two"]
    assert all(item["class_level"] == "2BAC" for item in result)


def test_student_course_and_exercise_reads_query_all_enrolled_classes():
    class Cursor:
        def sort(self, *_args):
            return self

        def __aiter__(self):
            async def iterate():
                if False:
                    yield None
            return iterate()

    class FakeCollection:
        def find(self, query, *_args):
            self.query = query
            return Cursor()

    class FakeDatabase(dict):
        pass

    class_ids = [str(ObjectId()), str(ObjectId())]
    courses = FakeCollection()
    course_repo = CourseRepo({"courses": courses, "classes": FakeCollection()})
    exercises = FakeCollection()
    database = FakeDatabase({"submissions": FakeCollection()})
    exercises.database = database
    exercise_repo = ExerciseRepo({"exercises": exercises})

    asyncio.run(course_repo.get_courses_by_class_ids(class_ids, "admin-id"))
    asyncio.run(exercise_repo.get_exercises_by_class_ids_for_student(class_ids, "student-id", "admin-id"))

    expected = {"class_id": {"$in": class_ids}}
    assert courses.query == {"admin_id": "admin-id", **expected}
    assert exercises.query == {"admin_id": "admin-id", **expected}