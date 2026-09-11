/** HTTP client for the LocalJob FastAPI backend. */
import { KEYS, storage } from '@/lib/storage'
import type {
  AdminStats,
  Application,
  ApplicationStatus,
  AuditEntry,
  Company,
  EmployerDashboard,
  Job,
  JobListResponse,
  Meta,
  MePayload,
  AppNotification,
  NotificationPreferences,
  Profile,
  SavedJob,
  SeekerDashboard,
  SessionPayload,
  User,
} from '@/types'

export class ApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string) {
    super(code)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function getToken(): string {
  return storage.raw(KEYS.token, '')
}

export function setToken(token: string) {
  storage.setRaw(KEYS.token, token)
}

export function clearToken() {
  storage.remove(KEYS.token)
  storage.remove(KEYS.session)
}

type QueryValue = string | number | boolean | null | undefined | (string | number)[]

export function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '' || value === false) return
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(','))
      return
    }
    search.set(key, String(value))
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(path, { ...init, headers })
  } catch (error) {
    throw new ApiError(0, 'network_error')
  }

  if (response.status === 204) return undefined as T

  const text = await response.text()
  let payload: unknown = null
  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = text
  }

  if (!response.ok) {
    const detail =
      (payload && typeof payload === 'object' && 'detail' in payload
        ? String((payload as { detail: unknown }).detail)
        : '') || `http_${response.status}`
    throw new ApiError(response.status, detail)
  }
  return payload as T
}

const post = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) })
const put = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) })
const patch = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) })
const del = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: 'DELETE', body: body === undefined ? undefined : JSON.stringify(body) })

