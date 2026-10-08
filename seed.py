import argparse
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from utils.passwords import hash_password, verify_password


DEFAULT_DATA_FILE = Path(__file__).resolve().with_name("mock_data.json")
EXPECTED_COUNTS = {"teachers": 5, "classes": 10, "students": 20}


def stable_object_id(kind: str, key: str) -> ObjectId:
    value = hashlib.sha256(f"eduinsight-demo-v1:{kind}:{key}".encode()).hexdigest()[:24]
    return ObjectId(value)


def validate_data(data: dict[str, Any]) -> None:
    if not isinstance(data.get("admin"), dict):
        raise ValueError("Seed data must contain one admin object.")
    if not isinstance(data.get("password"), str) or len(data["password"]) < 8:
        raise ValueError("Seed data password must contain at least 8 characters.")
    for name, expected_count in EXPECTED_COUNTS.items():
        if not isinstance(data.get(name), list) or len(data[name]) != expected_count:
            raise ValueError(f"Seed data must contain exactly {expected_count} {name}.")

    teacher_keys = {item.get("key") for item in data["teachers"]}
    class_keys = {item.get("key") for item in data["classes"]}
    student_keys = {item.get("key") for item in data["students"]}
    if len(teacher_keys) != len(data["teachers"]) or None in teacher_keys:
        raise ValueError("Teacher keys must be present and unique.")
    if len(class_keys) != len(data["classes"]) or None in class_keys:
        raise ValueError("Class keys must be present and unique.")
    if len(student_keys) != len(data["students"]) or None in student_keys:
        raise ValueError("Student keys must be present and unique.")

    emails = [
        data["admin"].get("email"),
        *(item.get("email") for item in data["teachers"]),
        *(item.get("email") for item in data["students"]),
    ]
    if any(not isinstance(email, str) or not email for email in emails):
        raise ValueError("Every seeded account must have an email address.")
    if len(set(email.lower() for email in emails)) != len(emails):
        raise ValueError("Seed account email addresses must be unique.")

    for class_item in data["classes"]:
        if class_item.get("teacher_key") not in teacher_keys:
            raise ValueError(f"Class {class_item.get('key')} references an unknown teacher.")
    for student in data["students"]:
        keys = student.get("class_keys")
        if not isinstance(keys, list) or not keys:
            raise ValueError(f"Student {student.get('key')} must be assigned to a class.")
        if any(class_key not in class_keys for class_key in keys):
            raise ValueError(f"Student {student.get('key')} references an unknown class.")


def insert_if_missing(collection, query: dict[str, Any], document: dict[str, Any]):
    existing = collection.find_one(query, {"_id": 1})
    if existing is not None:
        return existing["_id"], False

    try:
        collection.insert_one(document)
        return document["_id"], True
    except DuplicateKeyError:
        existing = collection.find_one(query, {"_id": 1})
        if existing is None:
            raise
        return existing["_id"], False


def upsert_seeded_document(
    collection,
    document: dict[str, Any],
    *,
    legacy_query: dict[str, Any] | None = None,
):
    existing = collection.find_one({"_id": document["_id"]}, {"_id": 1})
    if existing is None and legacy_query is not None:
        existing = collection.find_one(legacy_query, {"_id": 1})

    if existing is not None:
        collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {key: value for key, value in document.items() if key != "_id"}},
        )
        return existing["_id"], False

    collection.insert_one(document)
    return document["_id"], True


def ensure_login_user(
    users,
    *,
    account: dict[str, Any],
    role: str,
    admin_id: ObjectId,
    password: str,
) -> bool:
    email = account["email"].strip().lower()
    existing = users.find_one({"email": email}, {"_id": 1, "role": 1})
    if existing is None and email.endswith("@gmail.com"):
        legacy_email = f"{email.removesuffix('@gmail.com')}@example.test"
        existing = users.find_one(
            {
                "email": legacy_email,
                "full_name": account["full_name"],
                "role": role,
                "admin_id": admin_id,
            },
            {"_id": 1, "role": 1},
        )
    if existing is not None:
        if existing.get("role") != role:
            raise ValueError(
                f"{email} already exists in users with role {existing.get('role')!r}, "
                f"not {role!r}; no existing account was changed."
            )
        password_hash = hash_password(password)
        if not verify_password(password, password_hash):
            raise RuntimeError("Generated password hash did not pass backend verification.")
        users.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "email": email,
                    "full_name": account["full_name"],
                    "role": role,
                    "hashed_password": password_hash,
                    "phone_number": account.get("phone_number"),
                    "account_status": "active",
                    "admin_id": admin_id,
                }
            },
        )
        return False

    password_hash = hash_password(password)
    if not verify_password(password, password_hash):
        raise RuntimeError("Generated password hash did not pass backend verification.")
    document = {
        "_id": stable_object_id("user", email),
        "email": email,
        "full_name": account["full_name"],
        "role": role,
        "hashed_password": password_hash,
        "phone_number": account.get("phone_number"),
        "account_status": "active",
        "google_sub": None,
        "admin_id": admin_id,
        "created_at": datetime.now(timezone.utc),
    }
    _, inserted = upsert_seeded_document(users, document)
    return inserted


