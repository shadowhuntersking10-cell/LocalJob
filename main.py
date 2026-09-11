#!/usr/bin/env python3
"""LocalJob — single entry point.

`python main.py` starts everything:

  • MySQL (or SQLite fallback) database with tables created + demo data seeded
  • FastAPI backend  →  /api/*
  • React SPA (website + Telegram WebApp + admin panel) served from web/dist
  • aiogram Telegram bot with a WebApp button (background thread)

Optional flags:
  python main.py --no-bot          run without the Telegram bot
  python main.py --no-build        never build the React SPA automatically
  python main.py --seed-only       seed the database and exit
  python main.py --db sqlite       force SQLite (default: MySQL, SQLite fallback)
  python main.py --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import argparse
import logging
import os
import shutil
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend import db as db_module  # noqa: E402
from backend.config import WEB_DIST, settings  # noqa: E402

BANNER = r"""
   __            _        _  ____      _
  / /  ___  ___| | ___  | |/ / (_) ___| |__
 / /  / _ \/ __| |/ _ \ | ' /| | |/ __| '_ \
/ /__| (_) | (__| |  __/ | . \| | | (__| | | |
\____/\___/ \___|_|\___| |_|\_\_|_|\___|_| |_|
"""

log = logging.getLogger("localjob")


def setup_logging(verbose: bool = False) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s | %(levelname)-7s | %(name)-22s | %(message)s",
        datefmt="%H:%M:%S",
    )
    logging.getLogger("aiogram.event").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the whole LocalJob platform (bot + webapp + website).")
    parser.add_argument("--host", default=settings.host, help="bind host (default: %(default)s)")
    parser.add_argument("--port", type=int, default=settings.port, help="bind port (default: %(default)s)")
    parser.add_argument("--db", choices=["auto", "mysql", "sqlite"], default=settings.db_engine,
                        help="database backend (default: %(default)s)")
    parser.add_argument("--no-bot", action="store_true", help="start the web app without the Telegram bot")
    parser.add_argument("--seed-only", action="store_true", help="create tables, seed demo data and exit")
    parser.add_argument("--no-seed", action="store_true", help="skip demo data seeding")
    parser.add_argument("--no-build", action="store_true",
                        help="do not build the React SPA automatically when web/dist is missing")
    parser.add_argument("--reload", action="store_true", help="auto reload the API on code changes (development)")
    parser.add_argument("-v", "--verbose", action="store_true", help="verbose logging")
    return parser.parse_args()


def bootstrap_database(force: str, seed: bool) -> str:
    """Create tables and seed demo data. Returns the active backend name."""
    backend = db_module.init_engine(force=force)
    db_module.create_all()
    if seed and settings.seed_demo_data:
        from backend.seed import run_seed

        stats = run_seed()
        if stats.get("jobs"):
            log.info("Seeded %s jobs, %s users, %s applications.",
                     stats["jobs"], stats["users"], stats["applications"])
    return backend


def ensure_frontend_build(allow_build: bool = True) -> bool:
    """Build the React SPA (web/dist) when it is missing, so one command starts everything."""
    if (WEB_DIST / "index.html").exists():
        return True
    if not allow_build:
        return False

    web_dir = BASE_DIR / "web"
    if not (web_dir / "package.json").exists():
        log.warning("Frontend sources were not found in %s — serving the API only.", web_dir)
        return False

    npm = shutil.which("npm")
    if npm is None:
        log.warning("npm was not found — skipping the frontend build. "
                    "Install Node.js 18+ or run `cd web && npm install && npm run build` once.")
        return False

    log.info("web/dist is missing — building the React SPA now (the first run can take a minute)…")
    try:
        if not (web_dir / "node_modules").exists():
            subprocess.run([npm, "install", "--no-audit", "--no-fund"], cwd=web_dir, check=True)
        subprocess.run([npm, "run", "build"], cwd=web_dir, check=True)
    except (OSError, subprocess.CalledProcessError) as exc:
        log.error("Frontend build failed (%s). The API is still available on /api and /api/docs.", exc)
        return False

    ready = (WEB_DIST / "index.html").exists()
    if ready:
        log.info("Frontend build ready (web/dist).")
    return ready


def print_ready_banner(backend: str, host: str, port: int, bot_enabled: bool) -> None:
    url = settings.public_url or f"http://{'localhost' if host in {'0.0.0.0', '::'} else host}:{port}"
    dist_ready = (WEB_DIST / "index.html").exists()
    lines = [
        "",
        "─" * 68,
        "  LocalJob is up and running",
        "─" * 68,
        f"  Website / WebApp : {url}",
        f"  API docs         : {url}/api/docs",
        f"  Admin panel      : {url}/admin   (admin account below)",
        f"  Database         : {backend}",
        f"  Telegram bot     : {'@' + settings.bot_username if bot_enabled else 'disabled (set BOT_TOKEN in .env)'}",
        f"  Frontend build   : {'web/dist ✅' if dist_ready else 'web/dist ❌  →  cd web && npm install && npm run build'}",
        "",
        "  Demo accounts",
        "    job seeker     : demo@localjob.uz / Demo1234!",
        "    employer       : employer@localjob.uz / Demo1234!",
        "    administrator  : admin@localjob.uz / Admin1234!",
    ]
    if settings.admin_ids:
        lines.append(f"  Telegram admins  : {', '.join(str(i) for i in settings.admin_ids)}")
    else:
        lines.append("  Telegram admins  : not set — add ADMIN_IDS=123456789 to .env to unlock the bot admin panel")
    lines.append("─" * 68)
    print("\n".join(lines), flush=True)


def main() -> int:
    args = parse_args()
    setup_logging(args.verbose)
    print(BANNER, flush=True)
    log.info("Starting LocalJob (bot + webapp + website)…")

    backend = bootstrap_database(args.db, seed=not args.no_seed)

    if args.seed_only:
        print_ready_banner(backend, args.host, args.port, bot_enabled=False)
        return 0

    ensure_frontend_build(allow_build=not args.no_build)

    bot_started = False
    if not args.no_bot:
        if settings.bot_enabled:
            from backend.bot import bot_runner

            bot_started = bot_runner.start()
        else:
            log.warning("BOT_TOKEN is not configured — the Telegram bot is disabled. "
                        "Put BOT_TOKEN=<token from @BotFather> into .env and restart.")

    from backend.api import create_api

    def restart_bot() -> str:
        from backend.bot import bot_runner

        return bot_runner.restart()

    def shutdown() -> None:
        from backend.bot import bot_runner

        bot_runner.stop()

    app = create_api(run_bot_hook=restart_bot, shutdown_hook=shutdown)

    if args.reload:
        # uvicorn reload needs an import string; the bot keeps running in this process
        os.environ.setdefault("PYTHONPATH", str(BASE_DIR))
        print_ready_banner(backend, args.host, args.port, bot_started)
        import uvicorn

        try:
            uvicorn.run(
                "backend.api:app_factory",
                factory=True,
                host=args.host,
                port=args.port,
                reload=True,
                reload_dirs=[str(BASE_DIR / "backend")],
                log_level="info",
            )
        except KeyboardInterrupt:  # pragma: no cover
            pass
        finally:
            if bot_started:
                from backend.bot import bot_runner

                bot_runner.stop()
        return 0

    print_ready_banner(backend, args.host, args.port, bot_started)

    import uvicorn

    config = uvicorn.Config(app, host=args.host, port=args.port, log_level="info", access_log=False)
    server = uvicorn.Server(config)
    try:
        server.run()
    except KeyboardInterrupt:  # pragma: no cover
        log.info("Shutting down…")
    finally:
        if bot_started:
            from backend.bot import bot_runner

            bot_runner.stop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
