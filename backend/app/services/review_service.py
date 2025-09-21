from datetime import datetime
from fastapi import BackgroundTasks
from app.db.mongo import get_db
from app.services.ai_service import review_with_openai
from bson import ObjectId
from datetime import datetime as dt

async def create_review(code: str, language: str, client_ip: str, bg: BackgroundTasks) -> str:
    db = get_db()
    now = datetime.utcnow()
    doc = {
        "code": code,
        "language": language,
        "status": "pending",
        "created_at": now,
        "updated_at": now,
        "client_ip": client_ip,
        "result": None,
    }
    res = await db.reviews.insert_one(doc)
    rid = str(res.inserted_id)
    bg.add_task(process_review, rid)
    return rid

async def process_review(review_id: str):
    db = get_db()
    await db.reviews.update_one({"_id": ObjectId(review_id)}, {"$set": {"status": "in-progress", "updated_at": dt.utcnow()}})
    doc = await db.reviews.find_one({"_id": ObjectId(review_id)})
    try:
        ai = await review_with_openai(doc["code"], doc["language"])
        await db.reviews.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": {"status": "completed", "result": ai, "updated_at": dt.utcnow()}}
        )
    except Exception as e:
        await db.reviews.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": {"status": "failed", "result": {"summary": f"Error: {e}"}, "updated_at": dt.utcnow()}}
        )
