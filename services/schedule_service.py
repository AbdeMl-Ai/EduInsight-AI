from datetime import datetime, timedelta, timezone

from models.domain_models import ScheduleSession


class ScheduleService:
    def __init__(
        self, schedule_repo, teacher_repo, class_service, notification_service=None
    ):
        self.schedule_repo = schedule_repo
        self.teacher_repo = teacher_repo
        self.class_service = class_service
        self.notification_service = notification_service

    async def list_sessions(self, admin_id: str) -> list[dict[str, str]]:
        sessions = await self.schedule_repo.get_all(admin_id)
        teachers = {teacher.id: teacher for teacher in await self.teacher_repo.get_all_teachers(admin_id)}
        classes = {item.id: item for item in await self.class_service.get_all_classes(admin_id)}
        return [
            {
                "id": session.id,
                "teacher_id": session.teacher_id,
                "teacher_name": teachers[session.teacher_id].full_name,
                "class_id": session.class_id,
                "class_name": classes[session.class_id].class_name,
                "subject": classes[session.class_id].subject,
                "level": session.level,
                "day": session.day,
                "start_time": session.start_time,
                "end_time": session.end_time,
            }
            for session in sessions
            if session.teacher_id in teachers and session.class_id in classes
        ]

    async def create_session(self, data, admin_id: str) -> dict[str, str]:
        teacher = await self.teacher_repo.get_teacher(data.teacher_id, admin_id)
        if teacher is None:
            raise ValueError("Teacher not found in your workspace.")
        class_document = await self.class_service.get_class(data.class_id, admin_id)

        if await self.schedule_repo.has_teacher_overlap(
            teacher_id=data.teacher_id,
            day=data.day,
            start_time=data.start_time,
            end_time=data.end_time,
            admin_id=admin_id,
        ):
            raise ValueError(
                f"{teacher.full_name} already has a lesson overlapping this time on {data.day}."
            )

        session = await self.schedule_repo.create(
            ScheduleSession(
                admin_id=admin_id,
                teacher_id=data.teacher_id,
                class_id=data.class_id,
                level=data.level,
                day=data.day,
                start_time=data.start_time,
                end_time=data.end_time,
            )
        )
        if self.notification_service is not None:
            today = datetime.now(timezone.utc).date()
            target_weekday = datetime.strptime(data.day, "%A").weekday()
            session_date = today + timedelta(
                days=(target_weekday - today.weekday()) % 7
            )
            await self.notification_service.notify_teacher_session_scheduled(
                teacher.id, admin_id, data.day, session_date, data.start_time
            )
        return {
            "id": session.id,
            "teacher_id": session.teacher_id,
            "teacher_name": teacher.full_name,
            "class_id": session.class_id,
            "class_name": class_document.class_name,
            "level": session.level,
            "day": session.day,
            "start_time": session.start_time,
            "end_time": session.end_time,
        }

    async def delete_session(self, session_id: str, admin_id: str) -> None:
        if not await self.schedule_repo.delete(session_id, admin_id):
            raise ValueError("Schedule session not found.")