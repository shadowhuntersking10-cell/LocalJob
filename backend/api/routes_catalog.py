"""Jobs catalogue, companies, saved jobs and recommendations."""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import String, and_, cast, func, or_, select
from sqlalchemy.orm import Session, selectinload

from .. import models
from ..matching import match_score
from ..schemas import JobIn, JobUpdateIn
from .deps import DbSession, current_user, current_user_optional, require_employer
from .serializers import company_public, job_public, profile_public, saved_job_public, user_public
from .utils import add_notification, audit

router = APIRouter(prefix="/api", tags=["catalog"])

ACTIVE = "active"


def _split(value: str | None) -> list[str]:
    if not value:
        return []
    return [chunk.strip() for chunk in value.split(",") if chunk.strip()]


def _profile_of(db: Session, user: models.User | None) -> models.Profile | None:
    if not user:
        return None
    return db.scalar(select(models.Profile).where(models.Profile.user_id == user.id))


def _filtered_query(
    db: Session,
    search: str | None,
    location: str | None,
    categories: list[str],
    employment_types: list[str],
    experience_levels: list[str],
    salary_min: int | None,
    salary_max: int | None,
    company_id: int | None,
    posted_by: int | None,
    statuses: list[str],
    remote_only: bool,
):
    stmt = select(models.Job).options(selectinload(models.Job.company))
    conditions = []

    if statuses:
        conditions.append(models.Job.status.in_(statuses))
    else:
        conditions.append(models.Job.status == ACTIVE)

    if search:
        like = f"%{search.strip().lower()}%"
        conditions.append(
            or_(
                func.lower(models.Job.title).like(like),
                func.lower(models.Job.description).like(like),
                func.lower(models.Job.category).like(like),
                func.lower(models.Job.location).like(like),
                func.lower(cast(models.Job.skills, String)).like(like),
                models.Job.company_id.in_(
                    select(models.Company.id).where(func.lower(models.Company.name).like(like))
                ),
            )
        )
    if location and location.lower() not in {"", "any", "all"}:
        like = f"%{location.strip().lower()}%"
        conditions.append(
            or_(func.lower(models.Job.location).like(like), models.Job.is_remote.is_(True))
        )
    if categories:
        conditions.append(models.Job.category.in_(categories))
    if employment_types:
        conditions.append(models.Job.employment_type.in_(employment_types))
    if experience_levels:
        conditions.append(models.Job.experience_level.in_(experience_levels))
    if salary_min is not None:
        conditions.append(or_(models.Job.salary_max >= salary_min, models.Job.salary_max.is_(None)))
    if salary_max is not None:
        conditions.append(or_(models.Job.salary_min <= salary_max, models.Job.salary_min.is_(None)))
    if company_id:
        conditions.append(models.Job.company_id == company_id)
    if posted_by:
        conditions.append(models.Job.posted_by == posted_by)
    if remote_only:
        conditions.append(or_(models.Job.is_remote.is_(True), func.lower(models.Job.location) == "remote"))

    if conditions:
        stmt = stmt.where(and_(*conditions))
    return stmt


