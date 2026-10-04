from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from api.dependencies import (
    admin_controller,
    class_controller,
    course_controller,
    get_current_admin,
    material_controller,
    notification_controller,
    require_student,
    require_student_workspace,
    student_controller,
    submission_controller,
)
from api.schemas.admin_schemas import AdminStudentCreate
from api.schemas.student_schema import StudentCreate, StudentResponse, StudentUpdate
from utils.submission_storage import delete_submission_file, save_submission_file

router = APIRouter(prefix="/students", tags=["Students"])


def _student(student):
    return {"student_id": student.id, "admin_id": student.admin_id, "parent_id": student.parent_id, "full_name": student.full_name, "age": student.age, "level_academy": student.level_academy, "date_enjoined": student.date_enjoined, "email": student.email, "phone_number": student.phone_number, "level": student.level, "class_id": student.class_id, "class_ids": student.class_ids}


def _submission(item):
    return {"id": item.id, "admin_id": item.admin_id, "student_id": item.student_id, "class_id": item.class_id, "exercise_id": item.exercise_id, "submission_status": item.submission_status, "file_path": item.file_path, "student_note": item.student_note, "score": item.score, "submitted_at": item.submitted_at, "graded_at": item.graded_at}


def _is_registered_user(user) -> bool:
    return getattr(user, "_token_role", None) == "user"


