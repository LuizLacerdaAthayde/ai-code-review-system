# app/core/rate_limit.py
from datetime import datetime, timedelta
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from app.db.mongo import get_db

LIMIT_PER_HOUR = 10

def _window_key(ip: str, now: datetime) -> str:
    return f"{ip}:{now.strftime('%Y%m%d%H')}"

async def allow(ip: str) -> bool:
    db = get_db()
    now = datetime.utcnow()
    key = _window_key(ip, now)
    expires = now + timedelta(hours=1, minutes=5)  # margem p/ TTL

    try:
        doc = await db.rate_limits.find_one_and_update(
            {
                "_id": key,
                "$or": [{"count": {"$lt": LIMIT_PER_HOUR}}, {"count": {"$exists": False}}],
            },
            {
                "$inc": {"count": 1},
                "$setOnInsert": {"ip": ip, "createdAt": now, "expiresAt": expires},
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return doc and doc.get("count", 0) <= LIMIT_PER_HOUR

    except DuplicateKeyError:
        doc = await db.rate_limits.find_one_and_update(
            {"_id": key, "count": {"$lt": LIMIT_PER_HOUR}},
            {"$inc": {"count": 1}},
            upsert=False,
            return_document=ReturnDocument.AFTER,
        )
        return doc is not None

async def ensure_rate_limit_indexes():
    db = get_db()
    await db.rate_limits.create_index("expiresAt", expireAfterSeconds=0)
    await db.rate_limits.create_index([("ip", 1)])
