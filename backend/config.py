"""Central configuration for LocalJob (bot + API + website).

Everything is driven by environment variables (.env) so the same code base can
run locally with MySQL, in Docker or on a VPS.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
WEB_DIST = BASE_DIR / "web" / "dist"


def _load_dotenv() -> None:
    """Tiny .env loader (no external dependency required)."""
    env_file = BASE_DIR / ".env"
    if not env_file.exists():
        return
    for raw in env_file.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


_load_dotenv()


def _env(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


def _env_int(key: str, default: int) -> int:
    try:
        return int(_env(key) or default)
    except ValueError:
        return default


def _env_list(key: str) -> list[int]:
    raw = _env(key)
    ids: list[int] = []
    for chunk in raw.replace(";", ",").split(","):
        chunk = chunk.strip()
        if chunk.lstrip("-").isdigit():
            ids.append(int(chunk))
    return ids


@dataclass
class Settings:
    # --- Server ---------------------------------------------------------
    host: str = field(default_factory=lambda: _env("HOST", "0.0.0.0"))
    port: int = field(default_factory=lambda: _env_int("PORT", 8000))
    public_url: str = field(default_factory=lambda: _env("PUBLIC_URL", ""))
    reload: bool = field(default_factory=lambda: _env("RELOAD", "0") in {"1", "true", "yes"})

    # --- Telegram -------------------------------------------------------
    bot_token: str = field(default_factory=lambda: _env("BOT_TOKEN"))
    admin_ids: list[int] = field(default_factory=lambda: _env_list("ADMIN_IDS"))
    bot_username: str = field(default_factory=lambda: _env("BOT_USERNAME", "LocalJobUzBot"))

    # --- Database -------------------------------------------------------
    db_engine: str = field(default_factory=lambda: _env("DB_ENGINE", "auto").lower())
    database_url: str = field(default_factory=lambda: _env("DATABASE_URL"))
    db_host: str = field(default_factory=lambda: _env("DB_HOST", "127.0.0.1"))
    db_port: int = field(default_factory=lambda: _env_int("DB_PORT", 3306))
    db_user: str = field(default_factory=lambda: _env("DB_USER", "root"))
    db_password: str = field(default_factory=lambda: _env("DB_PASSWORD"))
    db_name: str = field(default_factory=lambda: _env("DB_NAME", "localjob"))
    sqlite_path: Path = field(default_factory=lambda: BASE_DIR / _env("SQLITE_FILE", "localjob.sqlite3"))

    # --- Auth -----------------------------------------------------------
    secret_key: str = field(default_factory=lambda: _env("SECRET_KEY", "localjob-dev-secret-change-me"))
    token_ttl_days: int = field(default_factory=lambda: _env_int("TOKEN_TTL_DAYS", 30))

    # --- Product --------------------------------------------------------
    default_language: str = field(default_factory=lambda: _env("DEFAULT_LANGUAGE", "uz").lower())
    seed_demo_data: bool = field(default_factory=lambda: _env("SEED_DEMO_DATA", "1") not in {"0", "false", "no"})

    @property
    def mysql_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}?charset=utf8mb4"
        )

    @property
    def sqlite_url(self) -> str:
        return f"sqlite:///{self.sqlite_path}"

    @property
    def webapp_url(self) -> str:
        """URL opened by the Telegram WebApp button."""
        if self.public_url:
            return self.public_url.rstrip("/")
        return f"http://localhost:{self.port}"

    @property
    def bot_enabled(self) -> bool:
        return bool(self.bot_token)

    def is_admin(self, telegram_id: int | None) -> bool:
        return bool(telegram_id) and telegram_id in self.admin_ids


settings = Settings()
