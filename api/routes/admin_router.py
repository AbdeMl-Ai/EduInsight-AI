from fastapi import APIRouter, Depends, HTTPException, Query

from api.dependencies import (
    admin_controller,
    analytics_service,
    class_controller,
    get_current_admin,
    notification_controller,
    payment_service,
    student_payment_repo,
    schedule_controller,
    student_controller,
    teacher_controller,
    user_repo,
)
from api.schemas.admin_schemas import (
    AdminStudentCreate,
    AdminStudentReportResponse,
    AdminStudentUpdate,
    AdminProfileResponse,
    AdminProfileUpdate,
    AdminSetupRequest,
    AdminStudentPasswordReset,
    AdminUserCreate,
    AdminScheduleCreate,
    AdminScheduleResponse,
    AdminTeacherCreate,
    AdminTeacherUpdate,
    TeacherClassAssignment,
    ClassCreate,
    ClassResponse,
    ClassUpdate,
    PaymentSummary,
    PaymentUpdate,
    RevenueAttendanceResponse,
    StudentPaymentCreate,
    StudentPaymentResponse,
)
from api.schemas.notification_schema import AdminNotificationCreate
from models.domain_models import ClassDocument, StudentPayment
from utils.passwords import hash_password

router = APIRouter(prefix="/admin", tags=["admin"])


def student_response(student):
    return {
        "student_id": student.id,
        "admin_id": student.admin_id,
        "parent_id": student.parent_id,
        "full_name": student.full_name,
        "age": student.age,
        "level_academy": student.level_academy,
        "date_enjoined": student.date_enjoined,
        "email": student.email,
        "phone_number": student.phone_number,
        "level": student.level,
        "class_id": student.class_id,
        "class_ids": student.class_ids,
    }


def teacher_response(teacher):
    return {
        "teacher_id": teacher.id,
        "admin_id": teacher.admin_id,
        "full_name": teacher.full_name,
        "email": teacher.email,
        "phone_number": teacher.phone_number,
        "age": teacher.age,
        "is_state_teacher": teacher.is_state_teacher,
        "specialties": teacher.specialties,
        "date_enjoined": teacher.date_enjoined,
        "classes": [
            {
                "class_id": class_group.get("class_id", ""),
                "name": class_group.get("name", ""),
                "academic_year": class_group.get("academic_year", ""),
            }
            for class_group in teacher.classes
        ],
    }


def class_response(class_group, teacher_name=""):
    return {
        "id": class_group.id,
        "admin_id": class_group.admin_id,
        "teacher_id": class_group.teacher_id,
        "teacher_name": teacher_name,
        "class_name": class_group.class_name,
        "subject": class_group.subject,
        "class_level": class_group.class_level,
        "center_rent_fee_per_student": class_group.center_rent_fee_per_student,
        "teacher_teaching_fee_per_student": class_group.teacher_teaching_fee_per_student,
        "student_monthly_fee": class_group.student_monthly_fee,
    }


async def notification_response(notification):
    sender_name = await notification_controller.get_sender_name(
        notification.sender_id, notification.admin_id
    )
    return {
        "id": notification.id,
        "admin_id": notification.admin_id,
        "sender_id": notification.sender_id,
        "receiver_id": notification.receiver_id,
        "receiver_role": notification.receiver_role,
        "notification_type": notification.notification_type,
        "message": notification.message,
        "reference_link": notification.reference_link,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
        "notification_id": notification.id,
        "title": sender_name,
        "sender_name": sender_name,
        "teacher_id": notification.sender_id or "",
        "teacher_name": sender_name,
    }


