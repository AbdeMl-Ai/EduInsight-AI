import asyncio
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from api.routes import admin_router
from api.schemas.admin_schemas import ClassCreate, ClassUpdate, TeacherClassAssignment
from models.domain_models import ClassDocument
from services.class_service import ClassService
from services.teacher_service import TeacherService


class FakeTeacherRepo:
    def __init__(self, assigned_by_class=None, valid_teachers=None):
        self.assigned_by_class = assigned_by_class or {}
        self.valid_teachers = valid_teachers or {"teacher-a", "teacher-b"}

    async def get_teacher_id_for_class(self, class_id, _admin_id):
        return self.assigned_by_class.get(class_id)

    async def get_teacher(self, teacher_id, _admin_id):
        return SimpleNamespace(id=teacher_id) if teacher_id in self.valid_teachers else None


class FakeClassRepo:
    def __init__(self):
        self.class_document = None

    async def add_class(self, class_document, _admin_id):
        self.class_document = class_document
        return class_document

    async def get_class(self, _class_id, _admin_id):
        return self.class_document

    async def update_class(self, _class_id, _admin_id, updates):
        self.class_document = self.class_document.model_copy(update=updates)
        return self.class_document


def make_class(teacher_id="teacher-a"):
    return ClassDocument(
        admin_id="admin-a",
        teacher_id=teacher_id,
        class_name="Class A",
        subject="Math",
        class_level="1AC",
        center_rent_fee_per_student=0,
        teacher_teaching_fee_per_student=0,
        student_monthly_fee=0,
    )


def test_one_teacher_can_be_assigned_to_multiple_classes():
    service = TeacherService(
        FakeTeacherRepo(assigned_by_class={"class-a": "teacher-a", "class-b": "teacher-a"})
    )

    asyncio.run(
        service.validate_class_assignments(
            ["class-a", "class-b"], admin_id="admin-a", teacher_id="teacher-a"
        )
    )


def test_class_rejects_multiple_teacher_values():
    with pytest.raises(ValidationError):
        ClassCreate(
            teacher_id=["teacher-a", "teacher-b"],
            class_name="Class A",
            subject="Math",
            class_level="Level 1",
            center_rent_fee_per_student=0,
            teacher_teaching_fee_per_student=0,
            student_monthly_fee=0,
        )

    with pytest.raises(ValidationError):
        ClassUpdate(teacher_ids=["teacher-a", "teacher-b"])


def test_class_service_requires_teacher_in_same_workspace():
    class_repo = FakeClassRepo()
    service = ClassService(class_repo, FakeTeacherRepo(valid_teachers={"teacher-a"}))

    async def exercise_service():
        await service.create_class(make_class(), "admin-a")
        await service.update_class("class-id", "admin-a", {"teacher_id": "teacher-a"})
        with pytest.raises(ValueError, match="Teacher not found in your workspace"):
            await service.update_class("class-id", "admin-a", {"teacher_id": "outside-teacher"})

    asyncio.run(exercise_service())


def test_repeating_teacher_class_assignment_is_idempotent(monkeypatch):
    class FakeAdminController:
        assigned = None

        async def assert_teacher_access(self, _teacher_id, _admin_id):
            return None

        async def assert_class_access(self, _class_id, _admin_id):
            return None

        async def assign_teacher_to_classes(self, teacher_id, class_ids, admin_id):
            self.assigned = (teacher_id, class_ids, admin_id)
            return "Teacher assigned to classes."

    class FakeTeacherController:
        async def get_teacher(self, teacher_id, _admin_id):
            return SimpleNamespace(
                id=teacher_id,
                classes=[{"class_id": "class-a"}],
            )

    fake_admin = FakeAdminController()
    monkeypatch.setattr(admin_router, "admin_controller", fake_admin)
    monkeypatch.setattr(admin_router, "teacher_controller", FakeTeacherController())

    async def assign():
        return await admin_router.assign_teacher(
            "teacher-a",
            TeacherClassAssignment(class_ids=["class-a", "class-b", "class-a"]),
            _admin=SimpleNamespace(id="admin-a"),
        )

    result = asyncio.run(assign())

    assert result == {"message": "Teacher assigned to classes."}
    assert fake_admin.assigned == ("teacher-a", ["class-a", "class-b"], "admin-a")