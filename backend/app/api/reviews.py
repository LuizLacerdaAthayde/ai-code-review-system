from fastapi import APIRouter, HTTPException, BackgroundTasks, Request, Query
from bson import ObjectId
from app.db.mongo import get_db
from app.core.rate_limit import allow
from app.services.review_service import create_review

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("")
async def submit_review(payload: dict, request: Request, bg: BackgroundTasks):
    code = payload.get("code")
    language = payload.get("language", "python")
    if not code:
        raise HTTPException(status_code=400, detail="code is required")
    ip = request.client.host
    if not await allow(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
    rid = await create_review(code, language, ip, bg)
    return {"id": rid, "status": "pending"}

@router.get("/{id}")
async def get_review(id: str):
    db = get_db()
    doc = await db.reviews.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    doc["id"] = str(doc.pop("_id"))
    return doc

@router.get("")
async def list_reviews(
    language: str | None = None,
    page: int = 1,
    page_size: int = 10,
    min_score: int | None = Query(None, ge=1, le=10),
):
    db = get_db()
    q = {}
    if language:
        q["language"] = language
    cursor = db.reviews.find(q).sort("created_at", -1).skip((page - 1) * page_size).limit(page_size)
    items = []
    async for d in cursor:
        d["id"] = str(d.pop("_id"))
        if min_score is None or (d.get("result") and d["result"].get("score", 0) >= min_score):
            items.append(d)
    return {"items": items, "page": page, "page_size": page_size}


@router.delete("/reset_rate_limits")
async def reset_rate_limits():
    db = get_db()
    await db.rate_limits.delete_many({})
    return {"status": "reset"}
