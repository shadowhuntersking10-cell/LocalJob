"""Database engine / session management with MySQL-first strategy.

LocalJob is designed for MySQL.  If the MySQL server is not reachable (for
example a quick local demo on a laptop) the app transparently falls back to a
local SQLite file so `python main.py` always starts.
"""
from __future__ import annotations

import logging
from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings

log = logging.getLogger("localjob.db")


class Base(DeclarativeBase):
    pass


_engine: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None
DB_BACKEND: str = "unknown"


def _build_engine(url: str) -> Engine:
    kwargs: dict = {"pool_pre_ping": True, "future": True}
    if url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    else:
        kwargs.update({"pool_recycle": 1800, "pool_size": 10, "max_overflow": 20})
    return create_engine(url, echo=False, **kwargs)


def _can_connect(url: str) -> bool:
    try:
        eng = _build_engine(url)
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        eng.dispose()
        return True
    except Exception as exc:  # pragma: no cover - depends on environment
        log.warning("MySQL connection failed (%s): %s", url.split("@")[-1], exc.__class__.__name__)
        return False


def resolve_url(force: str | None = None, override_url: str | None = None) -> tuple[str, str]:
    """Return (url, backend_name)."""
    if override_url:
        return override_url, "mysql" if override_url.startswith("mysql") else "postgres" if override_url.startswith("postgres") else "sqlite"
    if force == "sqlite":
        return settings.sqlite_url, "sqlite"
    if force == "mysql":
        return settings.mysql_url, "mysql"
    # auto: DATABASE_URL wins, then try MySQL, then SQLite
    if settings.database_url:
        if settings.database_url.startswith("mysql") and not _can_connect(settings.database_url):
            log.warning("DATABASE_URL is unreachable, falling back to SQLite")
            return settings.sqlite_url, "sqlite"
        return settings.database_url, "mysql" if settings.database_url.startswith("mysql") else "sqlite"
    if settings.db_engine in {"mysql", "sqlite", "postgres"}:
        if settings.db_engine == "mysql" and not _can_connect(settings.mysql_url):
            return settings.sqlite_url, "sqlite"
        return (settings.mysql_url, "mysql") if settings.db_engine == "mysql" else (settings.sqlite_url, "sqlite")
    if _can_connect(settings.mysql_url):
        return settings.mysql_url, "mysql"
    log.warning(
        "MySQL server is not reachable on %s:%s — starting with SQLite (%s). "
        "Start MySQL and restart to use MySQL.",
        settings.db_host, settings.db_port, settings.sqlite_path.name,
    )
    return settings.sqlite_url, "sqlite"


def init_engine(force: str | None = None, override_url: str | None = None) -> str:
    global _engine, _SessionLocal, DB_BACKEND
    url, backend = resolve_url(force, override_url)
    _engine = _build_engine(url)
    _SessionLocal = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False, class_=Session)
    DB_BACKEND = backend
    with _engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    log.info("Database ready (%s)", backend)
    return backend


def get_engine() -> Engine:
    if _engine is None:
        init_engine()
    assert _engine is not None
    return _engine


@contextmanager
def session_scope() -> Iterator[Session]:
    """Context manager style session for scripts/bot."""
    if _SessionLocal is None:
        init_engine()
    assert _SessionLocal is not None
    db = _SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db() -> Iterator[Session]:
    """FastAPI dependency."""
    if _SessionLocal is None:
        init_engine()
    assert _SessionLocal is not None
    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all() -> None:
    from . import models  # noqa: F401  (register tables)

    Base.metadata.create_all(bind=get_engine())
