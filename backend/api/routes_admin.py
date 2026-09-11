"""Admin panel API: statistics, moderation, broadcast and CSV reports."""
from __future__ import annotations

import csv
import io
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func, or_, select
from sqlalchemy.orm import selectinload

from .. import models
from ..bot.service import broadcast_sync, bot_status
from ..db import DB_BACKEND
from ..schemas import AdminJobPatchIn, AdminUserPatchIn, BroadcastIn
from .deps import DbSession, require_admin
from .serializers import application_public, company_public, job_public, user_public
from .utils import add_notification, audit

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
def admin_stats(db: DbSession, admin: Annotated[models.User, Depends(require_admin)]) -> dict:
    users_total = db.scalar(select(func.count()).select_from(models.User)) or 0
    seekers = db.scalar(select(func.count()).select_from(models.User).where(models.User.role == "job_seeker")) or 0
    employers = db.scalar(select(func.count()).select_from(models.User).where(models.User.role == "employer")) or 0
    telegram_users = db.scalar(select(func.count()).select_from(models.User).where(models.User.telegram_id.isnot(None))) or 0

    jobs_total = db.scalar(select(func.count()).select_from(models.Job)) or 0
    jobs_active = db.scalar(select(func.count()).select_from(models.Job).where(models.Job.status == "active")) or 0
    jobs_paused = db.scalar(select(func.count()).select_from(models.Job).where(models.Job.status == "paused")) or 0
    jobs_closed = db.scalar(select(func.count()).select_from(models.Job).where(models.Job.status == "closed")) or 0
    companies = db.scalar(select(func.count()).select_from(models.Company)) or 0
    views = db.scalar(select(func.coalesce(func.sum(models.Job.views), 0))) or 0

    applications = list(db.scalars(select(models.Application)))
    status_counts: dict[str, int] = {}
    for row in applications:
        status_counts[row.status] = status_counts.get(row.status, 0) + 1

    week_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=7)
    new_users_week = db.scalar(
        select(func.count()).select_from(models.User).where(models.User.created_at >= week_ago)
    ) or 0
    new_apps_week = db.scalar(
        select(func.count()).select_from(models.Application).where(models.Application.created_at >= week_ago)
    ) or 0

    # 14 day activity series
    series: list[dict] = []
    for offset in range(13, -1, -1):
        day = (datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=offset)).date()
        day_start = datetime.combine(day, datetime.min.time())
        day_end = day_start + timedelta(days=1)
        series.append({
            "date": day.isoformat(),
            "users": db.scalar(select(func.count()).select_from(models.User).where(
                models.User.created_at >= day_start, models.User.created_at < day_end)) or 0,
            "jobs": db.scalar(select(func.count()).select_from(models.Job).where(
                models.Job.created_at >= day_start, models.Job.created_at < day_end)) or 0,
            "applications": db.scalar(select(func.count()).select_from(models.Application).where(
                models.Application.created_at >= day_start, models.Application.created_at < day_end)) or 0,
        })

    top_jobs = []
    for job in db.scalars(
        select(models.Job).options(selectinload(models.Job.company))
        .order_by(models.Job.applications_count.desc()).limit(6)
    ):
        top_jobs.append({
            "id": job.id,
            "title": job.title,
            "company": job.company.name if job.company else None,
            "applications": db.scalar(select(func.count()).select_from(models.Application).where(
                models.Application.job_id == job.id)) or 0,
            "views": job.views or 0,
            "status": job.status,
        })

    return {
        "users": {"total": users_total, "seekers": seekers, "employers": employers,
                  "telegram": telegram_users, "newThisWeek": new_users_week},
        "jobs": {"total": jobs_total, "active": jobs_active, "paused": jobs_paused, "closed": jobs_closed},
        "companies": companies,
        "views": int(views),
        "applications": {"total": len(applications), "statusCounts": status_counts, "newThisWeek": new_apps_week},
        "series": series,
        "topJobs": top_jobs,
        "system": {
            "database": DB_BACKEND,
            "bot": bot_status(),
            "adminTelegramId": admin.telegram_id,
        },
    }


