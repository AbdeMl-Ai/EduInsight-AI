from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import get_current_user, notification_controller, require_teacher, teacher_controller
from api.schemas.notification_schema import NotificationCreate, NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def _tenant(user):
    return user.admin_id if user._token_role != "admin" else user.id


async def _response(item, admin_id):
    teacher = None
    if item.sender_id is not None:
        try:
            teacher = await teacher_controller.get_teacher(item.sender_id, admin_id)
        except ValueError:
            teacher = None
    return {"id": item.id, "admin_id": item.admin_id, "sender_id": item.sender_id, "receiver_id": item.receiver_id, "receiver_role": item.receiver_role, "notification_type": item.notification_type, "message": item.message, "reference_link": item.reference_link, "is_read": item.is_read, "created_at": item.created_at, "notification_id": item.id, "title": item.notification_type, "teacher_id": item.sender_id or "", "teacher_name": teacher.full_name if teacher else "Admin"}


@router.get("/", response_model=list[NotificationResponse])
async def get_all_notifications(user=Depends(get_current_user)):
    admin_id = _tenant(user)
    return [await _response(item, admin_id) for item in await notification_controller.get_all_notifications(admin_id)]


@router.get("/search", response_model=list[NotificationResponse])
async def search_notifications(query: str, user=Depends(get_current_user)):
    try:
        admin_id = _tenant(user)
        return [await _response(item, admin_id) for item in await notification_controller.search_notification(query, admin_id)]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/count")
async def count_notifications(user=Depends(get_current_user)):
    return {"count": await notification_controller.count_notifications(_tenant(user))}


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(notification_id: str, user=Depends(get_current_user)):
    try:
        admin_id = _tenant(user)
        return await _response(await notification_controller.get_notification(notification_id, admin_id), admin_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.post("/", response_model=dict)
async def create_notification(data: NotificationCreate, user=Depends(require_teacher)):
    try:
        if data.receiver_role != "student":
            raise ValueError("Teachers may send notifications only to students.")
        message = await notification_controller.send_notification_to_student(user.id, data.receiver_id, data.message, user.admin_id, data.reference_link)
        return {"message": message}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.patch("/{notification_id}/read")
async def mark_notification_read(notification_id: str, user=Depends(get_current_user)):
    if user._token_role != "student":
        raise HTTPException(status_code=403, detail="Student access required")
    try:
        return {"message": await notification_controller.mark_as_read(notification_id, user.id, user.admin_id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, user=Depends(get_current_user)):
    if user._token_role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    try:
        return {"message": await notification_controller.delete_notification(notification_id, user.id)}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