@router.get("/jobs")
def list_jobs(
    db: DbSession,
    user: Annotated[models.User | None, Depends(current_user_optional)],
    search: str | None = None,
    location: str | None = None,
    category: str | None = None,
    employment_type: str | None = Query(None, alias="employmentType"),
    experience_level: str | None = Query(None, alias="experienceLevel"),
    salary_min: int | None = Query(None, alias="salaryMin", ge=0),
    salary_max: int | None = Query(None, alias="salaryMax", ge=0),
    company_id: int | None = Query(None, alias="companyId"),
    posted_by: int | None = Query(None, alias="postedBy"),
    remote: bool = False,
    sort: str = "recent",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50, alias="pageSize"),
    statuses: str | None = Query(None, description="comma separated job statuses"),
) -> dict:
    categories = _split(category)
    employment_types = _split(employment_type)
    experience_levels = _split(experience_level)
    wanted_statuses = _split(statuses)

    profile = _profile_of(db, user)

    stmt = _filtered_query(
        db, search, location, categories, employment_types, experience_levels,
        salary_min, salary_max, company_id, posted_by, wanted_statuses, remote,
    )
    jobs = list(db.scalars(stmt).unique())

    if sort == "salary":
        jobs.sort(key=lambda j: (j.salary_max or j.salary_min or 0), reverse=True)
    elif sort == "relevant":
        jobs.sort(key=lambda j: match_score(j, profile, user), reverse=True)
    elif sort == "oldest":
        jobs.sort(key=lambda j: j.created_at)
    else:
        jobs.sort(key=lambda j: j.created_at, reverse=True)

    total = len(jobs)
    pages = max(1, (total + page_size - 1) // page_size)
    page = min(page, pages)
    start = (page - 1) * page_size
    page_items = jobs[start:start + page_size]

    # facets are computed over the whole active catalogue
    all_active = list(db.scalars(select(models.Job).where(models.Job.status == ACTIVE)))

    def count_by(attr: str) -> list[dict]:
        buckets: dict[str, int] = {}
        for job in all_active:
            key = getattr(job, attr) or ""
            buckets[key] = buckets.get(key, 0) + 1
        return [{"value": k, "count": v} for k, v in sorted(buckets.items(), key=lambda x: -x[1]) if k]

    return {
        "items": [job_public(job, profile, user) for job in page_items],
        "total": total,
        "page": page,
        "pageSize": page_size,
        "pages": pages,
        "facets": {
            "categories": count_by("category"),
            "locations": count_by("location"),
            "employmentTypes": count_by("employment_type"),
            "experienceLevels": count_by("experience_level"),
        },
    }


@router.get("/jobs/recommended")
def recommended_jobs(
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
    limit: int = Query(6, ge=1, le=24),
) -> dict:
    profile = _profile_of(db, user)
    jobs = list(db.scalars(select(models.Job).options(selectinload(models.Job.company)).where(models.Job.status == ACTIVE)))
    scored = sorted(jobs, key=lambda j: match_score(j, profile, user), reverse=True)[:limit]
    return {"items": [job_public(job, profile, user) for job in scored]}


@router.get("/jobs/mine")
def my_jobs(
    db: DbSession,
    user: Annotated[models.User, Depends(require_employer)],
    status_filter: str | None = Query(None, alias="status"),
) -> dict:
    stmt = select(models.Job).options(selectinload(models.Job.company)).where(models.Job.posted_by == user.id)
    statuses = _split(status_filter)
    if statuses:
        stmt = stmt.where(models.Job.status.in_(statuses))
    jobs = list(db.scalars(stmt.order_by(models.Job.created_at.desc())))
    items = []
    for job in jobs:
        data = job_public(job, detail=True)
        data["applicationsCount"] = db.scalar(
            select(func.count()).select_from(models.Application).where(models.Application.job_id == job.id)
        ) or 0
        items.append(data)
    return {"items": items, "total": len(items)}


@router.get("/jobs/{job_id}")
def job_detail(
    job_id: int,
    db: DbSession,
    user: Annotated[models.User | None, Depends(current_user_optional)],
) -> dict:
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="job_not_found")
    profile = _profile_of(db, user)
    data = job_public(job, profile, user, detail=True)
    company_jobs = db.scalar(
        select(func.count()).select_from(models.Job).where(
            models.Job.company_id == job.company_id, models.Job.status == ACTIVE
        )
    ) if job.company_id else 0
    data["company"] = company_public(job.company, open_jobs=company_jobs)
    saved = False
    applied = False
    if user:
        saved = bool(db.scalar(select(models.SavedJob).where(
            models.SavedJob.user_id == user.id, models.SavedJob.job_id == job.id
        )))
        applied = bool(db.scalar(select(models.Application).where(
            models.Application.job_id == job.id, models.Application.applicant_id == user.id
        )))
    data["isSaved"] = saved
    data["hasApplied"] = applied
    data["canApply"] = bool(user and user.role in {"job_seeker", "admin"} and not applied and job.status == ACTIVE)
    return data


