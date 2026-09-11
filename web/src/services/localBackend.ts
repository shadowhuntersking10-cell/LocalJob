/**
 * Offline backend.
 *
 * The MVP talks to the FastAPI backend by default. When the API is unreachable
 * (static hosting, Telegram WebApp preview, no Python running) the app falls back
 * to this localStorage implementation which mirrors the very same API surface —
 * so every button keeps working and data survives a page refresh.
 */
import seed from '@/data/seed.json'
import { KEYS, storage } from '@/lib/storage'
import { matchScore, profileCompletion } from '@/lib/matching'
import type {
  AdminStats,
  Application,
  ApplicationStatus,
  AppNotification,
  AuditEntry,
  Company,
  EmployerDashboard,
  ExperienceItem,
  Job,
  JobListResponse,
  Meta,
  MePayload,
  NotificationPreferences,
  Profile,
  SavedJob,
  SeekerDashboard,
  SessionPayload,
  User,
} from '@/types'
import { ApiError } from '@/lib/api'

type SeedJob = {
  title: string
  category: string
  company: string
  location: string
  salary_min: number
  salary_max: number
  employment_type: string
  experience_level: string
  skills: string[]
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  days_ago: number
  views: number
  applications_count: number
  is_remote?: boolean
  currency?: string
  salary_period?: string
}

interface LocalDb {
  users: (User & { passwordHash: string })[]
  companies: Company[]
  jobs: Job[]
  applications: Application[]
  saved: SavedJob[]
  profiles: Record<number, Profile>
  notifications: AppNotification[]
  audit: AuditEntry[]
  preferences: Record<number, NotificationPreferences>
  counters: Record<string, number>
}

const DEFAULT_PREFS: NotificationPreferences = {
  emailApplications: true,
  emailJobs: true,
  telegramNotifications: true,
  profileVisible: true,
  showSalary: true,
}

function hash(value: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return `lj${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`
}

const nowIso = () => new Date().toISOString()

/** Reads the first defined value — the API accepts snake_case, the UI camelCase. */
function pick<T = unknown>(source: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null) return value as T
  }
  return undefined
}
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString()

function salaryLabel(job: Pick<Job, 'salaryMin' | 'salaryMax' | 'currency' | 'salaryPeriod'>): string {
  const currency = job.currency || 'UZS'
  const fmt = (value?: number | null) => {
    if (!value) return ''
    if (currency === 'UZS') {
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
      return `${Math.round(value / 1000)}k`
    }
    return value >= 1000 ? `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : `$${value}`
  }
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)} ${currency}/${job.salaryPeriod}`
  const one = job.salaryMin || job.salaryMax
  return one ? `${fmt(one)} ${currency}/${job.salaryPeriod}` : 'Negotiable'
}

function buildSeedDb(): LocalDb {
  const companies: Company[] = seed.companies.map((company, index) => ({
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
    createdAt: daysAgo(120 - index),
  }))

  const idBySlug = new Map(companies.map((company) => [company.slug, company.id]))
  const companyByName = new Map(companies.map((company) => [company.name, company]))

  const jobs: Job[] = (seed.jobs as SeedJob[]).map((job, index) => {
    const company = companyByName.get(job.company)
    const currency = job.currency || 'UZS'
    const period = job.salary_period || 'month'
    const item: Job = {
      id: index + 1,
      title: job.title,
      category: job.category,
      location: job.location,
      isRemote: Boolean(job.is_remote || job.location === 'Remote'),
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      currency,
      salaryPeriod: period,
      salaryLabel: salaryLabel({ salaryMin: job.salary_min, salaryMax: job.salary_max, currency, salaryPeriod: period }),
      employmentType: job.employment_type,
      experienceLevel: job.experience_level,
      skills: job.skills,
      status: 'active',
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
      excerpt: `${job.description.slice(0, 180)}${job.description.length > 180 ? '…' : ''}`,
    }
    return item
  })

  const users: (User & { passwordHash: string })[] = []
  const profiles: Record<number, Profile> = {}

  const pushUser = (
    data: { name: string; email: string; password: string; role: User['role']; phone?: string | null; location?: string | null },
    profile?: Partial<Profile>,
  ) => {
    const id = users.length + 1
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
      language: 'uz',
      theme: 'dark',
      isActive: true,
      createdAt: daysAgo(45 - id),
      passwordHash: hash(data.password),
    })
    profiles[id] = {
      userId: id,
      skills: profile?.skills ?? [],
      experience: (profile?.experience as ExperienceItem[]) ?? [],
      education: profile?.education ?? [],
      languages: profile?.languages ?? [],
      title: profile?.title ?? null,
      bio: profile?.bio ?? null,
      location: profile?.location ?? data.location ?? null,
      phone: profile?.phone ?? data.phone ?? null,
      category: profile?.category ?? null,
      portfolio: profile?.portfolio ?? null,
      github: profile?.github ?? null,
      linkedin: profile?.linkedin ?? null,
      telegram: profile?.telegram ?? null,
      expectedSalary: profile?.expectedSalary ?? null,
      experienceLevel: profile?.experienceLevel ?? null,
      views: 42,
      updatedAt: nowIso(),
    }
    return id
  }

  const seekerId = pushUser(
    {
      name: seed.demoSeeker.name,
      email: seed.demoSeeker.email,
      password: seed.demoSeeker.password,
      role: 'job_seeker',
      phone: seed.demoSeeker.phone,
      location: seed.demoSeeker.location,
    },
    {
      title: seed.demoSeeker.profile.title,
      bio: seed.demoSeeker.profile.bio,
      category: seed.demoSeeker.profile.category,
      skills: seed.demoSeeker.profile.skills,
      experience: seed.demoSeeker.profile.experience as ExperienceItem[],
      education: seed.demoSeeker.profile.education,
      languages: seed.demoSeeker.profile.languages,
      portfolio: seed.demoSeeker.profile.portfolio,
      github: seed.demoSeeker.profile.github,
      linkedin: seed.demoSeeker.profile.linkedin,
      telegram: seed.demoSeeker.profile.telegram,
      expectedSalary: seed.demoSeeker.profile.expected_salary,
      experienceLevel: seed.demoSeeker.profile.experience_level,
    },
  )

  const employerId = pushUser({
    name: seed.demoEmployer.name,
    email: seed.demoEmployer.email,
    password: seed.demoEmployer.password,
    role: 'employer',
    phone: seed.demoEmployer.phone,
    location: seed.demoEmployer.location,
  })

  const adminId = pushUser({
    name: seed.admin.name,
    email: seed.admin.email,
    password: seed.admin.password,
    role: 'admin',
    location: seed.admin.location,
  })

  const technova = companies.find((company) => company.name === seed.demoEmployer.company)
  if (technova) technova.ownerId = employerId
  const pixelcraft = companies.find((company) => company.name === 'PixelCraft Studio')
  if (pixelcraft) pixelcraft.ownerId = null
  jobs.forEach((job) => {
    if (technova && job.companyId === technova.id) job.postedById = employerId
  })

  const applications: Application[] = []
  let applicationId = 0
  const byTitle = (title: string) => jobs.find((job) => job.title === title)

  seed.demoApplications.forEach((entry, index) => {
    const job = byTitle(entry.title)
    if (!job) return
    applicationId += 1
    applications.push({
      id: applicationId,
      jobId: job.id,
      applicantId: seekerId,
      employerId: job.postedById ?? null,
      status: index === 0 ? 'submitted' : 'shortlisted',
      fullName: seed.demoSeeker.name,
      email: seed.demoSeeker.email,
      phone: seed.demoSeeker.phone,
      coverLetter: entry.coverLetter,
      portfolioUrl: seed.demoSeeker.profile.portfolio,
      resumeName: 'Aziz_Karimov_CV.pdf',
      matchScore: index === 0 ? 92 : 85,
      createdAt: daysAgo(index * 3 + 1),
      updatedAt: daysAgo(index * 3 + 1),
    })
  })

  const saved: SavedJob[] = []
  seed.demoSavedTitles.forEach((title, index) => {
    const job = byTitle(title)
    if (!job) return
    saved.push({ id: index + 1, jobId: job.id, createdAt: daysAgo(index + 1), job })
  })

  const notifications: AppNotification[] = seed.demoNotifications.map((note, index) => ({
    id: index + 1,
    kind: note.kind,
    title: note.title,
    message: note.message,
    link: note.link,
    isRead: false,
    createdAt: daysAgo(note.daysAgo),
  }))

  const audit: AuditEntry[] = [
    { id: 1, actor: 'system', action: 'seed', detail: `${jobs.length} jobs · ${companies.length} companies`, createdAt: nowIso() },
  ]

  return {
    users,
    companies,
    jobs,
    applications,
    saved,
    profiles,
    notifications,
    audit,
    preferences: { [seekerId]: { ...DEFAULT_PREFS }, [employerId]: { ...DEFAULT_PREFS }, [adminId]: { ...DEFAULT_PREFS } },
    counters: {
      userId: users.length,
      jobId: jobs.length,
      applicationId,
      savedId: saved.length,
      notificationId: notifications.length,
      auditId: audit.length,
      companyId: companies.length,
    },
  }
}

