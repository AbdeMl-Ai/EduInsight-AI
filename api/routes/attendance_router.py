from fastapi import APIRouter, Depends, HTTPException, Query

from api.dependencies import (
    attendance_controller,
    get_current_admin,
    require_teacher,
)
from api.schemas.attendance_schema import AttendanceClassSummary, AttendanceSaveRequest

router = APIRouter(tags=["Attendance"])


def attendance_response(record):
    return {
        "student_id": record["student_id"],
        "student_name": record.get("student_name"),
        "class_id": record["class_id"],
        "date": record["date"],
        "session_id": record.get("session_id"),
        "status": record["status"],
    }


@router.get("/teachers/me/attendance/classes/{class_id}/students")
async def get_class_students_for_attendance(
    class_id: str,
    current_user=Depends(require_teacher),
):
    try:
        return await attendance_controller.get_class_students(current_user.id, class_id, current_user.admin_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/teachers/me/attendance")
async def save_attendance(
    data: AttendanceSaveRequest,
    current_user=Depends(require_teacher),
):
    try:
        return await attendance_controller.save_attendance(
            current_user.id,
            data.class_id,
            data.date,
            [record.model_dump() for record in data.records],
            current_user.admin_id,
            data.session_id,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/teachers/me/attendance")
async def get_teacher_attendance_history(
    class_id: str | None = None,
    month: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}$"),
    current_user=Depends(require_teacher),
):
    try:
        records = await attendance_controller.get_teacher_history(
            current_user.id, class_id, month, current_user.admin_id
        )
        return [attendance_response(record) for record in records]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/admin/attendance/report")
async def get_monthly_attendance_report(
    class_id: str,
    month: str = Query(pattern=r"^\d{4}-\d{2}$"),
    _admin=Depends(get_current_admin),
):
    try:
        records = await attendance_controller.get_monthly_report(class_id, month, _admin.id)
        return [attendance_response(record) for record in records]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/admin/attendance/report/summary", response_model=AttendanceClassSummary)
async def get_class_attendance_summary(
    class_id: str,
    _admin=Depends(get_current_admin),
):
    try:
        return await attendance_controller.get_class_attendance_summary(class_id, _admin.id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