@router.post("/setup")
async def setup_admin(data: AdminSetupRequest):
    try:
        admin = await admin_controller.setup_admin(
            data.name,
            data.email,
            data.phone_number,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    return {
        "message": "Admin account ready.",
        "admin_id": admin.admin_id,
        "email": admin.email,
        "phone_number": admin.phone_number,
    }


@router.post("/users/create")
async def create_user(data: AdminUserCreate, _admin=Depends(get_current_admin)):
    if data.role not in ["student", "teacher", "parent"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be student, teacher, or parent.")
        
    existing_user = await user_repo.get_by_email(data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    hashed_password = hash_password(data.password)
    
    user = await user_repo.create(
        email=data.email,
        full_name=data.name,
        role=data.role,
        hashed_password=hashed_password,
        admin_id=_admin.admin_id
    )
    
    return {"message": "User created successfully", "user_id": str(user.id)}


@router.get("/me", response_model=AdminProfileResponse)
async def get_my_profile(admin=Depends(get_current_admin)):
    return await admin_controller.get_profile(admin.admin_id)


@router.put("/me", response_model=AdminProfileResponse)
async def update_my_profile(data: AdminProfileUpdate, admin=Depends(get_current_admin)):
    try:
        return await admin_controller.update_profile(
            admin.admin_id,
            data.model_dump(exclude_none=True),
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/classes", response_model=ClassResponse)
async def create_class(data: ClassCreate, _admin=Depends(get_current_admin)):
    try:
        created_class = await admin_controller.create_class(
            ClassDocument(admin_id=_admin.admin_id, **data.model_dump()),
            _admin.admin_id,
        )
        teacher = await teacher_controller.get_teacher(created_class.teacher_id, _admin.admin_id)
        return class_response(created_class, teacher.full_name)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/classes", response_model=list[ClassResponse])
async def list_classes(_admin=Depends(get_current_admin)):
    classes = await admin_controller.get_classes(_admin.admin_id)
    teachers = await teacher_controller.get_all_teachers(_admin.admin_id)
    teacher_names = {teacher.id: teacher.full_name for teacher in teachers if teacher.id is not None}
    return [class_response(item, teacher_names.get(item.teacher_id, "")) for item in classes]


@router.get("/classes/{class_id}/students")
async def list_class_students(class_id: str, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_class_access(class_id, _admin.admin_id)
        students = await student_controller.get_students_by_class_ids([class_id], _admin.admin_id)
        return [student_response(student) for student in students]
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/schedule", response_model=list[AdminScheduleResponse])
async def list_schedule(_admin=Depends(get_current_admin)):
    return await schedule_controller.list_sessions(_admin.admin_id)


@router.post("/schedule", response_model=AdminScheduleResponse, status_code=201)
async def create_schedule_session(
    data: AdminScheduleCreate,
    _admin=Depends(get_current_admin),
):
    try:
        return await schedule_controller.create_session(data, _admin.admin_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/schedule/{session_id}")
async def delete_schedule_session(session_id: str, _admin=Depends(get_current_admin)):
    try:
        await schedule_controller.delete_session(session_id, _admin.admin_id)
        return {"message": "Schedule session deleted."}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/stats")
async def workspace_stats(_admin=Depends(get_current_admin)):
    return {
        "total_students": await student_controller.count_students(_admin.admin_id),
        "teaching_staff": await teacher_controller.count_teachers(_admin.admin_id),
        "active_classes": len(await admin_controller.get_classes(_admin.admin_id)),
    }


@router.put("/classes/{class_id}")
async def update_class(class_id: str, data: ClassUpdate, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_class_access(class_id, _admin.admin_id)
        return {"message": await admin_controller.admin_service.class_service.update_class(
            class_id, _admin.admin_id, data.model_dump(exclude_none=True)
        )}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.delete("/classes/{class_id}")
async def delete_class(class_id: str, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_class_access(class_id, _admin.admin_id)
        return {"message": await admin_controller.admin_service.class_service.delete_class(class_id, _admin.admin_id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post("/students")
async def create_student(data: AdminStudentCreate, _admin=Depends(get_current_admin)):
    try:
        return student_response(await admin_controller.create_student(data, _admin.id))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/students")
async def list_students(_admin=Depends(get_current_admin)):
    return [student_response(item) for item in await admin_controller.get_students(_admin.id)]


@router.get("/students/search")
async def search_students(full_name: str, _admin=Depends(get_current_admin)):
    return [student_response(item) for item in await student_controller.search_student(full_name, _admin.id)]


@router.put("/students/{student_id}")
async def update_student(student_id: str, data: AdminStudentUpdate, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_student_access(student_id, _admin.id)
        student = await student_controller.get_student(student_id, _admin.id)
        updates = data.model_dump(exclude_none=True)
        message = await admin_controller.update_student(
            student_id, data.model_dump(exclude_none=True), _admin.id
        )
        await user_repo.update_student_login_identity(
            old_email=student.email,
            email=updates.get("email", student.email),
            full_name=updates.get("full_name", student.full_name),
            admin_id=_admin.id,
        )
        return {"message": message}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.put("/students/{student_id}/password")
async def reset_student_password(
    student_id: str,
    data: AdminStudentPasswordReset,
    _admin=Depends(get_current_admin),
):
    try:
        await admin_controller.assert_student_access(student_id, _admin.id)
        student = await student_controller.get_student(student_id, _admin.id)
        await user_repo.set_student_password(
            email=student.email,
            full_name=student.full_name,
            admin_id=_admin.id,
            hashed_password=hash_password(data.password),
        )
        return {"message": "Student login password reset successfully."}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/students/{student_id}")
async def delete_student(student_id: str, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_student_access(student_id, _admin.id)
        return {"message": await student_controller.delete_student(student_id, _admin.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/students/{student_id}/report", response_model=AdminStudentReportResponse)
async def student_report(student_id: str, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_student_access(student_id, _admin.id)
        return await admin_controller.get_student_report(student_id, _admin.id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/payments/check-due")
async def check_payment_due(_admin=Depends(get_current_admin)):
    try:
        return await payment_service.check_due(_admin.admin_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/payments/{user_id}", response_model=PaymentSummary)
async def get_payment_summary(user_id: str, user_role: str, _admin=Depends(get_current_admin)):
    try:
        if user_role not in {"student", "teacher"}:
            raise ValueError("user_role must be student or teacher.")
        return await payment_service.summary(user_id, user_role, _admin.admin_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.put("/payments/{user_id}", response_model=PaymentSummary)
async def update_payment_state(user_id: str, data: PaymentUpdate, _admin=Depends(get_current_admin)):
    try:
        return await payment_service.update(user_id, data.user_role, data.paid_months, _admin.admin_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/analytics/revenue-attendance", response_model=RevenueAttendanceResponse)
async def revenue_attendance(
    month: str = Query(pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    _admin=Depends(get_current_admin),
):
    return await analytics_service.revenue_attendance(_admin.admin_id, month)


@router.post(
    "/payments/transactions/",
    response_model=StudentPaymentResponse,
    status_code=201,
    include_in_schema=False,
)
@router.post(
    "/payments/transactions",
    response_model=StudentPaymentResponse,
    status_code=201,
)
async def record_student_payment(
    data: StudentPaymentCreate,
    _admin=Depends(get_current_admin),
):
    try:
        payment = StudentPayment(
            admin_id=_admin.admin_id,
            **data.model_dump(),
        )
        return await student_payment_repo.create(payment, _admin.admin_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/students/{student_id}/class/{class_id}")
async def assign_student(student_id: str, class_id: str, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_student_access(student_id, _admin.id)
        await admin_controller.assert_class_access(class_id, _admin.id)
        return {"message": await admin_controller.assign_student_to_class(student_id, class_id, _admin.id)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/teachers")
async def create_teacher(data: AdminTeacherCreate, _admin=Depends(get_current_admin)):
    try:
        return teacher_response(await admin_controller.create_teacher(data, _admin.id))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/teachers")
async def list_teachers(_admin=Depends(get_current_admin)):
    return [teacher_response(item) for item in await admin_controller.get_teachers(_admin.id)]


@router.get("/teachers/search")
async def search_teachers(full_name: str, _admin=Depends(get_current_admin)):
    return [teacher_response(item) for item in await teacher_controller.search_teacher(full_name, _admin.id)]


@router.put("/teachers/{teacher_id}")
async def update_teacher(teacher_id: str, data: AdminTeacherUpdate, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_teacher_access(teacher_id, _admin.id)
        return {"message": await admin_controller.update_teacher(
            teacher_id, data.model_dump(exclude_none=True), _admin.id
        )}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.put("/teachers/{teacher_id}/password")
async def reset_teacher_password(
    teacher_id: str,
    data: AdminStudentPasswordReset,
    _admin=Depends(get_current_admin),
):
    try:
        await admin_controller.assert_teacher_access(teacher_id, _admin.id)
        teacher = await teacher_controller.get_teacher(teacher_id, _admin.id)
        await user_repo.set_teacher_password(
            email=teacher.email,
            full_name=teacher.full_name,
            admin_id=_admin.id,
            hashed_password=hash_password(data.password),
        )
        return {"message": "Teacher login password reset successfully."}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/teachers/{teacher_id}")
async def delete_teacher(teacher_id: str, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_teacher_access(teacher_id, _admin.id)
        return {"message": await teacher_controller.delete_teacher(teacher_id, _admin.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post("/teachers/{teacher_id}/classes")
async def assign_teacher(teacher_id: str, data: TeacherClassAssignment, _admin=Depends(get_current_admin)):
    try:
        await admin_controller.assert_teacher_access(teacher_id, _admin.id)
        for class_id in data.class_ids:
            await admin_controller.assert_class_access(class_id, _admin.id)
        teacher = await teacher_controller.get_teacher(teacher_id, _admin.id)
        existing_class_ids = {
            class_group.get("class_id") for class_group in teacher.classes
        }
        all_class_ids = list(dict.fromkeys([*sorted(existing_class_ids), *data.class_ids]))
        return {"message": await admin_controller.assign_teacher_to_classes(
            teacher_id,
            all_class_ids,
            _admin.id,
        )}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/notifications")
async def list_admin_notifications(admin=Depends(get_current_admin)):
    notifications = await notification_controller.get_admin_notifications(admin.id)
    return [await notification_response(item) for item in notifications]


@router.post("/notifications")
async def send_admin_notification(
    data: AdminNotificationCreate,
    admin=Depends(get_current_admin),
):
    try:
        result = await notification_controller.send_admin_notification(
            admin.id,
            data.message,
            student_id=data.student_id,
            class_id=data.class_id,
            teacher_id=data.teacher_id,
        )
        return {"message": result}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))