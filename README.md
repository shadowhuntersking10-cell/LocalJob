# LocalJob — ish bozori platformasi (Telegram bot + WebApp + API + SPA)

**Bitta buyruq hammasini ishga tushiradi:**

```bash
pip install -r requirements.txt
python main.py
```

`python main.py` quyidagilarni ishga tushiradi:

| Xizmat | Manzil |
| --- | --- |
| Veb-sayt (React SPA) + Telegram WebApp | http://localhost:8000 |
| Admin panel (WebApp ichida) | http://localhost:8000/admin |
| REST API + Swagger | http://localhost:8000/api/docs |
| Telegram bot (aiogram 3, WebApp tugmasi bilan) | `BOT_TOKEN` sozlangandan keyin avtomatik |

Baza jadvallari avtomatik yaratiladi va demo ma'lumotlar (37 ta vakansiya, 9 ta kompaniya, demo akkauntlar) bir marta seed qilinadi.

## Demo akkauntlar

| Rol | Email | Parol |
| --- | --- | --- |
| Ish qidiruvchi | `demo@localjob.uz` | `Demo1234!` |
| Ish beruvchi | `employer@localjob.uz` | `Demo1234!` |
| Administrator | `admin@localjob.uz` | `Admin1234!` |

## Sozlamalar (`.env`)

```bash
cp .env.example .env
```

| O'zgaruvchi | Izoh |
| --- | --- |
| `BOT_TOKEN` | @BotFather'dan olingan token. Bo'sh bo'lsa bot o'chadi, sayt ishlaydi. |
| `BOT_USERNAME` | Bot username (havolalar uchun). |
| `ADMIN_IDS` | Vergul bilan ajratilgan Telegram ID'lar — faqat shular admin panelni ko'radi. |
| `PUBLIC_URL` | WebApp uchun ochiq URL (masalan `https://localjob.uz`). |
| `HOST`, `PORT` | Standart `0.0.0.0:8000`. |
| `DB_ENGINE` | `auto` (standart) — MySQL bo'lmasa SQLite'ga tushadi; `mysql` yoki `sqlite`. |
| `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` | MySQL ulanishi. |
| `SQLITE_FILE` | SQLite fayl nomi (`localjob.sqlite3`). |
| `SECRET_KEY` | Sessiya tokenlari uchun maxfiy kalit. |
| `SEED_DEMO_DATA` | `1` — demo ma'lumotlarni seed qilish. |

### MySQL

MySQL'da baza yaratib, `.env` ni to'ldiring — ilova jadvallarni o'zi yaratadi:

```sql
CREATE DATABASE localjob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Qo'lda yaratish uchun tayyor DDL: [`sql/schema.sql`](sql/schema.sql).

MySQL topilmasa ilova ogohlantirib SQLite'ga o'tadi (`localjob.sqlite3`) — shuning uchun loyiha har qanday mashinada ishga tushadi.

## Telegram bot

* `/start` — salomlashuv + **WebApp tugmasi** (Mini App) va asosiy menyu.
* `/jobs`, `/categories`, `/language`, `/profile`, `/help` — ishlaydigan buyruqlar.
* Inline rejim: istalgan chatda `@BotUsername react` orqali ish qidirish.
* Admin (`ADMIN_IDS` ichidagilar uchun): statistika, foydalanuvchilar, e'lon (broadcast), CSV eksport.
* Admin panel faqat `ADMIN_IDS` ro'yxatidagi Telegram ID'lar uchun ko'rinadi (backend ham, frontend ham tekshiradi).

## Boshqa buyruqlar

```bash
python main.py --no-bot        # faqat sayt + API
python main.py --seed-only     # jadval + demo ma'lumot
python main.py --no-seed       # demo ma'lumotlarsiz
python main.py --db sqlite     # SQLite'ni majburan ishlatish
python main.py --no-build      # SPA'ni avtomatik qurmaslik
python main.py --reload        # API'ni kod o'zgarishida qayta yuklash
```

`web/dist` mavjud bo'lmasa, `main.py` Node.js topilsa SPA'ni o'zi qurib oladi (`npm install && npm run build`).

## Frontend (qo'lda)

```bash
cd web
npm install
npm run dev      # Vite dev server (API /api → 127.0.0.1:8000 proxy)
npm run build    # web/dist ga production build
```

## Testlar

```bash
python scripts/smoke_api.py    # 73 ta API/flow tekshiruvi (server ishlab turishi kerak)
cd web && npm run smoke        # barcha sahifalarni render qilib tekshirish
```

## Loyiha tuzilishi

```
main.py                  # yagona entry point (baza + API + SPA + bot)
backend/
  config.py db.py models.py schemas.py security.py matching.py
  seed_data.py seed.py   # 37 ta real vakansiya + demo akkauntlar
  api/                   # FastAPI routerlar (auth, jobs, applications, profile, admin)
  bot/                   # aiogram 3 bot: handlers, keyboards, locales (uz/en/ru)
sql/schema.sql           # MySQL DDL
web/                     # React 18 + TypeScript + Vite + Tailwind SPA
  src/components/        # UI kit, layout, jobs komponentlari
  src/pages/             # barcha sahifalar (public, seeker, employer, admin)
  src/context/           # Auth, Theme, Language, Toast
  src/services/          # API klient + offline (localStorage) rejim
scripts/                 # seed eksporti va API smoke-test
```

## Xususiyatlar

* **3 til**: o'zbek, ingliz, rus — to'liq interfeys tarjimasi.
* **Kun/tun rejimi**: to'q ko'k + och ko'k SOFT UI, ikki mavzu.
* **Ish qidiruvchi**: qidiruv + filtrlar, saqlash, ariza yuborish, statuslar, profil (75%+ completion), bildirishnomalar.
* **Ish beruvchi**: vakansiya joylash/tahrirlash/pauza/o'chirish, nomzodlar oqimi (shortlist → suhbat → ishga olish).
* **Admin**: statistika, foydalanuvchilar/vakansiyalar/arizalar boshqaruvi, e'lon, CSV eksport, audit jurnali.
* Barcha formalar validatsiyali, tugmalar ishlaydi, bo'sh holatlar va skeleton yuklashlar mavjud.
