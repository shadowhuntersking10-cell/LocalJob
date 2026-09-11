import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Eye,
  Globe,
  MapPin,
  Share2,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import type { Job } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { categoryLabel, employmentLabel, experienceLabel, formatDate, relativeTime } from '@/lib/utils'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { Avatar, Badge, CompanyLogo, VerifiedBadge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, EmptyState, Skeleton } from '@/components/ui/misc'
import { ApplyModal } from '@/components/jobs/ApplyModal'
import { JobCard } from '@/components/jobs/JobCard'
import { Breadcrumbs } from '@/components/ui/misc'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useLanguage()
  const { user, isAdmin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { isSaved, toggle } = useSavedJobs()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [applyOpen, setApplyOpen] = useState(false)
  const [similar, setSimilar] = useState<Job[]>([])

  useEffect(() => {
    let active = true
    const jobId = Number(id)
    setLoading(true)
    backend
      .job(jobId)
      .then(async (result) => {
        if (!active) return
        setJob(result)
        void backend.registerJobView(jobId).catch(() => undefined)
        const related = await backend.jobs({ category: result.category, pageSize: 3 })
        if (active) setSimilar(related.items.filter((item) => item.id !== result.id).slice(0, 3))
      })
      .catch(() => {
        if (active) setNotFound(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const share = async () => {
    const url = window.location.href
    const data = { title: job?.title ?? 'LocalJob', text: job?.title, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success(t('job.shared'))
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        toast.success(t('job.shared'))
      } catch {
        toast.error(t('error.generic'))
      }
    }
  }

  const handleApply = () => {
    if (!user) {
      toast.info(t('error.loginToApply'))
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }
    if (user.role === 'employer' && !isAdmin) {
      toast.error(t('error.employerCannotApply'))
      return
    }
    if (job?.hasApplied) {
      toast.info(t('error.alreadyApplied'))
      return
    }
    setApplyOpen(true)
  }

  if (loading) {
    return (
      <div className="lj-container py-8">
        <Skeleton className="h-4 w-48" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <Card className="p-6">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/3" />
              <Skeleton className="mt-5 h-10 w-full" />
            </Card>
            <Card className="space-y-3 p-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </Card>
          </div>
          <Card className="p-6">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="mt-4 h-4 w-2/3" />
            <Skeleton className="mt-3 h-3 w-1/2" />
          </Card>
        </div>
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div className="lj-container py-16">
        <EmptyState
          title={t('error.jobNotFound')}
          description={t('common.notFoundText')}
          actionLabel={t('job.back')}
          actionTo="/jobs"
        />
      </div>
    )
  }

  const saved = isSaved(job.id)
  const company = job.company

  return (
    <div className="bg-bg-soft pb-16">
      <div className="lj-container pt-5">
        <Breadcrumbs
          items={[
            { label: t('common.breadcrumbHome'), to: '/' },
            { label: t('nav.jobs'), to: '/jobs' },
            { label: categoryLabel(job.category, lang), to: `/jobs?category=${job.category}` },
            { label: job.title },
          ]}
        />
      </div>

      <div className="lj-container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <CompanyLogo name={company?.name} logo={company?.logo} color={company?.color} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-fg sm:text-2xl">{job.title}</h1>
                      <p className="mt-1.5 text-sm text-muted">
                        {company ? (
                          <Link to={`/company/${company.id}`} className="transition-colors hover:text-primary">
                            {company.name}
                          </Link>
                        ) : (
                          'LocalJob'
                        )}
                      </p>
                    </div>
                    {typeof job.matchScore === 'number' && job.matchScore > 0 ? (
                      <Badge tone="accent" icon={<Sparkles size={12} />}>
                        {t('jobs.match', { score: job.matchScore })}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-subtle" aria-hidden /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Wallet size={14} className="text-subtle" aria-hidden /> {job.salaryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={14} className="text-subtle" aria-hidden /> {employmentLabel(String(job.employmentType), lang)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock size={14} className="text-subtle" aria-hidden /> {relativeTime(job.createdAt, lang)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge tone="primary">{experienceLabel(String(job.experienceLevel), lang)}</Badge>
                    <Badge tone="accent">{categoryLabel(job.category, lang)}</Badge>
                    {job.isRemote ? <Badge tone="info">Remote</Badge> : null}
                    {job.hasApplied ? (
                      <Badge tone="success" icon={<CheckCircle2 size={12} />}>
                        {t('jobs.applied')}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button onClick={handleApply} disabled={job.hasApplied || (user?.role === 'employer' && !isAdmin)}>
                      {job.hasApplied ? t('jobs.applied') : t('job.applyNow')}
                    </Button>
                    <Button
                      variant="secondary"
                      icon={saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      onClick={() => void toggle(job.id)}
                    >
                      {saved ? t('jobs.saved') : t('job.saveJob')}
                    </Button>
                    <Button variant="ghost" icon={<Share2 size={15} />} onClick={() => void share()}>
                      {t('job.share')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <h2 className="text-base font-semibold text-fg">{t('job.about')}</h2>
              <div className="lj-prose mt-3">
                <p className="text-sm leading-relaxed text-muted">{job.description}</p>
              </div>

              {job.responsibilities?.length ? (
                <ListSection title={t('job.responsibilities')} items={job.responsibilities} />
              ) : null}
              {job.requirements?.length ? <ListSection title={t('job.requirements')} items={job.requirements} /> : null}
              {job.skills?.length ? (
                <div className="mt-6">
                  <h2 className="text-base font-semibold text-fg">{t('job.skills')}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="lj-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {job.benefits?.length ? <ListSection title={t('job.benefits')} items={job.benefits} /> : null}
            </Card>

            {similar.length ? (
              <div>
                <h2 className="mb-3 text-base font-semibold text-fg">{t('job.similar')}</h2>
                <div className="grid gap-3">
                  {similar.map((item) => (
                    <JobCard key={item.id} job={item} compact />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5">
            <Card className="p-5 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold text-fg">{t('job.overview')}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row icon={<Wallet size={14} />} label={t('job.salary')} value={job.salaryLabel} />
                <Row icon={<Briefcase size={14} />} label={t('jobs.employmentType')} value={employmentLabel(String(job.employmentType), lang)} />
                <Row icon={<Sparkles size={14} />} label={t('jobs.experience')} value={experienceLabel(String(job.experienceLevel), lang)} />
                <Row icon={<CalendarClock size={14} />} label={t('job.posted')} value={formatDate(job.createdAt, lang)} />
                <Row icon={<Eye size={14} />} label={t('job.views')} value={String(job.views ?? 0)} />
                <Row icon={<Users size={14} />} label={t('job.applicants')} value={String(job.applicationsCount ?? 0)} />
              </dl>
              <Button fullWidth className="mt-5" onClick={handleApply} disabled={job.hasApplied || (user?.role === 'employer' && !isAdmin)}>
                {job.hasApplied ? t('jobs.applied') : t('job.applyNow')}
              </Button>
            </Card>

            {company ? (
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-fg">{t('job.company')}</h2>
                <div className="mt-4 flex items-start gap-3">
                  <CompanyLogo name={company.name} logo={company.logo} color={company.color} size={44} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-fg">
                      <Link to={`/company/${company.id}`} className="truncate transition-colors hover:text-primary">
                        {company.name}
                      </Link>
                      {company.verified ? <VerifiedBadge label="" /> : null}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{company.industry}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <Row icon={<MapPin size={14} />} label={t('jobs.location')} value={company.location ?? '—'} />
                  <Row icon={<Users size={14} />} label={t('job.size')} value={company.size ?? '—'} />
                  {company.website ? (
                    <Row
                      icon={<Globe size={14} />}
                      label={t('job.website')}
                      value={
                        <a href={company.website} target="_blank" rel="noreferrer" className="lj-link">
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      }
                    />
                  ) : null}
                </dl>
                {company.about ? <p className="mt-4 text-sm leading-relaxed text-muted">{company.about}</p> : null}
                <ButtonLink to={`/company/${company.id}`} variant="secondary" size="sm" fullWidth className="mt-4">
                  {t('job.companyJobs')}
                </ButtonLink>
              </Card>
            ) : null}

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name} src={user?.avatar} size={38} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{user?.name ?? 'LocalJob'}</p>
                  <p className="text-xs text-subtle">{t('dashboard.subtitle')}</p>
                </div>
              </div>
              <ButtonLink to={user ? '/dashboard' : '/register'} variant="secondary" size="sm" fullWidth className="mt-4">
                {user ? t('nav.dashboard') : t('nav.createAccount')}
              </ButtonLink>
            </Card>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft size={15} /> {t('job.back')}
            </button>
          </aside>
        </div>
      </div>

      <ApplyModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onApplied={() => setJob({ ...job, hasApplied: true, canApply: false })}
      />
    </div>
  )
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-fg">{title}</h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-muted">
        <span className="text-subtle">{icon}</span>
        {label}
      </dt>
      <dd className="text-right font-medium text-fg">{value}</dd>
    </div>
  )
}
