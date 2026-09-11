"""Authentication: register, login, Telegram WebApp login, session info."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models
from ..config import settings
from ..security import create_token, hash_password, verify_password, verify_telegram_init_data
from ..seed_data import DEMO_EMPLOYER, DEMO_JOB_SEEKER
from .deps import DbSession, current_user
from .serializers import company_public, profile_completion, profile_public, user_public
from .utils import add_notification, audit

from typing import Annotated

from fastapi import Depends

router = APIRouter(prefix="/api/auth", tags=["auth"])

WELCOME_TITLES = {
    "uz": "LocalJob'ga xush kelibsiz!",
    "en": "Welcome to LocalJob!",
    "ru": "Добро пожаловать в LocalJob!",
}
WELCOME_MESSAGES = {
    "job_seeker": {
        "uz": "Profilingizni to'ldiring va sizga mos ishlarni ko'ring.",
        "en": "Complete your profile and start applying to matching jobs.",
        "ru": "Заполните профиль и откликайтесь на подходящие вакансии.",
    },
    "employer": {
        "uz": "Birinchi ish e'lonini joylashtiring va nomzodlarni qabul qilishni boshlang.",
        "en": "Post your first job and start receiving candidates.",
        "ru": "Опубликуйте первую вакансию и начните получать отклики.",
    },
}


def _session_payload(db: Session, user: models.User, remember: bool = True) -> dict:
    token = create_token(user.id, user.role, settings.token_ttl_days if remember else 1)
    profile = db.scalar(select(models.Profile).where(models.Profile.user_id == user.id))
    company = db.scalar(select(models.Company).where(models.Company.owner_id == user.id))
    return {
        "token": token,
        "user": user_public(user, with_email=True),
        "profile": profile_public(profile),
        "profileCompletion": profile_completion(user, profile),
        "company": company_public(company),
        "isAdmin": user.role == "admin" or settings.is_admin(user.telegram_id),
        "role": user.role,
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: dict, db: DbSession) -> dict:
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    confirm = payload.get("confirmPassword") or payload.get("confirm_password")
    role = payload.get("role") or "job_seeker"
    language = (payload.get("language") or settings.default_language).lower()[:5]

    if len(name) < 2:
        raise HTTPException(422, detail="invalid_name")
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(422, detail="invalid_email")
    if len(password) < 8:
        raise HTTPException(422, detail="password_too_short")
    if confirm is not None and confirm != password:
        raise HTTPException(422, detail="passwords_do_not_match")
    if role not in {"job_seeker", "employer"}:
        raise HTTPException(422, detail="invalid_role")
    if db.scalar(select(models.User).where(models.User.email == email)):
        raise HTTPException(409, detail="email_already_registered")

    user = models.User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
        phone=(payload.get("phone") or None),
        location=(payload.get("location") or None),
        language=language,
    )
    db.add(user)
    db.flush()
    db.add(models.Profile(user_id=user.id, location=user.location, phone=user.phone, skills=[], experience=[], education=[], languages=[]))
    add_notification(db, user.id, WELCOME_TITLES.get(language, WELCOME_TITLES["en"]),
                     WELCOME_MESSAGES[role].get(language, WELCOME_MESSAGES[role]["en"]),
                     kind="success", link="/dashboard" if role == "job_seeker" else "/employer")
    audit(db, "register", user, f"role={role}")
    db.commit()
    return _session_payload(db, user)


@router.post("/login")
def login(payload: dict, db: DbSession) -> dict:
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    user = db.scalar(select(models.User).where(models.User.email == email))
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="invalid_credentials")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="account_disabled")
    audit(db, "login", user)
    db.commit()
    return _session_payload(db, user, remember=bool(payload.get("remember", True)))


@router.post("/demo/{kind}")
def demo_login(kind: str, db: DbSession) -> dict:
    """One-click demo login so reviewers can explore both dashboards."""
    if kind not in {"seeker", "employer"}:
        raise HTTPException(404, detail="unknown_demo_account")
    email = DEMO_JOB_SEEKER["email"] if kind == "seeker" else DEMO_EMPLOYER["email"]
    user = db.scalar(select(models.User).where(models.User.email == email))
    if not user:
        raise HTTPException(404, detail="demo_account_missing")
    audit(db, "demo_login", user, kind)
    db.commit()
    return _session_payload(db, user)


@router.post("/telegram")
def telegram_login(payload: dict, db: DbSession) -> dict:
    """Authenticate a Telegram WebApp user (initData verified with the bot token)."""
    user_data = verify_telegram_init_data(payload.get("init_data") or "")
    if not user_data:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="invalid_telegram_data")

    telegram_id = int(user_data.get("id"))
    start_param = payload.get("start_param")

    user = db.scalar(select(models.User).where(models.User.telegram_id == telegram_id))
    if not user:
        # maybe linked by email previously
        user = db.scalar(select(models.User).where(models.User.email == f"tg{telegram_id}@localjob.uz"))
    created = False
    if not user:
        role = "job_seeker"
        if settings.is_admin(telegram_id):
            role = "admin"
        elif start_param in {"employer", "ish_beruvchi"}:
            role = "employer"
        full_name = " ".join(filter(None, [user_data.get("first_name"), user_data.get("last_name")])) or "Telegram user"
        user = models.User(
            name=full_name,
            email=f"tg{telegram_id}@localjob.uz",
            password_hash=hash_password(f"tg-{telegram_id}-{settings.secret_key[:8]}"),
            role=role,
            telegram_id=telegram_id,
            telegram_username=user_data.get("username"),
            avatar=None,
            language=(user_data.get("language_code") or settings.default_language)[:2].lower(),
        )
        db.add(user)
        db.flush()
        db.add(models.Profile(user_id=user.id, skills=[], experience=[], education=[], languages=[]))
        add_notification(db, user.id, "Telegram orqali kirdingiz", "WebApp orqali tizimga muvaffaqiyatli kirdingiz.", kind="success")
        created = True
    else:
        user.telegram_username = user_data.get("username") or user.telegram_username
        if settings.is_admin(telegram_id):
            user.role = "admin"

    audit(db, "telegram_login", user, "created" if created else "existing")
    db.commit()
    payload_out = _session_payload(db, user)
    payload_out["created"] = created
    return payload_out


@router.get("/me")
def me(db: DbSession, user: Annotated[models.User, Depends(current_user)]) -> dict:
    profile = db.scalar(select(models.Profile).where(models.Profile.user_id == user.id))
    company = db.scalar(select(models.Company).where(models.Company.owner_id == user.id))
    return {
        "user": user_public(user, with_email=True),
        "profile": profile_public(profile),
        "profileCompletion": profile_completion(user, profile),
        "company": company_public(company),
        "isAdmin": user.role == "admin" or settings.is_admin(user.telegram_id),
        "role": user.role,
    }


@router.post("/logout")
def logout(user: Annotated[models.User, Depends(current_user)], db: DbSession) -> dict:
    audit(db, "logout", user)
    db.commit()
    return {"ok": True}