@router.get("/me", response_model=StudentResponse)
async def get_my_profile(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return StudentResponse(
            student_id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone_number=user.phone_number or "",
            date_enjoined=user.created_at,
        )
    return await student_controller.get_my_profile(user)


@router.get("/me/classes")
async def get_my_classes(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return []
    class_ids = user.class_ids or ([user.class_id] if user.class_id else [])
    classes = []
    for class_id in class_ids:
        try:
            class_group = await class_controller.get_class(class_id, user.admin_id)
        except ValueError:
            continue
        classes.append({
            "id": class_group.id,
            "class_name": class_group.class_name,
            "class_level": class_group.class_level,
            "subject": class_group.subject,
        })
    return classes


@router.put("/me", response_model=StudentResponse)
async def update_my_profile(data: StudentUpdate, user=Depends(require_student)):
    updates = data.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No data to update")
    if {"class_id", "class_ids", "parent_id", "level_academy"}.intersection(updates):
        raise HTTPException(status_code=403, detail="Only administrators can update student enrollment and academic level.")
    return await student_controller.update_my_profile(user, updates)


@router.get("/me/courses")
async def get_my_courses(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return []
    tenant = user.admin_id
    class_ids = user.class_ids or ([user.class_id] if user.class_id else [])
    if class_ids:
        courses = await course_controller.get_courses_by_class_ids(class_ids, tenant)
    else:
        courses = await course_controller.get_courses_by_level(user.level_academy or user.level, tenant)
    result = []
    for course in courses:
        result.append({"id": course.id, "title": course.title, "description": course.description, "teacher_id": course.teacher_id, "class_id": course.class_id, "material_file_path": await material_controller.get_latest_path("course", course.id, tenant)})
    return result


@router.get("/me/exercises")
async def get_my_exercises(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return []
    class_ids = user.class_ids or ([user.class_id] if user.class_id else [])
    exercises = await student_controller.get_my_exercises(user.id, class_ids, user.admin_id)
    return [{"id": exercise.id, "course_id": exercise.course_id, "class_id": exercise.class_id, "course_title": exercise.course_title, "file_path": exercise.file_path, "material_file_path": await material_controller.get_latest_path("exercise", exercise.id, user.admin_id), "max_score": exercise.max_score, "score": exercise.score, "submission_status": exercise.submission_status} for exercise in exercises]


@router.get("/me/submissions")
async def get_my_submissions(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return []
    return [_submission(item) for item in await submission_controller.get_submissions_by_student(user.id, user.admin_id)]


@router.post("/me/submissions")
async def create_my_submission(exercise_id: str = Form(...), file: UploadFile = File(...), student_note: str = Form("", max_length=1000), user=Depends(require_student)):
    file_path = await save_submission_file(file, exercise_id, user.id)
    try:
        return _submission(await submission_controller.create_submission(user.id, exercise_id, file_path, user.admin_id, student_note))
    except ValueError as error:
        await delete_submission_file(file_path)
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.put("/me/submissions/{submission_id}")
async def replace_my_submission(submission_id: str, file: UploadFile = File(...), student_note: str | None = Form(None, max_length=1000), user=Depends(require_student)):
    new_path = None
    try:
        submission = await submission_controller.get_submission(submission_id, user.admin_id)
        if submission.student_id != user.id:
            raise HTTPException(status_code=403, detail="You can only edit your own submissions.")
        new_path = await save_submission_file(file, submission.exercise_id, user.id)
        updates = {"file_path": new_path}
        if student_note is not None:
            updates["student_note"] = student_note.strip()
        await submission_controller.update_submission(submission_id, user.admin_id, **updates)
        await delete_submission_file(submission.file_path)
        return _submission(await submission_controller.get_submission(submission_id, user.admin_id))
    except ValueError as error:
        if new_path is not None:
            await delete_submission_file(new_path)
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.delete("/me/submissions/{submission_id}")
async def delete_my_submission(submission_id: str, user=Depends(require_student)):
    try:
        submission = await submission_controller.get_submission(submission_id, user.admin_id)
        if submission.student_id != user.id:
            raise HTTPException(status_code=403, detail="You can only delete your own submissions.")
        await submission_controller.delete_submission(submission_id, user.admin_id)
        await delete_submission_file(submission.file_path)
        return {"message": "Submission deleted successfully."}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/me/grades")
async def get_my_scores(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return []
    submissions = await submission_controller.get_submissions_by_student(user.id, user.admin_id)
    return [{"submission_id": item.id, "score": item.score, "exercise_id": item.exercise_id, "graded_at": item.graded_at} for item in submissions if item.score is not None]


@router.get("/me/notifications")
async def get_my_notifications(user=Depends(require_student_workspace)):
    if _is_registered_user(user):
        return []
    notifications = await notification_controller.get_student_notifications(user.id, user.admin_id)
    return [{"student_notification_id": item.id, "notification_id": item.id, "title": item.notification_type, "message": item.message, "is_read": item.is_read, "created_at": item.created_at, "admin_id": item.admin_id, "sender_id": item.sender_id, "receiver_id": item.receiver_id, "receiver_role": item.receiver_role, "notification_type": item.notification_type, "reference_link": item.reference_link} for item in notifications]


@router.get("/", response_model=list[StudentResponse])
async def list_students(admin=Depends(get_current_admin)):
    return [_student(item) for item in await student_controller.get_all_students(admin.id)]


@router.post("/", response_model=StudentResponse)
async def create_student(data: StudentCreate, admin=Depends(get_current_admin)):
    try:
        admin_data = AdminStudentCreate(
            full_name=data.full_name,
            email=data.email,
            phone_number=data.phone_number,
            level=data.level_academy,
            age=data.age,
            parent_id=data.parent_id,
            class_id=data.class_id,
            class_ids=data.class_ids,
        )
        student = await admin_controller.create_student(admin_data, admin.id)
        return _student(student)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error


@router.get("/search", response_model=list[StudentResponse])
async def search_students(full_name: str, admin=Depends(get_current_admin)):
    return [_student(item) for item in await student_controller.search_student(full_name, admin.id)]


@router.get("/count")
async def count_students(admin=Depends(get_current_admin)):
    return {"count": await student_controller.count_students(admin.id)}


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str, admin=Depends(get_current_admin)):
    try:
        return _student(await student_controller.get_student(student_id, admin.id))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.put("/{student_id}")
async def update_student(student_id: str, data: StudentUpdate, admin=Depends(get_current_admin)):
    try:
        return {"message": await admin_controller.update_student(student_id, data.model_dump(exclude_none=True), admin.id)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{student_id}")
async def delete_student(student_id: str, admin=Depends(get_current_admin)):
    try:
        return {"message": await student_controller.delete_student(student_id, admin.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
