import asyncio
from types import SimpleNamespace

from services.attendance_service import AttendanceService


class FakeAttendanceRepo:
    def __init__(self, records, students):
        self.data = {"records": records, "students": students}

    async def get_class_attendance_data(self, _class_id, _admin_id):
        return self.data


class FakeClassService:
    async def get_class(self, _class_id, _admin_id):
        return SimpleNamespace(id="class-id")


class FakeScheduleRepo:
    async def get_session(self, _session_id, _admin_id):
        return None


def test_class_attendance_summary_uses_distinct_sessions_for_each_student():
    repository = FakeAttendanceRepo(
        records=[
            {"student_id": "student-one", "date": "2026-10-01", "status": "present"},
            {"student_id": "student-one", "date": "2026-10-08", "status": "absent"},
            {"student_id": "student-two", "date": "2026-10-01", "status": "absent"},
        ],
        students=[
            {"student_id": "student-one", "full_name": "Student One"},
            {"student_id": "student-two", "full_name": "Student Two"},
            {"student_id": "student-three", "full_name": "Student Three"},
        ],
    )
    service = AttendanceService(repository, None, FakeClassService(), FakeScheduleRepo())

    report = asyncio.run(service.get_class_attendance_summary("class-id", "admin-id"))

    assert report["total_sessions"] == 2
    assert report["students"] == [
        {
            "student_id": "student-one",
            "student_name": "Student One",
            "present_sessions": 1,
            "absent_sessions": 1,
            "total_sessions": 2,
            "attendance_percentage": 50.0,
        },
        {
            "student_id": "student-two",
            "student_name": "Student Two",
            "present_sessions": 0,
            "absent_sessions": 2,
            "total_sessions": 2,
            "attendance_percentage": 0.0,
        },
        {
            "student_id": "student-three",
            "student_name": "Student Three",
            "present_sessions": 0,
            "absent_sessions": 2,
            "total_sessions": 2,
            "attendance_percentage": 0.0,
        },
    ]


def test_class_attendance_summary_returns_zero_percent_before_first_session():
    repository = FakeAttendanceRepo(
        records=[],
        students=[{"student_id": "student-one", "full_name": "Student One"}],
    )
    service = AttendanceService(repository, None, FakeClassService(), FakeScheduleRepo())

    report = asyncio.run(service.get_class_attendance_summary("class-id", "admin-id"))

    assert report["total_sessions"] == 0
    assert report["students"][0]["attendance_percentage"] == 0.0
    assert report["students"][0]["absent_sessions"] == 0


def test_class_attendance_summary_keeps_two_sessions_on_the_same_date_separate():
    repository = FakeAttendanceRepo(
        records=[
            {
                "student_id": "student-one",
                "date": "2026-10-08",
                "session_id": "morning-session",
                "status": "present",
            },
            {
                "student_id": "student-one",
                "date": "2026-10-08",
                "session_id": "afternoon-session",
                "status": "absent",
            },
        ],
        students=[{"student_id": "student-one", "full_name": "Student One"}],
    )
    service = AttendanceService(repository, None, FakeClassService(), FakeScheduleRepo())

    report = asyncio.run(service.get_class_attendance_summary("class-id", "admin-id"))

    assert report["total_sessions"] == 2
    assert report["students"][0]["attendance_percentage"] == 50.0
