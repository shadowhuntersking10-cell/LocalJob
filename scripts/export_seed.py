#!/usr/bin/env python3
"""Export the Python seed data to JSON so the frontend can run offline (localStorage mode).

Usage:  python scripts/export_seed.py     (writes web/src/data/seed.json)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.seed_data import (  # noqa: E402
    ADMIN_USER,
    CATEGORIES,
    COMPANIES,
    DEMO_APPLICATION_TITLES,
    DEMO_EMPLOYER,
    DEMO_JOB_SEEKER,
    DEMO_NOTIFICATIONS,
    DEMO_SAVED_TITLES,
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
    JOBS,
    LOCATIONS,
    POPULAR_CATEGORIES,
)

OUT = ROOT / "web" / "src" / "data" / "seed.json"


def main() -> None:
    payload = {
        "categories": CATEGORIES,
        "popularCategories": POPULAR_CATEGORIES,
        "locations": LOCATIONS,
        "employmentTypes": EMPLOYMENT_TYPES,
        "experienceLevels": EXPERIENCE_LEVELS,
        "companies": COMPANIES,
        "jobs": JOBS,
        "demoSeeker": DEMO_JOB_SEEKER,
        "demoEmployer": DEMO_EMPLOYER,
        "admin": ADMIN_USER,
        "demoApplications": [{"title": t, "coverLetter": c} for t, c in DEMO_APPLICATION_TITLES],
        "demoSavedTitles": DEMO_SAVED_TITLES,
        "demoNotifications": [
            {"kind": k, "title": t, "message": m, "link": link, "daysAgo": d}
            for k, t, m, link, d in DEMO_NOTIFICATIONS
        ],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} · {len(JOBS)} jobs · {len(COMPANIES)} companies")


if __name__ == "__main__":
    main()
