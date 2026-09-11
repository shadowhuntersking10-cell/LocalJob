"""Keyboards for the LocalJob bot."""
from __future__ import annotations

from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardMarkup,
    WebAppInfo,
)

from ..config import settings
from ..seed_data import POPULAR_CATEGORIES
from .locales import t


def webapp_url(path: str = "/") -> str:
    base = settings.webapp_url
    if not path.startswith("/"):
        path = "/" + path
    return base + path


def main_menu(lang: str, is_admin: bool = False) -> ReplyKeyboardMarkup:
    rows = [
        [KeyboardButton(text=t("menu_webapp", lang), web_app=WebAppInfo(url=webapp_url("/")))],
        [KeyboardButton(text=t("menu_jobs", lang)), KeyboardButton(text=t("menu_categories", lang))],
        [KeyboardButton(text=t("menu_profile", lang)), KeyboardButton(text=t("menu_language", lang))],
    ]
    if is_admin:
        rows.append([KeyboardButton(text=t("menu_admin", lang))])
    rows.append([KeyboardButton(text=t("menu_help", lang))])
    return ReplyKeyboardMarkup(keyboard=rows, resize_keyboard=True, is_persistent=True)


def webapp_inline(lang: str, path: str = "/") -> InlineKeyboardButton:
    return InlineKeyboardButton(text=t("btn_open_webapp", lang), web_app=WebAppInfo(url=webapp_url(path)))


def start_inline(lang: str, is_admin: bool = False) -> InlineKeyboardMarkup:
    rows = [
        [webapp_inline(lang, "/")],
        [
            InlineKeyboardButton(text=t("menu_jobs", lang), callback_data="menu:jobs"),
            InlineKeyboardButton(text=t("menu_categories", lang), callback_data="menu:categories"),
        ],
        [
            InlineKeyboardButton(text=t("menu_profile", lang), callback_data="menu:profile"),
            InlineKeyboardButton(text=t("menu_language", lang), callback_data="menu:language"),
        ],
    ]
    if is_admin:
        rows.append([InlineKeyboardButton(text=t("menu_admin", lang), callback_data="admin:home")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def language_keyboard() -> InlineKeyboardMarkup:
    labels = {"uz": "🇺🇿 O'zbekcha", "en": "🇬🇧 English", "ru": "🇷🇺 Русский"}
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=labels[code], callback_data=f"lang:{code}")] for code in ("uz", "en", "ru")
    ])


def categories_keyboard(lang: str) -> InlineKeyboardMarkup:
    rows = []
    row: list[InlineKeyboardButton] = []
    for item in POPULAR_CATEGORIES:
        label = item.get(f"label_{lang}") or item["label_en"]
        row.append(InlineKeyboardButton(text=f"{label}", callback_data=f"cat:{item['key']}"))
        if len(row) == 2:
            rows.append(row)
            row = []
    if row:
        rows.append(row)
    rows.append([InlineKeyboardButton(text=t("menu_jobs", lang), callback_data="menu:jobs")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def jobs_keyboard(lang: str, jobs: list) -> InlineKeyboardMarkup:
    rows = []
    for job in jobs[:8]:
        label = f"{job.title} · {job.location}"
        if len(label) > 58:
            label = label[:55] + "…"
        rows.append([InlineKeyboardButton(text=label, callback_data=f"job:{job.id}")])
    rows.append([InlineKeyboardButton(text=t("btn_open_webapp", lang), web_app=WebAppInfo(url=webapp_url("/jobs")))])
    rows.append([InlineKeyboardButton(text=t("menu_categories", lang), callback_data="menu:categories")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def job_detail_keyboard(lang: str, job_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=t("open_in_webapp", lang), web_app=WebAppInfo(url=webapp_url(f"/jobs/{job_id}")))],
        [InlineKeyboardButton(text=t("btn_back", lang), callback_data="menu:jobs")],
    ])


def profile_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="👤 " + t("open_in_webapp", lang).split(" ")[-2], web_app=WebAppInfo(url=webapp_url("/profile")))],
        [InlineKeyboardButton(text=t("menu_jobs", lang), callback_data="menu:jobs")],
    ])


def admin_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📊 Statistika", callback_data="admin:stats"),
         InlineKeyboardButton(text="👥 Foydalanuvchilar", callback_data="admin:users")],
        [InlineKeyboardButton(text="🛡 WebApp admin panel", web_app=WebAppInfo(url=webapp_url("/admin")))],
        [InlineKeyboardButton(text="📣 Xabar yuborish", callback_data="admin:broadcast"),
         InlineKeyboardButton(text="📄 CSV hisobot", callback_data="admin:export")],
        [InlineKeyboardButton(text="🚀 WebApp", callback_data="admin:webapp")],
    ])


def export_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Ishtirokchilar / users", callback_data="admin:export:users")],
        [InlineKeyboardButton(text="Ishlar / jobs", callback_data="admin:export:jobs")],
        [InlineKeyboardButton(text="Arizalar / applications", callback_data="admin:export:applications")],
    ])


def cancel_keyboard(lang: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✖️ " + t("cancelled", lang), callback_data="admin:cancel")]
    ])
