from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ReviewStatus(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"
    failed = "failed"

class ReviewCreate(BaseModel):
    code: str = Field(min_length=1)
    language: str

class ReviewIssue(BaseModel):
    title: str
    detail: str

class ReviewResult(BaseModel):
    score: int  # 1-10
    issues: List[ReviewIssue] = []
    security: List[str] = []
    performance: List[str] = []
    summary: Optional[str] = None

class ReviewOut(BaseModel):
    id: str
    code: str
    language: str
    status: ReviewStatus
    created_at: datetime
    updated_at: datetime
    result: Optional[ReviewResult] = None
