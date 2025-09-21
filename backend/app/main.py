from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.reviews import router as reviews_router
from app.api.stats import router as stats_router
from app.db.mongo import init_indexes
from app.core.config import get_settings

app = FastAPI(title="AI Code Review System")
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "https://localhost:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews_router)
app.include_router(stats_router)

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def on_startup():
    await init_indexes()