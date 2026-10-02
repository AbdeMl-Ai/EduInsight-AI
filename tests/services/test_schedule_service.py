import asyncio
from types import SimpleNamespace

import pytest
from bson import ObjectId
from pydantic import ValidationError

from api.schemas.admin_schemas import AdminScheduleCreate
from models.domain_models import ScheduleSession
from repositories.schedule_repository import ScheduleRepo
from services.schedule_service import ScheduleService


def make_request(**updates):
    payload = {
        "teacher_id": "teacher-id",
        "class_id": "class-id",
        "level": "2BAC",
        "day": "Monday",
        "start_time": "19:00",
        "end_time": "21:30",
    }
    payload.update(updates)
    return AdminScheduleCreate(**payload)


@pytest.mark.parametrize(
    "payload",
    [
        {"day": "Funday"},
        {"start_time": "25:00"},
        {"start_time": "20:00", "end_time": "20:00"},
        {"start_time": "21:00", "end_time": "20:00"},
        {"level": "4AC"},
    ],
)
def test_schedule_request_rejects_invalid_day_time_or_level(payload):
    with pytest.raises(ValidationError):
        make_request(**payload)


class FakeScheduleRepo:
    def __init__(self, overlap=False):
        self.overlap = overlap
        self.created = None

    async def has_teacher_overlap(self, **_query):
        return self.overlap

    async def create(self, session):
        self.created = session
        return session.model_copy(update={"id": "saved-session-id"})


class FakeTeacherRepo:
    async def get_teacher(self, teacher_id, _admin_id):
        if teacher_id != "teacher-id":
            return None
        return SimpleNamespace(id=teacher_id, full_name="Teacher One")


class FakeClassService:
    async def get_class(self, class_id, _admin_id):
        if class_id != "class-id":
            raise ValueError("Class not found in your workspace.")
        return SimpleNamespace(id=class_id, class_name="2 BAC Physics")


def test_schedule_service_persists_and_returns_enriched_session():
    repository = FakeScheduleRepo()
    service = ScheduleService(repository, FakeTeacherRepo(), FakeClassService())

    result = asyncio.run(service.create_session(make_request(), "admin-id"))

    assert result == {
        "id": "saved-session-id",
        "teacher_id": "teacher-id",
        "teacher_name": "Teacher One",
        "class_id": "class-id",
        "class_name": "2 BAC Physics",
        "level": "2BAC",
        "day": "Monday",
        "start_time": "19:00",
        "end_time": "21:30",
    }
    assert repository.created.start_time == "19:00"


def test_schedule_service_rejects_teacher_overlap():
    service = ScheduleService(FakeScheduleRepo(overlap=True), FakeTeacherRepo(), FakeClassService())

    with pytest.raises(ValueError, match="already has a lesson overlapping"):
        asyncio.run(service.create_session(make_request(start_time="20:00", end_time="21:00"), "admin-id"))


def test_schedule_service_rejects_teacher_or_class_outside_tenant():
    service = ScheduleService(FakeScheduleRepo(), FakeTeacherRepo(), FakeClassService())

    with pytest.raises(ValueError, match="Teacher not found"):
        asyncio.run(service.create_session(make_request(teacher_id="other-teacher"), "admin-id"))
    with pytest.raises(ValueError, match="Class not found"):
        asyncio.run(service.create_session(make_request(class_id="other-class"), "admin-id"))


def test_schedule_repository_persists_object_ids_and_tenant_scope():
    teacher_id = str(ObjectId())
    class_id = str(ObjectId())
    inserted_id = ObjectId()

    class FakeCollection:
        inserted = None

        async def insert_one(self, document):
            self.inserted = document
            return SimpleNamespace(inserted_id=inserted_id)

    collection = FakeCollection()
    repository = ScheduleRepo({"schedules": collection})
    session = ScheduleSession(
        admin_id="admin-id",
        teacher_id=teacher_id,
        class_id=class_id,
        level="2BAC",
        day="Monday",
        start_time="19:00",
        end_time="21:30",
    )

    saved = asyncio.run(repository.create(session))

    assert collection.inserted["teacher_id"] == ObjectId(teacher_id)
    assert collection.inserted["class_id"] == ObjectId(class_id)
    assert collection.inserted["admin_id"] == "admin-id"
    assert saved.id == str(inserted_id)