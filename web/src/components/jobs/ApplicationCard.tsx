import { Link } from 'react-router-dom'
import { Building2, Calendar, ExternalLink, FileText, User } from 'lucide-react'
import type { Application, ApplicationStatus } from '@/types'
import { cn, formatDate, relativeTime, statusLabel, statusTone } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar, Badge, MatchRing } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { useState } from 'react'

const CANDIDATE_ACTIONS: { status: ApplicationStatus; tone: 'primary' | 'secondary' | 'success' | 'danger' }[] = [
  { status: 'shortlisted', tone: 'secondary' },
  { status: 'interview', tone: 'primary' },
  { status: 'hired', tone: 'success' },
  { status: 'rejected', tone: 'danger' },
]

/** Seeker view of an application. */
export function ApplicationCard({ application, onChanged }: { application: Application; onChanged?: () => void }) {
  const { t, lang } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const job = application.job

  return (
    <article className="lj-card p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Building2 size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-fg">
                {job ? (
                  <Link to={`/jobs/${job.id}`} className="transition-colors hover:text-primary">
                    {job.title}
                  </Link>
                ) : (
                  application.fullName
                )}
              </h3>
              <p className="mt-0.5 truncate text-sm text-muted">{job?.company?.name ?? 'LocalJob'}</p>
            </div>
            <Badge tone={statusTone(application.status)}>{statusLabel(application.status, lang)}</Badge>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="text-subtle" aria-hidden /> {t('apps.appliedOn')}:{' '}
              {formatDate(application.createdAt, lang)}
            </span>
            {job ? (
              <span className="inline-flex items-center gap-1.5">
                <FileText size={13} className="text-subtle" aria-hidden /> {application.resumeName ?? '—'}
              </span>
            ) : null}
          </div>

          {expanded ? (
            <div className="mt-3 space-y-2 rounded-md border border-line bg-card-2 p-3 text-sm text-muted">
              {application.coverLetter ? (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-subtle">{t('apps.coverLetter')}</p>
                  <p className="leading-relaxed">{application.coverLetter}</p>
                </div>
              ) : null}
              {application.portfolioUrl ? (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <ExternalLink size={13} /> {application.portfolioUrl}
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {job ? (
              <Link
                to={`/jobs/${job.id}`}
                className="inline-flex h-9 items-center rounded-md border border-line bg-card px-3 text-[13px] font-medium text-fg transition-colors hover:border-line-strong"
              >
                {t('apps.viewJob')}
              </Link>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => setExpanded((value) => !value)}>
              {expanded ? t('common.close') : t('apps.details')}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Employer view of a candidate. */
export function CandidateCard({
  application,
  onStatusChange,
}: {
  application: Application
  onStatusChange?: (application: Application) => void
}) {
  const { t, lang } = useLanguage()
  const toast = useToast()
  const [pending, setPending] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const candidate = application.applicant
  const profile = application.applicantProfile

  const changeStatus = async (status: ApplicationStatus) => {
    setPending(true)
    try {
      const updated = await backend.updateApplicationStatus(application.id, status)
      toast.success(t('emp.statusChanged', { status: statusLabel(status, lang) }))
      onStatusChange?.(updated)
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setPending(false)
    }
  }

  return (
    <article className="lj-card p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <Avatar name={candidate?.name ?? application.fullName} src={candidate?.avatar} size={46} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 truncate text-[15px] font-semibold text-fg">
                <User size={14} className="text-subtle" /> {candidate?.name ?? application.fullName}
              </h3>
              <p className="mt-0.5 truncate text-sm text-muted">{profile?.title ?? t('nav.candidates')}</p>
              <p className="mt-0.5 truncate text-xs text-subtle">
                {application.job?.title} · {formatDate(application.createdAt, lang)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MatchRing score={application.matchScore} label={t('emp.match', { score: application.matchScore })} />
              <Badge tone={statusTone(application.status)}>{statusLabel(application.status, lang)}</Badge>
            </div>
          </div>

          {profile?.skills?.length ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 6).map((skill) => (
                <Badge key={skill} tone="default">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}

          {showLetter ? (
            <div className="mt-3 rounded-md border border-line bg-card-2 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-subtle">{t('apps.coverLetter')}</p>
              <p className="text-sm leading-relaxed text-muted">{application.coverLetter}</p>
              {application.portfolioUrl ? (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink size={13} /> {t('apps.portfolio')}
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowLetter((value) => !value)}>
              {showLetter ? t('common.close') : t('apps.coverLetter')}
            </Button>
            {candidate ? (
              <Link
                to={`/employer/candidates/${candidate.id}`}
                className="inline-flex h-9 items-center rounded-md border border-line bg-card px-3 text-[13px] font-medium text-fg transition-colors hover:border-line-strong"
              >
                {t('emp.viewProfile')}
              </Link>
            ) : null}
            <span className="hidden flex-1 sm:block" />
            {CANDIDATE_ACTIONS.filter((action) => action.status !== application.status).map((action) => (
              <Button
                key={action.status}
                size="sm"
                variant={action.tone === 'primary' ? 'primary' : action.tone === 'success' ? 'success' : action.tone === 'danger' ? 'danger' : 'secondary'}
                disabled={pending}
                onClick={() => void changeStatus(action.status)}
              >
                {action.status === 'shortlisted'
                  ? t('emp.shortlist')
                  : action.status === 'interview'
                    ? t('emp.interview')
                    : action.status === 'hired'
                      ? t('emp.hire')
                      : t('emp.reject')}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function StatusLegend({ counts, className }: { counts: Record<string, number>; className?: string }) {
  const { lang } = useLanguage()
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {Object.entries(counts).map(([status, count]) => (
        <Badge key={status} tone={statusTone(status)}>
          {statusLabel(status, lang)}: {count}
        </Badge>
      ))}
    </div>
  )
}
