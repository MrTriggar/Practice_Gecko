"routes.py - диспетчер запросов. принимает запрос по модели от models.py, вызывает нужную"
"функциюю логики из services.py и возвращает результат в формате модели из models.py"


from fastapi import APIRouter

from .models import (
    CheckTermsRequest,
    CheckTermsResponse,
    SuggestFixRequest,
    SuggestFixResponse,
)
from .services import check_terms_in_text, suggest_issues_for_segments

router = APIRouter()


@router.post("/check_terms", response_model=CheckTermsResponse)
def check_terms(req: CheckTermsRequest) -> CheckTermsResponse:
    terms = check_terms_in_text(req.text)
    return CheckTermsResponse(terms=terms)


@router.post("/suggest_fix", response_model=SuggestFixResponse)
def suggest_fix(req: SuggestFixRequest) -> SuggestFixResponse:
    issues = suggest_issues_for_segments(req.segments)
    return SuggestFixResponse(issues=issues)