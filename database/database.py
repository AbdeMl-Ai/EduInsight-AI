import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase


class Database:
    def __init__(self, uri: str | None = None, database_name: str | None = None):
        self.uri = uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.database_name = database_name or os.getenv(
            "MONGODB_DATABASE", "eduinsight"
        )
        self.client = AsyncIOMotorClient(self.uri)
        self.database: AsyncIOMotorDatabase = self.client[self.database_name]

    def get_collection(self, name: str):
        return self.database[name]

    async def ping(self) -> bool:
        await self.client.admin.command("ping")
        return True

    def close(self) -> None:
        self.client.close()
