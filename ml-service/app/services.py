from typing import List

from .models import TermInfo, Segment, Issue

# Простейший словарь терминов, потом сможете вынести в БД или конфиг
TERMS_DICT = {
    "YADRO": "YADRO",
    "API": "API",
    "TATLIN": "TATLIN",
}


def check_terms_in_text(text: str) -> List[TermInfo]:
    terms: List[TermInfo] = []
    words = text.split()

    for w in words:
        upper = w.upper()
        if upper in TERMS_DICT:
            # корректный термин
            terms.append(TermInfo(term=w, status="approved"))
        elif upper == "ЯДРО":
            # неправильное написание YADRO
            terms.append(TermInfo(term=w, status="wrong", suggestion="YADRO"))
        # сюда можно добавлять другие правила

    return terms


def suggest_issues_for_segments(segments: List[Segment]) -> List[Issue]:
    issues: List[Issue] = []

    for seg in segments:
        text = seg.text

        if len(text) > 80:
            issues.append(Issue(
                segment_id=seg.id,
                issue="Возможно, обрезано слово",
                severity="high",
            ))
        elif "..." in text:
            issues.append(Issue(
                segment_id=seg.id,
                issue="Проверьте многоточия",
                severity="medium",
            ))

        # можно добавить ещё простые эвристики

    return issues