@router.get("/users")
def admin_users(
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
    search: str | None = None,
    role: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
) -> dict:
    stmt = select(models.User)
    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(or_(func.lower(models.User.name).like(like), func.lower(models.User.email).like(like)))
    if role:
        stmt = stmt.where(models.User.role == role)
    users = list(db.scalars(stmt.order_by(models.User.created_at.desc())))
    total = len(users)
    start = (page - 1) * page_size
    page_items = users[start:start + page_size]
    items = []
    for user in page_items:
        data = user_public(user, with_email=True) or {}
        data["applications"] = db.scalar(select(func.count()).select_from(models.Application).where(
            models.Application.applicant_id == user.id)) or 0
        data["jobs"] = db.scalar(select(func.count()).select_from(models.Job).where(
            models.Job.posted_by == user.id)) or 0
        items.append(data)
    return {"items": items, "total": total, "page": page, "pages": max(1, (total + page_size - 1) // page_size)}


@router.patch("/users/{user_id}")
def admin_update_user(
    user_id: int,
    payload: AdminUserPatchIn,
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
) -> dict:
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(404, detail="user_not_found")
    if user.id == admin.id and payload.is_active is False:
        raise HTTPException(400, detail="cannot_disable_yourself")
    if payload.role in {"job_seeker", "employer", "admin"}:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active
    audit(db, "admin_user_update", admin, f"{user.email} role={user.role} active={user.is_active}")
    db.commit()
    return {"user": user_public(user, with_email=True)}


@router.delete("/users/{user_id}")
def admin_delete_user(
    user_id: int,
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
) -> dict:
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(404, detail="user_not_found")
    if user.id == admin.id:
        raise HTTPException(400, detail="cannot_delete_yourself")
    audit(db, "admin_user_delete", admin, user.email)
    db.delete(user)
    db.commit()
    return {"ok": True}


@router.get("/jobs")
def admin_jobs(
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
    search: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
) -> dict:
    stmt = select(models.Job).options(selectinload(models.Job.company))
    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(or_(func.lower(models.Job.title).like(like), func.lower(models.Job.location).like(like)))
    if status_filter:
        stmt = stmt.where(models.Job.status == status_filter)
    jobs = list(db.scalars(stmt.order_by(models.Job.created_at.desc())))
    total = len(jobs)
    start = (page - 1) * page_size
    items = []
    for job in jobs[start:start + page_size]:
        data = job_public(job, detail=True)
        data["applicationsCount"] = db.scalar(select(func.count()).select_from(models.Application).where(
            models.Application.job_id == job.id)) or 0
        items.append(data)
    return {"items": items, "total": total, "page": page, "pages": max(1, (total + page_size - 1) // page_size)}


@router.patch("/jobs/{job_id}")
def admin_update_job(
    job_id: int,
    payload: AdminJobPatchIn,
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
) -> dict:
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(404, detail="job_not_found")
    if payload.status in {"active", "paused", "closed"}:
        job.status = payload.status
        if job.posted_by:
            add_notification(db, job.posted_by, "Job status changed",
                             f"“{job.title}” is now {job.status}.", kind="info", link="/employer/jobs")
    audit(db, "admin_job_update", admin, f"{job.title} status={job.status}")
    db.commit()
    return job_public(job, detail=True)


@router.delete("/jobs/{job_id}")
def admin_delete_job(job_id: int, db: DbSession, admin: Annotated[models.User, Depends(require_admin)]) -> dict:
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(404, detail="job_not_found")
    audit(db, "admin_job_delete", admin, job.title)
    db.delete(job)
    db.commit()
    return {"ok": True}


@router.get("/applications")
def admin_applications(
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
    status_filter: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
) -> dict:
    stmt = (
        select(models.Application)
        .options(
            selectinload(models.Application.job).selectinload(models.Job.company),
            selectinload(models.Application.applicant),
        )
        .order_by(models.Application.created_at.desc())
    )
    if status_filter:
        stmt = stmt.where(models.Application.status == status_filter)
    rows = list(db.scalars(stmt))
    total = len(rows)
    start = (page - 1) * page_size
    return {
        "items": [application_public(row) for row in rows[start:start + page_size]],
        "total": total,
        "page": page,
        "pages": max(1, (total + page_size - 1) // page_size),
    }


@router.get("/companies")
def admin_companies(db: DbSession, admin: Annotated[models.User, Depends(require_admin)]) -> dict:
    companies = list(db.scalars(select(models.Company).order_by(models.Company.name)))
    items = []
    for company in companies:
        open_jobs = db.scalar(select(func.count()).select_from(models.Job).where(
            models.Job.company_id == company.id, models.Job.status == "active")) or 0
        items.append(company_public(company, open_jobs=open_jobs))
    return {"items": items, "total": len(items)}


@router.post("/broadcast")
def admin_broadcast(
    payload: BroadcastIn,
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
) -> dict:
    users = list(db.scalars(select(models.User).where(models.User.is_active.is_(True))))
    if payload.audience == "job_seekers":
        users = [u for u in users if u.role == "job_seeker"]
    elif payload.audience == "employers":
        users = [u for u in users if u.role == "employer"]

    for user in users:
        add_notification(db, user.id, "LocalJob announcement", payload.message, kind="info", link="/notifications")

    telegram_sent = {"sent": 0, "failed": 0, "skipped": 0}
    telegram_ids = [u.telegram_id for u in users if u.telegram_id]
    if telegram_ids:
        telegram_sent = broadcast_sync(telegram_ids, payload.message)

    audit(db, "admin_broadcast", admin, f"audience={payload.audience} push={len(users)}")
    db.commit()
    return {"ok": True, "notified": len(users), "telegram": telegram_sent}


@router.get("/activity")
def admin_activity(db: DbSession, admin: Annotated[models.User, Depends(require_admin)], limit: int = 50) -> dict:
    rows = list(db.scalars(select(models.AuditLog).order_by(models.AuditLog.created_at.desc()).limit(limit)))
    return {
        "items": [
            {
                "id": row.id,
                "actor": row.actor,
                "action": row.action,
                "detail": row.detail,
                "createdAt": row.created_at.isoformat() + "Z" if row.created_at else None,
            }
            for row in rows
        ]
    }


@router.get("/export")
def admin_export(
    db: DbSession,
    admin: Annotated[models.User, Depends(require_admin)],
    type: str = Query("jobs", pattern="^(jobs|users|applications)$"),
) -> StreamingResponse:
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    if type == "users":
        writer.writerow(["id", "name", "email", "role", "location", "phone", "telegram_id", "is_active", "created_at"])
        for user in db.scalars(select(models.User).order_by(models.User.id)):
            writer.writerow([user.id, user.name, user.email, user.role, user.location or "", user.phone or "",
                             user.telegram_id or "", int(user.is_active), user.created_at])
    elif type == "applications":
        writer.writerow(["id", "job", "company", "applicant", "applicant_email", "status", "match", "created_at"])
        rows = db.scalars(
            select(models.Application)
            .options(selectinload(models.Application.job).selectinload(models.Job.company),
                     selectinload(models.Application.applicant))
        )
        for row in rows:
            writer.writerow([
                row.id,
                row.job.title if row.job else "",
                row.job.company.name if row.job and row.job.company else "",
                row.applicant.name if row.applicant else row.full_name or "",
                row.applicant.email if row.applicant else row.email or "",
                row.status,
                row.match_score,
                row.created_at,
            ])
    else:
        writer.writerow(["id", "title", "company", "category", "location", "employment_type", "experience_level",
                         "salary_min", "salary_max", "currency", "status", "views", "applications", "created_at"])
        for job in db.scalars(select(models.Job).options(selectinload(models.Job.company)).order_by(models.Job.id)):
            writer.writerow([job.id, job.title, job.company.name if job.company else "", job.category, job.location,
                             job.employment_type, job.experience_level, job.salary_min or "", job.salary_max or "",
                             job.currency, job.status, job.views or 0, job.applications_count or 0, job.created_at])

    buffer.seek(0)
    filename = f"localjob-{type}-{datetime.now(timezone.utc).date().isoformat()}.csv"
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
