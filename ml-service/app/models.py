"models.py - словарь форматов данных."
"Он описывает структуру json, которую сервис принимает и отдает, он не содержит"
"никакой логики - только классы с полями или типами "


from pydantic import BaseModel
from typing import List, Optional


class CheckTermsRequest(BaseModel):
    text: str


class TermInfo(BaseModel):
    term: str
    status: str                  # "approved", "wrong", "pending"
    suggestion: Optional[str] = None
    category: Optional[str] = None


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