"""Runs the aiogram bot (polling) in a background thread next to FastAPI."""
from __future__ import annotations

import asyncio
import logging
import threading

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import BotCommand, MenuButtonWebApp, WebAppInfo

from ..config import settings
from . import handlers
from .keyboards import webapp_url
from .service import runtime

log = logging.getLogger("localjob.bot.runner")


class BotRunner:
    """Owns the bot thread so `python main.py` can run bot + API together."""

    def __init__(self) -> None:
        self._thread: threading.Thread | None = None
        self._stop_event = threading.Event()

    # -- lifecycle -------------------------------------------------------
    def start(self) -> bool:
        if not settings.bot_enabled:
            log.warning("BOT_TOKEN is not configured — the Telegram bot will be skipped (website/API still run).")
            runtime.detach("no-token")
            return False
        if self._thread and self._thread.is_alive():
            return True
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._run, name="localjob-bot", daemon=True)
        self._thread.start()
        return True

    def stop(self) -> None:
        self._stop_event.set()
        runtime.detach("stopped")

    # -- internals -------------------------------------------------------
    def _run(self) -> None:
        try:
            asyncio.run(self._poll())
        except Exception as exc:  # pragma: no cover
            runtime.detach(str(exc))
            log.error("Bot stopped: %s", exc)

    async def _poll(self) -> None:
        bot = Bot(token=settings.bot_token, default=DefaultBotProperties(parse_mode="HTML"))
        dispatcher = Dispatcher(storage=MemoryStorage())
        dispatcher.include_router(handlers.router)

        me = await bot.get_me()
        runtime.attach(asyncio.get_running_loop(), bot, me.username)
        log.info("Bot @%s is running (polling)", me.username)

        try:
            await bot.set_my_commands([
                BotCommand(command="start", description="Bosh menyu / Main menu"),
                BotCommand(command="jobs", description="Ishlar / Jobs"),
                BotCommand(command="categories", description="Bo'limlar / Categories"),
                BotCommand(command="profile", description="Profil / Profile"),
                BotCommand(command="language", description="Til / Language"),
                BotCommand(command="help", description="Yordam / Help"),
                BotCommand(command="admin", description="Admin panel"),
            ])
            await bot.set_chat_menu_button(
                menu_button=MenuButtonWebApp(text="🚀 LocalJob", web_app=WebAppInfo(url=webapp_url("/")))
            )
        except Exception as exc:  # pragma: no cover
            log.warning("Could not configure bot commands/menu button: %s", exc)

        try:
            await bot.delete_webhook(drop_pending_updates=False)
            await dispatcher.start_polling(bot, allowed_updates=dispatcher.resolve_used_update_types())
        except asyncio.CancelledError:  # pragma: no cover
            pass
        except Exception as exc:  # pragma: no cover
            runtime.detach(str(exc))
            raise
        finally:
            await bot.session.close()
            runtime.detach()

    def restart(self) -> str:
        self.stop()
        started = self.start()
        return "restarted" if started else "bot disabled"


bot_runner = BotRunner()
