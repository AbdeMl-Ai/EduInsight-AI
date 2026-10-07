from datetime import datetime, timezone

from models.domain_models import Notification
from utils.notification_validation import NotificationValidator


class NotificationService:
    def __init__(self, notification_repo, student_repo, teacher_repo, admin_repo=None, class_repo=None):
        self.notification_repo = notification_repo
        self.student_repo = student_repo
        self.teacher_repo = teacher_repo
        self.admin_repo = admin_repo
        self.class_repo = class_repo

    async def _create(self, admin_id, sender_id, receiver_id, receiver_role, notification_type, message, reference_link=None):
        NotificationValidator.validation_message(message)
        doc = Notification(admin_id=admin_id, sender_id=sender_id, receiver_id=receiver_id, receiver_role=receiver_role, notification_type=notification_type, message=message, reference_link=reference_link, is_read=False, created_at=datetime.now(timezone.utc))
        return await self.notification_repo.add_notification(doc, admin_id)

    async def create_notification(self, message, teacher_id, receiver_id, admin_id, receiver_role="student", reference_link=None):
        NotificationValidator.validation_message(message)
        teacher = await self.teacher_repo.get_teacher(teacher_id, admin_id)
        if teacher is None:
            raise ValueError("Teacher not found in your workspace.")
        return await self._create(admin_id, teacher.id, receiver_id, receiver_role, "message", message, reference_link)

    async def send_notification_to_student(self, teacher_id, student_id, message, admin_id, reference_link=None):
        if await self.student_repo.get_student(student_id, admin_id) is None:
            raise ValueError("Student not found in your workspace.")
        await self.create_notification(message, teacher_id, student_id, admin_id, "student", reference_link)
        return "Notification sent to student."

    async def send_notification_to_class_students(self, teacher_id, class_id, message, admin_id, reference_link=None):
        if self.class_repo is None:
            raise ValueError("Class repository is unavailable.")
        class_doc = await self.class_repo.get_class(class_id, admin_id)
        if class_doc is None or class_doc.teacher_id != teacher_id:
            raise ValueError("Class not found in your workspace.")
        for enrollment in class_doc.embedded_students:
            await self.create_notification(message, teacher_id, enrollment["student_id"], admin_id, "student", reference_link)
        return "Notification sent to class students."

    async def send_notification_to_students(self, teacher_id, message, admin_id):
        classes = await self.class_repo.get_all_classes(admin_id)
        for class_doc in classes:
            if class_doc.teacher_id == teacher_id:
                for enrollment in class_doc.embedded_students:
                    await self.create_notification(message, teacher_id, enrollment["student_id"], admin_id, "student")
        return "Notification sent to students."

    async def send_admin_notification(self, admin_id, message, student_id=None, class_id=None, teacher_id=None):
        if sum(value is not None for value in (student_id, class_id, teacher_id)) != 1:
            raise ValueError("Choose one student, one class, or one teacher.")
        if student_id is not None:
            if await self.student_repo.get_student(student_id, admin_id) is None:
                raise ValueError("Student not found in your workspace.")
            await self._create(admin_id, None, student_id, "student", "admin_message", message)
            return "Notification sent to student."
        if teacher_id is not None:
            if await self.teacher_repo.get_teacher(teacher_id, admin_id) is None:
                raise ValueError("Teacher not found in your workspace.")
            await self._create(admin_id, None, teacher_id, "teacher", "admin_message", message)
            return "Notification sent to teacher."
        class_doc = await self.class_repo.get_class(class_id, admin_id)
        if class_doc is None:
            raise ValueError("Class not found in your workspace.")
        for enrollment in class_doc.embedded_students:
            await self._create(admin_id, None, enrollment["student_id"], "student", "admin_message", message)
        return "Notification sent to class students."

    async def get_notification(self, notification_id, admin_id):
        notification = await self.notification_repo.get_notification(notification_id, admin_id)
        if notification is None:
            raise ValueError("Notification not found.")
        return notification

    async def get_all_notifications(self, admin_id, receiver_id):
        return await self.notification_repo.get_all_notifications(admin_id, receiver_id)

    async def get_admin_notifications(self, admin_id):
        return await self.notification_repo.get_admin_notifications(admin_id)

    async def get_notification_for_receiver(self, notification_id, receiver_id, admin_id):
        notification = await self.notification_repo.get_notification_for_receiver(
            notification_id, receiver_id, admin_id
        )
        if notification is None:
            raise ValueError("Notification not found.")
        return notification

    async def get_sender_name(self, sender_id, admin_id):
        if sender_id is None:
            admin = await self.admin_repo.get_admin(admin_id)
            return (admin.full_name or admin.username or "Admin") if admin else "Admin"
        teacher = await self.teacher_repo.get_teacher(sender_id, admin_id)
        if teacher is not None:
            return teacher.full_name
        student = await self.student_repo.get_student(sender_id, admin_id)
        if student is not None:
            return student.full_name
        return "Unknown sender"

    async def get_teacher_notifications(self, teacher_id, admin_id):
        if await self.teacher_repo.get_teacher(teacher_id, admin_id) is None:
            raise ValueError("Teacher not found.")
        return await self.notification_repo.get_notifications_for_receiver(teacher_id, admin_id)

    async def send_teacher_message(self, teacher_id, target_type, target_id, subject, message, admin_id):
        body = f"{subject.strip()}\n\n{message.strip()}"
        if target_type == "admin":
            if self.admin_repo is None or await self.admin_repo.get_admin(admin_id) is None:
                raise ValueError("Admin not found.")
            await self._create(admin_id, teacher_id, admin_id, "admin", "teacher_message", body)
            return "Message sent to admin."
        if target_type == "student":
            teacher = await self.teacher_repo.get_teacher(teacher_id, admin_id)
            student = await self.student_repo.get_student(target_id, admin_id)
            assigned_class_ids = {
                str(item.get("class_id")) for item in (teacher.classes if teacher else [])
            }
            student_class_ids = {
                str(class_id)
                for class_id in (
                    student.class_ids
                    or ([student.class_id] if student and student.class_id else [])
                    if student
                    else []
                )
            }
            if not assigned_class_ids.intersection(student_class_ids):
                raise ValueError("You can only message students in your assigned classes.")
            return await self.send_notification_to_student(teacher_id, target_id, body, admin_id)
        if target_type == "class":
            return await self.send_notification_to_class_students(teacher_id, target_id, body, admin_id)
        raise ValueError("target_type must be admin, class, or student.")

    async def get_student_notifications(self, student_id, admin_id):
        if await self.student_repo.get_student(student_id, admin_id) is None:
            raise ValueError("Student not found.")
        return await self.notification_repo.get_notifications_for_receiver(student_id, admin_id)

    async def update_notification(self, notification_id, admin_id, **updates):
        await self.get_notification(notification_id, admin_id)
        if not await self.notification_repo.update_notification(notification_id, admin_id, **updates):
            raise ValueError("Notification not found or unchanged.")
        return "Notification updated successfully."

    async def mark_as_read(self, notification_id, student_id, admin_id):
        if not await self.notification_repo.mark_as_read(notification_id, student_id, admin_id):
            raise ValueError("Notification not found.")
        return "Notification marked as read."

    async def delete_notification(self, notification_id, admin_id):
        if not await self.notification_repo.delete_notification(notification_id, admin_id):
            raise ValueError("Notification not found.")
        return "Notification deleted successfully."

    async def search_notification(self, query, admin_id, receiver_id):
        if not query.strip():
            raise ValueError("Search query cannot be empty.")
        return await self.notification_repo.search_notification(
            query.strip(), admin_id, receiver_id
        )

    async def count_notifications(self, admin_id, receiver_id):
        return await self.notification_repo.count_notifications(admin_id, receiver_id)
