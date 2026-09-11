"""Password hashing, session tokens and Telegram WebApp signature checks."""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any

from .config import settings

PBKDF2_ROUNDS = 120_000


# --------------------------------------------------------------------------
# Passwords
# --------------------------------------------------------------------------
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ROUNDS)
    return f"pbkdf2_sha256${PBKDF2_ROUNDS}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, rounds, salt_b64, digest_b64 = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(digest_b64)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, int(rounds))
        return hmac.compare_digest(candidate, expected)
    except Exception:
        return False


# --------------------------------------------------------------------------
# Session tokens (HMAC signed, JWT-like, zero dependencies)
# --------------------------------------------------------------------------
def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _unb64(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_token(user_id: int, role: str, ttl_days: int | None = None) -> str:
    payload: dict[str, Any] = {
        "sub": user_id,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + (ttl_days or settings.token_ttl_days) * 86400,
    }
    body = _b64(json.dumps(payload, separators=(",", ":")).encode())
    signature = hmac.new(settings.secret_key.encode(), body.encode(), hashlib.sha256).digest()
    return f"{body}.{_b64(signature)}"


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        body, signature = token.split(".")
        expected = hmac.new(settings.secret_key.encode(), body.encode(), hashlib.sha256).digest()
        if not hmac.compare_digest(_unb64(signature), expected):
            return None
        payload = json.loads(_unb64(body))
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None


# --------------------------------------------------------------------------
# Telegram WebApp initData verification
# --------------------------------------------------------------------------
def verify_telegram_init_data(init_data: str) -> dict[str, Any] | None:
    """Validate data received from Telegram.WebApp.initData.

    Returns parsed user dict when the signature is valid. In development (no bot
    token configured) the payload is trusted so the WebApp can be previewed.
    """
    if not init_data:
        return None
    try:
        pairs = [chunk.split("=", 1) for chunk in init_data.split("&") if "=" in chunk]
        data = {k: v for k, v in pairs}
    except Exception:
        return None

    user_raw = data.get("user")
    if not user_raw:
        return None
    from urllib.parse import unquote_plus

    user = json.loads(unquote_plus(user_raw))

    if not settings.bot_token:
        return user  # dev mode

    received_hash = data.pop("hash", None)
    if not received_hash:
        return None
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret_key = hmac.new(b"WebAppData", settings.bot_token.encode(), hashlib.sha256).digest()
    computed = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return user if hmac.compare_digest(computed, received_hash) else None
