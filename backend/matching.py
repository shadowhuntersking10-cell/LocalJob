"""Client-side style matching logic, executed server side so every client agrees."""
from __future__ import annotations

from typing import Any, Iterable

EXPERIENCE_ORDER = {"No experience": 0, "Junior": 1, "Middle": 2, "Senior": 3}


def _as_set(values: Iterable[Any] | None) -> set[str]:
    if not values:
        return set()
    return {str(v).strip().lower() for v in values if str(v).strip()}


def match_score(job: Any, profile: Any | None, user: Any | None = None) -> int:
    """Return a 0-100 match percentage between a job and a seeker profile."""
    if profile is None and user is None:
        return 0
    score = 30.0  # base for having a profile at all

    job_skills = _as_set(getattr(job, "skills", []))
    prof_skills = _as_set(getattr(profile, "skills", []) if profile else [])

    if job_skills and prof_skills:
        overlap = len(job_skills & prof_skills) / len(job_skills)
        score += overlap * 30
    elif prof_skills:
        score += 6

    job_category = (getattr(job, "category", "") or "").lower()
    prof_category = (getattr(profile, "category", "") or "").lower() if profile else ""
    if prof_category and prof_category == job_category:
        score += 18

    job_location = (getattr(job, "location", "") or "").lower()
    prof_location = ((getattr(profile, "location", "") or "") if profile else "") or (
        (getattr(user, "location", "") or "") if user else ""
    )
    prof_location = prof_location.lower()
    if job_location == "remote" or "remote" in job_location:
        score += 8
    elif prof_location and (prof_location in job_location or job_location in prof_location):
        score += 14

    job_exp = EXPERIENCE_ORDER.get(getattr(job, "experience_level", "") or "", None)
    prof_exp = EXPERIENCE_ORDER.get(
        (getattr(profile, "experience_level", "") or "") if profile else "", None
    )
    if job_exp is not None and prof_exp is not None:
        delta = abs(job_exp - prof_exp)
        score += 12 if delta == 0 else 8 if delta == 1 else 2

    title = (getattr(job, "title", "") or "").lower()
    if profile and (getattr(profile, "title", "") or ""):
        prof_title = profile.title.lower()
        words = {w for w in prof_title.replace("(", " ").replace(")", " ").split() if len(w) > 3}
        if words and any(w in title for w in words):
            score += 12

    if profile and getattr(profile, "bio", None):
        score += 3
    if profile and getattr(profile, "experience", None):
        score += 4

    return int(max(12, min(99, round(score))))
