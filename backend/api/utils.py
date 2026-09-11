"""Small helpers shared by API routers."""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from .. import models


def naive_utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def add_notification(
    db: Session,
    user_id: int | None,
    title: str,
    message: str = "",
    kind: str = "info",
    link: str | None = None,
) -> models.Notification | None:
    if not user_id:
        return None
    note = models.Notification(user_id=user_id, title=title, message=message, kind=kind, link=link)
    db.add(note)
    return note


def audit(db: Session, action: str, actor: models.User | None = None, detail: str | None = None) -> None:
    db.add(
        models.AuditLog(
            actor_id=actor.id if actor else None,
            actor=actor.email if actor else "system",
            action=action,
            detail=detail,
        )
    )
