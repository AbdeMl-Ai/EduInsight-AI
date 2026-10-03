import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

from utils.passwords import hash_password


EMAIL = "admin@eduinsight.com"
DEFAULT_PASSWORD = "Admin123"
FULL_NAME = "EduInsight Admin"
def main() -> None:
    load_dotenv(Path(__file__).resolve().parent / ".env")

    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        raise SystemExit("MONGODB_URI is not set. Add it to .env or your environment.")

    database_name = os.getenv("MONGODB_DATABASE", "eduinsight")
    password = os.getenv("ADMIN_PASSWORD", DEFAULT_PASSWORD)
    if not password:
        raise SystemExit("ADMIN_PASSWORD must not be empty.")

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)

    try:
        client.admin.command("ping")
        database = client[database_name]
        users = database["users"]
        admins = database["admins"]

        if users.find_one({"email": EMAIL}):
            print(f"User {EMAIL} already exists; no user was inserted.")
            return

        admin = admins.find_one({"email": EMAIL})
        if admin is not None:
            admin_id = admin["_id"]
        else:
            admin_document = {
                "username": FULL_NAME,
                "email": EMAIL,
                "role": "admin",
                "full_name": FULL_NAME,
                "phone_number": None,
                "created_at": datetime.now(timezone.utc),
            }
            admin_id = admins.insert_one(admin_document).inserted_id

        user_document = {
            "email": EMAIL,
            "full_name": FULL_NAME,
            "role": "admin",
            "hashed_password": hash_password(password),
            "admin_id": admin_id,
            "created_at": datetime.now(timezone.utc),
        }
        users.insert_one(user_document)
        print(f"Created admin account for {EMAIL} in the {database_name!r} database.")
        if password == DEFAULT_PASSWORD:
            print("Using the default password. Change it after your first login.")
    finally:
        client.close()


if __name__ == "__main__":
    main()
