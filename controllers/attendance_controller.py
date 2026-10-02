class AttendanceController:
    def __init__(self, attendance_service):
        self.attendance_service = attendance_service

    async def get_class_students(self, teacher_id, class_id, admin_id):
        return await self.attendance_service.get_class_students(teacher_id, class_id, admin_id)

    async def save_attendance(self, teacher_id, class_id, attendance_date, records, admin_id):
        return await self.attendance_service.save_attendance(teacher_id, class_id, attendance_date, records, admin_id)

    async def get_teacher_history(self, teacher_id, class_id=None, month=None, admin_id=None):
        return await self.attendance_service.get_teacher_history(teacher_id, class_id, month, admin_id)

    async def get_monthly_report(self, class_id, month, admin_id):
        return await self.attendance_service.get_monthly_report(class_id, month, admin_id)
