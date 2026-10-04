from datetime import datetime, timezone
import re

from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from models.domain_models import User

class UserRepo:
    def __init__(self, db):
        self.collection = db["users"]

    async def get(self, user_id: str):
        if not ObjectId.is_valid(user_id):
            return None
        document = await self.collection.find_one(
            {"_id": ObjectId(user_id)},
            {
                "email": 1,
                "full_name": 1,
                "role": 1,
                "hashed_password": 1,
                "phone_number": 1,
                "account_status": 1,
                "google_sub": 1,
                "admin_id": 1,
                "created_at": 1,
            },
        )
        return User.model_validate(document) if document else None

    async def get_by_email(self, email: str):
        document = await self.collection.find_one(
            {
                "email": {
                    "$regex": f"^{re.escape(email.strip())}$",
                    "$options": "i",
                }
            },
            {
                "email": 1,
                "full_name": 1,
                "role": 1,
                "hashed_password": 1,
                "phone_number": 1,
                "account_status": 1,
                "google_sub": 1,
                "admin_id": 1,
                "created_at": 1,
            },
        )
        return User.model_validate(document) if document else None

    async def create(
        self,
        *,
        email: str,
        full_name: str,
        role: str,
        hashed_password: str,
        admin_id: str | None = None,
        phone_number: str | None = None,
        account_status: str | None = None,
        google_sub: str | None = None,
    ) -> User:
        user_dict = {
            "email": email,
            "full_name": full_name,
            "role": role,
            "hashed_password": hashed_password,
            "phone_number": phone_number,
            "account_status": account_status,
            "google_sub": google_sub,
            "admin_id": ObjectId(admin_id) if admin_id else None,
            "created_at": datetime.now(timezone.utc)
        }
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        return User.model_validate(user_dict)

    async def get_or_create(
        self,
        *,
        email: str,
        full_name: str,
        google_sub: str,
    ) -> User:
        user = await self.collection.find_one_and_update(
            {
                "email": {
                    "$regex": f"^{re.escape(email)}$",
                    "$options": "i",
                }
            },
            {
                "$setOnInsert": {
                    "email": email,
                    "full_name": full_name,
                    "role": "user",
                    "hashed_password": None,
                    "phone_number": None,
                    "google_sub": google_sub,
                    "admin_id": None,
                    "created_at": datetime.now(timezone.utc),
                },
                "$set": {"account_status": "active"},
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return User.model_validate(user)

    async def activate_registered_user(self, user_id: str) -> None:
        if not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user id.")
        await self.collection.update_one(
            {
                "_id": ObjectId(user_id),
                "role": "user",
                "account_status": "pending",
            },
            {"$set": {"account_status": "active"}},
        )

    async def set_student_password(
        self,
        *,
        email: str,
        full_name: str,
        admin_id: str,
        hashed_password: str,
    ) -> None:
        normalized_email = email.strip().lower()
        tenant_id = ObjectId(admin_id)
        user = await self.collection.find_one(
            {"email": {"$regex": f"^{re.escape(normalized_email)}$", "$options": "i"}}
        )

        if user is not None:
            if user.get("role") == "user" and user.get("account_status") == "pending":
                try:
                    result = await self.collection.update_one(
                        {
                            "_id": user["_id"],
                            "role": "user",
                            "account_status": "pending",
                        },
                        {
                            "$set": {
                                "email": normalized_email,
                                "full_name": full_name,
                                "role": "student",
                                "admin_id": tenant_id,
                                "hashed_password": hashed_password,
                                "account_status": "active",
                            }
                        },
                    )
                except DuplicateKeyError as error:
                    raise ValueError("An account with this email already exists.") from error
                if result.matched_count != 1:
                    raise ValueError("The pending account could not be assigned.")
                return
            if user.get("role") != "student" or str(user.get("admin_id")) != admin_id:
                raise ValueError("This email belongs to a different account.")
            await self.collection.update_one(
                {"_id": user["_id"], "role": "student", "admin_id": tenant_id},
                {
                    "$set": {
                        "email": normalized_email,
                        "full_name": full_name,
                        "hashed_password": hashed_password,
                        "account_status": "active",
                    }
                },
            )
            return

        try:
            await self.collection.insert_one(
                {
                    "email": normalized_email,
                    "full_name": full_name,
                    "role": "student",
                    "admin_id": tenant_id,
                    "hashed_password": hashed_password,
                    "account_status": "active",
                    "created_at": datetime.now(timezone.utc),
                }
            )
        except DuplicateKeyError as error:
            raise ValueError("An account with this email already exists.") from error

    async def set_teacher_password(
        self,
        *,
        email: str,
        full_name: str,
        admin_id: str,
        hashed_password: str,
    ) -> None:
        normalized_email = email.strip().lower()
        tenant_id = ObjectId(admin_id)
        user = await self.collection.find_one({"email": {"$regex": f"^{re.escape(normalized_email)}$", "$options": "i"}})
        if user is None:
            try:
                await self.collection.insert_one({
                    "email": normalized_email,
                    "full_name": full_name,
                    "role": "teacher",
                    "admin_id": tenant_id,
                    "hashed_password": hashed_password,
                    "account_status": "active",
                    "created_at": datetime.now(timezone.utc),
                })
            except DuplicateKeyError as error:
                raise ValueError("An account with this email already exists.") from error
            return
        if user.get("role") == "user" and user.get("account_status") == "pending":
            try:
                result = await self.collection.update_one(
                    {
                        "_id": user["_id"],
                        "role": "user",
                        "account_status": "pending",
                    },
                    {
                        "$set": {
                            "email": normalized_email,
                            "full_name": full_name,
                            "role": "teacher",
                            "admin_id": tenant_id,
                            "hashed_password": hashed_password,
                            "account_status": "active",
                        }
                    },
                )
            except DuplicateKeyError as error:
                raise ValueError("An account with this email already exists.") from error
            if result.matched_count != 1:
                raise ValueError("The pending account could not be assigned.")
            return
        if user.get("role") != "teacher" or str(user.get("admin_id")) != admin_id:
            raise ValueError("This email belongs to a different account.")
        await self.collection.update_one(
            {"_id": user["_id"], "role": "teacher", "admin_id": tenant_id},
            {
                "$set": {
                    "email": normalized_email,
                    "full_name": full_name,
                    "hashed_password": hashed_password,
                    "account_status": "active",
                }
            },
        )

    async def update_student_login_identity(
        self,
        *,
        old_email: str,
        email: str,
        full_name: str,
        admin_id: str,
    ) -> bool:
        normalized_old_email = old_email.strip().lower()
        normalized_email = email.strip().lower()
        tenant_id = ObjectId(admin_id)
        user = await self.collection.find_one(
            {"email": {"$regex": f"^{re.escape(normalized_old_email)}$", "$options": "i"}}
        )
        if user is None:
            return False
        if user.get("role") != "student" or str(user.get("admin_id")) != admin_id:
            raise ValueError("The existing login does not belong to this student workspace.")

        other_user = await self.collection.find_one(
            {"email": {"$regex": f"^{re.escape(normalized_email)}$", "$options": "i"}}
        )
        if other_user is not None and other_user["_id"] != user["_id"]:
            raise ValueError("An account with this email already exists.")

        try:
            result = await self.collection.update_one(
                {"_id": user["_id"], "role": "student", "admin_id": tenant_id},
                {"$set": {"email": normalized_email, "full_name": full_name}},
            )
        except DuplicateKeyError as error:
            raise ValueError("An account with this email already exists.") from error
        return result.matched_count == 1
