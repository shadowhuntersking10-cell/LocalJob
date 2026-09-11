"""Shared FastAPI dependencies: current user, role guards."""
from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models
from ..config import settings
from ..db import get_db
from ..security import decode_token

DbSession = Annotated[Session, Depends(get_db)]


def _token_from_header(authorization: str | None) -> str | None:
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return authorization


def current_user_optional(
    db: DbSession,
    authorization: Annotated[str | None, Header()] = None,
) -> models.User | None:
    token = _token_from_header(authorization)
    if not token:
        return None
    payload = decode_token(token)
    if not payload:
        return None
    user = db.get(models.User, int(payload["sub"]))
    if not user or not user.is_active:
        return None
    return user


def current_user(user: Annotated[models.User | None, Depends(current_user_optional)]) -> models.User:
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="not_authenticated")
    return user


def require_employer(user: Annotated[models.User, Depends(current_user)]) -> models.User:
    if user.role not in {"employer", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="employer_only")
    return user


def require_seeker(user: Annotated[models.User, Depends(current_user)]) -> models.User:
    if user.role not in {"job_seeker", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="job_seeker_only")
    return user


def require_admin(user: Annotated[models.User, Depends(current_user)]) -> models.User:
    if user.role != "admin" and not settings.is_admin(user.telegram_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="admin_only")
    return user
