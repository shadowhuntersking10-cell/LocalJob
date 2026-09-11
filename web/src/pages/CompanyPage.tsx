import { useParams } from 'react-router-dom'
import { Building2, Globe, MapPin, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { CompanyLogo, VerifiedBadge } from '@/components/ui/badge'
import { Card, EmptyState, ListSkeleton, SectionHeading, Skeleton } from '@/components/ui/misc'
import { JobCard } from '@/components/jobs/JobCard'

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useLanguage()
  const company = useAsync(() => backend.company(Number(id)), [id])

  if (company.loading) {
    return (
      <div className="lj-container py-8">
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="mt-6">
          <ListSkeleton count={3} />
        </div>
      </div>
    )
  }

  if (!company.data) {
    return (
      <div className="lj-container py-16">
        <EmptyState title={t('company.notFound')} description={t('common.notFoundText')} actionLabel={t('nav.jobs')} actionTo="/jobs" />
      </div>
    )
  }

  const data = company.data

  return (
    <div className="lj-container py-8">
      <Card className="relative overflow-hidden p-5 sm:p-7">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${data.color ?? 'rgb(var(--primary))'}, transparent 65%)` }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <CompanyLogo name={data.name} logo={data.logo} color={data.color} size={72} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{data.name}</h1>
              {data.verified ? <VerifiedBadge label={t('company.verified')} /> : null}
            </div>
            <p className="mt-1.5 text-sm text-muted">{data.industry}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
              {data.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-subtle" /> {data.location}
                </span>
              ) : null}
              {data.size ? (
                <span className="inline-flex items-center gap-1.5">
                  <Users size={13} className="text-subtle" /> {data.size}
                </span>
              ) : null}
              {data.website ? (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Globe size={13} /> {data.website.replace(/^https?:\/\//, '')}
                </a>
              ) : null}
              <span className="lj-chip">
                <Building2 size={12} /> {data.openJobsCount ?? 0} {t('company.openJobs').toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {data.about ? (
          <div className="relative mt-6 border-t border-line pt-5">
            <h2 className="text-sm font-semibold text-fg">{t('company.about')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{data.about}</p>
          </div>
        ) : null}
      </Card>

      <div className="mt-8">
        <SectionHeading title={t('company.openJobs')} subtitle={t('featured.subtitle')} />
        <div className="mt-4 space-y-3">
          {data.jobs.length ? (
            data.jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <EmptyState
              icon={<Building2 size={22} />}
              title={t('company.noJobs')}
              description={t('jobs.empty.text')}
              actionLabel={t('featured.viewAll')}
              actionTo="/jobs"
            />
          )}
        </div>
      </div>
    </div>
  )
}
