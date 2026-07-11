from pydantic import BaseModel
from typing import List, Optional


class CheckTermsRequest(BaseModel):
    text: str


class TermInfo(BaseModel):
    term: str
    status: str                  # "approved", "wrong", "pending"
    suggestion: Optional[str] = None


class CheckTermsResponse(BaseModel):
    terms: List[TermInfo]


class Segment(BaseModel):
    id: int
    text: str


class SuggestFixRequest(BaseModel):
    segments: List[Segment]


class Issue(BaseModel):
    segment_id: int
    issue: str
    severity: str                # "low", "medium", "high"


class SuggestFixResponse(BaseModel):
    issues: List[Issue]