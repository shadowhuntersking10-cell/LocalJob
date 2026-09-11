"""Public metadata: categories, locations, filters, branding."""
from __future__ import annotations

from fastapi import APIRouter

from ..config import settings
from ..seed_data import CATEGORIES, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, LOCATIONS, POPULAR_CATEGORIES

router = APIRouter(prefix="/api", tags=["meta"])


@router.get("/meta")
def meta() -> dict:
    return {
        "app": {
            "name": "LocalJob",
            "tagline": {
                "uz": "Ish toping. Xodim toping. Mahalliy darajada o'sing.",
                "en": "Find work. Find talent. Grow locally.",
                "ru": "Найдите работу. Найдите таланты. Растите локально.",
            },
            "version": "1.0.0",
            "botUsername": settings.bot_username,
            "webAppUrl": settings.webapp_url,
        },
        "categories": CATEGORIES,
        "popularCategories": POPULAR_CATEGORIES,
        "locations": LOCATIONS,
        "employmentTypes": EMPLOYMENT_TYPES,
        "experienceLevels": EXPERIENCE_LEVELS,
        "currencies": ["UZS", "USD", "EUR"],
        "salaryPeriods": ["month", "year", "hour", "project"],
        "accountTypes": ["job_seeker", "employer"],
        "applicationStatuses": [
            "submitted", "review", "shortlisted", "interview", "rejected", "hired"
        ],
        "jobStatuses": ["active", "paused", "closed"],
    }
