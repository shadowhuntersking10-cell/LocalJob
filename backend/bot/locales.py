"""Three-language texts for the Telegram bot: Uzbek, English, Russian."""
from __future__ import annotations

LANGS = ("uz", "en", "ru")

T = {
    "menu_webapp": {"uz": "🚀 WebApp ochish", "en": "🚀 Open WebApp", "ru": "🚀 Открыть WebApp"},
    "menu_jobs": {"uz": "💼 Ishlar", "en": "💼 Jobs", "ru": "💼 Вакансии"},
    "menu_categories": {"uz": "🗂 Bo'limlar", "en": "🗂 Categories", "ru": "🗂 Категории"},
    "menu_profile": {"uz": "👤 Profilim", "en": "👤 My profile", "ru": "👤 Мой профиль"},
    "menu_language": {"uz": "🌐 Til", "en": "🌐 Language", "ru": "🌐 Язык"},
    "menu_help": {"uz": "❓ Yordam", "en": "❓ Help", "ru": "❓ Помощь"},
    "menu_admin": {"uz": "🛡 Admin panel", "en": "🛡 Admin panel", "ru": "🛡 Админ-панель"},
    "btn_open_webapp": {"uz": "LocalJob WebApp", "en": "LocalJob WebApp", "ru": "LocalJob WebApp"},
    "btn_back": {"uz": "⬅️ Ortga", "en": "⬅️ Back", "ru": "⬅️ Назад"},
    "start": {
        "uz": (
            "Assalomu alaykum, {name}! 👋\n\n"
            "<b>LocalJob</b> — ish topish va xodim yollash uchun local platforma.\n"
            "Find work. Find talent. Grow locally.\n\n"
            "WebApp tugmasini bosib to'liq platformaga kiring: ish qidirish, filtrlash, "
            "ariza yuborish, profil va ish beruvchilar uchun e'lon joylash."
        ),
        "en": (
            "Welcome, {name}! 👋\n\n"
            "<b>LocalJob</b> is a local marketplace for jobs and talent.\n"
            "Find work. Find talent. Grow locally.\n\n"
            "Tap the WebApp button to open the full platform: search jobs, filter, apply, "
            "manage your profile, post jobs as an employer."
        ),
        "ru": (
            "Здравствуйте, {name}! 👋\n\n"
            "<b>LocalJob</b> — локальная платформа для поиска работы и сотрудников.\n"
            "Find work. Find talent. Grow locally.\n\n"
            "Нажмите кнопку WebApp, чтобы открыть платформу: поиск вакансий, фильтры, "
            "отклики, профиль и публикация вакансий для работодателей."
        ),
    },
    "choose_language": {
        "uz": "Tilni tanlang / Choose a language / Выберите язык",
        "en": "Choose a language / Tilni tanlang / Выберите язык",
        "ru": "Выберите язык / Tilni tanlang / Choose a language",
    },
    "language_set": {"uz": "✅ Til o'zbek tiliga o'zgartirildi.", "en": "✅ Language set to English.", "ru": "✅ Язык изменён на русский."},
    "jobs_prompt": {
        "uz": "Qidiruv so'zini yozing (masalan: React, SMM, Tashkent yoki Designer).",
        "en": "Send a search keyword (for example: React, SMM, Tashkent or Designer).",
        "ru": "Введите поисковый запрос (например: React, SMM, Tashkent или Designer).",
    },
    "jobs_found": {"uz": "🔎 {count} ta ish topildi:", "en": "🔎 {count} jobs found:", "ru": "🔎 Найдено вакансий: {count}"},
    "jobs_not_found": {
        "uz": "Hech narsa topilmadi. Boshqa so'z bilan urinib ko'ring.",
        "en": "Nothing found. Try another keyword.",
        "ru": "Ничего не найдено. Попробуйте другой запрос.",
    },
    "categories_title": {"uz": "Bo'limni tanlang:", "en": "Choose a category:", "ru": "Выберите категорию:"},
    "top_jobs": {"uz": "🆕 Eng yangi ishlar:", "en": "🆕 Latest jobs:", "ru": "🆕 Новые вакансии:"},
    "help": {
        "uz": (
            "ℹ️ <b>Yordam</b>\n\n"
            "/start — asosiy menyu va WebApp\n"
            "/jobs — ish qidirish\n"
            "/categories — bo'limlar bo'yicha\n"
            "/profile — profilni WebApp'da ochish\n"
            "/language — tilni almashtirish\n\n"
            "Ish beruvchilar WebApp orqali e'lon joylashtiradi. Savollar: support@localjob.uz"
        ),
        "en": (
            "ℹ️ <b>Help</b>\n\n"
            "/start — main menu and WebApp\n"
            "/jobs — search jobs\n"
            "/categories — browse by category\n"
            "/profile — open your profile in the WebApp\n"
            "/language — switch language\n\n"
            "Employers post jobs inside the WebApp. Contact: support@localjob.uz"
        ),
        "ru": (
            "ℹ️ <b>Помощь</b>\n\n"
            "/start — главное меню и WebApp\n"
            "/jobs — поиск вакансий\n"
            "/categories — по категориям\n"
            "/profile — открыть профиль в WebApp\n"
            "/language — сменить язык\n\n"
            "Работодатели публикуют вакансии в WebApp. Почта: support@localjob.uz"
        ),
    },
    "profile_card": {
        "uz": "👤 <b>{name}</b>\nRol: {role}\nRo'yxatdan o'tgan: {date}\n\nTo'liq profilni WebApp'da ko'ring va yangilang.",
        "en": "👤 <b>{name}</b>\nRole: {role}\nJoined: {date}\n\nOpen the WebApp to view and update your full profile.",
        "ru": "👤 <b>{name}</b>\nРоль: {role}\nДата регистрации: {date}\n\nОткройте WebApp, чтобы посмотреть и обновить профиль.",
    },
    "role_job_seeker": {"uz": "Ish qidiruvchi", "en": "Job seeker", "ru": "Соискатель"},
    "role_employer": {"uz": "Ish beruvchi", "en": "Employer", "ru": "Работодатель"},
    "role_admin": {"uz": "Administrator", "en": "Administrator", "ru": "Администратор"},
    "admin_only": {
        "uz": "⛔️ Bu buyruq faqat administratorlar uchun.",
        "en": "⛔️ This command is for administrators only.",
        "ru": "⛔️ Эта команда только для администраторов.",
    },
    "admin_panel": {
        "uz": "🛡 <b>Admin panel</b>\n\nTanlang:",
        "en": "🛡 <b>Admin panel</b>\n\nChoose an action:",
        "ru": "🛡 <b>Admin panel</b>\n\nВыберите действие:",
    },
    "admin_stats": {
        "uz": (
            "📊 <b>Statistika</b>\n\n"
            "👥 Foydalanuvchilar: {users} (ish qidiruvchi {seekers}, ish beruvchi {employers})\n"
            "🆕 Shu haftada: {new_users}\n"
            "💼 Ishlar: {jobs} (aktiv {active})\n"
            "📨 Arizalar: {applications}\n"
            "👁 Ko'rishlar: {views}\n"
            "🖥 Baza: {db}"
        ),
        "en": (
            "📊 <b>Statistics</b>\n\n"
            "👥 Users: {users} (seekers {seekers}, employers {employers})\n"
            "🆕 This week: {new_users}\n"
            "💼 Jobs: {jobs} (active {active})\n"
            "📨 Applications: {applications}\n"
            "👁 Views: {views}\n"
            "🖥 Database: {db}"
        ),
        "ru": (
            "📊 <b>Статистика</b>\n\n"
            "👥 Пользователи: {users} (соискатели {seekers}, работодатели {employers})\n"
            "🆕 За неделю: {new_users}\n"
            "💼 Вакансии: {jobs} (активных {active})\n"
            "📨 Отклики: {applications}\n"
            "👁 Просмотры: {views}\n"
            "🖥 База: {db}"
        ),
    },
    "admin_broadcast_prompt": {
        "uz": "📣 Barcha foydalanuvchilarga yuboriladigan xabar matnini kiriting (bekor qilish: /cancel).",
        "en": "📣 Send the message text to broadcast to all users (cancel: /cancel).",
        "ru": "📣 Отправьте текст рассылки для всех пользователей (отмена: /cancel).",
    },
    "admin_broadcast_done": {
        "uz": "✅ Xabar {notified} foydalanuvchiga yuborildi (Telegram: {sent}, xatolik: {failed}).",
        "en": "✅ Broadcast sent to {notified} users (Telegram: {sent}, failed: {failed}).",
        "ru": "✅ Рассылка отправлена {notified} пользователям (Telegram: {sent}, ошибок: {failed}).",
    },
    "admin_export": {
        "uz": "📄 CSV hisobot turini tanlang:",
        "en": "📄 Choose the CSV report type:",
        "ru": "📄 Выберите тип CSV-отчёта:",
    },
    "admin_users": {"uz": "👥 Foydalanuvchilar (oxirgi 10):", "en": "👥 Latest users (last 10):", "ru": "👥 Пользователи (последние 10):"},
    "cancelled": {"uz": "Bekor qilindi.", "en": "Cancelled.", "ru": "Отменено."},
    "unknown": {
        "uz": "Tushunmadim 🤔 WebApp'ni ochish uchun pastdagi tugmani bosing yoki /help buyrug'ini yuboring.",
        "en": "I did not understand 🤔 Tap the WebApp button below or send /help.",
        "ru": "Не понял 🤔 Нажмите кнопку WebApp ниже или отправьте /help.",
    },
    "open_in_webapp": {"uz": "🔗 WebApp'da ochish", "en": "🔗 Open in WebApp", "ru": "🔗 Открыть в WebApp"},
    "apply_hint": {
        "uz": "Ariza yuborish uchun WebApp'da ish sahifasini oching.",
        "en": "Open the job page in the WebApp to apply.",
        "ru": "Откройте вакансию в WebApp, чтобы откликнуться.",
    },
    "notification_prefix": {"uz": "🔔 LocalJob", "en": "🔔 LocalJob", "ru": "🔔 LocalJob"},
}


def t(key: str, lang: str = "uz", **kwargs) -> str:
    entry = T.get(key)
    if not entry:
        return key
    text = entry.get(lang) or entry.get("en") or next(iter(entry.values()))
    return text.format(**kwargs) if kwargs else text
