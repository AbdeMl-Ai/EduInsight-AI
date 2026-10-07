import logging
from datetime import datetime

from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, UploadFile

from api.dependencies import (
    class_controller,
    course_controller,
    exercise_controller,
    get_current_admin,
    material_controller,
    notification_controller,
    require_teacher,
    student_controller,
    submission_controller,
    schedule_controller,
    teacher_controller,
)
from api.schemas.course_schema import CourseResponse
from api.schemas.exercise_schema import ExerciseResponse
from api.schemas.notification_schema import TeacherMessageCreate, TeacherNotificationCreate
from api.schemas.teacher_schema import TeacherCreate, TeacherGradedWorkCreate, TeacherResponse, TeacherUpdate
from utils.submission_storage import save_material_file

router = APIRouter(tags=["Teachers"])
logger = logging.getLogger(__name__)


def _teacher(teacher):
    return {"teacher_id": teacher.id, "admin_id": teacher.admin_id, "full_name": teacher.full_name, "email": teacher.email, "phone_number": teacher.phone_number, "age": teacher.age, "is_state_teacher": teacher.is_state_teacher, "specialties": teacher.specialties, "date_enjoined": teacher.date_enjoined, "classes": teacher.classes}


def _course(course):
    return {"id": course.id, "admin_id": course.admin_id, "teacher_id": course.teacher_id, "class_id": course.class_id, "title": course.title, "description": course.description, "content_url": course.content_url, "created_at": course.created_at}


def _exercise(exercise):
    return {"id": exercise.id, "admin_id": exercise.admin_id, "teacher_id": exercise.teacher_id, "class_id": exercise.class_id, "course_id": exercise.course_id, "course_title": exercise.course_title, "file_path": exercise.file_path, "max_score": exercise.max_score, "description": exercise.description, "due_date": exercise.due_date, "created_at": exercise.created_at}


@router.get("/me", response_model=TeacherResponse)
async def get_my_profile(user=Depends(require_teacher)):
    profile = _teacher(user)
    class_ids = [item["class_id"] for item in user.classes]
    try:
        students = await student_controller.get_students_by_class_ids(class_ids, user.admin_id)
    except Exception:
        logger.exception("Unable to aggregate students for teacher %s", user.id)
        students = []
    profile.update(active_classes=len(class_ids), total_students=len({student.id for student in students}))
    return profile


@router.get("/me/classes")
@router.get("/classes")
async def get_my_classes(user=Depends(require_teacher)):
    classes = []
    for item in user.classes:
        try:
            class_doc = await class_controller.get_class(item["class_id"], user.admin_id)
        except Exception:
            logger.exception("Skipping invalid class %s for teacher %s", item.get("class_id"), user.id)
            class_doc = None
        if class_doc is not None:
            classes.append({"class_id": class_doc.id, "name": class_doc.class_name, "academic_year": class_doc.class_level, "subject": class_doc.subject})
        else:
            classes.append({"class_id": item["class_id"], "name": item.get("name", "Assigned class"), "academic_year": item.get("academic_year", ""), "subject": item.get("subject", "")})
    return classes


@router.get("/me/classes/{class_id}/students")
@router.get("/classes/{class_id}/students")
async def get_my_class_students(class_id: str, user=Depends(require_teacher)):
    assigned = {item["class_id"] for item in user.classes}
    if class_id not in assigned:
        raise HTTPException(status_code=403, detail="You can only view students in your assigned classes.")
    students = await student_controller.get_students_by_class_ids([class_id], user.admin_id)
    return [{"student_id": student.id, "full_name": student.full_name, "email": student.email, "class_id": class_id} for student in students]


@router.get("/me/schedule")
@router.get("/schedule")
async def get_my_schedule(user=Depends(require_teacher)):
    try:
        sessions = await schedule_controller.list_sessions(user.admin_id)
    except Exception:
        logger.exception("Unable to load schedule for teacher %s", user.id)
        return []
    return [session for session in sessions if session.get("teacher_id") == user.id]


