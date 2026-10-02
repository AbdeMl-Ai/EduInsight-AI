from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import exercise_controller, get_current_user, require_teacher
from api.schemas.exercise_schema import ExerciseCreate, ExerciseResponse, ExerciseUpdate

router = APIRouter(prefix="/exercises", tags=["Exercises"])


def _payload(item):
    return {"id": item.id, "admin_id": item.admin_id, "teacher_id": item.teacher_id, "class_id": item.class_id, "course_id": item.course_id, "course_title": item.course_title, "file_path": item.file_path, "max_score": item.max_score, "created_at": item.created_at}


def _tenant(user):
    return user.admin_id if user._token_role != "admin" else user.id


@router.get("/", response_model=list[ExerciseResponse])
async def get_all_exercises(user=Depends(get_current_user)):
    return [_payload(item) for item in await exercise_controller.get_all_exercises(_tenant(user))]


@router.post("/", response_model=ExerciseResponse)
async def create_exercise(data: ExerciseCreate, user=Depends(require_teacher)):
    try:
        return _payload(await exercise_controller.create_exercise(user.id, data.course_id, data.file_path, data.max_score, user.admin_id))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.put("/{exercise_id}")
async def update_exercise(exercise_id: str, data: ExerciseUpdate, user=Depends(require_teacher)):
    try:
        return {"message": await exercise_controller.update_exercise(exercise_id, user.id, user.admin_id, **data.model_dump(exclude_none=True))}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{exercise_id}")
async def delete_exercise(exercise_id: str, user=Depends(require_teacher)):
    try:
        return {"message": await exercise_controller.delete_exercise(exercise_id, user.id, user.admin_id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/search", response_model=list[ExerciseResponse])
async def search_exercises(query: str, user=Depends(get_current_user)):
    try:
        return [_payload(item) for item in await exercise_controller.search_exercise(query, _tenant(user))]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/count")
async def count_exercises(user=Depends(get_current_user)):
    return {"count": await exercise_controller.count_exercise(_tenant(user))}


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(exercise_id: str, user=Depends(get_current_user)):
    try:
        return _payload(await exercise_controller.get_exercise(exercise_id, _tenant(user)))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
