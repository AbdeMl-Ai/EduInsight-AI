from datetime import date


class AttendanceService:
    VALID_STATUSES = {"present", "absent"}

    def __init__(self, attendance_repo, teacher_repo, class_service, schedule_repo):
        self.attendance_repo = attendance_repo
        self.teacher_repo = teacher_repo
        self.class_service = class_service
        self.schedule_repo = schedule_repo

    async def get_class_students(self, teacher_id, class_id, admin_id):
        await self._require_teacher_class(teacher_id, class_id, admin_id)
        return await self.attendance_repo.get_students_by_class(class_id, admin_id)

    async def save_attendance(self, teacher_id, class_id, attendance_date, records, admin_id, session_id=None):
        await self._require_teacher_class(teacher_id, class_id, admin_id)
        if session_id is not None:
            session = await self.schedule_repo.get_session(session_id, admin_id)
            if (
                session is None
                or session.class_id != str(class_id)
                or session.teacher_id != teacher_id
                or session.day != attendance_date.strftime("%A")
            ):
                raise ValueError("The scheduled session does not match this class, teacher, or date.")
        if not records:
            raise ValueError("Attendance records are required.")
        if any(record["status"] not in self.VALID_STATUSES for record in records):
            raise ValueError("Attendance status must be present or absent.")
        if len({record["student_id"] for record in records}) != len(records):
            raise ValueError("Each student can appear only once per attendance date.")
        students = await self.attendance_repo.get_students_by_class(class_id, admin_id)
        if not {item["student_id"] for item in records} <= {item["student_id"] for item in students}:
            raise ValueError("All students must belong to the selected class.")
        await self.attendance_repo.save_attendance(
            class_id, attendance_date.isoformat(), records, admin_id, session_id
        )
        return {"message": "Attendance saved successfully."}

    async def get_teacher_history(self, teacher_id, class_id=None, month=None, admin_id=None):
        if class_id is not None:
            await self._require_teacher_class(teacher_id, class_id, admin_id)
        self._validate_month(month)
        return await self.attendance_repo.get_teacher_history(teacher_id, class_id, month, admin_id)

    async def get_monthly_report(self, class_id, month, admin_id):
        await self.class_service.get_class(class_id, admin_id)
        self._validate_month(month)
        return await self.attendance_repo.get_monthly_report(class_id, month, admin_id)

    async def get_class_attendance_summary(self, class_id, admin_id):
        await self.class_service.get_class(class_id, admin_id)
        data = await self.attendance_repo.get_class_attendance_data(class_id, admin_id)
        records = data["records"]
        session_keys = {
            (record.get("session_id") or "legacy", record["date"])
            for record in records
        }
        total_sessions = len(session_keys)
        present_dates = {}
        for record in records:
            if record["status"] == "present":
                session_key = (record.get("session_id") or "legacy", record["date"])
                present_dates.setdefault(record["student_id"], set()).add(session_key)

        students = []
        for student in data["students"]:
            present_sessions = len(present_dates.get(student["student_id"], set()))
            students.append(
                {
                    "student_id": student["student_id"],
                    "student_name": student["full_name"],
                    "present_sessions": present_sessions,
                    "absent_sessions": total_sessions - present_sessions,
                    "total_sessions": total_sessions,
                    "attendance_percentage": (
                        round(present_sessions / total_sessions * 100, 2)
                        if total_sessions
                        else 0.0
                    ),
                }
            )

        return {
            "class_id": str(class_id),
            "total_sessions": total_sessions,
            "students": students,
        }

    async def _require_teacher_class(self, teacher_id, class_id, admin_id):
        await self.class_service.get_class(class_id, admin_id)
        if await self.teacher_repo.get_teacher_id_for_class(class_id, admin_id) != teacher_id:
            raise ValueError("You can only manage attendance for your assigned classes.")

    @staticmethod
    def _validate_month(month):
        if month is None:
            return
        try:
            date.fromisoformat(f"{month}-01")
        except ValueError as error:
            raise ValueError("Month must use YYYY-MM format.") from error