@router.post("/jobs/{job_id}/view")
def register_view(job_id: int, db: DbSession) -> dict:
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(404, detail="job_not_found")
    job.views = (job.views or 0) + 1
    db.commit()
    return {"ok": True, "views": job.views}


@router.post("/jobs", status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobIn,
    db: DbSession,
    user: Annotated[models.User, Depends(require_employer)],
) -> dict:
    company = None
    if payload.company_id:
        company = db.get(models.Company, payload.company_id)
        if company and user.role != "admin" and company.owner_id != user.id:
            raise HTTPException(403, detail="not_your_company")
    if company is None:
        company = db.scalar(select(models.Company).where(models.Company.owner_id == user.id))
    if company is None and payload.company_name:
        slug = payload.company_name.strip().lower().replace(" ", "-")[:150]
        company = models.Company(name=payload.company_name.strip(), slug=slug, owner_id=user.id, location=payload.location)
        db.add(company)
        db.flush()

    job = models.Job(
        title=payload.title.strip(),
        category=payload.category,
        location=payload.location,
        is_remote=payload.is_remote or payload.location.lower() == "remote",
        salary_min=payload.salary_min,
        salary_max=payload.salary_max,
        currency=payload.currency,
        salary_period=payload.salary_period,
        employment_type=payload.employment_type,
        experience_level=payload.experience_level,
        description=payload.description,
        responsibilities=payload.responsibilities,
        requirements=payload.requirements,
        benefits=payload.benefits,
        skills=payload.skills,
        company_id=company.id if company else None,
        posted_by=user.id,
        status=ACTIVE,
    )
    db.add(job)
    db.flush()
    add_notification(db, user.id, "Job published", f"“{job.title}” is now live on LocalJob.", kind="success", link="/employer/jobs")
    audit(db, "job_create", user, job.title)
    db.commit()
    return job_public(job, detail=True)


@router.patch("/jobs/{job_id}")
def update_job(
    job_id: int,
    payload: JobUpdateIn,
    db: DbSession,
    user: Annotated[models.User, Depends(require_employer)],
) -> dict:
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(404, detail="job_not_found")
    if user.role != "admin" and job.posted_by != user.id:
        raise HTTPException(403, detail="not_your_job")

    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(job, key, value)
    if job.location and job.location.lower() == "remote":
        job.is_remote = True
    audit(db, "job_update", user, job.title)
    db.commit()
    return job_public(job, detail=True)


@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: DbSession,
    user: Annotated[models.User, Depends(require_employer)],
) -> dict:
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(404, detail="job_not_found")
    if user.role != "admin" and job.posted_by != user.id:
        raise HTTPException(403, detail="not_your_job")
    audit(db, "job_delete", user, job.title)
    db.delete(job)
    db.commit()
    return {"ok": True}


