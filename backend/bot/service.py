"""Runtime bridge between the bot thread and the FastAPI process."""
from __future__ import annotations

import asyncio
import logging
import threading
from typing import Any, Iterable

log = logging.getLogger("localjob.bot")


class BotRuntime:
    def __init__(self) -> None:
        self.loop: asyncio.AbstractEventLoop | None = None
        self.bot: Any = None
        self.username: str | None = None
        self.running: bool = False
        self.last_error: str | None = None
        self._lock = threading.Lock()

    # -- registration ----------------------------------------------------
    def attach(self, loop: asyncio.AbstractEventLoop, bot: Any, username: str | None) -> None:
        with self._lock:
            self.loop = loop
            self.bot = bot
            self.username = username
            self.running = True
            self.last_error = None

    def detach(self, error: str | None = None) -> None:
        with self._lock:
            self.running = False
            self.last_error = error

    # -- sending ---------------------------------------------------------
    async def _send(self, chat_id: int, text: str) -> bool:
        if self.bot is None:
            return False
        try:
            await self.bot.send_message(chat_id=chat_id, text=text, parse_mode="HTML")
            return True
        except Exception as exc:  # pragma: no cover - network dependent
            log.warning("send_message to %s failed: %s", chat_id, exc)
            return False

    async def _broadcast(self, chat_ids: Iterable[int], text: str) -> dict:
        sent = failed = 0
        for chat_id in chat_ids:
            if await self._send(chat_id, text):
                sent += 1
            else:
                failed += 1
            await asyncio.sleep(0.05)  # stay inside Telegram rate limits
        return {"sent": sent, "failed": failed, "skipped": 0}

    def _run(self, coro) -> Any:
        if not self.running or self.loop is None or self.bot is None:
            return None
        try:
            return asyncio.run_coroutine_threadsafe(coro, self.loop).result(timeout=30)
        except Exception as exc:  # pragma: no cover
            log.warning("bot call failed: %s", exc)
            return None

    def send_sync(self, chat_id: int, text: str) -> bool:
        result = self._run(self._send(chat_id, text))
        return bool(result)

    def broadcast_sync(self, chat_ids: Iterable[int], text: str) -> dict:
        result = self._run(self._broadcast(list(chat_ids), text))
        if not result:
            return {"sent": 0, "failed": 0, "skipped": len(list(chat_ids)) if chat_ids else 0}
        return result

    def status(self) -> dict:
        return {
            "running": self.running,
            "username": self.username,
            "lastError": self.last_error,
        }


runtime = BotRuntime()


def send_sync(chat_id: int, text: str) -> bool:
    return runtime.send_sync(chat_id, text)


def broadcast_sync(chat_ids: Iterable[int], text: str) -> dict:
    return runtime.broadcast_sync(chat_ids, text)


def bot_status() -> dict:
    return runtime.status()
