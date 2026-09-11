import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  CheckSquare,
  Eye,
  FileText,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { greetingKey, statusLabel, statusTone, formatDate } from '@/lib/utils'
import { Badge, Progress } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, EmptyState, SectionHeading, StatsSkeleton } from '@/components/ui/misc'
import { JobCard } from '@/components/jobs/JobCard'

export default function DashboardPage() {
  const { t, lang } = useLanguage()
  const { user, completion } = useAuth()
  const dashboard = useAsync(() => backend.seekerDashboard(), [user?.id])

  const greeting = {
    morning: t('dash.goodMorning', { name: user?.name.split(' ')[0] ?? '' }),
    afternoon: t('dash.goodAfternoon', { name: user?.name.split(' ')[0] ?? '' }),
    evening: t('dash.goodEvening', { name: user?.name.split(' ')[0] ?? '' }),
    night: t('dash.goodNight', { name: user?.name.split(' ')[0] ?? '' }),
  }[greetingKey()]

  const stats = dashboard.data?.stats

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 65%)' }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{greeting}</h1>
            <p className="mt-1.5 text-sm text-muted">{t('dash.subtitle')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink to="/jobs" size="sm" icon={<Search size={15} />}>
                {t('dash.searchJobs')}
              </ButtonLink>
              <ButtonLink to="/profile" variant="secondary" size="sm" icon={<UserRound size={15} />}>
                {t('dash.updateProfile')}
              </ButtonLink>
              <ButtonLink to="/applications" variant="ghost" size="sm" icon={<FileText size={15} />}>
                {t('dash.viewApplications')}
              </ButtonLink>
            </div>
          </div>

          <div className="w-full max-w-sm shrink-0">
            <div className="rounded-lg border border-line bg-card-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-subtle">{t('dash.completion')}</p>
                <span className="text-sm font-bold text-fg">{stats?.profileCompletion ?? completion}%</span>
              </div>
              <Progress value={stats?.profileCompletion ?? completion} className="mt-3" />
              <p className="mt-2.5 text-xs leading-relaxed text-muted">{t('profile.completionHint')}</p>
            </div>
          </div>
        </div>
      </Card>

      {dashboard.loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatBlock
            icon={<Send size={17} />}
            label={t('dash.applications')}
            value={stats?.applications ?? 0}
            hint={t('dash.interviews') + ': ' + (stats?.interviews ?? 0)}
            to="/applications"
          />
          <StatBlock icon={<Bookmark size={17} />} label={t('dash.saved')} value={stats?.savedJobs ?? 0} to="/saved" />
          <StatBlock icon={<Eye size={17} />} label={t('dash.views')} value={stats?.profileViews ?? 0} to="/profile" />
          <StatBlock
            icon={<TrendingUp size={17} />}
            label={t('dash.completion')}
            value={`${stats?.profileCompletion ?? completion}%`}
            to="/profile"
          />
        </div>
      )}

      <section>
        <SectionHeading
          title={
            <span className="inline-flex items-center gap-2">
              <Sparkles size={18} className="text-accent" /> {t('dash.recommended')}
            </span>
          }
          subtitle={t('featured.subtitle')}
          action={
            <ButtonLink to="/jobs" variant="ghost" size="sm" iconRight={<ArrowRight size={15} />}>
              {t('featured.viewAll')}
            </ButtonLink>
          }
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {(dashboard.data?.recommended ?? []).slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {!dashboard.loading && (dashboard.data?.recommended.length ?? 0) === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState
                title={t('jobs.empty.title')}
                description={t('jobs.empty.text')}
                actionLabel={t('jobs.empty.cta')}
                actionTo="/jobs"
                variant="compact"
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading
            title={t('dash.recentApplications')}
            action={
              <ButtonLink to="/applications" variant="ghost" size="sm">
                {t('common.viewAll')}
              </ButtonLink>
            }
          />
          <div className="mt-4 space-y-3">
            {(dashboard.data?.recentApplications ?? []).map((application) => (
              <div key={application.id} className="flex items-center gap-3 rounded-md border border-line bg-card-2 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <Briefcase size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{application.job?.title ?? '—'}</p>
                  <p className="truncate text-xs text-subtle">
                    {application.job?.company?.name} · {formatDate(application.createdAt, lang)}
                  </p>
                </div>
                <Badge tone={statusTone(application.status)}>{statusLabel(application.status, lang)}</Badge>
              </div>
            ))}
            {!dashboard.loading && (dashboard.data?.recentApplications.length ?? 0) === 0 ? (
              <EmptyState
                icon={<FileText size={22} />}
                title={t('dash.noApplications')}
                description={t('dash.noApplicationsText')}
                actionLabel={t('jobs.title')}
                actionTo="/jobs"
                variant="compact"
              />
            ) : null}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading
            title={t('dash.savedJobs')}
            action={
              <ButtonLink to="/saved" variant="ghost" size="sm">
                {t('common.viewAll')}
              </ButtonLink>
            }
          />
          <div className="mt-4 space-y-3">
            {(dashboard.data?.savedJobs ?? []).map((row) => (
              <Link
                key={row.id}
                to={`/jobs/${row.jobId}`}
                className="flex items-center gap-3 rounded-md border border-line bg-card-2 p-3 transition-colors hover:border-primary/40"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent/12 text-accent">
                  <Bookmark size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{row.job?.title}</p>
                  <p className="truncate text-xs text-subtle">
                    {row.job?.company?.name} · {row.job?.salaryLabel}
                  </p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-subtle" />
              </Link>
            ))}
            {!dashboard.loading && (dashboard.data?.savedJobs.length ?? 0) === 0 ? (
              <EmptyState
                icon={<Bookmark size={22} />}
                title={t('saved.empty.title')}
                description={t('saved.empty.text')}
                actionLabel={t('saved.empty.cta')}
                actionTo="/jobs"
                variant="compact"
              />
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading title={t('dash.quickActions')} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: '/jobs', icon: <Search size={16} />, label: t('dash.searchJobs') },
            { to: '/profile', icon: <UserRound size={16} />, label: t('dash.updateProfile') },
            { to: '/applications', icon: <FileText size={16} />, label: t('dash.viewApplications') },
            { to: '/settings', icon: <CheckSquare size={16} />, label: t('nav.settings') },
          ].map((action) => (
            <ButtonLink key={action.to} to={action.to} variant="secondary" icon={action.icon} className="justify-start">
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </Card>
    </div>
  )
}

function StatBlock({
  icon,
  label,
  value,
  hint,
  to,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  hint?: string
  to: string
}) {
  return (
    <Link to={to} className="lj-card p-4 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </Link>
  )
}
