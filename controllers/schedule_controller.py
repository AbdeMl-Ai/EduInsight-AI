class ScheduleController:
    def __init__(self, schedule_service):
        self.schedule_service = schedule_service

    async def list_sessions(self, admin_id: str):
        return await self.schedule_service.list_sessions(admin_id)

    async def create_session(self, data, admin_id: str):
        return await self.schedule_service.create_session(data, admin_id)

    async def delete_session(self, session_id: str, admin_id: str):
        return await self.schedule_service.delete_session(session_id, admin_id)