export const api = {
  health: () => request<{ status: string; database: string; bot_enabled: boolean }>('/api/health'),
  meta: () => request<Meta>('/api/meta'),

  auth: {
    register: (payload: Record<string, unknown>) => post<SessionPayload>('/api/auth/register', payload),
    login: (payload: { email: string; password: string; remember?: boolean }) =>
      post<SessionPayload>('/api/auth/login', payload),
    demo: (kind: 'seeker' | 'employer') => post<SessionPayload>(`/api/auth/demo/${kind}`, {}),
    telegram: (initData: string, startParam?: string) =>
      post<SessionPayload & { created?: boolean }>('/api/auth/telegram', { init_data: initData, start_param: startParam }),
    me: () => request<MePayload>('/api/auth/me'),
    logout: () => post<{ ok: boolean }>('/api/auth/logout', {}),
    changePassword: (payload: { current_password: string; new_password: string }) =>
      post<{ ok: boolean }>('/api/auth/change-password', payload),
    deleteAccount: (password: string) => del<{ ok: boolean }>('/api/auth/account', { password }),
  },

  settings: {
    update: (payload: Partial<Pick<User, 'name' | 'phone' | 'location' | 'language' | 'theme'>>) =>
      patch<{ user: User }>('/api/settings', payload),
    preferences: () => request<{ preferences: NotificationPreferences }>('/api/settings/preferences'),
    updatePreferences: (payload: Partial<NotificationPreferences>) =>
      put<{ preferences: NotificationPreferences }>('/api/settings/preferences', payload),
  },

  notifications: {
    list: () => request<{ items: AppNotification[]; unread: number }>('/api/notifications'),
    markRead: (payload: { ids?: number[]; all?: boolean }) =>
      post<{ ok: boolean; unread: number }>('/api/notifications/read', payload),
    clear: () => del<{ ok: boolean }>('/api/notifications'),
  },

  jobs: {
    list: (params: Record<string, QueryValue>) => request<JobListResponse>(`/api/jobs${buildQuery(params)}`),
    detail: (id: number) => request<Job>(`/api/jobs/${id}`),
    recommended: (limit = 6) => request<{ items: Job[] }>(`/api/jobs/recommended${buildQuery({ limit })}`),
    mine: (status?: string) => request<{ items: Job[]; total: number }>(`/api/jobs/mine${buildQuery({ status })}`),
    create: (payload: Record<string, unknown>) => post<Job>('/api/jobs', payload),
    update: (id: number, payload: Record<string, unknown>) => patch<Job>(`/api/jobs/${id}`, payload),
    remove: (id: number) => del<{ ok: boolean }>(`/api/jobs/${id}`),
    view: (id: number) => post<{ ok: boolean; views: number }>(`/api/jobs/${id}/view`, {}),
  },

  saved: {
    list: () => request<{ items: SavedJob[]; total: number }>('/api/saved'),
    save: (jobId: number) => post<{ ok: boolean; saved: boolean }>(`/api/saved/${jobId}`, {}),
    remove: (jobId: number) => del<{ ok: boolean; saved: boolean }>(`/api/saved/${jobId}`),
  },

  applications: {
    create: (payload: Record<string, unknown>) => post<Application>('/api/applications', payload),
    mine: (status?: string) =>
      request<{ items: Application[]; total: number; counts: Record<string, number> }>(
        `/api/applications${buildQuery({ status })}`,
      ),
    detail: (id: number) => request<Application>(`/api/applications/${id}`),
    updateStatus: (id: number, status: ApplicationStatus) =>
      patch<Application>(`/api/applications/${id}/status`, { status }),
    employerList: (params: { jobId?: number; status?: string }) =>
      request<{ items: Application[]; total: number; counts: Record<string, number>; jobs: { id: number; title: string }[] }>(
        `/api/employer/applications${buildQuery(params)}`,
      ),
    candidate: (userId: number) =>
      request<{ user: User; profile: Profile | null; completion: number; hiredCount: number }>(
        `/api/employer/candidates/${userId}`,
      ),
  },

  dashboard: {
    seeker: () => request<SeekerDashboard>('/api/dashboard'),
    employer: () => request<EmployerDashboard>('/api/employer/dashboard'),
  },

  profile: {
    get: () => request<{ user: User; profile: Profile; completion: number }>('/api/profile'),
    update: (payload: Record<string, unknown>) =>
      request<{ user: User; profile: Profile; completion: number }>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
  },

  companies: {
    list: (params: { search?: string; location?: string } = {}) =>
      request<{ items: Company[]; total: number }>(`/api/companies${buildQuery(params)}`),
    detail: (id: number) => request<Company & { jobs: Job[] }>(`/api/companies/${id}`),
    mine: () => request<{ company: Company | null }>('/api/my-company'),
    save: (payload: Record<string, unknown>) => put<{ company: Company }>('/api/my-company', payload),
  },

  admin: {
    stats: () => request<AdminStats>('/api/admin/stats'),
    users: (params: { search?: string; role?: string; page?: number; pageSize?: number }) =>
      request<{ items: (User & { applications: number; jobs: number })[]; total: number; page: number; pages: number }>(
        `/api/admin/users${buildQuery(params)}`,
      ),
    updateUser: (id: number, payload: { role?: string; isActive?: boolean }) =>
      patch<{ user: User }>(`/api/admin/users/${id}`, payload),
    deleteUser: (id: number) => del<{ ok: boolean }>(`/api/admin/users/${id}`),
    jobs: (params: { search?: string; status?: string; page?: number; pageSize?: number }) =>
      request<{ items: Job[]; total: number; page: number; pages: number }>(`/api/admin/jobs${buildQuery(params)}`),
    updateJob: (id: number, payload: { status?: string }) => patch<Job>(`/api/admin/jobs/${id}`, payload),
    deleteJob: (id: number) => del<{ ok: boolean }>(`/api/admin/jobs/${id}`),
    applications: (params: { status?: string; page?: number; pageSize?: number }) =>
      request<{ items: Application[]; total: number; page: number; pages: number }>(
        `/api/admin/applications${buildQuery(params)}`,
      ),
    broadcast: (payload: { message: string; audience: 'all' | 'job_seekers' | 'employers' }) =>
      post<{ ok: boolean; notified: number; telegram: { sent: number; failed: number } }>('/api/admin/broadcast', payload),
    activity: (limit = 30) => request<{ items: AuditEntry[] }>(`/api/admin/activity${buildQuery({ limit })}`),
    exportUrl: (type: 'jobs' | 'users' | 'applications') => `/api/admin/export?type=${type}`,
  },
}

export type Api = typeof api
