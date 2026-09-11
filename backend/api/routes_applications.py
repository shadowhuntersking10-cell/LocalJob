"""Applications, employer candidate pipeline and dashboards."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from .. import models
from ..matching import match_score
from ..schemas import ApplicationIn, ApplicationStatusIn
from .deps import DbSession, current_user, require_employer
from .serializers import (
    application_public,
    job_public,
    profile_completion,
    profile_public,
    saved_job_public,
    user_public,
)
from .utils import add_notification, audit

router = APIRouter(prefix="/api", tags=["applications"])

STATUS_LABELS = {
    "submitted": "Submitted",
    "review": "Under review",
    "shortlisted": "Shortlisted",
    "interview": "Interview",
    "rejected": "Rejected",
    "hired": "Hired",
}


def _profile_of(db: Session, user: models.User | None) -> models.Profile | None:
    if not user:
        return None
    return db.scalar(select(models.Profile).where(models.Profile.user_id == user.id))


@router.post("/applications", status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationIn,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    if user.role == "employer":
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="employer_cannot_apply")

    job = db.get(models.Job, payload.job_id)
    if not job:
        raise HTTPException(404, detail="job_not_found")
    if job.status != "active":
        raise HTTPException(409, detail="job_not_active")

    duplicate = db.scalar(select(models.Application).where(
        models.Application.job_id == job.id, models.Application.applicant_id == user.id
    ))
    if duplicate:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="already_applied")

    profile = _profile_of(db, user)
    application = models.Application(
        job_id=job.id,
        applicant_id=user.id,
        employer_id=job.posted_by,
        status="submitted",
        full_name=payload.full_name.strip(),
        email=str(payload.email),
        phone=payload.phone,
        cover_letter=payload.cover_letter,
        portfolio_url=payload.portfolio_url,
        resume_name=payload.resume_name,
        match_score=match_score(job, profile, user),
    )
    db.add(application)
    job.applications_count = (job.applications_count or 0) + 1

    add_notification(db, user.id, "Application submitted",
                     f"Your application for {job.title} at {job.company.name if job.company else 'the company'} was sent successfully.",
                     kind="success", link="/applications")
    if job.posted_by:
        add_notification(db, job.posted_by, "New application received",
                         f"{payload.full_name} applied for {job.title}.", kind="job", link="/employer/applications")
    audit(db, "application_create", user, job.title)
    db.commit()
    db.refresh(application)
    return application_public(application)


@router.get("/applications")
def my_applications(
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
    status_filter: str | None = Query(None, alias="status"),
) -> dict:
    stmt = (
        select(models.Application)
        .options(selectinload(models.Application.job).selectinload(models.Job.company))
        .where(models.Application.applicant_id == user.id)
        .order_by(models.Application.created_at.desc())
    )
    if status_filter:
        stmt = stmt.where(models.Application.status.in_([s.strip() for s in status_filter.split(",") if s.strip()]))
    rows = list(db.scalars(stmt))
    counts: dict[str, int] = {}
    for row in rows:
        counts[row.status] = counts.get(row.status, 0) + 1
    return {"items": [application_public(row) for row in rows], "total": len(rows), "counts": counts}


@router.get("/applications/{application_id}")
def application_detail(
    application_id: int,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    app_row = db.get(models.Application, application_id)
    if not app_row:
        raise HTTPException(404, detail="application_not_found")
    is_owner = app_row.applicant_id == user.id or app_row.employer_id == user.id
    if user.role != "admin" and not is_owner:
        job = db.get(models.Job, app_row.job_id)
        if not job or job.posted_by != user.id:
            raise HTTPException(403, detail="forbidden")
    return application_public(app_row)


@router.patch("/applications/{application_id}/status")
def update_status(
    application_id: int,
    payload: ApplicationStatusIn,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    app_row = db.get(models.Application, application_id)
    if not app_row:
        raise HTTPException(404, detail="application_not_found")
    job = db.get(models.Job, app_row.job_id)
    is_employer = user.role in {"employer", "admin"} and (
        user.role == "admin" or (job and job.posted_by == user.id)
    )
    if not is_employer:
        raise HTTPException(403, detail="only_employer_can_change_status")

    old = app_row.status
    app_row.status = payload.status
    label = STATUS_LABELS.get(payload.status, payload.status)
    add_notification(db, app_row.applicant_id, "Application status changed",
                     f"Your application for {job.title if job else 'the job'} is now: {label}.",
                     kind="status", link="/applications")
    if payload.status == "hired" and job:
        db.add(models.Notification(
            user_id=app_row.applicant_id, kind="success", title="Congratulations, you were hired!",
            message=f"You were hired for {job.title}.", link="/applications",
        ))
    audit(db, "application_status", user, f"{old}->{payload.status}")
    db.commit()
    return application_public(app_row)


@router.get("/employer/applications")
def employer_applications(
    db: DbSession,
    user: Annotated[models.User, Depends(require_employer)],
    job_id: int | None = Query(None, alias="jobId"),
    status_filter: str | None = Query(None, alias="status"),
) -> dict:
    stmt = (
        select(models.Application)
        .options(
            selectinload(models.Application.job),
            selectinload(models.Application.applicant).selectinload(models.User.profile),
        )
    )
    if user.role != "admin":
        my_job_ids = select(models.Job.id).where(models.Job.posted_by == user.id)
        stmt = stmt.where(models.Application.job_id.in_(my_job_ids))
    if job_id:
        stmt = stmt.where(models.Application.job_id == job_id)
    if status_filter:
        stmt = stmt.where(models.Application.status.in_([s.strip() for s in status_filter.split(",") if s.strip()]))
    rows = list(db.scalars(stmt.order_by(models.Application.created_at.desc())))

    my_jobs = list(db.scalars(select(models.Job).where(models.Job.posted_by == user.id).order_by(models.Job.created_at.desc())))
    counts: dict[str, int] = {}
    for row in rows:
        counts[row.status] = counts.get(row.status, 0) + 1
    return {
        "items": [application_public(row) for row in rows],
        "total": len(rows),
        "counts": counts,
        "jobs": [{"id": j.id, "title": j.title} for j in my_jobs],
    }


# --------------------------------------------------------------------------
# Dashboards
# --------------------------------------------------------------------------
@router.get("/dashboard")
def seeker_dashboard(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    profile = _profile_of(db, user)

    applications = list(db.scalars(
        select(models.Application)
        .options(selectinload(models.Application.job).selectinload(models.Job.company))
        .where(models.Application.applicant_id == user.id)
        .order_by(models.Application.created_at.desc())
    ))
    saved = list(db.scalars(
        select(models.SavedJob)
        .options(selectinload(models.SavedJob.job).selectinload(models.Job.company))
        .where(models.SavedJob.user_id == user.id)
        .order_by(models.SavedJob.created_at.desc())
    ))
    active_jobs = list(db.scalars(
        select(models.Job).options(selectinload(models.Job.company)).where(models.Job.status == "active")
    ))
    recommended = sorted(active_jobs, key=lambda j: match_score(j, profile, user), reverse=True)[:6]

    stats_counts: dict[str, int] = {}
    for app_row in applications:
        stats_counts[app_row.status] = stats_counts.get(app_row.status, 0) + 1

    return {
        "stats": {
            "applications": len(applications),
            "savedJobs": len(saved),
            "profileViews": (profile.views if profile else 0) + 42,
            "profileCompletion": profile_completion(user, profile),
            "interviews": stats_counts.get("interview", 0),
            "shortlisted": stats_counts.get("shortlisted", 0),
        },
        "statusCounts": stats_counts,
        "recommended": [job_public(job, profile, user) for job in recommended],
        "recentApplications": [application_public(row) for row in applications[:4]],
        "savedJobs": [saved_job_public(row, profile, user) for row in saved[:4] if row.job],
        "profile": profile_public(profile),
    }


@router.get("/employer/dashboard")
def employer_dashboard(db: DbSession, user: Annotated[models.User, Depends(require_employer)]) -> dict:
    jobs = list(db.scalars(
        select(models.Job).options(selectinload(models.Job.company))
        .where(models.Job.posted_by == user.id)
        .order_by(models.Job.created_at.desc())
    ))
    job_ids = [j.id for j in jobs]
    applications = list(db.scalars(
        select(models.Application)
        .options(
            selectinload(models.Application.job),
            selectinload(models.Application.applicant).selectinload(models.User.profile),
        )
        .where(models.Application.job_id.in_(job_ids) if job_ids else models.Application.id < 0)
        .order_by(models.Application.created_at.desc())
    ))
    week_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=7)
    company = db.scalar(select(models.Company).where(models.Company.owner_id == user.id))
    return {
        "stats": {
            "activeJobs": sum(1 for j in jobs if j.status == "active"),
            "totalJobs": len(jobs),
            "applications": len(applications),
            "views": sum(j.views or 0 for j in jobs),
            "hired": sum(1 for a in applications if a.status == "hired"),
            "newThisWeek": sum(1 for a in applications if a.created_at and a.created_at >= week_ago),
            "pausedJobs": sum(1 for j in jobs if j.status == "paused"),
        },
        "jobs": [job_public(job, detail=True) for job in jobs],
        "recentApplications": [application_public(row) for row in applications[:6]],
        "company": (lambda c: {
            "id": c.id, "name": c.name, "slug": c.slug, "logo": c.logo, "color": c.color,
            "industry": c.industry, "location": c.location, "size": c.size,
            "website": c.website, "about": c.about, "verified": c.verified,
        })(company) if company else None,
        "me": user_public(user, with_email=True),
    }


@router.get("/employer/candidates/{user_id}")
def candidate_profile(
    user_id: int,
    db: DbSession,
    user: Annotated[models.User, Depends(require_employer)],
) -> dict:
    candidate = db.get(models.User, user_id)
    if not candidate:
        raise HTTPException(404, detail="candidate_not_found")
    profile = _profile_of(db, candidate)
    hired = db.scalar(select(func.count()).select_from(models.Application).where(
        models.Application.applicant_id == user_id, models.Application.status == "hired"
    )) or 0
    return {
        "user": user_public(candidate, with_email=True),
        "profile": profile_public(profile),
        "completion": profile_completion(candidate, profile),
        "hiredCount": hired,
    }
