import asyncio
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from api import dependencies
from api.routes import student_router


def test_registered_user_can_read_student_workspace_but_not_admin_routes():
    user = SimpleNamespace(
        id="registered-user-id",
        _token_role="user",
        full_name="Example Person",
        email="person@example.com",
        phone_number="+1 555 123 4567",
        created_at=None,
    )

    assert dependencies.require_student_workspace(user) is user
    with pytest.raises(HTTPException) as error:
        dependencies.get_current_admin(user)
    assert error.value.status_code == 403


def test_unassigned_registered_user_gets_profile_and_empty_workspace_data():
    user = SimpleNamespace(
        id="registered-user-id",
        _token_role="user",
        full_name="Example Person",
        email="person@example.com",
        phone_number="+1 555 123 4567",
        created_at=None,
    )

    profile = asyncio.run(student_router.get_my_profile(user))

    assert profile.student_id == "registered-user-id"
    assert profile.full_name == "Example Person"
    assert profile.email == "person@example.com"
    assert asyncio.run(student_router.get_my_classes(user)) == []
    assert asyncio.run(student_router.get_my_courses(user)) == []
    assert asyncio.run(student_router.get_my_exercises(user)) == []
    assert asyncio.run(student_router.get_my_submissions(user)) == []
    assert asyncio.run(student_router.get_my_scores(user)) == []
    assert asyncio.run(student_router.get_my_notifications(user)) == []


def test_registered_user_cannot_use_student_write_access():
    user = SimpleNamespace(_token_role="user")

    with pytest.raises(HTTPException) as error:
        dependencies.require_student(user)

    assert error.value.status_code == 403
