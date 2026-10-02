from datetime import datetime, timedelta, timezone

from models.domain_models import PaymentState

class PaymentService:
    def __init__(self, payment_repo, student_repo, teacher_repo, class_repo, notification_service):
        self.payment_repo = payment_repo
        self.student_repo = student_repo
        self.teacher_repo = teacher_repo
        self.class_repo = class_repo
        self.notification_service = notification_service

    async def summary(self, user_id, user_role, admin_id):
        state = await self.payment_repo.get(user_id, user_role, admin_id)
        paid_months = state.paid_months if state else []
        last_payment_date = state.last_payment_date if state else None
        if user_role == "student":
            user = await self.student_repo.get_student(user_id, admin_id)
            if user is None:
                raise ValueError("Student not found in your workspace.")
            class_ids = user.class_ids or ([user.class_id] if user.class_id else [])
            class_docs = [await self.class_repo.get_class(class_id, admin_id) for class_id in class_ids]
            monthly_amount = sum(item.student_monthly_fee for item in class_docs if item)
            base_date = user.date_enjoined
        else:
            user = await self.teacher_repo.get_teacher(user_id, admin_id)
            if user is None:
                raise ValueError("Teacher not found in your workspace.")
            class_ids = [item.get("class_id") for item in user.classes if item.get("class_id")]
            monthly_amount = 0.0
            for class_id in class_ids:
                class_doc = await self.class_repo.get_class(class_id, admin_id)
                if class_doc:
                    students = await self.student_repo.get_students_by_class_id(class_id, admin_id)
                    monthly_amount += class_doc.teacher_teaching_fee_per_student * len(students)
            base_date = user.date_enjoined
        reference_date = last_payment_date or base_date
        if reference_date.tzinfo is None:
            reference_date = reference_date.replace(tzinfo=timezone.utc)
        due = datetime.now(timezone.utc) - reference_date.astimezone(timezone.utc) >= timedelta(days=30)
        return {
            "user_id": user_id,
            "user_role": user_role,
            "paid_months": paid_months,
            "last_payment_date": last_payment_date.isoformat() if last_payment_date else None,
            "monthly_amount": monthly_amount,
            "total_amount": monthly_amount,
            "base_date": reference_date.isoformat(),
            "due": due,
        }

    async def update(self, user_id, user_role, paid_months, admin_id):
        current = await self.payment_repo.get(user_id, user_role, admin_id)
        previous = current.paid_months if current else []
        now = datetime.now(timezone.utc) if set(paid_months) != set(previous) else (current.last_payment_date if current else None)
        state = PaymentState(
            admin_id=admin_id,
            user_id=user_id,
            user_role=user_role,
            paid_months=paid_months,
            last_payment_date=now,
        )
        await self.payment_repo.save(state, admin_id)
        return await self.summary(user_id, user_role, admin_id)

    async def check_due(self, admin_id):
        created = 0
        for user_role, users in (("student", await self.student_repo.get_all_student(admin_id)), ("teacher", await self.teacher_repo.get_all_teachers_for_admin(admin_id))):
            for user in users:
                summary = await self.summary(user.id, user_role, admin_id)
                if not summary["due"]:
                    continue
                reference = f"payment-due:{user_role}:{user.id}:{summary['base_date'][:10]}"
                if await self.notification_service.notification_repo.exists_by_reference(reference, admin_id):
                    continue
                label = "student" if user_role == "student" else "teacher"
                await self.notification_service._create(
                    admin_id, None, admin_id, "admin", "payment_due",
                    f"Payment due for {label} {user.full_name}. Total: {summary['total_amount']:.2f} MAD.",
                    reference,
                )
                created += 1
        return {"created": created}