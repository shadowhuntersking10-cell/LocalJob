"""Serves the built React SPA (website + Telegram WebApp) and helper pages."""
from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse

from ..config import settings

log = logging.getLogger("localjob.web")

DEV_HELP_PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LocalJob — frontend not built</title>
<style>
  body{{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
       background:#0B1220;color:#E2E8F5;display:flex;min-height:100vh;align-items:center;justify-content:center}}
  .box{{max-width:640px;padding:40px;border:1px solid #1E2A44;border-radius:16px;background:#0F1729}}
  h1{{margin:0 0 12px;font-size:26px;color:#fff}} p{{color:#93A4C4;line-height:1.7}}
  code{{background:#16213C;padding:2px 8px;border-radius:6px;color:#7FB3FF;display:inline-block}}
  ol{{color:#B9C7E2;line-height:2}} a{{color:#60A5FA}}
</style></head>
<body><div class="box">
<h1>LocalJob frontend is not built yet</h1>
<p>The API, bot and database are running, but <code>web/dist</code> does not exist.</p>
<ol>
  <li><code>cd web</code></li>
  <li><code>npm install</code></li>
  <li><code>npm run build</code></li>
  <li>Restart <code>python main.py</code> (or run <code>npm run dev</code> for HMR on port 5173)</li>
</ol>
<p>API documentation is available at <a href="/api/docs">/api/docs</a>.</p>
</div></body></html>"""


def mount_frontend(app: FastAPI) -> None:
    dist = settings.webapp_url  # noqa: F841  (kept for readability)
    from ..config import WEB_DIST

    index_file = WEB_DIST / "index.html"
    assets_dir = WEB_DIST / "assets"

    if assets_dir.exists():
        from fastapi.staticfiles import StaticFiles

        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/favicon.ico", include_in_schema=False)
    def favicon():
        icon = WEB_DIST / "favicon.ico"
        if icon.exists():
            return FileResponse(icon)
        return JSONResponse({"detail": "no favicon"}, status_code=404)

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="not_found")

        if not index_file.exists():
            return HTMLResponse(DEV_HELP_PAGE)

        # serve real static files when they exist (logo.png, robots.txt, …)
        candidate = (WEB_DIST / full_path).resolve()
        try:
            candidate.relative_to(WEB_DIST.resolve())
        except ValueError:
            raise HTTPException(status_code=404, detail="not_found")
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(index_file)