# --------------------------------------------------------------------------
# Saved jobs
# --------------------------------------------------------------------------
@router.get("/saved")
def list_saved(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    profile = _profile_of(db, user)
    rows = list(db.scalars(
        select(models.SavedJob)
        .options(selectinload(models.SavedJob.job).selectinload(models.Job.company))
        .where(models.SavedJob.user_id == user.id)
        .order_by(models.SavedJob.created_at.desc())
    ))
    return {"items": [saved_job_public(row, profile, user) for row in rows if row.job], "total": len(rows)}


@router.post("/saved/{job_id}", status_code=status.HTTP_201_CREATED)
def save_job(job_id: int, db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    if not db.get(models.Job, job_id):
        raise HTTPException(404, detail="job_not_found")
    existing = db.scalar(select(models.SavedJob).where(
        models.SavedJob.user_id == user.id, models.SavedJob.job_id == job_id
    ))
    if existing:
        return {"ok": True, "saved": True, "already": True}
    db.add(models.SavedJob(user_id=user.id, job_id=job_id))
    db.commit()
    return {"ok": True, "saved": True}


@router.delete("/saved/{job_id}")
def unsave_job(job_id: int, db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    row = db.scalar(select(models.SavedJob).where(
        models.SavedJob.user_id == user.id, models.SavedJob.job_id == job_id
    ))
    if row:
        db.delete(row)
        db.commit()
    return {"ok": True, "saved": False}


# --------------------------------------------------------------------------
# Companies
# --------------------------------------------------------------------------
@router.get("/companies")
def list_companies(db: DbSession, search: str | None = None, location: str | None = None) -> dict:
    stmt = select(models.Company)
    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(or_(func.lower(models.Company.name).like(like), func.lower(models.Company.industry).like(like)))
    if location:
        stmt = stmt.where(func.lower(models.Company.location).like(f"%{location.lower()}%"))
    companies = list(db.scalars(stmt.order_by(models.Company.name)))
    items = []
    for company in companies:
        open_jobs = db.scalar(select(func.count()).select_from(models.Job).where(
            models.Job.company_id == company.id, models.Job.status == ACTIVE
        )) or 0
        data = company_public(company, open_jobs=open_jobs)
        if data:
            items.append(data)
    return {"items": items, "total": len(items)}


@router.get("/companies/{company_id}")
def company_detail(company_id: int, db: DbSession,
                   user: Annotated[models.User | None, Depends(current_user_optional)]) -> dict:
    company = db.get(models.Company, company_id)
    if not company:
        raise HTTPException(404, detail="company_not_found")
    jobs = list(db.scalars(
        select(models.Job).options(selectinload(models.Job.company)).where(
            models.Job.company_id == company.id, models.Job.status == ACTIVE
        ).order_by(models.Job.created_at.desc())
    ))
    profile = _profile_of(db, user)
    data = company_public(company, open_jobs=len(jobs))
    data["jobs"] = [job_public(job, profile, user) for job in jobs]
    data["owner"] = user_public(company.owner)
    return data


@router.get("/my-company")
def my_company(db: DbSession, user: Annotated[models.User, Depends(require_employer)]) -> dict:
    company = db.scalar(select(models.Company).where(models.Company.owner_id == user.id))
    if not company:
        return {"company": None}
    open_jobs = db.scalar(select(func.count()).select_from(models.Job).where(
        models.Job.company_id == company.id, models.Job.status == ACTIVE
    )) or 0
    return {"company": company_public(company, open_jobs=open_jobs)}


@router.put("/my-company")
def upsert_company(payload: dict, db: DbSession, user: Annotated[models.User, Depends(require_employer)]) -> dict:
    company = db.scalar(select(models.Company).where(models.Company.owner_id == user.id))
    name = (payload.get("name") or "").strip()
    if not name:
        raise HTTPException(422, detail="company_name_required")
    if company is None:
        slug = name.lower().replace(" ", "-")[:150]
        base_slug = slug
        counter = 1
        while db.scalar(select(models.Company).where(models.Company.slug == slug)):
            counter += 1
            slug = f"{base_slug}-{counter}"
        company = models.Company(name=name, slug=slug, owner_id=user.id)
        db.add(company)
    company.name = name
    company.industry = payload.get("industry") or company.industry
    company.location = payload.get("location") or company.location
    company.size = payload.get("size") or company.size
    company.website = payload.get("website") or company.website
    company.about = payload.get("about") or company.about
    company.logo = payload.get("logo") or company.logo or name[:2].upper()
    audit(db, "company_update", user, company.name)
    db.commit()
    return {"company": company_public(company)}
