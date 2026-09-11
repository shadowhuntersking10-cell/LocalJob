var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { Link, useNavigate, NavLink, Outlet, useLocation, Navigate, useSearchParams, useParams, Routes, Route } from "react-router-dom";
import { Loader2, Building2, BadgeCheck, ShieldCheck, Plus, Menu, X, LogOut, Sun, Moon, ChevronDown, Bell, LayoutDashboard, FileText, Briefcase, User, Users, Settings, Bookmark, Sparkles, BarChart3, Megaphone, Activity, Database, Send, Github, Linkedin, Mail, SearchX, ShieldAlert, Search, MapPin, AlertTriangle, Info, XCircle, CheckCircle2, BookmarkCheck, Wallet, Clock, ArrowRight, UserPlus, Headphones, GraduationCap, Landmark, Handshake, TrendingUp, Palette, Code2, EyeOff, Eye, AlertCircle, Check, UploadCloud, RotateCcw, SlidersHorizontal, CalendarClock, Share2, Globe, ArrowLeft, LogIn, UserCheck, UserCog, BriefcaseBusiness, UserRound, CheckSquare, Calendar, ExternalLink, BookmarkX, Trash2, Link2, Save, KeyRound, Shield, Download, CheckCheck, Compass, Rocket, Pencil, Pause, Play, Star, Phone, UserX } from "lucide-react";
import { createContext, useState, useCallback, useEffect, useMemo, useContext, forwardRef, useRef, useId } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatSalary(value, currency = "UZS") {
  if (value === null || value === void 0 || Number.isNaN(value)) return "—";
  if (currency === "UZS") {
    if (value >= 1e6) return `${(value / 1e6).toFixed(value % 1e6 === 0 ? 0 : 1)} mln so'm`;
    if (value >= 1e3) return `${Math.round(value / 1e3)} ming so'm`;
    return `${value} so'm`;
  }
  if (value >= 1e3) return `$${(value / 1e3).toFixed(value % 1e3 === 0 ? 0 : 1)}k`;
  return `$${value}`;
}
function relativeTime(iso, lang = "en") {
  if (!iso) return "";
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 6e4);
  const hours = Math.round(diff / 36e5);
  const days = Math.round(diff / 864e5);
  const locale = lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US";
  if (minutes < 1) return { uz: "hozir", en: "just now", ru: "только что" }[lang];
  if (minutes < 60) return { uz: `${minutes} daqiqa oldin`, en: `${minutes}m ago`, ru: `${minutes} мин назад` }[lang];
  if (hours < 24) return { uz: `${hours} soat oldin`, en: `${hours}h ago`, ru: `${hours} ч назад` }[lang];
  if (days < 7) return { uz: `${days} kun oldin`, en: `${days}d ago`, ru: `${days} дн назад` }[lang];
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return { uz: `${weeks} hafta oldin`, en: `${weeks}w ago`, ru: `${weeks} нед назад` }[lang];
  }
  return date.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}
function formatDate(iso, lang = "en") {
  if (!iso) return "—";
  const locale = lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US";
  return new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}
function initials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => {
    var _a;
    return (_a = part[0]) == null ? void 0 : _a.toUpperCase();
  }).join("");
}
const ROLE_LABEL = {
  job_seeker: { uz: "Ish qidiruvchi", en: "Job seeker", ru: "Соискатель" },
  employer: { uz: "Ish beruvchi", en: "Employer", ru: "Работодатель" },
  admin: { uz: "Administrator", en: "Administrator", ru: "Администратор" }
};
function roleLabel(role, lang) {
  var _a;
  return ((_a = ROLE_LABEL[role]) == null ? void 0 : _a[lang]) ?? role;
}
function employmentLabel(value, lang) {
  var _a;
  const map = {
    "Full-time": { uz: "To'liq stavka", en: "Full-time", ru: "Полная занятость" },
    "Part-time": { uz: "Yarim stavka", en: "Part-time", ru: "Частичная занятость" },
    Contract: { uz: "Shartnoma", en: "Contract", ru: "Контракт" },
    Freelance: { uz: "Frilans", en: "Freelance", ru: "Фриланс" },
    Internship: { uz: "Amaliyot", en: "Internship", ru: "Стажировка" },
    Remote: { uz: "Masofaviy", en: "Remote", ru: "Удалённо" }
  };
  return ((_a = map[value]) == null ? void 0 : _a[lang]) ?? value;
}
function experienceLabel(value, lang) {
  var _a;
  const map = {
    "No experience": { uz: "Tajribasiz", en: "No experience", ru: "Без опыта" },
    Junior: { uz: "Junior", en: "Junior", ru: "Junior" },
    Middle: { uz: "Middle", en: "Middle", ru: "Middle" },
    Senior: { uz: "Senior", en: "Senior", ru: "Senior" }
  };
  return ((_a = map[value]) == null ? void 0 : _a[lang]) ?? value;
}
function statusLabel(status, lang) {
  var _a;
  const map = {
    submitted: { uz: "Yuborilgan", en: "Submitted", ru: "Отправлено" },
    review: { uz: "Ko'rib chiqilmoqda", en: "Under review", ru: "На рассмотрении" },
    shortlisted: { uz: "Saralangan", en: "Shortlisted", ru: "В шортлисте" },
    interview: { uz: "Suhbat", en: "Interview", ru: "Интервью" },
    rejected: { uz: "Rad etilgan", en: "Rejected", ru: "Отказ" },
    hired: { uz: "Ishga qabul qilindi", en: "Hired", ru: "Нанят" },
    active: { uz: "Faol", en: "Active", ru: "Активна" },
    paused: { uz: "To'xtatilgan", en: "Paused", ru: "Приостановлена" },
    closed: { uz: "Yopilgan", en: "Closed", ru: "Закрыта" }
  };
  return ((_a = map[status]) == null ? void 0 : _a[lang]) ?? status;
}
function statusTone(status) {
  switch (status) {
    case "hired":
      return "success";
    case "shortlisted":
      return "accent";
    case "interview":
      return "info";
    case "rejected":
      return "danger";
    case "review":
      return "warning";
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "closed":
      return "danger";
    default:
      return "default";
  }
}
function categoryLabel(key, lang) {
  var _a;
  const map = {
    IT: { uz: "IT va dasturlash", en: "IT & Development", ru: "IT и разработка" },
    Design: { uz: "Dizayn", en: "Design", ru: "Дизайн" },
    SMM: { uz: "SMM", en: "SMM", ru: "SMM" },
    Marketing: { uz: "Marketing", en: "Marketing", ru: "Маркетинг" },
    Sales: { uz: "Savdo", en: "Sales", ru: "Продажи" },
    Finance: { uz: "Moliya", en: "Finance", ru: "Финансы" },
    Education: { uz: "Ta'lim", en: "Education", ru: "Образование" },
    Support: { uz: "Mijozlar bilan ishlash", en: "Customer Support", ru: "Поддержка" },
    Operations: { uz: "Operatsiyalar", en: "Operations", ru: "Операции" },
    Logistics: { uz: "Logistika", en: "Logistics", ru: "Логистика" },
    Media: { uz: "Media", en: "Media", ru: "Медиа" },
    HR: { uz: "HR", en: "HR", ru: "HR" },
    Hospitality: { uz: "Mehmondo’stlik", en: "Hospitality", ru: "Гостеприимство" }
  };
  return ((_a = map[key]) == null ? void 0 : _a[lang]) ?? key;
}
function greetingKey(now = /* @__PURE__ */ new Date()) {
  const hour = now.getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote"
];
const EXPERIENCE_LEVELS = ["No experience", "Junior", "Middle", "Senior"];
const APPLICATION_STATUSES = ["submitted", "review", "shortlisted", "interview", "rejected", "hired"];
const memory = /* @__PURE__ */ new Map();
function available() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}
const storage = {
  get(key, fallback) {
    try {
      const raw = available() ? window.localStorage.getItem(key) : memory.get(key) ?? null;
      if (raw === null || raw === void 0) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (available()) window.localStorage.setItem(key, raw);
      else memory.set(key, raw);
    } catch {
    }
  },
  remove(key) {
    try {
      if (available()) window.localStorage.removeItem(key);
      else memory.delete(key);
    } catch {
    }
  },
  raw(key, fallback = "") {
    try {
      return (available() ? window.localStorage.getItem(key) : memory.get(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  setRaw(key, value) {
    try {
      if (available()) window.localStorage.setItem(key, value);
      else memory.set(key, value);
    } catch {
    }
  }
};
const KEYS = {
  token: "localjob.token",
  session: "localjob.session",
  theme: "localjob.theme",
  lang: "localjob.lang",
  localDb: "localjob.db.v1"
};
class ApiError extends Error {
  constructor(status, code) {
    super(code);
    __publicField(this, "status");
    __publicField(this, "code");
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
function getToken() {
  return storage.raw(KEYS.token, "");
}
function setToken(token) {
  storage.setRaw(KEYS.token, token);
}
function clearToken() {
  storage.remove(KEYS.token);
  storage.remove(KEYS.session);
}
function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === void 0 || value === "" || value === false) return;
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(","));
      return;
    }
    search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}
async function request(path, init = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response;
  try {
    response = await fetch(path, { ...init, headers });
  } catch (error) {
    throw new ApiError(0, "network_error");
  }
  if (response.status === 204) return void 0;
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    const detail = (payload && typeof payload === "object" && "detail" in payload ? String(payload.detail) : "") || `http_${response.status}`;
    throw new ApiError(response.status, detail);
  }
  return payload;
}
const post = (path, body) => request(path, { method: "POST", body: body === void 0 ? void 0 : JSON.stringify(body) });
const put = (path, body) => request(path, { method: "PUT", body: JSON.stringify(body ?? {}) });
const patch = (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body ?? {}) });
const del = (path, body) => request(path, { method: "DELETE", body: body === void 0 ? void 0 : JSON.stringify(body) });
const api = {
  health: () => request("/api/health"),
  meta: () => request("/api/meta"),
  auth: {
    register: (payload) => post("/api/auth/register", payload),
    login: (payload) => post("/api/auth/login", payload),
    demo: (kind) => post(`/api/auth/demo/${kind}`, {}),
    telegram: (initData, startParam) => post("/api/auth/telegram", { init_data: initData, start_param: startParam }),
    me: () => request("/api/auth/me"),
    logout: () => post("/api/auth/logout", {}),
    changePassword: (payload) => post("/api/auth/change-password", payload),
    deleteAccount: (password) => del("/api/auth/account", { password })
  },
  settings: {
    update: (payload) => patch("/api/settings", payload),
    preferences: () => request("/api/settings/preferences"),
    updatePreferences: (payload) => put("/api/settings/preferences", payload)
  },
  notifications: {
    list: () => request("/api/notifications"),
    markRead: (payload) => post("/api/notifications/read", payload),
    clear: () => del("/api/notifications")
  },
  jobs: {
    list: (params) => request(`/api/jobs${buildQuery(params)}`),
    detail: (id) => request(`/api/jobs/${id}`),
    recommended: (limit = 6) => request(`/api/jobs/recommended${buildQuery({ limit })}`),
    mine: (status) => request(`/api/jobs/mine${buildQuery({ status })}`),
    create: (payload) => post("/api/jobs", payload),
    update: (id, payload) => patch(`/api/jobs/${id}`, payload),
    remove: (id) => del(`/api/jobs/${id}`),
    view: (id) => post(`/api/jobs/${id}/view`, {})
  },
  saved: {
    list: () => request("/api/saved"),
    save: (jobId) => post(`/api/saved/${jobId}`, {}),
    remove: (jobId) => del(`/api/saved/${jobId}`)
  },
  applications: {
    create: (payload) => post("/api/applications", payload),
    mine: (status) => request(
      `/api/applications${buildQuery({ status })}`
    ),
    detail: (id) => request(`/api/applications/${id}`),
    updateStatus: (id, status) => patch(`/api/applications/${id}/status`, { status }),
    employerList: (params) => request(
      `/api/employer/applications${buildQuery(params)}`
    ),
    candidate: (userId) => request(
      `/api/employer/candidates/${userId}`
    )
  },
  dashboard: {
    seeker: () => request("/api/dashboard"),
    employer: () => request("/api/employer/dashboard")
  },
  profile: {
    get: () => request("/api/profile"),
    update: (payload) => request("/api/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
  },
  companies: {
    list: (params = {}) => request(`/api/companies${buildQuery(params)}`),
    detail: (id) => request(`/api/companies/${id}`),
    mine: () => request("/api/my-company"),
    save: (payload) => put("/api/my-company", payload)
  },
  admin: {
    stats: () => request("/api/admin/stats"),
    users: (params) => request(
      `/api/admin/users${buildQuery(params)}`
    ),
    updateUser: (id, payload) => patch(`/api/admin/users/${id}`, payload),
    deleteUser: (id) => del(`/api/admin/users/${id}`),
    jobs: (params) => request(`/api/admin/jobs${buildQuery(params)}`),
    updateJob: (id, payload) => patch(`/api/admin/jobs/${id}`, payload),
    deleteJob: (id) => del(`/api/admin/jobs/${id}`),
    applications: (params) => request(
      `/api/admin/applications${buildQuery(params)}`
    ),
    broadcast: (payload) => post("/api/admin/broadcast", payload),
    activity: (limit = 30) => request(`/api/admin/activity${buildQuery({ limit })}`),
    exportUrl: (type) => `/api/admin/export?type=${type}`
  }
};
const categories = [
  "IT",
  "Design",
  "SMM",
  "Marketing",
  "Sales",
  "Finance",
  "Education",
  "Support",
  "Media",
  "HR",
  "Operations",
  "Logistics",
  "Hospitality"
];
const popularCategories = [
  {
    key: "IT",
    label_uz: "IT va dasturlash",
    label_en: "IT & Development",
    label_ru: "IT и разработка",
    icon: "code",
    count: 7
  },
  {
    key: "Design",
    label_uz: "Dizayn",
    label_en: "Design",
    label_ru: "Дизайн",
    icon: "palette",
    count: 4
  },
  {
    key: "SMM",
    label_uz: "SMM",
    label_en: "SMM",
    label_ru: "SMM",
    icon: "megaphone",
    count: 3
  },
  {
    key: "Marketing",
    label_uz: "Marketing",
    label_en: "Marketing",
    label_ru: "Маркетинг",
    icon: "trending-up",
    count: 3
  },
  {
    key: "Sales",
    label_uz: "Savdo",
    label_en: "Sales",
    label_ru: "Продажи",
    icon: "handshake",
    count: 3
  },
  {
    key: "Finance",
    label_uz: "Moliya",
    label_en: "Finance",
    label_ru: "Финансы",
    icon: "landmark",
    count: 2
  },
  {
    key: "Education",
    label_uz: "Ta'lim",
    label_en: "Education",
    label_ru: "Образование",
    icon: "graduation-cap",
    count: 3
  },
  {
    key: "Support",
    label_uz: "Mijozlar bilan ishlash",
    label_en: "Customer Support",
    label_ru: "Поддержка клиентов",
    icon: "headphones",
    count: 3
  }
];
const locations = [
  "Tashkent",
  "Samarkand",
  "Bukhara",
  "Andijan",
  "Namangan",
  "Fergana",
  "Nukus",
  "Remote"
];
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote"
];
const experienceLevels = [
  "No experience",
  "Junior",
  "Middle",
  "Senior"
];
const companies = [
  {
    name: "TechNova Solutions",
    slug: "technova-solutions",
    industry: "Software Development",
    location: "Tashkent",
    size: "120-200 employees",
    website: "https://technova.uz",
    logo: "TN",
    color: "#1D4ED8",
    verified: true,
    about: "TechNova Solutions builds fintech and e-commerce products for Central Asia. We ship software used by millions of users and invest heavily in our engineers' growth, mentorship and modern tooling."
  },
  {
    name: "PixelCraft Studio",
    slug: "pixelcraft-studio",
    industry: "Design & Creative",
    location: "Tashkent",
    size: "25-50 employees",
    website: "https://pixelcraft.uz",
    logo: "PC",
    color: "#0EA5E9",
    verified: true,
    about: "PixelCraft is a design studio working with brands across the region: product design, brand identity and motion. We are a small senior team that cares deeply about craft and detail."
  },
  {
    name: "SilkRoute Logistics",
    slug: "silkroute-logistics",
    industry: "Logistics & Supply chain",
    location: "Samarkand",
    size: "300-500 employees",
    website: "https://silkroute.uz",
    logo: "SR",
    color: "#0369A1",
    verified: true,
    about: "SilkRoute Logistics moves cargo across Central Asia and China. We combine a physical fleet with a modern digital operations platform to give clients transparent delivery."
  },
  {
    name: "UzDigital Marketing",
    slug: "uzdigital-marketing",
    industry: "Marketing & Advertising",
    location: "Tashkent",
    size: "50-100 employees",
    website: "https://uzdigital.uz",
    logo: "UD",
    color: "#2563EB",
    verified: true,
    about: "UzDigital is a performance marketing agency running campaigns for local and international brands. We are data-driven, fast and results-obsessed."
  },
  {
    name: "Amu Finance Group",
    slug: "amu-finance-group",
    industry: "Financial services",
    location: "Tashkent",
    size: "100-250 employees",
    website: "https://amufinance.uz",
    logo: "AF",
    color: "#1E40AF",
    verified: true,
    about: "Amu Finance Group provides accounting, audit and investment advisory services to more than 400 companies in Uzbekistan."
  },
  {
    name: "BrightMind Academy",
    slug: "brightmind-academy",
    industry: "Education & Training",
    location: "Bukhara",
    size: "40-80 employees",
    website: "https://brightmind.uz",
    logo: "BM",
    color: "#0891B2",
    verified: false,
    about: "BrightMind Academy teaches English and IT to 3,000+ students per year across Bukhara and Samarkand with a modern blended-learning approach."
  },
  {
    name: "MedLine Care",
    slug: "medline-care",
    industry: "Healthcare services",
    location: "Andijan",
    size: "80-150 employees",
    website: "https://medline.uz",
    logo: "MC",
    color: "#0284C7",
    verified: false,
    about: "MedLine Care operates a network of clinics and a 24/7 patient support line serving the Fergana valley."
  },
  {
    name: "Nexus Retail Group",
    slug: "nexus-retail-group",
    industry: "Retail & E-commerce",
    location: "Namangan",
    size: "200-400 employees",
    website: "https://nexusretail.uz",
    logo: "NR",
    color: "#155E75",
    verified: true,
    about: "Nexus Retail Group runs a chain of stores and a fast-growing online marketplace with same-day delivery in 6 cities."
  }
];
const jobs = [
  {
    title: "Frontend Developer",
    category: "IT",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 12e6,
    salary_max: 22e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "REST API",
      "Git"
    ],
    description: "We are looking for a Frontend Developer to build fast, accessible interfaces for our fintech products. You will work closely with designers and backend engineers in two-week sprints and own features from design hand-off to production.",
    responsibilities: [
      "Build and maintain React + TypeScript applications",
      "Collaborate with designers to implement pixel-accurate UI",
      "Optimise bundle size and Core Web Vitals",
      "Write unit tests and participate in code reviews"
    ],
    requirements: [
      "2+ years of experience with React",
      "Strong TypeScript and modern CSS knowledge",
      "Experience consuming REST APIs",
      "Understanding of Git workflows"
    ],
    benefits: [
      "Competitive salary reviewed twice a year",
      "Health insurance for you and your family",
      "English and tech courses paid by the company",
      "Hybrid schedule, 2 days remote"
    ],
    days_ago: 1,
    views: 1240,
    applications_count: 37,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Backend Developer (Python)",
    category: "IT",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 15e6,
    salary_max: 28e6,
    employment_type: "Full-time",
    experience_level: "Senior",
    skills: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Redis"
    ],
    description: "Join the platform team that powers payments and analytics for 40+ merchants. You will design services that handle thousands of requests per second and mentor mid-level engineers.",
    responsibilities: [
      "Design and ship new microservices",
      "Optimise database queries and caching layers",
      "Set up CI/CD pipelines and monitoring",
      "Review architecture proposals and mentor the team"
    ],
    requirements: [
      "4+ years with Python in production",
      "Experience with FastAPI/Django and SQLAlchemy",
      "Solid understanding of relational databases",
      "Docker and Linux experience"
    ],
    benefits: [
      "Stock-option programme",
      "Latest MacBook Pro",
      "Conference and certification budget",
      "Flexible working hours"
    ],
    days_ago: 2,
    views: 980,
    applications_count: 24,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "React Developer",
    category: "IT",
    company: "PixelCraft Studio",
    location: "Remote",
    salary_min: 1e7,
    salary_max: 18e6,
    employment_type: "Contract",
    experience_level: "Middle",
    skills: [
      "React",
      "Next.js",
      "Redux",
      "Figma",
      "Jest"
    ],
    description: "PixelCraft is hiring a React Developer for a 6-month contract on an international e-commerce project. Fully remote, with weekly syncs in English.",
    responsibilities: [
      "Develop reusable component libraries",
      "Integrate headless CMS content",
      "Participate in daily stand-ups in English",
      "Deliver features on a two-week cadence"
    ],
    requirements: [
      "3+ years with React",
      "Next.js and SSR experience",
      "Comfortable working in English",
      "Available 30+ hours per week"
    ],
    benefits: [
      "Fully remote contract",
      "Payment in USD",
      "Long-term extension possible",
      "Equipment allowance"
    ],
    days_ago: 3,
    views: 760,
    applications_count: 18,
    is_remote: true,
    currency: "USD",
    salary_period: "month"
  },
  {
    title: "Junior Software Developer",
    category: "IT",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 6e6,
    salary_max: 9e6,
    employment_type: "Full-time",
    experience_level: "Junior",
    skills: [
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
      "SQL"
    ],
    description: "A structured 12-week onboarding programme for junior developers. You will start with internal tools and grow into product work with a dedicated mentor.",
    responsibilities: [
      "Fix bugs and small features under mentorship",
      "Write documentation",
      "Participate in QA of new releases",
      "Grow through our internal academy"
    ],
    requirements: [
      "Solid JavaScript fundamentals",
      "Portfolio or GitHub with pet projects",
      "Willingness to learn 5 days a week in the office",
      "Basic SQL knowledge"
    ],
    benefits: [
      "Mentorship from senior engineers",
      "Free internal courses",
      "Growth plan for 12 months",
      "Team lunches and gym"
    ],
    days_ago: 4,
    views: 1520,
    applications_count: 64,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "QA Engineer",
    category: "IT",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 9e6,
    salary_max: 16e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Manual QA",
      "Postman",
      "SQL",
      "Jira",
      "Automation basics"
    ],
    description: "Own quality for our payments module: test planning, regression, API checks and bug triage in close cooperation with developers.",
    responsibilities: [
      "Create and maintain test plans and cases",
      "Run functional, regression and API testing",
      "Report and verify bugs",
      "Improve QA documentation"
    ],
    requirements: [
      "2+ years in manual QA of web products",
      "Experience with Postman and SQL",
      "Attention to detail",
      "Basic automation knowledge is a plus"
    ],
    benefits: [
      "Health insurance",
      "Clear career ladder to Senior QA / SDET",
      "Paid certifications (ISTQB)",
      "Modern office in Tashkent"
    ],
    days_ago: 5,
    views: 640,
    applications_count: 29,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "DevOps Engineer",
    category: "IT",
    company: "SilkRoute Logistics",
    location: "Tashkent",
    salary_min: 2e7,
    salary_max: 32e6,
    employment_type: "Full-time",
    experience_level: "Senior",
    skills: [
      "Kubernetes",
      "Terraform",
      "AWS",
      "CI/CD",
      "Prometheus"
    ],
    description: "SilkRoute is moving its logistics platform to Kubernetes. You will own infrastructure, observability and release automation for 20+ services.",
    responsibilities: [
      "Maintain Kubernetes clusters on AWS",
      "Automate infrastructure with Terraform",
      "Build release pipelines",
      "Set up alerting and incident response"
    ],
    requirements: [
      "4+ years in DevOps/SRE",
      "Deep Kubernetes and Docker knowledge",
      "IaC experience (Terraform/Ansible)",
      "On-call experience"
    ],
    benefits: [
      "Relocation support within Uzbekistan",
      "Premium insurance",
      "Annual salary review",
      "Paid AWS certifications"
    ],
    days_ago: 6,
    views: 850,
    applications_count: 15,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Python Developer (Data)",
    category: "IT",
    company: "Amu Finance Group",
    location: "Tashkent",
    salary_min: 14e6,
    salary_max: 24e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Python",
      "Pandas",
      "SQL",
      "Airflow",
      "Power BI"
    ],
    description: "Build the data pipelines behind our risk-scoring product. You will work with analysts to turn raw banking data into decisions.",
    responsibilities: [
      "Develop ETL pipelines with Airflow",
      "Clean and model datasets with pandas",
      "Deliver dashboards for credit analysts",
      "Automate recurring reports"
    ],
    requirements: [
      "3+ years of Python",
      "Strong SQL and data modelling skills",
      "Airflow or similar scheduler experience",
      "Finance domain interest"
    ],
    benefits: [
      "Bonus scheme based on results",
      "Training budget",
      "Medical insurance",
      "Modern office near Metro"
    ],
    days_ago: 7,
    views: 520,
    applications_count: 21,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    company: "PixelCraft Studio",
    location: "Tashkent",
    salary_min: 11e6,
    salary_max: 2e7,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Figma",
      "Design systems",
      "Prototyping",
      "User research"
    ],
    description: "Design end-to-end product experiences for clients in fintech, retail and education. You will own discovery, wireframes, high-fidelity UI and design hand-off.",
    responsibilities: [
      "Run discovery workshops with clients",
      "Create wireframes and interactive prototypes",
      "Maintain design systems in Figma",
      "Present work to stakeholders in Uzbek/Russian/English"
    ],
    requirements: [
      "3+ years designing digital products",
      "Strong portfolio with case studies",
      "Figma mastery and component thinking",
      "Basic understanding of frontend constraints"
    ],
    benefits: [
      "Hybrid schedule",
      "Portfolio and conference budget",
      "MacBook Pro + 4K monitor",
      "Creative, low-meeting culture"
    ],
    days_ago: 2,
    views: 910,
    applications_count: 33,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Graphic Designer",
    category: "Design",
    company: "UzDigital Marketing",
    location: "Tashkent",
    salary_min: 7e6,
    salary_max: 12e6,
    employment_type: "Full-time",
    experience_level: "Junior",
    skills: [
      "Photoshop",
      "Illustrator",
      "Social media design",
      "Brand guidelines"
    ],
    description: "Create scroll-stopping visuals for social campaigns of 15+ brands. Fast pace, high volume, strong feedback culture.",
    responsibilities: [
      "Design static and animated creatives for social media",
      "Adapt brand guidelines across formats",
      "Collaborate with SMM managers on concepts",
      "Prepare print-ready files"
    ],
    requirements: [
      "1+ year of graphic design experience",
      "Strong Photoshop and Illustrator skills",
      "Ability to deliver 5+ creatives per day",
      "Portfolio required"
    ],
    benefits: [
      "Performance bonus",
      "Paid courses",
      "Young team",
      "Free lunch on Fridays"
    ],
    days_ago: 3,
    views: 780,
    applications_count: 41,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Motion Designer",
    category: "Design",
    company: "PixelCraft Studio",
    location: "Remote",
    salary_min: 12e6,
    salary_max: 22e6,
    employment_type: "Freelance",
    experience_level: "Middle",
    skills: [
      "After Effects",
      "Premiere Pro",
      "3D basics",
      "Storyboarding"
    ],
    description: "We need a motion designer for brand films and animated explainers. Project-based cooperation with a steady pipeline of work.",
    responsibilities: [
      "Create animated explainers and brand films",
      "Storyboard and propose visual directions",
      "Export optimised assets for social platforms",
      "Iterate quickly with art direction"
    ],
    requirements: [
      "2+ years in motion design",
      "Strong After Effects showreel",
      "Understanding of brand consistency",
      "Ability to work remotely on deadlines"
    ],
    benefits: [
      "Project-based USD payments",
      "Repeat work with leading brands",
      "Creative freedom",
      "Remote-first cooperation"
    ],
    days_ago: 5,
    views: 430,
    applications_count: 12,
    is_remote: true,
    currency: "USD",
    salary_period: "project"
  },
  {
    title: "Product Designer",
    category: "Design",
    company: "Nexus Retail Group",
    location: "Namangan",
    salary_min: 14e6,
    salary_max: 24e6,
    employment_type: "Full-time",
    experience_level: "Senior",
    skills: [
      "Figma",
      "User flows",
      "A/B testing",
      "Analytics"
    ],
    description: "Own the design of our marketplace app used by 400k shoppers. You will work with product managers on discovery, metrics and experiments.",
    responsibilities: [
      "Lead design for the mobile marketplace",
      "Define user flows and information architecture",
      "Run usability tests and A/B experiments",
      "Grow and maintain the design system"
    ],
    requirements: [
      "4+ years of product design experience",
      "Experience with mobile e-commerce",
      "Data-informed decision making",
      "Excellent communication skills"
    ],
    benefits: [
      "Relocation package to Namangan",
      "Stock options",
      "Health insurance",
      "Quarterly team offsite"
    ],
    days_ago: 8,
    views: 560,
    applications_count: 9,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "SMM Manager",
    category: "SMM",
    company: "UzDigital Marketing",
    location: "Tashkent",
    salary_min: 8e6,
    salary_max: 14e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Instagram",
      "Telegram",
      "Content plan",
      "Copywriting",
      "Analytics"
    ],
    description: "Manage social media for 4 clients in retail and HoReCa: strategy, content plan, community management and monthly reporting.",
    responsibilities: [
      "Build monthly content plans",
      "Write captions in Uzbek and Russian",
      "Coordinate designers and video editors",
      "Report on reach, engagement and leads"
    ],
    requirements: [
      "2+ years managing brand accounts",
      "Portfolio of grown accounts",
      "Uzbek and Russian fluency",
      "Understanding of paid promotion"
    ],
    benefits: [
      "Bonus for hitting lead targets",
      "Phone and internet allowance",
      "Flexible start time",
      "Training budget"
    ],
    days_ago: 1,
    views: 1120,
    applications_count: 48,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Content Manager",
    category: "SMM",
    company: "BrightMind Academy",
    location: "Bukhara",
    salary_min: 5e6,
    salary_max: 9e6,
    employment_type: "Part-time",
    experience_level: "Junior",
    skills: [
      "Content writing",
      "CMS",
      "SEO basics",
      "Canva"
    ],
    description: "Publish and maintain learning content on our website and Telegram channel: articles, lesson summaries and student stories.",
    responsibilities: [
      "Publish 12+ pieces of content per month",
      "Maintain the content calendar",
      "Optimise posts for search",
      "Collect student success stories"
    ],
    requirements: [
      "1 year of content experience",
      "Excellent Uzbek and decent English",
      "Basic SEO understanding",
      "Comfortable with CMS tools"
    ],
    benefits: [
      "Part-time 4 hours per day",
      "Free English courses",
      "Friendly team",
      "Remote Fridays"
    ],
    days_ago: 6,
    views: 390,
    applications_count: 26,
    is_remote: true,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Digital Marketing Specialist",
    category: "Marketing",
    company: "Nexus Retail Group",
    location: "Tashkent",
    salary_min: 11e6,
    salary_max: 19e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Google Ads",
      "Meta Ads",
      "GA4",
      "KPI reporting",
      "CRM"
    ],
    description: "Plan and run performance campaigns for our online marketplace across Google, Meta and Telegram Ads with a monthly budget of 250M UZS.",
    responsibilities: [
      "Launch and optimise paid campaigns",
      "Track CAC, ROAS and conversion funnels",
      "Run A/B tests on landing pages",
      "Report weekly to the CMO"
    ],
    requirements: [
      "3+ years in performance marketing",
      "Hands-on experience with large budgets",
      "Strong analytics skills (GA4)",
      "E-commerce background preferred"
    ],
    benefits: [
      "Quarterly performance bonus",
      "Insurance",
      "Modern office",
      "Discounts in our stores"
    ],
    days_ago: 4,
    views: 690,
    applications_count: 22,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "SEO Specialist",
    category: "Marketing",
    company: "UzDigital Marketing",
    location: "Tashkent",
    salary_min: 1e7,
    salary_max: 17e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Technical SEO",
      "Ahrefs",
      "Keyword research",
      "Link building"
    ],
    description: "Grow organic traffic for 8 client websites in three languages. You will own audits, content briefs and technical fixes together with developers.",
    responsibilities: [
      "Run technical SEO audits",
      "Build keyword maps for uz/ru/en",
      "Write content briefs for the copywriting team",
      "Monitor rankings and traffic in Ahrefs"
    ],
    requirements: [
      "2+ years in SEO",
      "Experience with multilingual websites",
      "Ability to explain fixes to developers",
      "Analytical mindset"
    ],
    benefits: [
      "Remote-friendly",
      "Tools budget",
      "Bonus for traffic growth",
      "Paid conferences"
    ],
    days_ago: 9,
    views: 470,
    applications_count: 14,
    is_remote: true,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Copywriter",
    category: "Marketing",
    company: "UzDigital Marketing",
    location: "Remote",
    salary_min: 6e6,
    salary_max: 11e6,
    employment_type: "Freelance",
    experience_level: "Junior",
    skills: [
      "Copywriting",
      "Storytelling",
      "Ad copy",
      "Editing"
    ],
    description: "Write landing pages, ad copy and email sequences for clients in fintech, education and retail.",
    responsibilities: [
      "Write landing page copy based on briefs",
      "Create ad variations for testing",
      "Edit and proofread team output",
      "Meet weekly content deadlines"
    ],
    requirements: [
      "Strong Uzbek writing portfolio",
      "Russian and English at working level",
      "Ability to write in brand tones",
      "Reliable with deadlines"
    ],
    benefits: [
      "Per-project payments",
      "Steady content pipeline",
      "Fully remote",
      "Feedback and mentoring"
    ],
    days_ago: 11,
    views: 520,
    applications_count: 35,
    is_remote: true,
    currency: "UZS",
    salary_period: "project"
  },
  {
    title: "Sales Manager",
    category: "Sales",
    company: "Nexus Retail Group",
    location: "Tashkent",
    salary_min: 12e6,
    salary_max: 3e7,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "B2B sales",
      "Negotiation",
      "CRM",
      "Pipeline management"
    ],
    description: "Own a portfolio of corporate clients and grow wholesale revenue. Strong commission, clear KPI and a real career path.",
    responsibilities: [
      "Grow the existing client portfolio",
      "Negotiate supply contracts",
      "Keep CRM records accurate",
      "Hit monthly revenue targets"
    ],
    requirements: [
      "3+ years in B2B sales",
      "Proven negotiation skills",
      "Uzbek and Russian fluency",
      "Self-driven and target-oriented"
    ],
    benefits: [
      "Uncapped commission (up to 100% of salary)",
      "Company car for client visits",
      "Mobile allowance",
      "Quarterly incentives"
    ],
    days_ago: 3,
    views: 830,
    applications_count: 27,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Sales Representative",
    category: "Sales",
    company: "MedLine Care",
    location: "Andijan",
    salary_min: 7e6,
    salary_max: 15e6,
    employment_type: "Full-time",
    experience_level: "Junior",
    skills: [
      "Direct sales",
      "Customer service",
      "Reporting"
    ],
    description: "Represent MedLine Care services to corporate clients in the Fergana valley: presentations, contracts and after-sales support.",
    responsibilities: [
      "Visit 8-10 potential clients per day",
      "Present service packages",
      "Sign service agreements",
      "Report daily in CRM"
    ],
    requirements: [
      "1+ year in sales or customer service",
      "Confident communication",
      "Driver licence preferred",
      "Uzbek and Russian"
    ],
    benefits: [
      "Base salary + monthly bonus",
      "Fuel compensation",
      "Training programme",
      "Health check-ups"
    ],
    days_ago: 7,
    views: 410,
    applications_count: 19,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Business Development Manager",
    category: "Sales",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 18e6,
    salary_max: 35e6,
    employment_type: "Full-time",
    experience_level: "Senior",
    skills: [
      "Partnerships",
      "Strategy",
      "B2B",
      "Fintech"
    ],
    description: "Open new markets for our fintech platform: partnerships with banks, payment providers and large merchants across the region.",
    responsibilities: [
      "Build a partner pipeline",
      "Negotiate commercial terms",
      "Represent the company at industry events",
      "Work with product on roadmap inputs"
    ],
    requirements: [
      "5+ years in BD or enterprise sales",
      "Network in banking/payments",
      "English upper-intermediate+",
      "Analytical, deal-closing mindset"
    ],
    benefits: [
      "Equity package",
      "Business trips budget",
      "Premium insurance",
      "Direct line to the founders"
    ],
    days_ago: 10,
    views: 620,
    applications_count: 11,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Accountant",
    category: "Finance",
    company: "Amu Finance Group",
    location: "Tashkent",
    salary_min: 9e6,
    salary_max: 16e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "1C",
      "Tax reporting",
      "Payroll",
      "Excel"
    ],
    description: "Full-cycle accounting for a group of client companies: primary documents, payroll, tax reports and audits.",
    responsibilities: [
      "Maintain accounting records in 1C",
      "Prepare monthly and quarterly tax reports",
      "Process payroll for 120 employees",
      "Support external audits"
    ],
    requirements: [
      "3+ years as an accountant",
      "Strong 1C and Excel skills",
      "Knowledge of Uzbek tax legislation",
      "Accuracy and reliability"
    ],
    benefits: [
      "Stable schedule 9-18",
      "Medical insurance",
      "Paid vacation 24 days",
      "Professional certification support"
    ],
    days_ago: 5,
    views: 340,
    applications_count: 16,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Financial Analyst",
    category: "Finance",
    company: "Amu Finance Group",
    location: "Tashkent",
    salary_min: 15e6,
    salary_max: 25e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Financial modelling",
      "Excel",
      "SQL",
      "Valuation"
    ],
    description: "Support investment decisions with models, market research and portfolio reporting for our client funds.",
    responsibilities: [
      "Build financial models and scenarios",
      "Prepare investment memos",
      "Monitor portfolio performance",
      "Automate reporting with SQL"
    ],
    requirements: [
      "2+ years in financial analysis",
      "Advanced Excel modelling",
      "CFA level 1+ is a plus",
      "English upper-intermediate"
    ],
    benefits: [
      "CFA sponsorship",
      "Bonus scheme",
      "Hybrid schedule",
      "Mentorship from partners"
    ],
    days_ago: 12,
    views: 380,
    applications_count: 13,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "English Teacher",
    category: "Education",
    company: "BrightMind Academy",
    location: "Bukhara",
    salary_min: 6e6,
    salary_max: 11e6,
    employment_type: "Full-time",
    experience_level: "Junior",
    skills: [
      "IELTS",
      "Classroom management",
      "Lesson planning"
    ],
    description: "Teach general and IELTS English to groups of 8-12 students in our modern Bukhara campus with an interactive whiteboard in every classroom.",
    responsibilities: [
      "Deliver 20-24 lessons per week",
      "Prepare students for IELTS 6.5+",
      "Track attendance and progress",
      "Participate in weekly methodology meetings"
    ],
    requirements: [
      "CEFR C1 or above",
      "TEFL/CELTA certificate preferred",
      "1+ year teaching experience",
      "Energetic, student-centred approach"
    ],
    benefits: [
      "Methodology training",
      "Free IELTS exam",
      "Paid vacation",
      "Career path to senior teacher"
    ],
    days_ago: 2,
    views: 450,
    applications_count: 31,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Math Teacher",
    category: "Education",
    company: "BrightMind Academy",
    location: "Samarkand",
    salary_min: 6e6,
    salary_max: 1e7,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Mathematics",
      "Lesson planning",
      "Olympiad prep"
    ],
    description: "Prepare 9-11 grade students for university entrance exams and national olympiads.",
    responsibilities: [
      "Teach maths to exam groups",
      "Design test materials",
      "Run monthly mock exams",
      "Coach olympiad candidates"
    ],
    requirements: [
      "Higher education in mathematics",
      "2+ years of teaching experience",
      "Strong results with exam groups",
      "Patient communicator"
    ],
    benefits: [
      "Free courses for your children",
      "Performance bonus",
      "Friendly atmosphere",
      "Modern classrooms"
    ],
    days_ago: 8,
    views: 300,
    applications_count: 17,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "IT Instructor",
    category: "Education",
    company: "BrightMind Academy",
    location: "Bukhara",
    salary_min: 9e6,
    salary_max: 17e6,
    employment_type: "Contract",
    experience_level: "Middle",
    skills: [
      "Python",
      "JavaScript",
      "Teaching",
      "Curriculum design"
    ],
    description: "Teach our full-stack bootcamp: 4 evenings per week, groups of 15 students, project-based curriculum.",
    responsibilities: [
      "Deliver Python and JavaScript lessons",
      "Review student projects",
      "Improve the curriculum",
      "Support students during job search"
    ],
    requirements: [
      "2+ years in web development",
      "Experience teaching or mentoring",
      "Clear communication in Uzbek",
      "Portfolio of shipped projects"
    ],
    benefits: [
      "Competitive contract rate",
      "Curriculum is ready to use",
      "Evening schedule (18:00-21:00)",
      "Become part of a growing academy"
    ],
    days_ago: 13,
    views: 280,
    applications_count: 22,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Customer Support Specialist",
    category: "Support",
    company: "Nexus Retail Group",
    location: "Tashkent",
    salary_min: 6e6,
    salary_max: 1e7,
    employment_type: "Full-time",
    experience_level: "No experience",
    skills: [
      "Communication",
      "CRM",
      "Problem solving",
      "Uzbek/Russian"
    ],
    description: "Be the first friendly voice our shoppers hear. Handle chats and calls about orders, payments and returns.",
    responsibilities: [
      "Answer customer chats and calls",
      "Process returns and complaints",
      "Keep CRM tickets up to date",
      "Escalate complex cases"
    ],
    requirements: [
      "No experience required, full training provided",
      "Clear career path to team lead",
      "Friendly young team",
      "Free lunch in the office"
    ],
    benefits: [
      "Excellent Uzbek and Russian",
      "Basic computer skills",
      "Polite and patient communication",
      "Ready for shift work"
    ],
    days_ago: 1,
    views: 960,
    applications_count: 58,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Call Center Operator",
    category: "Support",
    company: "MedLine Care",
    location: "Andijan",
    salary_min: 5e6,
    salary_max: 85e5,
    employment_type: "Part-time",
    experience_level: "No experience",
    skills: [
      "Phone etiquette",
      "Booking systems",
      "Empathy"
    ],
    description: "Help patients book appointments and answer questions about our clinic services over the phone.",
    responsibilities: [
      "Handle incoming calls",
      "Book and reschedule appointments",
      "Inform patients about services",
      "Log every call in the system"
    ],
    requirements: [
      "Part-time 6 hours per day",
      "Shift bonuses",
      "Supportive mentors",
      "Free annual medical check-up"
    ],
    benefits: [
      "Clear speaking voice",
      "Uzbek and Russian fluency",
      "Basic computer skills",
      "Willingness to work in shifts"
    ],
    days_ago: 4,
    views: 520,
    applications_count: 44,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Office Administrator",
    category: "Operations",
    company: "Amu Finance Group",
    location: "Tashkent",
    salary_min: 6e6,
    salary_max: 95e5,
    employment_type: "Full-time",
    experience_level: "Junior",
    skills: [
      "Office management",
      "MS Office",
      "Documentation",
      "Scheduling"
    ],
    description: "Keep our head office running smoothly: documents, supplies, visitors and the small things that make work pleasant.",
    responsibilities: [
      "Manage incoming and outgoing documentation",
      "Coordinate office supplies and vendors",
      "Greet guests and manage meeting rooms",
      "Support HR with onboarding paperwork"
    ],
    requirements: [
      "Stable schedule 9:00-18:00",
      "Medical insurance",
      "Friendly team culture",
      "Annual performance bonus"
    ],
    benefits: [
      "1+ year in an office role",
      "Organised and proactive",
      "Confident MS Office user",
      "Uzbek and Russian"
    ],
    days_ago: 6,
    views: 410,
    applications_count: 25,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Project Manager",
    category: "Operations",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 16e6,
    salary_max: 28e6,
    employment_type: "Full-time",
    experience_level: "Senior",
    skills: [
      "Agile",
      "Scrum",
      "Jira",
      "Stakeholder management"
    ],
    description: "Lead two product squads delivering our marketplace and payments roadmap. You will own delivery, risks and client communication.",
    responsibilities: [
      "Facilitate sprint planning and reviews",
      "Track scope, risks and dependencies",
      "Report to stakeholders weekly",
      "Continuously improve delivery processes"
    ],
    requirements: [
      "Leadership training budget",
      "Health insurance for the family",
      "Hybrid schedule",
      "Yearly performance bonus"
    ],
    benefits: [
      "4+ years in IT project management",
      "Hands-on Scrum experience",
      "Excellent English",
      "Technical background preferred"
    ],
    days_ago: 9,
    views: 540,
    applications_count: 8,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Logistics Coordinator",
    category: "Logistics",
    company: "SilkRoute Logistics",
    location: "Samarkand",
    salary_min: 8e6,
    salary_max: 13e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Route planning",
      "Customs documents",
      "Excel",
      "Supplier communication"
    ],
    description: "Coordinate cargo movements between Tashkent, Samarkand and the Chinese border, keeping clients informed at every step.",
    responsibilities: [
      "Plan routes and book transport",
      "Prepare customs documentation",
      "Monitor shipments and resolve delays",
      "Report daily to the operations lead"
    ],
    requirements: [
      "Transport compensation",
      "Annual bonus",
      "Paid overtime hours",
      "Growth to senior coordinator"
    ],
    benefits: [
      "2+ years in logistics",
      "Knowledge of customs procedures",
      "Strong Excel skills",
      "English at working level"
    ],
    days_ago: 5,
    views: 350,
    applications_count: 20,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Delivery Coordinator",
    category: "Logistics",
    company: "Nexus Retail Group",
    location: "Namangan",
    salary_min: 6e6,
    salary_max: 1e7,
    employment_type: "Full-time",
    experience_level: "Junior",
    skills: [
      "Dispatching",
      "Excel",
      "Customer service",
      "GPS systems"
    ],
    description: "Coordinate 40+ couriers per shift, optimise delivery routes and keep customers informed about their orders.",
    responsibilities: [
      "Assign orders to couriers",
      "Monitor delivery times",
      "Handle failed deliveries",
      "Report daily KPIs"
    ],
    requirements: [
      "Shift bonuses",
      "Free lunch",
      "Career growth in operations",
      "Modern office in the city centre"
    ],
    benefits: [
      "1+ year in operations or dispatching",
      "Comfortable with software tools",
      "Stress resistant",
      "Driver licence is a plus"
    ],
    days_ago: 10,
    views: 380,
    applications_count: 23,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Warehouse Supervisor",
    category: "Operations",
    company: "SilkRoute Logistics",
    location: "Tashkent",
    salary_min: 9e6,
    salary_max: 14e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Inventory management",
      "Team leadership",
      "WMS",
      "Safety"
    ],
    description: "Supervise a 4,000 m2 warehouse: inbound, picking, packing and inventory accuracy with a team of 25 people.",
    responsibilities: [
      "Plan daily workloads",
      "Keep inventory accuracy above 99%",
      "Enforce safety rules",
      "Report to the operations manager"
    ],
    requirements: [
      "Shift allowance",
      "Medical insurance",
      "Quarterly team bonus",
      "On-site canteen"
    ],
    benefits: [
      "3+ years in warehouse operations",
      "Team leadership experience",
      "WMS knowledge",
      "Ready for an active role"
    ],
    days_ago: 14,
    views: 290,
    applications_count: 15,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Photographer",
    category: "Media",
    company: "PixelCraft Studio",
    location: "Tashkent",
    salary_min: 7e6,
    salary_max: 13e6,
    employment_type: "Freelance",
    experience_level: "Middle",
    skills: [
      "Product photography",
      "Lightroom",
      "Studio lighting",
      "Retouching"
    ],
    description: "Shoot product, food and lifestyle content for our retail and HoReCa clients in our studio and on location.",
    responsibilities: [
      "Plan shoots with art directors",
      "Produce 250+ retouched photos per month",
      "Maintain studio equipment",
      "Deliver within feedback rounds"
    ],
    requirements: [
      "Project-based payments",
      "Studio and lighting equipment provided",
      "Repeat work with leading brands",
      "Creative freedom"
    ],
    benefits: [
      "Strong portfolio of commercial shoots",
      "Own camera body",
      "Confident Lightroom skills",
      "Flexible schedule"
    ],
    days_ago: 7,
    views: 430,
    applications_count: 27,
    is_remote: false,
    currency: "UZS",
    salary_period: "project"
  },
  {
    title: "Video Editor",
    category: "Media",
    company: "UzDigital Marketing",
    location: "Remote",
    salary_min: 8e6,
    salary_max: 15e6,
    employment_type: "Contract",
    experience_level: "Middle",
    skills: [
      "Premiere Pro",
      "DaVinci Resolve",
      "Sound design",
      "Subtitles"
    ],
    description: "Edit 20+ short-form videos per month for TikTok, Reels and YouTube Shorts across six brands.",
    responsibilities: [
      "Edit short-form vertical videos",
      "Add motion titles and subtitles",
      "Follow brand guidelines",
      "Deliver three rounds of revisions"
    ],
    requirements: [
      "Fully remote cooperation",
      "Per-video rates in UZS",
      "Fast-growing content pipeline",
      "Equipment upgrade support"
    ],
    benefits: [
      "2+ years editing social video",
      "Strong storytelling skills",
      "Own workstation",
      "Reliable with deadlines"
    ],
    days_ago: 3,
    views: 640,
    applications_count: 34,
    is_remote: true,
    currency: "UZS",
    salary_period: "project"
  },
  {
    title: "HR Specialist",
    category: "HR",
    company: "MedLine Care",
    location: "Andijan",
    salary_min: 8e6,
    salary_max: 13e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Recruitment",
      "HR documentation",
      "Onboarding",
      "Labour law"
    ],
    description: "Own the employee lifecycle for 140 people: hiring, onboarding, records, evaluation and offboarding.",
    responsibilities: [
      "Run end-to-end recruitment",
      "Prepare HR documentation",
      "Organise onboarding and training",
      "Support managers with performance reviews"
    ],
    requirements: [
      "Insurance for the whole family",
      "Annual training budget",
      "Stable schedule",
      "Supportive HR team"
    ],
    benefits: [
      "2+ years in HR",
      "Knowledge of Uzbek labour legislation",
      "Strong communication skills",
      "High level of confidentiality"
    ],
    days_ago: 11,
    views: 330,
    applications_count: 19,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Recruiter",
    category: "HR",
    company: "TechNova Solutions",
    location: "Tashkent",
    salary_min: 1e7,
    salary_max: 18e6,
    employment_type: "Full-time",
    experience_level: "Middle",
    skills: [
      "Tech recruitment",
      "Sourcing",
      "LinkedIn",
      "Interviewing"
    ],
    description: "Hire 30+ engineers this year. You will own sourcing, screening, scheduling and the whole candidate experience.",
    responsibilities: [
      "Source candidates via LinkedIn and Telegram",
      "Screen and schedule interviews",
      "Maintain the ATS",
      "Improve employer branding"
    ],
    requirements: [
      "Bonus for every successful hire",
      "Hybrid schedule",
      "LinkedIn Recruiter seat",
      "HR education budget"
    ],
    benefits: [
      "2+ years recruiting IT talent",
      "English upper-intermediate",
      "Strong interview skills",
      "Data-driven approach"
    ],
    days_ago: 2,
    views: 480,
    applications_count: 26,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Barista",
    category: "Hospitality",
    company: "Nexus Retail Group",
    location: "Tashkent",
    salary_min: 5e6,
    salary_max: 8e6,
    employment_type: "Part-time",
    experience_level: "No experience",
    skills: [
      "Coffee preparation",
      "Customer service",
      "Cash handling"
    ],
    description: "Serve great coffee with a smile in our flagship store on Amir Temur avenue. Full training provided.",
    responsibilities: [
      "Prepare espresso-based drinks",
      "Take orders and handle payments",
      "Keep the bar clean and stocked",
      "Recommend bakery items"
    ],
    requirements: [
      "Free coffee and pastries during shifts",
      "Flexible shift schedule",
      "Barista certification",
      "Team tips shared daily"
    ],
    benefits: [
      "Friendly and energetic personality",
      "Uzbek and Russian",
      "Ready for morning shifts",
      "Hygiene awareness"
    ],
    days_ago: 1,
    views: 700,
    applications_count: 52,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  },
  {
    title: "Restaurant Manager",
    category: "Hospitality",
    company: "Nexus Retail Group",
    location: "Samarkand",
    salary_min: 12e6,
    salary_max: 2e7,
    employment_type: "Full-time",
    experience_level: "Senior",
    skills: [
      "Team management",
      "P&L",
      "F&B operations",
      "Customer experience"
    ],
    description: "Lead a 45-seat restaurant with 22 staff members: service quality, financial results and team development.",
    responsibilities: [
      "Manage daily operations and staff rota",
      "Control food cost and P&L",
      "Uphold service standards",
      "Recruit and train the team"
    ],
    requirements: [
      "Performance bonus",
      "Meals provided",
      "Medical insurance",
      "Career growth inside our group"
    ],
    benefits: [
      "4+ years in F&B management",
      "P&L responsibility experience",
      "Leadership and coaching skills",
      "HACCP knowledge"
    ],
    days_ago: 12,
    views: 260,
    applications_count: 10,
    is_remote: false,
    currency: "UZS",
    salary_period: "month"
  }
];
const demoSeeker = {
  name: "Aziz Karimov",
  email: "demo@localjob.uz",
  password: "Demo1234!",
  phone: "+998 90 123 45 67",
  location: "Tashkent",
  profile: {
    title: "Frontend Developer (React / TypeScript)",
    bio: "Frontend developer with 3 years of experience building web applications with React and TypeScript. I enjoy turning complex interfaces into simple, fast and accessible products. Currently improving my Node.js skills.",
    category: "IT",
    skills: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "REST API",
      "Git",
      "Figma",
      "Jest"
    ],
    experience: [
      {
        role: "Frontend Developer",
        company: "UzDigital Marketing",
        from: "2023-02",
        to: "present",
        description: "Built landing pages and dashboards for 12 client projects with React and TypeScript. Improved average Lighthouse performance score from 62 to 94."
      },
      {
        role: "Junior Frontend Developer",
        company: "StartUp Lab",
        from: "2022-01",
        to: "2023-01",
        description: "Worked on an internal CRM interface, fixed bugs and wrote first unit tests with Jest."
      }
    ],
    education: [
      {
        degree: "BSc Computer Science",
        school: "Tashkent University of Information Technologies",
        from: "2018",
        to: "2022"
      }
    ],
    languages: [
      "Uzbek (native)",
      "Russian (fluent)",
      "English (B2)"
    ],
    portfolio: "https://aziz.dev",
    github: "https://github.com/azizkarimov",
    linkedin: "https://linkedin.com/in/azizkarimov",
    telegram: "https://t.me/aziz_dev",
    experience_level: "Middle",
    expected_salary: 18e6
  }
};
const demoEmployer = {
  name: "Dilnoza Yusupova",
  email: "employer@localjob.uz",
  password: "Demo1234!",
  phone: "+998 71 200 30 40",
  location: "Tashkent",
  company: "TechNova Solutions"
};
const admin = {
  name: "LocalJob Admin",
  email: "admin@localjob.uz",
  password: "Admin1234!",
  location: "Tashkent"
};
const demoApplications = [
  {
    title: "Frontend Developer",
    coverLetter: "I have 3 years of hands-on React experience and recently led the migration of a legacy dashboard to TypeScript. I would love to bring that experience to TechNova."
  },
  {
    title: "React Developer",
    coverLetter: "Your e-commerce project matches my recent work almost exactly. I am available 35 hours per week and comfortable working in English."
  }
];
const demoSavedTitles = [
  "Backend Developer (Python)",
  "UI/UX Designer",
  "DevOps Engineer",
  "SMM Manager"
];
const demoNotifications = [
  {
    kind: "success",
    title: "Application submitted",
    message: "Your application for Frontend Developer at TechNova Solutions was submitted successfully.",
    link: "/applications",
    daysAgo: 1
  },
  {
    kind: "info",
    title: "Status changed",
    message: "Your application for React Developer was moved to Shortlisted.",
    link: "/applications",
    daysAgo: 3
  },
  {
    kind: "job",
    title: "New jobs matching your profile",
    message: "12 new IT jobs in Tashkent were published this week.",
    link: "/jobs?category=IT",
    daysAgo: 5
  }
];
const seed = {
  categories,
  popularCategories,
  locations,
  employmentTypes,
  experienceLevels,
  companies,
  jobs,
  demoSeeker,
  demoEmployer,
  admin,
  demoApplications,
  demoSavedTitles,
  demoNotifications
};
const EXPERIENCE_ORDER = {
  "No experience": 0,
  Junior: 1,
  Middle: 2,
  Senior: 3
};
const asSet = (values) => new Set((values || []).map((value) => String(value).trim().toLowerCase()).filter(Boolean));
function matchScore(job, profile, user) {
  var _a;
  let score = 30;
  const jobSkills = asSet(job.skills);
  const profileSkills = asSet(profile == null ? void 0 : profile.skills);
  if (jobSkills.size && profileSkills.size) {
    let overlap = 0;
    jobSkills.forEach((skill) => {
      if (profileSkills.has(skill)) overlap += 1;
    });
    score += overlap / jobSkills.size * 30;
  } else if (profileSkills.size) {
    score += 6;
  }
  if ((profile == null ? void 0 : profile.category) && profile.category.toLowerCase() === job.category.toLowerCase()) score += 18;
  const jobLocation = (job.location || "").toLowerCase();
  const profileLocation = ((profile == null ? void 0 : profile.location) || (user == null ? void 0 : user.location) || "").toLowerCase();
  if (jobLocation.includes("remote")) score += 8;
  else if (profileLocation && (profileLocation.includes(jobLocation) || jobLocation.includes(profileLocation))) score += 14;
  const jobExp = EXPERIENCE_ORDER[job.experienceLevel];
  const profileExp = (profile == null ? void 0 : profile.experienceLevel) ? EXPERIENCE_ORDER[profile.experienceLevel] : void 0;
  if (jobExp !== void 0 && profileExp !== void 0) {
    const delta = Math.abs(jobExp - profileExp);
    score += delta === 0 ? 12 : delta === 1 ? 8 : 2;
  }
  if (profile == null ? void 0 : profile.title) {
    const words = profile.title.toLowerCase().replace(/[()]/g, " ").split(/\s+/).filter((word) => word.length > 3);
    const title = job.title.toLowerCase();
    if (words.some((word) => title.includes(word))) score += 12;
  }
  if (profile == null ? void 0 : profile.bio) score += 3;
  if ((_a = profile == null ? void 0 : profile.experience) == null ? void 0 : _a.length) score += 4;
  return Math.max(12, Math.min(99, Math.round(score)));
}
function profileCompletion(user, profile) {
  var _a, _b, _c;
  if (!user) return 0;
  if (!profile) return user.name ? 15 : 5;
  const checks = [
    !!user.name,
    !!profile.title,
    !!profile.bio && profile.bio.length > 30,
    !!(profile.location || user.location),
    !!profile.phone,
    ((_a = profile.skills) == null ? void 0 : _a.length) > 0,
    ((_b = profile.experience) == null ? void 0 : _b.length) > 0,
    ((_c = profile.education) == null ? void 0 : _c.length) > 0,
    !!(profile.portfolio || profile.github || profile.linkedin || profile.telegram),
    !!profile.category
  ];
  return Math.round(checks.filter(Boolean).length / checks.length * 100);
}
const DEFAULT_PREFS$1 = {
  emailApplications: true,
  emailJobs: true,
  telegramNotifications: true,
  profileVisible: true,
  showSalary: true
};
function hash(value) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return `lj${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`;
}
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
const daysAgo = (days) => new Date(Date.now() - days * 864e5).toISOString();
function salaryLabel(job) {
  const currency = job.currency || "UZS";
  const fmt = (value) => {
    if (!value) return "";
    if (currency === "UZS") {
      if (value >= 1e6) return `${(value / 1e6).toFixed(value % 1e6 === 0 ? 0 : 1)}M`;
      return `${Math.round(value / 1e3)}k`;
    }
    return value >= 1e3 ? `$${(value / 1e3).toFixed(value % 1e3 === 0 ? 0 : 1)}k` : `$${value}`;
  };
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)} ${currency}/${job.salaryPeriod}`;
  const one = job.salaryMin || job.salaryMax;
  return one ? `${fmt(one)} ${currency}/${job.salaryPeriod}` : "Negotiable";
}
function buildSeedDb() {
  const companies2 = seed.companies.map((company, index) => ({
    id: index + 1,
    name: company.name,
    slug: company.slug,
    industry: company.industry,
    location: company.location,
    size: company.size,
    website: company.website,
    about: company.about,
    logo: company.logo,
    color: company.color,
    verified: company.verified,
    ownerId: null,
    createdAt: daysAgo(120 - index)
  }));
  new Map(companies2.map((company) => [company.slug, company.id]));
  const companyByName = new Map(companies2.map((company) => [company.name, company]));
  const jobs2 = seed.jobs.map((job, index) => {
    const company = companyByName.get(job.company);
    const currency = job.currency || "UZS";
    const period = job.salary_period || "month";
    const item = {
      id: index + 1,
      title: job.title,
      category: job.category,
      location: job.location,
      isRemote: Boolean(job.is_remote || job.location === "Remote"),
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      currency,
      salaryPeriod: period,
      salaryLabel: salaryLabel({ salaryMin: job.salary_min, salaryMax: job.salary_max, currency, salaryPeriod: period }),
      employmentType: job.employment_type,
      experienceLevel: job.experience_level,
      skills: job.skills,
      status: "active",
      views: job.views,
      applicationsCount: job.applications_count,
      companyId: company ? company.id : null,
      postedById: null,
      createdAt: daysAgo(job.days_ago),
      company: company ?? null,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      excerpt: `${job.description.slice(0, 180)}${job.description.length > 180 ? "…" : ""}`
    };
    return item;
  });
  const users = [];
  const profiles = {};
  const pushUser = (data, profile) => {
    const id = users.length + 1;
    users.push({
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone ?? null,
      location: data.location ?? null,
      avatar: null,
      telegramId: null,
      telegramUsername: null,
      language: "uz",
      theme: "dark",
      isActive: true,
      createdAt: daysAgo(45 - id),
      passwordHash: hash(data.password)
    });
    profiles[id] = {
      userId: id,
      skills: (profile == null ? void 0 : profile.skills) ?? [],
      experience: (profile == null ? void 0 : profile.experience) ?? [],
      education: (profile == null ? void 0 : profile.education) ?? [],
      languages: (profile == null ? void 0 : profile.languages) ?? [],
      title: (profile == null ? void 0 : profile.title) ?? null,
      bio: (profile == null ? void 0 : profile.bio) ?? null,
      location: (profile == null ? void 0 : profile.location) ?? data.location ?? null,
      phone: (profile == null ? void 0 : profile.phone) ?? data.phone ?? null,
      category: (profile == null ? void 0 : profile.category) ?? null,
      portfolio: (profile == null ? void 0 : profile.portfolio) ?? null,
      github: (profile == null ? void 0 : profile.github) ?? null,
      linkedin: (profile == null ? void 0 : profile.linkedin) ?? null,
      telegram: (profile == null ? void 0 : profile.telegram) ?? null,
      expectedSalary: (profile == null ? void 0 : profile.expectedSalary) ?? null,
      experienceLevel: (profile == null ? void 0 : profile.experienceLevel) ?? null,
      views: 42,
      updatedAt: nowIso()
    };
    return id;
  };
  const seekerId = pushUser(
    {
      name: seed.demoSeeker.name,
      email: seed.demoSeeker.email,
      password: seed.demoSeeker.password,
      role: "job_seeker",
      phone: seed.demoSeeker.phone,
      location: seed.demoSeeker.location
    },
    {
      title: seed.demoSeeker.profile.title,
      bio: seed.demoSeeker.profile.bio,
      category: seed.demoSeeker.profile.category,
      skills: seed.demoSeeker.profile.skills,
      experience: seed.demoSeeker.profile.experience,
      education: seed.demoSeeker.profile.education,
      languages: seed.demoSeeker.profile.languages,
      portfolio: seed.demoSeeker.profile.portfolio,
      github: seed.demoSeeker.profile.github,
      linkedin: seed.demoSeeker.profile.linkedin,
      telegram: seed.demoSeeker.profile.telegram,
      expectedSalary: seed.demoSeeker.profile.expected_salary,
      experienceLevel: seed.demoSeeker.profile.experience_level
    }
  );
  const employerId = pushUser({
    name: seed.demoEmployer.name,
    email: seed.demoEmployer.email,
    password: seed.demoEmployer.password,
    role: "employer",
    phone: seed.demoEmployer.phone,
    location: seed.demoEmployer.location
  });
  const adminId = pushUser({
    name: seed.admin.name,
    email: seed.admin.email,
    password: seed.admin.password,
    role: "admin",
    location: seed.admin.location
  });
  const technova = companies2.find((company) => company.name === seed.demoEmployer.company);
  if (technova) technova.ownerId = employerId;
  const pixelcraft = companies2.find((company) => company.name === "PixelCraft Studio");
  if (pixelcraft) pixelcraft.ownerId = null;
  jobs2.forEach((job) => {
    if (technova && job.companyId === technova.id) job.postedById = employerId;
  });
  const applications = [];
  let applicationId = 0;
  const byTitle = (title) => jobs2.find((job) => job.title === title);
  seed.demoApplications.forEach((entry, index) => {
    const job = byTitle(entry.title);
    if (!job) return;
    applicationId += 1;
    applications.push({
      id: applicationId,
      jobId: job.id,
      applicantId: seekerId,
      employerId: job.postedById ?? null,
      status: index === 0 ? "submitted" : "shortlisted",
      fullName: seed.demoSeeker.name,
      email: seed.demoSeeker.email,
      phone: seed.demoSeeker.phone,
      coverLetter: entry.coverLetter,
      portfolioUrl: seed.demoSeeker.profile.portfolio,
      resumeName: "Aziz_Karimov_CV.pdf",
      matchScore: index === 0 ? 92 : 85,
      createdAt: daysAgo(index * 3 + 1),
      updatedAt: daysAgo(index * 3 + 1)
    });
  });
  const saved = [];
  seed.demoSavedTitles.forEach((title, index) => {
    const job = byTitle(title);
    if (!job) return;
    saved.push({ id: index + 1, jobId: job.id, createdAt: daysAgo(index + 1), job });
  });
  const notifications = seed.demoNotifications.map((note, index) => ({
    id: index + 1,
    kind: note.kind,
    title: note.title,
    message: note.message,
    link: note.link,
    isRead: false,
    createdAt: daysAgo(note.daysAgo)
  }));
  const audit = [
    { id: 1, actor: "system", action: "seed", detail: `${jobs2.length} jobs · ${companies2.length} companies`, createdAt: nowIso() }
  ];
  return {
    users,
    companies: companies2,
    jobs: jobs2,
    applications,
    saved,
    profiles,
    notifications,
    audit,
    preferences: { [seekerId]: { ...DEFAULT_PREFS$1 }, [employerId]: { ...DEFAULT_PREFS$1 }, [adminId]: { ...DEFAULT_PREFS$1 } },
    counters: {
      userId: users.length,
      jobId: jobs2.length,
      applicationId,
      savedId: saved.length,
      notificationId: notifications.length,
      auditId: audit.length,
      companyId: companies2.length
    }
  };
}
class LocalBackend {
  constructor() {
    __publicField(this, "db");
    this.db = storage.get(KEYS.localDb, null) || buildSeedDb();
    storage.set(KEYS.localDb, this.db);
  }
  persist() {
    storage.set(KEYS.localDb, this.db);
  }
  next(name) {
    this.db.counters[name] = (this.db.counters[name] || 0) + 1;
    return this.db.counters[name];
  }
  currentUser() {
    const token = storage.raw(KEYS.token, "");
    if (!token.startsWith("local-")) return null;
    const id = Number(token.replace("local-", ""));
    return this.db.users.find((user) => user.id === id) || null;
  }
  requireUser() {
    const user = this.currentUser();
    if (!user) throw new ApiError(401, "not_authenticated");
    return user;
  }
  publicUser(user) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
  jobWithRelations(job, userId) {
    const company = job.companyId ? this.db.companies.find((c) => c.id === job.companyId) ?? null : null;
    const profile = userId ? this.db.profiles[userId] : void 0;
    const user = userId ? this.db.users.find((u) => u.id === userId) : void 0;
    return {
      ...job,
      company,
      excerpt: job.excerpt || `${(job.description || "").slice(0, 180)}${(job.description || "").length > 180 ? "…" : ""}`,
      matchScore: userId ? matchScore(job, profile, user) : null,
      isSaved: userId ? this.isSaved(job.id, userId) : false,
      hasApplied: userId ? this.db.applications.some((row) => row.jobId === job.id && row.applicantId === userId) : false,
      canApply: !!userId && !this.db.applications.some((row) => row.jobId === job.id && row.applicantId === userId) && job.status === "active"
    };
  }
  isSaved(jobId, userId) {
    return this.db.saved.some((row) => row.userId === userId && row.jobId === jobId);
  }
  applicationView(application) {
    const job = this.db.jobs.find((item) => item.id === application.jobId);
    const applicant = this.db.users.find((user) => user.id === application.applicantId);
    return {
      ...application,
      job: job ? this.jobWithRelations(job, application.applicantId) : null,
      applicant: applicant ? this.publicUser(applicant) : null,
      applicantProfile: this.db.profiles[application.applicantId] || null
    };
  }
  notify(userId, title, message, kind = "info", link) {
    const id = this.next("notificationId");
    this.db.notifications.unshift({
      id,
      userId,
      title,
      message,
      kind,
      link: link ?? null,
      isRead: false,
      createdAt: nowIso()
    });
  }
  log(action, actor, detail) {
    const id = this.next("auditId");
    this.db.audit.unshift({ id, actor, action, detail: detail ?? null, createdAt: nowIso() });
    this.db.audit = this.db.audit.slice(0, 120);
  }
  session(user, remember = true) {
    const token = `local-${user.id}`;
    storage.setRaw(KEYS.token, token);
    const profile = this.db.profiles[user.id] || null;
    const company = this.db.companies.find((item) => item.ownerId === user.id) || null;
    const payload = {
      token,
      user: this.publicUser(user),
      profile,
      profileCompletion: profileCompletion(user, profile),
      company,
      isAdmin: user.role === "admin",
      role: user.role
    };
    if (!remember) storage.set(KEYS.session, { expires: Date.now() + 864e5 });
    return payload;
  }
  // ── meta ────────────────────────────────────────────────────────────
  async health() {
    return { status: "offline", database: "localStorage", bot_enabled: false };
  }
  async meta() {
    return {
      app: {
        name: "LocalJob",
        tagline: {
          uz: "Ish toping. Xodim toping. Mahalliy darajada o'sing.",
          en: "Find work. Find talent. Grow locally.",
          ru: "Найдите работу. Найдите таланты. Растите локально."
        },
        version: "1.0.0-offline",
        botUsername: "LocalJobUzBot",
        webAppUrl: typeof window === "undefined" ? "" : window.location.origin
      },
      categories: seed.categories,
      popularCategories: seed.popularCategories,
      locations: seed.locations,
      employmentTypes: seed.employmentTypes,
      experienceLevels: seed.experienceLevels,
      currencies: ["UZS", "USD", "EUR"],
      salaryPeriods: ["month", "year", "hour", "project"],
      accountTypes: ["job_seeker", "employer"],
      applicationStatuses: ["submitted", "review", "shortlisted", "interview", "rejected", "hired"],
      jobStatuses: ["active", "paused", "closed"]
    };
  }
  // ── auth ────────────────────────────────────────────────────────────
  async register(payload) {
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");
    const role = payload.role || "job_seeker";
    if (!email.includes("@")) throw new ApiError(422, "invalid_email");
    if (password.length < 8) throw new ApiError(422, "password_too_short");
    if (this.db.users.some((user2) => user2.email.toLowerCase() === email)) {
      throw new ApiError(409, "email_already_registered");
    }
    const id = this.next("userId");
    const user = {
      id,
      name: String(payload.name || "").trim() || "LocalJob user",
      email,
      role,
      phone: payload.phone || null,
      location: payload.location || null,
      avatar: null,
      telegramId: null,
      telegramUsername: null,
      language: payload.language || "uz",
      theme: "dark",
      isActive: true,
      createdAt: nowIso(),
      passwordHash: hash(password)
    };
    this.db.users.push(user);
    this.db.profiles[id] = {
      userId: id,
      skills: [],
      experience: [],
      education: [],
      languages: [],
      location: user.location,
      phone: user.phone,
      updatedAt: nowIso()
    };
    this.db.preferences[id] = { ...DEFAULT_PREFS$1 };
    this.notify(id, "LocalJob'ga xush kelibsiz!", "Profilingizni to‘ldiring va mos ishlarni ko‘ring.", "success", "/dashboard");
    this.log("register", email, `role=${role}`);
    this.persist();
    return this.session(user);
  }
  async login(payload) {
    const user = this.db.users.find((item) => item.email.toLowerCase() === payload.email.trim().toLowerCase());
    if (!user || user.passwordHash !== hash(payload.password)) throw new ApiError(401, "invalid_credentials");
    if (user.isActive === false) throw new ApiError(403, "account_disabled");
    this.log("login", user.email);
    this.persist();
    return this.session(user, payload.remember ?? true);
  }
  async demoLogin(kind) {
    const email = kind === "seeker" ? seed.demoSeeker.email : seed.demoEmployer.email;
    const user = this.db.users.find((item) => item.email === email);
    if (!user) throw new ApiError(404, "demo_account_missing");
    return this.session(user);
  }
  async telegram(initData, startParam) {
    let telegramUser = null;
    try {
      const params = new URLSearchParams(initData);
      const raw = params.get("user");
      telegramUser = raw ? JSON.parse(decodeURIComponent(raw)) : null;
    } catch {
      telegramUser = null;
    }
    if (!telegramUser) throw new ApiError(401, "invalid_telegram_data");
    let user = this.db.users.find((item) => item.telegramId === telegramUser.id);
    let created = false;
    if (!user) {
      const id = this.next("userId");
      user = {
        id,
        name: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ") || "Telegram user",
        email: `tg${telegramUser.id}@localjob.uz`,
        role: startParam === "employer" ? "employer" : "job_seeker",
        phone: null,
        location: null,
        avatar: null,
        telegramId: telegramUser.id,
        telegramUsername: telegramUser.username || null,
        language: "uz",
        theme: "dark",
        isActive: true,
        createdAt: nowIso(),
        passwordHash: hash(`tg-${telegramUser.id}`)
      };
      this.db.users.push(user);
      this.db.profiles[id] = { userId: id, skills: [], experience: [], education: [], languages: [], updatedAt: nowIso() };
      created = true;
    }
    this.persist();
    return { ...this.session(user), created };
  }
  async me() {
    const user = this.requireUser();
    const profile = this.db.profiles[user.id] || null;
    return {
      user: this.publicUser(user),
      profile,
      profileCompletion: profileCompletion(user, profile),
      company: this.db.companies.find((item) => item.ownerId === user.id) || null,
      isAdmin: user.role === "admin",
      role: user.role
    };
  }
  async logout() {
    storage.remove(KEYS.token);
    return { ok: true };
  }
  async changePassword(payload) {
    const user = this.requireUser();
    if (user.passwordHash !== hash(payload.current_password)) throw new ApiError(400, "current_password_incorrect");
    user.passwordHash = hash(payload.new_password);
    this.notify(user.id, "Password changed", "Your password was updated successfully.", "success", "/settings");
    this.persist();
    return { ok: true };
  }
  async deleteAccount(password) {
    const user = this.requireUser();
    if (user.passwordHash !== hash(password)) throw new ApiError(400, "current_password_incorrect");
    this.db.users = this.db.users.filter((item) => item.id !== user.id);
    this.db.applications = this.db.applications.filter((item) => item.applicantId !== user.id);
    this.db.saved = this.db.saved.filter((row) => row.userId !== user.id);
    delete this.db.profiles[user.id];
    storage.remove(KEYS.token);
    this.log("account_delete", user.email);
    this.persist();
    return { ok: true };
  }
  // ── settings ────────────────────────────────────────────────────────
  async updateSettings(payload) {
    const user = this.requireUser();
    Object.assign(user, payload);
    this.persist();
    return { user: this.publicUser(user) };
  }
  async preferences() {
    const user = this.requireUser();
    return { preferences: { ...DEFAULT_PREFS$1, ...this.db.preferences[user.id] || {} } };
  }
  async updatePreferences(payload) {
    const user = this.requireUser();
    this.db.preferences[user.id] = { ...DEFAULT_PREFS$1, ...this.db.preferences[user.id] || {}, ...payload };
    this.persist();
    return { preferences: this.db.preferences[user.id] };
  }
  // ── notifications ───────────────────────────────────────────────────
  async notifications() {
    const user = this.requireUser();
    const items = this.db.notifications.filter((note) => note.userId === user.id || !note.userId && user.role === "job_seeker");
    return { items, unread: items.filter((note) => !note.isRead).length };
  }
  async markNotifications(payload) {
    const { items } = await this.notifications();
    items.forEach((note) => {
      var _a;
      if (payload.all || ((_a = payload.ids) == null ? void 0 : _a.includes(note.id))) note.isRead = true;
    });
    this.persist();
    return { ok: true, unread: items.filter((note) => !note.isRead).length };
  }
  async clearNotifications() {
    const { items } = await this.notifications();
    const ids = new Set(items.map((note) => note.id));
    this.db.notifications = this.db.notifications.filter((note) => !ids.has(note.id));
    this.persist();
    return { ok: true };
  }
  // ── jobs ────────────────────────────────────────────────────────────
  async jobsList(params) {
    const user = this.currentUser();
    const search = String(params.search || "").toLowerCase();
    const location = String(params.location || "").toLowerCase();
    const categories2 = String(params.category || "").split(",").filter(Boolean);
    const employmentTypes2 = String(params.employmentType || "").split(",").filter(Boolean);
    const experienceLevels2 = String(params.experienceLevel || "").split(",").filter(Boolean);
    const salaryMin = params.salaryMin ? Number(params.salaryMin) : null;
    const salaryMax = params.salaryMax ? Number(params.salaryMax) : null;
    const companyId = params.companyId ? Number(params.companyId) : null;
    const postedBy = params.postedBy ? Number(params.postedBy) : null;
    const remote = Boolean(params.remote);
    const statuses = String(params.statuses || "active").split(",").filter(Boolean);
    const sort = String(params.sort || "recent");
    const pageSize = Number(params.pageSize || 10);
    let page = Number(params.page || 1);
    let items = this.db.jobs.filter((job) => statuses.includes(job.status || "active"));
    if (search) {
      items = items.filter((job) => {
        const company = this.db.companies.find((c) => c.id === job.companyId);
        return job.title.toLowerCase().includes(search) || (job.description || "").toLowerCase().includes(search) || job.category.toLowerCase().includes(search) || job.location.toLowerCase().includes(search) || job.skills.join(" ").toLowerCase().includes(search) || ((company == null ? void 0 : company.name) || "").toLowerCase().includes(search);
      });
    }
    if (location && !["any", "all"].includes(location)) {
      items = items.filter((job) => job.location.toLowerCase().includes(location) || job.isRemote);
    }
    if (categories2.length) items = items.filter((job) => categories2.includes(job.category));
    if (employmentTypes2.length) items = items.filter((job) => employmentTypes2.includes(String(job.employmentType)));
    if (experienceLevels2.length) items = items.filter((job) => experienceLevels2.includes(String(job.experienceLevel)));
    if (salaryMin !== null) items = items.filter((job) => (job.salaryMax ?? 0) >= salaryMin);
    if (salaryMax !== null) items = items.filter((job) => (job.salaryMin ?? 0) <= salaryMax);
    if (companyId) items = items.filter((job) => job.companyId === companyId);
    if (postedBy) items = items.filter((job) => job.postedById === postedBy);
    if (remote) items = items.filter((job) => job.isRemote);
    if (sort === "salary") items = [...items].sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
    else if (sort === "relevant") {
      items = [...items].sort(
        (a, b) => matchScore(b, user ? this.db.profiles[user.id] : null, user) - matchScore(a, user ? this.db.profiles[user.id] : null, user)
      );
    } else items = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.min(page, pages);
    const paged = items.slice((page - 1) * pageSize, page * pageSize);
    const facet = (values) => {
      const counts = /* @__PURE__ */ new Map();
      values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
      return [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
    };
    const active = this.db.jobs.filter((job) => job.status === "active");
    return {
      items: paged.map((job) => this.jobWithRelations(job, user == null ? void 0 : user.id)),
      total,
      page,
      pageSize,
      pages,
      facets: {
        categories: facet(active.map((job) => job.category)),
        locations: facet(active.map((job) => job.location)),
        employmentTypes: facet(active.map((job) => String(job.employmentType))),
        experienceLevels: facet(active.map((job) => String(job.experienceLevel)))
      }
    };
  }
  async jobDetail(id) {
    const job = this.db.jobs.find((item) => item.id === id);
    if (!job) throw new ApiError(404, "job_not_found");
    const user = this.currentUser();
    const company = job.companyId ? this.db.companies.find((c) => c.id === job.companyId) : null;
    return {
      ...this.jobWithRelations(job, user == null ? void 0 : user.id),
      company: company ? { ...company, openJobsCount: this.db.jobs.filter((item) => item.companyId === company.id && item.status === "active").length } : null
    };
  }
  async recommendedJobs(limit = 6) {
    const user = this.currentUser();
    const profile = user ? this.db.profiles[user.id] : null;
    const items = [...this.db.jobs.filter((job) => job.status === "active")].sort((a, b) => matchScore(b, profile, user) - matchScore(a, profile, user)).slice(0, limit).map((job) => this.jobWithRelations(job, user == null ? void 0 : user.id));
    return { items };
  }
  async myJobs(status) {
    const user = this.requireUser();
    const jobs2 = this.db.jobs.filter((job) => job.postedById === user.id && (!status || job.status === status)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map((job) => ({
      ...this.jobWithRelations(job, user.id),
      applicationsCount: this.db.applications.filter((row) => row.jobId === job.id).length
    }));
    return { items: jobs2, total: jobs2.length };
  }
  async createJob(payload) {
    const user = this.requireUser();
    if (!["employer", "admin"].includes(user.role)) throw new ApiError(403, "employer_only");
    let company = this.db.companies.find((item) => item.ownerId === user.id);
    if (!company && payload.companyName) {
      company = {
        id: this.next("companyId"),
        name: String(payload.companyName),
        slug: String(payload.companyName).toLowerCase().replace(/\s+/g, "-"),
        location: String(payload.location || ""),
        logo: String(payload.companyName).slice(0, 2).toUpperCase(),
        color: "#1D4ED8",
        ownerId: user.id,
        createdAt: nowIso()
      };
      this.db.companies.push(company);
    }
    const currency = String(payload.currency || "UZS");
    const period = String(payload.salaryPeriod || "month");
    const job = {
      id: this.next("jobId"),
      title: String(payload.title || ""),
      category: String(payload.category || "IT"),
      location: String(payload.location || "Tashkent"),
      isRemote: Boolean(payload.isRemote) || String(payload.location) === "Remote",
      salaryMin: payload.salaryMin ? Number(payload.salaryMin) : null,
      salaryMax: payload.salaryMax ? Number(payload.salaryMax) : null,
      currency,
      salaryPeriod: period,
      salaryLabel: salaryLabel({
        salaryMin: payload.salaryMin ? Number(payload.salaryMin) : null,
        salaryMax: payload.salaryMax ? Number(payload.salaryMax) : null,
        currency,
        salaryPeriod: period
      }),
      employmentType: String(payload.employmentType || "Full-time"),
      experienceLevel: String(payload.experienceLevel || "Middle"),
      skills: payload.skills || [],
      status: "active",
      views: 0,
      applicationsCount: 0,
      companyId: company ? company.id : null,
      postedById: user.id,
      createdAt: nowIso(),
      description: String(payload.description || ""),
      responsibilities: payload.responsibilities || [],
      requirements: payload.requirements || [],
      benefits: payload.benefits || []
    };
    this.db.jobs.unshift(job);
    this.notify(user.id, "Job published", `“${job.title}” is now live on LocalJob.`, "success", "/employer/jobs");
    this.log("job_create", user.email, job.title);
    this.persist();
    return this.jobWithRelations(job, user.id);
  }
  async updateJob(id, payload) {
    const user = this.requireUser();
    const job = this.db.jobs.find((item) => item.id === id);
    if (!job) throw new ApiError(404, "job_not_found");
    if (user.role !== "admin" && job.postedById !== user.id) throw new ApiError(403, "not_your_job");
    Object.assign(job, payload);
    if (job.salaryMin || job.salaryMax) {
      job.salaryLabel = salaryLabel(job);
    }
    this.log("job_update", user.email, job.title);
    this.persist();
    return this.jobWithRelations(job, user.id);
  }
  async deleteJob(id) {
    const user = this.requireUser();
    const job = this.db.jobs.find((item) => item.id === id);
    if (!job) throw new ApiError(404, "job_not_found");
    if (user.role !== "admin" && job.postedById !== user.id) throw new ApiError(403, "not_your_job");
    this.db.jobs = this.db.jobs.filter((item) => item.id !== id);
    this.db.applications = this.db.applications.filter((row) => row.jobId !== id);
    this.log("job_delete", user.email, job.title);
    this.persist();
    return { ok: true };
  }
  async registerView(id) {
    const job = this.db.jobs.find((item) => item.id === id);
    if (job) {
      job.views += 1;
      this.persist();
    }
    return { ok: true, views: (job == null ? void 0 : job.views) ?? 0 };
  }
  // ── saved ───────────────────────────────────────────────────────────
  async savedList() {
    const user = this.requireUser();
    const rows = this.db.saved.filter((row) => row.userId === user.id || user.role === "job_seeker");
    const items = rows.map((row) => {
      const job = this.db.jobs.find((item) => item.id === row.jobId);
      return job ? { ...row, job: this.jobWithRelations(job, user.id) } : null;
    }).filter(Boolean);
    return { items, total: items.length };
  }
  async saveJob(jobId) {
    const user = this.requireUser();
    if (!this.db.saved.some((row) => row.jobId === jobId && row.userId === user.id)) {
      const id = this.next("savedId");
      this.db.saved.unshift({
        id,
        jobId,
        userId: user.id,
        createdAt: nowIso(),
        job: this.db.jobs.find((job) => job.id === jobId)
      });
    }
    this.persist();
    return { ok: true, saved: true };
  }
  async unsaveJob(jobId) {
    const user = this.requireUser();
    this.db.saved = this.db.saved.filter((row) => !(row.jobId === jobId && row.userId === user.id));
    this.persist();
    return { ok: true, saved: false };
  }
  // ── applications ────────────────────────────────────────────────────
  async createApplication(payload) {
    const user = this.requireUser();
    if (user.role === "employer") throw new ApiError(403, "employer_cannot_apply");
    const jobId = Number(payload.jobId);
    const job = this.db.jobs.find((item) => item.id === jobId);
    if (!job) throw new ApiError(404, "job_not_found");
    if (this.db.applications.some((row) => row.jobId === jobId && row.applicantId === user.id)) {
      throw new ApiError(409, "already_applied");
    }
    const application = {
      id: this.next("applicationId"),
      jobId,
      applicantId: user.id,
      employerId: job.postedById ?? null,
      status: "submitted",
      fullName: String(payload.fullName || user.name),
      email: String(payload.email || user.email),
      phone: payload.phone || null,
      coverLetter: payload.coverLetter || null,
      portfolioUrl: payload.portfolioUrl || null,
      resumeName: payload.resumeName || null,
      matchScore: matchScore(job, this.db.profiles[user.id], user),
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    this.db.applications.unshift(application);
    job.applicationsCount += 1;
    this.notify(user.id, "Application submitted", `Your application for ${job.title} was sent successfully.`, "success", "/applications");
    this.log("application_create", user.email, job.title);
    this.persist();
    return this.applicationView(application);
  }
  async applications(status) {
    const user = this.requireUser();
    const items = this.db.applications.filter((row) => row.applicantId === user.id && (!status || status.split(",").includes(row.status))).map((row) => this.applicationView(row)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const counts = {};
    items.forEach((row) => {
      counts[row.status] = (counts[row.status] || 0) + 1;
    });
    return { items, total: items.length, counts };
  }
  async applicationDetail(id) {
    const row = this.db.applications.find((item) => item.id === id);
    if (!row) throw new ApiError(404, "application_not_found");
    return this.applicationView(row);
  }
  async updateApplicationStatus(id, status) {
    const user = this.requireUser();
    const row = this.db.applications.find((item) => item.id === id);
    if (!row) throw new ApiError(404, "application_not_found");
    const job = this.db.jobs.find((item) => item.id === row.jobId);
    if (user.role !== "admin" && (job == null ? void 0 : job.postedById) !== user.id) throw new ApiError(403, "forbidden");
    row.status = status;
    row.updatedAt = nowIso();
    this.notify(row.applicantId, "Application status changed", `Your application for ${(job == null ? void 0 : job.title) ?? "the job"} is now: ${status}.`, "status", "/applications");
    this.log("application_status", user.email, `${id}:${status}`);
    this.persist();
    return this.applicationView(row);
  }
  async employerApplications(params) {
    const user = this.requireUser();
    const jobs2 = this.db.jobs.filter((job) => job.postedById === user.id);
    let rows = this.db.applications.filter((row) => jobs2.some((job) => job.id === row.jobId));
    if (params.jobId) rows = rows.filter((row) => row.jobId === params.jobId);
    if (params.status) rows = rows.filter((row) => params.status.split(",").includes(row.status));
    const counts = {};
    rows.forEach((row) => {
      counts[row.status] = (counts[row.status] || 0) + 1;
    });
    return {
      items: rows.map((row) => this.applicationView(row)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
      total: rows.length,
      counts,
      jobs: jobs2.map((job) => ({ id: job.id, title: job.title }))
    };
  }
  async candidate(userId) {
    const candidate = this.db.users.find((user) => user.id === userId);
    if (!candidate) throw new ApiError(404, "candidate_not_found");
    const profile = this.db.profiles[userId] || null;
    return {
      user: this.publicUser(candidate),
      profile,
      completion: profileCompletion(candidate, profile),
      hiredCount: this.db.applications.filter((row) => row.applicantId === userId && row.status === "hired").length
    };
  }
  // ── dashboards ──────────────────────────────────────────────────────
  async seekerDashboard() {
    const user = this.requireUser();
    const profile = this.db.profiles[user.id] || null;
    const applications = this.db.applications.filter((row) => row.applicantId === user.id).map((row) => this.applicationView(row)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const savedRows = this.db.saved.filter((row) => row.userId === user.id).map((row) => ({ ...row, job: this.jobWithRelations(this.db.jobs.find((job) => job.id === row.jobId), user.id) }));
    const recommended = [...this.db.jobs.filter((job) => job.status === "active")].sort((a, b) => matchScore(b, profile, user) - matchScore(a, profile, user)).slice(0, 6).map((job) => this.jobWithRelations(job, user.id));
    const statusCounts = {};
    applications.forEach((row) => {
      statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
    });
    return {
      stats: {
        applications: applications.length,
        savedJobs: savedRows.length,
        profileViews: ((profile == null ? void 0 : profile.views) || 0) + 42,
        profileCompletion: profileCompletion(user, profile),
        interviews: statusCounts.interview || 0,
        shortlisted: statusCounts.shortlisted || 0
      },
      statusCounts,
      recommended,
      recentApplications: applications.slice(0, 4),
      savedJobs: savedRows.slice(0, 4),
      profile
    };
  }
  async employerDashboard() {
    const user = this.requireUser();
    const jobs2 = this.db.jobs.filter((job) => job.postedById === user.id).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const applications = this.db.applications.filter((row) => jobs2.some((job) => job.id === row.jobId)).map((row) => this.applicationView(row)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const weekAgo = Date.now() - 7 * 864e5;
    return {
      stats: {
        activeJobs: jobs2.filter((job) => job.status === "active").length,
        totalJobs: jobs2.length,
        applications: applications.length,
        views: jobs2.reduce((sum, job) => sum + (job.views || 0), 0),
        hired: applications.filter((row) => row.status === "hired").length,
        newThisWeek: applications.filter((row) => +new Date(row.createdAt) >= weekAgo).length,
        pausedJobs: jobs2.filter((job) => job.status === "paused").length
      },
      jobs: jobs2.map((job) => ({
        ...this.jobWithRelations(job, user.id),
        applicationsCount: this.db.applications.filter((row) => row.jobId === job.id).length
      })),
      recentApplications: applications.slice(0, 6),
      company: this.db.companies.find((item) => item.ownerId === user.id) || null,
      me: this.publicUser(user)
    };
  }
  // ── profile ─────────────────────────────────────────────────────────
  async getProfile() {
    const user = this.requireUser();
    const profile = this.db.profiles[user.id] || {
      userId: user.id,
      skills: [],
      experience: [],
      education: [],
      languages: []
    };
    this.db.profiles[user.id] = profile;
    this.persist();
    return { user: this.publicUser(user), profile, completion: profileCompletion(user, profile) };
  }
  async updateProfile(payload) {
    const user = this.requireUser();
    const profile = this.db.profiles[user.id] || { userId: user.id, skills: [], experience: [], education: [], languages: [] };
    const map = {
      title: "title",
      bio: "bio",
      location: "location",
      phone: "phone",
      category: "category",
      skills: "skills",
      experience: "experience",
      education: "education",
      languages: "languages",
      portfolio: "portfolio",
      linkedin: "linkedin",
      github: "github",
      telegram: "telegram",
      website: "website",
      expected_salary: "expectedSalary",
      expectedSalary: "expectedSalary",
      experience_level: "experienceLevel",
      experienceLevel: "experienceLevel"
    };
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "name" && typeof value === "string") user.name = value;
      const target = map[key];
      if (target) profile[target] = value;
    });
    profile.updatedAt = nowIso();
    this.db.profiles[user.id] = profile;
    this.persist();
    return { user: this.publicUser(user), profile, completion: profileCompletion(user, profile) };
  }
  // ── companies ───────────────────────────────────────────────────────
  async companiesList(params = {}) {
    const search = (params.search || "").toLowerCase();
    const items = this.db.companies.filter(
      (company) => !search || company.name.toLowerCase().includes(search) || (company.industry || "").toLowerCase().includes(search)
    ).map((company) => ({
      ...company,
      openJobsCount: this.db.jobs.filter((job) => job.companyId === company.id && job.status === "active").length
    })).sort((a, b) => (b.openJobsCount || 0) - (a.openJobsCount || 0) || a.name.localeCompare(b.name));
    return { items, total: items.length };
  }
  async companyDetail(id) {
    const company = this.db.companies.find((item) => item.id === id);
    if (!company) throw new ApiError(404, "company_not_found");
    const user = this.currentUser();
    const jobs2 = this.db.jobs.filter((job) => job.companyId === id && job.status === "active").map((job) => this.jobWithRelations(job, user == null ? void 0 : user.id));
    return { ...company, openJobsCount: jobs2.length, jobs: jobs2 };
  }
  async myCompany() {
    const user = this.requireUser();
    return { company: this.db.companies.find((item) => item.ownerId === user.id) || null };
  }
  async saveCompany(payload) {
    const user = this.requireUser();
    let company = this.db.companies.find((item) => item.ownerId === user.id);
    if (!company) {
      company = {
        id: this.next("companyId"),
        name: String(payload.name || ""),
        slug: String(payload.name || "").toLowerCase().replace(/\s+/g, "-"),
        ownerId: user.id,
        createdAt: nowIso()
      };
      this.db.companies.push(company);
    }
    Object.assign(company, {
      name: payload.name || company.name,
      industry: payload.industry ?? company.industry,
      location: payload.location ?? company.location,
      size: payload.size ?? company.size,
      website: payload.website ?? company.website,
      about: payload.about ?? company.about,
      logo: payload.logo ?? company.logo
    });
    this.persist();
    return { company };
  }
  // ── admin ───────────────────────────────────────────────────────────
  async adminStats() {
    const users = this.db.users;
    const jobs2 = this.db.jobs;
    const applications = this.db.applications;
    const weekAgo = Date.now() - 7 * 864e5;
    const statusCounts = {};
    applications.forEach((row) => {
      statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
    });
    const series = Array.from({ length: 14 }).map((_, index) => {
      const day = new Date(Date.now() - (13 - index) * 864e5);
      const key = day.toISOString().slice(0, 10);
      return {
        date: key,
        users: users.filter((user) => (user.createdAt || "").slice(0, 10) === key).length,
        jobs: jobs2.filter((job) => (job.createdAt || "").slice(0, 10) === key).length,
        applications: applications.filter((row) => (row.createdAt || "").slice(0, 10) === key).length
      };
    });
    return {
      users: {
        total: users.length,
        seekers: users.filter((user) => user.role === "job_seeker").length,
        employers: users.filter((user) => user.role === "employer").length,
        telegram: users.filter((user) => user.telegramId).length,
        newThisWeek: users.filter((user) => +new Date(user.createdAt) >= weekAgo).length
      },
      jobs: {
        total: jobs2.length,
        active: jobs2.filter((job) => job.status === "active").length,
        paused: jobs2.filter((job) => job.status === "paused").length,
        closed: jobs2.filter((job) => job.status === "closed").length
      },
      companies: this.db.companies.length,
      views: jobs2.reduce((sum, job) => sum + (job.views || 0), 0),
      applications: {
        total: applications.length,
        statusCounts,
        newThisWeek: applications.filter((row) => +new Date(row.createdAt) >= weekAgo).length
      },
      series,
      topJobs: [...jobs2].sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0)).slice(0, 6).map((job) => {
        var _a;
        return {
          id: job.id,
          title: job.title,
          company: ((_a = this.db.companies.find((c) => c.id === job.companyId)) == null ? void 0 : _a.name) ?? null,
          applications: this.db.applications.filter((row) => row.jobId === job.id).length,
          views: job.views,
          status: job.status
        };
      }),
      system: { database: "localStorage", bot: { running: false, username: null, lastError: null }, adminTelegramId: null }
    };
  }
  async adminUsers(params) {
    const search = (params.search || "").toLowerCase();
    const pageSize = params.pageSize || 20;
    let rows = this.db.users.filter(
      (user) => (!search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)) && (!params.role || user.role === params.role)
    );
    const total = rows.length;
    const page = Math.min(params.page || 1, Math.max(1, Math.ceil(total / pageSize)));
    rows = rows.slice((page - 1) * pageSize, page * pageSize);
    return {
      items: rows.map((user) => ({
        ...this.publicUser(user),
        applications: this.db.applications.filter((row) => row.applicantId === user.id).length,
        jobs: this.db.jobs.filter((job) => job.postedById === user.id).length
      })),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / pageSize))
    };
  }
  async adminUpdateUser(id, payload) {
    const user = this.db.users.find((item) => item.id === id);
    if (!user) throw new ApiError(404, "user_not_found");
    if (payload.role) user.role = payload.role;
    if (payload.isActive !== void 0) user.isActive = payload.isActive;
    this.persist();
    return { user: this.publicUser(user) };
  }
  async adminDeleteUser(id) {
    this.db.users = this.db.users.filter((user) => user.id !== id);
    this.persist();
    return { ok: true };
  }
  async adminJobs(params) {
    const search = (params.search || "").toLowerCase();
    const pageSize = params.pageSize || 20;
    let rows = this.db.jobs.filter(
      (job) => (!search || job.title.toLowerCase().includes(search)) && (!params.status || job.status === params.status)
    );
    const total = rows.length;
    const page = Math.min(params.page || 1, Math.max(1, Math.ceil(total / pageSize)));
    rows = rows.slice((page - 1) * pageSize, page * pageSize);
    return {
      items: rows.map((job) => ({
        ...this.jobWithRelations(job),
        applicationsCount: this.db.applications.filter((row) => row.jobId === job.id).length
      })),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / pageSize))
    };
  }
  async adminUpdateJob(id, payload) {
    const job = this.db.jobs.find((item) => item.id === id);
    if (!job) throw new ApiError(404, "job_not_found");
    if (payload.status) job.status = payload.status;
    this.persist();
    return this.jobWithRelations(job);
  }
  async adminDeleteJob(id) {
    this.db.jobs = this.db.jobs.filter((job) => job.id !== id);
    this.persist();
    return { ok: true };
  }
  async adminApplications(params) {
    const pageSize = params.pageSize || 20;
    let rows = this.db.applications.filter((row) => !params.status || row.status === params.status);
    const total = rows.length;
    const page = Math.min(params.page || 1, Math.max(1, Math.ceil(total / pageSize)));
    rows = rows.slice((page - 1) * pageSize, page * pageSize);
    return {
      items: rows.map((row) => this.applicationView(row)),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / pageSize))
    };
  }
  async adminBroadcast(payload) {
    const audience = this.db.users.filter(
      (user) => user.isActive !== false && (payload.audience === "all" || payload.audience === "job_seekers" && user.role === "job_seeker" || payload.audience === "employers" && user.role === "employer")
    );
    audience.forEach((user) => this.notify(user.id, "LocalJob announcement", payload.message, "info", "/dashboard"));
    this.log("admin_broadcast", "admin", payload.message.slice(0, 80));
    this.persist();
    return { ok: true, notified: audience.length, telegram: { sent: 0, failed: 0 } };
  }
  async adminActivity(limit = 30) {
    return { items: this.db.audit.slice(0, limit) };
  }
  async exportCsv(type) {
    const lines = [];
    if (type === "users") {
      lines.push("id,name,email,role,location,created_at");
      this.db.users.forEach(
        (user) => lines.push([user.id, user.name, user.email, user.role, user.location || "", user.createdAt].join(","))
      );
    } else if (type === "applications") {
      lines.push("id,job,applicant,status,match,created_at");
      this.db.applications.forEach((row) => {
        const job = this.db.jobs.find((item) => item.id === row.jobId);
        const applicant = this.db.users.find((item) => item.id === row.applicantId);
        lines.push([row.id, (job == null ? void 0 : job.title) || "", (applicant == null ? void 0 : applicant.name) || row.fullName, row.status, row.matchScore, row.createdAt].join(","));
      });
    } else {
      lines.push("id,title,category,location,employment_type,status,views,applications");
      this.db.jobs.forEach(
        (job) => lines.push(
          [
            job.id,
            `"${job.title}"`,
            job.category,
            job.location,
            job.employmentType,
            job.status,
            job.views,
            this.db.applications.filter((row) => row.jobId === job.id).length
          ].join(",")
        )
      );
    }
    return new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  }
  /** Clears the local database (used by "reset demo data"). */
  reset() {
    this.db = buildSeedDb();
    this.persist();
  }
}
const localBackend = new LocalBackend();
let mode = "unknown";
const listeners$1 = /* @__PURE__ */ new Set();
function getMode() {
  return mode;
}
function onModeChange(listener) {
  listeners$1.add(listener);
  return () => listeners$1.delete(listener);
}
function setMode(next) {
  if (mode === next) return;
  mode = next;
  listeners$1.forEach((listener) => listener(next));
}
async function withFallback(online, offline) {
  if (mode === "offline") return offline();
  try {
    const result = await online();
    if (mode === "unknown") setMode("online");
    return result;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 0 || error.status === 502 || error.status === 404)) {
      setMode("offline");
      return offline();
    }
    throw error;
  }
}
async function detectMode() {
  try {
    await api.health();
    setMode("online");
  } catch {
    setMode("offline");
  }
  return mode;
}
const backend = {
  mode: getMode,
  health: () => withFallback(api.health, () => localBackend.health()),
  meta: () => withFallback(api.meta, () => localBackend.meta()),
  register: (payload) => withFallback(
    () => api.auth.register(payload),
    () => localBackend.register(payload)
  ),
  login: (payload) => withFallback(
    () => api.auth.login(payload),
    () => localBackend.login(payload)
  ),
  demoLogin: (kind) => withFallback(
    () => api.auth.demo(kind),
    () => localBackend.demoLogin(kind)
  ),
  telegramLogin: (initData, startParam) => withFallback(
    () => api.auth.telegram(initData, startParam),
    () => localBackend.telegram(initData, startParam)
  ),
  me: () => withFallback(api.auth.me, () => localBackend.me()),
  logout: () => withFallback(api.auth.logout, () => localBackend.logout()),
  changePassword: (payload) => withFallback(
    () => api.auth.changePassword(payload),
    () => localBackend.changePassword(payload)
  ),
  deleteAccount: (password) => withFallback(
    () => api.auth.deleteAccount(password),
    () => localBackend.deleteAccount(password)
  ),
  updateSettings: (payload) => withFallback(
    () => api.settings.update(payload),
    () => localBackend.updateSettings(payload)
  ),
  preferences: () => withFallback(api.settings.preferences, () => localBackend.preferences()),
  updatePreferences: (payload) => withFallback(
    () => api.settings.updatePreferences(payload),
    () => localBackend.updatePreferences(payload)
  ),
  notifications: () => withFallback(api.notifications.list, () => localBackend.notifications()),
  markNotifications: (payload) => withFallback(
    () => api.notifications.markRead(payload),
    () => localBackend.markNotifications(payload)
  ),
  clearNotifications: () => withFallback(api.notifications.clear, () => localBackend.clearNotifications()),
  jobs: (params) => withFallback(
    () => api.jobs.list(params),
    () => localBackend.jobsList(params)
  ),
  job: (id) => withFallback(
    () => api.jobs.detail(id),
    () => localBackend.jobDetail(id)
  ),
  recommendedJobs: (limit = 6) => withFallback(
    () => api.jobs.recommended(limit),
    () => localBackend.recommendedJobs(limit)
  ),
  myJobs: (status) => withFallback(
    () => api.jobs.mine(status),
    () => localBackend.myJobs(status)
  ),
  createJob: (payload) => withFallback(
    () => api.jobs.create(payload),
    () => localBackend.createJob(payload)
  ),
  updateJob: (id, payload) => withFallback(
    () => api.jobs.update(id, payload),
    () => localBackend.updateJob(id, payload)
  ),
  deleteJob: (id) => withFallback(
    () => api.jobs.remove(id),
    () => localBackend.deleteJob(id)
  ),
  registerJobView: (id) => withFallback(
    () => api.jobs.view(id),
    () => localBackend.registerView(id)
  ),
  savedJobs: () => withFallback(api.saved.list, () => localBackend.savedList()),
  saveJob: (jobId) => withFallback(
    () => api.saved.save(jobId),
    () => localBackend.saveJob(jobId)
  ),
  unsaveJob: (jobId) => withFallback(
    () => api.saved.remove(jobId),
    () => localBackend.unsaveJob(jobId)
  ),
  apply: (payload) => withFallback(
    () => api.applications.create(payload),
    () => localBackend.createApplication(payload)
  ),
  applications: (status) => withFallback(
    () => api.applications.mine(status),
    () => localBackend.applications(status)
  ),
  application: (id) => withFallback(
    () => api.applications.detail(id),
    () => localBackend.applicationDetail(id)
  ),
  updateApplicationStatus: (id, status) => withFallback(
    () => api.applications.updateStatus(id, status),
    () => localBackend.updateApplicationStatus(id, status)
  ),
  employerApplications: (params) => withFallback(
    () => api.applications.employerList(params),
    () => localBackend.employerApplications(params)
  ),
  candidate: (userId) => withFallback(
    () => api.applications.candidate(userId),
    () => localBackend.candidate(userId)
  ),
  seekerDashboard: () => withFallback(api.dashboard.seeker, () => localBackend.seekerDashboard()),
  employerDashboard: () => withFallback(api.dashboard.employer, () => localBackend.employerDashboard()),
  profile: () => withFallback(api.profile.get, () => localBackend.getProfile()),
  updateProfile: (payload) => withFallback(
    () => api.profile.update(payload),
    () => localBackend.updateProfile(payload)
  ),
  companies: (params = {}) => withFallback(
    () => api.companies.list(params),
    () => localBackend.companiesList(params)
  ),
  company: (id) => withFallback(
    () => api.companies.detail(id),
    () => localBackend.companyDetail(id)
  ),
  myCompany: () => withFallback(api.companies.mine, () => localBackend.myCompany()),
  saveCompany: (payload) => withFallback(
    () => api.companies.save(payload),
    () => localBackend.saveCompany(payload)
  ),
  adminStats: () => withFallback(api.admin.stats, () => localBackend.adminStats()),
  adminUsers: (params) => withFallback(
    () => api.admin.users(params),
    () => localBackend.adminUsers(params)
  ),
  adminUpdateUser: (id, payload) => withFallback(
    () => api.admin.updateUser(id, payload),
    () => localBackend.adminUpdateUser(id, payload)
  ),
  adminDeleteUser: (id) => withFallback(
    () => api.admin.deleteUser(id),
    () => localBackend.adminDeleteUser(id)
  ),
  adminJobs: (params) => withFallback(
    () => api.admin.jobs(params),
    () => localBackend.adminJobs(params)
  ),
  adminUpdateJob: (id, payload) => withFallback(
    () => api.admin.updateJob(id, payload),
    () => localBackend.adminUpdateJob(id, payload)
  ),
  adminDeleteJob: (id) => withFallback(
    () => api.admin.deleteJob(id),
    () => localBackend.adminDeleteJob(id)
  ),
  adminApplications: (params) => withFallback(
    () => api.admin.applications(params),
    () => localBackend.adminApplications(params)
  ),
  adminBroadcast: (payload) => withFallback(
    () => api.admin.broadcast(payload),
    () => localBackend.adminBroadcast(payload)
  ),
  adminActivity: (limit = 30) => withFallback(
    () => api.admin.activity(limit),
    () => localBackend.adminActivity(limit)
  ),
  exportCsv: async (type) => {
    if (mode === "offline") return localBackend.exportCsv(type);
    try {
      const response = await fetch(api.admin.exportUrl(type), {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new ApiError(response.status, "export_failed");
      return await response.blob();
    } catch {
      return localBackend.exportCsv(type);
    }
  }
};
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode2, setModeState] = useState(getMode());
  const applySession = useCallback((payload) => {
    setToken(payload.token);
    setUser(payload.user);
    setProfile(payload.profile);
    setCompany(payload.company);
    setIsAdmin(Boolean(payload.isAdmin || payload.user.role === "admin"));
    setCompletion(payload.profileCompletion ?? 0);
  }, []);
  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const payload = await backend.me();
      setUser(payload.user);
      setProfile(payload.profile);
      setCompany(payload.company);
      setIsAdmin(Boolean(payload.isAdmin || payload.user.role === "admin"));
      setCompletion(payload.profileCompletion ?? 0);
    } catch {
      clearToken();
      setUser(null);
      setProfile(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = onModeChange(setModeState);
    let cancelled = false;
    const boot = async () => {
      var _a, _b, _c, _d;
      await detectMode();
      if (cancelled) return;
      const telegram = (_a = window.Telegram) == null ? void 0 : _a.WebApp;
      (_b = telegram == null ? void 0 : telegram.ready) == null ? void 0 : _b.call(telegram);
      (_c = telegram == null ? void 0 : telegram.expand) == null ? void 0 : _c.call(telegram);
      if (!getToken() && (telegram == null ? void 0 : telegram.initData)) {
        try {
          const session = await backend.telegramLogin(telegram.initData, (_d = telegram.initDataUnsafe) == null ? void 0 : _d.start_param);
          applySession(session);
        } catch {
        }
      }
      await refresh();
    };
    void boot();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [refresh, applySession]);
  const login = useCallback(
    async (email, password, remember = true) => {
      const session = await backend.login({ email, password, remember });
      applySession(session);
      storage.set(KEYS.session, { email, remember, at: Date.now() });
      return session;
    },
    [applySession]
  );
  const register = useCallback(
    async (payload) => {
      const session = await backend.register(payload);
      applySession(session);
      return session;
    },
    [applySession]
  );
  const demoLogin = useCallback(
    async (kind) => {
      const session = await backend.demoLogin(kind);
      applySession(session);
      return session;
    },
    [applySession]
  );
  const telegramLogin = useCallback(
    async (initData, startParam) => {
      const session = await backend.telegramLogin(initData, startParam);
      applySession(session);
      return session;
    },
    [applySession]
  );
  const logout = useCallback(async () => {
    try {
      await backend.logout();
    } catch {
    }
    clearToken();
    setUser(null);
    setProfile(null);
    setCompany(null);
    setIsAdmin(false);
    setCompletion(0);
  }, []);
  const value = useMemo(
    () => ({
      user,
      profile,
      company,
      isAdmin,
      completion,
      loading,
      mode: mode2,
      login,
      register,
      demoLogin,
      telegramLogin,
      logout,
      refresh,
      setUser,
      setProfileState: setProfile,
      setCompany
    }),
    [user, profile, company, isAdmin, completion, loading, mode2, login, register, demoLogin, telegramLogin, logout, refresh]
  );
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿", short: "UZ" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "ru", label: "Русский", flag: "🇷🇺", short: "RU" }
];
const dict = {
  // ── Brand & navigation ────────────────────────────────────────────────
  "brand.tagline": {
    uz: "Ish toping. Xodim toping. Mahalliy darajada o'sing.",
    en: "Find work. Find talent. Grow locally.",
    ru: "Найдите работу. Найдите таланты. Растите локально."
  },
  "nav.jobs": { uz: "Ishlar", en: "Jobs", ru: "Вакансии" },
  "nav.companies": { uz: "Kompaniyalar", en: "Companies", ru: "Компании" },
  "nav.employers": { uz: "Ish beruvchilar uchun", en: "For Employers", ru: "Работодателям" },
  "nav.howItWorks": { uz: "Qanday ishlaydi", en: "How it works", ru: "Как это работает" },
  "nav.signIn": { uz: "Kirish", en: "Sign in", ru: "Войти" },
  "nav.signOut": { uz: "Chiqish", en: "Sign out", ru: "Выйти" },
  "nav.createAccount": { uz: "Ro'yxatdan o'tish", en: "Create account", ru: "Регистрация" },
  "nav.dashboard": { uz: "Boshqaruv paneli", en: "Dashboard", ru: "Панель" },
  "nav.applications": { uz: "Arizalar", en: "Applications", ru: "Отклики" },
  "nav.saved": { uz: "Saqlangan", en: "Saved", ru: "Сохранённые" },
  "nav.profile": { uz: "Profil", en: "Profile", ru: "Профиль" },
  "nav.settings": { uz: "Sozlamalar", en: "Settings", ru: "Настройки" },
  "nav.postJob": { uz: "Ish e'lon qilish", en: "Post a job", ru: "Разместить вакансию" },
  "nav.myJobs": { uz: "Ishlarim", en: "My jobs", ru: "Мои вакансии" },
  "nav.candidates": { uz: "Nomzodlar", en: "Candidates", ru: "Кандидаты" },
  "nav.company": { uz: "Kompaniya", en: "Company", ru: "Компания" },
  "nav.admin": { uz: "Admin panel", en: "Admin panel", ru: "Админ-панель" },
  "nav.menu": { uz: "Menyu", en: "Menu", ru: "Меню" },
  "nav.home": { uz: "Bosh sahifa", en: "Home", ru: "Главная" },
  "nav.notifications": { uz: "Bildirishnomalar", en: "Notifications", ru: "Уведомления" },
  "nav.language": { uz: "Til", en: "Language", ru: "Язык" },
  "nav.theme": { uz: "Mavzu", en: "Theme", ru: "Тема" },
  "nav.lightTheme": { uz: "Kunduzgi", en: "Light", ru: "Светлая" },
  "nav.darkTheme": { uz: "Tungi", en: "Dark", ru: "Тёмная" },
  // ── Landing ───────────────────────────────────────────────────────────
  "hero.badge": { uz: "500+ mahalliy ish beruvchi", en: "500+ verified local employers", ru: "500+ проверенных работодателей" },
  "hero.title": { uz: "Keyingi imkoniyatingizni toping.", en: "Find your next opportunity.", ru: "Найдите свою следующую возможность." },
  "hero.subtitle": {
    uz: "Atrofingizdagi kompaniyalar va insonlardan mahalliy ishlar, frilans loyihalar va masofaviy imkoniyatlarni toping.",
    en: "Discover local jobs, freelance projects and remote opportunities from companies and people around you.",
    ru: "Находите локальные вакансии, фриланс-проекты и удалённые возможности рядом с вами."
  },
  "hero.searchPlaceholder": { uz: "Nima qidiryapsiz?", en: "What are you looking for?", ru: "Что вы ищете?" },
  "hero.searchHint": { uz: "IT, SMM, Dizayner…", en: "IT, SMM, Designer…", ru: "IT, SMM, Дизайнер…" },
  "hero.locationPlaceholder": { uz: "Shahar yoki hudud", en: "Location", ru: "Локация" },
  "hero.locationHint": { uz: "Toshkent", en: "Tashkent", ru: "Ташкент" },
  "hero.search": { uz: "Ish qidirish", en: "Search Jobs", ru: "Найти работу" },
  "hero.stat.jobs": { uz: "E'lonlar", en: "Open jobs", ru: "Вакансий" },
  "hero.stat.companies": { uz: "Kompaniyalar", en: "Companies", ru: "Компаний" },
  "hero.stat.candidates": { uz: "Nomzodlar", en: "Candidates", ru: "Кандидатов" },
  "hero.stat.hires": { uz: "Ishga qabul", en: "Hires", ru: "Наймов" },
  "popular.title": { uz: "Mashhur yo‘nalishlar", en: "Popular categories", ru: "Популярные категории" },
  "popular.subtitle": { uz: "Sohangizni tanlang va mos ishlarni ko'ring.", en: "Pick your field and explore matching jobs.", ru: "Выберите сферу и смотрите подходящие вакансии." },
  "featured.title": { uz: "Tanlangan ishlar", en: "Featured jobs", ru: "Избранные вакансии" },
  "featured.subtitle": { uz: "Hozir eng ko'p ko'rilayotgan e'lonlar.", en: "Most viewed openings right now.", ru: "Самые просматриваемые вакансии сейчас." },
  "featured.viewAll": { uz: "Barcha ishlarni ko'rish", en: "Browse all jobs", ru: "Смотреть все вакансии" },
  "how.title": { uz: "LocalJob qanday ishlaydi", en: "How LocalJob works", ru: "Как работает LocalJob" },
  "how.subtitle": { uz: "To'rt qadamda ish toping.", en: "Four simple steps to your next role.", ru: "Четыре простых шага к новой работе." },
  "how.step1.title": { uz: "Profil yarating", en: "Create your profile", ru: "Создайте профиль" },
  "how.step1.text": { uz: "Ko'nikma, tajriba va ta'limni qo'shing — 2 daqiqada tayyor.", en: "Add your skills, experience and education in two minutes.", ru: "Добавьте навыки, опыт и образование за две минуты." },
  "how.step2.title": { uz: "Mos ishni toping", en: "Find the right job", ru: "Найдите подходящую работу" },
  "how.step2.text": { uz: "Filtrlar, tavsiyalar va moslik foizi bilan qidiring.", en: "Search with filters, recommendations and match scores.", ru: "Ищите с фильтрами, рекомендациями и процентом совпадения." },
  "how.step3.title": { uz: "Ariza yuboring", en: "Apply", ru: "Откликнитесь" },
  "how.step3.text": { uz: "Bir klikda ariza, CV va portfolio bilan.", en: "One-click applications with CV and portfolio.", ru: "Отклик в один клик с резюме и портфолио." },
  "how.step4.title": { uz: "Ishga joylashing", en: "Get hired", ru: "Получите работу" },
  "how.step4.text": { uz: "Holatni kuzatib boring: saralash, suhbat, ish.", en: "Track every stage: shortlist, interview, offer.", ru: "Отслеживайте этапы: шортлист, интервью, оффер." },
  "cta.title": { uz: "Iste’dodli xodimlar kerakmi?", en: "Need talented people?", ru: "Нужны талантливые сотрудники?" },
  "cta.text": {
    uz: "Bir daqiqada e'lon joylashtiring va nomzodlarni qabul qilishni boshlang.",
    en: "Publish a job in a minute and start receiving candidates today.",
    ru: "Опубликуйте вакансию за минуту и начните получать кандидатов."
  },
  "cta.postJob": { uz: "Ish e'lon qilish", en: "Post a job", ru: "Разместить вакансию" },
  "cta.learnMore": { uz: "Batafsil ma'lumot", en: "Learn more", ru: "Подробнее" },
  // ── Footer ────────────────────────────────────────────────────────────
  "footer.product": { uz: "Mahsulot", en: "Product", ru: "Продукт" },
  "footer.company": { uz: "Kompaniya", en: "Company", ru: "Компания" },
  "footer.legal": { uz: "Huquqiy", en: "Legal", ru: "Правовое" },
  "footer.about": { uz: "Biz haqimizda", en: "About", ru: "О нас" },
  "footer.contact": { uz: "Aloqa", en: "Contact", ru: "Контакты" },
  "footer.privacy": { uz: "Maxfiylik siyosati", en: "Privacy", ru: "Конфиденциальность" },
  "footer.terms": { uz: "Foydalanish shartlari", en: "Terms", ru: "Условия" },
  "footer.help": { uz: "Yordam markazi", en: "Help center", ru: "Центр помощи" },
  "footer.rights": { uz: "Barcha huquqlar himoyalangan.", en: "All rights reserved.", ru: "Все права защищены." },
  "footer.botText": { uz: "Telegram bot orqali ham ishlaydi", en: "Also available as a Telegram bot", ru: "Также доступно в Telegram-боте" },
  // ── Auth ──────────────────────────────────────────────────────────────
  "auth.signInTitle": { uz: "Hisobingizga kiring", en: "Welcome back", ru: "С возвращением" },
  "auth.signInSubtitle": { uz: "Arizalaringiz va saqlangan ishlarni davom ettiring.", en: "Continue where you left off.", ru: "Продолжите с того места, где остановились." },
  "auth.registerTitle": { uz: "Hisob yaratish", en: "Create your account", ru: "Создайте аккаунт" },
  "auth.registerSubtitle": { uz: "Bepul — 1 daqiqada boshlang.", en: "Free, and takes less than a minute.", ru: "Бесплатно и меньше минуты." },
  "auth.email": { uz: "Elektron pochta", en: "Email", ru: "Email" },
  "auth.password": { uz: "Parol", en: "Password", ru: "Пароль" },
  "auth.confirmPassword": { uz: "Parolni tasdiqlang", en: "Confirm password", ru: "Подтвердите пароль" },
  "auth.fullName": { uz: "To'liq ism", en: "Full name", ru: "Полное имя" },
  "auth.phone": { uz: "Telefon (ixtiyoriy)", en: "Phone (optional)", ru: "Телефон (необязательно)" },
  "auth.location": { uz: "Manzil (ixtiyoriy)", en: "Location (optional)", ru: "Локация (необязательно)" },
  "auth.remember": { uz: "Meni eslab qol", en: "Remember me", ru: "Запомнить меня" },
  "auth.forgot": { uz: "Parolni unutdingizmi?", en: "Forgot password?", ru: "Забыли пароль?" },
  "auth.noAccount": { uz: "Hisobingiz yo'qmi?", en: "Don't have an account?", ru: "Нет аккаунта?" },
  "auth.haveAccount": { uz: "Hisobingiz bormi?", en: "Already have an account?", ru: "Уже есть аккаунт?" },
  "auth.accountType": { uz: "Hisob turi", en: "Account type", ru: "Тип аккаунта" },
  "auth.jobSeeker": { uz: "Ish qidiryapman", en: "I'm looking for work", ru: "Ищу работу" },
  "auth.employer": { uz: "Xodim yollayapman", en: "I'm hiring", ru: "Я нанимаю" },
  "auth.jobSeekerDesc": { uz: "Ish topish, ariza yuborish va profil.", en: "Find jobs, apply and build your profile.", ru: "Искать работу, откликаться, вести профиль." },
  "auth.employerDesc": { uz: "E'lon joylash va nomzodlarni boshqarish.", en: "Post jobs and manage candidates.", ru: "Публиковать вакансии и вести кандидатов." },
  "auth.agree": { uz: "Men Foydalanish shartlari va Maxfiylik siyosatiga roziman", en: "I agree to the Terms and Privacy Policy", ru: "Я принимаю Условия и Политику конфиденциальности" },
  "auth.signInButton": { uz: "Kirish", en: "Sign in", ru: "Войти" },
  "auth.registerButton": { uz: "Hisob yaratish", en: "Create account", ru: "Создать аккаунт" },
  "auth.demoAccounts": { uz: "Demo hisoblar", en: "Demo accounts", ru: "Демо-аккаунты" },
  "auth.demoSeeker": { uz: "Demo ish qidiruvchi", en: "Demo job seeker", ru: "Демо соискатель" },
  "auth.demoEmployer": { uz: "Demo ish beruvchi", en: "Demo employer", ru: "Демо работодатель" },
  "auth.demoAdmin": { uz: "Demo administrator", en: "Demo administrator", ru: "Демо администратор" },
  "auth.showPassword": { uz: "Parolni ko'rsatish", en: "Show password", ru: "Показать пароль" },
  "auth.hidePassword": { uz: "Parolni yashirish", en: "Hide password", ru: "Скрыть пароль" },
  "auth.termsNote": { uz: "Ro'yxatdan o'tib siz shartlarga rozilik bildirasiz.", en: "By registering you accept our terms.", ru: "Регистрируясь, вы принимаете условия." },
  "auth.welcomeBack": { uz: "Xush kelibsiz, {name}!", en: "Welcome back, {name}!", ru: "С возвращением, {name}!" },
  "auth.registered": { uz: "Hisob yaratildi!", en: "Account created!", ru: "Аккаунт создан!" },
  // ── Validation / errors ───────────────────────────────────────────────
  "error.required": { uz: "Bu maydon to‘ldirilishi shart", en: "This field is required", ru: "Это поле обязательно" },
  "error.email": { uz: "To'g'ri email kiriting", en: "Enter a valid email address", ru: "Введите корректный email" },
  "error.passwordLength": { uz: "Parol kamida 8 belgidan iborat bo'lishi kerak", en: "Password must be at least 8 characters", ru: "Пароль должен быть не короче 8 символов" },
  "error.passwordMatch": { uz: "Parollar mos kelmadi", en: "Passwords do not match", ru: "Пароли не совпадают" },
  "error.emailInUse": { uz: "Bu email allaqachon ro'yxatdan o'tgan", en: "This email is already registered", ru: "Этот email уже зарегистрирован" },
  "error.invalidCredentials": { uz: "Email yoki parol noto'g'ri", en: "Invalid email or password", ru: "Неверный email или пароль" },
  "error.terms": { uz: "Shartlarga rozilik bildirishingiz kerak", en: "You must accept the terms", ru: "Необходимо принять условия" },
  "error.strength": { uz: "Parol kuchsiz", en: "Password is too weak", ru: "Слабый пароль" },
  "error.alreadyApplied": { uz: "Siz bu ishga allaqachon ariza bergansiz", en: "You have already applied to this job", ru: "Вы уже откликнулись на эту вакансию" },
  "error.employerCannotApply": { uz: "Ish beruvchi hisobi ariza bera olmaydi", en: "Employer accounts cannot apply for jobs.", ru: "Аккаунт работодателя не может откликаться." },
  "error.loginToApply": { uz: "Ariza berish uchun tizimga kiring", en: "Please sign in to apply", ru: "Войдите, чтобы откликнуться" },
  "error.jobNotFound": { uz: "Ish topilmadi", en: "Job not found", ru: "Вакансия не найдена" },
  "error.unauthorized": { uz: "Ruxsat yo‘q", en: "You are not authorized", ru: "Нет доступа" },
  "error.generic": { uz: "Xatolik yuz berdi. Qayta urinib ko‘ring.", en: "Something went wrong. Please try again.", ru: "Что-то пошло не так. Попробуйте снова." },
  "error.network": { uz: "Server bilan aloqa yo‘q", en: "Cannot reach the server", ru: "Нет связи с сервером" },
  "error.fileTooLarge": { uz: "Fayl hajmi 5MB dan oshmasligi kerak", en: "File must be smaller than 5MB", ru: "Файл должен быть меньше 5MB" },
  // ── Jobs listing ──────────────────────────────────────────────────────
  "jobs.title": { uz: "Ishlar", en: "Jobs", ru: "Вакансии" },
  "jobs.resultsCount": { uz: "{count} ta ish topildi", en: "{count} jobs found", ru: "Найдено вакансий: {count}" },
  "jobs.searchPlaceholder": { uz: "Lavozim, kompaniya yoki ko‘nikma", en: "Job title, company or skill", ru: "Должность, компания или навык" },
  "jobs.filters": { uz: "Filtrlar", en: "Filters", ru: "Фильтры" },
  "jobs.category": { uz: "Kategoriya", en: "Category", ru: "Категория" },
  "jobs.location": { uz: "Manzil", en: "Location", ru: "Локация" },
  "jobs.salaryRange": { uz: "Ish haqi oralig‘i", en: "Salary range", ru: "Диапазон зарплаты" },
  "jobs.employmentType": { uz: "Bandlik turi", en: "Employment type", ru: "Тип занятости" },
  "jobs.experience": { uz: "Tajriba", en: "Experience", ru: "Опыт" },
  "jobs.sortBy": { uz: "Saralash", en: "Sort by", ru: "Сортировка" },
  "jobs.sort.recent": { uz: "Eng yangi", en: "Most recent", ru: "Сначала новые" },
  "jobs.sort.salary": { uz: "Yuqori ish haqi", en: "Highest salary", ru: "Высокая зарплата" },
  "jobs.sort.relevant": { uz: "Eng mos", en: "Most relevant", ru: "Наиболее подходящие" },
  "jobs.clear": { uz: "Tozalash", en: "Clear all", ru: "Сбросить" },
  "jobs.applyFilters": { uz: "Filtrlarni qo‘llash", en: "Apply filters", ru: "Применить фильтры" },
  "jobs.remoteOnly": { uz: "Faqat masofaviy", en: "Remote only", ru: "Только удалённо" },
  "jobs.viewJob": { uz: "Ishni ko‘rish", en: "View job", ru: "Смотреть вакансию" },
  "jobs.save": { uz: "Saqlash", en: "Save", ru: "Сохранить" },
  "jobs.saved": { uz: "Saqlangan", en: "Saved", ru: "Сохранено" },
  "jobs.savedJob": { uz: "Ish saqlandi", en: "Job saved", ru: "Вакансия сохранена" },
  "jobs.unsavedJob": { uz: "Saqlanganlardan olindi", en: "Removed from saved", ru: "Удалено из сохранённых" },
  "jobs.empty.title": { uz: "Ish topilmadi", en: "No jobs found", ru: "Вакансии не найдены" },
  "jobs.empty.text": { uz: "Filtrlarni o‘zgartirib qayta urinib ko‘ring.", en: "Try adjusting your filters or search keywords.", ru: "Попробуйте изменить фильтры или запрос." },
  "jobs.empty.cta": { uz: "Filtrlarni tozalash", en: "Clear filters", ru: "Сбросить фильтры" },
  "jobs.match": { uz: "{score}% mos", en: "{score}% match", ru: "{score}% совпадение" },
  "jobs.applied": { uz: "Ariza berilgan", en: "Applied", ru: "Отклик отправлен" },
  "jobs.new": { uz: "Yangi", en: "New", ru: "Новая" },
  "jobs.showing": { uz: "{from}–{to} / {total} ko'rsatilmoqda", en: "Showing {from}–{to} of {total}", ru: "Показано {from}–{to} из {total}" },
  "jobs.mobileFilters": { uz: "Filtrlar", en: "Filters", ru: "Фильтры" },
  "jobs.searchButton": { uz: "Qidirish", en: "Search", ru: "Искать" },
  // ── Job detail ────────────────────────────────────────────────────────
  "job.back": { uz: "Ishlarga qaytish", en: "Back to jobs", ru: "Назад к вакансиям" },
  "job.applyNow": { uz: "Ariza berish", en: "Apply now", ru: "Откликнуться" },
  "job.saveJob": { uz: "Ishni saqlash", en: "Save job", ru: "Сохранить вакансию" },
  "job.share": { uz: "Ulashish", en: "Share", ru: "Поделиться" },
  "job.shared": { uz: "Havola nusxalandi", en: "Link copied to clipboard", ru: "Ссылка скопирована" },
  "job.about": { uz: "Ish haqida", en: "About the job", ru: "О вакансии" },
  "job.responsibilities": { uz: "Vazifalar", en: "Responsibilities", ru: "Обязанности" },
  "job.requirements": { uz: "Talablar", en: "Requirements", ru: "Требования" },
  "job.skills": { uz: "Ko'nikmalar", en: "Skills", ru: "Навыки" },
  "job.benefits": { uz: "Imtiyozlar", en: "Benefits", ru: "Преимущества" },
  "job.overview": { uz: "Umumiy ma’lumot", en: "Overview", ru: "Обзор" },
  "job.posted": { uz: "E'lon qilingan", en: "Posted", ru: "Опубликовано" },
  "job.views": { uz: "Ko'rishlar", en: "Views", ru: "Просмотры" },
  "job.applicants": { uz: "Nomzodlar", en: "Applicants", ru: "Кандидаты" },
  "job.company": { uz: "Kompaniya", en: "Company", ru: "Компания" },
  "job.companyJobs": { uz: "Kompaniyaning barcha ishlari", en: "All jobs at this company", ru: "Все вакансии компании" },
  "job.similar": { uz: "O'xshash ishlar", en: "Similar jobs", ru: "Похожие вакансии" },
  "job.industry": { uz: "Soha", en: "Industry", ru: "Сфера" },
  "job.size": { uz: "Xodimlar soni", en: "Company size", ru: "Размер компании" },
  "job.website": { uz: "Veb-sayt", en: "Website", ru: "Сайт" },
  "job.salary": { uz: "Ish haqi", en: "Salary", ru: "Зарплата" },
  "job.negotiable": { uz: "Kelishiladi", en: "Negotiable", ru: "По договорённости" },
  "job.status.active": { uz: "Faol", en: "Active", ru: "Активна" },
  // ── Apply flow ────────────────────────────────────────────────────────
  "apply.title": { uz: "Ariza topshirish", en: "Submit your application", ru: "Отправить отклик" },
  "apply.subtitle": { uz: "{job} · {company}", en: "{job} · {company}", ru: "{job} · {company}" },
  "apply.fullName": { uz: "To'liq ism", en: "Full name", ru: "Полное имя" },
  "apply.email": { uz: "Email", en: "Email", ru: "Email" },
  "apply.phone": { uz: "Telefon", en: "Phone", ru: "Телефон" },
  "apply.coverLetter": { uz: "Motivatsion xat", en: "Cover letter", ru: "Сопроводительное письмо" },
  "apply.coverLetterHint": { uz: "Nega bu lavozimga mosligingizni yozing (kamida 20 belgi).", en: "Tell the employer why you are a great fit (min 20 characters).", ru: "Расскажите, почему вы подходите (минимум 20 символов)." },
  "apply.portfolio": { uz: "Portfolio havolasi", en: "Portfolio URL", ru: "Ссылка на портфолио" },
  "apply.resume": { uz: "Rezyume / CV", en: "Resume / CV", ru: "Резюме / CV" },
  "apply.uploadHint": { uz: "PDF, DOC yoki DOCX · 5MB gacha", en: "PDF, DOC or DOCX · up to 5MB", ru: "PDF, DOC или DOCX · до 5MB" },
  "apply.chooseFile": { uz: "Fayl tanlash", en: "Choose file", ru: "Выбрать файл" },
  "apply.cancel": { uz: "Bekor qilish", en: "Cancel", ru: "Отмена" },
  "apply.submit": { uz: "Arizani yuborish", en: "Submit application", ru: "Отправить отклик" },
  "apply.successTitle": { uz: "Ariza muvaffaqiyatli yuborildi!", en: "Application submitted successfully!", ru: "Отклик успешно отправлен!" },
  "apply.successText": { uz: "Ish beruvchi arizangizni ko‘rib chiqadi. Holatni Arizalar sahifasida kuzatishingiz mumkin.", en: "The employer will review your application. Track the status on your Applications page.", ru: "Работодатель рассмотрит ваш отклик. Статус — на странице откликов." },
  "apply.viewApplications": { uz: "Arizalarimni ko‘rish", en: "View my applications", ru: "Мои отклики" },
  "apply.backToJobs": { uz: "Ishlarga qaytish", en: "Back to jobs", ru: "К вакансиям" },
  // ── Seeker dashboard ──────────────────────────────────────────────────
  "dash.goodMorning": { uz: "Xayrli tong, {name}", en: "Good morning, {name}", ru: "Доброе утро, {name}" },
  "dash.goodAfternoon": { uz: "Xayrli kun, {name}", en: "Good afternoon, {name}", ru: "Добрый день, {name}" },
  "dash.goodEvening": { uz: "Xayrli kech, {name}", en: "Good evening, {name}", ru: "Добрый вечер, {name}" },
  "dash.goodNight": { uz: "Xayrli tun, {name}", en: "Good night, {name}", ru: "Доброй ночи, {name}" },
  "dash.subtitle": { uz: "Keyingi imkoniyatingizni toping.", en: "Find your next opportunity.", ru: "Найдите свою следующую возможность." },
  "dash.applications": { uz: "Yuborilgan arizalar", en: "Applications sent", ru: "Отправлено откликов" },
  "dash.saved": { uz: "Saqlangan ishlar", en: "Saved jobs", ru: "Сохранённые вакансии" },
  "dash.views": { uz: "Profil ko‘rishlari", en: "Profile views", ru: "Просмотры профиля" },
  "dash.completion": { uz: "Profil to‘liqligi", en: "Profile completion", ru: "Заполненность профиля" },
  "dash.recommended": { uz: "Siz uchun tavsiya etilgan", en: "Recommended for you", ru: "Рекомендуем вам" },
  "dash.recentApplications": { uz: "Oxirgi arizalar", en: "Recent applications", ru: "Последние отклики" },
  "dash.savedJobs": { uz: "Saqlangan ishlar", en: "Saved jobs", ru: "Сохранённые вакансии" },
  "dash.quickActions": { uz: "Tezkor amallar", en: "Quick actions", ru: "Быстрые действия" },
  "dash.searchJobs": { uz: "Ish qidirish", en: "Search jobs", ru: "Искать вакансии" },
  "dash.updateProfile": { uz: "Profilni yangilash", en: "Update profile", ru: "Обновить профиль" },
  "dash.viewApplications": { uz: "Arizalarni ko‘rish", en: "View applications", ru: "Смотреть отклики" },
  "dash.completeProfile": { uz: "Profilni to‘ldirish", en: "Complete profile", ru: "Заполнить профиль" },
  "dash.noApplications": { uz: "Hali ariza yo‘q", en: "No applications yet", ru: "Пока нет откликов" },
  "dash.noApplicationsText": { uz: "Birinchi arizangizni yuboring va jarayonni kuzatib boring.", en: "Send your first application and track the process.", ru: "Отправьте первый отклик и следите за процессом." },
  "dash.interviews": { uz: "Suhbatlar", en: "Interviews", ru: "Интервью" },
  // ── Applications page ─────────────────────────────────────────────────
  "apps.title": { uz: "Mening arizalarim", en: "My applications", ru: "Мои отклики" },
  "apps.subtitle": { uz: "Yuborilgan arizalar va ularning holati.", en: "Every application you sent and its current status.", ru: "Все ваши отклики и их статусы." },
  "apps.filterAll": { uz: "Barchasi", en: "All", ru: "Все" },
  "apps.appliedOn": { uz: "Sana", en: "Applied", ru: "Дата" },
  "apps.status": { uz: "Holat", en: "Status", ru: "Статус" },
  "apps.viewJob": { uz: "Ishni ko‘rish", en: "View job", ru: "Смотреть вакансию" },
  "apps.details": { uz: "Batafsil", en: "Details", ru: "Подробнее" },
  "apps.coverLetter": { uz: "Motivatsion xat", en: "Cover letter", ru: "Сопроводительное письмо" },
  "apps.resume": { uz: "Rezyume", en: "Resume", ru: "Резюме" },
  "apps.portfolio": { uz: "Portfolio", en: "Portfolio", ru: "Портфолио" },
  "apps.empty.title": { uz: "Hali ariza yo‘q", en: "No applications yet", ru: "Пока нет откликов" },
  "apps.empty.text": { uz: "Mos ishni topib ariza yuboring — natijalar shu yerda ko‘rinadi.", en: "Find a job that fits and apply — your applications will appear here.", ru: "Найдите подходящую вакансию и откликнитесь — всё появится здесь." },
  "apps.empty.cta": { uz: "Ishlarni ko‘rish", en: "Browse jobs", ru: "Смотреть вакансии" },
  "apps.withdraw": { uz: "Arizani bekor qilish", en: "Withdraw application", ru: "Отозвать отклик" },
  // ── Saved page ────────────────────────────────────────────────────────
  "saved.title": { uz: "Saqlangan ishlar", en: "Saved jobs", ru: "Сохранённые вакансии" },
  "saved.subtitle": { uz: "Keyinroq ko‘rib chiqish uchun saqlangan e’lonlar.", en: "Jobs you bookmarked for later.", ru: "Вакансии, сохранённые на потом." },
  "saved.remove": { uz: "O‘chirish", en: "Remove", ru: "Удалить" },
  "saved.empty.title": { uz: "Saqlangan ishlar yo‘q", en: "No saved jobs yet", ru: "Нет сохранённых вакансий" },
  "saved.empty.text": { uz: "Ish kartochkasidagi “Saqlash” tugmasini bosing.", en: "Tap “Save” on any job card to keep it here.", ru: "Нажмите «Сохранить» на карточке вакансии." },
  "saved.empty.cta": { uz: "Ishlarni ko‘rish", en: "Explore jobs", ru: "Смотреть вакансии" },
  // ── Profile ───────────────────────────────────────────────────────────
  "profile.title": { uz: "Profil", en: "Profile", ru: "Профиль" },
  "profile.completion": { uz: "Profil {percent}% to‘ldirilgan", en: "Profile {percent}% complete", ru: "Профиль заполнен на {percent}%" },
  "profile.completionHint": { uz: "To‘liq profil ish beruvchilarda 3x ko‘proq ishonch uyg‘otadi.", en: "Complete profiles get 3x more employer interest.", ru: "Заполненный профиль получает в 3 раза больше внимания." },
  "profile.professionalTitle": { uz: "Kasbiy sarlavha", en: "Professional title", ru: "Профессиональный заголовок" },
  "profile.about": { uz: "Men haqimda", en: "About me", ru: "Обо мне" },
  "profile.skills": { uz: "Ko‘nikmalar", en: "Skills", ru: "Навыки" },
  "profile.addSkill": { uz: "Ko‘nikma qo‘shish", en: "Add skill", ru: "Добавить навык" },
  "profile.experience": { uz: "Ish tajribasi", en: "Experience", ru: "Опыт работы" },
  "profile.addExperience": { uz: "Tajriba qo‘shish", en: "Add experience", ru: "Добавить опыт" },
  "profile.education": { uz: "Ta’lim", en: "Education", ru: "Образование" },
  "profile.addEducation": { uz: "Ta’lim qo‘shish", en: "Add education", ru: "Добавить образование" },
  "profile.portfolio": { uz: "Portfolio va havolalar", en: "Portfolio & links", ru: "Портфолио и ссылки" },
  "profile.languages": { uz: "Tillar", en: "Languages", ru: "Языки" },
  "profile.expectedSalary": { uz: "Kutilayotgan ish haqi", en: "Expected salary", ru: "Ожидаемая зарплата" },
  "profile.experienceLevel": { uz: "Tajriba darajasi", en: "Experience level", ru: "Уровень опыта" },
  "profile.category": { uz: "Asosiy yo‘nalish", en: "Primary category", ru: "Основная категория" },
  "profile.save": { uz: "O‘zgarishlarni saqlash", en: "Save changes", ru: "Сохранить изменения" },
  "profile.saved": { uz: "Profil saqlandi", en: "Profile saved", ru: "Профиль сохранён" },
  "profile.role": { uz: "Joriy role", en: "Role", ru: "Роль" },
  "profile.memberSince": { uz: "Ro‘yxatdan o‘tgan", en: "Member since", ru: "Дата регистрации" },
  "profile.from": { uz: "Boshlanish", en: "From", ru: "С" },
  "profile.to": { uz: "Tugash", en: "To", ru: "По" },
  "profile.present": { uz: "Hozirgacha", en: "Present", ru: "По настоящее время" },
  "profile.preview": { uz: "Ko‘rinish", en: "Preview", ru: "Предпросмотр" },
  // ── Settings ──────────────────────────────────────────────────────────
  "settings.title": { uz: "Sozlamalar", en: "Settings", ru: "Настройки" },
  "settings.subtitle": { uz: "Hisob, xavfsizlik va bildirishnomalar.", en: "Account, security and notifications.", ru: "Аккаунт, безопасность и уведомления." },
  "settings.account": { uz: "Hisob", en: "Account", ru: "Аккаунт" },
  "settings.password": { uz: "Parol", en: "Password", ru: "Пароль" },
  "settings.notifications": { uz: "Bildirishnomalar", en: "Notifications", ru: "Уведомления" },
  "settings.privacy": { uz: "Maxfiylik", en: "Privacy", ru: "Конфиденциальность" },
  "settings.currentPassword": { uz: "Joriy parol", en: "Current password", ru: "Текущий пароль" },
  "settings.newPassword": { uz: "Yangi parol", en: "New password", ru: "Новый пароль" },
  "settings.confirmNewPassword": { uz: "Yangi parolni tasdiqlang", en: "Confirm new password", ru: "Подтвердите новый пароль" },
  "settings.updatePassword": { uz: "Parolni yangilash", en: "Update password", ru: "Обновить пароль" },
  "settings.passwordChanged": { uz: "Parol yangilandi", en: "Password updated", ru: "Пароль обновлён" },
  "settings.saved": { uz: "Saqlandi", en: "Saved", ru: "Сохранено" },
  "settings.deleteAccount": { uz: "Hisobni o‘chirish", en: "Delete account", ru: "Удалить аккаунт" },
  "settings.deleteWarning": { uz: "Bu amalni qaytarib bo‘lmaydi. Barcha arizalar, saqlangan ishlar va profil o‘chiriladi.", en: "This action cannot be undone. All applications, saved jobs and profile data will be deleted.", ru: "Это действие необратимо. Все отклики, сохранённые вакансии и профиль будут удалены." },
  "settings.deleteConfirm": { uz: "Hisobni o‘chirish", en: "Delete my account", ru: "Удалить аккаунт" },
  "settings.exportData": { uz: "Ma’lumotlarni yuklab olish", en: "Export my data", ru: "Экспорт данных" },
  "settings.exportDone": { uz: "Ma’lumotlar yuklandi", en: "Data exported", ru: "Данные экспортированы" },
  "settings.notifApplications": { uz: "Ariza holati o‘zgarganda", en: "When an application status changes", ru: "Когда меняется статус отклика" },
  "settings.notifJobs": { uz: "Yangi mos ishlar haqida", en: "New jobs matching my profile", ru: "Новые подходящие вакансии" },
  "settings.notifTelegram": { uz: "Telegram orqali bildirishnomalar", en: "Telegram notifications", ru: "Уведомления в Telegram" },
  "settings.privacyProfile": { uz: "Profilim ish beruvchilarga ko‘rinadi", en: "My profile is visible to employers", ru: "Мой профиль виден работодателям" },
  "settings.privacySalary": { uz: "Ish haqi kutishimni ko‘rsatish", en: "Show my expected salary", ru: "Показывать ожидаемую зарплату" },
  "settings.dangerZone": { uz: "Xavfli hudud", en: "Danger zone", ru: "Опасная зона" },
  "settings.telegramLinked": { uz: "Telegram ulangan", en: "Telegram connected", ru: "Telegram подключён" },
  "settings.telegramNotLinked": { uz: "Telegram ulanmagan", en: "Telegram not connected", ru: "Telegram не подключён" },
  "settings.telegramHint": { uz: "Botni ochib /start bosing — WebApp avtomatik ulanadi.", en: "Open the bot and press /start — the WebApp links automatically.", ru: "Откройте бота и нажмите /start — WebApp подключится автоматически." },
  // ── Employer ──────────────────────────────────────────────────────────
  "emp.title": { uz: "Ish beruvchi paneli", en: "Employer Dashboard", ru: "Панель работодателя" },
  "emp.subtitle": { uz: "E’lonlar, nomzodlar va natijalar bir joyda.", en: "Your listings, candidates and results in one place.", ru: "Вакансии, кандидаты и результаты в одном месте." },
  "emp.activeJobs": { uz: "Faol ishlar", en: "Active jobs", ru: "Активные вакансии" },
  "emp.totalApplications": { uz: "Jami arizalar", en: "Total applications", ru: "Всего откликов" },
  "emp.views": { uz: "Ko‘rishlar", en: "Views", ru: "Просмотры" },
  "emp.hired": { uz: "Ishga qabul", en: "Hired candidates", ru: "Нанято" },
  "emp.newThisWeek": { uz: "Shu haftada", en: "New this week", ru: "За неделю" },
  "emp.postNewJob": { uz: "Yangi ish e’lon qilish", en: "Post a new job", ru: "Разместить вакансию" },
  "emp.activeListings": { uz: "Faol e’lonlar", en: "Active job listings", ru: "Активные вакансии" },
  "emp.recentApplications": { uz: "Oxirgi arizalar", en: "Recent applications", ru: "Последние отклики" },
  "emp.noJobs.title": { uz: "Hali e’lon yo‘q", en: "No job listings yet", ru: "Пока нет вакансий" },
  "emp.noJobs.text": { uz: "Birinchi e’loningizni joylashtiring va nomzodlarni qabul qilishni boshlang.", en: "Publish your first job and start receiving candidates.", ru: "Опубликуйте первую вакансию и начните получать кандидатов." },
  "emp.noJobs.cta": { uz: "Ish e’lon qilish", en: "Post a job", ru: "Разместить вакансию" },
  "emp.myJobs": { uz: "Mening ishlarim", en: "My jobs", ru: "Мои вакансии" },
  "emp.myJobs.subtitle": { uz: "E’lonlarni tahrirlash, to‘xtatish va o‘chirish.", en: "Edit, pause or delete your listings.", ru: "Редактируйте, приостанавливайте и удаляйте вакансии." },
  "emp.edit": { uz: "Tahrirlash", en: "Edit", ru: "Редактировать" },
  "emp.pause": { uz: "To‘xtatish", en: "Pause", ru: "Приостановить" },
  "emp.activate": { uz: "Faollashtirish", en: "Activate", ru: "Активировать" },
  "emp.delete": { uz: "O‘chirish", en: "Delete", ru: "Удалить" },
  "emp.view": { uz: "Ko‘rish", en: "View", ru: "Смотреть" },
  "emp.confirmDeleteTitle": { uz: "E’lonni o‘chirish?", en: "Delete this job?", ru: "Удалить вакансию?" },
  "emp.confirmDeleteText": { uz: "“{title}” e’loni va unga tegishli arizalar o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.", en: "“{title}” and its applications will be permanently deleted.", ru: "«{title}» и все отклики будут удалены безвозвратно." },
  "emp.deleted": { uz: "E’lon o‘chirildi", en: "Job deleted", ru: "Вакансия удалена" },
  "emp.paused": { uz: "E’lon to‘xtatildi", en: "Job paused", ru: "Вакансия приостановлена" },
  "emp.activated": { uz: "E’lon faollashtirildi", en: "Job activated", ru: "Вакансия активирована" },
  "emp.updated": { uz: "E’lon yangilandi", en: "Job updated", ru: "Вакансия обновлена" },
  "emp.candidates": { uz: "Nomzodlar", en: "Candidates", ru: "Кандидаты" },
  "emp.candidates.subtitle": { uz: "Arizalarni ko‘rib chiqing va holatni boshqaring.", en: "Review applications and move candidates through stages.", ru: "Просматривайте отклики и управляйте этапами." },
  "emp.allJobs": { uz: "Barcha ishlar", en: "All jobs", ru: "Все вакансии" },
  "emp.allStatuses": { uz: "Barcha holatlar", en: "All statuses", ru: "Все статусы" },
  "emp.shortlist": { uz: "Saralash", en: "Shortlist", ru: "В шортлист" },
  "emp.reject": { uz: "Rad etish", en: "Reject", ru: "Отклонить" },
  "emp.interview": { uz: "Suhbatga", en: "Move to interview", ru: "На интервью" },
  "emp.hire": { uz: "Ishga qabul", en: "Mark hired", ru: "Принять на работу" },
  "emp.viewProfile": { uz: "Profilni ko‘rish", en: "View profile", ru: "Смотреть профиль" },
  "emp.statusChanged": { uz: "Holat yangilandi: {status}", en: "Status updated: {status}", ru: "Статус обновлён: {status}" },
  "emp.noCandidates.title": { uz: "Nomzodlar yo‘q", en: "No candidates yet", ru: "Пока нет кандидатов" },
  "emp.noCandidates.text": { uz: "E’lon joylashtiring — arizalar shu yerda paydo bo‘ladi.", en: "Publish a job and applications will show up here.", ru: "Опубликуйте вакансию — отклики появятся здесь." },
  "emp.noCandidates.cta": { uz: "E’lon joylashtirish", en: "Post a job", ru: "Разместить вакансию" },
  "emp.searchCandidates": { uz: "Nomzod qidirish", en: "Search candidates", ru: "Поиск кандидатов" },
  "emp.match": { uz: "{score}% mos", en: "{score}% match", ru: "{score}% совпадение" },
  "emp.companyProfile": { uz: "Kompaniya profili", en: "Company profile", ru: "Профиль компании" },
  "emp.companySaved": { uz: "Kompaniya saqlandi", en: "Company saved", ru: "Компания сохранена" },
  // ── Post job ──────────────────────────────────────────────────────────
  "post.title": { uz: "Ish e’lon qilish", en: "Post a job", ru: "Разместить вакансию" },
  "post.subtitle": { uz: "Yaxshi e’lon 3x ko‘proq mos nomzod oladi.", en: "A complete listing receives 3x more qualified candidates.", ru: "Полная вакансия получает в 3 раза больше откликов." },
  "post.jobTitle": { uz: "Lavozim nomi", en: "Job title", ru: "Название вакансии" },
  "post.jobTitlePlaceholder": { uz: "Masalan: Frontend Developer", en: "e.g. Frontend Developer", ru: "например: Frontend Developer" },
  "post.category": { uz: "Kategoriya", en: "Category", ru: "Категория" },
  "post.company": { uz: "Kompaniya", en: "Company", ru: "Компания" },
  "post.location": { uz: "Manzil", en: "Location", ru: "Локация" },
  "post.remote": { uz: "Masofaviy ish", en: "Remote position", ru: "Удалённая работа" },
  "post.salaryMin": { uz: "Minimal ish haqi", en: "Salary minimum", ru: "Минимальная зарплата" },
  "post.salaryMax": { uz: "Maksimal ish haqi", en: "Salary maximum", ru: "Максимальная зарплата" },
  "post.currency": { uz: "Valyuta", en: "Currency", ru: "Валюта" },
  "post.employmentType": { uz: "Bandlik turi", en: "Employment type", ru: "Тип занятости" },
  "post.experience": { uz: "Tajriba darajasi", en: "Experience level", ru: "Уровень опыта" },
  "post.description": { uz: "Ish tavsifi", en: "Description", ru: "Описание" },
  "post.descriptionHint": { uz: "Vazifa, jamoa va loyiha haqida yozing.", en: "Describe the role, team and product.", ru: "Опишите роль, команду и продукт." },
  "post.responsibilities": { uz: "Vazifalar", en: "Responsibilities", ru: "Обязанности" },
  "post.requirements": { uz: "Talablar", en: "Requirements", ru: "Требования" },
  "post.skills": { uz: "Ko‘nikmalar", en: "Skills", ru: "Навыки" },
  "post.benefits": { uz: "Imtiyozlar", en: "Benefits", ru: "Преимущества" },
  "post.addLine": { uz: "Qator qo‘shish", en: "Add line", ru: "Добавить строку" },
  "post.addSkill": { uz: "Ko‘nikma qo‘shish", en: "Add skill", ru: "Добавить навык" },
  "post.publish": { uz: "E’lonni joylashtirish", en: "Publish job", ru: "Опубликовать" },
  "post.published": { uz: "E’lon muvaffaqiyatli joylashtirildi.", en: "Job published successfully.", ru: "Вакансия успешно опубликована." },
  "post.saveDraft": { uz: "Qoralama sifatida saqlash", en: "Save as draft", ru: "Сохранить как черновик" },
  "post.cancel": { uz: "Bekor qilish", en: "Cancel", ru: "Отмена" },
  "post.preview": { uz: "Ko‘rib chiqish", en: "Preview", ru: "Предпросмотр" },
  "post.step.basics": { uz: "Asosiy ma’lumot", en: "Basics", ru: "Основное" },
  "post.step.details": { uz: "Batafsil", en: "Details", ru: "Детали" },
  "post.step.requirements": { uz: "Talablar", en: "Requirements", ru: "Требования" },
  // ── Company ───────────────────────────────────────────────────────────
  "company.about": { uz: "Kompaniya haqida", en: "About company", ru: "О компании" },
  "company.openJobs": { uz: "Ochiq ishlar", en: "Open jobs", ru: "Открытые вакансии" },
  "company.noJobs": { uz: "Hozircha ochiq ishlar yo‘q", en: "No open jobs right now", ru: "Сейчас нет открытых вакансий" },
  "company.verified": { uz: "Tasdiqlangan", en: "Verified", ru: "Проверено" },
  "company.employees": { uz: "xodim", en: "employees", ru: "сотрудников" },
  "company.notFound": { uz: "Kompaniya topilmadi", en: "Company not found", ru: "Компания не найдена" },
  "companies.title": { uz: "Kompaniyalar", en: "Companies", ru: "Компании" },
  "companies.subtitle": { uz: "LocalJob’dagi ish beruvchilar.", en: "Employers hiring on LocalJob.", ru: "Работодатели на LocalJob." },
  "companies.searchPlaceholder": { uz: "Kompaniya yoki soha qidirish", en: "Search company or industry", ru: "Поиск компании или сферы" },
  "companies.empty": { uz: "Kompaniya topilmadi", en: "No companies found", ru: "Компании не найдены" },
  // ── Admin ─────────────────────────────────────────────────────────────
  "admin.title": { uz: "Admin panel", en: "Admin panel", ru: "Админ-панель" },
  "admin.subtitle": { uz: "Platforma statistikasi va moderatsiya.", en: "Platform statistics, moderation and reports.", ru: "Статистика платформы, модерация и отчёты." },
  "admin.overview": { uz: "Umumiy", en: "Overview", ru: "Обзор" },
  "admin.users": { uz: "Foydalanuvchilar", en: "Users", ru: "Пользователи" },
  "admin.jobs": { uz: "Ishlar", en: "Jobs", ru: "Вакансии" },
  "admin.applications": { uz: "Arizalar", en: "Applications", ru: "Отклики" },
  "admin.broadcast": { uz: "Xabar yuborish", en: "Broadcast", ru: "Рассылка" },
  "admin.activity": { uz: "Faoliyat jurnali", en: "Activity log", ru: "Журнал активности" },
  "admin.export": { uz: "CSV hisobot", en: "CSV export", ru: "CSV экспорт" },
  "admin.totalUsers": { uz: "Foydalanuvchilar", en: "Users", ru: "Пользователи" },
  "admin.seekers": { uz: "Ish qidiruvchilar", en: "Job seekers", ru: "Соискатели" },
  "admin.employers": { uz: "Ish beruvchilar", en: "Employers", ru: "Работодатели" },
  "admin.totalJobs": { uz: "Jami ishlar", en: "Total jobs", ru: "Всего вакансий" },
  "admin.activeJobs": { uz: "Faol ishlar", en: "Active jobs", ru: "Активные" },
  "admin.totalApplications": { uz: "Jami arizalar", en: "Applications", ru: "Отклики" },
  "admin.views": { uz: "Ko‘rishlar", en: "Views", ru: "Просмотры" },
  "admin.companies": { uz: "Kompaniyalar", en: "Companies", ru: "Компании" },
  "admin.botStatus": { uz: "Bot holati", en: "Bot status", ru: "Статус бота" },
  "admin.database": { uz: "Ma’lumotlar bazasi", en: "Database", ru: "База данных" },
  "admin.telegramUsers": { uz: "Telegram foydalanuvchilar", en: "Telegram users", ru: "Telegram-пользователи" },
  "admin.newThisWeek": { uz: "Shu haftada yangi", en: "New this week", ru: "Новых за неделю" },
  "admin.search": { uz: "Qidirish", en: "Search", ru: "Поиск" },
  "admin.role": { uz: "Rol", en: "Role", ru: "Роль" },
  "admin.created": { uz: "Sana", en: "Created", ru: "Создан" },
  "admin.actions": { uz: "Amallar", en: "Actions", ru: "Действия" },
  "admin.block": { uz: "Bloklash", en: "Block", ru: "Заблокировать" },
  "admin.unblock": { uz: "Blokdan chiqarish", en: "Unblock", ru: "Разблокировать" },
  "admin.impersonate": { uz: "Sifatida kirish", en: "View as", ru: "Смотреть как" },
  "admin.broadcastTitle": { uz: "Foydalanuvchilarga xabar", en: "Message to users", ru: "Сообщение пользователям" },
  "admin.broadcastText": { uz: "Xabar matni", en: "Message text", ru: "Текст сообщения" },
  "admin.audience": { uz: "Kimga", en: "Audience", ru: "Аудитория" },
  "admin.audienceAll": { uz: "Barchaga", en: "Everyone", ru: "Всем" },
  "admin.audienceSeekers": { uz: "Ish qidiruvchilarga", en: "Job seekers", ru: "Соискателям" },
  "admin.audienceEmployers": { uz: "Ish beruvchilarga", en: "Employers", ru: "Работодателям" },
  "admin.send": { uz: "Yuborish", en: "Send", ru: "Отправить" },
  "admin.sent": { uz: "{count} foydalanuvchiga yuborildi", en: "Sent to {count} users", ru: "Отправлено {count} пользователям" },
  "admin.topJobs": { uz: "Eng faol e’lonlar", en: "Top performing jobs", ru: "Топ вакансий" },
  "admin.last14": { uz: "Oxirgi 14 kun", en: "Last 14 days", ru: "Последние 14 дней" },
  "admin.statusBreakdown": { uz: "Arizalar holati", en: "Application statuses", ru: "Статусы откликов" },
  "admin.noAccess": { uz: "Bu sahifa faqat administratorlar uchun", en: "This page is for administrators only", ru: "Эта страница только для администраторов" },
  "admin.moderationNote": { uz: "E’lon holatini o‘zgartirish", en: "Change listing status", ru: "Изменить статус вакансии" },
  // ── Common ────────────────────────────────────────────────────────────
  "common.loading": { uz: "Yuklanmoqda…", en: "Loading…", ru: "Загрузка…" },
  "common.close": { uz: "Yopish", en: "Close", ru: "Закрыть" },
  "common.cancel": { uz: "Bekor qilish", en: "Cancel", ru: "Отмена" },
  "common.save": { uz: "Saqlash", en: "Save", ru: "Сохранить" },
  "common.confirm": { uz: "Tasdiqlash", en: "Confirm", ru: "Подтвердить" },
  "common.delete": { uz: "O‘chirish", en: "Delete", ru: "Удалить" },
  "common.edit": { uz: "Tahrirlash", en: "Edit", ru: "Изменить" },
  "common.add": { uz: "Qo‘shish", en: "Add", ru: "Добавить" },
  "common.remove": { uz: "O‘chirish", en: "Remove", ru: "Удалить" },
  "common.back": { uz: "Ortga", en: "Back", ru: "Назад" },
  "common.next": { uz: "Keyingi", en: "Next", ru: "Далее" },
  "common.prev": { uz: "Oldingi", en: "Previous", ru: "Назад" },
  "common.all": { uz: "Barchasi", en: "All", ru: "Все" },
  "common.optional": { uz: "ixtiyoriy", en: "optional", ru: "необязательно" },
  "common.retry": { uz: "Qayta urinish", en: "Retry", ru: "Повторить" },
  "common.notFoundTitle": { uz: "Sahifa topilmadi", en: "Page not found", ru: "Страница не найдена" },
  "common.notFoundText": { uz: "Havola xato yoki sahifa o‘chirilgan.", en: "The link is broken or the page was removed.", ru: "Ссылка неверна или страница удалена." },
  "common.goHome": { uz: "Bosh sahifaga", en: "Go home", ru: "На главную" },
  "common.savedToServer": { uz: "Serverga saqlandi", en: "Saved to server", ru: "Сохранено на сервере" },
  "common.offlineMode": { uz: "Offline rejim (localStorage)", en: "Offline mode (localStorage)", ru: "Офлайн-режим (localStorage)" },
  "common.onlineMode": { uz: "Server bilan ulangan", en: "Connected to server", ru: "Подключено к серверу" },
  "common.noNotifications": { uz: "Bildirishnomalar yo‘q", en: "No notifications", ru: "Нет уведомлений" },
  "common.markAllRead": { uz: "Barchasini o‘qilgan qilish", en: "Mark all as read", ru: "Отметить всё прочитанным" },
  "common.viewAll": { uz: "Barchasini ko‘rish", en: "View all", ru: "Смотреть все" },
  "common.page": { uz: "Sahifa", en: "Page", ru: "Страница" },
  "common.of": { uz: "/", en: "of", ru: "из" },
  "common.required": { uz: "majburiy", en: "required", ru: "обязательно" },
  "common.new": { uz: "Yangi", en: "New", ru: "Новое" },
  "common.step": { uz: "Qadam", en: "Step", ru: "Шаг" },
  "common.breadcrumbHome": { uz: "Bosh sahifa", en: "Home", ru: "Главная" },
  "common.aboutLocalJob": { uz: "LocalJob haqida", en: "About LocalJob", ru: "О LocalJob" },
  "common.contactTitle": { uz: "Biz bilan bog‘lanish", en: "Contact us", ru: "Свяжитесь с нами" },
  "common.contactText": { uz: "Savollar, takliflar va hamkorlik uchun yozing.", en: "Questions, feedback and partnership requests.", ru: "Вопросы, отзывы и партнёрство." },
  "common.sendMessage": { uz: "Xabar yuborish", en: "Send message", ru: "Отправить сообщение" },
  "common.message": { uz: "Xabar", en: "Message", ru: "Сообщение" },
  "common.messageSent": { uz: "Xabaringiz yuborildi. Rahmat!", en: "Your message was sent. Thank you!", ru: "Ваше сообщение отправлено. Спасибо!" },
  "common.privacyTitle": { uz: "Maxfiylik siyosati", en: "Privacy Policy", ru: "Политика конфиденциальности" },
  "common.termsTitle": { uz: "Foydalanish shartlari", en: "Terms of Service", ru: "Условия использования" },
  "common.aboutText": { uz: "LocalJob — mahalliy ish bozorini bog‘lovchi platforma.", en: "LocalJob connects local talent with local opportunity.", ru: "LocalJob соединяет локальные таланты и возможности." }
};
function translate(key, lang, vars) {
  const entry = dict[key];
  let value = entry ? entry[lang] || entry.en : key;
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${name}\\}`, "g"), String(replacement));
    }
  }
  return value;
}
const SERVICE_VALUES = ["uz", "en", "ru"];
function pickLang(value) {
  const candidate = (value || "").slice(0, 2).toLowerCase();
  return SERVICE_VALUES.includes(candidate) ? candidate : "uz";
}
const LanguageContext = createContext(null);
function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => pickLang(storage.raw(KEYS.lang, "")));
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    storage.setRaw(KEYS.lang, lang);
  }, [lang]);
  const setLang = useCallback((next) => setLangState(pickLang(next)), []);
  const t = useCallback((key, vars) => translate(key, lang, vars), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, languages: LANGUAGES }), [lang, setLang, t]);
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value, children });
}
function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
const ThemeContext = createContext(null);
function initialTheme() {
  var _a;
  const stored = storage.raw(KEYS.theme, "");
  if (stored === "light" || stored === "dark") return stored;
  if (typeof window !== "undefined" && ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-color-scheme: light)").matches)) return "light";
  return "dark";
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme);
  useEffect(() => {
    var _a, _b, _c;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#080E1C" : "#F6F9FD");
    storage.setRaw(KEYS.theme, theme);
    const telegram = (_a = window.Telegram) == null ? void 0 : _a.WebApp;
    try {
      (_b = telegram == null ? void 0 : telegram.setHeaderColor) == null ? void 0 : _b.call(telegram, theme === "dark" ? "#080E1C" : "#F6F9FD");
      (_c = telegram == null ? void 0 : telegram.setBackgroundColor) == null ? void 0 : _c.call(telegram, theme === "dark" ? "#080E1C" : "#F6F9FD");
    } catch {
    }
  }, [theme]);
  const setTheme = useCallback((next) => setThemeState(next), []);
  const toggleTheme = useCallback(() => setThemeState((current) => current === "dark" ? "light" : "dark"), []);
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
const VARIANTS = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover shadow-[0_1px_0_rgba(255,255,255,0.15)_inset] disabled:hover:bg-primary",
  secondary: "bg-card-2 text-fg border border-line hover:border-line-strong hover:bg-card",
  outline: "border border-line-strong bg-transparent text-fg hover:bg-card-2",
  ghost: "bg-transparent text-muted hover:bg-card-2 hover:text-fg",
  danger: "bg-danger text-white hover:brightness-110",
  success: "bg-success text-white hover:brightness-110",
  accent: "bg-accent text-accent-fg hover:brightness-110"
};
const SIZES = {
  sm: "h-9 px-3 text-[13px] gap-1.5 rounded-md",
  md: "h-11 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-lg",
  icon: "h-10 w-10 rounded-md justify-center"
};
const Button = forwardRef(function Button2({ className, variant = "primary", size = "md", loading, icon, iconRight, fullWidth, children, disabled, ...props }, ref) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref,
      disabled: disabled || loading,
      className: cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.985]",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      ),
      ...props,
      children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }) : icon,
        children,
        !loading && iconRight
      ]
    }
  );
});
function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  fullWidth,
  className,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to,
      className: cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-150 active:scale-[0.985]",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      ),
      ...rest,
      children: [
        icon,
        children,
        iconRight
      ]
    }
  );
}
const TONES$1 = {
  default: "border-line bg-card-2 text-muted",
  info: "border-info/25 bg-info/10 text-info",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/12 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
  accent: "border-accent/30 bg-accent/10 text-accent",
  primary: "border-primary/30 bg-primary/10 text-primary"
};
function Badge({
  children,
  tone = "default",
  className,
  icon
}) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES$1[tone],
        className
      ),
      children: [
        icon,
        children
      ]
    }
  );
}
function Avatar({
  name,
  src,
  size = 40,
  color,
  className,
  rounded = "full"
}) {
  if (src) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt: name ? `${name} avatar` : "Avatar",
        width: size,
        height: size,
        className: cn("shrink-0 object-cover", rounded === "full" ? "rounded-full" : "rounded-md", className),
        style: { width: size, height: size }
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": !name,
      className: cn(
        "grid shrink-0 place-items-center font-semibold text-white",
        rounded === "full" ? "rounded-full" : "rounded-md",
        className
      ),
      style: {
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.36),
        background: color || "linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))"
      },
      children: initials(name)
    }
  );
}
function CompanyLogo({
  name,
  logo,
  color,
  size = 48,
  className
}) {
  const label = (logo || initials(name) || "").slice(0, 3);
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": true,
      className: cn("grid shrink-0 place-items-center rounded-md font-bold text-white", className),
      style: {
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.32),
        background: color ? `${color}` : "linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))"
      },
      children: label || /* @__PURE__ */ jsx(Building2, { size: size * 0.42 })
    }
  );
}
function VerifiedBadge({ label }) {
  return /* @__PURE__ */ jsx(Badge, { tone: "accent", icon: /* @__PURE__ */ jsx(BadgeCheck, { size: 13 }), children: label });
}
function Progress({ value, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("h-2 w-full overflow-hidden rounded-full bg-card-2", className),
      role: "progressbar",
      "aria-valuenow": value,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500",
          style: { width: `${Math.min(100, Math.max(0, value))}%` }
        }
      )
    }
  );
}
function MatchRing({ score, size = 44, label }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score)) / 100;
  return /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", style: { width: size, height: size }, title: label, children: [
    /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
      /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "rgb(var(--line))", strokeWidth: "3.5" }),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: "rgb(var(--accent))",
          strokeWidth: "3.5",
          strokeLinecap: "round",
          strokeDasharray: circumference,
          strokeDashoffset: circumference * (1 - progress)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "absolute inset-0 grid place-items-center text-[10px] font-bold text-fg", children: [
      score,
      "%"
    ] })
  ] });
}
function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
function useBodyLock(active) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
function useAsync(task, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await task();
      if (mounted.current) setData(result);
      return result;
    } catch (caught) {
      if (mounted.current) setError(caught);
      throw caught;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, deps);
  useEffect(() => {
    if (immediate) void run().catch(() => void 0);
  }, [run, immediate]);
  return { data, loading, error, reload: run, setData };
}
function useClickOutside(onOutside) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}
function Dropdown({
  trigger,
  children,
  align = "right",
  className,
  width = 240
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  const close = () => setOpen(false);
  return /* @__PURE__ */ jsxs("div", { ref, className: cn("relative", className), children: [
    trigger({ open, toggle: () => setOpen((value) => !value) }),
    open ? /* @__PURE__ */ jsx(
      "div",
      {
        role: "menu",
        className: cn(
          "absolute z-50 mt-2 overflow-hidden rounded-lg border border-line bg-card p-1.5 shadow-pop animate-slide-down",
          align === "right" ? "right-0" : "left-0"
        ),
        style: { width },
        children: typeof children === "function" ? children(close) : children
      }
    ) : null
  ] });
}
function DropdownItem({
  children,
  onClick,
  icon,
  danger,
  active
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "menuitem",
      onClick,
      className: cn(
        "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
        danger ? "text-danger hover:bg-danger/10" : "text-fg hover:bg-card-2",
        active && "bg-primary/10 text-primary"
      ),
      children: [
        icon ? /* @__PURE__ */ jsx("span", { className: "text-subtle [&_svg]:h-4 [&_svg]:w-4", children: icon }) : null,
        /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children })
      ]
    }
  );
}
function DropdownDivider() {
  return /* @__PURE__ */ jsx("div", { className: "my-1.5 h-px bg-line", role: "separator" });
}
function DropdownLabel({ children }) {
  return /* @__PURE__ */ jsx("p", { className: "px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wide text-subtle", children });
}
function Logo() {
  return /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5", "aria-label": "LocalJob home", children: [
    /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-[15px] font-extrabold text-white shadow-sm", children: "LJ" }),
    /* @__PURE__ */ jsxs("span", { className: "text-[17px] font-bold tracking-tight text-fg", children: [
      "Local",
      /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Job" })
    ] })
  ] });
}
function NavItem({ to, children }) {
  return /* @__PURE__ */ jsx(
    NavLink,
    {
      to,
      className: ({ isActive }) => cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-card-2 hover:text-fg"
      ),
      children
    }
  );
}
function NotificationsMenu() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  useAsync(async () => {
    if (!user) return null;
    const data = await backend.notifications();
    setItems(data);
    return data;
  }, [user == null ? void 0 : user.id, reloadKey]);
  const unread = (items == null ? void 0 : items.unread) ?? 0;
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      width: 330,
      trigger: ({ toggle }) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            toggle();
            setReloadKey((key) => key + 1);
          },
          className: "relative grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg",
          "aria-label": t("nav.notifications"),
          children: [
            /* @__PURE__ */ jsx(Bell, { size: 18 }),
            unread > 0 ? /* @__PURE__ */ jsx("span", { className: "absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white", children: unread }) : null
          ]
        }
      ),
      children: (close) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: t("nav.notifications") }),
          unread > 0 ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "text-xs font-medium text-primary hover:underline",
              onClick: async () => {
                await backend.markNotifications({ all: true });
                setReloadKey((key) => key + 1);
              },
              children: t("common.markAllRead")
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsx(DropdownDivider, {}),
        /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto", children: !items || items.items.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-3 py-6 text-center text-sm text-subtle", children: t("common.noNotifications") }) : items.items.slice(0, 8).map((note) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: note.link || "#",
            onClick: async () => {
              close();
              if (!note.isRead) {
                await backend.markNotifications({ ids: [note.id] });
                setReloadKey((key) => key + 1);
              }
            },
            className: cn(
              "block rounded-md px-3 py-2.5 transition-colors hover:bg-card-2",
              !note.isRead && "bg-primary/[0.06]"
            ),
            children: [
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-sm font-medium text-fg", children: [
                !note.isRead ? /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }) : null,
                note.title
              ] }),
              note.message ? /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted", children: note.message }) : null,
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-subtle", children: relativeTime(note.createdAt, lang) })
            ]
          },
          note.id
        )) })
      ] })
    }
  );
}
function LanguageSwitcher() {
  const { lang, setLang, languages, t } = useLanguage();
  const current = languages.find((item) => item.code === lang);
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      width: 180,
      trigger: ({ toggle }) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: toggle,
          className: "inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted transition-colors hover:bg-card-2 hover:text-fg",
          "aria-label": t("nav.language"),
          children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: current == null ? void 0 : current.flag }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: current == null ? void 0 : current.short }),
            /* @__PURE__ */ jsx(ChevronDown, { size: 14 })
          ]
        }
      ),
      children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(DropdownLabel, { children: t("nav.language") }),
        languages.map((item) => /* @__PURE__ */ jsxs(
          DropdownItem,
          {
            active: item.code === lang,
            onClick: () => {
              setLang(item.code);
              close();
            },
            children: [
              /* @__PURE__ */ jsx("span", { className: "mr-1", "aria-hidden": true, children: item.flag }),
              item.label
            ]
          },
          item.code
        ))
      ] })
    }
  );
}
function ThemeToggle$1() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: toggleTheme,
      className: "grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg",
      "aria-label": theme === "dark" ? t("nav.lightTheme") : t("nav.darkTheme"),
      title: theme === "dark" ? t("nav.lightTheme") : t("nav.darkTheme"),
      children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { size: 18 }) : /* @__PURE__ */ jsx(Moon, { size: 18 })
    }
  );
}
function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  if (!user) return null;
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      width: 240,
      trigger: ({ toggle }) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: toggle,
          className: "flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-card-2",
          "aria-label": t("nav.profile"),
          children: [
            /* @__PURE__ */ jsx(Avatar, { name: user.name, src: user.avatar, size: 32 }),
            /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "text-subtle" })
          ]
        }
      ),
      children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-fg", children: user.name }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-subtle", children: user.email })
        ] }),
        /* @__PURE__ */ jsx(DropdownDivider, {}),
        user.role === "job_seeker" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(LayoutDashboard, {}), onClick: () => {
            close();
            navigate("/dashboard");
          }, children: t("nav.dashboard") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(FileText, {}), onClick: () => {
            close();
            navigate("/applications");
          }, children: t("nav.applications") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(Briefcase, {}), onClick: () => {
            close();
            navigate("/saved");
          }, children: t("nav.saved") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(User, {}), onClick: () => {
            close();
            navigate("/profile");
          }, children: t("nav.profile") })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(LayoutDashboard, {}), onClick: () => {
            close();
            navigate("/employer");
          }, children: t("nav.dashboard") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(Briefcase, {}), onClick: () => {
            close();
            navigate("/employer/jobs");
          }, children: t("nav.myJobs") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(Users, {}), onClick: () => {
            close();
            navigate("/employer/applications");
          }, children: t("nav.candidates") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(Plus, {}), onClick: () => {
            close();
            navigate("/employer/jobs/new");
          }, children: t("nav.postJob") }),
          /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(Building2, {}), onClick: () => {
            close();
            navigate("/employer/company");
          }, children: t("nav.company") })
        ] }),
        isAdmin ? /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(ShieldCheck, {}), onClick: () => {
          close();
          navigate("/admin");
        }, children: t("nav.admin") }) : null,
        /* @__PURE__ */ jsx(DropdownItem, { icon: /* @__PURE__ */ jsx(Settings, {}), onClick: () => {
          close();
          navigate("/settings");
        }, children: t("nav.settings") }),
        /* @__PURE__ */ jsx(DropdownDivider, {}),
        /* @__PURE__ */ jsx(
          DropdownItem,
          {
            icon: /* @__PURE__ */ jsx(LogOut, {}),
            danger: true,
            onClick: async () => {
              close();
              await logout();
              navigate("/");
            },
            children: t("nav.signOut")
          }
        )
      ] })
    }
  );
}
function Navbar() {
  const { t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const publicLinks = [
    { to: "/jobs", label: t("nav.jobs") },
    { to: "/companies", label: t("nav.companies") },
    { to: "/for-employers", label: t("nav.employers") }
  ];
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "lj-container flex h-16 items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(Logo, {}),
        /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-1 lg:flex", "aria-label": "Main", children: [
          publicLinks.map((link) => /* @__PURE__ */ jsx(NavItem, { to: link.to, children: link.label }, link.to)),
          user && user.role === "job_seeker" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(NavItem, { to: "/dashboard", children: t("nav.dashboard") }),
            /* @__PURE__ */ jsx(NavItem, { to: "/applications", children: t("nav.applications") }),
            /* @__PURE__ */ jsx(NavItem, { to: "/saved", children: t("nav.saved") })
          ] }) : null,
          user && (user.role === "employer" || isAdmin) ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(NavItem, { to: "/employer", children: t("nav.dashboard") }),
            /* @__PURE__ */ jsx(NavItem, { to: "/employer/jobs", children: t("nav.myJobs") }),
            /* @__PURE__ */ jsx(NavItem, { to: "/employer/applications", children: t("nav.candidates") })
          ] }) : null,
          isAdmin ? /* @__PURE__ */ jsx(NavItem, { to: "/admin", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 15 }),
            " ",
            t("nav.admin")
          ] }) }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        user ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-1 sm:flex", children: [
            /* @__PURE__ */ jsx(ThemeToggle$1, {}),
            /* @__PURE__ */ jsx(LanguageSwitcher, {})
          ] }),
          /* @__PURE__ */ jsx(NotificationsMenu, {}),
          user.role === "employer" || isAdmin ? /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs/new", size: "sm", className: "hidden md:inline-flex", icon: /* @__PURE__ */ jsx(Plus, { size: 15 }), children: t("nav.postJob") }) : null,
          /* @__PURE__ */ jsx(UserMenu, {})
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-1 sm:flex", children: [
            /* @__PURE__ */ jsx(ThemeToggle$1, {}),
            /* @__PURE__ */ jsx(LanguageSwitcher, {})
          ] }),
          /* @__PURE__ */ jsx(ButtonLink, { to: "/login", variant: "ghost", size: "sm", className: "hidden sm:inline-flex", children: t("nav.signIn") }),
          /* @__PURE__ */ jsx(ButtonLink, { to: "/register", size: "sm", children: t("nav.createAccount") })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setMobileOpen(true),
            className: "grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg lg:hidden",
            "aria-label": t("nav.menu"),
            "aria-expanded": mobileOpen,
            children: /* @__PURE__ */ jsx(Menu, { size: 20 })
          }
        )
      ] })
    ] }),
    mobileOpen ? /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[80] lg:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/55", onClick: () => setMobileOpen(false), "aria-hidden": true }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-line bg-card shadow-pop", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-line px-5 py-4", children: [
          /* @__PURE__ */ jsx(Logo, {}),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setMobileOpen(false),
              className: "rounded-md p-1.5 text-subtle hover:bg-card-2 hover:text-fg",
              "aria-label": t("common.close"),
              children: /* @__PURE__ */ jsx(X, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-1 overflow-y-auto px-3 py-4", "aria-label": "Mobile", children: [
          ...publicLinks,
          ...(user == null ? void 0 : user.role) === "job_seeker" ? [
            { to: "/dashboard", label: t("nav.dashboard") },
            { to: "/applications", label: t("nav.applications") },
            { to: "/saved", label: t("nav.saved") },
            { to: "/profile", label: t("nav.profile") }
          ] : [],
          ...user && (user.role === "employer" || isAdmin) ? [
            { to: "/employer", label: t("nav.dashboard") },
            { to: "/employer/jobs", label: t("nav.myJobs") },
            { to: "/employer/applications", label: t("nav.candidates") },
            { to: "/employer/jobs/new", label: t("nav.postJob") },
            { to: "/employer/company", label: t("nav.company") }
          ] : [],
          ...isAdmin ? [{ to: "/admin", label: t("nav.admin") }] : [],
          ...user ? [{ to: "/settings", label: t("nav.settings") }] : []
        ].map((link) => /* @__PURE__ */ jsx(
          NavLink,
          {
            to: link.to,
            onClick: () => setMobileOpen(false),
            className: ({ isActive }) => cn(
              "block rounded-md px-3.5 py-3 text-[15px] font-medium transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-fg hover:bg-card-2"
            ),
            children: link.label
          },
          `${link.to}-${link.label}`
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 border-t border-line px-4 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(ThemeToggle$1, {}),
            /* @__PURE__ */ jsx(LanguageSwitcher, {})
          ] }),
          user ? /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              fullWidth: true,
              icon: /* @__PURE__ */ jsx(LogOut, { size: 16 }),
              onClick: async () => {
                setMobileOpen(false);
                await logout();
                navigate("/");
              },
              children: t("nav.signOut")
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsx(ButtonLink, { to: "/login", variant: "secondary", onClick: () => setMobileOpen(false), children: t("nav.signIn") }),
            /* @__PURE__ */ jsx(ButtonLink, { to: "/register", onClick: () => setMobileOpen(false), children: t("nav.createAccount") })
          ] })
        ] })
      ] })
    ] }) : null
  ] });
}
function DashboardLayout() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const seekerNav = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 17 }) },
    { to: "/applications", label: t("nav.applications"), icon: /* @__PURE__ */ jsx(FileText, { size: 17 }) },
    { to: "/saved", label: t("nav.saved"), icon: /* @__PURE__ */ jsx(Bookmark, { size: 17 }) },
    { to: "/profile", label: t("nav.profile"), icon: /* @__PURE__ */ jsx(User, { size: 17 }) },
    { to: "/settings", label: t("nav.settings"), icon: /* @__PURE__ */ jsx(Settings, { size: 17 }) }
  ];
  const employerNav = [
    { to: "/employer", label: t("nav.dashboard"), icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 17 }) },
    { to: "/employer/jobs", label: t("nav.myJobs"), icon: /* @__PURE__ */ jsx(Briefcase, { size: 17 }) },
    { to: "/employer/applications", label: t("nav.candidates"), icon: /* @__PURE__ */ jsx(Users, { size: 17 }) },
    { to: "/employer/jobs/new", label: t("nav.postJob"), icon: /* @__PURE__ */ jsx(Plus, { size: 17 }) },
    { to: "/settings", label: t("nav.settings"), icon: /* @__PURE__ */ jsx(Settings, { size: 17 }) }
  ];
  const items = (user == null ? void 0 : user.role) === "employer" ? employerNav : seekerNav;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-bg-soft", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "lj-container flex flex-1 gap-8 py-6 lg:py-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden w-60 shrink-0 lg:block", children: /* @__PURE__ */ jsxs("nav", { className: "sticky top-24 space-y-1", "aria-label": "Dashboard", children: [
        items.map((item) => /* @__PURE__ */ jsxs(
          NavLink,
          {
            to: item.to,
            end: item.to === "/employer" || item.to === "/dashboard",
            className: ({ isActive }) => cn(
              "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-card hover:text-fg"
            ),
            children: [
              item.icon,
              item.label
            ]
          },
          item.to
        )),
        isAdmin ? /* @__PURE__ */ jsxs(
          NavLink,
          {
            to: "/admin",
            className: ({ isActive }) => cn(
              "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-accent/10 text-accent" : "text-muted hover:bg-card hover:text-fg"
            ),
            children: [
              /* @__PURE__ */ jsx(ShieldCheck, { size: 17 }),
              t("nav.admin")
            ]
          }
        ) : null
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 pb-20 lg:pb-0", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 backdrop-blur lg:hidden",
        "aria-label": "Mobile dashboard navigation",
        children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4", children: items.slice(0, 4).map((item) => /* @__PURE__ */ jsxs(
          NavLink,
          {
            to: item.to,
            end: item.to === "/employer" || item.to === "/dashboard",
            className: ({ isActive }) => cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              isActive ? "text-primary" : "text-subtle"
            ),
            children: [
              item.icon,
              /* @__PURE__ */ jsx("span", { className: "truncate px-1", children: item.label })
            ]
          },
          item.to
        )) })
      }
    )
  ] });
}
function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: toggleTheme,
      className: className ?? "grid h-10 w-10 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-fg",
      "aria-label": theme === "dark" ? t("nav.lightTheme") : t("nav.darkTheme"),
      title: theme === "dark" ? t("nav.lightTheme") : t("nav.darkTheme"),
      children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { size: 18 }) : /* @__PURE__ */ jsx(Moon, { size: 18 })
    }
  );
}
function AuthLayout() {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen lg:grid-cols-[1.05fr_1fr]", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden overflow-hidden bg-[rgb(var(--bg-soft))] p-10 lg:flex lg:flex-col lg:justify-between", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-35 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--primary)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--accent)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "relative flex items-center gap-2.5", "aria-label": "LocalJob", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-base font-extrabold text-white", children: "LJ" }),
        /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold tracking-tight text-fg", children: [
          "Local",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Job" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-md", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight text-fg", children: t("hero.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-[15px] leading-relaxed text-muted", children: t("hero.subtitle") }),
        /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-3.5", children: [
          { icon: /* @__PURE__ */ jsx(Users, { size: 16 }), text: t("how.step1.text") },
          { icon: /* @__PURE__ */ jsx(Sparkles, { size: 16 }), text: t("how.step2.text") },
          { icon: /* @__PURE__ */ jsx(BadgeCheck, { size: 16 }), text: t("how.step4.text") }
        ].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary", children: item.icon }),
          item.text
        ] }, item.text)) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "relative text-xs text-subtle", children: t("brand.tagline") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 lg:justify-end", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 lg:hidden", "aria-label": "LocalJob", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-white", children: "LJ" }),
          /* @__PURE__ */ jsxs("span", { className: "text-base font-bold tracking-tight text-fg", children: [
            "Local",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Job" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ThemeToggle, {})
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center px-5 pb-10", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsx(Outlet, {}) }) })
    ] })
  ] });
}
function AdminLayout() {
  const { t } = useLanguage();
  const items = [
    { to: "/admin", label: t("admin.overview"), icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 17 }), end: true },
    { to: "/admin/users", label: t("admin.users"), icon: /* @__PURE__ */ jsx(Users, { size: 17 }) },
    { to: "/admin/jobs", label: t("admin.jobs"), icon: /* @__PURE__ */ jsx(Briefcase, { size: 17 }) },
    { to: "/admin/applications", label: t("admin.applications"), icon: /* @__PURE__ */ jsx(BarChart3, { size: 17 }) },
    { to: "/admin/broadcast", label: t("admin.broadcast"), icon: /* @__PURE__ */ jsx(Megaphone, { size: 17 }) },
    { to: "/admin/activity", label: t("admin.activity"), icon: /* @__PURE__ */ jsx(Activity, { size: 17 }) }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-bg-soft", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "lj-container flex flex-1 flex-col gap-6 py-6 lg:flex-row lg:gap-8 lg:py-8", children: [
      /* @__PURE__ */ jsxs("aside", { className: "lg:w-56 lg:shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "lj-card mb-4 flex items-center gap-3 p-4", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-accent/12 text-accent", children: /* @__PURE__ */ jsx(Database, { size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-fg", children: "LocalJob" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: "admin.localjob.uz" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "lj-scroll-x lg:flex lg:flex-col lg:gap-1 lg:overflow-visible", "aria-label": "Admin", children: items.map((item) => /* @__PURE__ */ jsxs(
          NavLink,
          {
            to: item.to,
            end: item.end,
            className: ({ isActive }) => cn(
              "flex shrink-0 items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-card hover:text-fg lg:bg-transparent"
            ),
            children: [
              item.icon,
              item.label
            ]
          },
          item.to
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
function Footer() {
  const { t } = useLanguage();
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const columns = [
    {
      title: t("footer.product"),
      links: [
        { to: "/jobs", label: t("nav.jobs") },
        { to: "/companies", label: t("nav.companies") },
        { to: "/for-employers", label: t("nav.employers") },
        { to: "/how-it-works", label: t("nav.howItWorks") }
      ]
    },
    {
      title: t("footer.company"),
      links: [
        { to: "/about", label: t("footer.about") },
        { to: "/contact", label: t("footer.contact") },
        { to: "/jobs?category=IT", label: t("nav.jobs") },
        { to: "/register", label: t("nav.createAccount") }
      ]
    },
    {
      title: t("footer.legal"),
      links: [
        { to: "/privacy", label: t("footer.privacy") },
        { to: "/terms", label: t("footer.terms") },
        { to: "/settings", label: t("nav.settings") }
      ]
    }
  ];
  return /* @__PURE__ */ jsx("footer", { className: "mt-16 border-t border-line bg-bg-soft", children: /* @__PURE__ */ jsxs("div", { className: "lj-container py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5", "aria-label": "LocalJob", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-[15px] font-extrabold text-white", children: "LJ" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[17px] font-bold tracking-tight text-fg", children: [
            "Local",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Job" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xs text-sm leading-relaxed text-muted", children: t("brand.tagline") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://t.me/LocalJobUzBot",
              target: "_blank",
              rel: "noreferrer",
              className: "grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary",
              "aria-label": "Telegram",
              children: /* @__PURE__ */ jsx(Send, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com",
              target: "_blank",
              rel: "noreferrer",
              className: "grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary",
              "aria-label": "GitHub",
              children: /* @__PURE__ */ jsx(Github, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://linkedin.com",
              target: "_blank",
              rel: "noreferrer",
              className: "grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary",
              "aria-label": "LinkedIn",
              children: /* @__PURE__ */ jsx(Linkedin, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:support@localjob.uz",
              className: "grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary",
              "aria-label": "Email",
              children: /* @__PURE__ */ jsx(Mail, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs text-subtle", children: t("footer.botText") })
      ] }),
      columns.map((column) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-fg", children: column.title }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2.5", children: column.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: link.to, className: "text-sm text-muted transition-colors hover:text-primary", children: link.label }) }, `${column.title}-${link.to}-${link.label}`)) })
      ] }, column.title))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        year,
        " LocalJob. ",
        t("footer.rights")
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "transition-colors hover:text-fg", children: t("footer.privacy") }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "·" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "transition-colors hover:text-fg", children: t("footer.terms") })
      ] })
    ] })
  ] }) });
}
function MainLayout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#main",
        className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-fg",
        children: "Skip to content"
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function Card({ children, className, as: Tag = "div" }) {
  return /* @__PURE__ */ jsx(Tag, { className: cn("lj-card", className), children });
}
function SectionHeading({
  title,
  subtitle,
  action,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight text-fg sm:text-2xl", children: title }),
      subtitle ? /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: subtitle }) : null
    ] }),
    action
  ] });
}
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  variant = "default"
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-card/60 text-center",
        variant === "compact" ? "px-5 py-10" : "px-6 py-16"
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary", children: icon ?? /* @__PURE__ */ jsx(SearchX, { size: 24 }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-fg", children: title }),
        description ? /* @__PURE__ */ jsx("p", { className: "mt-1.5 max-w-md text-sm leading-relaxed text-muted", children: description }) : null,
        actionLabel ? /* @__PURE__ */ jsx("div", { className: "mt-5", children: actionTo ? /* @__PURE__ */ jsx(ButtonLink, { to: actionTo, size: "sm", children: actionLabel }) : /* @__PURE__ */ jsx(Button, { size: "sm", onClick: onAction, children: actionLabel }) }) : null
      ]
    }
  );
}
function Spinner({ className, label }) {
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-2 text-sm text-muted", className), role: "status", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }),
    label
  ] });
}
function Skeleton({ className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("lj-skeleton", className), "aria-hidden": true });
}
function JobCardSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "lj-card p-4 sm:p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-12 rounded-md" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2.5", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/3" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24 rounded-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-16 rounded-full" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-28" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-24" })
    ] })
  ] });
}
function ListSkeleton({ count = 4, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-3", className), children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsx(JobCardSkeleton, {}, index)) });
}
function StatsSkeleton({ count = 4 }) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsxs("div", { className: "lj-card p-4", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-20" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mt-3 h-7 w-14" })
  ] }, index)) });
}
function Pagination({
  page,
  pages,
  onChange,
  labels
}) {
  if (pages <= 1) return null;
  const windowSize = 2;
  const items = [];
  for (let index = 1; index <= pages; index += 1) {
    if (index === 1 || index === pages || Math.abs(index - page) <= windowSize) {
      items.push(index);
    } else if (items[items.length - 1] !== "gap") {
      items.push("gap");
    }
  }
  return /* @__PURE__ */ jsxs("nav", { className: "flex flex-wrap items-center justify-center gap-1.5", "aria-label": "Pagination", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(page - 1),
        disabled: page <= 1,
        className: "inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-card px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50",
        children: labels.prev
      }
    ),
    items.map(
      (item, index) => item === "gap" ? /* @__PURE__ */ jsx("span", { className: "px-1 text-subtle", children: "…" }, `gap-${index}`) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(item),
          "aria-current": item === page ? "page" : void 0,
          className: cn(
            "h-9 min-w-9 rounded-md border px-2.5 text-sm font-medium transition-colors",
            item === page ? "border-primary bg-primary text-primary-fg" : "border-line bg-card text-muted hover:border-line-strong hover:text-fg"
          ),
          children: item
        },
        item
      )
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(page + 1),
        disabled: page >= pages,
        className: "inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-card px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50",
        children: labels.next
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "ml-1 hidden text-xs text-subtle sm:inline", children: [
      labels.page,
      " ",
      page,
      " ",
      labels.of,
      " ",
      pages
    ] })
  ] });
}
function Tabs({
  tabs,
  value,
  onChange,
  className
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("lj-scroll-x", className), role: "tablist", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": value === tab.value,
      onClick: () => onChange(tab.value),
      className: cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
        value === tab.value ? "border-primary bg-primary/10 text-primary" : "border-line bg-card text-muted hover:border-line-strong hover:text-fg"
      ),
      children: [
        tab.label,
        typeof tab.count === "number" ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-card-2 px-1.5 text-[11px] text-subtle", children: tab.count }) : null
      ]
    },
    tab.value
  )) });
}
function Breadcrumbs({ items }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "flex flex-wrap items-center gap-1.5 text-xs text-subtle", children: items.map((item, index) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
    index > 0 ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "/" }) : null,
    item.to ? /* @__PURE__ */ jsx("a", { href: item.to, className: "transition-colors hover:text-fg", children: item.label }) : /* @__PURE__ */ jsx("span", { className: "text-muted", children: item.label })
  ] }, `${item.label}-${index}`)) });
}
function ProtectedRoute({
  children,
  roles,
  requireAdmin
}) {
  const { user, loading, isAdmin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "grid min-h-[60vh] place-items-center", children: /* @__PURE__ */ jsx(Spinner, { label: t("common.loading") }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
  }
  if (requireAdmin && !isAdmin) {
    return /* @__PURE__ */ jsx("div", { className: "lj-container py-16", children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(ShieldAlert, { size: 24 }),
        title: t("admin.noAccess"),
        description: t("error.unauthorized"),
        actionLabel: t("common.goHome"),
        actionTo: "/"
      }
    ) });
  }
  if (roles && roles.length > 0 && !roles.includes(user.role) && !isAdmin) {
    return /* @__PURE__ */ jsx("div", { className: "lj-container py-16", children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(ShieldAlert, { size: 24 }),
        title: t("error.unauthorized"),
        description: t("dashboard.subtitle"),
        actionLabel: t("common.goHome"),
        actionTo: "/"
      }
    ) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
let cache = null;
const listeners = /* @__PURE__ */ new Set();
function useMeta() {
  const [meta, setMeta] = useState(cache);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    let active = true;
    const listener = (value) => {
      if (active) setMeta(value);
    };
    listeners.add(listener);
    if (cache) {
      setMeta(cache);
      setLoading(false);
    } else {
      backend.meta().then((value) => {
        cache = value;
        listeners.forEach((item) => item(value));
      }).catch(() => void 0).finally(() => {
        if (active) setLoading(false);
      });
    }
    return () => {
      active = false;
      listeners.delete(listener);
    };
  }, []);
  return { meta, loading };
}
function SearchBar({
  initialSearch = "",
  initialLocation = "",
  size = "lg",
  className
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { meta } = useMeta();
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: submit,
      role: "search",
      className: cn(
        "flex w-full flex-col gap-2 rounded-lg border border-line bg-card p-2 shadow-card sm:flex-row sm:items-center",
        size === "lg" && "sm:p-2.5",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("label", { className: "flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-3 py-2 focus-within:bg-card-2 sm:py-2.5", children: [
          /* @__PURE__ */ jsx(Search, { size: 18, className: "shrink-0 text-subtle", "aria-hidden": true }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("hero.searchPlaceholder") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: t("hero.searchHint"),
              className: "w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none",
              "aria-label": t("hero.searchPlaceholder")
            }
          )
        ] }),
        /* @__PURE__ */ jsx("span", { className: "hidden h-8 w-px bg-line sm:block", "aria-hidden": true }),
        /* @__PURE__ */ jsxs("label", { className: "flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-3 py-2 focus-within:bg-card-2 sm:py-2.5", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 18, className: "shrink-0 text-subtle", "aria-hidden": true }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("hero.locationPlaceholder") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: location,
              onChange: (event) => setLocation(event.target.value),
              placeholder: t("hero.locationHint"),
              list: "localjob-locations",
              className: "w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none",
              "aria-label": t("hero.locationPlaceholder")
            }
          ),
          /* @__PURE__ */ jsx("datalist", { id: "localjob-locations", children: ((meta == null ? void 0 : meta.locations) ?? []).map((item) => /* @__PURE__ */ jsx("option", { value: item }, item)) })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", size: size === "lg" ? "lg" : "md", className: "sm:px-6", children: t("hero.search") })
      ]
    }
  );
}
const ToastContext = createContext(null);
const ICONS$1 = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
};
const TONES = {
  success: "border-success/35 bg-card text-fg",
  error: "border-danger/40 bg-card text-fg",
  info: "border-accent/40 bg-card text-fg",
  warning: "border-warning/40 bg-card text-fg"
};
const ICON_TONES = {
  success: "text-success",
  error: "text-danger",
  info: "text-accent",
  warning: "text-warning"
};
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);
  const toast = useCallback(
    ({ title, description, variant = "info" }) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-3), { id, title, description, variant }]);
      window.setTimeout(() => dismiss(id), variant === "error" ? 6500 : 4200);
    },
    [dismiss]
  );
  const value = useMemo(
    () => ({
      toast,
      dismiss,
      success: (title, description) => toast({ title, description, variant: "success" }),
      error: (title, description) => toast({ title, description, variant: "error" }),
      info: (title, description) => toast({ title, description, variant: "info" })
    }),
    [toast, dismiss]
  );
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end",
        role: "region",
        "aria-live": "polite",
        "aria-label": "Notifications",
        children: toasts.map((item) => {
          const Icon = ICONS$1[item.variant];
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-3.5 shadow-pop animate-slide-up",
                TONES[item.variant]
              ),
              role: "status",
              children: [
                /* @__PURE__ */ jsx(Icon, { className: cn("mt-0.5 h-4.5 w-4.5 shrink-0", ICON_TONES[item.variant]), size: 18, "aria-hidden": true }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-tight", children: item.title }),
                  item.description ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted", children: item.description }) : null
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => dismiss(item.id),
                    className: "rounded-md p-1 text-subtle transition-colors hover:bg-card-2 hover:text-fg",
                    "aria-label": "Dismiss notification",
                    children: /* @__PURE__ */ jsx(X, { size: 14 })
                  }
                )
              ]
            },
            item.id
          );
        })
      }
    )
  ] });
}
function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
function useSavedJobs() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState(/* @__PURE__ */ new Set());
  const [pending, setPending] = useState(/* @__PURE__ */ new Set());
  const load = useCallback(async () => {
    if (!user) {
      setSavedIds(/* @__PURE__ */ new Set());
      return;
    }
    try {
      const data = await backend.savedJobs();
      setSavedIds(new Set(data.items.map((row) => row.jobId)));
    } catch {
      setSavedIds(/* @__PURE__ */ new Set());
    }
  }, [user]);
  useEffect(() => {
    void load();
  }, [load]);
  const toggle = useCallback(
    async (jobId) => {
      if (!user) {
        toast.info(t("error.loginToApply"));
        navigate("/login");
        return;
      }
      setPending((current) => new Set(current).add(jobId));
      const isSaved = savedIds.has(jobId);
      try {
        if (isSaved) {
          await backend.unsaveJob(jobId);
          setSavedIds((current) => {
            const next = new Set(current);
            next.delete(jobId);
            return next;
          });
          toast.info(t("jobs.unsavedJob"));
        } else {
          await backend.saveJob(jobId);
          setSavedIds((current) => new Set(current).add(jobId));
          toast.success(t("jobs.savedJob"));
        }
      } catch {
        toast.error(t("error.generic"));
      } finally {
        setPending((current) => {
          const next = new Set(current);
          next.delete(jobId);
          return next;
        });
      }
    },
    [navigate, savedIds, t, toast, user]
  );
  return { savedIds, toggle, pending, reload: load, isSaved: (id) => savedIds.has(id) };
}
function JobCard({ job, compact }) {
  var _a, _b, _c;
  const { t, lang } = useLanguage();
  const { isSaved, toggle, pending } = useSavedJobs();
  const saved = isSaved(job.id);
  return /* @__PURE__ */ jsx(
    "article",
    {
      className: cn(
        "lj-card group relative p-4 transition-all hover:border-line-strong hover:shadow-pop sm:p-5",
        compact && "p-4 sm:p-4"
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
        /* @__PURE__ */ jsx(CompanyLogo, { name: (_a = job.company) == null ? void 0 : _a.name, logo: (_b = job.company) == null ? void 0 : _b.logo, color: (_c = job.company) == null ? void 0 : _c.color, size: compact ? 42 : 48 }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "truncate text-[15px] font-semibold leading-snug text-fg sm:text-base", children: /* @__PURE__ */ jsx(Link, { to: `/jobs/${job.id}`, className: "transition-colors hover:text-primary", children: job.title }) }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 truncate text-sm text-muted", children: job.company ? /* @__PURE__ */ jsx(Link, { to: `/company/${job.company.id}`, className: "transition-colors hover:text-primary", children: job.company.name }) : "LocalJob" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => void toggle(job.id),
                disabled: pending.has(job.id),
                "aria-label": saved ? t("jobs.saved") : t("jobs.save"),
                "aria-pressed": saved,
                className: cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-md border transition-colors",
                  saved ? "border-primary/40 bg-primary/10 text-primary" : "border-line bg-card text-subtle hover:border-primary/40 hover:text-primary"
                ),
                children: saved ? /* @__PURE__ */ jsx(BookmarkCheck, { size: 16 }) : /* @__PURE__ */ jsx(Bookmark, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 13, className: "text-subtle", "aria-hidden": true }),
              " ",
              job.location
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Wallet, { size: 13, className: "text-subtle", "aria-hidden": true }),
              " ",
              job.salaryLabel
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Clock, { size: 13, className: "text-subtle", "aria-hidden": true }),
              " ",
              relativeTime(job.createdAt, lang)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Badge, { tone: "primary", children: employmentLabel(String(job.employmentType), lang) }),
            /* @__PURE__ */ jsx(Badge, { children: experienceLabel(String(job.experienceLevel), lang) }),
            /* @__PURE__ */ jsx(Badge, { tone: "accent", children: categoryLabel(job.category, lang) }),
            job.isRemote ? /* @__PURE__ */ jsx(Badge, { tone: "info", children: "Remote" }) : null,
            job.hasApplied ? /* @__PURE__ */ jsx(Badge, { tone: "success", icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }), children: t("jobs.applied") }) : null,
            typeof job.matchScore === "number" && job.matchScore > 0 ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent", children: t("jobs.match", { score: job.matchScore }) }) : null
          ] }),
          !compact && job.excerpt ? /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-2 text-sm leading-relaxed text-muted", children: job.excerpt }) : null,
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/jobs/${job.id}`,
                className: "inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-fg transition-colors hover:bg-primary-hover",
                children: t("jobs.viewJob")
              }
            ),
            /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => void toggle(job.id), disabled: pending.has(job.id), children: saved ? t("jobs.saved") : t("jobs.save") })
          ] })
        ] })
      ] })
    }
  );
}
function CompanyCard({ company }) {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/company/${company.id}`,
      className: "lj-card group flex flex-col p-5 transition-all hover:border-line-strong hover:shadow-pop",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
          /* @__PURE__ */ jsx(CompanyLogo, { name: company.name, logo: company.logo, color: company.color, size: 46 }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "truncate text-[15px] font-semibold text-fg group-hover:text-primary", children: company.name }),
              company.verified ? /* @__PURE__ */ jsx(VerifiedBadge, { label: "" }) : null
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-sm text-muted", children: company.industry }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 inline-flex items-center gap-1.5 text-xs text-subtle", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 12, "aria-hidden": true }),
              " ",
              company.location
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-line pt-3.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-muted", children: [
            company.openJobsCount ?? 0,
            " ",
            t("company.openJobs").toLowerCase()
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-primary", children: [
            t("common.viewAll"),
            " ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 13 })
          ] })
        ] })
      ]
    }
  );
}
const ICONS = {
  code: /* @__PURE__ */ jsx(Code2, { size: 18 }),
  palette: /* @__PURE__ */ jsx(Palette, { size: 18 }),
  megaphone: /* @__PURE__ */ jsx(Megaphone, { size: 18 }),
  "trending-up": /* @__PURE__ */ jsx(TrendingUp, { size: 18 }),
  handshake: /* @__PURE__ */ jsx(Handshake, { size: 18 }),
  landmark: /* @__PURE__ */ jsx(Landmark, { size: 18 }),
  "graduation-cap": /* @__PURE__ */ jsx(GraduationCap, { size: 18 }),
  headphones: /* @__PURE__ */ jsx(Headphones, { size: 18 })
};
function LandingPage() {
  var _a, _b;
  const { t, lang } = useLanguage();
  const { meta } = useMeta();
  const featured = useAsync(
    () => backend.jobs({ pageSize: 6, sort: "relevant" }),
    []
  );
  const companies2 = useAsync(() => backend.companies({}), []);
  const labelFor = (item) => lang === "uz" ? item.label_uz : lang === "ru" ? item.label_ru : item.label_en;
  const steps = [
    { icon: /* @__PURE__ */ jsx(UserPlus, { size: 18 }), title: t("how.step1.title"), text: t("how.step1.text") },
    { icon: /* @__PURE__ */ jsx(Briefcase, { size: 18 }), title: t("how.step2.title"), text: t("how.step2.text") },
    { icon: /* @__PURE__ */ jsx(Sparkles, { size: 18 }), title: t("how.step3.title"), text: t("how.step3.text") },
    { icon: /* @__PURE__ */ jsx(BadgeCheck, { size: 18 }), title: t("how.step4.title"), text: t("how.step4.text") }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-line bg-bg-soft", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--primary)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full opacity-25 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--accent)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "lj-container relative py-14 sm:py-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-muted", children: [
            /* @__PURE__ */ jsx(Users, { size: 14, className: "text-primary", "aria-hidden": true }),
            t("hero.badge")
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight text-fg sm:text-5xl", children: t("hero.title") }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base", children: t("hero.subtitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto mt-8 max-w-4xl", children: /* @__PURE__ */ jsx(SearchBar, {}) }),
        /* @__PURE__ */ jsx("dl", { className: "mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4", children: [
          { label: t("hero.stat.jobs"), value: meta ? "37+" : "—" },
          { label: t("hero.stat.companies"), value: meta ? "8" : "—" },
          { label: t("hero.stat.candidates"), value: "12k+" },
          { label: t("hero.stat.hires"), value: "3.4k" }
        ].map((stat) => /* @__PURE__ */ jsxs("div", { className: "lj-card p-4 text-center", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: stat.label }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1.5 text-xl font-bold text-fg", children: stat.value })
        ] }, stat.label)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "lj-container py-12 sm:py-16", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: t("popular.title"),
          subtitle: t("popular.subtitle"),
          action: /* @__PURE__ */ jsx(ButtonLink, { to: "/jobs", variant: "ghost", size: "sm", iconRight: /* @__PURE__ */ jsx(ArrowRight, { size: 15 }), children: t("featured.viewAll") })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: ((meta == null ? void 0 : meta.popularCategories) ?? []).map((category) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/jobs?category=${encodeURIComponent(category.key)}`,
          className: "lj-card group flex items-center gap-3 p-4 transition-all hover:border-primary/40 hover:shadow-pop",
          children: [
            /* @__PURE__ */ jsx("span", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-fg", children: ICONS[category.icon] ?? /* @__PURE__ */ jsx(Briefcase, { size: 18 }) }),
            /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "block truncate text-sm font-semibold text-fg", children: labelFor(category) }),
              /* @__PURE__ */ jsxs("span", { className: "mt-0.5 block text-xs text-subtle", children: [
                category.count,
                " ",
                t("nav.jobs").toLowerCase()
              ] })
            ] })
          ]
        },
        category.key
      )) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "border-y border-line bg-bg-soft py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "lj-container", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: t("featured.title"),
          subtitle: t("featured.subtitle"),
          action: /* @__PURE__ */ jsx(ButtonLink, { to: "/jobs", variant: "secondary", size: "sm", iconRight: /* @__PURE__ */ jsx(ArrowRight, { size: 15 }), children: t("featured.viewAll") })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-4 lg:grid-cols-2", children: featured.loading ? Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsxs("div", { className: "lj-card p-5", children: [
        /* @__PURE__ */ jsx("div", { className: "lj-skeleton h-4 w-2/3" }),
        /* @__PURE__ */ jsx("div", { className: "lj-skeleton mt-3 h-3 w-1/3" })
      ] }, index)) : (((_a = featured.data) == null ? void 0 : _a.items) ?? []).map((job) => /* @__PURE__ */ jsx(JobCard, { job }, job.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "lj-container py-12 sm:py-16", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: t("companies.title"),
          subtitle: t("companies.subtitle"),
          action: /* @__PURE__ */ jsx(ButtonLink, { to: "/companies", variant: "ghost", size: "sm", iconRight: /* @__PURE__ */ jsx(ArrowRight, { size: 15 }), children: t("common.viewAll") })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        (((_b = companies2.data) == null ? void 0 : _b.items) ?? []).slice(0, 4).map((company) => /* @__PURE__ */ jsx(CompanyCard, { company }, company.id)),
        companies2.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 2, className: "sm:col-span-2 lg:col-span-4" }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "border-y border-line bg-bg-soft py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "lj-container", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("how.title"), subtitle: t("how.subtitle") }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "lj-card relative p-5", children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-4 top-4 text-3xl font-extrabold text-line", children: index + 1 }),
        /* @__PURE__ */ jsx("span", { className: "grid h-11 w-11 place-items-center rounded-md bg-accent/12 text-accent", children: step.icon }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-[15px] font-semibold text-fg", children: step.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted", children: step.text })
      ] }, step.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "lj-container py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-xl border border-line bg-card p-8 sm:p-12", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--primary)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-line bg-card-2 px-3 py-1 text-xs font-medium text-muted", children: [
            /* @__PURE__ */ jsx(Building2, { size: 13 }),
            " ",
            t("nav.employers")
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 text-2xl font-bold tracking-tight text-fg sm:text-3xl", children: t("cta.title") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-sm leading-relaxed text-muted sm:text-[15px]", children: t("cta.text") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row", children: [
          /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs/new", size: "lg", children: t("cta.postJob") }),
          /* @__PURE__ */ jsx(ButtonLink, { to: "/for-employers", variant: "secondary", size: "lg", children: t("cta.learnMore") })
        ] })
      ] })
    ] }) })
  ] });
}
const DEFAULT_FILTERS = {
  search: "",
  location: "",
  categories: [],
  employmentTypes: [],
  experienceLevels: [],
  salaryMin: null,
  salaryMax: null,
  remote: false,
  sort: "recent",
  page: 1,
  pageSize: 10
};
function useJobSearch() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filters = useMemo(() => {
    const read = (key) => params.get(key) ?? "";
    const list = (key) => read(key).split(",").filter(Boolean);
    const sort = read("sort");
    return {
      search: read("search"),
      location: read("location"),
      categories: list("category"),
      employmentTypes: list("employmentType"),
      experienceLevels: list("experienceLevel"),
      salaryMin: read("salaryMin") ? Number(read("salaryMin")) : null,
      salaryMax: read("salaryMax") ? Number(read("salaryMax")) : null,
      remote: read("remote") === "1" || read("remote") === "true",
      sort: sort === "salary" || sort === "relevant" ? sort : "recent",
      page: read("page") ? Math.max(1, Number(read("page"))) : 1,
      pageSize: 10
    };
  }, [params]);
  const write = useCallback(
    (patch2, replace = false) => {
      const next = { ...filters, ...patch2 };
      const search = new URLSearchParams();
      if (next.search) search.set("search", next.search);
      if (next.location) search.set("location", next.location);
      if (next.categories.length) search.set("category", next.categories.join(","));
      if (next.employmentTypes.length) search.set("employmentType", next.employmentTypes.join(","));
      if (next.experienceLevels.length) search.set("experienceLevel", next.experienceLevels.join(","));
      if (next.salaryMin) search.set("salaryMin", String(next.salaryMin));
      if (next.salaryMax) search.set("salaryMax", String(next.salaryMax));
      if (next.remote) search.set("remote", "1");
      if (next.sort && next.sort !== "recent") search.set("sort", next.sort);
      if (next.page && next.page > 1) search.set("page", String(next.page));
      setParams(search, { replace });
    },
    [filters, setParams]
  );
  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: false }), [setParams]);
  const activeFilterCount = filters.categories.length + filters.employmentTypes.length + filters.experienceLevels.length + (filters.remote ? 1 : 0) + (filters.salaryMin || filters.salaryMax ? 1 : 0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    backend.jobs({
      search: filters.search || void 0,
      location: filters.location || void 0,
      category: filters.categories.length ? filters.categories : void 0,
      employmentType: filters.employmentTypes.length ? filters.employmentTypes : void 0,
      experienceLevel: filters.experienceLevels.length ? filters.experienceLevels : void 0,
      salaryMin: filters.salaryMin || void 0,
      salaryMax: filters.salaryMax || void 0,
      remote: filters.remote || void 0,
      sort: filters.sort,
      page: filters.page,
      pageSize: filters.pageSize
    }).then((result) => {
      if (active) setData(result);
    }).catch((caught) => {
      if (active) setError(caught);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [filters]);
  return { filters, data, loading, error, write, reset, activeFilterCount, defaults: DEFAULT_FILTERS };
}
function Label({
  htmlFor,
  children,
  hint,
  required,
  className
}) {
  return /* @__PURE__ */ jsxs("label", { htmlFor, className: cn("lj-label flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsxs("span", { children: [
      children,
      required ? /* @__PURE__ */ jsx("span", { className: "text-danger", children: " *" }) : null
    ] }),
    hint ? /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-subtle", children: hint }) : null
  ] });
}
function FieldError({ children }) {
  if (!children) return null;
  return /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger", role: "alert", children: [
    /* @__PURE__ */ jsx(AlertCircle, { size: 13, "aria-hidden": true }),
    children
  ] });
}
const Input = forwardRef(function Input2({ label, error, hint, icon, className, containerClassName, id, required, type = "text", ...props }, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: cn("w-full", containerClassName), children: [
    label ? /* @__PURE__ */ jsx(Label, { htmlFor: inputId, required, hint, children: label }) : null,
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      icon ? /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle", "aria-hidden": true, children: icon }) : null,
      /* @__PURE__ */ jsx(
        "input",
        {
          ref,
          id: inputId,
          type: isPassword && revealed ? "text" : type,
          "aria-invalid": Boolean(error),
          "aria-describedby": error ? `${inputId}-error` : void 0,
          className: cn(
            "lj-input",
            icon && "pl-10",
            isPassword && "pr-11",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          ),
          ...props
        }
      ),
      isPassword ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setRevealed((value) => !value),
          className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-subtle transition-colors hover:bg-card-2 hover:text-fg",
          "aria-label": revealed ? "Hide password" : "Show password",
          tabIndex: -1,
          children: revealed ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx("span", { id: `${inputId}-error`, children: /* @__PURE__ */ jsx(FieldError, { children: error }) })
  ] });
});
const Textarea = forwardRef(function Textarea2({ label, error, hint, className, id, required, counter, maxLength, value, ...props }, ref) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const length = typeof value === "string" ? value.length : 0;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label ? /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: textareaId, required, hint, children: label }),
      counter && maxLength ? /* @__PURE__ */ jsxs("span", { className: "mb-1.5 text-xs text-subtle", children: [
        length,
        "/",
        maxLength
      ] }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(
      "textarea",
      {
        ref,
        id: textareaId,
        value,
        maxLength,
        "aria-invalid": Boolean(error),
        className: cn(
          "w-full rounded-md border border-line bg-card px-3.5 py-3 text-sm text-fg placeholder:text-subtle transition-colors",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        ),
        rows: 4,
        ...props
      }
    ),
    /* @__PURE__ */ jsx(FieldError, { children: error })
  ] });
});
const Select = forwardRef(function Select2({ label, error, hint, options, placeholder, className, id, required, ...props }, ref) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label ? /* @__PURE__ */ jsx(Label, { htmlFor: selectId, required, hint, children: label }) : null,
    /* @__PURE__ */ jsxs(
      "select",
      {
        ref,
        id: selectId,
        className: cn(
          "h-11 w-full appearance-none rounded-md border border-line bg-card px-3.5 pr-9 text-sm text-fg transition-colors",
          `bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2394A4C2' stroke-width='1.8' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat`,
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
          error && "border-danger",
          className
        ),
        ...props,
        children: [
          placeholder ? /* @__PURE__ */ jsx("option", { value: "", children: placeholder }) : null,
          options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
        ]
      }
    ),
    /* @__PURE__ */ jsx(FieldError, { children: error })
  ] });
});
function Checkbox({
  checked,
  onChange,
  label,
  error,
  id
}) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          id: checkboxId,
          role: "checkbox",
          "aria-checked": checked,
          onClick: () => onChange(!checked),
          className: cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px] border transition-colors",
            checked ? "border-primary bg-primary text-primary-fg" : "border-line-strong bg-card hover:border-primary"
          ),
          children: checked ? /* @__PURE__ */ jsx(Check, { size: 13, strokeWidth: 3 }) : null
        }
      ),
      /* @__PURE__ */ jsx("label", { htmlFor: checkboxId, className: "cursor-pointer text-sm leading-snug text-muted", children: label })
    ] }),
    /* @__PURE__ */ jsx(FieldError, { children: error })
  ] });
}
function Switch({
  checked,
  onChange,
  label,
  description
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 py-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-fg", children: label }),
      description ? /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted", children: description }) : null
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        "aria-label": label,
        onClick: () => onChange(!checked),
        className: cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-line-strong"
        ),
        children: /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              checked ? "translate-x-[22px]" : "translate-x-0.5"
            )
          }
        )
      }
    )
  ] });
}
function FileUpload({
  file,
  onSelect,
  onClear,
  error,
  label,
  hint,
  chooseLabel,
  maxSizeMb = 5
}) {
  const inputId = useId();
  return /* @__PURE__ */ jsxs("div", { children: [
    label ? /* @__PURE__ */ jsx(Label, { htmlFor: inputId, children: label }) : null,
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-card-2 px-4 py-6 text-center transition-colors hover:border-primary/60",
          error && "border-danger"
        ),
        children: file ? /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between gap-3 rounded-md border border-line bg-card px-3 py-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Check, { size: 16 }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-left", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-fg", children: file.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-subtle", children: [
                (file.size / 1024).toFixed(0),
                " KB"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClear,
              className: "rounded-md p-1.5 text-subtle transition-colors hover:bg-card-2 hover:text-danger",
              "aria-label": "Remove file",
              children: /* @__PURE__ */ jsx(X, { size: 15 })
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(UploadCloud, { className: "mb-2 h-7 w-7 text-subtle", "aria-hidden": true }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: inputId,
              type: "file",
              accept: ".pdf,.doc,.docx,.txt,application/pdf",
              className: "sr-only",
              onChange: (event) => {
                var _a;
                const selected = (_a = event.target.files) == null ? void 0 : _a[0];
                if (selected) onSelect(selected);
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: inputId,
              className: "inline-flex h-9 cursor-pointer select-none items-center gap-1.5 rounded-md border border-line bg-card px-3 text-[13px] font-medium text-fg transition-colors hover:border-line-strong",
              children: chooseLabel
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-subtle", children: hint }),
          /* @__PURE__ */ jsxs("p", { className: "sr-only", children: [
            "Max size ",
            maxSizeMb,
            " MB"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(FieldError, { children: error })
  ] });
}
const SALARY_PRESETS = [
  { label: "≤ 8 mln", max: 8e6 },
  { label: "8–15 mln", min: 8e6, max: 15e6 },
  { label: "15–25 mln", min: 15e6, max: 25e6 },
  { label: "25 mln +", min: 25e6 }
];
function JobFiltersPanel({ filters, onChange, onReset, facets, className }) {
  var _a;
  const { t, lang } = useLanguage();
  const toggleValue = (key, value) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    onChange({ [key]: next, page: 1 });
  };
  const salaryMinChange = (event) => {
    const value = event.target.value ? Number(event.target.value) : null;
    onChange({ salaryMin: value, page: 1 });
  };
  const salaryMaxChange = (event) => {
    const value = event.target.value ? Number(event.target.value) : null;
    onChange({ salaryMax: value, page: 1 });
  };
  const activeCount = filters.categories.length + filters.employmentTypes.length + filters.experienceLevels.length + (filters.remote ? 1 : 0);
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-6", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: t("jobs.filters") }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx(RotateCcw, { size: 14 }), onClick: onReset, disabled: !activeCount, children: t("jobs.clear") })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle", children: t("jobs.category") }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: (((_a = facets == null ? void 0 : facets.categories) == null ? void 0 : _a.length) ? facets.categories.map((facet) => ({ value: facet.value, count: facet.count })) : []).map((item) => /* @__PURE__ */ jsxs(
        "label",
        {
          className: "flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-card-2",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "h-4 w-4 rounded border-line-strong accent-[rgb(var(--primary))]",
                  checked: filters.categories.includes(item.value),
                  onChange: () => toggleValue("categories", item.value)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted", children: categoryLabel(item.value, lang) })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-subtle", children: item.count })
          ]
        },
        item.value
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle", children: t("jobs.employmentType") }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: ((facets == null ? void 0 : facets.employmentTypes) ?? []).map((item) => /* @__PURE__ */ jsxs(
        "label",
        {
          className: "flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-card-2",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "h-4 w-4 rounded border-line-strong accent-[rgb(var(--primary))]",
                  checked: filters.employmentTypes.includes(item.value),
                  onChange: () => toggleValue("employmentTypes", item.value)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted", children: employmentLabel(item.value, lang) })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-subtle", children: item.count })
          ]
        },
        item.value
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle", children: t("jobs.experience") }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: ((facets == null ? void 0 : facets.experienceLevels) ?? []).map((item) => {
        const active = filters.experienceLevels.includes(item.value);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggleValue("experienceLevels", item.value),
            "aria-pressed": active,
            className: cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "border-primary bg-primary/10 text-primary" : "border-line bg-card text-muted hover:border-line-strong hover:text-fg"
            ),
            children: [
              experienceLabel(item.value, lang),
              " · ",
              item.count
            ]
          },
          item.value
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle", children: t("jobs.salaryRange") }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            inputMode: "numeric",
            placeholder: "Min",
            value: filters.salaryMin ?? "",
            onChange: salaryMinChange,
            "aria-label": `${t("jobs.salaryRange")} min`
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            inputMode: "numeric",
            placeholder: "Max",
            value: filters.salaryMax ?? "",
            onChange: salaryMaxChange,
            "aria-label": `${t("jobs.salaryRange")} max`
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: SALARY_PRESETS.map((preset) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange({ salaryMin: preset.min ?? null, salaryMax: preset.max ?? null, page: 1 }),
          className: "rounded-full border border-line bg-card px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-primary/40 hover:text-primary",
          children: preset.label
        },
        preset.label
      )) }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-[11px] text-subtle", children: filters.salaryMin || filters.salaryMax ? `${formatSalary(filters.salaryMin ?? 0)} — ${formatSalary(filters.salaryMax ?? 0)}` : "UZS" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "border-t border-line pt-4", children: /* @__PURE__ */ jsx(
      Checkbox,
      {
        checked: filters.remote,
        onChange: (checked) => onChange({ remote: checked, page: 1 }),
        label: t("jobs.remoteOnly")
      }
    ) })
  ] });
}
function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md"
}) {
  useBodyLock(open);
  useEffect(() => {
    if (!open) return;
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[90] flex items-end justify-center sm:items-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/55 backdrop-blur-[2px] animate-fade-in",
          onClick: onClose,
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : void 0,
          className: cn(
            "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl border border-line bg-card shadow-pop animate-slide-up sm:rounded-lg",
            widths[size]
          ),
          children: [
            (title || description) && /* @__PURE__ */ jsxs("header", { className: "flex items-start justify-between gap-4 border-b border-line px-5 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                title ? /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-fg", children: title }) : null,
                description ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted", children: description }) : null
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "rounded-md p-1.5 text-subtle transition-colors hover:bg-card-2 hover:text-fg",
                  "aria-label": "Close dialog",
                  children: /* @__PURE__ */ jsx(X, { size: 17 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-5 py-4", children }),
            footer ? /* @__PURE__ */ jsx("footer", { className: "border-t border-line bg-card-2 px-5 py-3.5", children: footer }) : null
          ]
        }
      )
    ] }),
    document.body
  );
}
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  loading,
  variant = "danger"
}) {
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open,
      onClose,
      title,
      size: "sm",
      footer: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: cancelLabel }),
        /* @__PURE__ */ jsx(Button, { variant, onClick: onConfirm, loading, children: confirmLabel })
      ] }),
      children: description ? /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted", children: description }) : null
    }
  );
}
function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer
}) {
  useBodyLock(open);
  if (!open) return null;
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[95] flex items-end md:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/55 animate-fade-in", onClick: onClose, "aria-hidden": true }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": title,
          className: "relative z-10 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-xl border-t border-line bg-card animate-slide-up",
          children: [
            /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-line px-5 py-3.5", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "rounded-md p-1.5 text-subtle transition-colors hover:bg-card-2 hover:text-fg",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(X, { size: 17 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-5 py-4", children }),
            footer ? /* @__PURE__ */ jsx("footer", { className: "border-t border-line bg-card-2 px-5 py-3.5", children: footer }) : null
          ]
        }
      )
    ] }),
    document.body
  );
}
function JobsPage() {
  const { t } = useLanguage();
  const { filters, data, loading, write, reset, activeFilterCount } = useJobSearch();
  const [sheetOpen, setSheetOpen] = useState(false);
  const facets = data == null ? void 0 : data.facets;
  return /* @__PURE__ */ jsxs("div", { className: "bg-bg-soft pb-16", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-16 z-30 border-b border-line bg-bg/95 backdrop-blur", children: /* @__PURE__ */ jsx("div", { className: "lj-container py-3.5", children: /* @__PURE__ */ jsx(SearchBar, { initialSearch: filters.search, initialLocation: filters.location, size: "md" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "lj-container py-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[280px_1fr]", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:block", children: /* @__PURE__ */ jsx("div", { className: "lj-card sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto p-5", children: /* @__PURE__ */ jsx(JobFiltersPanel, { filters, onChange: write, onReset: reset, facets }) }) }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-fg", children: t("jobs.title") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted", "aria-live": "polite", children: loading ? t("common.loading") : t("jobs.resultsCount", { count: (data == null ? void 0 : data.total) ?? 0 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "secondary",
                size: "sm",
                className: "lg:hidden",
                icon: /* @__PURE__ */ jsx(SlidersHorizontal, { size: 15 }),
                onClick: () => setSheetOpen(true),
                children: [
                  t("jobs.mobileFilters"),
                  activeFilterCount > 0 ? /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-primary px-1.5 text-[11px] text-primary-fg", children: activeFilterCount }) : null
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Select,
              {
                "aria-label": t("jobs.sortBy"),
                value: filters.sort,
                onChange: (event) => write({ sort: event.target.value, page: 1 }),
                options: [
                  { value: "recent", label: t("jobs.sort.recent") },
                  { value: "salary", label: t("jobs.sort.salary") },
                  { value: "relevant", label: t("jobs.sort.relevant") }
                ],
                className: "h-9 w-auto min-w-[170px] text-[13px]"
              }
            )
          ] })
        ] }),
        activeFilterCount > 0 ? /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [
          filters.categories.map((category) => /* @__PURE__ */ jsx(
            FilterChip,
            {
              label: category,
              onRemove: () => write({ categories: filters.categories.filter((item) => item !== category), page: 1 })
            },
            category
          )),
          filters.employmentTypes.map((type) => /* @__PURE__ */ jsx(
            FilterChip,
            {
              label: type,
              onRemove: () => write({ employmentTypes: filters.employmentTypes.filter((item) => item !== type), page: 1 })
            },
            type
          )),
          filters.experienceLevels.map((level) => /* @__PURE__ */ jsx(
            FilterChip,
            {
              label: level,
              onRemove: () => write({ experienceLevels: filters.experienceLevels.filter((item) => item !== level), page: 1 })
            },
            level
          )),
          filters.remote ? /* @__PURE__ */ jsx(FilterChip, { label: t("jobs.remoteOnly"), onRemove: () => write({ remote: false, page: 1 }) }) : null,
          filters.salaryMin || filters.salaryMax ? /* @__PURE__ */ jsx(
            FilterChip,
            {
              label: `${filters.salaryMin ?? 0} – ${filters.salaryMax ?? "∞"} UZS`,
              onRemove: () => write({ salaryMin: null, salaryMax: null, page: 1 })
            }
          ) : null,
          /* @__PURE__ */ jsx("button", { type: "button", onClick: reset, className: "text-xs font-medium text-primary hover:underline", children: t("jobs.clear") })
        ] }) : null,
        loading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsx(JobCardSkeleton, {}, index)) }) : ((data == null ? void 0 : data.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsx(SearchX, { size: 24 }),
            title: t("jobs.empty.title"),
            description: t("jobs.empty.text"),
            actionLabel: t("jobs.empty.cta"),
            onAction: reset
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: data == null ? void 0 : data.items.map((job) => /* @__PURE__ */ jsx(JobCard, { job }, job.id)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
            Pagination,
            {
              page: (data == null ? void 0 : data.page) ?? 1,
              pages: (data == null ? void 0 : data.pages) ?? 1,
              onChange: (page) => write({ page }),
              labels: { prev: t("common.prev"), next: t("common.next"), page: t("common.page"), of: t("common.of") }
            }
          ) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      BottomSheet,
      {
        open: sheetOpen,
        onClose: () => setSheetOpen(false),
        title: t("jobs.filters"),
        footer: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: reset, children: t("jobs.clear") }),
          /* @__PURE__ */ jsx(Button, { onClick: () => setSheetOpen(false), children: t("jobs.applyFilters") })
        ] }),
        children: /* @__PURE__ */ jsx(JobFiltersPanel, { filters, onChange: write, onReset: reset, facets })
      }
    )
  ] });
}
function FilterChip({ label, onRemove }) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary", children: [
    label,
    /* @__PURE__ */ jsx("button", { type: "button", onClick: onRemove, "aria-label": `Remove ${label} filter`, className: "hover:text-primary-hover", children: "×" })
  ] });
}
function ApplyModal({ job, open, onClose, onApplied }) {
  var _a;
  const { t } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState((user == null ? void 0 : user.name) ?? "");
  const [email, setEmail] = useState((user == null ? void 0 : user.email) ?? "");
  const [phone, setPhone] = useState((user == null ? void 0 : user.phone) ?? "");
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const reset = () => {
    setCoverLetter("");
    setPortfolioUrl("");
    setResume(null);
    setErrors({});
    setDone(false);
  };
  const validate = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = t("error.required");
    if (!email.trim()) next.email = t("error.required");
    else if (!isEmail(email)) next.email = t("error.email");
    if (!phone.trim()) next.phone = t("error.required");
    if (!coverLetter.trim()) next.coverLetter = t("error.required");
    else if (coverLetter.trim().length < 20) next.coverLetter = t("error.required");
    if (portfolioUrl && !/^https?:\/\//i.test(portfolioUrl)) next.portfolioUrl = t("error.required");
    if (resume && resume.size > 5 * 1024 * 1024) next.resume = t("error.fileTooLarge");
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await backend.apply({
        job_id: job.id,
        full_name: fullName,
        email,
        phone,
        cover_letter: coverLetter,
        portfolio_url: portfolioUrl || null,
        resume_name: (resume == null ? void 0 : resume.name) ?? null
      });
      setDone(true);
      onApplied();
      toast.success(t("apply.successTitle"));
    } catch (error) {
      const code = error instanceof ApiError ? error.code : "generic";
      if (code === "already_applied") toast.error(t("error.alreadyApplied"));
      else if (code === "employer_cannot_apply") toast.error(t("error.employerCannotApply"));
      else toast.error(t("error.generic"));
    } finally {
      setSubmitting(false);
    }
  };
  if (done) {
    return /* @__PURE__ */ jsx(Modal, { open, onClose: () => {
      reset();
      onClose();
    }, title: t("apply.successTitle"), size: "sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-4 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-4 grid h-14 w-14 place-items-center rounded-full bg-success/12 text-success", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 26 }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted", children: t("apply.successText") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid w-full gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Button, { onClick: () => {
          reset();
          onClose();
          navigate("/applications");
        }, children: t("apply.viewApplications") }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => {
          reset();
          onClose();
          navigate("/jobs");
        }, children: t("apply.backToJobs") })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open,
      onClose,
      title: t("apply.title"),
      description: t("apply.subtitle", { job: job.title, company: ((_a = job.company) == null ? void 0 : _a.name) ?? "LocalJob" }),
      footer: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, disabled: submitting, children: t("apply.cancel") }),
        /* @__PURE__ */ jsx(Button, { onClick: () => void submit(), loading: submitting, icon: /* @__PURE__ */ jsx(Send, { size: 15 }), children: t("apply.submit") })
      ] }),
      children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              label: t("apply.fullName"),
              value: fullName,
              onChange: (event) => setFullName(event.target.value),
              error: errors.fullName,
              required: true,
              autoComplete: "name"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: t("apply.email"),
              type: "email",
              value: email,
              onChange: (event) => setEmail(event.target.value),
              error: errors.email,
              required: true,
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("apply.phone"),
            value: phone ?? "",
            onChange: (event) => setPhone(event.target.value),
            error: errors.phone,
            placeholder: "+998 90 123 45 67",
            required: true,
            autoComplete: "tel"
          }
        ),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            label: t("apply.coverLetter"),
            hint: t("apply.coverLetterHint"),
            value: coverLetter,
            onChange: (event) => setCoverLetter(event.target.value),
            error: errors.coverLetter,
            rows: 5,
            maxLength: 1200,
            counter: true,
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("apply.portfolio"),
            value: portfolioUrl,
            onChange: (event) => setPortfolioUrl(event.target.value),
            placeholder: "https://",
            error: errors.portfolioUrl
          }
        ),
        /* @__PURE__ */ jsx(
          FileUpload,
          {
            label: t("apply.resume"),
            hint: t("apply.uploadHint"),
            chooseLabel: t("apply.chooseFile"),
            file: resume,
            error: errors.resume,
            onSelect: (file) => setResume(file),
            onClear: () => setResume(null)
          }
        )
      ] })
    }
  );
}
function JobDetailPage() {
  var _a, _b, _c, _d;
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSavedJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [similar, setSimilar] = useState([]);
  useEffect(() => {
    let active = true;
    const jobId = Number(id);
    setLoading(true);
    backend.job(jobId).then(async (result) => {
      if (!active) return;
      setJob(result);
      void backend.registerJobView(jobId).catch(() => void 0);
      const related = await backend.jobs({ category: result.category, pageSize: 3 });
      if (active) setSimilar(related.items.filter((item) => item.id !== result.id).slice(0, 3));
    }).catch(() => {
      if (active) setNotFound(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);
  const share = async () => {
    const url = window.location.href;
    const data = { title: (job == null ? void 0 : job.title) ?? "LocalJob", text: job == null ? void 0 : job.title, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t("job.shared"));
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t("job.shared"));
      } catch {
        toast.error(t("error.generic"));
      }
    }
  };
  const handleApply = () => {
    if (!user) {
      toast.info(t("error.loginToApply"));
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }
    if (user.role === "employer" && !isAdmin) {
      toast.error(t("error.employerCannotApply"));
      return;
    }
    if (job == null ? void 0 : job.hasApplied) {
      toast.info(t("error.alreadyApplied"));
      return;
    }
    setApplyOpen(true);
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "lj-container py-8", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-48" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-2/3" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "mt-3 h-4 w-1/3" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "mt-5 h-10 w-full" })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "space-y-3 p-6", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-4/6" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-12" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "mt-4 h-4 w-2/3" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "mt-3 h-3 w-1/2" })
        ] })
      ] })
    ] });
  }
  if (notFound || !job) {
    return /* @__PURE__ */ jsx("div", { className: "lj-container py-16", children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: t("error.jobNotFound"),
        description: t("common.notFoundText"),
        actionLabel: t("job.back"),
        actionTo: "/jobs"
      }
    ) });
  }
  const saved = isSaved(job.id);
  const company = job.company;
  return /* @__PURE__ */ jsxs("div", { className: "bg-bg-soft pb-16", children: [
    /* @__PURE__ */ jsx("div", { className: "lj-container pt-5", children: /* @__PURE__ */ jsx(
      Breadcrumbs,
      {
        items: [
          { label: t("common.breadcrumbHome"), to: "/" },
          { label: t("nav.jobs"), to: "/jobs" },
          { label: categoryLabel(job.category, lang), to: `/jobs?category=${job.category}` },
          { label: job.title }
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "lj-container py-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_340px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsx(Card, { className: "p-5 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx(CompanyLogo, { name: company == null ? void 0 : company.name, logo: company == null ? void 0 : company.logo, color: company == null ? void 0 : company.color, size: 56 }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold leading-tight tracking-tight text-fg sm:text-2xl", children: job.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: company ? /* @__PURE__ */ jsx(Link, { to: `/company/${company.id}`, className: "transition-colors hover:text-primary", children: company.name }) : "LocalJob" })
              ] }),
              typeof job.matchScore === "number" && job.matchScore > 0 ? /* @__PURE__ */ jsx(Badge, { tone: "accent", icon: /* @__PURE__ */ jsx(Sparkles, { size: 12 }), children: t("jobs.match", { score: job.matchScore }) }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 14, className: "text-subtle", "aria-hidden": true }),
                " ",
                job.location
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Wallet, { size: 14, className: "text-subtle", "aria-hidden": true }),
                " ",
                job.salaryLabel
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Briefcase, { size: 14, className: "text-subtle", "aria-hidden": true }),
                " ",
                employmentLabel(String(job.employmentType), lang)
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(CalendarClock, { size: 14, className: "text-subtle", "aria-hidden": true }),
                " ",
                relativeTime(job.createdAt, lang)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsx(Badge, { tone: "primary", children: experienceLabel(String(job.experienceLevel), lang) }),
              /* @__PURE__ */ jsx(Badge, { tone: "accent", children: categoryLabel(job.category, lang) }),
              job.isRemote ? /* @__PURE__ */ jsx(Badge, { tone: "info", children: "Remote" }) : null,
              job.hasApplied ? /* @__PURE__ */ jsx(Badge, { tone: "success", icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }), children: t("jobs.applied") }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(Button, { onClick: handleApply, disabled: job.hasApplied || (user == null ? void 0 : user.role) === "employer" && !isAdmin, children: job.hasApplied ? t("jobs.applied") : t("job.applyNow") }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "secondary",
                  icon: saved ? /* @__PURE__ */ jsx(BookmarkCheck, { size: 15 }) : /* @__PURE__ */ jsx(Bookmark, { size: 15 }),
                  onClick: () => void toggle(job.id),
                  children: saved ? t("jobs.saved") : t("job.saveJob")
                }
              ),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", icon: /* @__PURE__ */ jsx(Share2, { size: 15 }), onClick: () => void share(), children: t("job.share") })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-fg", children: t("job.about") }),
          /* @__PURE__ */ jsx("div", { className: "lj-prose mt-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted", children: job.description }) }),
          ((_a = job.responsibilities) == null ? void 0 : _a.length) ? /* @__PURE__ */ jsx(ListSection, { title: t("job.responsibilities"), items: job.responsibilities }) : null,
          ((_b = job.requirements) == null ? void 0 : _b.length) ? /* @__PURE__ */ jsx(ListSection, { title: t("job.requirements"), items: job.requirements }) : null,
          ((_c = job.skills) == null ? void 0 : _c.length) ? /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-fg", children: t("job.skills") }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: job.skills.map((skill) => /* @__PURE__ */ jsx("span", { className: "lj-chip", children: skill }, skill)) })
          ] }) : null,
          ((_d = job.benefits) == null ? void 0 : _d.length) ? /* @__PURE__ */ jsx(ListSection, { title: t("job.benefits"), items: job.benefits }) : null
        ] }),
        similar.length ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold text-fg", children: t("job.similar") }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: similar.map((item) => /* @__PURE__ */ jsx(JobCard, { job: item, compact: true }, item.id)) })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs(Card, { className: "p-5 lg:sticky lg:top-24", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: t("job.overview") }),
          /* @__PURE__ */ jsxs("dl", { className: "mt-4 space-y-3 text-sm", children: [
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(Wallet, { size: 14 }), label: t("job.salary"), value: job.salaryLabel }),
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(Briefcase, { size: 14 }), label: t("jobs.employmentType"), value: employmentLabel(String(job.employmentType), lang) }),
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(Sparkles, { size: 14 }), label: t("jobs.experience"), value: experienceLabel(String(job.experienceLevel), lang) }),
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(CalendarClock, { size: 14 }), label: t("job.posted"), value: formatDate(job.createdAt, lang) }),
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(Eye, { size: 14 }), label: t("job.views"), value: String(job.views ?? 0) }),
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(Users, { size: 14 }), label: t("job.applicants"), value: String(job.applicationsCount ?? 0) })
          ] }),
          /* @__PURE__ */ jsx(Button, { fullWidth: true, className: "mt-5", onClick: handleApply, disabled: job.hasApplied || (user == null ? void 0 : user.role) === "employer" && !isAdmin, children: job.hasApplied ? t("jobs.applied") : t("job.applyNow") })
        ] }),
        company ? /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: t("job.company") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CompanyLogo, { name: company.name, logo: company.logo, color: company.color, size: 44 }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-sm font-semibold text-fg", children: [
                /* @__PURE__ */ jsx(Link, { to: `/company/${company.id}`, className: "truncate transition-colors hover:text-primary", children: company.name }),
                company.verified ? /* @__PURE__ */ jsx(VerifiedBadge, { label: "" }) : null
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted", children: company.industry })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("dl", { className: "mt-4 space-y-2.5 text-sm", children: [
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(MapPin, { size: 14 }), label: t("jobs.location"), value: company.location ?? "—" }),
            /* @__PURE__ */ jsx(Row, { icon: /* @__PURE__ */ jsx(Users, { size: 14 }), label: t("job.size"), value: company.size ?? "—" }),
            company.website ? /* @__PURE__ */ jsx(
              Row,
              {
                icon: /* @__PURE__ */ jsx(Globe, { size: 14 }),
                label: t("job.website"),
                value: /* @__PURE__ */ jsx("a", { href: company.website, target: "_blank", rel: "noreferrer", className: "lj-link", children: company.website.replace(/^https?:\/\//, "") })
              }
            ) : null
          ] }),
          company.about ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-relaxed text-muted", children: company.about }) : null,
          /* @__PURE__ */ jsx(ButtonLink, { to: `/company/${company.id}`, variant: "secondary", size: "sm", fullWidth: true, className: "mt-4", children: t("job.companyJobs") })
        ] }) : null,
        /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Avatar, { name: user == null ? void 0 : user.name, src: user == null ? void 0 : user.avatar, size: 38 }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-fg", children: (user == null ? void 0 : user.name) ?? "LocalJob" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: t("dashboard.subtitle") })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ButtonLink, { to: user ? "/dashboard" : "/register", variant: "secondary", size: "sm", fullWidth: true, className: "mt-4", children: user ? t("nav.dashboard") : t("nav.createAccount") })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate(-1),
            className: "inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { size: 15 }),
              " ",
              t("job.back")
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      ApplyModal,
      {
        job,
        open: applyOpen,
        onClose: () => setApplyOpen(false),
        onApplied: () => setJob({ ...job, hasApplied: true, canApply: false })
      }
    )
  ] });
}
function ListSection({ title, items }) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-fg", children: title }),
    /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2.5", children: items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5 text-sm leading-relaxed text-muted", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { size: 15, className: "mt-0.5 shrink-0 text-success", "aria-hidden": true }),
      item
    ] }, item)) })
  ] });
}
function Row({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("dt", { className: "inline-flex items-center gap-2 text-muted", children: [
      /* @__PURE__ */ jsx("span", { className: "text-subtle", children: icon }),
      label
    ] }),
    /* @__PURE__ */ jsx("dd", { className: "text-right font-medium text-fg", children: value })
  ] });
}
function LoginPage() {
  var _a;
  const { t } = useLanguage();
  const { login, demoLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const from = (_a = location.state) == null ? void 0 : _a.from;
  const redirectFor = (role) => {
    if (from) return from;
    if (role === "employer") return "/employer";
    return "/dashboard";
  };
  const submit = async () => {
    const next = {};
    if (!email.trim()) next.email = t("error.required");
    else if (!isEmail(email)) next.email = t("error.email");
    if (!password) next.password = t("error.required");
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const session = await login(email, password, remember);
      toast.success(t("auth.welcomeBack", { name: session.user.name.split(" ")[0] }));
      navigate(redirectFor(session.user.role), { replace: true });
    } catch (error) {
      const code = error instanceof ApiError ? error.code : "generic";
      if (code === "invalid_credentials") toast.error(t("error.invalidCredentials"));
      else if (code === "account_disabled") toast.error(t("error.unauthorized"));
      else toast.error(t("error.generic"));
    } finally {
      setLoading(false);
    }
  };
  const runDemo = async (kind) => {
    setDemoLoading(kind);
    try {
      const session = await demoLogin(kind);
      toast.success(t("auth.welcomeBack", { name: session.user.name.split(" ")[0] }));
      navigate(kind === "employer" ? "/employer" : "/dashboard", { replace: true });
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setDemoLoading(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "lj-card p-6 sm:p-7", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg", children: t("auth.signInTitle") }),
    /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("auth.signInSubtitle") }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        className: "mt-6 space-y-4",
        onSubmit: (event) => {
          event.preventDefault();
          void submit();
        },
        children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              label: t("auth.email"),
              type: "email",
              autoComplete: "email",
              value: email,
              onChange: (event) => setEmail(event.target.value),
              error: errors.email,
              required: true,
              placeholder: "you@example.com"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: t("auth.password"),
              type: "password",
              autoComplete: "current-password",
              value: password,
              onChange: (event) => setPassword(event.target.value),
              error: errors.password,
              required: true,
              placeholder: "••••••••"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx(Checkbox, { checked: remember, onChange: setRemember, label: t("auth.remember") }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => toast.info(t("auth.forgot"), t("common.contactText")),
                className: "text-xs font-medium text-primary hover:underline",
                children: t("auth.forgot")
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", fullWidth: true, loading, icon: /* @__PURE__ */ jsx(LogIn, { size: 16 }), children: t("auth.signInButton") })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "my-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-line" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: t("auth.demoAccounts") }),
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-line" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "secondary",
          size: "sm",
          icon: /* @__PURE__ */ jsx(UserCheck, { size: 15 }),
          loading: demoLoading === "seeker",
          onClick: () => void runDemo("seeker"),
          children: t("auth.demoSeeker")
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "secondary",
          size: "sm",
          icon: /* @__PURE__ */ jsx(ShieldCheck, { size: 15 }),
          loading: demoLoading === "employer",
          onClick: () => void runDemo("employer"),
          children: t("auth.demoEmployer")
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "sm:col-span-2",
          icon: /* @__PURE__ */ jsx(UserCog, { size: 15 }),
          onClick: () => {
            setEmail("admin@localjob.uz");
            setPassword("Admin1234!");
            toast.info(t("auth.demoAdmin"), "admin@localjob.uz / Admin1234!");
          },
          children: t("auth.demoAdmin")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-muted", children: [
      t("auth.noAccount"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/register", className: "lj-link font-medium", children: t("nav.createAccount") })
    ] })
  ] });
}
function RegisterPage() {
  const { t, lang } = useLanguage();
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { meta } = useMeta();
  const [role, setRole] = useState("job_seeker");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: ""
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async () => {
    const next = {};
    if (!form.name.trim()) next.name = t("error.required");
    if (!form.email.trim()) next.email = t("error.required");
    else if (!isEmail(form.email)) next.email = t("error.email");
    if (!form.password) next.password = t("error.required");
    else if (form.password.length < 8) next.password = t("error.passwordLength");
    if (form.password !== form.confirmPassword) next.confirmPassword = t("error.passwordMatch");
    if (!agree) next.agree = t("error.terms");
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const session = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role,
        phone: form.phone || null,
        location: form.location || null,
        language: lang
      });
      toast.success(t("auth.registered"), role === "employer" ? t("emp.subtitle") : t("dash.subtitle"));
      navigate(role === "employer" ? "/employer" : "/dashboard", { replace: true });
    } catch (error) {
      const code = error instanceof ApiError ? error.code : "generic";
      if (code === "email_already_registered") {
        setErrors({ email: t("error.emailInUse") });
        toast.error(t("error.emailInUse"));
      } else if (code === "password_too_short") toast.error(t("error.passwordLength"));
      else if (code === "passwords_do_not_match") toast.error(t("error.passwordMatch"));
      else toast.error(t("error.generic"));
    } finally {
      setLoading(false);
    }
  };
  const accountTypes = [
    {
      value: "job_seeker",
      icon: /* @__PURE__ */ jsx(Search, { size: 18 }),
      title: t("auth.jobSeeker"),
      description: t("auth.jobSeekerDesc")
    },
    {
      value: "employer",
      icon: /* @__PURE__ */ jsx(BriefcaseBusiness, { size: 18 }),
      title: t("auth.employer"),
      description: t("auth.employerDesc")
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "lj-card p-6 sm:p-7", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg", children: t("auth.registerTitle") }),
    /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("auth.registerSubtitle") }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        className: "mt-6 space-y-4",
        onSubmit: (event) => {
          event.preventDefault();
          void submit();
        },
        children: [
          /* @__PURE__ */ jsxs("fieldset", { children: [
            /* @__PURE__ */ jsx("legend", { className: "lj-label", children: t("auth.accountType") }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: accountTypes.map((type) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setRole(type.value),
                "aria-pressed": role === type.value,
                className: cn(
                  "rounded-lg border p-3.5 text-left transition-all",
                  role === type.value ? "border-primary bg-primary/[0.07] ring-2 ring-primary/20" : "border-line bg-card hover:border-line-strong"
                ),
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "grid h-9 w-9 place-items-center rounded-md",
                        role === type.value ? "bg-primary text-primary-fg" : "bg-card-2 text-muted"
                      ),
                      children: type.icon
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "mt-2.5 block text-sm font-semibold text-fg", children: type.title }),
                  /* @__PURE__ */ jsx("span", { className: "mt-0.5 block text-xs leading-snug text-muted", children: type.description })
                ]
              },
              type.value
            )) })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: t("auth.fullName"),
              value: form.name,
              onChange: update("name"),
              error: errors.name,
              required: true,
              autoComplete: "name",
              placeholder: "Aziz Karimov"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: t("auth.email"),
              type: "email",
              value: form.email,
              onChange: update("email"),
              error: errors.email,
              required: true,
              autoComplete: "email",
              placeholder: "you@example.com"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                label: t("auth.password"),
                type: "password",
                value: form.password,
                onChange: update("password"),
                error: errors.password,
                required: true,
                autoComplete: "new-password",
                hint: "min 8"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                label: t("auth.confirmPassword"),
                type: "password",
                value: form.confirmPassword,
                onChange: update("confirmPassword"),
                error: errors.confirmPassword,
                required: true,
                autoComplete: "new-password"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                label: t("auth.phone"),
                value: form.phone,
                onChange: update("phone"),
                autoComplete: "tel",
                placeholder: "+998 90 123 45 67"
              }
            ),
            /* @__PURE__ */ jsx(
              Select,
              {
                label: t("auth.location"),
                value: form.location,
                onChange: update("location"),
                placeholder: "—",
                options: ((meta == null ? void 0 : meta.locations) ?? []).map((item) => ({ value: item, label: item }))
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: agree,
              onChange: setAgree,
              error: errors.agree,
              label: /* @__PURE__ */ jsxs(Fragment, { children: [
                t("auth.agree"),
                " ·",
                " ",
                /* @__PURE__ */ jsx(Link, { to: "/terms", className: "lj-link", children: t("footer.terms") }),
                " ",
                "·",
                " ",
                /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "lj-link", children: t("footer.privacy") })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(Button, { type: "submit", fullWidth: true, loading, icon: /* @__PURE__ */ jsx(UserPlus, { size: 16 }), children: t("auth.registerButton") })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-muted", children: [
      t("auth.haveAccount"),
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "lj-link font-medium", children: t("nav.signIn") })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-xs text-subtle", children: t("auth.termsNote") })
  ] });
}
function DashboardPage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const { t, lang } = useLanguage();
  const { user, completion } = useAuth();
  const dashboard = useAsync(() => backend.seekerDashboard(), [user == null ? void 0 : user.id]);
  const greeting = {
    morning: t("dash.goodMorning", { name: (user == null ? void 0 : user.name.split(" ")[0]) ?? "" }),
    afternoon: t("dash.goodAfternoon", { name: (user == null ? void 0 : user.name.split(" ")[0]) ?? "" }),
    evening: t("dash.goodEvening", { name: (user == null ? void 0 : user.name.split(" ")[0]) ?? "" }),
    night: t("dash.goodNight", { name: (user == null ? void 0 : user.name.split(" ")[0]) ?? "" })
  }[greetingKey()];
  const stats = (_a = dashboard.data) == null ? void 0 : _a.stats;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--primary)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: greeting }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("dash.subtitle") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(ButtonLink, { to: "/jobs", size: "sm", icon: /* @__PURE__ */ jsx(Search, { size: 15 }), children: t("dash.searchJobs") }),
            /* @__PURE__ */ jsx(ButtonLink, { to: "/profile", variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(UserRound, { size: 15 }), children: t("dash.updateProfile") }),
            /* @__PURE__ */ jsx(ButtonLink, { to: "/applications", variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx(FileText, { size: 15 }), children: t("dash.viewApplications") })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-line bg-card-2 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: t("dash.completion") }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-fg", children: [
              (stats == null ? void 0 : stats.profileCompletion) ?? completion,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: (stats == null ? void 0 : stats.profileCompletion) ?? completion, className: "mt-3" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-xs leading-relaxed text-muted", children: t("profile.completionHint") })
        ] }) })
      ] })
    ] }),
    dashboard.loading ? /* @__PURE__ */ jsx(StatsSkeleton, {}) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(
        StatBlock,
        {
          icon: /* @__PURE__ */ jsx(Send, { size: 17 }),
          label: t("dash.applications"),
          value: (stats == null ? void 0 : stats.applications) ?? 0,
          hint: t("dash.interviews") + ": " + ((stats == null ? void 0 : stats.interviews) ?? 0),
          to: "/applications"
        }
      ),
      /* @__PURE__ */ jsx(StatBlock, { icon: /* @__PURE__ */ jsx(Bookmark, { size: 17 }), label: t("dash.saved"), value: (stats == null ? void 0 : stats.savedJobs) ?? 0, to: "/saved" }),
      /* @__PURE__ */ jsx(StatBlock, { icon: /* @__PURE__ */ jsx(Eye, { size: 17 }), label: t("dash.views"), value: (stats == null ? void 0 : stats.profileViews) ?? 0, to: "/profile" }),
      /* @__PURE__ */ jsx(
        StatBlock,
        {
          icon: /* @__PURE__ */ jsx(TrendingUp, { size: 17 }),
          label: t("dash.completion"),
          value: `${(stats == null ? void 0 : stats.profileCompletion) ?? completion}%`,
          to: "/profile"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 18, className: "text-accent" }),
            " ",
            t("dash.recommended")
          ] }),
          subtitle: t("featured.subtitle"),
          action: /* @__PURE__ */ jsx(ButtonLink, { to: "/jobs", variant: "ghost", size: "sm", iconRight: /* @__PURE__ */ jsx(ArrowRight, { size: 15 }), children: t("featured.viewAll") })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 lg:grid-cols-2", children: [
        (((_b = dashboard.data) == null ? void 0 : _b.recommended) ?? []).slice(0, 4).map((job) => /* @__PURE__ */ jsx(JobCard, { job }, job.id)),
        !dashboard.loading && (((_c = dashboard.data) == null ? void 0 : _c.recommended.length) ?? 0) === 0 ? /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(
          EmptyState,
          {
            title: t("jobs.empty.title"),
            description: t("jobs.empty.text"),
            actionLabel: t("jobs.empty.cta"),
            actionTo: "/jobs",
            variant: "compact"
          }
        ) }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            title: t("dash.recentApplications"),
            action: /* @__PURE__ */ jsx(ButtonLink, { to: "/applications", variant: "ghost", size: "sm", children: t("common.viewAll") })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
          (((_d = dashboard.data) == null ? void 0 : _d.recentApplications) ?? []).map((application) => {
            var _a2, _b2, _c2;
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-md border border-line bg-card-2 p-3", children: [
              /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Briefcase, { size: 15 }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-fg", children: ((_a2 = application.job) == null ? void 0 : _a2.title) ?? "—" }),
                /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-subtle", children: [
                  (_c2 = (_b2 = application.job) == null ? void 0 : _b2.company) == null ? void 0 : _c2.name,
                  " · ",
                  formatDate(application.createdAt, lang)
                ] })
              ] }),
              /* @__PURE__ */ jsx(Badge, { tone: statusTone(application.status), children: statusLabel(application.status, lang) })
            ] }, application.id);
          }),
          !dashboard.loading && (((_e = dashboard.data) == null ? void 0 : _e.recentApplications.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsx(FileText, { size: 22 }),
              title: t("dash.noApplications"),
              description: t("dash.noApplicationsText"),
              actionLabel: t("jobs.title"),
              actionTo: "/jobs",
              variant: "compact"
            }
          ) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            title: t("dash.savedJobs"),
            action: /* @__PURE__ */ jsx(ButtonLink, { to: "/saved", variant: "ghost", size: "sm", children: t("common.viewAll") })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
          (((_f = dashboard.data) == null ? void 0 : _f.savedJobs) ?? []).map((row) => {
            var _a2, _b2, _c2, _d2;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/jobs/${row.jobId}`,
                className: "flex items-center gap-3 rounded-md border border-line bg-card-2 p-3 transition-colors hover:border-primary/40",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent/12 text-accent", children: /* @__PURE__ */ jsx(Bookmark, { size: 15 }) }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-fg", children: (_a2 = row.job) == null ? void 0 : _a2.title }),
                    /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-subtle", children: [
                      (_c2 = (_b2 = row.job) == null ? void 0 : _b2.company) == null ? void 0 : _c2.name,
                      " · ",
                      (_d2 = row.job) == null ? void 0 : _d2.salaryLabel
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "shrink-0 text-subtle" })
                ]
              },
              row.id
            );
          }),
          !dashboard.loading && (((_g = dashboard.data) == null ? void 0 : _g.savedJobs.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsx(Bookmark, { size: 22 }),
              title: t("saved.empty.title"),
              description: t("saved.empty.text"),
              actionLabel: t("saved.empty.cta"),
              actionTo: "/jobs",
              variant: "compact"
            }
          ) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("dash.quickActions") }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        { to: "/jobs", icon: /* @__PURE__ */ jsx(Search, { size: 16 }), label: t("dash.searchJobs") },
        { to: "/profile", icon: /* @__PURE__ */ jsx(UserRound, { size: 16 }), label: t("dash.updateProfile") },
        { to: "/applications", icon: /* @__PURE__ */ jsx(FileText, { size: 16 }), label: t("dash.viewApplications") },
        { to: "/settings", icon: /* @__PURE__ */ jsx(CheckSquare, { size: 16 }), label: t("nav.settings") }
      ].map((action) => /* @__PURE__ */ jsx(ButtonLink, { to: action.to, variant: "secondary", icon: action.icon, className: "justify-start", children: action.label }, action.to)) })
    ] })
  ] });
}
function StatBlock({
  icon,
  label,
  value,
  hint,
  to
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: "lj-card p-4 transition-colors hover:border-line-strong", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: label }),
      /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary", children: icon })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-2xl font-semibold tracking-tight text-fg", children: value }),
    hint ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted", children: hint }) : null
  ] });
}
const CANDIDATE_ACTIONS = [
  { status: "shortlisted", tone: "secondary" },
  { status: "interview", tone: "primary" },
  { status: "hired", tone: "success" },
  { status: "rejected", tone: "danger" }
];
function ApplicationCard({ application, onChanged }) {
  var _a;
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const job = application.job;
  return /* @__PURE__ */ jsx("article", { className: "lj-card p-4 sm:p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
    /* @__PURE__ */ jsx("span", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Building2, { size: 19 }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "truncate text-[15px] font-semibold text-fg", children: job ? /* @__PURE__ */ jsx(Link, { to: `/jobs/${job.id}`, className: "transition-colors hover:text-primary", children: job.title }) : application.fullName }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-sm text-muted", children: ((_a = job == null ? void 0 : job.company) == null ? void 0 : _a.name) ?? "LocalJob" })
        ] }),
        /* @__PURE__ */ jsx(Badge, { tone: statusTone(application.status), children: statusLabel(application.status, lang) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-subtle", "aria-hidden": true }),
          " ",
          t("apps.appliedOn"),
          ":",
          " ",
          formatDate(application.createdAt, lang)
        ] }),
        job ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(FileText, { size: 13, className: "text-subtle", "aria-hidden": true }),
          " ",
          application.resumeName ?? "—"
        ] }) : null
      ] }),
      expanded ? /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 rounded-md border border-line bg-card-2 p-3 text-sm text-muted", children: [
        application.coverLetter ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-subtle", children: t("apps.coverLetter") }),
          /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: application.coverLetter })
        ] }) : null,
        application.portfolioUrl ? /* @__PURE__ */ jsxs(
          "a",
          {
            href: application.portfolioUrl,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-1.5 text-primary hover:underline",
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { size: 13 }),
              " ",
              application.portfolioUrl
            ]
          }
        ) : null
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        job ? /* @__PURE__ */ jsx(
          Link,
          {
            to: `/jobs/${job.id}`,
            className: "inline-flex h-9 items-center rounded-md border border-line bg-card px-3 text-[13px] font-medium text-fg transition-colors hover:border-line-strong",
            children: t("apps.viewJob")
          }
        ) : null,
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setExpanded((value) => !value), children: expanded ? t("common.close") : t("apps.details") })
      ] })
    ] })
  ] }) });
}
function CandidateCard({
  application,
  onStatusChange
}) {
  var _a, _b;
  const { t, lang } = useLanguage();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const candidate = application.applicant;
  const profile = application.applicantProfile;
  const changeStatus = async (status) => {
    setPending(true);
    try {
      const updated = await backend.updateApplicationStatus(application.id, status);
      toast.success(t("emp.statusChanged", { status: statusLabel(status, lang) }));
      onStatusChange == null ? void 0 : onStatusChange(updated);
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setPending(false);
    }
  };
  return /* @__PURE__ */ jsx("article", { className: "lj-card p-4 sm:p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
    /* @__PURE__ */ jsx(Avatar, { name: (candidate == null ? void 0 : candidate.name) ?? application.fullName, src: candidate == null ? void 0 : candidate.avatar, size: 46 }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 truncate text-[15px] font-semibold text-fg", children: [
            /* @__PURE__ */ jsx(User, { size: 14, className: "text-subtle" }),
            " ",
            (candidate == null ? void 0 : candidate.name) ?? application.fullName
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-sm text-muted", children: (profile == null ? void 0 : profile.title) ?? t("nav.candidates") }),
          /* @__PURE__ */ jsxs("p", { className: "mt-0.5 truncate text-xs text-subtle", children: [
            (_a = application.job) == null ? void 0 : _a.title,
            " · ",
            formatDate(application.createdAt, lang)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(MatchRing, { score: application.matchScore, label: t("emp.match", { score: application.matchScore }) }),
          /* @__PURE__ */ jsx(Badge, { tone: statusTone(application.status), children: statusLabel(application.status, lang) })
        ] })
      ] }),
      ((_b = profile == null ? void 0 : profile.skills) == null ? void 0 : _b.length) ? /* @__PURE__ */ jsx("div", { className: "mt-2.5 flex flex-wrap gap-1.5", children: profile.skills.slice(0, 6).map((skill) => /* @__PURE__ */ jsx(Badge, { tone: "default", children: skill }, skill)) }) : null,
      showLetter ? /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-md border border-line bg-card-2 p-3", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-subtle", children: t("apps.coverLetter") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted", children: application.coverLetter }),
        application.portfolioUrl ? /* @__PURE__ */ jsxs(
          "a",
          {
            href: application.portfolioUrl,
            target: "_blank",
            rel: "noreferrer",
            className: "mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { size: 13 }),
              " ",
              t("apps.portfolio")
            ]
          }
        ) : null
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => setShowLetter((value) => !value), children: showLetter ? t("common.close") : t("apps.coverLetter") }),
        candidate ? /* @__PURE__ */ jsx(
          Link,
          {
            to: `/employer/candidates/${candidate.id}`,
            className: "inline-flex h-9 items-center rounded-md border border-line bg-card px-3 text-[13px] font-medium text-fg transition-colors hover:border-line-strong",
            children: t("emp.viewProfile")
          }
        ) : null,
        /* @__PURE__ */ jsx("span", { className: "hidden flex-1 sm:block" }),
        CANDIDATE_ACTIONS.filter((action) => action.status !== application.status).map((action) => /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: action.tone === "primary" ? "primary" : action.tone === "success" ? "success" : action.tone === "danger" ? "danger" : "secondary",
            disabled: pending,
            onClick: () => void changeStatus(action.status),
            children: action.status === "shortlisted" ? t("emp.shortlist") : action.status === "interview" ? t("emp.interview") : action.status === "hired" ? t("emp.hire") : t("emp.reject")
          },
          action.status
        ))
      ] })
    ] })
  ] }) });
}
function ApplicationsPage() {
  var _a, _b, _c;
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [status, setStatus] = useState("all");
  const applications = useAsync(
    () => backend.applications(status === "all" ? void 0 : status),
    [user == null ? void 0 : user.id, status]
  );
  const counts = ((_a = applications.data) == null ? void 0 : _a.counts) ?? {};
  const total = ((_b = applications.data) == null ? void 0 : _b.total) ?? 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("apps.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("apps.subtitle") })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: status,
        onChange: setStatus,
        tabs: [
          { value: "all", label: t("apps.filterAll"), count: total },
          ...APPLICATION_STATUSES.map((item) => ({
            value: item,
            label: statusLabel(item, lang),
            count: counts[item] ?? 0
          })).filter((tab) => (tab.count ?? 0) > 0)
        ]
      }
    ),
    applications.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : total === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(FileText, { size: 24 }),
        title: t("apps.empty.title"),
        description: t("apps.empty.text"),
        actionLabel: t("apps.empty.cta"),
        actionTo: "/jobs"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: (_c = applications.data) == null ? void 0 : _c.items.map((application) => /* @__PURE__ */ jsx(ApplicationCard, { application }, application.id)) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: t("admin.statusBreakdown") }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: APPLICATION_STATUSES.map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-line bg-card-2 px-3 py-2.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: statusLabel(item, lang) }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-lg font-semibold text-fg", children: counts[item] ?? 0 })
      ] }, item)) })
    ] })
  ] });
}
function SavedPage() {
  var _a, _b, _c;
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toggle } = useSavedJobs();
  const saved = useAsync(() => backend.savedJobs(), [user == null ? void 0 : user.id]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("saved.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("saved.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
        /* @__PURE__ */ jsx(Bookmark, { size: 13 }),
        " ",
        ((_a = saved.data) == null ? void 0 : _a.total) ?? 0
      ] })
    ] }),
    saved.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : (((_b = saved.data) == null ? void 0 : _b.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(BookmarkX, { size: 24 }),
        title: t("saved.empty.title"),
        description: t("saved.empty.text"),
        actionLabel: t("saved.empty.cta"),
        actionTo: "/jobs"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: (_c = saved.data) == null ? void 0 : _c.items.map((row) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      row.job ? /* @__PURE__ */ jsx(JobCard, { job: { ...row.job, isSaved: true } }) : null,
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: async () => {
            await toggle(row.jobId);
            await saved.reload();
          },
          children: t("saved.remove")
        }
      ) })
    ] }, row.id)) })
  ] });
}
function ProfilePage() {
  var _a;
  const { t, lang } = useLanguage();
  const { user, setUser, setProfileState, completion } = useAuth();
  const toast = useToast();
  const { meta } = useMeta();
  const loaded = useAsync(() => backend.profile(), [user == null ? void 0 : user.id]);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState((user == null ? void 0 : user.name) ?? "");
  const [skillDraft, setSkillDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [experienceDraft, setExperienceDraft] = useState({ role: "", company: "", from: "", to: "", description: "" });
  const [educationDraft, setEducationDraft] = useState({ degree: "", school: "", from: "", to: "" });
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  useEffect(() => {
    if (loaded.data) {
      setProfile(loaded.data.profile);
      setName(loaded.data.user.name);
    }
  }, [loaded.data]);
  const patch2 = (changes) => setProfile((current) => current ? { ...current, ...changes } : current);
  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value || !profile) return;
    if (profile.skills.includes(value)) {
      setSkillDraft("");
      return;
    }
    patch2({ skills: [...profile.skills, value] });
    setSkillDraft("");
  };
  const save = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const result = await backend.updateProfile({
        name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        category: profile.category,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        languages: profile.languages,
        portfolio: profile.portfolio,
        linkedin: profile.linkedin,
        github: profile.github,
        telegram: profile.telegram,
        expected_salary: profile.expectedSalary,
        experience_level: profile.experienceLevel
      });
      setProfile(result.profile);
      setUser(result.user);
      setProfileState(result.profile);
      toast.success(t("profile.saved"), t("profile.completion", { percent: result.completion }));
      void loaded.reload();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setSaving(false);
    }
  };
  if (loaded.loading || !profile) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-28 w-full rounded-lg" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full rounded-lg" })
    ] });
  }
  const percent = ((_a = loaded.data) == null ? void 0 : _a.completion) ?? completion;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Card, { className: "p-5 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsx(Avatar, { name, src: user == null ? void 0 : user.avatar, size: 76 }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg", children: name || (user == null ? void 0 : user.name) }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted", children: profile.title || t("profile.professionalTitle") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Badge, { tone: "primary", children: user ? roleLabel(user.role, lang) : "" }),
          profile.category ? /* @__PURE__ */ jsx(Badge, { tone: "accent", children: profile.category }) : null,
          profile.experienceLevel ? /* @__PURE__ */ jsx(Badge, { children: experienceLabel(profile.experienceLevel, lang) }) : null,
          /* @__PURE__ */ jsxs(Badge, { children: [
            t("profile.memberSince"),
            ": ",
            formatDate(user == null ? void 0 : user.createdAt, lang)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-56", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: t("dash.completion") }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-fg", children: [
            percent,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Progress, { value: percent, className: "mt-2.5" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-relaxed text-muted", children: t("profile.completionHint") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("profile.title"), subtitle: t("profile.completion", { percent }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Input, { label: t("auth.fullName"), value: name, onChange: (event) => setName(event.target.value) }),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.professionalTitle"),
            value: profile.title ?? "",
            onChange: (event) => patch2({ title: event.target.value }),
            placeholder: "Frontend Developer (React / TypeScript)"
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("profile.location"),
            value: profile.location ?? "",
            onChange: (event) => patch2({ location: event.target.value }),
            placeholder: "—",
            options: ((meta == null ? void 0 : meta.locations) ?? []).map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("auth.phone"),
            value: profile.phone ?? "",
            onChange: (event) => patch2({ phone: event.target.value }),
            placeholder: "+998 90 123 45 67"
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("profile.category"),
            value: profile.category ?? "",
            onChange: (event) => patch2({ category: event.target.value }),
            placeholder: "—",
            options: ((meta == null ? void 0 : meta.categories) ?? []).map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("profile.experienceLevel"),
            value: profile.experienceLevel ?? "",
            onChange: (event) => patch2({ experienceLevel: event.target.value }),
            placeholder: "—",
            options: EXPERIENCE_LEVELS.map((item) => ({ value: item, label: experienceLabel(item, lang) }))
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: `${t("profile.expectedSalary")} (UZS)`,
            type: "number",
            inputMode: "numeric",
            value: profile.expectedSalary ?? "",
            onChange: (event) => patch2({ expectedSalary: event.target.value ? Number(event.target.value) : null })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.languages"),
            value: profile.languages.join(", "),
            onChange: (event) => patch2({ languages: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }),
            placeholder: "Uzbek (native), English (B2)"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
        Textarea,
        {
          label: t("profile.about"),
          value: profile.bio ?? "",
          onChange: (event) => patch2({ bio: event.target.value }),
          rows: 4,
          maxLength: 800,
          counter: true,
          placeholder: t("profile.about")
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 17, className: "text-accent" }),
            " ",
            t("profile.skills")
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
        profile.skills.map((skill) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1.5 rounded-full border border-line bg-card-2 px-3 py-1.5 text-xs font-medium text-fg",
            children: [
              skill,
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => patch2({ skills: profile.skills.filter((item) => item !== skill) }),
                  "aria-label": `${t("common.remove")} ${skill}`,
                  className: "text-subtle transition-colors hover:text-danger",
                  children: /* @__PURE__ */ jsx(Trash2, { size: 13 })
                }
              )
            ]
          },
          skill
        )),
        profile.skills.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-subtle", children: t("profile.addSkill") }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            value: skillDraft,
            onChange: (event) => setSkillDraft(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill();
              }
            },
            placeholder: "React, Figma, SMM…",
            "aria-label": t("profile.addSkill")
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", icon: /* @__PURE__ */ jsx(Plus, { size: 15 }), onClick: addSkill, children: t("common.add") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Briefcase, { size: 17, className: "text-primary" }),
            " ",
            t("profile.experience")
          ] }),
          action: /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(Plus, { size: 14 }), onClick: () => setShowExperienceForm((value) => !value), children: t("profile.addExperience") })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        profile.experience.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 rounded-md border border-line bg-card-2 p-3.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: item.role }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: item.company }),
            /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
              item.from,
              " — ",
              item.to || t("profile.present")
            ] }),
            item.description ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: item.description }) : null
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => patch2({ experience: profile.experience.filter((_, position) => position !== index) }),
              className: "rounded-md p-1.5 text-subtle transition-colors hover:bg-card hover:text-danger",
              "aria-label": t("common.remove"),
              children: /* @__PURE__ */ jsx(Trash2, { size: 15 })
            }
          )
        ] }, `${item.role}-${index}`)),
        profile.experience.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-subtle", children: t("profile.addExperience") }) : null
      ] }),
      showExperienceForm ? /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 rounded-md border border-line bg-card-2 p-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.professionalTitle"),
            value: experienceDraft.role,
            onChange: (event) => setExperienceDraft({ ...experienceDraft, role: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("job.company"),
            value: experienceDraft.company,
            onChange: (event) => setExperienceDraft({ ...experienceDraft, company: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.from"),
            type: "month",
            value: experienceDraft.from,
            onChange: (event) => setExperienceDraft({ ...experienceDraft, from: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.to"),
            type: "month",
            value: experienceDraft.to,
            onChange: (event) => setExperienceDraft({ ...experienceDraft, to: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(
          Textarea,
          {
            label: t("job.responsibilities"),
            rows: 2,
            value: experienceDraft.description ?? "",
            onChange: (event) => setExperienceDraft({ ...experienceDraft, description: event.target.value })
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 sm:col-span-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              onClick: () => {
                if (!experienceDraft.role.trim() || !experienceDraft.company.trim()) return;
                patch2({ experience: [...profile.experience, experienceDraft] });
                setExperienceDraft({ role: "", company: "", from: "", to: "", description: "" });
                setShowExperienceForm(false);
              },
              children: t("common.add")
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowExperienceForm(false), children: t("common.cancel") })
        ] })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(GraduationCap, { size: 17, className: "text-primary" }),
            " ",
            t("profile.education")
          ] }),
          action: /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(Plus, { size: 14 }), onClick: () => setShowEducationForm((value) => !value), children: t("profile.addEducation") })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        profile.education.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 rounded-md border border-line bg-card-2 p-3.5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: item.degree }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: item.school }),
            /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
              item.from,
              " — ",
              item.to
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => patch2({ education: profile.education.filter((_, position) => position !== index) }),
              className: "rounded-md p-1.5 text-subtle transition-colors hover:bg-card hover:text-danger",
              "aria-label": t("common.remove"),
              children: /* @__PURE__ */ jsx(Trash2, { size: 15 })
            }
          )
        ] }, `${item.degree}-${index}`)),
        profile.education.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-subtle", children: t("profile.addEducation") }) : null
      ] }),
      showEducationForm ? /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 rounded-md border border-line bg-card-2 p-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.education"),
            value: educationDraft.degree,
            onChange: (event) => setEducationDraft({ ...educationDraft, degree: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("job.company"),
            value: educationDraft.school,
            onChange: (event) => setEducationDraft({ ...educationDraft, school: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.from"),
            value: educationDraft.from,
            onChange: (event) => setEducationDraft({ ...educationDraft, from: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("profile.to"),
            value: educationDraft.to,
            onChange: (event) => setEducationDraft({ ...educationDraft, to: event.target.value })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 sm:col-span-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              onClick: () => {
                if (!educationDraft.degree.trim() || !educationDraft.school.trim()) return;
                patch2({ education: [...profile.education, educationDraft] });
                setEducationDraft({ degree: "", school: "", from: "", to: "" });
                setShowEducationForm(false);
              },
              children: t("common.add")
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowEducationForm(false), children: t("common.cancel") })
        ] })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Link2, { size: 17, className: "text-primary" }),
            " ",
            t("profile.portfolio")
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Portfolio",
            value: profile.portfolio ?? "",
            onChange: (event) => patch2({ portfolio: event.target.value }),
            placeholder: "https://aziz.dev"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "GitHub",
            value: profile.github ?? "",
            onChange: (event) => patch2({ github: event.target.value }),
            placeholder: "https://github.com/…"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "LinkedIn",
            value: profile.linkedin ?? "",
            onChange: (event) => patch2({ linkedin: event.target.value }),
            placeholder: "https://linkedin.com/in/…"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Telegram",
            value: profile.telegram ?? "",
            onChange: (event) => patch2({ telegram: event.target.value }),
            placeholder: "https://t.me/…"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sticky bottom-20 z-30 lg:bottom-4", children: /* @__PURE__ */ jsxs("div", { className: "lj-card flex items-center justify-between gap-3 p-3.5", children: [
      /* @__PURE__ */ jsxs("p", { className: "hidden text-sm text-muted sm:block", children: [
        /* @__PURE__ */ jsx(UserRound, { size: 14, className: "mr-1.5 inline" }),
        t("profile.completion", { percent })
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: () => void save(), loading: saving, icon: /* @__PURE__ */ jsx(Save, { size: 16 }), className: "w-full sm:w-auto", children: t("profile.save") })
    ] }) })
  ] });
}
const DEFAULT_PREFS = {
  emailApplications: true,
  emailJobs: true,
  telegramNotifications: true,
  profileVisible: true,
  showSalary: true
};
function SettingsPage() {
  const { t, lang, setLang, languages } = useLanguage();
  const { user, setUser, logout, mode: mode2 } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const { meta } = useMeta();
  const [tab, setTab] = useState("account");
  const [form, setForm] = useState({ name: (user == null ? void 0 : user.name) ?? "", phone: (user == null ? void 0 : user.phone) ?? "", location: (user == null ? void 0 : user.location) ?? "" });
  const [savingAccount, setSavingAccount] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    backend.preferences().then((result) => setPrefs({ ...DEFAULT_PREFS, ...result.preferences })).catch(() => void 0);
  }, []);
  const saveAccount = async () => {
    setSavingAccount(true);
    try {
      const result = await backend.updateSettings({ name: form.name, phone: form.phone, location: form.location, theme, language: lang });
      setUser(result.user);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setSavingAccount(false);
    }
  };
  const changePassword = async () => {
    if (passwords.next.length < 8) {
      toast.error(t("error.passwordLength"));
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error(t("error.passwordMatch"));
      return;
    }
    setSavingPassword(true);
    try {
      await backend.changePassword({ current_password: passwords.current, new_password: passwords.next });
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success(t("settings.passwordChanged"));
    } catch {
      toast.error(t("error.invalidCredentials"));
    } finally {
      setSavingPassword(false);
    }
  };
  const updatePrefs = async (patch2) => {
    const next = { ...prefs, ...patch2 };
    setPrefs(next);
    try {
      await backend.updatePreferences(patch2);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("error.generic"));
    }
  };
  const exportData = async () => {
    try {
      const data = await backend.profile();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `localjob-profile-${user == null ? void 0 : user.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(t("settings.exportDone"));
    } catch {
      toast.error(t("error.generic"));
    }
  };
  const removeAccount = async () => {
    setDeleting(true);
    try {
      await backend.deleteAccount(deletePassword);
      toast.success(t("settings.deleteAccount"));
      await logout();
      navigate("/");
    } catch {
      toast.error(t("error.invalidCredentials"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("settings.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("settings.subtitle") })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: tab,
        onChange: setTab,
        tabs: [
          { value: "account", label: t("settings.account") },
          { value: "password", label: t("settings.password") },
          { value: "notifications", label: t("settings.notifications") },
          { value: "privacy", label: t("settings.privacy") }
        ]
      }
    ),
    tab === "account" ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(UserCog, { size: 17, className: "text-primary" }),
            " ",
            t("settings.account")
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Input, { label: t("auth.fullName"), value: form.name, onChange: (event) => setForm({ ...form, name: event.target.value }) }),
        /* @__PURE__ */ jsx(Input, { label: t("auth.email"), value: (user == null ? void 0 : user.email) ?? "", disabled: true }),
        /* @__PURE__ */ jsx(Input, { label: t("auth.phone"), value: form.phone ?? "", onChange: (event) => setForm({ ...form, phone: event.target.value }) }),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("auth.location"),
            value: form.location ?? "",
            onChange: (event) => setForm({ ...form, location: event.target.value }),
            placeholder: "—",
            options: ((meta == null ? void 0 : meta.locations) ?? []).map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("nav.language"),
            value: lang,
            onChange: (event) => setLang(event.target.value),
            options: languages.map((item) => ({ value: item.code, label: `${item.flag} ${item.label}` }))
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("nav.theme"),
            value: theme,
            onChange: (event) => setTheme(event.target.value),
            options: [
              { value: "dark", label: t("nav.darkTheme") },
              { value: "light", label: t("nav.lightTheme") }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsx(Button, { onClick: () => void saveAccount(), loading: savingAccount, children: t("common.save") }),
        /* @__PURE__ */ jsx("span", { className: cn("lj-chip", mode2 === "offline" && "border-warning/40 text-warning"), children: mode2 === "offline" ? t("common.offlineMode") : t("common.onlineMode") }),
        /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
          (user == null ? void 0 : user.telegramId) ? t("settings.telegramLinked") : t("settings.telegramNotLinked"),
          " · @",
          meta == null ? void 0 : meta.app.botUsername
        ] })
      ] })
    ] }) : null,
    tab === "password" ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(KeyRound, { size: 17, className: "text-primary" }),
            " ",
            t("settings.password")
          ] }),
          subtitle: t("settings.deleteWarning").split(".")[0]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid max-w-lg gap-4", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("settings.currentPassword"),
            type: "password",
            value: passwords.current,
            onChange: (event) => setPasswords({ ...passwords, current: event.target.value }),
            autoComplete: "current-password"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("settings.newPassword"),
            type: "password",
            value: passwords.next,
            onChange: (event) => setPasswords({ ...passwords, next: event.target.value }),
            autoComplete: "new-password",
            hint: "min 8"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("settings.confirmNewPassword"),
            type: "password",
            value: passwords.confirm,
            onChange: (event) => setPasswords({ ...passwords, confirm: event.target.value }),
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { onClick: () => void changePassword(), loading: savingPassword, icon: /* @__PURE__ */ jsx(KeyRound, { size: 15 }), children: t("settings.updatePassword") }) })
      ] })
    ] }) : null,
    tab === "notifications" ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Bell, { size: 17, className: "text-primary" }),
            " ",
            t("settings.notifications")
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 max-w-xl divide-y divide-line", children: [
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: prefs.emailApplications,
            onChange: (checked) => void updatePrefs({ emailApplications: checked }),
            label: t("settings.notifApplications"),
            description: t("settings.notifJobs")
          }
        ),
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: prefs.emailJobs,
            onChange: (checked) => void updatePrefs({ emailJobs: checked }),
            label: t("settings.notifJobs"),
            description: t("dash.recommended")
          }
        ),
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: prefs.telegramNotifications,
            onChange: (checked) => void updatePrefs({ telegramNotifications: checked }),
            label: t("settings.notifTelegram"),
            description: t("settings.telegramHint")
          }
        )
      ] })
    ] }) : null,
    tab === "privacy" ? /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Shield, { size: 17, className: "text-primary" }),
              " ",
              t("settings.privacy")
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 max-w-xl divide-y divide-line", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: prefs.profileVisible,
              onChange: (checked) => void updatePrefs({ profileVisible: checked }),
              label: t("settings.privacyProfile")
            }
          ),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: prefs.showSalary,
              onChange: (checked) => void updatePrefs({ showSalary: checked }),
              label: t("settings.privacySalary")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", icon: /* @__PURE__ */ jsx(Download, { size: 15 }), onClick: () => void exportData(), children: t("settings.exportData") }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", icon: /* @__PURE__ */ jsx(LogOut, { size: 15 }), onClick: async () => {
            await logout();
            navigate("/");
          }, children: t("nav.signOut") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-danger/35 p-5 sm:p-6", children: [
        /* @__PURE__ */ jsx(
          SectionHeading,
          {
            title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-danger", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { size: 17 }),
              " ",
              t("settings.dangerZone")
            ] }),
            subtitle: t("settings.deleteWarning")
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "danger", className: "mt-4", icon: /* @__PURE__ */ jsx(Trash2, { size: 15 }), onClick: () => setDeleteOpen(true), children: t("settings.deleteAccount") })
      ] })
    ] }) : null,
    /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        open: deleteOpen,
        onClose: () => setDeleteOpen(false),
        title: t("settings.deleteAccount"),
        description: t("settings.deleteWarning"),
        confirmLabel: t("settings.deleteConfirm"),
        cancelLabel: t("common.cancel"),
        loading: deleting,
        onConfirm: () => void removeAccount()
      }
    ),
    deleteOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 bottom-24 z-[95] mx-auto max-w-sm px-4 sm:bottom-6", children: /* @__PURE__ */ jsx("div", { className: "lj-card p-3", children: /* @__PURE__ */ jsx(
      Input,
      {
        type: "password",
        label: t("settings.currentPassword"),
        value: deletePassword,
        onChange: (event) => setDeletePassword(event.target.value)
      }
    ) }) }) : null
  ] });
}
function NotificationsPage() {
  var _a, _b;
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const notifications = useAsync(() => backend.notifications(), [user == null ? void 0 : user.id]);
  const items = ((_a = notifications.data) == null ? void 0 : _a.items) ?? [];
  return /* @__PURE__ */ jsx("div", { className: "lj-container py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl space-y-5", children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Bell, { size: 19, className: "text-primary" }),
          " ",
          t("nav.notifications")
        ] }),
        subtitle: `${((_b = notifications.data) == null ? void 0 : _b.unread) ?? 0} ${t("common.new").toLowerCase()}`,
        action: items.length ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              icon: /* @__PURE__ */ jsx(CheckCheck, { size: 14 }),
              onClick: async () => {
                await backend.markNotifications({ all: true });
                await notifications.reload();
              },
              children: t("common.markAllRead")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              icon: /* @__PURE__ */ jsx(Trash2, { size: 14 }),
              onClick: async () => {
                await backend.clearNotifications();
                await notifications.reload();
              },
              children: t("common.delete")
            }
          )
        ] }) : null
      }
    ),
    notifications.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : items.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Bell, { size: 24 }), title: t("common.noNotifications"), description: t("dash.subtitle") }) : /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: items.map((note) => /* @__PURE__ */ jsx(Card, { className: note.isRead ? "p-4" : "border-primary/35 bg-primary/[0.04] p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent/12 text-accent", children: /* @__PURE__ */ jsx(Bell, { size: 16 }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: note.title }),
          !note.isRead ? /* @__PURE__ */ jsx(Badge, { tone: "primary", children: t("common.new") }) : null
        ] }),
        note.message ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted", children: note.message }) : null,
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-subtle", children: [
          /* @__PURE__ */ jsx("span", { children: relativeTime(note.createdAt, lang) }),
          note.link ? /* @__PURE__ */ jsx(
            Link,
            {
              to: note.link,
              className: "font-medium text-primary hover:underline",
              onClick: async () => {
                if (!note.isRead) {
                  await backend.markNotifications({ ids: [note.id] });
                  await notifications.reload();
                }
              },
              children: t("common.viewAll")
            }
          ) : null
        ] })
      ] })
    ] }) }, note.id)) })
  ] }) });
}
function CompaniesPage() {
  var _a, _b;
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const debounced = useDebounced(search, 300);
  const companies2 = useAsync(() => backend.companies({ search: debounced || void 0 }), [debounced]);
  return /* @__PURE__ */ jsxs("div", { className: "lj-container py-8", children: [
    /* @__PURE__ */ jsx(SectionHeading, { title: t("companies.title"), subtitle: t("companies.subtitle") }),
    /* @__PURE__ */ jsx("div", { className: "mt-5 max-w-md", children: /* @__PURE__ */ jsx(
      Input,
      {
        value: search,
        onChange: (event) => setSearch(event.target.value),
        placeholder: t("companies.searchPlaceholder"),
        "aria-label": t("companies.searchPlaceholder")
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: companies2.loading ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsxs("div", { className: "lj-card h-40 p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "lj-skeleton h-11 w-11 rounded-md" }),
      /* @__PURE__ */ jsx("div", { className: "lj-skeleton mt-4 h-4 w-2/3" }),
      /* @__PURE__ */ jsx("div", { className: "lj-skeleton mt-3 h-3 w-1/2" })
    ] }, index)) }) : (((_a = companies2.data) == null ? void 0 : _a.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(Building2, { size: 24 }),
        title: t("companies.empty"),
        description: t("jobs.empty.text"),
        actionLabel: t("nav.jobs"),
        actionTo: "/jobs"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: (_b = companies2.data) == null ? void 0 : _b.items.map((company) => /* @__PURE__ */ jsx(CompanyCard, { company }, company.id)) }) }),
    companies2.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 1, className: "hidden" }) : null
  ] });
}
function CompanyPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const company = useAsync(() => backend.company(Number(id)), [id]);
  if (company.loading) {
    return /* @__PURE__ */ jsxs("div", { className: "lj-container py-8", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-40 w-full rounded-lg" }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) })
    ] });
  }
  if (!company.data) {
    return /* @__PURE__ */ jsx("div", { className: "lj-container py-16", children: /* @__PURE__ */ jsx(EmptyState, { title: t("company.notFound"), description: t("common.notFoundText"), actionLabel: t("nav.jobs"), actionTo: "/jobs" }) });
  }
  const data = company.data;
  return /* @__PURE__ */ jsxs("div", { className: "lj-container py-8", children: [
    /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden p-5 sm:p-7", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl",
          style: { background: `radial-gradient(circle, ${data.color ?? "rgb(var(--primary))"}, transparent 65%)` },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-5 sm:flex-row sm:items-start", children: [
        /* @__PURE__ */ jsx(CompanyLogo, { name: data.name, logo: data.logo, color: data.color, size: 72 }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: data.name }),
            data.verified ? /* @__PURE__ */ jsx(VerifiedBadge, { label: t("company.verified") }) : null
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: data.industry }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-3 text-xs text-muted", children: [
            data.location ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 13, className: "text-subtle" }),
              " ",
              data.location
            ] }) : null,
            data.size ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Users, { size: 13, className: "text-subtle" }),
              " ",
              data.size
            ] }) : null,
            data.website ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: data.website,
                target: "_blank",
                rel: "noreferrer",
                className: "inline-flex items-center gap-1.5 text-primary hover:underline",
                children: [
                  /* @__PURE__ */ jsx(Globe, { size: 13 }),
                  " ",
                  data.website.replace(/^https?:\/\//, "")
                ]
              }
            ) : null,
            /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
              /* @__PURE__ */ jsx(Building2, { size: 12 }),
              " ",
              data.openJobsCount ?? 0,
              " ",
              t("company.openJobs").toLowerCase()
            ] })
          ] })
        ] })
      ] }),
      data.about ? /* @__PURE__ */ jsxs("div", { className: "relative mt-6 border-t border-line pt-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: t("company.about") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: data.about })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("company.openJobs"), subtitle: t("featured.subtitle") }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: data.jobs.length ? data.jobs.map((job) => /* @__PURE__ */ jsx(JobCard, { job }, job.id)) : /* @__PURE__ */ jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsx(Building2, { size: 22 }),
          title: t("company.noJobs"),
          description: t("jobs.empty.text"),
          actionLabel: t("featured.viewAll"),
          actionTo: "/jobs"
        }
      ) })
    ] })
  ] });
}
function NotFoundPage() {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsx("div", { className: "lj-container py-20", children: /* @__PURE__ */ jsx(
    EmptyState,
    {
      icon: /* @__PURE__ */ jsx(Compass, { size: 26 }),
      title: `404 · ${t("common.notFoundTitle")}`,
      description: t("common.notFoundText"),
      actionLabel: t("common.goHome"),
      actionTo: "/"
    }
  ) });
}
const EMPTY = {
  title: "",
  category: "",
  companyName: "",
  location: "",
  isRemote: false,
  salaryMin: "",
  salaryMax: "",
  currency: "UZS",
  employmentType: "Full-time",
  experienceLevel: "Middle",
  description: "",
  responsibilities: [""],
  requirements: [""],
  benefits: [""],
  skills: []
};
function PostJob() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { t, lang } = useLanguage();
  const { user, company } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { meta } = useMeta();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [skillDraft, setSkillDraft] = useState("");
  useEffect(() => {
    setForm((current) => ({ ...current, companyName: (company == null ? void 0 : company.name) ?? current.companyName }));
  }, [company]);
  useEffect(() => {
    if (!editing || !id) return;
    let active = true;
    backend.job(Number(id)).then((job) => {
      var _a, _b, _c, _d;
      if (!active) return;
      setForm({
        title: job.title,
        category: job.category,
        companyName: ((_a = job.company) == null ? void 0 : _a.name) ?? "",
        location: job.location,
        isRemote: Boolean(job.isRemote),
        salaryMin: job.salaryMin ? String(job.salaryMin) : "",
        salaryMax: job.salaryMax ? String(job.salaryMax) : "",
        currency: job.currency || "UZS",
        employmentType: String(job.employmentType),
        experienceLevel: String(job.experienceLevel),
        description: job.description ?? "",
        responsibilities: ((_b = job.responsibilities) == null ? void 0 : _b.length) ? job.responsibilities : [""],
        requirements: ((_c = job.requirements) == null ? void 0 : _c.length) ? job.requirements : [""],
        benefits: ((_d = job.benefits) == null ? void 0 : _d.length) ? job.benefits : [""],
        skills: job.skills ?? []
      });
    }).catch(() => toast.error(t("error.jobNotFound"))).finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [editing, id]);
  const setList = (key, index, value) => setForm((current) => {
    const next = [...current[key]];
    next[index] = value;
    return { ...current, [key]: next };
  });
  const addListRow = (key) => setForm((current) => ({ ...current, [key]: [...current[key], ""] }));
  const removeListRow = (key, index) => setForm((current) => ({ ...current, [key]: current[key].filter((_, position) => position !== index) }));
  const validate = () => {
    const next = {};
    if (form.title.trim().length < 3) next.title = t("error.required");
    if (!form.category) next.category = t("error.required");
    if (!form.location.trim()) next.location = t("error.required");
    if (form.description.trim().length < 20) next.description = t("error.required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async (status) => {
    if (!validate()) {
      toast.error(t("error.generic"), t("post.subtitle"));
      return;
    }
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      category: form.category,
      companyName: form.companyName || (company == null ? void 0 : company.name) || (user == null ? void 0 : user.name),
      location: form.isRemote ? "Remote" : form.location,
      isRemote: form.isRemote,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      currency: form.currency,
      employmentType: form.employmentType,
      experienceLevel: form.experienceLevel,
      description: form.description.trim(),
      responsibilities: form.responsibilities.map((item) => item.trim()).filter(Boolean),
      requirements: form.requirements.map((item) => item.trim()).filter(Boolean),
      benefits: form.benefits.map((item) => item.trim()).filter(Boolean),
      skills: form.skills,
      status
    };
    try {
      if (editing && id) {
        await backend.updateJob(Number(id), payload);
        toast.success(t("emp.updated"));
      } else {
        await backend.createJob(payload);
        toast.success(t("post.published"), t("post.subtitle"));
      }
      navigate("/employer/jobs");
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-64" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-96 w-full rounded-lg" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: editing ? t("emp.edit") : t("post.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("post.subtitle") })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx(ArrowLeft, { size: 15 }), onClick: () => navigate("/employer/jobs"), children: t("common.back") })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("post.step.basics") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(
          Input,
          {
            label: t("post.jobTitle"),
            value: form.title,
            onChange: (event) => setForm({ ...form, title: event.target.value }),
            error: errors.title,
            required: true,
            placeholder: t("post.jobTitlePlaceholder")
          }
        ) }),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("post.category"),
            value: form.category,
            onChange: (event) => setForm({ ...form, category: event.target.value }),
            error: errors.category,
            required: true,
            placeholder: "—",
            options: ((meta == null ? void 0 : meta.categories) ?? []).map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("post.company"),
            value: form.companyName,
            onChange: (event) => setForm({ ...form, companyName: event.target.value }),
            placeholder: "TechNova Solutions"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("post.location"),
            value: form.location,
            onChange: (event) => setForm({ ...form, location: event.target.value }),
            error: errors.location,
            required: true,
            disabled: form.isRemote,
            list: "post-job-locations",
            placeholder: "Tashkent"
          }
        ),
        /* @__PURE__ */ jsx("datalist", { id: "post-job-locations", children: ((meta == null ? void 0 : meta.locations) ?? []).map((item) => /* @__PURE__ */ jsx("option", { value: item }, item)) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: form.isRemote,
            onChange: (checked) => setForm({ ...form, isRemote: checked }),
            label: t("post.remote")
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("post.step.details") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("post.salaryMin"),
            type: "number",
            inputMode: "numeric",
            value: form.salaryMin,
            onChange: (event) => setForm({ ...form, salaryMin: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("post.salaryMax"),
            type: "number",
            inputMode: "numeric",
            value: form.salaryMax,
            onChange: (event) => setForm({ ...form, salaryMax: event.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("post.currency"),
            value: form.currency,
            onChange: (event) => setForm({ ...form, currency: event.target.value }),
            options: ((meta == null ? void 0 : meta.currencies) ?? ["UZS", "USD", "EUR"]).map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("post.employmentType"),
            value: form.employmentType,
            onChange: (event) => setForm({ ...form, employmentType: event.target.value }),
            options: EMPLOYMENT_TYPES.map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("post.experience"),
            value: form.experienceLevel,
            onChange: (event) => setForm({ ...form, experienceLevel: event.target.value }),
            options: EXPERIENCE_LEVELS.map((item) => ({ value: item, label: item }))
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
        Textarea,
        {
          label: t("post.description"),
          hint: t("post.descriptionHint"),
          value: form.description,
          onChange: (event) => setForm({ ...form, description: event.target.value }),
          error: errors.description,
          rows: 6,
          maxLength: 2400,
          counter: true,
          required: true
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("post.step.requirements") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx(
          ListEditor,
          {
            title: t("post.responsibilities"),
            items: form.responsibilities,
            onChange: (index, value) => setList("responsibilities", index, value),
            onAdd: () => addListRow("responsibilities"),
            onRemove: (index) => removeListRow("responsibilities", index),
            addLabel: t("post.addLine")
          }
        ),
        /* @__PURE__ */ jsx(
          ListEditor,
          {
            title: t("post.requirements"),
            items: form.requirements,
            onChange: (index, value) => setList("requirements", index, value),
            onAdd: () => addListRow("requirements"),
            onRemove: (index) => removeListRow("requirements", index),
            addLabel: t("post.addLine")
          }
        ),
        /* @__PURE__ */ jsx(
          ListEditor,
          {
            title: t("post.benefits"),
            items: form.benefits,
            onChange: (index, value) => setList("benefits", index, value),
            onAdd: () => addListRow("benefits"),
            onRemove: (index) => removeListRow("benefits", index),
            addLabel: t("post.addLine")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-fg", children: t("post.skills") }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: form.skills.map((skill) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1.5 rounded-full border border-line bg-card-2 px-3 py-1.5 text-xs font-medium text-fg",
            children: [
              skill,
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setForm({ ...form, skills: form.skills.filter((item) => item !== skill) }),
                  className: "text-subtle transition-colors hover:text-danger",
                  "aria-label": `${t("common.remove")} ${skill}`,
                  children: /* @__PURE__ */ jsx(Trash2, { size: 13 })
                }
              )
            ]
          },
          skill
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex max-w-lg gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              value: skillDraft,
              onChange: (event) => setSkillDraft(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const value = skillDraft.trim();
                  if (value && !form.skills.includes(value)) setForm({ ...form, skills: [...form.skills, value] });
                  setSkillDraft("");
                }
              },
              placeholder: "React, FastAPI, Figma…",
              "aria-label": t("post.addSkill")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              icon: /* @__PURE__ */ jsx(Plus, { size: 15 }),
              onClick: () => {
                const value = skillDraft.trim();
                if (value && !form.skills.includes(value)) setForm({ ...form, skills: [...form.skills, value] });
                setSkillDraft("");
              },
              children: t("common.add")
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sticky bottom-20 z-30 lg:bottom-4", children: /* @__PURE__ */ jsxs(Card, { className: "flex flex-wrap items-center justify-between gap-3 p-3.5", children: [
      /* @__PURE__ */ jsxs("p", { className: "hidden items-center gap-2 text-sm text-muted sm:flex", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { size: 15, className: "text-success" }),
        t("post.subtitle")
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-2 sm:w-auto", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void submit("paused"), disabled: submitting, icon: /* @__PURE__ */ jsx(Save, { size: 15 }), children: t("post.saveDraft") }),
        /* @__PURE__ */ jsx(Button, { onClick: () => void submit("active"), loading: submitting, icon: /* @__PURE__ */ jsx(Rocket, { size: 15 }), children: t("post.publish") })
      ] })
    ] }) }),
    lang ? null : null
  ] });
}
function ListEditor({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
  addLabel
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-fg", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: items.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Input, { value: item, onChange: (event) => onChange(index, event.target.value) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => onRemove(index),
          disabled: items.length === 1,
          "aria-label": "Remove row",
          children: /* @__PURE__ */ jsx(Trash2, { size: 15 })
        }
      )
    ] }, `${title}-${index}`)) }),
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "mt-2", icon: /* @__PURE__ */ jsx(Plus, { size: 14 }), onClick: onAdd, children: addLabel })
  ] });
}
function EmployerDashboard() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const dashboard = useAsync(() => backend.employerDashboard(), [user == null ? void 0 : user.id]);
  const stats = (_a = dashboard.data) == null ? void 0 : _a.stats;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full opacity-25 blur-3xl",
          style: { background: "radial-gradient(circle, rgb(var(--accent)), transparent 65%)" },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx(
            CompanyLogo,
            {
              name: ((_c = (_b = dashboard.data) == null ? void 0 : _b.company) == null ? void 0 : _c.name) ?? (user == null ? void 0 : user.name),
              logo: (_e = (_d = dashboard.data) == null ? void 0 : _d.company) == null ? void 0 : _e.logo,
              color: (_g = (_f = dashboard.data) == null ? void 0 : _f.company) == null ? void 0 : _g.color,
              size: 56
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("emp.title") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("emp.subtitle") }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-subtle", children: [
              ((_i = (_h = dashboard.data) == null ? void 0 : _h.company) == null ? void 0 : _i.name) ?? (user == null ? void 0 : user.name),
              " · ",
              ((_k = (_j = dashboard.data) == null ? void 0 : _j.company) == null ? void 0 : _k.location) ?? (user == null ? void 0 : user.location) ?? ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs/new", icon: /* @__PURE__ */ jsx(Plus, { size: 16 }), children: t("emp.postNewJob") }),
          /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/applications", variant: "secondary", icon: /* @__PURE__ */ jsx(Users, { size: 16 }), children: t("emp.candidates") })
        ] })
      ] })
    ] }),
    dashboard.loading ? /* @__PURE__ */ jsx(StatsSkeleton, {}) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Briefcase, { size: 17 }), label: t("emp.activeJobs"), value: (stats == null ? void 0 : stats.activeJobs) ?? 0, hint: `${(stats == null ? void 0 : stats.pausedJobs) ?? 0} ${statusLabel("paused", lang).toLowerCase()}` }),
      /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Send, { size: 17 }), label: t("emp.totalApplications"), value: (stats == null ? void 0 : stats.applications) ?? 0, hint: `+${(stats == null ? void 0 : stats.newThisWeek) ?? 0} ${t("emp.newThisWeek").toLowerCase()}` }),
      /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Eye, { size: 17 }), label: t("emp.views"), value: (stats == null ? void 0 : stats.views) ?? 0 }),
      /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(UserCheck, { size: 17 }), label: t("emp.hired"), value: (stats == null ? void 0 : stats.hired) ?? 0 })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: t("emp.activeListings"),
          action: /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs", variant: "ghost", size: "sm", iconRight: /* @__PURE__ */ jsx(ArrowRight, { size: 15 }), children: t("common.viewAll") })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        (((_l = dashboard.data) == null ? void 0 : _l.jobs) ?? []).slice(0, 5).map((job) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-md border border-line bg-card-2 p-3.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-fg", children: /* @__PURE__ */ jsx(Link, { to: `/jobs/${job.id}`, className: "transition-colors hover:text-primary", children: job.title }) }),
            /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
              job.location,
              " · ",
              formatDate(job.createdAt, lang),
              " · ",
              job.applicationsCount ?? 0,
              " ",
              t("job.applicants").toLowerCase()
            ] })
          ] }),
          /* @__PURE__ */ jsx(Badge, { tone: statusTone(job.status), children: statusLabel(job.status, lang) }),
          /* @__PURE__ */ jsx(ButtonLink, { to: `/employer/jobs/${job.id}/edit`, variant: "secondary", size: "sm", children: t("emp.edit") })
        ] }, job.id)),
        !dashboard.loading && (((_m = dashboard.data) == null ? void 0 : _m.jobs.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsx(Briefcase, { size: 22 }),
            title: t("emp.noJobs.title"),
            description: t("emp.noJobs.text"),
            actionLabel: t("emp.noJobs.cta"),
            actionTo: "/employer/jobs/new",
            variant: "compact"
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: t("emp.recentApplications"),
          action: /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/applications", variant: "ghost", size: "sm", iconRight: /* @__PURE__ */ jsx(ArrowRight, { size: 15 }), children: t("common.viewAll") })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        (((_n = dashboard.data) == null ? void 0 : _n.recentApplications) ?? []).map((application) => {
          var _a2, _b2;
          return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-md border border-line bg-card-2 p-3.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-fg", children: ((_a2 = application.applicant) == null ? void 0 : _a2.name) ?? application.fullName }),
              /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
                (_b2 = application.job) == null ? void 0 : _b2.title,
                " · ",
                formatDate(application.createdAt, lang)
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { tone: "accent", children: t("emp.match", { score: application.matchScore }) }),
            /* @__PURE__ */ jsx(Badge, { tone: statusTone(application.status), children: statusLabel(application.status, lang) })
          ] }, application.id);
        }),
        !dashboard.loading && (((_o = dashboard.data) == null ? void 0 : _o.recentApplications.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsx(Users, { size: 22 }),
            title: t("emp.noCandidates.title"),
            description: t("emp.noCandidates.text"),
            actionLabel: t("emp.noCandidates.cta"),
            actionTo: "/employer/jobs/new",
            variant: "compact"
          }
        ) : null
      ] })
    ] })
  ] });
}
function Stat({ icon, label, value, hint }) {
  return /* @__PURE__ */ jsxs("div", { className: "lj-card p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: label }),
      /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary", children: icon })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-2xl font-semibold tracking-tight text-fg", children: value }),
    hint ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted", children: hint }) : null
  ] });
}
function EmployerJobs() {
  var _a;
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(null);
  const jobs2 = useAsync(() => backend.myJobs(), [user == null ? void 0 : user.id]);
  const items = ((_a = jobs2.data) == null ? void 0 : _a.items) ?? [];
  const filtered = statusFilter === "all" ? items : items.filter((job) => job.status === statusFilter);
  const changeStatus = async (job, status) => {
    setBusy(job.id);
    try {
      await backend.updateJob(job.id, { status });
      toast.success(status === "paused" ? t("emp.paused") : t("emp.activated"));
      await jobs2.reload();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setBusy(null);
    }
  };
  const remove = async () => {
    if (!pendingDelete) return;
    try {
      await backend.deleteJob(pendingDelete.id);
      toast.success(t("emp.deleted"));
      setPendingDelete(null);
      await jobs2.reload();
    } catch {
      toast.error(t("error.generic"));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("emp.myJobs") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("emp.myJobs.subtitle") })
      ] }),
      /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs/new", icon: /* @__PURE__ */ jsx(Plus, { size: 16 }), children: t("emp.postNewJob") })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: statusFilter,
        onChange: setStatusFilter,
        tabs: [
          { value: "all", label: t("common.all"), count: items.length },
          { value: "active", label: statusLabel("active", lang), count: items.filter((job) => job.status === "active").length },
          { value: "paused", label: statusLabel("paused", lang), count: items.filter((job) => job.status === "paused").length },
          { value: "closed", label: statusLabel("closed", lang), count: items.filter((job) => job.status === "closed").length }
        ]
      }
    ),
    jobs2.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : filtered.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(Briefcase, { size: 24 }),
        title: t("emp.noJobs.title"),
        description: t("emp.noJobs.text"),
        actionLabel: t("emp.noJobs.cta"),
        actionTo: "/employer/jobs/new"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: filtered.map((job) => /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h2", { className: "truncate text-[15px] font-semibold text-fg", children: /* @__PURE__ */ jsx(Link, { to: `/jobs/${job.id}`, className: "transition-colors hover:text-primary", children: job.title }) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
            job.location,
            " · ",
            formatDate(job.createdAt, lang),
            " · ",
            job.salaryLabel
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-muted", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Eye, { size: 13 }),
              " ",
              job.views
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(FileText, { size: 13 }),
              " ",
              job.applicationsCount ?? 0
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Badge, { tone: statusTone(job.status), children: statusLabel(job.status, lang) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(ButtonLink, { to: `/jobs/${job.id}`, variant: "secondary", size: "sm", children: t("emp.view") }),
        /* @__PURE__ */ jsx(ButtonLink, { to: `/employer/jobs/${job.id}/edit`, variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(Pencil, { size: 14 }), children: t("emp.edit") }),
        job.status === "active" ? /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            icon: /* @__PURE__ */ jsx(Pause, { size: 14 }),
            disabled: busy === job.id,
            onClick: () => void changeStatus(job, "paused"),
            children: t("emp.pause")
          }
        ) : /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            icon: /* @__PURE__ */ jsx(Play, { size: 14 }),
            disabled: busy === job.id,
            onClick: () => void changeStatus(job, "active"),
            children: t("emp.activate")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "text-danger hover:bg-danger/10",
            icon: /* @__PURE__ */ jsx(Trash2, { size: 14 }),
            onClick: () => setPendingDelete(job),
            children: t("emp.delete")
          }
        )
      ] })
    ] }, job.id)) }),
    /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        open: Boolean(pendingDelete),
        onClose: () => setPendingDelete(null),
        title: t("emp.confirmDeleteTitle"),
        description: pendingDelete ? t("emp.confirmDeleteText", { title: pendingDelete.title }) : "",
        confirmLabel: t("emp.delete"),
        cancelLabel: t("common.cancel"),
        onConfirm: () => void remove()
      }
    )
  ] });
}
function EmployerApplications() {
  var _a, _b, _c, _d;
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("all");
  const applications = useAsync(
    () => backend.employerApplications({
      jobId: jobId ? Number(jobId) : void 0,
      status: status === "all" ? void 0 : status
    }),
    [user == null ? void 0 : user.id, jobId, status]
  );
  const items = ((_a = applications.data) == null ? void 0 : _a.items) ?? [];
  const counts = ((_b = applications.data) == null ? void 0 : _b.counts) ?? {};
  const jobs2 = ((_c = applications.data) == null ? void 0 : _c.jobs) ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("emp.candidates") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("emp.candidates.subtitle") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full sm:w-64", children: /* @__PURE__ */ jsx(
        Select,
        {
          "aria-label": t("emp.allJobs"),
          value: jobId,
          onChange: (event) => setJobId(event.target.value),
          placeholder: t("emp.allJobs"),
          options: jobs2.map((job) => ({ value: String(job.id), label: job.title }))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: status,
        onChange: setStatus,
        tabs: [
          { value: "all", label: t("emp.allStatuses"), count: ((_d = applications.data) == null ? void 0 : _d.total) ?? 0 },
          ...APPLICATION_STATUSES.map((item) => ({
            value: item,
            label: statusLabel(item, lang),
            count: counts[item] ?? 0
          })).filter((tab) => (tab.count ?? 0) > 0)
        ]
      }
    ),
    applications.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : items.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(Users, { size: 24 }),
        title: t("emp.noCandidates.title"),
        description: t("emp.noCandidates.text"),
        actionLabel: t("emp.noCandidates.cta"),
        actionTo: "/employer/jobs/new"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: items.map((application) => /* @__PURE__ */ jsx(
      CandidateCard,
      {
        application,
        onStatusChange: () => {
          void applications.reload();
        }
      },
      application.id
    )) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-fg", children: t("admin.statusBreakdown") }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: APPLICATION_STATUSES.map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-line bg-card-2 px-3 py-2.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: statusLabel(item, lang) }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-lg font-semibold text-fg", children: counts[item] ?? 0 })
      ] }, item)) })
    ] })
  ] });
}
function EmployerCompany() {
  const { t } = useLanguage();
  const { company, setCompany, user } = useAuth();
  const toast = useToast();
  const { meta } = useMeta();
  const [form, setForm] = useState({
    name: (company == null ? void 0 : company.name) ?? "",
    industry: (company == null ? void 0 : company.industry) ?? "",
    location: (company == null ? void 0 : company.location) ?? "",
    size: (company == null ? void 0 : company.size) ?? "",
    website: (company == null ? void 0 : company.website) ?? "",
    about: (company == null ? void 0 : company.about) ?? "",
    logo: (company == null ? void 0 : company.logo) ?? ""
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name,
      industry: company.industry ?? "",
      location: company.location ?? "",
      size: company.size ?? "",
      website: company.website ?? "",
      about: company.about ?? "",
      logo: company.logo ?? ""
    });
  }, [company]);
  const save = async () => {
    setSaving(true);
    try {
      const result = await backend.saveCompany(form);
      setCompany(result.company);
      toast.success(t("emp.companySaved"));
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setSaving(false);
    }
  };
  const sizes = ["1-10 employees", "10-25 employees", "25-50 employees", "50-100 employees", "100-250 employees", "250-500 employees", "500+ employees"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("emp.companyProfile") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("company.about") })
      ] }),
      company ? /* @__PURE__ */ jsx(ButtonLink, { to: `/company/${company.id}`, variant: "secondary", size: "sm", children: t("emp.view") }) : null
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(CompanyLogo, { name: form.name || (user == null ? void 0 : user.name), logo: form.logo, color: company == null ? void 0 : company.color, size: 56 }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: form.name || (user == null ? void 0 : user.name) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: form.industry || t("job.industry") })
        ] })
      ] }),
      /* @__PURE__ */ jsx(SectionHeading, { title: t("company.about"), className: "mt-6" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Input, { label: t("post.company"), value: form.name, onChange: (event) => setForm({ ...form, name: event.target.value }), required: true }),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("job.industry"),
            value: form.industry,
            onChange: (event) => setForm({ ...form, industry: event.target.value }),
            placeholder: "Software Development"
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("jobs.location"),
            value: form.location,
            onChange: (event) => setForm({ ...form, location: event.target.value }),
            placeholder: "—",
            options: ((meta == null ? void 0 : meta.locations) ?? []).map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Select,
          {
            label: t("job.size"),
            value: form.size,
            onChange: (event) => setForm({ ...form, size: event.target.value }),
            placeholder: "—",
            options: sizes.map((item) => ({ value: item, label: item }))
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: t("job.website"),
            value: form.website,
            onChange: (event) => setForm({ ...form, website: event.target.value }),
            placeholder: "https://technova.uz"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Logo (2-3 harf)",
            value: form.logo,
            onChange: (event) => setForm({ ...form, logo: event.target.value.slice(0, 3).toUpperCase() }),
            placeholder: "TN"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
        Textarea,
        {
          label: t("company.about"),
          rows: 5,
          value: form.about,
          onChange: (event) => setForm({ ...form, about: event.target.value }),
          maxLength: 1200,
          counter: true
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsx(Button, { onClick: () => void save(), loading: saving, icon: /* @__PURE__ */ jsx(Save, { size: 16 }), children: t("common.save") }),
        /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 13 }),
          " ",
          form.location || "—"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
          /* @__PURE__ */ jsx(Users, { size: 13 }),
          " ",
          form.size || "—"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
          /* @__PURE__ */ jsx(Globe, { size: 13 }),
          " ",
          form.website ? form.website.replace(/^https?:\/\//, "") : "—"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "lj-chip", children: [
          /* @__PURE__ */ jsx(Building2, { size: 13 }),
          " LocalJob"
        ] })
      ] })
    ] })
  ] });
}
function CandidateDetail() {
  var _a, _b, _c;
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const candidate = useAsync(() => backend.candidate(Number(id)), [id]);
  if (candidate.loading) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-28 w-full rounded-lg" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full rounded-lg" })
    ] });
  }
  if (!candidate.data) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: t("error.unauthorized"),
        description: t("common.notFoundText"),
        actionLabel: t("common.back"),
        onAction: () => navigate(-1)
      }
    );
  }
  const { user, profile, completion, hiredCount } = candidate.data;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx(ArrowLeft, { size: 15 }), onClick: () => navigate(-1), children: t("common.back") }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsx(Avatar, { name: user.name, src: user.avatar, size: 72 }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg", children: user.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted", children: (profile == null ? void 0 : profile.title) ?? roleLabel(user.role, lang) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { tone: "primary", children: roleLabel(user.role, lang) }),
            (profile == null ? void 0 : profile.experienceLevel) ? /* @__PURE__ */ jsx(Badge, { tone: "accent", children: experienceLabel(profile.experienceLevel, lang) }) : null,
            hiredCount > 0 ? /* @__PURE__ */ jsxs(Badge, { tone: "success", icon: /* @__PURE__ */ jsx(Star, { size: 12 }), children: [
              hiredCount,
              "× ",
              t("emp.hired")
            ] }) : null,
            /* @__PURE__ */ jsx(Badge, { children: formatDate(user.createdAt, lang) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-52", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: t("dash.completion") }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-fg", children: [
              completion,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: completion, className: "mt-2.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-sm text-muted", children: [
          /* @__PURE__ */ jsx(Mail, { size: 15, className: "text-subtle" }),
          " ",
          user.email
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-sm text-muted", children: [
          /* @__PURE__ */ jsx(Phone, { size: 15, className: "text-subtle" }),
          " ",
          user.phone ?? (profile == null ? void 0 : profile.phone) ?? "—"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-sm text-muted", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 15, className: "text-subtle" }),
          " ",
          (profile == null ? void 0 : profile.location) ?? user.location ?? "—"
        ] })
      ] })
    ] }),
    (profile == null ? void 0 : profile.bio) ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("profile.about") }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted", children: profile.bio })
    ] }) : null,
    ((_a = profile == null ? void 0 : profile.skills) == null ? void 0 : _a.length) ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 17, className: "text-accent" }),
            " ",
            t("profile.skills")
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: profile.skills.map((skill) => /* @__PURE__ */ jsx("span", { className: "lj-chip", children: skill }, skill)) })
    ] }) : null,
    ((_b = profile == null ? void 0 : profile.experience) == null ? void 0 : _b.length) ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Briefcase, { size: 17, className: "text-primary" }),
            " ",
            t("profile.experience")
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: profile.experience.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-line bg-card-2 p-3.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: item.role }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: item.company }),
        /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
          item.from,
          " — ",
          item.to || t("profile.present")
        ] }),
        item.description ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: item.description }) : null
      ] }, `${item.role}-${index}`)) })
    ] }) : null,
    ((_c = profile == null ? void 0 : profile.education) == null ? void 0 : _c.length) ? /* @__PURE__ */ jsxs(Card, { className: "p-5 sm:p-6", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(GraduationCap, { size: 17, className: "text-primary" }),
            " ",
            t("profile.education")
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: profile.education.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-line bg-card-2 p-3.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-fg", children: item.degree }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: item.school }),
        /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
          item.from,
          " — ",
          item.to
        ] })
      ] }, `${item.degree}-${index}`)) })
    ] }) : null
  ] });
}
function AdminOverview() {
  const { t, lang } = useLanguage();
  const stats = useAsync(() => backend.adminStats(), []);
  if (stats.loading || !stats.data) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsx(StatsSkeleton, {}),
      /* @__PURE__ */ jsx(Card, { className: "h-64 p-5", children: " " })
    ] });
  }
  const data = stats.data;
  const maxSeries = Math.max(1, ...data.series.map((point) => Math.max(point.users, point.jobs, point.applications)));
  const cards = [
    { label: t("admin.totalUsers"), value: data.users.total, icon: /* @__PURE__ */ jsx(Users, { size: 17 }), hint: `${data.users.seekers} · ${data.users.employers}`, tone: "bg-primary/10 text-primary" },
    { label: t("admin.totalJobs"), value: data.jobs.total, icon: /* @__PURE__ */ jsx(Briefcase, { size: 17 }), hint: `${data.jobs.active} ${statusLabel("active", lang).toLowerCase()}`, tone: "bg-accent/10 text-accent" },
    { label: t("admin.totalApplications"), value: data.applications.total, icon: /* @__PURE__ */ jsx(Send, { size: 17 }), hint: `+${data.applications.newThisWeek} ${t("admin.newThisWeek").toLowerCase()}`, tone: "bg-success/12 text-success" },
    { label: t("admin.views"), value: data.views, icon: /* @__PURE__ */ jsx(Eye, { size: 17 }), hint: `${data.companies} ${t("admin.companies").toLowerCase()}`, tone: "bg-warning/12 text-warning" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-fg sm:text-2xl", children: t("admin.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted", children: t("admin.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: cards.map((card) => /* @__PURE__ */ jsxs("div", { className: "lj-card p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-subtle", children: card.label }),
        /* @__PURE__ */ jsx("span", { className: `grid h-8 w-8 place-items-center rounded-md ${card.tone}`, children: card.icon })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-2xl font-semibold tracking-tight text-fg", children: card.value }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted", children: card.hint })
    ] }, card.label)) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx(
        SectionHeading,
        {
          title: t("admin.last14"),
          action: /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-xs text-muted", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-primary" }),
              " ",
              t("admin.users")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-accent" }),
              " ",
              t("admin.jobs")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-success" }),
              " ",
              t("admin.applications")
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex h-40 items-end gap-1.5", children: data.series.map((point) => /* @__PURE__ */ jsxs("div", { className: "group flex flex-1 flex-col items-center gap-1", title: `${point.date}: ${point.users}/${point.jobs}/${point.applications}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-36 w-full items-end justify-center gap-[2px]", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 rounded-t bg-primary transition-all", style: { height: `${point.users / maxSeries * 100}%`, minHeight: 2 } }),
          /* @__PURE__ */ jsx("span", { className: "w-1.5 rounded-t bg-accent transition-all", style: { height: `${point.jobs / maxSeries * 100}%`, minHeight: 2 } }),
          /* @__PURE__ */ jsx("span", { className: "w-1.5 rounded-t bg-success transition-all", style: { height: `${point.applications / maxSeries * 100}%`, minHeight: 2 } })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] text-subtle", children: point.date.slice(5) })
      ] }, point.date)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.topJobs") }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2.5", children: data.topJobs.map((job) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-md border border-line bg-card-2 p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-fg", children: job.title }),
            /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-subtle", children: [
              job.company,
              " · ",
              job.views,
              " ",
              t("admin.views").toLowerCase()
            ] })
          ] }),
          /* @__PURE__ */ jsx(Badge, { tone: "primary", children: job.applications }),
          /* @__PURE__ */ jsx(Badge, { tone: statusTone(job.status), children: statusLabel(job.status, lang) })
        ] }, job.id)) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.statusBreakdown") }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-2 gap-3", children: APPLICATION_STATUSES.map((status) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-line bg-card-2 px-3 py-2.5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: statusLabel(status, lang) }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-lg font-semibold text-fg", children: data.applications.statusCounts[status] ?? 0 })
        ] }, status)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-2.5 rounded-md border border-line bg-card-2 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-muted", children: [
              /* @__PURE__ */ jsx(Database, { size: 14, className: "text-subtle" }),
              " ",
              t("admin.database")
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-fg", children: data.system.database })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-muted", children: [
              /* @__PURE__ */ jsx(Activity, { size: 14, className: "text-subtle" }),
              " ",
              t("admin.botStatus")
            ] }),
            /* @__PURE__ */ jsx(Badge, { tone: data.system.bot.running ? "success" : "warning", children: data.system.bot.running ? `@${data.system.bot.username}` : "offline" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-muted", children: [
              /* @__PURE__ */ jsx(Building2, { size: 14, className: "text-subtle" }),
              " ",
              t("admin.companies")
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-fg", children: data.companies })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.export"), subtitle: t("admin.subtitle") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => void downloadCsv("jobs"), children: "jobs.csv" }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => void downloadCsv("users"), children: "users.csv" }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => void downloadCsv("applications"), children: "applications.csv" })
      ] })
    ] })
  ] });
}
async function downloadCsv(type, t) {
  const blob = await backend.exportCsv(type);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `localjob-${type}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
function AdminUsers() {
  var _a, _b, _c, _d;
  const { t, lang } = useLanguage();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const debounced = useDebounced(search, 300);
  const users = useAsync(() => backend.adminUsers({ search: debounced || void 0, role: role || void 0, page, pageSize: 12 }), [debounced, role, page]);
  const updateUser = async (id, payload) => {
    try {
      await backend.adminUpdateUser(id, payload);
      toast.success(t("settings.saved"));
      await users.reload();
    } catch {
      toast.error(t("error.generic"));
    }
  };
  const remove = async () => {
    if (!pendingDelete) return;
    try {
      await backend.adminDeleteUser(pendingDelete.id);
      toast.success(t("common.delete"));
      setPendingDelete(null);
      await users.reload();
    } catch {
      toast.error(t("error.generic"));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.users"), subtitle: t("admin.subtitle") }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "min-w-[220px] flex-1", children: /* @__PURE__ */ jsx(
        Input,
        {
          value: search,
          onChange: (event) => setSearch(event.target.value),
          placeholder: t("admin.search"),
          icon: /* @__PURE__ */ jsx(Search, { size: 15 }),
          "aria-label": t("admin.search")
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "w-44", children: /* @__PURE__ */ jsx(
        Select,
        {
          value: role,
          onChange: (event) => setRole(event.target.value),
          placeholder: t("common.all"),
          "aria-label": t("admin.role"),
          options: [
            { value: "job_seeker", label: roleLabel("job_seeker", lang) },
            { value: "employer", label: roleLabel("employer", lang) },
            { value: "admin", label: roleLabel("admin", lang) }
          ]
        }
      ) })
    ] }),
    users.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : (((_a = users.data) == null ? void 0 : _a.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Users, { size: 24 }), title: t("companies.empty") }) : /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[760px] text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "border-b border-line bg-card-2 text-left text-xs uppercase tracking-wide text-subtle", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("auth.fullName") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("admin.role") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("admin.applications") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("admin.jobs") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("admin.created") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-right", children: t("admin.actions") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-line", children: (_b = users.data) == null ? void 0 : _b.items.map((user) => /* @__PURE__ */ jsxs("tr", { className: "transition-colors hover:bg-card-2/60", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Avatar, { name: user.name, src: user.avatar, size: 34 }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate font-medium text-fg", children: user.name }),
            /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-subtle", children: user.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              "aria-label": t("admin.role"),
              className: "h-8 w-36 text-xs",
              value: user.role,
              onChange: (event) => void updateUser(user.id, { role: event.target.value }),
              options: [
                { value: "job_seeker", label: roleLabel("job_seeker", lang) },
                { value: "employer", label: roleLabel("employer", lang) },
                { value: "admin", label: roleLabel("admin", lang) }
              ]
            }
          ),
          !user.isActive ? /* @__PURE__ */ jsx(Badge, { tone: "danger", children: t("admin.block") }) : null
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted", children: user.applications }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted", children: user.jobs }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-subtle", children: formatDate(user.createdAt, lang) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              icon: /* @__PURE__ */ jsx(UserX, { size: 14 }),
              onClick: () => void updateUser(user.id, { isActive: !user.isActive }),
              children: user.isActive ? t("admin.block") : t("admin.unblock")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-danger hover:bg-danger/10",
              icon: /* @__PURE__ */ jsx(Trash2, { size: 14 }),
              onClick: () => setPendingDelete(user),
              children: t("common.delete")
            }
          )
        ] }) })
      ] }, user.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      Pagination,
      {
        page: ((_c = users.data) == null ? void 0 : _c.page) ?? 1,
        pages: ((_d = users.data) == null ? void 0 : _d.pages) ?? 1,
        onChange: setPage,
        labels: { prev: t("common.prev"), next: t("common.next"), page: t("common.page"), of: t("common.of") }
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        open: Boolean(pendingDelete),
        onClose: () => setPendingDelete(null),
        title: t("settings.deleteAccount"),
        description: pendingDelete ? `${pendingDelete.name} · ${pendingDelete.email}` : "",
        confirmLabel: t("common.delete"),
        cancelLabel: t("common.cancel"),
        onConfirm: () => void remove()
      }
    )
  ] });
}
function AdminJobs() {
  var _a, _b, _c, _d;
  const { t, lang } = useLanguage();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const debounced = useDebounced(search, 300);
  const jobs2 = useAsync(
    () => backend.adminJobs({ search: debounced || void 0, status: status === "all" ? void 0 : status, page, pageSize: 12 }),
    [debounced, status, page]
  );
  const changeStatus = async (job, next) => {
    try {
      await backend.adminUpdateJob(job.id, { status: next });
      toast.success(t("emp.statusChanged", { status: statusLabel(next, lang) }));
      await jobs2.reload();
    } catch {
      toast.error(t("error.generic"));
    }
  };
  const remove = async () => {
    if (!pendingDelete) return;
    try {
      await backend.adminDeleteJob(pendingDelete.id);
      toast.success(t("emp.deleted"));
      setPendingDelete(null);
      await jobs2.reload();
    } catch {
      toast.error(t("error.generic"));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.jobs"), subtitle: t("admin.moderationNote") }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: /* @__PURE__ */ jsx("div", { className: "min-w-[220px] flex-1", children: /* @__PURE__ */ jsx(
      Input,
      {
        value: search,
        onChange: (event) => setSearch(event.target.value),
        placeholder: t("admin.search"),
        icon: /* @__PURE__ */ jsx(Search, { size: 15 }),
        "aria-label": t("admin.search")
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: status,
        onChange: (value) => {
          setStatus(value);
          setPage(1);
        },
        tabs: [
          { value: "all", label: t("common.all") },
          { value: "active", label: statusLabel("active", lang) },
          { value: "paused", label: statusLabel("paused", lang) },
          { value: "closed", label: statusLabel("closed", lang) }
        ]
      }
    ),
    jobs2.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : (((_a = jobs2.data) == null ? void 0 : _a.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Briefcase, { size: 24 }), title: t("jobs.empty.title") }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: (_b = jobs2.data) == null ? void 0 : _b.items.map((job) => {
      var _a2;
      return /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-fg", children: /* @__PURE__ */ jsx(Link, { to: `/jobs/${job.id}`, className: "transition-colors hover:text-primary", children: job.title }) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-subtle", children: [
            ((_a2 = job.company) == null ? void 0 : _a2.name) ?? "LocalJob",
            " · ",
            job.location,
            " · ",
            job.applicationsCount ?? 0,
            " ",
            t("admin.applications").toLowerCase()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(Badge, { tone: statusTone(job.status), children: statusLabel(job.status, lang) }),
          /* @__PURE__ */ jsx(
            Select,
            {
              "aria-label": t("admin.moderationNote"),
              className: "h-8 w-32 text-xs",
              value: job.status,
              onChange: (event) => void changeStatus(job, event.target.value),
              options: [
                { value: "active", label: statusLabel("active", lang) },
                { value: "paused", label: statusLabel("paused", lang) },
                { value: "closed", label: statusLabel("closed", lang) }
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-danger hover:bg-danger/10",
              icon: /* @__PURE__ */ jsx(Trash2, { size: 14 }),
              onClick: () => setPendingDelete(job),
              children: t("common.delete")
            }
          )
        ] })
      ] }) }, job.id);
    }) }),
    /* @__PURE__ */ jsx(
      Pagination,
      {
        page: ((_c = jobs2.data) == null ? void 0 : _c.page) ?? 1,
        pages: ((_d = jobs2.data) == null ? void 0 : _d.pages) ?? 1,
        onChange: setPage,
        labels: { prev: t("common.prev"), next: t("common.next"), page: t("common.page"), of: t("common.of") }
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        open: Boolean(pendingDelete),
        onClose: () => setPendingDelete(null),
        title: t("emp.confirmDeleteTitle"),
        description: pendingDelete ? t("emp.confirmDeleteText", { title: pendingDelete.title }) : "",
        confirmLabel: t("common.delete"),
        cancelLabel: t("common.cancel"),
        onConfirm: () => void remove()
      }
    )
  ] });
}
function AdminApplications() {
  var _a, _b, _c;
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const applications = useAsync(
    () => backend.adminApplications({ status: status === "all" ? void 0 : status, page, pageSize: 15 }),
    [status, page]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.applications"), subtitle: t("apps.subtitle") }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: status,
        onChange: (value) => {
          setStatus(value);
          setPage(1);
        },
        tabs: [
          { value: "all", label: t("common.all") },
          ...["submitted", "review", "shortlisted", "interview", "rejected", "hired"].map((item) => ({
            value: item,
            label: statusLabel(item, lang)
          }))
        ]
      }
    ),
    applications.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[720px] text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "border-b border-line bg-card-2 text-left text-xs uppercase tracking-wide text-subtle", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("nav.candidates") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("nav.jobs") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("emp.match", { score: "" }) }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("apps.status") }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: t("admin.created") })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-line", children: (_a = applications.data) == null ? void 0 : _a.items.map((application) => {
        var _a2, _b2, _c2, _d;
        return /* @__PURE__ */ jsxs("tr", { className: "transition-colors hover:bg-card-2/60", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-fg", children: ((_a2 = application.applicant) == null ? void 0 : _a2.name) ?? application.fullName }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-subtle", children: application.email })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-muted", children: [
            (_b2 = application.job) == null ? void 0 : _b2.title,
            /* @__PURE__ */ jsx("span", { className: "block text-xs text-subtle", children: (_d = (_c2 = application.job) == null ? void 0 : _c2.company) == null ? void 0 : _d.name })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs(Badge, { tone: "accent", children: [
            application.matchScore,
            "%"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { tone: statusTone(application.status), children: statusLabel(application.status, lang) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-subtle", children: formatDate(application.createdAt, lang) })
        ] }, application.id);
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      Pagination,
      {
        page: ((_b = applications.data) == null ? void 0 : _b.page) ?? 1,
        pages: ((_c = applications.data) == null ? void 0 : _c.pages) ?? 1,
        onChange: setPage,
        labels: { prev: t("common.prev"), next: t("common.next"), page: t("common.page"), of: t("common.of") }
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-xs text-subtle", children: [
      /* @__PURE__ */ jsx(ShieldCheck, { size: 13 }),
      " LocalJob admin"
    ] })
  ] });
}
function AdminBroadcast() {
  const { t } = useLanguage();
  const toast = useToast();
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const send = async () => {
    if (message.trim().length < 3) {
      toast.error(t("error.required"));
      return;
    }
    setSending(true);
    try {
      const result = await backend.adminBroadcast({ message: message.trim(), audience });
      toast.success(t("admin.sent", { count: result.notified }));
      setHistory((current) => [message.trim(), ...current].slice(0, 5));
      setMessage("");
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(
      SectionHeading,
      {
        title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Megaphone, { size: 18, className: "text-primary" }),
          " ",
          t("admin.broadcastTitle")
        ] }),
        subtitle: t("admin.subtitle")
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsx(
        Select,
        {
          label: t("admin.audience"),
          value: audience,
          onChange: (event) => setAudience(event.target.value),
          options: [
            { value: "all", label: t("admin.audienceAll") },
            { value: "job_seekers", label: t("admin.audienceSeekers") },
            { value: "employers", label: t("admin.audienceEmployers") }
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          label: t("admin.broadcastText"),
          value: message,
          onChange: (event) => setMessage(event.target.value),
          rows: 5,
          maxLength: 800,
          counter: true,
          placeholder: "LocalJob: 20 ta yangi IT vakansiya joylashtirildi…"
        }
      ),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { onClick: () => void send(), loading: sending, icon: /* @__PURE__ */ jsx(Send, { size: 15 }), children: t("admin.send") }) })
    ] }) }),
    history.length ? /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.activity") }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2.5", children: history.map((item, index) => /* @__PURE__ */ jsx("div", { className: "rounded-md border border-line bg-card-2 p-3 text-sm text-muted", children: item }, index)) })
    ] }) : null
  ] });
}
function AdminActivity() {
  var _a, _b;
  const { t, lang } = useLanguage();
  const activity = useAsync(() => backend.adminActivity(40), []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(SectionHeading, { title: t("admin.activity"), subtitle: t("admin.subtitle") }),
    activity.loading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : (((_a = activity.data) == null ? void 0 : _a.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsx(EmptyState, { title: t("common.noNotifications"), description: t("admin.subtitle") }) : /* @__PURE__ */ jsx(Card, { className: "divide-y divide-line", children: (_b = activity.data) == null ? void 0 : _b.items.map((entry) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsx(Badge, { tone: "primary", children: entry.action }),
      /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-sm text-muted", children: entry.detail }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-subtle", children: entry.actor }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-subtle", children: formatDate(entry.createdAt ?? void 0, lang) })
    ] }, entry.id)) })
  ] });
}
function PageShell({
  eyebrow,
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("section", { className: "border-b border-line bg-bg-soft", children: /* @__PURE__ */ jsxs("div", { className: "lj-container py-12 sm:py-16", children: [
      eyebrow ? /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: eyebrow }) : null,
      /* @__PURE__ */ jsx("h1", { className: "mt-2 max-w-3xl text-2xl font-bold tracking-tight text-fg sm:text-4xl", children: title }),
      subtitle ? /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base", children: subtitle }) : null
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "lj-container py-10 sm:py-14", children })
  ] });
}
function HowItWorksPage() {
  const { t } = useLanguage();
  const steps = [
    { icon: /* @__PURE__ */ jsx(UserPlus, { size: 20 }), title: t("how.step1.title"), text: t("how.step1.text") },
    { icon: /* @__PURE__ */ jsx(Search, { size: 20 }), title: t("how.step2.title"), text: t("how.step2.text") },
    { icon: /* @__PURE__ */ jsx(Send, { size: 20 }), title: t("how.step3.title"), text: t("how.step3.text") },
    { icon: /* @__PURE__ */ jsx(BadgeCheck, { size: 20 }), title: t("how.step4.title"), text: t("how.step4.text") }
  ];
  return /* @__PURE__ */ jsxs(PageShell, { eyebrow: "LocalJob", title: t("how.title"), subtitle: t("how.subtitle"), children: [
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: steps.map((step, index) => /* @__PURE__ */ jsxs(Card, { className: "relative p-5", children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-4 top-4 text-3xl font-extrabold text-line", children: index + 1 }),
      /* @__PURE__ */ jsx("span", { className: "grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary", children: step.icon }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 text-base font-semibold text-fg", children: step.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted", children: step.text })
    ] }, step.title)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx(SectionHeading, { title: t("nav.jobs"), subtitle: t("popular.subtitle") }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2.5", children: [t("jobs.remoteOnly"), t("jobs.salaryRange"), t("jobs.sort.relevant"), t("dash.recommended")].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-sm text-muted", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 15, className: "text-success" }),
          " ",
          item
        ] }, item)) }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/jobs", className: "mt-5", size: "sm", children: t("featured.viewAll") })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx(SectionHeading, { title: t("nav.employers"), subtitle: t("cta.text") }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2.5", children: [t("emp.postNewJob"), t("emp.candidates"), t("emp.activeListings"), t("admin.statusBreakdown")].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-sm text-muted", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 15, className: "text-success" }),
          " ",
          item
        ] }, item)) }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs/new", className: "mt-5", size: "sm", children: t("cta.postJob") })
      ] })
    ] })
  ] });
}
function ForEmployersPage() {
  const { t } = useLanguage();
  const features = [
    { icon: /* @__PURE__ */ jsx(Rocket, { size: 18 }), title: t("emp.postNewJob"), text: t("cta.text") },
    { icon: /* @__PURE__ */ jsx(Users, { size: 18 }), title: t("emp.candidates"), text: t("emp.candidates.subtitle") },
    { icon: /* @__PURE__ */ jsx(Sparkles, { size: 18 }), title: t("dash.recommended"), text: t("jobs.match", { score: 92 }) },
    { icon: /* @__PURE__ */ jsx(FileText, { size: 18 }), title: t("admin.export"), text: t("admin.subtitle") }
  ];
  return /* @__PURE__ */ jsxs(PageShell, { eyebrow: t("nav.employers"), title: t("cta.title"), subtitle: t("cta.text"), children: [
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: features.map((feature) => /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-accent/12 text-accent", children: feature.icon }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3.5 text-base font-semibold text-fg", children: feature.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted", children: feature.text })
    ] }, feature.title)) }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-fg", children: t("cta.title") }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted", children: t("footer.botText") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(ButtonLink, { to: "/register", children: t("nav.createAccount") }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/employer/jobs/new", variant: "secondary", children: t("cta.postJob") })
      ] })
    ] })
  ] });
}
function AboutPage() {
  const { t } = useLanguage();
  const stats = [
    { label: t("hero.stat.jobs"), value: "37+" },
    { label: t("hero.stat.companies"), value: "8" },
    { label: t("hero.stat.candidates"), value: "12k+" },
    { label: t("hero.stat.hires"), value: "3.4k" }
  ];
  return /* @__PURE__ */ jsxs(PageShell, { eyebrow: "LocalJob", title: t("common.aboutLocalJob"), subtitle: t("common.aboutText"), children: [
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((stat) => /* @__PURE__ */ jsxs(Card, { className: "p-5 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-fg", children: stat.value }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs uppercase tracking-wide text-subtle", children: stat.label })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-8 p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: t("brand.tagline") }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted", children: t("common.contactText") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(ButtonLink, { to: "/jobs", size: "sm", children: t("nav.jobs") }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/contact", variant: "secondary", size: "sm", children: t("footer.contact") })
      ] })
    ] })
  ] });
}
function ContactPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const submit = () => {
    const next = {};
    if (!form.name.trim()) next.name = t("error.required");
    if (!isEmail(form.email)) next.email = t("error.email");
    if (form.message.trim().length < 10) next.message = t("error.required");
    setErrors(next);
    if (Object.keys(next).length) return;
    toast.success(t("common.messageSent"));
    setForm({ name: "", email: "", message: "" });
  };
  return /* @__PURE__ */ jsx(PageShell, { eyebrow: t("footer.contact"), title: t("common.contactTitle"), subtitle: t("common.contactText"), children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]", children: [
    /* @__PURE__ */ jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          label: t("auth.fullName"),
          value: form.name,
          onChange: (event) => setForm({ ...form, name: event.target.value }),
          error: errors.name,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: t("auth.email"),
          type: "email",
          value: form.email,
          onChange: (event) => setForm({ ...form, email: event.target.value }),
          error: errors.email,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          label: t("common.message"),
          value: form.message,
          onChange: (event) => setForm({ ...form, message: event.target.value }),
          error: errors.message,
          rows: 6,
          maxLength: 1200,
          counter: true,
          required: true
        }
      ),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { onClick: submit, icon: /* @__PURE__ */ jsx(Send, { size: 15 }), children: t("common.sendMessage") }) })
    ] }) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsx(SectionHeading, { title: "LocalJob", subtitle: t("brand.tagline") }),
      /* @__PURE__ */ jsxs("ul", { className: "mt-5 space-y-3.5 text-sm", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Mail, { size: 16 }) }),
          "support@localjob.uz"
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Phone, { size: 16 }) }),
          "+998 71 200 30 40"
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(MapPin, { size: 16 }) }),
          t("jobs.location"),
          ": Tashkent, Uzbekistan"
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Briefcase, { size: 16 }) }),
          /* @__PURE__ */ jsx(Link, { to: "/jobs", className: "lj-link", children: t("nav.jobs") })
        ] })
      ] })
    ] })
  ] }) });
}
function LegalPage({ kind }) {
  const { t } = useLanguage();
  const title = kind === "privacy" ? t("common.privacyTitle") : t("common.termsTitle");
  const sections = kind === "privacy" ? [
    { title: t("settings.account"), text: t("settings.deleteWarning") },
    { title: t("settings.privacy"), text: t("settings.privacyProfile") },
    { title: t("settings.notifications"), text: t("settings.notifApplications") },
    { title: t("common.contactTitle"), text: t("common.contactText") }
  ] : [
    { title: t("settings.account"), text: t("auth.termsNote") },
    { title: t("nav.employers"), text: t("cta.text") },
    { title: t("nav.jobs"), text: t("jobs.empty.text") },
    { title: t("common.contactTitle"), text: t("common.contactText") }
  ];
  return /* @__PURE__ */ jsx(PageShell, { eyebrow: "LocalJob", title, subtitle: t("footer.rights"), children: /* @__PURE__ */ jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: sections.map((section) => /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-fg", children: section.title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: section.text })
  ] }, section.title)) }) }) });
}
function PrivacyPage() {
  return /* @__PURE__ */ jsx(LegalPage, { kind: "privacy" });
}
function TermsPage() {
  return /* @__PURE__ */ jsx(LegalPage, { kind: "terms" });
}
function App() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(MainLayout, {}), children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(LandingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/jobs", element: /* @__PURE__ */ jsx(JobsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/jobs/:id", element: /* @__PURE__ */ jsx(JobDetailPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/companies", element: /* @__PURE__ */ jsx(CompaniesPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/company/:id", element: /* @__PURE__ */ jsx(CompanyPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/how-it-works", element: /* @__PURE__ */ jsx(HowItWorksPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/for-employers", element: /* @__PURE__ */ jsx(ForEmployersPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(AboutPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(ContactPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(TermsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/notifications", element: /* @__PURE__ */ jsx(NotificationsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/post-job", element: /* @__PURE__ */ jsx(Navigate, { to: "/employer/jobs/new", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
    ] }),
    /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(AuthLayout, {}), children: [
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(RegisterPage, {}) })
    ] }),
    /* @__PURE__ */ jsxs(
      Route,
      {
        element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(DashboardLayout, {}) }),
        children: [
          /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(DashboardPage, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/applications", element: /* @__PURE__ */ jsx(ApplicationsPage, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/saved", element: /* @__PURE__ */ jsx(SavedPage, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsx(ProfilePage, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings", element: /* @__PURE__ */ jsx(SettingsPage, {}) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Route,
      {
        element: /* @__PURE__ */ jsx(ProtectedRoute, { roles: ["employer", "admin"], children: /* @__PURE__ */ jsx(DashboardLayout, {}) }),
        children: [
          /* @__PURE__ */ jsx(Route, { path: "/employer", element: /* @__PURE__ */ jsx(EmployerDashboard, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/employer/jobs", element: /* @__PURE__ */ jsx(EmployerJobs, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/employer/jobs/new", element: /* @__PURE__ */ jsx(PostJob, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/employer/jobs/:id/edit", element: /* @__PURE__ */ jsx(PostJob, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/employer/applications", element: /* @__PURE__ */ jsx(EmployerApplications, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/employer/company", element: /* @__PURE__ */ jsx(EmployerCompany, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/employer/candidates/:id", element: /* @__PURE__ */ jsx(CandidateDetail, {}) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Route,
      {
        element: /* @__PURE__ */ jsx(ProtectedRoute, { requireAdmin: true, children: /* @__PURE__ */ jsx(AdminLayout, {}) }),
        children: [
          /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(AdminOverview, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/admin/users", element: /* @__PURE__ */ jsx(AdminUsers, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/admin/jobs", element: /* @__PURE__ */ jsx(AdminJobs, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/admin/applications", element: /* @__PURE__ */ jsx(AdminApplications, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/admin/broadcast", element: /* @__PURE__ */ jsx(AdminBroadcast, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/admin/activity", element: /* @__PURE__ */ jsx(AdminActivity, {}) })
        ]
      }
    )
  ] });
}
function renderPath(path) {
  return renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: path, children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(App, {}) }) }) }) }) })
  );
}
export {
  renderPath
};
