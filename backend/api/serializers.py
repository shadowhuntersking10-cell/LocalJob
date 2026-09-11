"""Model -> JSON serializers (camelCase for the React client)."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from .. import models
from ..matching import match_score


def iso(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.isoformat().replace("+00:00", "Z")


def company_public(company: models.Company | None, open_jobs: int | None = None) -> dict[str, Any] | None:
    if company is None:
        return None
    data = {
        "id": company.id,
        "name": company.name,
        "slug": company.slug,
        "industry": company.industry,
        "location": company.location,
        "size": company.size,
        "website": company.website,
        "about": company.about,
        "logo": company.logo or company.name[:2].upper(),
        "color": company.color,
        "verified": company.verified,
        "ownerId": company.owner_id,
        "createdAt": iso(company.created_at),
    }
    if open_jobs is not None:
        data["openJobsCount"] = open_jobs
    return data


def user_public(user: models.User | None, with_email: bool = False) -> dict[str, Any] | None:
    if user is None:
        return None
    data = {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "avatar": user.avatar,
        "telegramId": user.telegram_id,
        "telegramUsername": user.telegram_username,
        "language": user.language,
        "theme": user.theme,
        "isActive": user.is_active,
        "createdAt": iso(user.created_at),
    }
    if with_email:
        data["email"] = user.email
    return data


def profile_public(profile: models.Profile | None) -> dict[str, Any] | None:
    if profile is None:
        return None
    return {
        "id": profile.id,
        "userId": profile.user_id,
        "title": profile.title,
        "bio": profile.bio,
        "location": profile.location,
        "phone": profile.phone,
        "category": profile.category,
        "skills": profile.skills or [],
        "experience": profile.experience or [],
        "education": profile.education or [],
        "languages": profile.languages or [],
        "portfolio": profile.portfolio,
        "linkedin": profile.linkedin,
        "github": profile.github,
        "telegram": profile.telegram,
        "website": profile.website,
        "expectedSalary": profile.expected_salary,
        "experienceLevel": profile.experience_level,
        "views": profile.views,
        "updatedAt": iso(profile.updated_at),
    }


def job_public(job: models.Job, profile: models.Profile | None = None, user: models.User | None = None,
               detail: bool = False) -> dict[str, Any]:
    data: dict[str, Any] = {
        "id": job.id,
        "title": job.title,
        "category": job.category,
        "location": job.location,
        "isRemote": bool(job.is_remote),
        "salaryMin": job.salary_min,
        "salaryMax": job.salary_max,
        "currency": job.currency,
        "salaryPeriod": job.salary_period,
        "salaryLabel": job.salary_label,
        "employmentType": job.employment_type,
        "experienceLevel": job.experience_level,
        "skills": job.skills or [],
        "status": job.status,
        "views": job.views,
        "applicationsCount": job.applications_count,
        "companyId": job.company_id,
        "postedById": job.posted_by,
        "createdAt": iso(job.created_at),
        "company": company_public(job.company),
        "matchScore": match_score(job, profile, user) if (profile or user) else None,
    }
    if detail:
        data.update(
            {
                "description": job.description,
                "responsibilities": job.responsibilities or [],
                "requirements": job.requirements or [],
                "benefits": job.benefits or [],
            }
        )
    else:
        description = job.description or ""
        data["excerpt"] = description[:180] + ("…" if len(description) > 180 else "")
    return data


def application_public(app: models.Application, detail: bool = True) -> dict[str, Any]:
    data: dict[str, Any] = {
        "id": app.id,
        "jobId": app.job_id,
        "applicantId": app.applicant_id,
        "employerId": app.employer_id,
        "status": app.status,
        "fullName": app.full_name,
        "email": app.email,
        "phone": app.phone,
        "coverLetter": app.cover_letter,
        "portfolioUrl": app.portfolio_url,
        "resumeName": app.resume_name,
        "matchScore": app.match_score,
        "createdAt": iso(app.created_at),
        "updatedAt": iso(app.updated_at),
    }
    if detail:
        data["job"] = job_public(app.job) if app.job else None
        data["applicant"] = user_public(app.applicant, with_email=True)
        data["applicantProfile"] = profile_public(app.applicant.profile) if app.applicant else None
    return data


def notification_public(note: models.Notification) -> dict[str, Any]:
    return {
        "id": note.id,
        "kind": note.kind,
        "title": note.title,
        "message": note.message,
        "link": note.link,
        "isRead": note.is_read,
        "createdAt": iso(note.created_at),
    }


def saved_job_public(saved: models.SavedJob, profile: models.Profile | None = None,
                     user: models.User | None = None) -> dict[str, Any]:
    return {
        "id": saved.id,
        "jobId": saved.job_id,
        "createdAt": iso(saved.created_at),
        "job": job_public(saved.job, profile, user) if saved.job else None,
    }


def profile_completion(user: models.User, profile: models.Profile | None) -> int:
    if profile is None:
        return 15 if user.name else 5
    checks = [
        bool(user.name),
        bool(profile.title),
        bool(profile.bio and len(profile.bio) > 30),
        bool(profile.location or user.location),
        bool(profile.phone or user.phone),
        bool(profile.skills),
        bool(profile.experience),
        bool(profile.education),
        bool(profile.portfolio or profile.github or profile.linkedin or profile.telegram),
        bool(profile.category),
    ]
    return int(round(sum(1 for c in checks if c) / len(checks) * 100))
