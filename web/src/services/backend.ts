/**
 * Backend facade.
 *
 * Chooses between the real FastAPI backend (`/api/*`) and the localStorage
 * offline backend. The decision is made once at startup with a health check and
 * re-evaluated automatically when a request fails because the server went away.
 */
import { ApiError, api, getToken } from '@/lib/api'
import { localBackend } from '@/services/localBackend'
import type {
  AdminStats,
  Application,
  ApplicationStatus,
  AppNotification,
  AuditEntry,
  Company,
  EmployerDashboard,
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

export type BackendMode = 'online' | 'offline' | 'unknown'

let mode: BackendMode = 'unknown'
const listeners = new Set<(mode: BackendMode) => void>()

export function getMode(): BackendMode {
  return mode
}

export function onModeChange(listener: (mode: BackendMode) => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setMode(next: BackendMode) {
  if (mode === next) return
  mode = next
  listeners.forEach((listener) => listener(next))
}

async function withFallback<T>(online: () => Promise<T>, offline: () => Promise<T>): Promise<T> {
  if (mode === 'offline') return offline()
  try {
    const result = await online()
    if (mode === 'unknown') setMode('online')
    return result
  } catch (error) {
    if (error instanceof ApiError && (error.status === 0 || error.status === 502 || error.status === 404)) {
      setMode('offline')
      return offline()
    }
    throw error
  }
}

export async function detectMode(): Promise<BackendMode> {
  try {
    await api.health()
    setMode('online')
  } catch {
    setMode('offline')
  }
  return mode
}

export const backend = {
  mode: getMode,

  health: () => withFallback(api.health, () => localBackend.health()),
  meta: (): Promise<Meta> => withFallback(api.meta, () => localBackend.meta()),

  register: (payload: Record<string, unknown>): Promise<SessionPayload> =>
    withFallback(
      () => api.auth.register(payload),
      () => localBackend.register(payload),
    ),
  login: (payload: { email: string; password: string; remember?: boolean }): Promise<SessionPayload> =>
    withFallback(
      () => api.auth.login(payload),
      () => localBackend.login(payload),
    ),
  demoLogin: (kind: 'seeker' | 'employer'): Promise<SessionPayload> =>
    withFallback(
      () => api.auth.demo(kind),
      () => localBackend.demoLogin(kind),
    ),
  telegramLogin: (initData: string, startParam?: string): Promise<SessionPayload & { created?: boolean }> =>
    withFallback(
      () => api.auth.telegram(initData, startParam),
      () => localBackend.telegram(initData, startParam),
    ),
  me: (): Promise<MePayload> => withFallback(api.auth.me, () => localBackend.me()),
  logout: (): Promise<{ ok: boolean }> => withFallback(api.auth.logout, () => localBackend.logout()),
  changePassword: (payload: { current_password: string; new_password: string }) =>
    withFallback(
      () => api.auth.changePassword(payload),
      () => localBackend.changePassword(payload),
    ),
  deleteAccount: (password: string) =>
    withFallback(
      () => api.auth.deleteAccount(password),
      () => localBackend.deleteAccount(password),
    ),

  updateSettings: (payload: Partial<User>) =>
    withFallback(
      () => api.settings.update(payload),
      () => localBackend.updateSettings(payload),
    ),
  preferences: (): Promise<{ preferences: NotificationPreferences }> =>
    withFallback(api.settings.preferences, () => localBackend.preferences()),
  updatePreferences: (payload: Partial<NotificationPreferences>) =>
    withFallback(
      () => api.settings.updatePreferences(payload),
      () => localBackend.updatePreferences(payload),
    ),

  notifications: (): Promise<{ items: AppNotification[]; unread: number }> =>
    withFallback(api.notifications.list, () => localBackend.notifications()),
  markNotifications: (payload: { ids?: number[]; all?: boolean }) =>
    withFallback(
      () => api.notifications.markRead(payload),
      () => localBackend.markNotifications(payload),
    ),
  clearNotifications: () => withFallback(api.notifications.clear, () => localBackend.clearNotifications()),

  jobs: (params: Record<string, unknown>): Promise<JobListResponse> =>
    withFallback(
      () => api.jobs.list(params as Record<string, never>),
      () => localBackend.jobsList(params),
    ),
  job: (id: number): Promise<Job> =>
    withFallback(
      () => api.jobs.detail(id),
      () => localBackend.jobDetail(id),
    ),
  recommendedJobs: (limit = 6): Promise<{ items: Job[] }> =>
    withFallback(
      () => api.jobs.recommended(limit),
      () => localBackend.recommendedJobs(limit),
    ),
  myJobs: (status?: string): Promise<{ items: Job[]; total: number }> =>
    withFallback(
      () => api.jobs.mine(status),
      () => localBackend.myJobs(status),
    ),
  createJob: (payload: Record<string, unknown>): Promise<Job> =>
    withFallback(
      () => api.jobs.create(payload),
      () => localBackend.createJob(payload),
    ),
  updateJob: (id: number, payload: Record<string, unknown>): Promise<Job> =>
    withFallback(
      () => api.jobs.update(id, payload),
      () => localBackend.updateJob(id, payload),
    ),
  deleteJob: (id: number) =>
    withFallback(
      () => api.jobs.remove(id),
      () => localBackend.deleteJob(id),
    ),
  registerJobView: (id: number) =>
    withFallback(
      () => api.jobs.view(id),
      () => localBackend.registerView(id),
    ),

  savedJobs: (): Promise<{ items: SavedJob[]; total: number }> =>
    withFallback(api.saved.list, () => localBackend.savedList()),
  saveJob: (jobId: number) =>
    withFallback(
      () => api.saved.save(jobId),
      () => localBackend.saveJob(jobId),
    ),
  unsaveJob: (jobId: number) =>
    withFallback(
      () => api.saved.remove(jobId),
      () => localBackend.unsaveJob(jobId),
    ),

  apply: (payload: Record<string, unknown>): Promise<Application> =>
    withFallback(
      () => api.applications.create(payload),
      () => localBackend.createApplication(payload),
    ),
  applications: (status?: string): Promise<{ items: Application[]; total: number; counts: Record<string, number> }> =>
    withFallback(
      () => api.applications.mine(status),
      () => localBackend.applications(status),
    ),
  application: (id: number): Promise<Application> =>
    withFallback(
      () => api.applications.detail(id),
      () => localBackend.applicationDetail(id),
    ),
  updateApplicationStatus: (id: number, status: ApplicationStatus): Promise<Application> =>
    withFallback(
      () => api.applications.updateStatus(id, status),
      () => localBackend.updateApplicationStatus(id, status),
    ),
  employerApplications: (params: { jobId?: number; status?: string }) =>
    withFallback(
      () => api.applications.employerList(params),
      () => localBackend.employerApplications(params),
    ),
  candidate: (userId: number) =>
    withFallback(
      () => api.applications.candidate(userId),
      () => localBackend.candidate(userId),
    ),

  seekerDashboard: (): Promise<SeekerDashboard> => withFallback(api.dashboard.seeker, () => localBackend.seekerDashboard()),
  employerDashboard: (): Promise<EmployerDashboard> =>
    withFallback(api.dashboard.employer, () => localBackend.employerDashboard()),

  profile: (): Promise<{ user: User; profile: Profile; completion: number }> =>
    withFallback(api.profile.get, () => localBackend.getProfile()),
  updateProfile: (payload: Record<string, unknown>) =>
    withFallback(
      () => api.profile.update(payload),
      () => localBackend.updateProfile(payload),
    ),

  companies: (params: { search?: string } = {}) =>
    withFallback(
      () => api.companies.list(params),
      () => localBackend.companiesList(params),
    ),
  company: (id: number): Promise<Company & { jobs: Job[] }> =>
    withFallback(
      () => api.companies.detail(id),
      () => localBackend.companyDetail(id),
    ),
  myCompany: () => withFallback(api.companies.mine, () => localBackend.myCompany()),
  saveCompany: (payload: Record<string, unknown>) =>
    withFallback(
      () => api.companies.save(payload),
      () => localBackend.saveCompany(payload),
    ),

  adminStats: (): Promise<AdminStats> => withFallback(api.admin.stats, () => localBackend.adminStats()),
  adminUsers: (params: { search?: string; role?: string; page?: number; pageSize?: number }) =>
    withFallback(
      () => api.admin.users(params),
      () => localBackend.adminUsers(params),
    ),
  adminUpdateUser: (id: number, payload: { role?: string; isActive?: boolean }) =>
    withFallback(
      () => api.admin.updateUser(id, payload),
      () => localBackend.adminUpdateUser(id, payload),
    ),
  adminDeleteUser: (id: number) =>
    withFallback(
      () => api.admin.deleteUser(id),
      () => localBackend.adminDeleteUser(id),
    ),
  adminJobs: (params: { search?: string; status?: string; page?: number; pageSize?: number }) =>
    withFallback(
      () => api.admin.jobs(params),
      () => localBackend.adminJobs(params),
    ),
  adminUpdateJob: (id: number, payload: { status?: string }) =>
    withFallback(
      () => api.admin.updateJob(id, payload),
      () => localBackend.adminUpdateJob(id, payload),
    ),
  adminDeleteJob: (id: number) =>
    withFallback(
      () => api.admin.deleteJob(id),
      () => localBackend.adminDeleteJob(id),
    ),
  adminApplications: (params: { status?: string; page?: number; pageSize?: number }) =>
    withFallback(
      () => api.admin.applications(params),
      () => localBackend.adminApplications(params),
    ),
  adminBroadcast: (payload: { message: string; audience: 'all' | 'job_seekers' | 'employers' }) =>
    withFallback(
      () => api.admin.broadcast(payload),
      () => localBackend.adminBroadcast(payload),
    ),
  adminActivity: (limit = 30): Promise<{ items: AuditEntry[] }> =>
    withFallback(
      () => api.admin.activity(limit),
      () => localBackend.adminActivity(limit),
    ),
  exportCsv: async (type: 'jobs' | 'users' | 'applications'): Promise<Blob> => {
    if (mode === 'offline') return localBackend.exportCsv(type)
    try {
      const response = await fetch(api.admin.exportUrl(type), {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!response.ok) throw new ApiError(response.status, 'export_failed')
      return await response.blob()
    } catch {
      return localBackend.exportCsv(type)
    }
  },
}

export { ApiError }
