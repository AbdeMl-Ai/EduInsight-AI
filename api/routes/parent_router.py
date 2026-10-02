from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import get_current_admin, parent_controller
from api.schemas.parent_schema import ParentCreate, ParentResponse, ParentUpdate

router = APIRouter(prefix="/parents", tags=["Parents"])


def _response(parent):
    return {
        "_id": parent.id,
        "admin_id": parent.admin_id,
        "full_name": parent.full_name,
        "email": parent.email,
        "contact_number": parent.contact_number,
        "student_ids": parent.student_ids,
    }


@router.post("/", response_model=ParentResponse)
async def create_parent(data: ParentCreate, admin=Depends(get_current_admin)):
    try:
        parent = await parent_controller.create_parent(
            data.full_name, data.email, data.contact_number, admin.id, data.student_ids
        )
        return _response(parent)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/", response_model=list[ParentResponse])
async def list_parents(admin=Depends(get_current_admin)):
    parents = await parent_controller.get_all_parents(admin.id)
    return [_response(parent) for parent in parents]


@router.get("/{parent_id}", response_model=ParentResponse)
async def get_parent(parent_id: str, admin=Depends(get_current_admin)):
    try:
        return _response(await parent_controller.get_parent(parent_id, admin.id))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.patch("/{parent_id}", response_model=ParentResponse)
async def update_parent(parent_id: str, data: ParentUpdate, admin=Depends(get_current_admin)):
    try:
        parent = await parent_controller.update_parent(
            parent_id, admin.id, data.model_dump(exclude_none=True)
        )
        return _response(parent)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/{parent_id}/students/{student_id}", response_model=ParentResponse)
async def add_parent_student(parent_id: str, student_id: str, admin=Depends(get_current_admin)):
    try:
        parent = await parent_controller.add_student(parent_id, student_id, admin.id)
        return _response(parent)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.delete("/{parent_id}")
async def delete_parent(parent_id: str, admin=Depends(get_current_admin)):
    try:
        await parent_controller.delete_parent(parent_id, admin.id)
        return {"message": "Parent deleted successfully."}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
