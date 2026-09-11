import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, CheckCircle2, Clock, MapPin, Wallet } from 'lucide-react'
import type { Job } from '@/types'
import { cn, categoryLabel, employmentLabel, experienceLabel, relativeTime } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { CompanyLogo, Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSavedJobs } from '@/hooks/useSavedJobs'

export function JobCard({ job, compact }: { job: Job; compact?: boolean }) {
  const { t, lang } = useLanguage()
  const { isSaved, toggle, pending } = useSavedJobs()
  const saved = isSaved(job.id)

  return (
    <article
      className={cn(
        'lj-card group relative p-4 transition-all hover:border-line-strong hover:shadow-pop sm:p-5',
        compact && 'p-4 sm:p-4',
      )}
    >
      <div className="flex items-start gap-3.5">
        <CompanyLogo name={job.company?.name} logo={job.company?.logo} color={job.company?.color} size={compact ? 42 : 48} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold leading-snug text-fg sm:text-base">
                <Link to={`/jobs/${job.id}`} className="transition-colors hover:text-primary">
                  {job.title}
                </Link>
              </h3>
              <p className="mt-1 truncate text-sm text-muted">
                {job.company ? (
                  <Link to={`/company/${job.company.id}`} className="transition-colors hover:text-primary">
                    {job.company.name}
                  </Link>
                ) : (
                  'LocalJob'
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void toggle(job.id)}
              disabled={pending.has(job.id)}
              aria-label={saved ? t('jobs.saved') : t('jobs.save')}
              aria-pressed={saved}
              className={cn(
                'grid h-9 w-9 shrink-0 place-items-center rounded-md border transition-colors',
                saved
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-line bg-card text-subtle hover:border-primary/40 hover:text-primary',
              )}
            >
              {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} className="text-subtle" aria-hidden /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet size={13} className="text-subtle" aria-hidden /> {job.salaryLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-subtle" aria-hidden /> {relativeTime(job.createdAt, lang)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge tone="primary">{employmentLabel(String(job.employmentType), lang)}</Badge>
            <Badge>{experienceLabel(String(job.experienceLevel), lang)}</Badge>
            <Badge tone="accent">{categoryLabel(job.category, lang)}</Badge>
            {job.isRemote ? <Badge tone="info">Remote</Badge> : null}
            {job.hasApplied ? (
              <Badge tone="success" icon={<CheckCircle2 size={12} />}>
                {t('jobs.applied')}
              </Badge>
            ) : null}
            {typeof job.matchScore === 'number' && job.matchScore > 0 ? (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {t('jobs.match', { score: job.matchScore })}
              </span>
            ) : null}
          </div>

          {!compact && job.excerpt ? (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{job.excerpt}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-fg transition-colors hover:bg-primary-hover"
            >
              {t('jobs.viewJob')}
            </Link>
            <Button variant="secondary" size="sm" onClick={() => void toggle(job.id)} disabled={pending.has(job.id)}>
              {saved ? t('jobs.saved') : t('jobs.save')}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
