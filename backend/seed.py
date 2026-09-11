"""Seeds the LocalJob database with companies, jobs, demo users and demo activity.

This script is idempotent: running it twice will not duplicate data.
It is executed automatically on `python main.py` when the database is empty.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from . import models
from .security import hash_password
from .seed_data import (
    ADMIN_USER,
    COMPANIES,
    DEMO_APPLICATION_TITLES,
    DEMO_EMPLOYER,
    DEMO_JOB_SEEKER,
    DEMO_NOTIFICATIONS,
    DEMO_SAVED_TITLES,
    JOBS,
)

log = logging.getLogger("localjob.seed")


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def get_or_create_user(db: Session, data: dict) -> models.User:
    user = db.scalar(select(models.User).where(models.User.email == data["email"]))
    if user:
        return user
    user = models.User(
        name=data["name"],
        email=data["email"],
        password_hash=hash_password(data["password"]),
        role=data["role"],
        phone=data.get("phone"),
        location=data.get("location"),
        language="uz",
        theme="dark",
    )
    db.add(user)
    db.flush()
    log.info("Created user %s (%s)", user.email, user.role)
    return user


def get_or_create_company(db: Session, data: dict, owner: models.User | None = None) -> models.Company:
    company = db.scalar(select(models.Company).where(models.Company.slug == data["slug"]))
    if company:
        if owner and not company.owner_id:
            company.owner_id = owner.id
        return company
    company = models.Company(
        name=data["name"],
        slug=data["slug"],
        industry=data.get("industry"),
        location=data.get("location"),
        size=data.get("size"),
        website=data.get("website"),
        about=data.get("about"),
        logo=data.get("logo"),
        color=data.get("color", "#1D4ED8"),
        verified=data.get("verified", False),
        owner_id=owner.id if owner else None,
    )
    db.add(company)
    db.flush()
    log.info("Created company %s", company.name)
    return company


def _ensure_profile(db: Session, user: models.User, data: dict, category: str | None = None) -> models.Profile:
    profile = db.scalar(select(models.Profile).where(models.Profile.user_id == user.id))
    if profile:
        return profile
    profile = models.Profile(
        user_id=user.id,
        title=data.get("title"),
        bio=data.get("bio"),
        location=data.get("location") or user.location,
        phone=data.get("phone") or user.phone,
        category=data.get("category", category),
        skills=data.get("skills", []),
        experience=data.get("experience", []),
        education=data.get("education", []),
        languages=data.get("languages", []),
        portfolio=data.get("portfolio"),
        linkedin=data.get("linkedin"),
        github=data.get("github"),
        telegram=data.get("telegram"),
        website=data.get("website"),
        expected_salary=data.get("expected_salary"),
        experience_level=data.get("experience_level"),
        views=data.get("views", 0),
    )
    db.add(profile)
    db.flush()
    return profile


def seed_jobs(db: Session) -> int:
    """Insert the 37 realistic seed jobs (only once)."""
    existing = db.scalar(select(func.count()).select_from(models.Job)) or 0
    if existing:
        return 0
    companies = {c["name"]: get_or_create_company(db, c) for c in COMPANIES}
    now = _now()
    for index, job in enumerate(JOBS):
        company = companies.get(job["company"])
        db.add(
            models.Job(
                title=job["title"],
                category=job["category"],
                location=job["location"],
                is_remote=job.get("is_remote", job["location"] == "Remote"),
                salary_min=job["salary_min"],
                salary_max=job["salary_max"],
                currency=job.get("currency", "UZS"),
                salary_period=job.get("salary_period", "month"),
                employment_type=job["employment_type"],
                experience_level=job["experience_level"],
                description=job["description"],
                responsibilities=job["responsibilities"],
                requirements=job["requirements"],
                benefits=job["benefits"],
                skills=job["skills"],
                company_id=company.id if company else None,
                status="active",
                views=job["views"],
                applications_count=job["applications_count"],
                created_at=now - timedelta(days=job["days_ago"], hours=index % 12),
            )
        )
    db.flush()
    return len(JOBS)


def seed_demo_users(db: Session) -> None:
    seeker = get_or_create_user(db, DEMO_JOB_SEEKER)
    employer = get_or_create_user(db, DEMO_EMPLOYER)
    get_or_create_user(db, ADMIN_USER)

    _ensure_profile(db, seeker, DEMO_JOB_SEEKER["profile"])

    technova = db.scalar(select(models.Company).where(models.Company.name == "TechNova Solutions"))
    if technova and not technova.owner_id:
        technova.owner_id = employer.id
    # Jobs published by the demo employer so the employer dashboard is alive
    if technova:
        for job in db.scalars(select(models.Job).where(models.Job.company_id == technova.id)):
            if not job.posted_by:
                job.posted_by = employer.id
    if technova and "Head of People Operations" not in (technova.about or ""):
        technova.about = (technova.about or "") + " Owned and operated locally, we are hiring across engineering, design and operations."
    pixelforge_owner = get_or_create_user(
        db,
        {
            "name": "Sardor Aliyev",
            "email": "studio@pixelcraft.uz",
            "password": "Demo1234!",
            "role": "employer",
            "location": "Tashkent",
        },
    )
    pixelcraft = db.scalar(select(models.Company).where(models.Company.name == "PixelCraft Studio"))
    if pixelcraft and not pixelcraft.owner_id:
        pixelcraft.owner_id = pixelforge_owner.id
        for job in db.scalars(select(models.Job).where(models.Job.company_id == pixelcraft.id)):
            if not job.posted_by:
                job.posted_by = pixelforge_owner.id
    db.flush()

    # Demo applications + saved jobs + notifications for the seeker
    for day, (title, letter) in enumerate(DEMO_APPLICATION_TITLES):
        job = db.scalar(select(models.Job).where(models.Job.title == title))
        if not job:
            continue
        existing = db.scalar(
            select(models.Application).where(
                models.Application.job_id == job.id,
                models.Application.applicant_id == seeker.id,
            )
        )
        if existing:
            continue
        db.add(
            models.Application(
                job_id=job.id,
                applicant_id=seeker.id,
                employer_id=job.posted_by or (technova.owner_id if technova else None),
                status="submitted" if day == 0 else "shortlisted",
                full_name=seeker.name,
                email=seeker.email,
                phone=seeker.phone,
                cover_letter=letter,
                portfolio_url=DEMO_JOB_SEEKER["profile"]["portfolio"],
                resume_name="Aziz_Karimov_CV.pdf",
                match_score=92 - day * 7,
                created_at=_now() - timedelta(days=day * 3 + 1),
            )
        )

    for title in DEMO_SAVED_TITLES:
        job = db.scalar(select(models.Job).where(models.Job.title == title))
        if not job:
            continue
        existing = db.scalar(
            select(models.SavedJob).where(models.SavedJob.user_id == seeker.id, models.SavedJob.job_id == job.id)
        )
        if existing:
            continue
        db.add(models.SavedJob(user_id=seeker.id, job_id=job.id))

    for kind, title, message, link, days in DEMO_NOTIFICATIONS:
        existing = db.scalar(
            select(models.Notification).where(
                models.Notification.user_id == seeker.id, models.Notification.title == title
            )
        )
        if existing:
            continue
        db.add(
            models.Notification(
                user_id=seeker.id,
                kind=kind,
                title=title,
                message=message,
                link=link,
                is_read=False,
                created_at=_now() - timedelta(days=days),
            )
        )

    # A few applications from other candidates so employer dashboards look alive
    extra_candidates = [
        ("Malika Abdullaeva", "malika.abdullaeva@example.com", "UI/UX Designer", "shortlisted", 88),
        ("Jasur Tursunov", "jasur.tursunov@example.com", "React Developer", "interview", 84),
        ("Nilufar Rashidova", "nilufar.rashidova@example.com", "Frontend Developer", "review", 79),
        ("Sardor Mirzayev", "sardor.mirzayev@example.com", "Backend Developer (Python)", "hired", 91),
        ("Kamila Nazarova", "kamila.nazarova@example.com", "SMM Manager", "rejected", 55),
    ]
    for name, email, job_title, status, score in extra_candidates:
        job = db.scalar(select(models.Job).where(models.Job.title == job_title))
        if not job:
            continue
        candidate = get_or_create_user(
            db,
            {"name": name, "email": email, "password": "Demo1234!", "role": "job_seeker", "location": "Tashkent"},
        )
        _ensure_profile(db, candidate, {"title": job_title, "skills": job.skills or [], "category": job.category, "location": "Tashkent"})
        exists = db.scalar(
            select(models.Application).where(
                models.Application.job_id == job.id, models.Application.applicant_id == candidate.id
            )
        )
        if exists:
            continue
        db.add(
            models.Application(
                job_id=job.id,
                applicant_id=candidate.id,
                employer_id=job.posted_by,
                status=status,
                full_name=name,
                email=email,
                phone="+998 90 000 00 00",
                cover_letter=(
                    f"Hello! I am applying for the {job_title} position. I have relevant experience with "
                    f"{', '.join((job.skills or [])[:2]) or 'this field'} and I am ready to start quickly. "
                    "I would be glad to discuss how I can contribute to your team."
                ),
                portfolio_url="https://portfolio.example.com",
                resume_name=f"{name.split()[0].lower()}_cv.pdf",
                match_score=score,
                created_at=_now() - timedelta(days=score % 9 + 1),
            )
        )
    db.flush()


def run_seed(force: bool = False) -> dict[str, int]:
    from .db import session_scope

    stats = {"companies": 0, "jobs": 0, "users": 0, "applications": 0}
    with session_scope() as db:
        created = seed_jobs(db)
        stats["jobs"] = created
        if created or force:
            seed_demo_users(db)
        stats["companies"] = db.scalar(select(func.count()).select_from(models.Company)) or 0
        stats["users"] = db.scalar(select(func.count()).select_from(models.User)) or 0
        stats["applications"] = db.scalar(select(func.count()).select_from(models.Application)) or 0
    log.info("Seed complete: %s", stats)
    return stats


if __name__ == "__main__":  # pragma: no cover
    logging.basicConfig(level=logging.INFO)
    print(run_seed(force=True))
