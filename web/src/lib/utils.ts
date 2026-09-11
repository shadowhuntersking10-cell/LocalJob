import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { EmploymentType, ExperienceLevel, Lang, Role } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(value?: number | null, currency = 'UZS') {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  if (currency === 'UZS') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)} mln so'm`
    if (value >= 1000) return `${Math.round(value / 1000)} ming so'm`
    return `${value} so'm`
  }
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  return `$${value}`
}

export function formatMoney(value: number, currency = 'UZS') {
  return formatSalary(value, currency)
}

export function relativeTime(iso: string, lang: Lang = 'en') {
  if (!iso) return ''
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / 60000)
  const hours = Math.round(diff / 3600000)
  const days = Math.round(diff / 86400000)
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'uz' ? 'uz-UZ' : 'en-US'

  if (minutes < 1) return { uz: 'hozir', en: 'just now', ru: 'только что' }[lang]
  if (minutes < 60) return { uz: `${minutes} daqiqa oldin`, en: `${minutes}m ago`, ru: `${minutes} мин назад` }[lang]
  if (hours < 24) return { uz: `${hours} soat oldin`, en: `${hours}h ago`, ru: `${hours} ч назад` }[lang]
  if (days < 7) return { uz: `${days} kun oldin`, en: `${days}d ago`, ru: `${days} дн назад` }[lang]
  if (days < 30) {
    const weeks = Math.round(days / 7)
    return { uz: `${weeks} hafta oldin`, en: `${weeks}w ago`, ru: `${weeks} нед назад` }[lang]
  }
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDate(iso?: string | null, lang: Lang = 'en') {
  if (!iso) return '—'
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'uz' ? 'uz-UZ' : 'en-US'
  return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export function initials(name?: string | null) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

const ROLE_LABEL: Record<Role, Record<Lang, string>> = {
  job_seeker: { uz: 'Ish qidiruvchi', en: 'Job seeker', ru: 'Соискатель' },
  employer: { uz: 'Ish beruvchi', en: 'Employer', ru: 'Работодатель' },
  admin: { uz: 'Administrator', en: 'Administrator', ru: 'Администратор' },
}

export function roleLabel(role: Role, lang: Lang) {
  return ROLE_LABEL[role]?.[lang] ?? role
}

export function employmentLabel(value: string, lang: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    'Full-time': { uz: "To'liq stavka", en: 'Full-time', ru: 'Полная занятость' },
    'Part-time': { uz: 'Yarim stavka', en: 'Part-time', ru: 'Частичная занятость' },
    Contract: { uz: 'Shartnoma', en: 'Contract', ru: 'Контракт' },
    Freelance: { uz: 'Frilans', en: 'Freelance', ru: 'Фриланс' },
    Internship: { uz: 'Amaliyot', en: 'Internship', ru: 'Стажировка' },
    Remote: { uz: 'Masofaviy', en: 'Remote', ru: 'Удалённо' },
  }
  return map[value]?.[lang] ?? value
}

export function experienceLabel(value: string, lang: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    'No experience': { uz: "Tajribasiz", en: 'No experience', ru: 'Без опыта' },
    Junior: { uz: 'Junior', en: 'Junior', ru: 'Junior' },
    Middle: { uz: 'Middle', en: 'Middle', ru: 'Middle' },
    Senior: { uz: 'Senior', en: 'Senior', ru: 'Senior' },
  }
  return map[value]?.[lang] ?? value
}

export function statusLabel(status: string, lang: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    submitted: { uz: 'Yuborilgan', en: 'Submitted', ru: 'Отправлено' },
    review: { uz: "Ko'rib chiqilmoqda", en: 'Under review', ru: 'На рассмотрении' },
    shortlisted: { uz: 'Saralangan', en: 'Shortlisted', ru: 'В шортлисте' },
    interview: { uz: 'Suhbat', en: 'Interview', ru: 'Интервью' },
    rejected: { uz: 'Rad etilgan', en: 'Rejected', ru: 'Отказ' },
    hired: { uz: 'Ishga qabul qilindi', en: 'Hired', ru: 'Нанят' },
    active: { uz: 'Faol', en: 'Active', ru: 'Активна' },
    paused: { uz: "To'xtatilgan", en: 'Paused', ru: 'Приостановлена' },
    closed: { uz: 'Yopilgan', en: 'Closed', ru: 'Закрыта' },
  }
  return map[status]?.[lang] ?? status
}

export function statusTone(status: string): 'default' | 'info' | 'success' | 'warning' | 'danger' | 'accent' {
  switch (status) {
    case 'hired':
      return 'success'
    case 'shortlisted':
      return 'accent'
    case 'interview':
      return 'info'
    case 'rejected':
      return 'danger'
    case 'review':
      return 'warning'
    case 'active':
      return 'success'
    case 'paused':
      return 'warning'
    case 'closed':
      return 'danger'
    default:
      return 'default'
  }
}

export function categoryLabel(key: string, lang: Lang) {
  const map: Record<string, Record<Lang, string>> = {
    IT: { uz: 'IT va dasturlash', en: 'IT & Development', ru: 'IT и разработка' },
    Design: { uz: 'Dizayn', en: 'Design', ru: 'Дизайн' },
    SMM: { uz: 'SMM', en: 'SMM', ru: 'SMM' },
    Marketing: { uz: 'Marketing', en: 'Marketing', ru: 'Маркетинг' },
    Sales: { uz: 'Savdo', en: 'Sales', ru: 'Продажи' },
    Finance: { uz: 'Moliya', en: 'Finance', ru: 'Финансы' },
    Education: { uz: "Ta'lim", en: 'Education', ru: 'Образование' },
    Support: { uz: 'Mijozlar bilan ishlash', en: 'Customer Support', ru: 'Поддержка' },
    Operations: { uz: 'Operatsiyalar', en: 'Operations', ru: 'Операции' },
    Logistics: { uz: 'Logistika', en: 'Logistics', ru: 'Логистика' },
    Media: { uz: 'Media', en: 'Media', ru: 'Медиа' },
    HR: { uz: 'HR', en: 'HR', ru: 'HR' },
    Hospitality: { uz: 'Mehmondo\u2019stlik', en: 'Hospitality', ru: 'Гостеприимство' },
  }
  return map[key]?.[lang] ?? key
}

export function greetingKey(now = new Date()): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = now.getHours()
  if (hour < 6) return 'night'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export function pluralize(count: number, lang: Lang, forms: { uz: [string, string]; en: [string, string]; ru: [string, string, string] }) {
  if (lang === 'ru') {
    const n = Math.abs(count) % 100
    const n1 = n % 10
    if (n > 10 && n < 20) return forms.ru[2]
    if (n1 > 1 && n1 < 5) return forms.ru[1]
    if (n1 === 1) return forms.ru[0]
    return forms.ru[2]
  }
  return count === 1 ? forms[lang][0] : forms[lang][1]
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

export function stripHtml(input?: string | null) {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '')
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote',
]

export const EXPERIENCE_LEVELS: ExperienceLevel[] = ['No experience', 'Junior', 'Middle', 'Senior']

export const APPLICATION_STATUSES = ['submitted', 'review', 'shortlisted', 'interview', 'rejected', 'hired'] as const
