"""Job seeker profile, account settings and notifications."""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models
from ..security import hash_password, verify_password
from ..schemas import PasswordChangeIn, ProfileIn, SettingsIn
from .deps import DbSession, current_user
from .serializers import notification_public, profile_completion, profile_public, user_public
from .utils import add_notification, audit

router = APIRouter(prefix="/api", tags=["account"])

DEFAULT_PREFS = {
    "emailApplications": True,
    "emailJobs": True,
    "telegramNotifications": True,
    "profileVisible": True,
    "showSalary": True,
}


def _profile_for(db: Session, user: models.User) -> models.Profile:
    profile = db.scalar(select(models.Profile).where(models.Profile.user_id == user.id))
    if profile is None:
        profile = models.Profile(user_id=user.id, skills=[], experience=[], education=[], languages=[])
        db.add(profile)
        db.flush()
    return profile


@router.get("/profile")
def get_profile(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    profile = _profile_for(db, user)
    db.commit()
    return {
        "user": user_public(user, with_email=True),
        "profile": profile_public(profile),
        "completion": profile_completion(user, profile),
    }


@router.put("/profile")
def update_profile(
    payload: ProfileIn,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    profile = _profile_for(db, user)
    data = payload.model_dump(exclude_unset=True)

    if "name" in data and data["name"]:
        user.name = data["name"].strip()
    for field_name in ("location", "phone"):
        if data.get(field_name):
            setattr(user, field_name, data[field_name])
            setattr(profile, field_name, data[field_name])
            data.pop(field_name, None)
    if data.get("avatar"):
        user.avatar = data["avatar"]
    data.pop("avatar", None)

    mapping = {
        "title": "title",
        "bio": "bio",
        "location": "location",
        "phone": "phone",
        "category": "category",
        "skills": "skills",
        "experience": "experience",
        "education": "education",
        "languages": "languages",
        "portfolio": "portfolio",
        "linkedin": "linkedin",
        "github": "github",
        "telegram": "telegram",
        "website": "website",
        "expected_salary": "expected_salary",
        "experience_level": "experience_level",
    }
    for source, target in mapping.items():
        if source in data:
            setattr(profile, target, data[source])

    audit(db, "profile_update", user)
    add_notification(db, user.id, "Profile updated", "Your profile changes were saved.", kind="info", link="/profile")
    db.commit()
    return {
        "user": user_public(user, with_email=True),
        "profile": profile_public(profile),
        "completion": profile_completion(user, profile),
    }


@router.patch("/settings")
def update_settings(
    payload: SettingsIn,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"]:
        user.name = data["name"].strip()
    if "phone" in data:
        user.phone = data["phone"]
    if "location" in data:
        user.location = data["location"]
    if "language" in data and data["language"]:
        user.language = data["language"].lower()[:5]
    if "theme" in data and data["theme"] in {"light", "dark"}:
        user.theme = data["theme"]
    audit(db, "settings_update", user)
    db.commit()
    return {"user": user_public(user, with_email=True), "ok": True}


@router.get("/settings/preferences")
def get_preferences(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    prefs = dict(DEFAULT_PREFS)
    prefs.update(user.prefs or {})
    return {"preferences": prefs}


@router.put("/settings/preferences")
def update_preferences(payload: dict, db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    prefs = dict(DEFAULT_PREFS)
    prefs.update(user.prefs or {})
    for key, value in payload.items():
        if key in DEFAULT_PREFS:
            prefs[key] = bool(value)
    user.prefs = prefs
    audit(db, "preferences_update", user)
    db.commit()
    return {"preferences": prefs}


@router.post("/auth/change-password")
def change_password(
    payload: PasswordChangeIn,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(400, detail="current_password_incorrect")
    if len(payload.new_password) < 8:
        raise HTTPException(422, detail="password_too_short")
    user.password_hash = hash_password(payload.new_password)
    add_notification(db, user.id, "Password changed", "Your password was updated successfully.", kind="success", link="/settings")
    audit(db, "password_change", user)
    db.commit()
    return {"ok": True}


@router.delete("/auth/account")
def delete_account(
    payload: dict,
    db: DbSession,
    user: Annotated[models.User, Depends(current_user)],
) -> dict:
    password = payload.get("password") or ""
    if not verify_password(password, user.password_hash):
        raise HTTPException(400, detail="current_password_incorrect")
    audit(db, "account_delete", user, user.email)
    db.delete(user)
    db.commit()
    return {"ok": True}


@router.get("/notifications")
def list_notifications(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    rows = list(db.scalars(
        select(models.Notification)
        .where(models.Notification.user_id == user.id)
        .order_by(models.Notification.created_at.desc())
        .limit(50)
    ))
    return {
        "items": [notification_public(row) for row in rows],
        "unread": sum(1 for row in rows if not row.is_read),
    }


@router.post("/notifications/read")
def mark_notifications(payload: dict, db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    rows = list(db.scalars(select(models.Notification).where(models.Notification.user_id == user.id)))
    if payload.get("all"):
        for row in rows:
            row.is_read = True
    else:
        ids = {int(i) for i in (payload.get("ids") or [])}
        for row in rows:
            if row.id in ids:
                row.is_read = True
    db.commit()
    return {"ok": True, "unread": sum(1 for row in rows if not row.is_read)}


@router.delete("/notifications")
def clear_notifications(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    for row in db.scalars(select(models.Notification).where(models.Notification.user_id == user.id)):
        db.delete(row)
    db.commit()
    return {"ok": True}
