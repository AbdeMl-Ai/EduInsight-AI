from bson import ObjectId

from models.domain_models import Notification


class NotificationRepo:
    def __init__(self, db):
        self.collection = db["notifications"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("notification/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    @staticmethod
    def _tenant(admin_id):
        if not admin_id:
            raise ValueError("admin_id is required")
        return admin_id

    async def add_notification(self, notification: Notification, admin_id: str):
        admin_id = self._tenant(admin_id)
        payload = notification.model_dump(exclude={"id"})
        payload["admin_id"] = admin_id
        for field in ("sender_id", "receiver_id"):
            if payload.get(field) is not None:
                payload[field] = self._id(payload[field])
        result = await self.collection.insert_one(payload)
        return Notification.model_validate({"_id": result.inserted_id, **payload})

    async def get_notification(self, notification_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one({"_id": ObjectId(self._id(notification_id)), "admin_id": admin_id})
        return Notification.model_validate(doc) if doc else None

    async def get_all_notifications(self, admin_id: str, receiver_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find(
            {"admin_id": admin_id, "receiver_id": self._id(receiver_id)}
        ).sort("created_at", -1)
        return [Notification.model_validate(doc) async for doc in cursor]

    async def get_admin_notifications(self, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.get_all_notifications(admin_id, admin_id)

    async def exists_by_reference(self, reference_link: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        return await self.collection.find_one({"admin_id": admin_id, "reference_link": reference_link}, {"_id": 1}) is not None

    async def get_notifications_for_receiver(
        self, receiver_id: str, admin_id: str, receiver_role: str | None = None
    ):
        admin_id = self._tenant(admin_id)
        query = {"admin_id": admin_id, "receiver_id": self._id(receiver_id)}
        if receiver_role is not None:
            query["receiver_role"] = receiver_role
        cursor = self.collection.find(query).sort("created_at", -1)
        return [Notification.model_validate(doc) async for doc in cursor]

    async def update_notification(self, notification_id: str, admin_id: str, **updates):
        admin_id = self._tenant(admin_id)
        allowed = {"sender_id", "receiver_id", "receiver_role", "notification_type", "message", "reference_link", "is_read"}
        updates = {k: self._id(v) if k in {"sender_id", "receiver_id"} and v is not None else v for k, v in updates.items() if k in allowed}
        if not updates:
            return False
        result = await self.collection.update_one({"_id": ObjectId(self._id(notification_id)), "admin_id": admin_id}, {"$set": updates})
        return result.modified_count == 1

    async def mark_as_read(self, notification_id: str, receiver_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.update_one({"_id": ObjectId(self._id(notification_id)), "receiver_id": self._id(receiver_id), "admin_id": admin_id}, {"$set": {"is_read": True}})
        return result.modified_count == 1

    async def mark_all_as_read(
        self, receiver_id: str, receiver_role: str, admin_id: str
    ):
        admin_id = self._tenant(admin_id)
        result = await self.collection.update_many(
            {
                "admin_id": admin_id,
                "receiver_id": self._id(receiver_id),
                "receiver_role": receiver_role,
                "is_read": False,
            },
            {"$set": {"is_read": True}},
        )
        return result.modified_count

    async def delete_notification(self, notification_id: str, admin_id: str):
        admin_id = self._tenant(admin_id)
        result = await self.collection.delete_one({"_id": ObjectId(self._id(notification_id)), "admin_id": admin_id})
        return result.deleted_count == 1

    async def search_notification(self, query: str, admin_id: str, receiver_id: str):
        admin_id = self._tenant(admin_id)
        cursor = self.collection.find(
            {
                "admin_id": admin_id,
                "receiver_id": self._id(receiver_id),
                "message": {"$regex": query, "$options": "i"},
            }
        )
        return [Notification.model_validate(doc) async for doc in cursor]

    async def count_notifications(self, admin_id: str, receiver_id: str):
        admin_id = self._tenant(admin_id)
        return await self.collection.count_documents(
            {"admin_id": admin_id, "receiver_id": self._id(receiver_id)}
        )

    async def get_notification_for_receiver(
        self, notification_id: str, receiver_id: str, admin_id: str
    ):
        admin_id = self._tenant(admin_id)
        doc = await self.collection.find_one(
            {
                "_id": ObjectId(self._id(notification_id)),
                "admin_id": admin_id,
                "receiver_id": self._id(receiver_id),
            }
        )
        return Notification.model_validate(doc) if doc else None
