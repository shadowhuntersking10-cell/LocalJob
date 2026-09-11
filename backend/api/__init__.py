"""FastAPI application factory for LocalJob."""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ..config import settings
from . import (
    routes_admin,
    routes_applications,
    routes_auth,
    routes_catalog,
    routes_meta,
    routes_profile,
)
from .static import mount_frontend

log = logging.getLogger("localjob.api")


def app_factory() -> FastAPI:
    """Entry point for `uvicorn backend.api:app_factory --factory --reload`."""
    from ..db import create_all, init_engine

    init_engine()
    create_all()
    return create_api()


def create_api(run_bot_hook=None, shutdown_hook=None) -> FastAPI:
    app = FastAPI(
        title="LocalJob API",
        description="Backend for the LocalJob marketplace: website, Telegram WebApp and admin panel.",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(routes_meta.router)
    app.include_router(routes_auth.router)
    app.include_router(routes_catalog.router)
    app.include_router(routes_applications.router)
    app.include_router(routes_profile.router)
    app.include_router(routes_admin.router)

    @app.get("/api/health", tags=["system"])
    def health() -> dict:
        from ..db import DB_BACKEND

        return {
            "status": "ok",
            "database": DB_BACKEND,
            "bot_enabled": settings.bot_enabled,
            "bot_username": settings.bot_username,
            "admins": settings.admin_ids,
            "version": "1.0.0",
        }

    @app.post("/api/system/bot/restart", tags=["system"])
    def restart_bot() -> dict:
        if run_bot_hook is None:
            return {"ok": False, "detail": "bot control unavailable"}
        return {"ok": True, "detail": run_bot_hook()}

    @app.on_event("shutdown")
    def _shutdown() -> None:  # pragma: no cover
        if shutdown_hook:
            shutdown_hook()

    mount_frontend(app)
    return app