@router.get("/me/notifications")
@router.get("/notifications")
async def get_my_notifications(user=Depends(require_teacher)):
    notifications = await notification_controller.get_teacher_notifications(user.id, user.admin_id)
    results = []
    for item in notifications:
        sender_name = await notification_controller.get_sender_name(
            item.sender_id, user.admin_id
        )
        results.append({
            "id": item.id,
            "sender_id": item.sender_id,
            "sender_name": sender_name,
            "title": sender_name,
            "message": item.message,
            "notification_type": item.notification_type,
            "is_read": item.is_read,
            "created_at": item.created_at,
            "reference_link": item.reference_link,
        })
    return results


@router.post("/messages")
@router.post("/me/messages")
async def send_my_message(data: TeacherMessageCreate, user=Depends(require_teacher)):
    try:
        return {"message": await notification_controller.send_teacher_message(user.id, data.target_type, data.target_id, data.subject, data.message, user.admin_id)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.put("/me")
async def update_my_profile(data: TeacherUpdate, user=Depends(require_teacher)):
    updates = data.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No data to update")
    return {"message": await teacher_controller.update_teacher(user.id, user.admin_id, **updates)}


@router.get("/me/courses", response_model=list[CourseResponse])
@router.get("/courses", response_model=list[CourseResponse])
async def get_my_courses(user=Depends(require_teacher)):
    courses = await course_controller.get_courses_by_teacher(user.id, user.admin_id)
    return [_course(course) for course in courses]


@router.post("/me/courses", response_model=CourseResponse)
@router.post("/courses", response_model=CourseResponse)
async def create_my_course(
    title: str = Form(...),
    class_id: str = Form(...),
    description: str = Form(""),
    content_url: str = Form(""),
    file: UploadFile | None = File(None),
    user=Depends(require_teacher),
):
    try:
        if not any(item.get("class_id") == class_id for item in user.classes):
            raise ValueError("You can only create courses for your assigned classes.")
        course = await course_controller.create_course(title, description, user.id, class_id, user.admin_id, content_url)
        if file is not None:
            path = await save_material_file(file, "course", course.id)
            await material_controller.add_material("course", course.id, path, user.admin_id)
        return _course(course)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.put("/me/courses/{course_id}")
@router.put("/courses/{course_id}")
async def update_my_course(
    course_id: str,
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile | None = File(None),
    user=Depends(require_teacher),
):
    try:
        course = await course_controller.get_course(course_id, user.admin_id)
        if course.teacher_id != user.id:
            raise ValueError("You can only manage your own courses.")
        if title.strip() != course.title or description != course.description:
            await course_controller.update_course(
                course_id,
                user.admin_id,
                user.id,
                title=title.strip(),
                description=description,
            )
        if file is not None:
            if not file.filename:
                raise ValueError("The selected course file has no filename.")
            path = await save_material_file(file, "course", course.id)
            await material_controller.add_material("course", course.id, path, user.admin_id)
        return {"message": "Course updated successfully."}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/me/exercises", response_model=list[ExerciseResponse])
@router.get("/exercises", response_model=list[ExerciseResponse])
async def get_my_exercises(user=Depends(require_teacher)):
    exercises = await exercise_controller.get_exercises_by_teacher(user.id, user.admin_id)
    return [_exercise(item) for item in exercises]


@router.put("/me/exercises/{exercise_id}")
@router.put("/exercises/{exercise_id}")
async def update_my_exercise(
    exercise_id: str,
    course_title: str | None = Form(None),
    max_score: float | None = Form(None),
    file: UploadFile | None = File(None),
    user=Depends(require_teacher),
):
    try:
        exercise = await exercise_controller.get_exercise(exercise_id, user.admin_id)
        if exercise.teacher_id != user.id:
            raise ValueError("You can only manage your own exercises.")
        updates = {}
        if course_title is not None:
            updates["course_title"] = course_title.strip()
        if max_score is not None:
            updates["max_score"] = max_score
        if file is not None:
            if not file.filename:
                raise ValueError("The selected exercise file has no filename.")
            updates["file_path"] = await save_material_file(
                file, "exercise", exercise_id
            )
        if not updates:
            raise ValueError("Provide an exercise title, max score, or replacement file.")
        await exercise_controller.update_exercise(
            exercise_id, user.id, user.admin_id, **updates
        )
        return {"message": "Exercise updated successfully."}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/me/graded-work", response_model=ExerciseResponse)
@router.post("/exercises", response_model=ExerciseResponse)
async def create_my_graded_work(
    class_id: str = Form(...),
    course_id: str | None = Form(None),
    title: str = Form(...),
    description: str = Form(""),
    max_score: float = Form(20),
    due_date: str = Form(""),
    file: UploadFile | None = File(None),
    user=Depends(require_teacher),
):
    try:
        class_doc = await class_controller.get_class(class_id, user.admin_id)
        if class_doc is None or class_doc.teacher_id != user.id:
            raise ValueError("You can only create graded work for your assigned classes.")
        file_path = ""
        if file is not None:
            if not file.filename:
                raise ValueError("The selected exercise file has no filename.")
            if file.content_type not in {"application/pdf", "image/jpeg", "image/png"}:
                raise ValueError("Exercise material must be a PDF, JPEG, or PNG file.")
            file_path = await save_material_file(file, "exercise", class_id)
        parsed_due_date = datetime.fromisoformat(due_date) if due_date else None
        exercise = await exercise_controller.create_graded_work(user.id, class_id, title, description, max_score, parsed_due_date, user.admin_id, file_path, course_id)
        return _exercise(exercise)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/me/exercises", response_model=ExerciseResponse)
async def create_my_exercise(
    course_id: str = Form(...),
    max_score: float = Form(20),
    file: UploadFile = File(...),
    user=Depends(require_teacher),
):
    try:
        if not file.filename:
            raise ValueError("Please attach a file or image for the exercise.")
        if file.content_type not in {"application/pdf", "image/jpeg", "image/png"}:
            raise ValueError("Exercise material must be a PDF, JPEG, or PNG file.")
        path = await save_material_file(file, "exercise", course_id)
        exercise = await exercise_controller.create_exercise(user.id, course_id, path, max_score, user.admin_id)
        return _exercise(exercise)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/me/students")
@router.get("/students")
async def get_my_students(user=Depends(require_teacher)):
    class_ids = [item["class_id"] for item in user.classes]
    students = await student_controller.get_students_by_class_ids(class_ids, user.admin_id)
    return [{"student_id": student.id, "full_name": student.full_name, "email": student.email, "phone_number": student.phone_number, "level_academy": student.level_academy, "class_id": student.class_id} for student in students]


@router.get("/me/submissions")
async def get_my_submissions(user=Depends(require_teacher)):
    try:
        items = await submission_controller.get_submissions_by_teacher(user.id, user.admin_id)
    except ValueError:
        return []
    result = []
    for item in items:
        try:
            student = await student_controller.get_student(item.student_id, user.admin_id)
            student_name = student.full_name
        except ValueError:
            student_name = "Student"
        result.append({"id": item.id, "student_id": item.student_id, "student_name": student_name, "exercise_id": item.exercise_id, "submitted_at": item.submitted_at, "file_path": item.file_path, "file_url": item.file_path, "student_note": item.student_note, "submission_status": item.submission_status, "score": item.score})
    return result


@router.patch("/me/submissions/{submission_id}/score")
async def score_submission(submission_id: str, score: float = Form(...), user=Depends(require_teacher)):
    try:
        submission = await submission_controller.get_submission(submission_id, user.admin_id)
        exercise = await exercise_controller.get_exercise(submission.exercise_id, user.admin_id)
        if exercise.teacher_id != user.id:
            raise ValueError("You can only score submissions for your own exercises.")
        return {"message": await submission_controller.update_submission(submission_id, user.admin_id, score=score)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/me/grades")
async def get_my_grades(user=Depends(require_teacher)):
    try:
        submissions = await submission_controller.get_submissions_by_teacher(user.id, user.admin_id)
    except ValueError:
        return []
    return [{"grade_id": item.id, "score": item.score, "student_id": item.student_id, "exercise_id": item.exercise_id} for item in submissions if item.score is not None]


@router.post("/me/grades")
@router.post("/grades")
async def create_legacy_grade(data: dict | list[dict] = Body(...), user=Depends(require_teacher)):
    items = data if isinstance(data, list) else [data]
    try:
        for item in items:
            await submission_controller.save_teacher_grade(item["student_id"], item["exercise_id"], float(item["score"]), user.id, user.admin_id)
        return {"message": f"{len(items)} score(s) saved on submissions."}
    except (KeyError, TypeError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.put("/me/graded-work/{exercise_id}/students/{student_id}")
async def save_my_grade(exercise_id: str, student_id: str, score: float = Body(..., embed=True), user=Depends(require_teacher)):
    try:
        return {"message": await submission_controller.save_teacher_grade(student_id, exercise_id, score, user.id, user.admin_id)}
    except (TypeError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.put("/me/grades/{grade_id}")
async def update_legacy_grade(grade_id: str, data: dict = Body(...), user=Depends(require_teacher)):
    try:
        submission = await submission_controller.get_submission(grade_id, user.admin_id)
        exercise = await exercise_controller.get_exercise(submission.exercise_id, user.admin_id)
        if exercise.teacher_id != user.id:
            raise ValueError("You can only score submissions for your own exercises.")
        return {"message": await submission_controller.update_submission(grade_id, user.admin_id, score=float(data["score"]))}
    except (KeyError, TypeError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/me/notifications")
async def notify_class(data: TeacherNotificationCreate, user=Depends(require_teacher)):
    try:
        assigned = {item["class_id"] for item in user.classes}
        if data.class_id is not None:
            if data.class_id not in assigned:
                raise ValueError("You can only message students in your assigned classes.")
            class_ids = [data.class_id]
        else:
            class_ids = list(assigned)
        messages = [await notification_controller.send_notification_to_class_students(user.id, cid, data.message, user.admin_id, data.reference_link) for cid in class_ids]
        return {"message": "Notification sent to class students." if messages else "No assigned classes."}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/me/notifications/{student_id}")
async def notify_student(student_id: str, data: TeacherNotificationCreate, user=Depends(require_teacher)):
    try:
        return {"message": await notification_controller.send_notification_to_student(user.id, student_id, data.message, user.admin_id, data.reference_link)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/", response_model=list[TeacherResponse])
async def get_all_teachers(admin=Depends(get_current_admin)):
    return [_teacher(item) for item in await teacher_controller.get_all_teachers(admin.id)]


@router.post("/", response_model=TeacherResponse)
async def create_teacher(data: TeacherCreate, admin=Depends(get_current_admin)):
    try:
        teacher = await teacher_controller.create_teacher(data.full_name, data.email, data.phone_number, admin.id, data.specialties)
        return _teacher(teacher)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error


@router.get("/search", response_model=list[TeacherResponse])
async def search_teachers(full_name: str, admin=Depends(get_current_admin)):
    return [_teacher(item) for item in await teacher_controller.search_teacher(full_name, admin.id)]


@router.get("/count")
async def count_teachers(admin=Depends(get_current_admin)):
    return {"count": await teacher_controller.count_teachers(admin.id)}


@router.get("/{teacher_id}", response_model=TeacherResponse)
async def get_teacher(teacher_id: str, admin=Depends(get_current_admin)):
    try:
        return _teacher(await teacher_controller.get_teacher(teacher_id, admin.id))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.put("/{teacher_id}")
async def update_teacher(teacher_id: str, data: TeacherUpdate, admin=Depends(get_current_admin)):
    try:
        return {"message": await teacher_controller.update_teacher(teacher_id, admin.id, **data.model_dump(exclude_none=True))}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{teacher_id}")
async def delete_teacher(teacher_id: str, admin=Depends(get_current_admin)):
    try:
        return {"message": await teacher_controller.delete_teacher(teacher_id, admin.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
