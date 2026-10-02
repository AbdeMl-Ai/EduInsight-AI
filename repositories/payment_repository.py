from bson import ObjectId

from models.domain_models import PaymentState

class PaymentRepo:
    def __init__(self, db):
        self.collection = db["payment_states"]

    @staticmethod
    def _id(value):
        if not ObjectId.is_valid(value):
            raise ValueError("user/reference ID must be a valid ObjectId")
        return str(ObjectId(value))

    async def get(self, user_id: str, user_role: str, admin_id: str):
        document = await self.collection.find_one({
            "admin_id": admin_id,
            "user_id": self._id(user_id),
            "user_role": user_role,
        })
        return PaymentState.model_validate(document) if document else None

    async def save(self, state: PaymentState, admin_id: str):
        payload = state.model_dump(exclude={"id", "created_at"})
        payload["admin_id"] = admin_id
        await self.collection.update_one(
            {"admin_id": admin_id, "user_id": self._id(state.user_id), "user_role": state.user_role},
            {"$set": payload, "$setOnInsert": {"created_at": state.created_at}},
            upsert=True,
        )
        return await self.get(state.user_id, state.user_role, admin_id)