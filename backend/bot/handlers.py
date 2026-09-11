"""All Telegram bot handlers: user flows + admin panel."""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from aiogram import Bot, F, Router
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import BufferedInputFile, CallbackQuery, Message

from ..config import settings
from ..db import session_scope
from ..models import Application, Job, User
from ..seed_data import POPULAR_CATEGORIES
from ..security import hash_password
from . import keyboards as kb
from .locales import LANGS, t
from .service import runtime

log = logging.getLogger("localjob.bot.handlers")
router = Router()

ADMIN_BUTTON_KEYS = ("menu_admin",)


class Broadcast(StatesGroup):
    waiting_message = State()


# --------------------------------------------------------------------------
# DB helpers
# --------------------------------------------------------------------------
def sync_user(message: Message) -> User:
    tg = message.from_user
    with session_scope() as db:
        user = db.query(User).filter(User.telegram_id == tg.id).one_or_none()
        if user is None:
            user = db.query(User).filter(User.email == f"tg{tg.id}@localjob.uz").one_or_none()
        if user is None:
            role = "admin" if settings.is_admin(tg.id) else "job_seeker"
            user = User(
                name=" ".join(filter(None, [tg.first_name, tg.last_name])) or tg.username or "Telegram user",
                email=f"tg{tg.id}@localjob.uz",
                password_hash=hash_password(f"tg-{tg.id}-{settings.secret_key[:8]}"),
                role=role,
                telegram_id=tg.id,
                telegram_username=tg.username,
                language=(tg.language_code or settings.default_language)[:2].lower(),
            )
            if user.language not in LANGS:
                user.language = "en"
            db.add(user)
            db.flush()
        else:
            user.telegram_username = tg.username or user.telegram_username
            if settings.is_admin(tg.id):
                user.role = "admin"
        db.refresh(user)
        db.expunge(user)
        return user


def get_lang(telegram_id: int) -> str:
    with session_scope() as db:
        user = db.query(User).filter(User.telegram_id == telegram_id).one_or_none()
        lang = (user.language if user else settings.default_language) or "uz"
        return lang if lang in LANGS else "en"


def set_lang(telegram_id: int, lang: str) -> None:
    with session_scope() as db:
        user = db.query(User).filter(User.telegram_id == telegram_id).one_or_none()
        if user:
            user.language = lang
            db.add(user)


def is_admin(message_or_query: Message | CallbackQuery) -> bool:
    tg = message_or_query.from_user
    if settings.is_admin(tg.id):
        return True
    with session_scope() as db:
        user = db.query(User).filter(User.telegram_id == tg.id).one_or_none()
        return bool(user and user.role == "admin")


def search_jobs(query: str | None, category: str | None = None, limit: int = 8) -> list[Job]:
    with session_scope() as db:
        stmt = db.query(Job).filter(Job.status == "active")
        if query:
            like = f"%{query.lower()}%"
            stmt = stmt.filter(
                Job.title.ilike(like)
                | Job.description.ilike(like)
                | Job.location.ilike(like)
                | Job.category.ilike(like)
            )
        if category:
            stmt = stmt.filter(Job.category == category)
        jobs = stmt.order_by(Job.created_at.desc()).limit(limit).all()
        for job in jobs:
            db.expunge(job)
        return jobs


def job_by_id(job_id: int) -> Job | None:
    with session_scope() as db:
        job = db.get(Job, job_id)
        if job:
            db.expunge(job)
        return job


def job_line(job: Job, index: int) -> str:
    salary = job.salary_label
    company = job.company.name if job.company else "LocalJob"
    return (
        f"{index}. <b>{job.title}</b>\n"
        f"   🏢 {company}\n"
        f"   📍 {job.location} · {job.employment_type}\n"
        f"   💰 {salary}\n"
    )


# --------------------------------------------------------------------------
# Commands
# --------------------------------------------------------------------------
@router.message(CommandStart())
@router.message(F.text.in_({v for v in (t("menu_webapp", "uz"), t("menu_webapp", "en"), t("menu_webapp", "ru"))}))
async def cmd_start(message: Message, bot: Bot) -> None:
    user = sync_user(message)
    lang = user.language if user.language in LANGS else "uz"
    admin = user.role == "admin"
    await message.answer(
        t("start", lang, name=message.from_user.first_name or "LocalJob"),
        reply_markup=kb.main_menu(lang, admin),
        parse_mode="HTML",
    )
    await message.answer(t("top_jobs", lang), reply_markup=kb.start_inline(lang, admin), parse_mode="HTML")