def seed(database, data: dict[str, Any]) -> dict[str, int]:
    admin = data["admin"]
    admin_email = admin["email"].strip().lower()
    admin_document = {
        "_id": stable_object_id("admin", admin["key"]),
        "username": admin["full_name"],
        "email": admin_email,
        "role": "admin",
        "full_name": admin["full_name"],
        "phone_number": admin.get("phone_number"),
        "created_at": datetime.now(timezone.utc),
    }
    admin_id, admin_inserted = upsert_seeded_document(
        database["admins"],
        admin_document,
        legacy_query={
            "email": f"{admin_email.removesuffix('@gmail.com')}@example.test",
            "full_name": admin["full_name"],
            "role": "admin",
        },
    )

    counts = {
        "admins": int(admin_inserted),
        "users": int(
            ensure_login_user(
                database["users"],
                account=admin,
                role="admin",
                admin_id=admin_id,
                password=data["password"],
            )
        ),
        "teachers": 0,
        "students": 0,
        "classes": 0,
    }

    teacher_ids: dict[str, ObjectId] = {}
    for teacher in data["teachers"]:
        email = teacher["email"].strip().lower()
        document = {
            "_id": stable_object_id("teacher", teacher["key"]),
            "admin_id": str(admin_id),
            "full_name": teacher["full_name"],
            "age": teacher["age"],
            "is_state_teacher": teacher["is_state_teacher"],
            "specialties": teacher["specialties"],
            "date_enjoined": datetime.now(timezone.utc),
            "email": email,
            "phone_number": teacher["phone_number"],
            "classes": [],
        }
        teacher_id, inserted = upsert_seeded_document(
            database["teachers"],
            document,
            legacy_query={
                "admin_id": str(admin_id),
                "email": f"{email.removesuffix('@gmail.com')}@example.test",
                "full_name": teacher["full_name"],
            },
        )
        teacher_ids[teacher["key"]] = teacher_id
        counts["teachers"] += int(inserted)
        counts["users"] += int(
            ensure_login_user(
                database["users"],
                account=teacher,
                role="teacher",
                admin_id=admin_id,
                password=data["password"],
            )
        )

    class_ids: dict[str, ObjectId] = {}
    for class_item in data["classes"]:
        teacher_id = teacher_ids[class_item["teacher_key"]]
        query = {
            "admin_id": str(admin_id),
            "teacher_id": str(teacher_id),
            "class_name": class_item["class_name"],
            "subject": class_item["subject"],
        }
        document = {
            "_id": stable_object_id("class", class_item["key"]),
            **query,
            "class_level": class_item["class_level"],
            "center_rent_fee_per_student": class_item[
                "center_rent_fee_per_student"
            ],
            "teacher_teaching_fee_per_student": class_item[
                "teacher_teaching_fee_per_student"
            ],
            "student_monthly_fee": class_item["student_monthly_fee"],
            "embedded_students": [],
            "created_at": datetime.now(timezone.utc),
        }
        class_id, inserted = upsert_seeded_document(
            database["classes"], document, legacy_query=query
        )
        class_ids[class_item["key"]] = class_id
        counts["classes"] += int(inserted)

    student_ids: dict[str, ObjectId] = {}
    for student in data["students"]:
        email = student["email"].strip().lower()
        selected_class_ids = [class_ids[key] for key in student["class_keys"]]
        selected_class_ids_as_strings = [str(class_id) for class_id in selected_class_ids]
        document = {
            "_id": stable_object_id("student", student["key"]),
            "admin_id": str(admin_id),
            "parent_id": None,
            "full_name": student["full_name"],
            "age": student["age"],
            "level_academy": student["level"],
            "date_enjoined": datetime.now(timezone.utc),
            "email": email,
            "phone_number": student["phone_number"],
            "level": student["level"],
            "class_id": selected_class_ids_as_strings[0],
            "class_ids": selected_class_ids_as_strings,
        }
        student_id, inserted = upsert_seeded_document(
            database["students"],
            document,
            legacy_query={
                "admin_id": str(admin_id),
                "email": f"{email.removesuffix('@gmail.com')}@example.test",
                "full_name": student["full_name"],
            },
        )
        student_ids[student["key"]] = student_id
        counts["students"] += int(inserted)
        counts["users"] += int(
            ensure_login_user(
                database["users"],
                account=student,
                role="student",
                admin_id=admin_id,
                password=data["password"],
            )
        )

    for class_item in data["classes"]:
        class_id = class_ids[class_item["key"]]
        enrollments = [
            {"student_id": str(student_ids[student["key"]]), "origin": "admin"}
            for student in data["students"]
            if class_item["key"] in student["class_keys"]
        ]
        database["classes"].update_one(
            {"_id": class_id, "admin_id": str(admin_id)},
            {"$addToSet": {"embedded_students": {"$each": enrollments}}},
        )

    return counts


def main() -> None:
    load_dotenv(Path(__file__).resolve().with_name(".env"))
    parser = argparse.ArgumentParser(
        description="Insert demo Admin, Teacher, Class, Student, and login records."
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=DEFAULT_DATA_FILE,
        help="Path to mock_data.json (defaults to the file next to seed.py).",
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Validate the JSON data without connecting to MongoDB.",
    )
    args = parser.parse_args()
    data = json.loads(args.data.read_text(encoding="utf-8"))
    if "SEED_PASSWORD" in os.environ:
        data["password"] = os.environ["SEED_PASSWORD"]
    validate_data(data)
    if args.validate_only:
        print("Seed data is valid: 1 admin, 5 teachers, 10 classes, 20 students.")
        return

    mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
    if not mongo_uri:
        raise SystemExit(
            "Set MONGODB_URI or MONGO_URI in the container environment or .env file."
        )
    database_name = os.getenv("MONGODB_DATABASE") or os.getenv(
        "MONGO_DATABASE", "eduinsight"
    )
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
    try:
        client.admin.command("ping")
        counts = seed(client[database_name], data)
        print(f"Database {database_name!r} seeded (seeded records inserted or refreshed):")
        for collection_name, inserted_count in counts.items():
            print(f"  {collection_name}: {inserted_count} inserted")
    finally:
        client.close()


if __name__ == "__main__":
    main()
