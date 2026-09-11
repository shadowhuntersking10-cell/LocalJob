import { Activity, Briefcase, Building2, Database, Eye, Send, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { APPLICATION_STATUSES, statusLabel, statusTone } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, SectionHeading, StatsSkeleton } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'

export default function AdminOverview() {
  const { t, lang } = useLanguage()
  const stats = useAsync(() => backend.adminStats(), [])

  if (stats.loading || !stats.data) {
    return (
      <div className="space-y-5">
        <StatsSkeleton />
        <Card className="h-64 p-5"> </Card>
      </div>
    )
  }

  const data = stats.data
  const maxSeries = Math.max(1, ...data.series.map((point) => Math.max(point.users, point.jobs, point.applications)))

  const cards = [
    { label: t('admin.totalUsers'), value: data.users.total, icon: <Users size={17} />, hint: `${data.users.seekers} · ${data.users.employers}`, tone: 'bg-primary/10 text-primary' },
    { label: t('admin.totalJobs'), value: data.jobs.total, icon: <Briefcase size={17} />, hint: `${data.jobs.active} ${statusLabel('active', lang).toLowerCase()}`, tone: 'bg-accent/10 text-accent' },
    { label: t('admin.totalApplications'), value: data.applications.total, icon: <Send size={17} />, hint: `+${data.applications.newThisWeek} ${t('admin.newThisWeek').toLowerCase()}`, tone: 'bg-success/12 text-success' },
    { label: t('admin.views'), value: data.views, icon: <Eye size={17} />, hint: `${data.companies} ${t('admin.companies').toLowerCase()}`, tone: 'bg-warning/12 text-warning' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('admin.title')}</h1>
        <p className="mt-1.5 text-sm text-muted">{t('admin.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="lj-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">{card.label}</p>
              <span className={`grid h-8 w-8 place-items-center rounded-md ${card.tone}`}>{card.icon}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-fg">{card.value}</p>
            <p className="mt-1 text-xs text-muted">{card.hint}</p>
          </div>
        ))}
      </div>

      <Card className="p-5">
        <SectionHeading
          title={t('admin.last14')}
          action={
            <div className="flex gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> {t('admin.users')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" /> {t('admin.jobs')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-success" /> {t('admin.applications')}
              </span>
            </div>
          }
        />
        <div className="mt-6 flex h-40 items-end gap-1.5">
          {data.series.map((point) => (
            <div key={point.date} className="group flex flex-1 flex-col items-center gap-1" title={`${point.date}: ${point.users}/${point.jobs}/${point.applications}`}>
              <div className="flex h-36 w-full items-end justify-center gap-[2px]">
                <span className="w-1.5 rounded-t bg-primary transition-all" style={{ height: `${(point.users / maxSeries) * 100}%`, minHeight: 2 }} />
                <span className="w-1.5 rounded-t bg-accent transition-all" style={{ height: `${(point.jobs / maxSeries) * 100}%`, minHeight: 2 }} />
                <span className="w-1.5 rounded-t bg-success transition-all" style={{ height: `${(point.applications / maxSeries) * 100}%`, minHeight: 2 }} />
              </div>
              <span className="text-[9px] text-subtle">{point.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading title={t('admin.topJobs')} />
          <div className="mt-4 space-y-2.5">
            {data.topJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 rounded-md border border-line bg-card-2 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{job.title}</p>
                  <p className="truncate text-xs text-subtle">
                    {job.company} · {job.views} {t('admin.views').toLowerCase()}
                  </p>
                </div>
                <Badge tone="primary">{job.applications}</Badge>
                <Badge tone={statusTone(job.status)}>{statusLabel(job.status, lang)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading title={t('admin.statusBreakdown')} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {APPLICATION_STATUSES.map((status) => (
              <div key={status} className="rounded-md border border-line bg-card-2 px-3 py-2.5">
                <p className="text-xs text-subtle">{statusLabel(status, lang)}</p>
                <p className="mt-0.5 text-lg font-semibold text-fg">{data.applications.statusCounts[status] ?? 0}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 rounded-md border border-line bg-card-2 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-muted">
                <Database size={14} className="text-subtle" /> {t('admin.database')}
              </span>
              <span className="font-medium text-fg">{data.system.database}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-muted">
                <Activity size={14} className="text-subtle" /> {t('admin.botStatus')}
              </span>
              <Badge tone={data.system.bot.running ? 'success' : 'warning'}>
                {data.system.bot.running ? `@${data.system.bot.username}` : 'offline'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-muted">
                <Building2 size={14} className="text-subtle" /> {t('admin.companies')}
              </span>
              <span className="font-medium text-fg">{data.companies}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading title={t('admin.export')} subtitle={t('admin.subtitle')} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => void downloadCsv('jobs', t)}>
            jobs.csv
          </Button>
          <Button variant="secondary" size="sm" onClick={() => void downloadCsv('users', t)}>
            users.csv
          </Button>
          <Button variant="secondary" size="sm" onClick={() => void downloadCsv('applications', t)}>
            applications.csv
          </Button>
        </div>
      </Card>
    </div>
  )
}

async function downloadCsv(type: 'jobs' | 'users' | 'applications', t: (key: string) => string) {
  const blob = await backend.exportCsv(type)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `localjob-${type}.csv`
  link.click()
  URL.revokeObjectURL(url)
  void t
}
