class NotificationController:
    def __init__(self, notification_service):
        self.notification_service = notification_service

    async def get_all_notifications(self, admin_id):
        return await self.notification_service.get_all_notifications(admin_id)

    async def get_notification(self, notification_id, admin_id):
        return await self.notification_service.get_notification(notification_id, admin_id)

    async def send_notification_to_student(self, teacher_id, student_id, message, admin_id, reference_link=None):
        return await self.notification_service.send_notification_to_student(teacher_id, student_id, message, admin_id, reference_link)

    async def send_notification_to_class_students(self, teacher_id, class_id, message, admin_id, reference_link=None):
        return await self.notification_service.send_notification_to_class_students(teacher_id, class_id, message, admin_id, reference_link)

    async def send_admin_notification(self, admin_id, message, student_id=None, class_id=None, teacher_id=None):
        return await self.notification_service.send_admin_notification(admin_id, message, student_id, class_id, teacher_id)

    async def get_admin_notifications(self, admin_id):
        return await self.notification_service.get_admin_notifications(admin_id)

    async def get_teacher_notifications(self, teacher_id, admin_id):
        return await self.notification_service.get_teacher_notifications(teacher_id, admin_id)

    async def send_teacher_message(self, teacher_id, target_type, target_id, subject, message, admin_id):
        return await self.notification_service.send_teacher_message(teacher_id, target_type, target_id, subject, message, admin_id)

    async def update_notification(self, notification_id, admin_id, **updates):
        return await self.notification_service.update_notification(notification_id, admin_id, **updates)

    async def delete_notification(self, notification_id, admin_id):
        return await self.notification_service.delete_notification(notification_id, admin_id)

    async def search_notification(self, query, admin_id):
        return await self.notification_service.search_notification(query, admin_id)

    async def count_notifications(self, admin_id):
        return await self.notification_service.count_notifications(admin_id)

    async def get_student_notifications(self, student_id, admin_id):
        return await self.notification_service.get_student_notifications(student_id, admin_id)

    async def mark_as_read(self, notification_id, student_id, admin_id):
        return await self.notification_service.mark_as_read(notification_id, student_id, admin_id)