/** The localStorage mirror of the LocalJob API. */
export class LocalBackend {
  private db: LocalDb

  constructor() {
    this.db = storage.get<LocalDb>(KEYS.localDb, null as unknown as LocalDb) || buildSeedDb()
    storage.set(KEYS.localDb, this.db)
  }

  private persist() {
    storage.set(KEYS.localDb, this.db)
  }

  private next(name: keyof LocalDb['counters']): number {
    this.db.counters[name] = (this.db.counters[name] || 0) + 1
    return this.db.counters[name]
  }

  private currentUser(): (User & { passwordHash: string }) | null {
    const token = storage.raw(KEYS.token, '')
    if (!token.startsWith('local-')) return null
    const id = Number(token.replace('local-', ''))
    return this.db.users.find((user) => user.id === id) || null
  }

  private requireUser(): User & { passwordHash: string } {
    const user = this.currentUser()
    if (!user) throw new ApiError(401, 'not_authenticated')
    return user
  }

  private publicUser(user: User & { passwordHash?: string }): User {
    const { passwordHash, ...rest } = user as User & { passwordHash?: string }
    return rest
  }

  private jobWithRelations(job: Job, userId?: number): Job {
    const company = job.companyId ? this.db.companies.find((c) => c.id === job.companyId) ?? null : null
    const profile = userId ? this.db.profiles[userId] : undefined
    const user = userId ? this.db.users.find((u) => u.id === userId) : undefined
    return {
      ...job,
      company,
      excerpt: job.excerpt || `${(job.description || '').slice(0, 180)}${(job.description || '').length > 180 ? '…' : ''}`,
      matchScore: userId ? matchScore(job, profile, user) : null,
      isSaved: userId ? this.isSaved(job.id, userId) : false,
      hasApplied: userId ? this.db.applications.some((row) => row.jobId === job.id && row.applicantId === userId) : false,
      canApply:
        !!userId &&
        !this.db.applications.some((row) => row.jobId === job.id && row.applicantId === userId) &&
        job.status === 'active',
    }
  }

  private isSaved(jobId: number, userId: number): boolean {
    return this.db.saved.some((row) => row.userId === userId && row.jobId === jobId)
  }

  private applicationView(application: Application): Application {
    const job = this.db.jobs.find((item) => item.id === application.jobId)
    const applicant = this.db.users.find((user) => user.id === application.applicantId)
    return {
      ...application,
      job: job ? this.jobWithRelations(job, application.applicantId) : null,
      applicant: applicant ? this.publicUser(applicant) : null,
      applicantProfile: this.db.profiles[application.applicantId] || null,
    }
  }

  private notify(userId: number, title: string, message: string, kind = 'info', link?: string) {
    const id = this.next('notificationId')
    this.db.notifications.unshift({
      id,
      userId,
      title,
      message,
      kind,
      link: link ?? null,
      isRead: false,
      createdAt: nowIso(),
    })
  }

  private log(action: string, actor: string, detail?: string) {
    const id = this.next('auditId')
    this.db.audit.unshift({ id, actor, action, detail: detail ?? null, createdAt: nowIso() })
    this.db.audit = this.db.audit.slice(0, 120)
  }

