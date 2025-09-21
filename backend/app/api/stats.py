from fastapi import APIRouter
from app.db.mongo import get_db

router = APIRouter(prefix="/api", tags=["stats"])

@router.get("/stats")
async def get_stats():
    db = get_db()
    pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "avgScore": {"$avg": "$result.score"}, "total": {"$sum": 1}}},
    ]
    agg = await db.reviews.aggregate(pipeline).to_list(None)
    out = {"avgScore": None, "total": 0}
    if agg:
        out["avgScore"] = round(agg[0]["avgScore"], 2) if agg[0]["avgScore"] is not None else None
        out["total"] = agg[0]["total"]
    return out
