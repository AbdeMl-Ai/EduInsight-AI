from bson import ObjectId

from models.domain_models import ScheduleSession


class ScheduleRepo:
    def __init__(self, db):
        self.collection = db["schedules"]

    @staticmethod
    def _id(value: str) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("schedule/reference ID must be a valid ObjectId")
        return ObjectId(value)

    async def get_all(self, admin_id: str) -> list[ScheduleSession]:
        cursor = self.collection.find({"admin_id": admin_id}).sort(
            [("day", 1), ("start_time", 1)]
        )
        return [ScheduleSession.model_validate(item) async for item in cursor]

    async def has_teacher_overlap(
        self,
        *,
        teacher_id: str,
        day: str,
        start_time: str,
        end_time: str,
        admin_id: str,
    ) -> bool:
        conflict = await self.collection.find_one(
            {
                "admin_id": admin_id,
                "teacher_id": self._id(teacher_id),
                "day": day,
                "start_time": {"$lt": end_time},
                "end_time": {"$gt": start_time},
            },
            {"_id": 1},
        )
        return conflict is not None

    async def create(self, session: ScheduleSession) -> ScheduleSession:
        payload = session.model_dump(exclude={"id"})
        payload["teacher_id"] = self._id(payload["teacher_id"])
        payload["class_id"] = self._id(payload["class_id"])
        result = await self.collection.insert_one(payload)
        return ScheduleSession.model_validate({"_id": result.inserted_id, **payload})

    async def delete(self, session_id: str, admin_id: str) -> bool:
        result = await self.collection.delete_one(
            {"_id": self._id(session_id), "admin_id": admin_id}
        )
        return result.deleted_count == 1