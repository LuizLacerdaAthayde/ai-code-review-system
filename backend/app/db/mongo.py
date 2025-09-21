from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

_settings = get_settings()
_client: AsyncIOMotorClient | None = None

def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(_settings.mongodb_uri, uuidRepresentation="standard")
    return _client

def get_db():
    return get_client()[_settings.mongodb_db]

async def init_indexes():
    db = get_db()
    await db.reviews.create_index([("created_at", 1)])
    await db.reviews.create_index([("status", 1)])
    await db.reviews.create_index([("language", 1)])