  private session(user: User & { passwordHash?: string }, remember = true): SessionPayload {
    const token = `local-${user.id}`
    storage.setRaw(KEYS.token, token)
    const profile = this.db.profiles[user.id] || null
    const company = this.db.companies.find((item) => item.ownerId === user.id) || null
    const payload: SessionPayload = {
      token,
      user: this.publicUser(user) as User,
      profile,
      profileCompletion: profileCompletion(user, profile),
      company,
      isAdmin: user.role === 'admin',
      role: user.role,
    }
    if (!remember) storage.set(KEYS.session, { expires: Date.now() + 86400000 })
    return payload
  }

  // ── meta ────────────────────────────────────────────────────────────
  async health() {
    return { status: 'offline', database: 'localStorage', bot_enabled: false }
  }

  async meta(): Promise<Meta> {
    return {
      app: {
        name: 'LocalJob',
        tagline: {
          uz: "Ish toping. Xodim toping. Mahalliy darajada o'sing.",
          en: 'Find work. Find talent. Grow locally.',
          ru: 'Найдите работу. Найдите таланты. Растите локально.',
        },
        version: '1.0.0-offline',
        botUsername: 'LocalJobUzBot',
        webAppUrl: typeof window === 'undefined' ? '' : window.location.origin,
      },
      categories: seed.categories,
      popularCategories: seed.popularCategories,
      locations: seed.locations,
      employmentTypes: seed.employmentTypes,
      experienceLevels: seed.experienceLevels,
      currencies: ['UZS', 'USD', 'EUR'],
      salaryPeriods: ['month', 'year', 'hour', 'project'],
      accountTypes: ['job_seeker', 'employer'],
      applicationStatuses: ['submitted', 'review', 'shortlisted', 'interview', 'rejected', 'hired'],
      jobStatuses: ['active', 'paused', 'closed'],
    }
  }

  // ── auth ────────────────────────────────────────────────────────────
  async register(payload: Record<string, unknown>): Promise<SessionPayload> {
    const email = String(payload.email || '').trim().toLowerCase()
    const password = String(payload.password || '')
    const role = (payload.role as User['role']) || 'job_seeker'
    if (!email.includes('@')) throw new ApiError(422, 'invalid_email')
    if (password.length < 8) throw new ApiError(422, 'password_too_short')
    if (this.db.users.some((user) => user.email.toLowerCase() === email)) {
      throw new ApiError(409, 'email_already_registered')
    }
    const id = this.next('userId')
    const user: User & { passwordHash: string } = {
      id,
      name: String(payload.name || '').trim() || 'LocalJob user',
      email,
      role,
      phone: (payload.phone as string) || null,
      location: (payload.location as string) || null,
      avatar: null,
      telegramId: null,
      telegramUsername: null,
      language: (payload.language as User['language']) || 'uz',
      theme: 'dark',
      isActive: true,
      createdAt: nowIso(),
      passwordHash: hash(password),
    }
    this.db.users.push(user)
    this.db.profiles[id] = {
      userId: id,
      skills: [],
      experience: [],
      education: [],
      languages: [],
      location: user.location,
      phone: user.phone,
      updatedAt: nowIso(),
    }
    this.db.preferences[id] = { ...DEFAULT_PREFS }
    this.notify(id, "LocalJob'ga xush kelibsiz!", 'Profilingizni to‘ldiring va mos ishlarni ko‘ring.', 'success', '/dashboard')
    this.log('register', email, `role=${role}`)
    this.persist()
    return this.session(user)
  }

  async login(payload: { email: string; password: string; remember?: boolean }): Promise<SessionPayload> {
    const user = this.db.users.find((item) => item.email.toLowerCase() === payload.email.trim().toLowerCase())
    if (!user || user.passwordHash !== hash(payload.password)) throw new ApiError(401, 'invalid_credentials')
    if (user.isActive === false) throw new ApiError(403, 'account_disabled')
    this.log('login', user.email)
    this.persist()
    return this.session(user, payload.remember ?? true)
  }

  async demoLogin(kind: 'seeker' | 'employer'): Promise<SessionPayload> {
    const email = kind === 'seeker' ? seed.demoSeeker.email : seed.demoEmployer.email
    const user = this.db.users.find((item) => item.email === email)
    if (!user) throw new ApiError(404, 'demo_account_missing')
    return this.session(user)
  }

  async telegram(initData: string, startParam?: string): Promise<SessionPayload & { created: boolean }> {
    let telegramUser: { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string } | null = null
    try {
      const params = new URLSearchParams(initData)
      const raw = params.get('user')
      telegramUser = raw ? JSON.parse(decodeURIComponent(raw)) : null
    } catch {
      telegramUser = null
    }
    if (!telegramUser) throw new ApiError(401, 'invalid_telegram_data')
    let user = this.db.users.find((item) => item.telegramId === telegramUser!.id)
    let created = false
    if (!user) {
      const id = this.next('userId')
      user = {
        id,
        name: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ') || 'Telegram user',
        email: `tg${telegramUser.id}@localjob.uz`,
        role: startParam === 'employer' ? 'employer' : 'job_seeker',
        phone: null,
        location: null,
        avatar: null,
        telegramId: telegramUser.id,
        telegramUsername: telegramUser.username || null,
        language: 'uz',
        theme: 'dark',
        isActive: true,
        createdAt: nowIso(),
        passwordHash: hash(`tg-${telegramUser.id}`),
      }
      this.db.users.push(user)
      this.db.profiles[id] = { userId: id, skills: [], experience: [], education: [], languages: [], updatedAt: nowIso() }
      created = true
    }
    this.persist()
    return { ...this.session(user), created }
  }

  async me(): Promise<MePayload> {
    const user = this.requireUser()
    const profile = this.db.profiles[user.id] || null
    return {
      user: this.publicUser(user) as User,
      profile,
      profileCompletion: profileCompletion(user, profile),
      company: this.db.companies.find((item) => item.ownerId === user.id) || null,
      isAdmin: user.role === 'admin',
      role: user.role,
    }
  }

  async logout() {
    storage.remove(KEYS.token)
    return { ok: true }
  }