@router.message(Command("help"))
@router.message(F.text.in_({t("menu_help", l) for l in LANGS}))
async def cmd_help(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    await message.answer(t("help", lang), parse_mode="HTML", reply_markup=kb.start_inline(lang, is_admin(message)))


@router.message(Command("language"))
@router.message(F.text.in_({t("menu_language", l) for l in LANGS}))
async def cmd_language(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    await message.answer(t("choose_language", lang), reply_markup=kb.language_keyboard())


@router.callback_query(F.data.startswith("lang:"))
async def set_language(query: CallbackQuery) -> None:
    code = query.data.split(":", 1)[1]
    if code not in LANGS:
        await query.answer("Unsupported", show_alert=False)
        return
    set_lang(query.from_user.id, code)
    admin = is_admin(query)
    await query.message.answer(t("language_set", code), reply_markup=kb.main_menu(code, admin))
    await query.message.answer(t("top_jobs", code), reply_markup=kb.start_inline(code, admin), parse_mode="HTML")
    await query.answer()


@router.message(Command("profile"))
@router.message(F.text.in_({t("menu_profile", l) for l in LANGS}))
async def cmd_profile(message: Message) -> None:
    user = sync_user(message)
    lang = get_lang(message.from_user.id)
    role_key = {"job_seeker": "role_job_seeker", "employer": "role_employer", "admin": "role_admin"}.get(user.role, "role_job_seeker")
    created = user.created_at.strftime("%d.%m.%Y") if user.created_at else "-"
    await message.answer(
        t("profile_card", lang, name=user.name, role=t(role_key, lang), date=created),
        parse_mode="HTML",
        reply_markup=kb.profile_keyboard(lang),
    )


@router.message(Command("jobs"))
@router.message(F.text.in_({t("menu_jobs", l) for l in LANGS}))
async def cmd_jobs(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    jobs = search_jobs(None)
    if not jobs:
        await message.answer(t("jobs_not_found", lang))
        return
    text = t("jobs_found", lang, count=len(jobs)) + "\n\n" + "\n".join(
        job_line(job, i + 1) for i, job in enumerate(jobs)
    )
    await message.answer(text, parse_mode="HTML", reply_markup=kb.jobs_keyboard(lang, jobs))


@router.message(Command("categories"))
@router.message(F.text.in_({t("menu_categories", l) for l in LANGS}))
async def cmd_categories(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    await message.answer(t("categories_title", lang), reply_markup=kb.categories_keyboard(lang))


@router.callback_query(F.data == "menu:jobs")
async def cb_jobs(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    jobs = search_jobs(None)
    text = t("jobs_found", lang, count=len(jobs)) + "\n\n" + "\n".join(
        job_line(job, i + 1) for i, job in enumerate(jobs)
    ) if jobs else t("jobs_not_found", lang)
    await query.message.edit_text(text, parse_mode="HTML", reply_markup=kb.jobs_keyboard(lang, jobs))
    await query.answer()


@router.callback_query(F.data == "menu:categories")
async def cb_categories(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    await query.message.edit_text(t("categories_title", lang), reply_markup=kb.categories_keyboard(lang))
    await query.answer()


@router.callback_query(F.data.startswith("cat:"))
async def cb_category(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    category = query.data.split(":", 1)[1]
    jobs = search_jobs(None, category=category)
    title = next((c.get(f"label_{lang}") or c["label_en"] for c in POPULAR_CATEGORIES if c["key"] == category), category)
    if not jobs:
        await query.message.edit_text(f"<b>{title}</b>\n\n" + t("jobs_not_found", lang), parse_mode="HTML",
                                      reply_markup=kb.categories_keyboard(lang))
        await query.answer()
        return
    text = f"<b>{title}</b>\n" + t("jobs_found", lang, count=len(jobs)) + "\n\n" + "\n".join(
        job_line(job, i + 1) for i, job in enumerate(jobs)
    )
    await query.message.edit_text(text, parse_mode="HTML", reply_markup=kb.jobs_keyboard(lang, jobs))
    await query.answer()


@router.callback_query(F.data.startswith("job:"))
async def cb_job(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    job_id = int(query.data.split(":", 1)[1])
    job = job_by_id(job_id)
    if not job:
        await query.answer("Job not found", show_alert=True)
        return
    text = (
        f"💼 <b>{job.title}</b>\n"
        f"🏢 {job.company.name if job.company else 'LocalJob'}\n"
        f"📍 {job.location} · {job.employment_type} · {job.experience_level}\n"
        f"💰 {job.salary_label}\n\n"
        f"{(job.description or '')[:600]}\n\n"
        f"🛠 {', '.join((job.skills or [])[:6])}\n\n"
        f"{t('apply_hint', lang)}"
    )
    await query.message.edit_text(text, parse_mode="HTML", reply_markup=kb.job_detail_keyboard(lang, job.id),
                                 disable_web_page_preview=True)
    await query.answer()


@router.callback_query(F.data == "menu:profile")
async def cb_profile(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    await query.message.edit_text(t("profile_card", lang, name=query.from_user.full_name,
                                    role=t("role_job_seeker", lang), date="—"),
                                  parse_mode="HTML", reply_markup=kb.profile_keyboard(lang))
    await query.answer()


@router.callback_query(F.data == "menu:language")
async def cb_language(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    await query.message.edit_text(t("choose_language", lang), reply_markup=kb.language_keyboard())
    await query.answer()


@router.callback_query(F.data == "admin:webapp")
async def cb_admin_webapp(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    await query.message.answer("🚀 WebApp", reply_markup=kb.start_inline(lang, True))
    await query.answer()


# --------------------------------------------------------------------------
# Admin panel
# --------------------------------------------------------------------------
def admin_stats_text(lang: str) -> str:
    from ..db import DB_BACKEND

    with session_scope() as db:
        users = db.query(User).count()
        seekers = db.query(User).filter(User.role == "job_seeker").count()
        employers = db.query(User).filter(User.role == "employer").count()
        jobs = db.query(Job).count()
        active = db.query(Job).filter(Job.status == "active").count()
        applications = db.query(Application).count()
        views = db.query(Job).with_entities(Job.views).all()
        total_views = sum((v[0] or 0) for v in views)
        week_ago = datetime.now(timezone.utc).replace(tzinfo=None).replace(hour=0, minute=0, second=0)
        from datetime import timedelta

        week_ago = week_ago - timedelta(days=7)
        new_users = db.query(User).filter(User.created_at >= week_ago).count()
    return t("admin_stats", lang, users=users, seekers=seekers, employers=employers, new_users=new_users,
             jobs=jobs, active=active, applications=applications, views=total_views, db=DB_BACKEND)


@router.message(Command("admin"))
@router.message(F.text.in_({t("menu_admin", l) for l in LANGS}))
async def cmd_admin(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    if not is_admin(message):
        await message.answer(t("admin_only", lang))
        return
    await message.answer(t("admin_panel", lang), reply_markup=kb.admin_keyboard(lang), parse_mode="HTML")


@router.callback_query(F.data == "admin:home")
async def cb_admin_home(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    if not is_admin(query):
        await query.answer(t("admin_only", lang), show_alert=True)
        return
    await query.message.edit_text(t("admin_panel", lang), reply_markup=kb.admin_keyboard(lang), parse_mode="HTML")
    await query.answer()


@router.callback_query(F.data == "admin:stats")
async def cb_admin_stats(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    if not is_admin(query):
        await query.answer(t("admin_only", lang), show_alert=True)
        return
    await query.message.edit_text(admin_stats_text(lang), parse_mode="HTML", reply_markup=kb.admin_keyboard(lang))
    await query.answer()


@router.callback_query(F.data == "admin:users")
async def cb_admin_users(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    if not is_admin(query):
        await query.answer(t("admin_only", lang), show_alert=True)
        return
    with session_scope() as db:
        users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
        lines = [
            f"• <b>{u.name}</b> — {u.email}\n   {u.role} · {u.created_at.strftime('%d.%m.%Y') if u.created_at else ''}"
            for u in users
        ]
    await query.message.edit_text(t("admin_users", lang) + "\n\n" + "\n".join(lines), parse_mode="HTML",
                                  reply_markup=kb.admin_keyboard(lang))
    await query.answer()


@router.callback_query(F.data == "admin:broadcast")
async def cb_admin_broadcast(query: CallbackQuery, state: FSMContext) -> None:
    lang = get_lang(query.from_user.id)
    if not is_admin(query):
        await query.answer(t("admin_only", lang), show_alert=True)
        return
    await state.set_state(Broadcast.waiting_message)
    await query.message.answer(t("admin_broadcast_prompt", lang), reply_markup=kb.cancel_keyboard(lang))
    await query.answer()


@router.message(Broadcast.waiting_message, Command("cancel"))
async def cancel_broadcast(message: Message, state: FSMContext) -> None:
    lang = get_lang(message.from_user.id)
    await state.clear()
    await message.answer(t("cancelled", lang), reply_markup=kb.main_menu(lang, is_admin(message)))


@router.message(Broadcast.waiting_message)
async def do_broadcast(message: Message, state: FSMContext) -> None:
    lang = get_lang(message.from_user.id)
    if not is_admin(message):
        await state.clear()
        return
    text = message.text or ""
    with session_scope() as db:
        users = db.query(User).filter(User.is_active.is_(True)).all()
        ids = [u.telegram_id for u in users if u.telegram_id]
        for u in users:
            from ..models import Notification

            db.add(Notification(user_id=u.id, kind="info", title="LocalJob announcement", message=text, link="/notifications"))
    result = runtime.broadcast_sync(ids, t("notification_prefix", lang) + "\n\n" + text) if ids else {"sent": 0, "failed": 0}
    await state.clear()
    await message.answer(
        t("admin_broadcast_done", lang, notified=len(users), sent=result.get("sent", 0), failed=result.get("failed", 0)),
        reply_markup=kb.main_menu(lang, True),
    )
    try:
        await message.delete()
    except Exception:
        pass


@router.callback_query(F.data == "admin:cancel")
async def cb_admin_cancel(query: CallbackQuery, state: FSMContext) -> None:
    lang = get_lang(query.from_user.id)
    await state.clear()
    await query.message.delete()
    await query.answer(t("cancelled", lang))


@router.callback_query(F.data == "admin:export")
async def cb_admin_export(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    if not is_admin(query):
        await query.answer(t("admin_only", lang), show_alert=True)
        return
    await query.message.edit_text(t("admin_export", lang), reply_markup=kb.export_keyboard())
    await query.answer()


@router.callback_query(F.data.startswith("admin:export:"))
async def cb_admin_export_file(query: CallbackQuery) -> None:
    lang = get_lang(query.from_user.id)
    if not is_admin(query):
        await query.answer(t("admin_only", lang), show_alert=True)
        return
    kind = query.data.rsplit(":", 1)[1]
    import csv
    import io

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    with session_scope() as db:
        if kind == "users":
            writer.writerow(["id", "name", "email", "role", "location", "telegram_id", "created_at"])
            for u in db.query(User).all():
                writer.writerow([u.id, u.name, u.email, u.role, u.location or "", u.telegram_id or "", u.created_at])
        elif kind == "applications":
            writer.writerow(["id", "job", "applicant", "status", "match", "created_at"])
            for a in db.query(Application).all():
                writer.writerow([a.id, a.job.title if a.job else "", a.applicant.name if a.applicant else "", a.status,
                                 a.match_score, a.created_at])
        else:
            writer.writerow(["id", "title", "category", "location", "employment_type", "status", "views", "applications"])
            for j in db.query(Job).all():
                writer.writerow([j.id, j.title, j.category, j.location, j.employment_type, j.status, j.views,
                                 j.applications_count])
    data = buffer.getvalue().encode("utf-8")
    await query.message.answer_document(
        BufferedInputFile(data, filename=f"localjob-{kind}.csv"),
        caption=f"📄 localjob-{kind}.csv",
    )
    await query.answer()


# --------------------------------------------------------------------------
# Free text search
# --------------------------------------------------------------------------
@router.message(F.text & ~F.text.startswith("/"))
async def free_text(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    query = (message.text or "").strip()
    menu_texts = {t(key, l) for key in ("menu_webapp", "menu_jobs", "menu_categories", "menu_profile",
                                        "menu_language", "menu_help", "menu_admin") for l in LANGS}
    if query in menu_texts:
        return
    jobs = search_jobs(query)
    if not jobs:
        await message.answer(t("jobs_not_found", lang))
        return
    text = t("jobs_found", lang, count=len(jobs)) + "\n\n" + "\n".join(job_line(job, i + 1) for i, job in enumerate(jobs))
    await message.answer(text, parse_mode="HTML", reply_markup=kb.jobs_keyboard(lang, jobs))


@router.inline_query()
async def inline_search(query) -> None:
    """Inline mode: type @LocalJobUzBot react in any chat."""
    results = []
    jobs = search_jobs(query.query or None, limit=10)
    from aiogram.types import InlineQueryResultArticle, InputTextMessageContent

    for job in jobs:
        results.append(
            InlineQueryResultArticle(
                id=str(job.id),
                title=f"{job.title} — {job.company.name if job.company else 'LocalJob'}",
                description=f"{job.location} · {job.salary_label} · {job.employment_type}",
                input_message_content=InputTextMessageContent(
                    message_text=(
                        f"💼 <b>{job.title}</b>\n🏢 {job.company.name if job.company else 'LocalJob'}\n"
                        f"📍 {job.location} · {job.employment_type}\n💰 {job.salary_label}\n\n"
                        f"{settings.webapp_url}/jobs/{job.id}"
                    ),
                    parse_mode="HTML",
                ),
            )
        )
    await query.answer(results, cache_time=30, is_personal=True)


@router.message()
async def fallback(message: Message) -> None:
    lang = get_lang(message.from_user.id)
    await message.answer(t("unknown", lang), reply_markup=kb.main_menu(lang, is_admin(message)))
