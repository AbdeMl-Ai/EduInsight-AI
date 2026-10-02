from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import course_controller, get_current_user, require_teacher
from api.schemas.course_schema import CourseCreate, CourseResponse, CourseUpdate

router = APIRouter(prefix="/courses", tags=["Courses"])


def _payload(course):
    return {"id": course.id, "admin_id": course.admin_id, "teacher_id": course.teacher_id, "class_id": course.class_id, "title": course.title, "description": course.description, "created_at": course.created_at}


@router.get("/", response_model=list[CourseResponse])
async def get_all_courses(user=Depends(get_current_user)):
    return [_payload(item) for item in await course_controller.get_all_courses(user.admin_id if user._token_role != "admin" else user.id)]


@router.post("/", response_model=CourseResponse)
async def create_course(data: CourseCreate, user=Depends(require_teacher)):
    try:
        return _payload(await course_controller.create_course(data.title, data.description, user.id, data.class_id, user.admin_id))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/search", response_model=list[CourseResponse])
async def search_courses(query: str, user=Depends(get_current_user)):
    tenant = user.admin_id if user._token_role != "admin" else user.id
    try:
        return [_payload(item) for item in await course_controller.search_course(query, tenant)]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/count")
async def count_courses(user=Depends(get_current_user)):
    tenant = user.admin_id if user._token_role != "admin" else user.id
    return {"count": await course_controller.count_courses(tenant)}


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str, user=Depends(get_current_user)):
    tenant = user.admin_id if user._token_role != "admin" else user.id
    try:
        return _payload(await course_controller.get_course(course_id, tenant))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.put("/{course_id}")
async def update_course(course_id: str, data: CourseUpdate, user=Depends(require_teacher)):
    try:
        return {"message": await course_controller.update_course(course_id, user.admin_id, user.id, **data.model_dump(exclude_none=True))}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{course_id}")
async def delete_course(course_id: str, user=Depends(require_teacher)):
    try:
        return {"message": await course_controller.delete_course(course_id, user.admin_id, user.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
