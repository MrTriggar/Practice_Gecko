"В этом файле можно управлять терминами, которые будут проверяться в тексте. Например, можно добавить новые термины, изменить существующие или удалить их."

import json
from pathlib import Path
from typing import List

from .models import TermInfo, Segment, Issue

TERMS_PATH = Path(__file__).parent / "terms.json"

with open(TERMS_PATH, encoding="utf-8") as f:
    TERMS = json.load(f)

TERMS_CANONICAL = {t["canonical"].upper(): t for t in TERMS}


def check_terms_in_text(text: str) -> List[TermInfo]:
    terms: List[TermInfo] = []
    words = text.split()

    for w in words:
        upper = w.upper()
        lower = w.lower()

        if upper in TERMS_CANONICAL:
            term_data = TERMS_CANONICAL[upper]
            terms.append(TermInfo(
                term=w,
                status="approved",
                category=term_data.get("category"),
            ))
            continue

        found_wrong = False
        for term_data in TERMS:
            variants_lower = [v.lower() for v in term_data["variants_wrong"]]
            if lower in variants_lower:
                terms.append(TermInfo(
                    term=w,
                    status="wrong",
                    suggestion=term_data["canonical"],
                    category=term_data.get("category"),
                ))
                found_wrong = True
                break

        if not found_wrong:
            continue

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
        elif text.isupper() and len(text) > 5:
            issues.append(Issue(
                segment_id=seg.id,
                issue="Проверьте аббревиатуры/капс",
                severity="low",
            ))

    return issues