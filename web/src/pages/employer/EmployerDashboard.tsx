import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Eye, Plus, Send, UserCheck, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { formatDate, statusLabel, statusTone } from '@/lib/utils'
import { Badge, CompanyLogo } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { Card, EmptyState, SectionHeading, StatsSkeleton } from '@/components/ui/misc'

export default function EmployerDashboard() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const dashboard = useAsync(() => backend.employerDashboard(), [user?.id])
  const stats = dashboard.data?.stats

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent)), transparent 65%)' }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <CompanyLogo
              name={dashboard.data?.company?.name ?? user?.name}
              logo={dashboard.data?.company?.logo}
              color={dashboard.data?.company?.color}
              size={56}
            />
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('emp.title')}</h1>
              <p className="mt-1.5 text-sm text-muted">{t('emp.subtitle')}</p>
              <p className="mt-1 text-xs text-subtle">
                {dashboard.data?.company?.name ?? user?.name} · {dashboard.data?.company?.location ?? user?.location ?? ''}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink to="/employer/jobs/new" icon={<Plus size={16} />}>
              {t('emp.postNewJob')}
            </ButtonLink>
            <ButtonLink to="/employer/applications" variant="secondary" icon={<Users size={16} />}>
              {t('emp.candidates')}
            </ButtonLink>
          </div>
        </div>
      </Card>

      {dashboard.loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={<Briefcase size={17} />} label={t('emp.activeJobs')} value={stats?.activeJobs ?? 0} hint={`${stats?.pausedJobs ?? 0} ${statusLabel('paused', lang).toLowerCase()}`} />
          <Stat icon={<Send size={17} />} label={t('emp.totalApplications')} value={stats?.applications ?? 0} hint={`+${stats?.newThisWeek ?? 0} ${t('emp.newThisWeek').toLowerCase()}`} />
          <Stat icon={<Eye size={17} />} label={t('emp.views')} value={stats?.views ?? 0} />
          <Stat icon={<UserCheck size={17} />} label={t('emp.hired')} value={stats?.hired ?? 0} />
        </div>
      )}

      <Card className="p-5">
        <SectionHeading
          title={t('emp.activeListings')}
          action={
            <ButtonLink to="/employer/jobs" variant="ghost" size="sm" iconRight={<ArrowRight size={15} />}>
              {t('common.viewAll')}
            </ButtonLink>
          }
        />
        <div className="mt-4 space-y-3">
          {(dashboard.data?.jobs ?? []).slice(0, 5).map((job) => (
            <div key={job.id} className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-card-2 p-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">
                  <Link to={`/jobs/${job.id}`} className="transition-colors hover:text-primary">
                    {job.title}
                  </Link>
                </p>
                <p className="mt-0.5 text-xs text-subtle">
                  {job.location} · {formatDate(job.createdAt, lang)} · {job.applicationsCount ?? 0} {t('job.applicants').toLowerCase()}
                </p>
              </div>
              <Badge tone={statusTone(job.status)}>{statusLabel(job.status, lang)}</Badge>
              <ButtonLink to={`/employer/jobs/${job.id}/edit`} variant="secondary" size="sm">
                {t('emp.edit')}
              </ButtonLink>
            </div>
          ))}
          {!dashboard.loading && (dashboard.data?.jobs.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Briefcase size={22} />}
              title={t('emp.noJobs.title')}
              description={t('emp.noJobs.text')}
              actionLabel={t('emp.noJobs.cta')}
              actionTo="/employer/jobs/new"
              variant="compact"
            />
          ) : null}
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeading
          title={t('emp.recentApplications')}
          action={
            <ButtonLink to="/employer/applications" variant="ghost" size="sm" iconRight={<ArrowRight size={15} />}>
              {t('common.viewAll')}
            </ButtonLink>
          }
        />
        <div className="mt-4 space-y-3">
          {(dashboard.data?.recentApplications ?? []).map((application) => (
            <div key={application.id} className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-card-2 p-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">{application.applicant?.name ?? application.fullName}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {application.job?.title} · {formatDate(application.createdAt, lang)}
                </p>
              </div>
              <Badge tone="accent">{t('emp.match', { score: application.matchScore })}</Badge>
              <Badge tone={statusTone(application.status)}>{statusLabel(application.status, lang)}</Badge>
            </div>
          ))}
          {!dashboard.loading && (dashboard.data?.recentApplications.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Users size={22} />}
              title={t('emp.noCandidates.title')}
              description={t('emp.noCandidates.text')}
              actionLabel={t('emp.noCandidates.cta')}
              actionTo="/employer/jobs/new"
              variant="compact"
            />
          ) : null}
        </div>
      </Card>
    </div>
  )
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: number; hint?: string }) {
  return (
    <div className="lj-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
