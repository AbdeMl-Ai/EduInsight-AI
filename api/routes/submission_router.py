from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from api.dependencies import get_current_user, get_current_admin, require_student, require_teacher, submission_controller
from api.dependencies import exercise_controller
from api.schemas.submission_schema import SubmissionResponse, SubmissionUpdate
from utils.submission_storage import delete_submission_file, save_submission_file

router = APIRouter(prefix="/submissions", tags=["Submissions"])


def _payload(item):
    return {"id": item.id, "admin_id": item.admin_id, "student_id": item.student_id, "class_id": item.class_id, "exercise_id": item.exercise_id, "submission_status": item.submission_status, "file_path": item.file_path, "student_note": item.student_note, "score": item.score, "submitted_at": item.submitted_at, "graded_at": item.graded_at}


def _tenant(user):
    return user.admin_id if user._token_role != "admin" else user.id


@router.post("/", response_model=SubmissionResponse)
async def create_submission(exercise_id: str = Form(...), file: UploadFile = File(...), student_note: str = Form("", max_length=1000), user=Depends(require_student)):
    file_path = await save_submission_file(file, exercise_id, user.id)
    try:
        item = await submission_controller.create_submission(user.id, exercise_id, file_path, user.admin_id, student_note)
        return _payload(item)
    except ValueError as error:
        await delete_submission_file(file_path)
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/", response_model=list[SubmissionResponse])
async def get_all_submissions(user=Depends(get_current_user)):
    return [_payload(item) for item in await submission_controller.get_all_submissions(_tenant(user))]


@router.get("/student/{student_id}", response_model=list[SubmissionResponse])
async def get_submissions_by_student(student_id: str, user=Depends(get_current_user)):
    tenant = _tenant(user)
    try:
        return [_payload(item) for item in await submission_controller.search_submission_by_student(student_id, tenant)]
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/exercise/{exercise_id}", response_model=list[SubmissionResponse])
async def get_submissions_by_exercise(exercise_id: str, user=Depends(get_current_user)):
    try:
        return [_payload(item) for item in await submission_controller.search_submission_by_exercise(exercise_id, _tenant(user))]
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/count")
async def count_submissions(user=Depends(get_current_user)):
    return {"count": await submission_controller.count_submissions(_tenant(user))}


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: str, user=Depends(get_current_user)):
    try:
        return _payload(await submission_controller.get_submission(submission_id, _tenant(user)))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.put("/{submission_id}")
async def update_submission(submission_id: str, data: SubmissionUpdate, user=Depends(require_teacher)):
    try:
        submission = await submission_controller.get_submission(submission_id, user.admin_id)
        exercise = await exercise_controller.get_exercise(submission.exercise_id, user.admin_id)
        if exercise.teacher_id != user.id:
            raise HTTPException(status_code=403, detail="You can only update submissions for your own exercises.")
        return {"message": await submission_controller.update_submission(submission_id, _tenant(user), **data.model_dump(exclude_none=True))}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{submission_id}")
async def delete_submission(submission_id: str, user=Depends(get_current_admin)):
    try:
        return {"message": await submission_controller.delete_submission(submission_id, user.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
