import json
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError


def main() -> int:
    load_dotenv(Path(__file__).resolve().with_name(".env"))

    mongo_uri = os.getenv("MONGODB_URI")
    database_name = os.getenv("MONGODB_DATABASE")
    if not mongo_uri:
        raise SystemExit("MONGODB_URI is missing from the environment or .env file.")
    if not database_name:
        raise SystemExit("MONGODB_DATABASE is missing from the environment or .env file.")

    try:
        with MongoClient(mongo_uri, serverSelectionTimeoutMS=10_000) as client:
            client.admin.command("ping")
            database = client[database_name]
            collection_names = sorted(database.list_collection_names())

            print(f"Collections in {database_name}:")
            for name in collection_names:
                print(f"- {name}")

            for name in collection_names:
                print(f"\nFirst 2 documents in {name}:")
                documents = list(database[name].find({}, limit=2))
                if not documents:
                    print("(empty)")
                    continue
                print(json.dumps(documents, default=str, indent=2))
    except PyMongoError as error:
        print(f"MongoDB operation failed ({type(error).__name__}).")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