  async changePassword(payload: { current_password: string; new_password: string }) {
    const user = this.requireUser()
    if (user.passwordHash !== hash(payload.current_password)) throw new ApiError(400, 'current_password_incorrect')
    user.passwordHash = hash(payload.new_password)
    this.notify(user.id, 'Password changed', 'Your password was updated successfully.', 'success', '/settings')
    this.persist()
    return { ok: true }
  }

  async deleteAccount(password: string) {
    const user = this.requireUser()
    if (user.passwordHash !== hash(password)) throw new ApiError(400, 'current_password_incorrect')
    this.db.users = this.db.users.filter((item) => item.id !== user.id)
    this.db.applications = this.db.applications.filter((item) => item.applicantId !== user.id)
    this.db.saved = this.db.saved.filter((row) => (row as unknown as { userId?: number }).userId !== user.id)
    delete this.db.profiles[user.id]
    storage.remove(KEYS.token)
    this.log('account_delete', user.email)
    this.persist()
    return { ok: true }
  }

  // ── settings ────────────────────────────────────────────────────────
  async updateSettings(payload: Partial<User>) {
    const user = this.requireUser()
    Object.assign(user, payload)
    this.persist()
    return { user: this.publicUser(user) as User }
  }

  async preferences() {
    const user = this.requireUser()
    return { preferences: { ...DEFAULT_PREFS, ...(this.db.preferences[user.id] || {}) } }
  }

  async updatePreferences(payload: Partial<NotificationPreferences>) {
    const user = this.requireUser()
    this.db.preferences[user.id] = { ...DEFAULT_PREFS, ...(this.db.preferences[user.id] || {}), ...payload }
    this.persist()
    return { preferences: this.db.preferences[user.id] }
  }

  // ── notifications ───────────────────────────────────────────────────
  async notifications() {
    const user = this.requireUser()
    const items = this.db.notifications.filter((note) => note.userId === user.id || (!note.userId && user.role === 'job_seeker'))
    return { items, unread: items.filter((note) => !note.isRead).length }
  }

  async markNotifications(payload: { ids?: number[]; all?: boolean }) {
    const { items } = await this.notifications()
    items.forEach((note) => {
      if (payload.all || payload.ids?.includes(note.id)) note.isRead = true
    })
    this.persist()
    return { ok: true, unread: items.filter((note) => !note.isRead).length }
  }

  async clearNotifications() {
    const { items } = await this.notifications()
    const ids = new Set(items.map((note) => note.id))
    this.db.notifications = this.db.notifications.filter((note) => !ids.has(note.id))
    this.persist()
    return { ok: true }
  }

