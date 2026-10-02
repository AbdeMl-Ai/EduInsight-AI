from unittest.mock import AsyncMock

import pytest

from controllers.course_controller import CourseController


@pytest.mark.asyncio
async def test_course_controller_delegates_to_service():
    service = type("Service", (), {"count_courses": AsyncMock(return_value=3)})()

    assert await CourseController(service).count_courses("admin-id") == 3
    service.count_courses.assert_awaited_once_with("admin-id")
