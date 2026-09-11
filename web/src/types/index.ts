/** Shared domain types for the LocalJob client. */
export type Role = 'job_seeker' | 'employer' | 'admin'
export type Lang = 'uz' | 'en' | 'ru'
export type Theme = 'light' | 'dark'

export type ApplicationStatus =
  | 'submitted'
  | 'review'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'hired'

export type JobStatus = 'active' | 'paused' | 'closed'

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Freelance'
  | 'Internship'
  | 'Remote'

export type ExperienceLevel = 'No experience' | 'Junior' | 'Middle' | 'Senior'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  phone?: string | null
  location?: string | null
  avatar?: string | null
  telegramId?: number | null
  telegramUsername?: string | null
  language?: Lang
  theme?: Theme
  isActive?: boolean
  createdAt: string
}

export interface Company {
  id: number
  name: string
  slug: string
  industry?: string | null
  location?: string | null
  size?: string | null
  website?: string | null
  about?: string | null
  logo?: string | null
  color?: string
  verified?: boolean
  ownerId?: number | null
  createdAt?: string
  openJobsCount?: number
}

export interface Job {
  id: number
  title: string
  category: string
  location: string
  isRemote: boolean
  salaryMin?: number | null
  salaryMax?: number | null
  currency: string
  salaryPeriod: string
  salaryLabel: string
  employmentType: EmploymentType | string
  experienceLevel: ExperienceLevel | string
  skills: string[]
  status: JobStatus
  views: number
  applicationsCount: number
  companyId?: number | null
  postedById?: number | null
  createdAt: string
  company?: Company | null
  matchScore?: number | null
  excerpt?: string
  description?: string
  responsibilities?: string[]
  requirements?: string[]
  benefits?: string[]
  isSaved?: boolean
  hasApplied?: boolean
  canApply?: boolean
}

export interface ExperienceItem {
  role: string
  company: string
  from: string
  to: string
  description?: string
}

export interface EducationItem {
  degree: string
  school: string
  from: string
  to: string
}

export interface Profile {
  id?: number
  userId?: number
  title?: string | null
  bio?: string | null
  location?: string | null
  phone?: string | null
  category?: string | null
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  languages: string[]
  portfolio?: string | null
  linkedin?: string | null
  github?: string | null
  telegram?: string | null
  website?: string | null
  expectedSalary?: number | null
  experienceLevel?: string | null
  views?: number
  updatedAt?: string | null
}

export interface Application {
  id: number
  jobId: number
  applicantId: number
  employerId?: number | null
  status: ApplicationStatus
  fullName: string
  email: string
  phone?: string | null
  coverLetter?: string | null
  portfolioUrl?: string | null
  resumeName?: string | null
  matchScore: number
  createdAt: string
  updatedAt?: string
  job?: Job | null
  applicant?: User | null
  applicantProfile?: Profile | null
}

export interface SavedJob {
  id: number
  jobId: number
  userId?: number
  createdAt: string
  job: Job
}

export interface AppNotification {
  id: number
  userId?: number
  kind: string
  title: string
  message?: string | null
  link?: string | null
  isRead: boolean
  createdAt: string
}

export interface SessionPayload {
  token: string
  user: User
  profile: Profile | null
  profileCompletion: number
  company: Company | null
  isAdmin: boolean
  role: Role
}

export interface MePayload {
  user: User
  profile: Profile | null
  profileCompletion: number
  company: Company | null
  isAdmin: boolean
  role: Role
}

export interface Facet {
  value: string
  count: number
}

export interface JobListResponse {
  items: Job[]
  total: number
  page: number
  pageSize: number
  pages: number
  facets: {
    categories: Facet[]
    locations: Facet[]
    employmentTypes: Facet[]
    experienceLevels: Facet[]
  }
}

export interface JobFilters {
  search: string
  location: string
  categories: string[]
  employmentTypes: string[]
  experienceLevels: string[]
  salaryMin?: number | null
  salaryMax?: number | null
  remote: boolean
  sort: 'recent' | 'salary' | 'relevant'
  page: number
  pageSize: number
}

export interface SeekerDashboard {
  stats: {
    applications: number
    savedJobs: number
    profileViews: number
    profileCompletion: number
    interviews: number
    shortlisted: number
  }
  statusCounts: Record<string, number>
  recommended: Job[]
  recentApplications: Application[]
  savedJobs: SavedJob[]
  profile: Profile | null
}

export interface EmployerDashboard {
  stats: {
    activeJobs: number
    totalJobs: number
    applications: number
    views: number
    hired: number
    newThisWeek: number
    pausedJobs: number
  }
  jobs: Job[]
  recentApplications: Application[]
  company: Company | null
  me: User
}

export interface AdminStats {
  users: { total: number; seekers: number; employers: number; telegram: number; newThisWeek: number }
  jobs: { total: number; active: number; paused: number; closed: number }
  companies: number
  views: number
  applications: { total: number; statusCounts: Record<string, number>; newThisWeek: number }
  series: { date: string; users: number; jobs: number; applications: number }[]
  topJobs: { id: number; title: string; company?: string | null; applications: number; views: number; status: string }[]
  system: { database: string; bot: { running: boolean; username?: string | null; lastError?: string | null }; adminTelegramId?: number | null }
}

export interface Meta {
  app: { name: string; tagline: Record<Lang, string>; version: string; botUsername: string; webAppUrl: string }
  categories: string[]
  popularCategories: { key: string; label_uz: string; label_en: string; label_ru: string; icon: string; count: number }[]
  locations: string[]
  employmentTypes: string[]
  experienceLevels: string[]
  currencies: string[]
  salaryPeriods: string[]
  accountTypes: Role[]
  applicationStatuses: ApplicationStatus[]
  jobStatuses: JobStatus[]
}

export interface NotificationPreferences {
  emailApplications: boolean
  emailJobs: boolean
  telegramNotifications: boolean
  profileVisible: boolean
  showSalary: boolean
}

export interface AuditEntry {
  id: number
  actor?: string | null
  action: string
  detail?: string | null
  createdAt?: string | null
}