  // ── jobs ────────────────────────────────────────────────────────────
  async jobsList(params: Record<string, unknown>): Promise<JobListResponse> {
    const user = this.currentUser()
    const search = String(params.search || '').toLowerCase()
    const location = String(params.location || '').toLowerCase()
    const categories = String(params.category || '').split(',').filter(Boolean)
    const employmentTypes = String(params.employmentType || '').split(',').filter(Boolean)
    const experienceLevels = String(params.experienceLevel || '').split(',').filter(Boolean)
    const salaryMin = params.salaryMin ? Number(params.salaryMin) : null
    const salaryMax = params.salaryMax ? Number(params.salaryMax) : null
    const companyId = params.companyId ? Number(params.companyId) : null
    const postedBy = params.postedBy ? Number(params.postedBy) : null
    const remote = Boolean(params.remote)
    const statuses = String(params.statuses || 'active').split(',').filter(Boolean)
    const sort = String(params.sort || 'recent')
    const pageSize = Number(params.pageSize || 10)
    let page = Number(params.page || 1)

    let items = this.db.jobs.filter((job) => statuses.includes(job.status || 'active'))
    if (search) {
      items = items.filter((job) => {
        const company = this.db.companies.find((c) => c.id === job.companyId)
        return (
          job.title.toLowerCase().includes(search) ||
          (job.description || '').toLowerCase().includes(search) ||
          job.category.toLowerCase().includes(search) ||
          job.location.toLowerCase().includes(search) ||
          job.skills.join(' ').toLowerCase().includes(search) ||
          (company?.name || '').toLowerCase().includes(search)
        )
      })
    }
    if (location && !['any', 'all'].includes(location)) {
      items = items.filter((job) => job.location.toLowerCase().includes(location) || job.isRemote)
    }
    if (categories.length) items = items.filter((job) => categories.includes(job.category))
    if (employmentTypes.length) items = items.filter((job) => employmentTypes.includes(String(job.employmentType)))
    if (experienceLevels.length) items = items.filter((job) => experienceLevels.includes(String(job.experienceLevel)))
    if (salaryMin !== null) items = items.filter((job) => (job.salaryMax ?? 0) >= salaryMin)
    if (salaryMax !== null) items = items.filter((job) => (job.salaryMin ?? 0) <= salaryMax)
    if (companyId) items = items.filter((job) => job.companyId === companyId)
    if (postedBy) items = items.filter((job) => job.postedById === postedBy)
    if (remote) items = items.filter((job) => job.isRemote)

    if (sort === 'salary') items = [...items].sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0))
    else if (sort === 'relevant') {
      items = [...items].sort(
        (a, b) =>
          matchScore(b, user ? this.db.profiles[user.id] : null, user) -
          matchScore(a, user ? this.db.profiles[user.id] : null, user),
      )
    } else items = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

    const total = items.length
    const pages = Math.max(1, Math.ceil(total / pageSize))
    page = Math.min(page, pages)
    const paged = items.slice((page - 1) * pageSize, page * pageSize)

    const facet = (values: string[]) => {
      const counts = new Map<string, number>()
      values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1))
      return [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
    }
    const active = this.db.jobs.filter((job) => job.status === 'active')

    return {
      items: paged.map((job) => this.jobWithRelations(job, user?.id)),
      total,
      page,
      pageSize,
      pages,
      facets: {
        categories: facet(active.map((job) => job.category)),
        locations: facet(active.map((job) => job.location)),
        employmentTypes: facet(active.map((job) => String(job.employmentType))),
        experienceLevels: facet(active.map((job) => String(job.experienceLevel))),
      },
    }
  }

  async jobDetail(id: number): Promise<Job> {
    const job = this.db.jobs.find((item) => item.id === id)
    if (!job) throw new ApiError(404, 'job_not_found')
    const user = this.currentUser()
    const company = job.companyId ? this.db.companies.find((c) => c.id === job.companyId) : null
    return {
      ...this.jobWithRelations(job, user?.id),
      company: company
        ? { ...company, openJobsCount: this.db.jobs.filter((item) => item.companyId === company.id && item.status === 'active').length }
        : null,
    }
  }

  async recommendedJobs(limit = 6) {
    const user = this.currentUser()
    const profile = user ? this.db.profiles[user.id] : null
    const items = [...this.db.jobs.filter((job) => job.status === 'active')]
      .sort((a, b) => matchScore(b, profile, user) - matchScore(a, profile, user))
      .slice(0, limit)
      .map((job) => this.jobWithRelations(job, user?.id))
    return { items }
  }

  async myJobs(status?: string) {
    const user = this.requireUser()
    const jobs = this.db.jobs
      .filter((job) => job.postedById === user.id && (!status || job.status === status))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .map((job) => ({
        ...this.jobWithRelations(job, user.id),
        applicationsCount: this.db.applications.filter((row) => row.jobId === job.id).length,
      }))
    return { items: jobs, total: jobs.length }
  }

  async createJob(payload: Record<string, unknown>): Promise<Job> {
    const user = this.requireUser()
    if (!['employer', 'admin'].includes(user.role)) throw new ApiError(403, 'employer_only')
    let company = this.db.companies.find((item) => item.ownerId === user.id)
    const companyName = pick<string>(payload, 'companyName', 'company_name')
    if (!company && companyName) {
      company = {
        id: this.next('companyId'),
        name: String(companyName),
        slug: String(companyName).toLowerCase().replace(/\s+/g, '-'),
        location: String(payload.location || ''),
        logo: String(companyName).slice(0, 2).toUpperCase(),
        color: '#1D4ED8',
        ownerId: user.id,
        createdAt: nowIso(),
      }
      this.db.companies.push(company)
    }
    const currency = String(payload.currency || 'UZS')
    const period = String(pick(payload, 'salaryPeriod', 'salary_period') || 'month')
    const salaryMin = pick<number | string>(payload, 'salaryMin', 'salary_min')
    const salaryMax = pick<number | string>(payload, 'salaryMax', 'salary_max')
    const job: Job = {
      id: this.next('jobId'),
      title: String(payload.title || ''),
      category: String(payload.category || 'IT'),
      location: String(payload.location || 'Tashkent'),
      isRemote: Boolean(pick(payload, 'isRemote', 'is_remote')) || String(payload.location) === 'Remote',
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      currency,
      salaryPeriod: period,
      salaryLabel: salaryLabel({
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        currency,
        salaryPeriod: period,
      }),
      employmentType: String(pick(payload, 'employmentType', 'employment_type') || 'Full-time'),
      experienceLevel: String(pick(payload, 'experienceLevel', 'experience_level') || 'Middle'),
      skills: (payload.skills as string[]) || [],
      status: String(payload.status || 'active') as Job['status'],
      views: 0,
      applicationsCount: 0,
      companyId: company ? company.id : null,
      postedById: user.id,
      createdAt: nowIso(),
      description: String(payload.description || ''),
      responsibilities: (payload.responsibilities as string[]) || [],
      requirements: (payload.requirements as string[]) || [],
      benefits: (payload.benefits as string[]) || [],
    }
    this.db.jobs.unshift(job)
    this.notify(user.id, 'Job published', `“${job.title}” is now live on LocalJob.`, 'success', '/employer/jobs')
    this.log('job_create', user.email, job.title)
    this.persist()
    return this.jobWithRelations(job, user.id)
  }

  async updateJob(id: number, payload: Record<string, unknown>): Promise<Job> {
    const user = this.requireUser()
    const job = this.db.jobs.find((item) => item.id === id)
    if (!job) throw new ApiError(404, 'job_not_found')
    if (user.role !== 'admin' && job.postedById !== user.id) throw new ApiError(403, 'not_your_job')

    // the form speaks snake_case (API contract), the store speaks camelCase
    const mapping: Record<string, keyof Job> = {
      title: 'title',
      category: 'category',
      location: 'location',
      is_remote: 'isRemote',
      isRemote: 'isRemote',
      salary_min: 'salaryMin',
      salaryMin: 'salaryMin',
      salary_max: 'salaryMax',
      salaryMax: 'salaryMax',
      currency: 'currency',
      salary_period: 'salaryPeriod',
      salaryPeriod: 'salaryPeriod',
      employment_type: 'employmentType',
      employmentType: 'employmentType',
      experience_level: 'experienceLevel',
      experienceLevel: 'experienceLevel',
      description: 'description',
      responsibilities: 'responsibilities',
      requirements: 'requirements',
      benefits: 'benefits',
      skills: 'skills',
      status: 'status',
    }
    Object.entries(payload).forEach(([key, value]) => {
      const target = mapping[key]
      if (target) (job as unknown as Record<string, unknown>)[target] = value
    })
    if (job.location?.toLowerCase() === 'remote') job.isRemote = true
    job.salaryLabel = salaryLabel(job)
    job.excerpt = `${(job.description || '').slice(0, 180)}${(job.description || '').length > 180 ? '…' : ''}`
    this.log('job_update', user.email, job.title)
    this.persist()
    return this.jobWithRelations(job, user.id)
  }

  async deleteJob(id: number) {
    const user = this.requireUser()
    const job = this.db.jobs.find((item) => item.id === id)
    if (!job) throw new ApiError(404, 'job_not_found')
    if (user.role !== 'admin' && job.postedById !== user.id) throw new ApiError(403, 'not_your_job')
    this.db.jobs = this.db.jobs.filter((item) => item.id !== id)
    this.db.applications = this.db.applications.filter((row) => row.jobId !== id)
    this.log('job_delete', user.email, job.title)
    this.persist()
    return { ok: true }
  }

  async registerView(id: number) {
    const job = this.db.jobs.find((item) => item.id === id)
    if (job) {
      job.views += 1
      this.persist()
    }
    return { ok: true, views: job?.views ?? 0 }
  }

  // ── saved ───────────────────────────────────────────────────────────
  async savedList() {
    const user = this.requireUser()
    const rows = this.db.saved.filter((row) => row.userId === user.id || user.role === 'job_seeker')
    const items: SavedJob[] = rows
      .map((row) => {
        const job = this.db.jobs.find((item) => item.id === row.jobId)
        return job ? { ...row, job: this.jobWithRelations(job, user.id) } : null
      })
      .filter(Boolean) as SavedJob[]
    return { items, total: items.length }
  }

  async saveJob(jobId: number) {
    const user = this.requireUser()
    if (!this.db.saved.some((row) => row.jobId === jobId && row.userId === user.id)) {
      const id = this.next('savedId')
      this.db.saved.unshift({
        id,
        jobId,
        userId: user.id,
        createdAt: nowIso(),
        job: this.db.jobs.find((job) => job.id === jobId) as Job,
      })
    }
    this.persist()
    return { ok: true, saved: true }
  }

  async unsaveJob(jobId: number) {
    const user = this.requireUser()
    this.db.saved = this.db.saved.filter((row) => !(row.jobId === jobId && row.userId === user.id))
    this.persist()
    return { ok: true, saved: false }
  }

  // ── applications ────────────────────────────────────────────────────
  async createApplication(payload: Record<string, unknown>): Promise<Application> {
    const user = this.requireUser()
    if (user.role === 'employer') throw new ApiError(403, 'employer_cannot_apply')
    const jobId = Number(pick(payload, 'jobId', 'job_id'))
    const job = this.db.jobs.find((item) => item.id === jobId)
    if (!job) throw new ApiError(404, 'job_not_found')
    if (this.db.applications.some((row) => row.jobId === jobId && row.applicantId === user.id)) {
      throw new ApiError(409, 'already_applied')
    }
    const application: Application = {
      id: this.next('applicationId'),
      jobId,
      applicantId: user.id,
      employerId: job.postedById ?? null,
      status: 'submitted',
      fullName: String(pick(payload, 'fullName', 'full_name') || user.name),
      email: String(payload.email || user.email),
      phone: (pick<string>(payload, 'phone') as string) || null,
      coverLetter: pick<string>(payload, 'coverLetter', 'cover_letter') ?? null,
      portfolioUrl: pick<string>(payload, 'portfolioUrl', 'portfolio_url') ?? null,
      resumeName: pick<string>(payload, 'resumeName', 'resume_name') ?? null,
      matchScore: matchScore(job, this.db.profiles[user.id], user),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    this.db.applications.unshift(application)
    job.applicationsCount += 1
    this.notify(user.id, 'Application submitted', `Your application for ${job.title} was sent successfully.`, 'success', '/applications')
    this.log('application_create', user.email, job.title)
    this.persist()
    return this.applicationView(application)
  }

  async applications(status?: string) {
    const user = this.requireUser()
    const items = this.db.applications
      .filter((row) => row.applicantId === user.id && (!status || status.split(',').includes(row.status)))
      .map((row) => this.applicationView(row))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    const counts: Record<string, number> = {}
    items.forEach((row) => {
      counts[row.status] = (counts[row.status] || 0) + 1
    })
    return { items, total: items.length, counts }
  }

  async applicationDetail(id: number): Promise<Application> {
    const row = this.db.applications.find((item) => item.id === id)
    if (!row) throw new ApiError(404, 'application_not_found')
    return this.applicationView(row)
  }

  async updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const user = this.requireUser()
    const row = this.db.applications.find((item) => item.id === id)
    if (!row) throw new ApiError(404, 'application_not_found')
    const job = this.db.jobs.find((item) => item.id === row.jobId)
    if (user.role !== 'admin' && job?.postedById !== user.id) throw new ApiError(403, 'forbidden')
    row.status = status
    row.updatedAt = nowIso()
    this.notify(row.applicantId, 'Application status changed', `Your application for ${job?.title ?? 'the job'} is now: ${status}.`, 'status', '/applications')
    this.log('application_status', user.email, `${id}:${status}`)
    this.persist()
    return this.applicationView(row)
  }

  async employerApplications(params: { jobId?: number; status?: string }) {
    const user = this.requireUser()
    const jobs = this.db.jobs.filter((job) => job.postedById === user.id)
    let rows = this.db.applications.filter((row) => jobs.some((job) => job.id === row.jobId))
    if (params.jobId) rows = rows.filter((row) => row.jobId === params.jobId)
    if (params.status) rows = rows.filter((row) => params.status!.split(',').includes(row.status))
    const counts: Record<string, number> = {}
    rows.forEach((row) => {
      counts[row.status] = (counts[row.status] || 0) + 1
    })
    return {
      items: rows.map((row) => this.applicationView(row)).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
      total: rows.length,
      counts,
      jobs: jobs.map((job) => ({ id: job.id, title: job.title })),
    }
  }

  async candidate(userId: number) {
    const candidate = this.db.users.find((user) => user.id === userId)
    if (!candidate) throw new ApiError(404, 'candidate_not_found')
    const profile = this.db.profiles[userId] || null
    return {
      user: this.publicUser(candidate) as User,
      profile,
      completion: profileCompletion(candidate, profile),
      hiredCount: this.db.applications.filter((row) => row.applicantId === userId && row.status === 'hired').length,
    }
  }

  // ── dashboards ──────────────────────────────────────────────────────
  async seekerDashboard(): Promise<SeekerDashboard> {
    const user = this.requireUser()
    const profile = this.db.profiles[user.id] || null
    const applications = this.db.applications
      .filter((row) => row.applicantId === user.id)
      .map((row) => this.applicationView(row))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    const savedRows = this.db.saved
      .filter((row) => row.userId === user.id)
      .map((row) => ({ ...row, job: this.jobWithRelations(this.db.jobs.find((job) => job.id === row.jobId) as Job, user.id) }))
    const recommended = [...this.db.jobs.filter((job) => job.status === 'active')]
      .sort((a, b) => matchScore(b, profile, user) - matchScore(a, profile, user))
      .slice(0, 6)
      .map((job) => this.jobWithRelations(job, user.id))
    const statusCounts: Record<string, number> = {}
    applications.forEach((row) => {
      statusCounts[row.status] = (statusCounts[row.status] || 0) + 1
    })
    return {
      stats: {
        applications: applications.length,
        savedJobs: savedRows.length,
        profileViews: (profile?.views || 0) + 42,
        profileCompletion: profileCompletion(user, profile),
        interviews: statusCounts.interview || 0,
        shortlisted: statusCounts.shortlisted || 0,
      },
      statusCounts,
      recommended,
      recentApplications: applications.slice(0, 4),
      savedJobs: savedRows.slice(0, 4),
      profile,
    }
  }

  async employerDashboard(): Promise<EmployerDashboard> {
    const user = this.requireUser()
    const jobs = this.db.jobs
      .filter((job) => job.postedById === user.id)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    const applications = this.db.applications
      .filter((row) => jobs.some((job) => job.id === row.jobId))
      .map((row) => this.applicationView(row))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    const weekAgo = Date.now() - 7 * 86400000
    return {
      stats: {
        activeJobs: jobs.filter((job) => job.status === 'active').length,
        totalJobs: jobs.length,
        applications: applications.length,
        views: jobs.reduce((sum, job) => sum + (job.views || 0), 0),
        hired: applications.filter((row) => row.status === 'hired').length,
        newThisWeek: applications.filter((row) => +new Date(row.createdAt) >= weekAgo).length,
        pausedJobs: jobs.filter((job) => job.status === 'paused').length,
      },
      jobs: jobs.map((job) => ({
        ...this.jobWithRelations(job, user.id),
        applicationsCount: this.db.applications.filter((row) => row.jobId === job.id).length,
      })),
      recentApplications: applications.slice(0, 6),
      company: this.db.companies.find((item) => item.ownerId === user.id) || null,
      me: this.publicUser(user) as User,
    }
  }

  // ── profile ─────────────────────────────────────────────────────────
  async getProfile() {
    const user = this.requireUser()
    const profile = this.db.profiles[user.id] || {
      userId: user.id,
      skills: [],
      experience: [],
      education: [],
      languages: [],
    }
    this.db.profiles[user.id] = profile
    this.persist()
    return { user: this.publicUser(user) as User, profile, completion: profileCompletion(user, profile) }
  }

  async updateProfile(payload: Record<string, unknown>) {
    const user = this.requireUser()
    const profile = this.db.profiles[user.id] || { userId: user.id, skills: [], experience: [], education: [], languages: [] }
    const map: Record<string, keyof Profile> = {
      title: 'title',
      bio: 'bio',
      location: 'location',
      phone: 'phone',
      category: 'category',
      skills: 'skills',
      experience: 'experience',
      education: 'education',
      languages: 'languages',
      portfolio: 'portfolio',
      linkedin: 'linkedin',
      github: 'github',
      telegram: 'telegram',
      website: 'website',
      expected_salary: 'expectedSalary',
      expectedSalary: 'expectedSalary',
      experience_level: 'experienceLevel',
      experienceLevel: 'experienceLevel',
    }
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'name' && typeof value === 'string') user.name = value
      const target = map[key]
      if (target) (profile as unknown as Record<string, unknown>)[target] = value
    })
    profile.updatedAt = nowIso()
    this.db.profiles[user.id] = profile
    this.persist()
    return { user: this.publicUser(user) as User, profile, completion: profileCompletion(user, profile) }
  }

  // ── companies ───────────────────────────────────────────────────────
  async companiesList(params: { search?: string; location?: string } = {}) {
    const search = (params.search || '').toLowerCase()
    const items = this.db.companies
      .filter(
        (company) =>
          !search ||
          company.name.toLowerCase().includes(search) ||
          (company.industry || '').toLowerCase().includes(search),
      )
      .map((company) => ({
        ...company,
        openJobsCount: this.db.jobs.filter((job) => job.companyId === company.id && job.status === 'active').length,
      }))
      .sort((a, b) => (b.openJobsCount || 0) - (a.openJobsCount || 0) || a.name.localeCompare(b.name))
    return { items, total: items.length }
  }

  async companyDetail(id: number) {
    const company = this.db.companies.find((item) => item.id === id)
    if (!company) throw new ApiError(404, 'company_not_found')
    const user = this.currentUser()
    const jobs = this.db.jobs
      .filter((job) => job.companyId === id && job.status === 'active')
      .map((job) => this.jobWithRelations(job, user?.id))
    return { ...company, openJobsCount: jobs.length, jobs }
  }

  async myCompany() {
    const user = this.requireUser()
    return { company: this.db.companies.find((item) => item.ownerId === user.id) || null }
  }

  async saveCompany(payload: Record<string, unknown>) {
    const user = this.requireUser()
    let company = this.db.companies.find((item) => item.ownerId === user.id)
    if (!company) {
      company = {
        id: this.next('companyId'),
        name: String(payload.name || ''),
        slug: String(payload.name || '').toLowerCase().replace(/\s+/g, '-'),
        ownerId: user.id,
        createdAt: nowIso(),
      }
      this.db.companies.push(company)
    }
    Object.assign(company, {
      name: payload.name || company.name,
      industry: payload.industry ?? company.industry,
      location: payload.location ?? company.location,
      size: payload.size ?? company.size,
      website: payload.website ?? company.website,
      about: payload.about ?? company.about,
      logo: payload.logo ?? company.logo,
    })
    this.persist()
    return { company }
  }

  // ── admin ───────────────────────────────────────────────────────────
  async adminStats(): Promise<AdminStats> {
    const users = this.db.users
    const jobs = this.db.jobs
    const applications = this.db.applications
    const weekAgo = Date.now() - 7 * 86400000
    const statusCounts: Record<string, number> = {}
    applications.forEach((row) => {
      statusCounts[row.status] = (statusCounts[row.status] || 0) + 1
    })
    const series = Array.from({ length: 14 }).map((_, index) => {
      const day = new Date(Date.now() - (13 - index) * 86400000)
      const key = day.toISOString().slice(0, 10)
      return {
        date: key,
        users: users.filter((user) => (user.createdAt || '').slice(0, 10) === key).length,
        jobs: jobs.filter((job) => (job.createdAt || '').slice(0, 10) === key).length,
        applications: applications.filter((row) => (row.createdAt || '').slice(0, 10) === key).length,
      }
    })
    return {
      users: {
        total: users.length,
        seekers: users.filter((user) => user.role === 'job_seeker').length,
        employers: users.filter((user) => user.role === 'employer').length,
        telegram: users.filter((user) => user.telegramId).length,
        newThisWeek: users.filter((user) => +new Date(user.createdAt) >= weekAgo).length,
      },
      jobs: {
        total: jobs.length,
        active: jobs.filter((job) => job.status === 'active').length,
        paused: jobs.filter((job) => job.status === 'paused').length,
        closed: jobs.filter((job) => job.status === 'closed').length,
      },
      companies: this.db.companies.length,
      views: jobs.reduce((sum, job) => sum + (job.views || 0), 0),
      applications: {
        total: applications.length,
        statusCounts,
        newThisWeek: applications.filter((row) => +new Date(row.createdAt) >= weekAgo).length,
      },
      series,
      topJobs: [...jobs]
        .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
        .slice(0, 6)
        .map((job) => ({
          id: job.id,
          title: job.title,
          company: this.db.companies.find((c) => c.id === job.companyId)?.name ?? null,
          applications: this.db.applications.filter((row) => row.jobId === job.id).length,
          views: job.views,
          status: job.status,
        })),
      system: { database: 'localStorage', bot: { running: false, username: null, lastError: null }, adminTelegramId: null },
    }
  }

  async adminUsers(params: { search?: string; role?: string; page?: number; pageSize?: number }) {
    const search = (params.search || '').toLowerCase()
    const pageSize = params.pageSize || 20
    let rows = this.db.users.filter(
      (user) => (!search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)) &&
        (!params.role || user.role === params.role),
    )
    const total = rows.length
    const page = Math.min(params.page || 1, Math.max(1, Math.ceil(total / pageSize)))
    rows = rows.slice((page - 1) * pageSize, page * pageSize)
    return {
      items: rows.map((user) => ({
        ...(this.publicUser(user) as User),
        applications: this.db.applications.filter((row) => row.applicantId === user.id).length,
        jobs: this.db.jobs.filter((job) => job.postedById === user.id).length,
      })),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async adminUpdateUser(id: number, payload: { role?: string; isActive?: boolean }) {
    const user = this.db.users.find((item) => item.id === id)
    if (!user) throw new ApiError(404, 'user_not_found')
    if (payload.role) user.role = payload.role as User['role']
    if (payload.isActive !== undefined) user.isActive = payload.isActive
    this.persist()
    return { user: this.publicUser(user) as User }
  }

  async adminDeleteUser(id: number) {
    this.db.users = this.db.users.filter((user) => user.id !== id)
    this.persist()
    return { ok: true }
  }

  async adminJobs(params: { search?: string; status?: string; page?: number; pageSize?: number }) {
    const search = (params.search || '').toLowerCase()
    const pageSize = params.pageSize || 20
    let rows = this.db.jobs.filter(
      (job) => (!search || job.title.toLowerCase().includes(search)) && (!params.status || job.status === params.status),
    )
    const total = rows.length
    const page = Math.min(params.page || 1, Math.max(1, Math.ceil(total / pageSize)))
    rows = rows.slice((page - 1) * pageSize, page * pageSize)
    return {
      items: rows.map((job) => ({
        ...this.jobWithRelations(job),
        applicationsCount: this.db.applications.filter((row) => row.jobId === job.id).length,
      })),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async adminUpdateJob(id: number, payload: { status?: string }) {
    const job = this.db.jobs.find((item) => item.id === id)
    if (!job) throw new ApiError(404, 'job_not_found')
    if (payload.status) job.status = payload.status as Job['status']
    this.persist()
    return this.jobWithRelations(job)
  }

  async adminDeleteJob(id: number) {
    this.db.jobs = this.db.jobs.filter((job) => job.id !== id)
    this.persist()
    return { ok: true }
  }

  async adminApplications(params: { status?: string; page?: number; pageSize?: number }) {
    const pageSize = params.pageSize || 20
    let rows = this.db.applications.filter((row) => !params.status || row.status === params.status)
    const total = rows.length
    const page = Math.min(params.page || 1, Math.max(1, Math.ceil(total / pageSize)))
    rows = rows.slice((page - 1) * pageSize, page * pageSize)
    return {
      items: rows.map((row) => this.applicationView(row)),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async adminBroadcast(payload: { message: string; audience: 'all' | 'job_seekers' | 'employers' }) {
    const audience = this.db.users.filter(
      (user) =>
        user.isActive !== false &&
        (payload.audience === 'all' ||
          (payload.audience === 'job_seekers' && user.role === 'job_seeker') ||
          (payload.audience === 'employers' && user.role === 'employer')),
    )
    audience.forEach((user) => this.notify(user.id, 'LocalJob announcement', payload.message, 'info', '/dashboard'))
    this.log('admin_broadcast', 'admin', payload.message.slice(0, 80))
    this.persist()
    return { ok: true, notified: audience.length, telegram: { sent: 0, failed: 0 } }
  }

  async adminActivity(limit = 30) {
    return { items: this.db.audit.slice(0, limit) }
  }

  async exportCsv(type: 'jobs' | 'users' | 'applications'): Promise<Blob> {
    const lines: string[] = []
    if (type === 'users') {
      lines.push('id,name,email,role,location,created_at')
      this.db.users.forEach((user) =>
        lines.push([user.id, user.name, user.email, user.role, user.location || '', user.createdAt].join(',')),
      )
    } else if (type === 'applications') {
      lines.push('id,job,applicant,status,match,created_at')
      this.db.applications.forEach((row) => {
        const job = this.db.jobs.find((item) => item.id === row.jobId)
        const applicant = this.db.users.find((item) => item.id === row.applicantId)
        lines.push([row.id, job?.title || '', applicant?.name || row.fullName, row.status, row.matchScore, row.createdAt].join(','))
      })
    } else {
      lines.push('id,title,category,location,employment_type,status,views,applications')
      this.db.jobs.forEach((job) =>
        lines.push(
          [
            job.id,
            `"${job.title}"`,
            job.category,
            job.location,
            job.employmentType,
            job.status,
            job.views,
            this.db.applications.filter((row) => row.jobId === job.id).length,
          ].join(','),
        ),
      )
    }
    return new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  }

  /** Clears the local database (used by "reset demo data"). */
  reset() {
    this.db = buildSeedDb()
    this.persist()
  }
}

export const localBackend = new LocalBackend()
