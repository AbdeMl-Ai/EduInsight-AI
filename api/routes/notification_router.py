from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import get_current_user, notification_controller, require_teacher
from api.schemas.notification_schema import NotificationCreate, NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def _tenant(user):
    return user.admin_id if user._token_role != "admin" else user.id


async def _response(item, admin_id):
    sender_name = await notification_controller.get_sender_name(item.sender_id, admin_id)
    return {"id": item.id, "admin_id": item.admin_id, "sender_id": item.sender_id, "receiver_id": item.receiver_id, "receiver_role": item.receiver_role, "notification_type": item.notification_type, "message": item.message, "reference_link": item.reference_link, "is_read": item.is_read, "created_at": item.created_at, "notification_id": item.id, "title": sender_name, "sender_name": sender_name, "teacher_id": item.sender_id or "", "teacher_name": sender_name}


@router.get("/", response_model=list[NotificationResponse])
async def get_all_notifications(user=Depends(get_current_user)):
    admin_id = _tenant(user)
    notifications = await notification_controller.get_all_notifications(admin_id, user.id)
    return [await _response(item, admin_id) for item in notifications]


@router.get("/search", response_model=list[NotificationResponse])
async def search_notifications(query: str, user=Depends(get_current_user)):
    try:
        admin_id = _tenant(user)
        notifications = await notification_controller.search_notification(query, admin_id, user.id)
        return [await _response(item, admin_id) for item in notifications]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/count")
async def count_notifications(user=Depends(get_current_user)):
    admin_id = _tenant(user)
    return {"count": await notification_controller.count_notifications(admin_id, user.id)}


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(notification_id: str, user=Depends(get_current_user)):
    try:
        admin_id = _tenant(user)
        notification = await notification_controller.get_notification_for_receiver(
            notification_id, user.id, admin_id
        )
        return await _response(notification, admin_id)
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
