import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, GraduationCap, Mail, MapPin, Phone, Sparkles, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { experienceLabel, formatDate, roleLabel } from '@/lib/utils'
import { Avatar, Badge, Progress } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, EmptyState, SectionHeading, Skeleton } from '@/components/ui/misc'

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const candidate = useAsync(() => backend.candidate(Number(id)), [id])

  if (candidate.loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!candidate.data) {
    return (
      <EmptyState
        title={t('error.unauthorized')}
        description={t('common.notFoundText')}
        actionLabel={t('common.back')}
        onAction={() => navigate(-1)}
      />
    )
  }

  const { user, profile, completion, hiredCount } = candidate.data

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate(-1)}>
        {t('common.back')}
      </Button>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={user.name} src={user.avatar} size={72} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-fg">{user.name}</h1>
            <p className="mt-1 text-sm text-muted">{profile?.title ?? roleLabel(user.role, lang)}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Badge tone="primary">{roleLabel(user.role, lang)}</Badge>
              {profile?.experienceLevel ? <Badge tone="accent">{experienceLabel(profile.experienceLevel, lang)}</Badge> : null}
              {hiredCount > 0 ? (
                <Badge tone="success" icon={<Star size={12} />}>
                  {hiredCount}× {t('emp.hired')}
                </Badge>
              ) : null}
              <Badge>{formatDate(user.createdAt, lang)}</Badge>
            </div>
          </div>
          <div className="w-full sm:w-52">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">{t('dash.completion')}</p>
              <span className="text-sm font-bold text-fg">{completion}%</span>
            </div>
            <Progress value={completion} className="mt-2.5" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <Mail size={15} className="text-subtle" /> {user.email}
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <Phone size={15} className="text-subtle" /> {user.phone ?? profile?.phone ?? '—'}
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <MapPin size={15} className="text-subtle" /> {profile?.location ?? user.location ?? '—'}
          </span>
        </div>
      </Card>

      {profile?.bio ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading title={t('profile.about')} />
          <p className="mt-3 text-sm leading-relaxed text-muted">{profile.bio}</p>
        </Card>
      ) : null}

      {profile?.skills?.length ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <Sparkles size={17} className="text-accent" /> {t('profile.skills')}
              </span>
            }
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="lj-chip">
                {skill}
              </span>
            ))}
          </div>
        </Card>
      ) : null}

      {profile?.experience?.length ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <Briefcase size={17} className="text-primary" /> {t('profile.experience')}
              </span>
            }
          />
          <div className="mt-4 space-y-3">
            {profile.experience.map((item, index) => (
              <div key={`${item.role}-${index}`} className="rounded-md border border-line bg-card-2 p-3.5">
                <p className="text-sm font-semibold text-fg">{item.role}</p>
                <p className="text-sm text-muted">{item.company}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {item.from} — {item.to || t('profile.present')}
                </p>
                {item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile?.education?.length ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={17} className="text-primary" /> {t('profile.education')}
              </span>
            }
          />
          <div className="mt-4 space-y-3">
            {profile.education.map((item, index) => (
              <div key={`${item.degree}-${index}`} className="rounded-md border border-line bg-card-2 p-3.5">
                <p className="text-sm font-semibold text-fg">{item.degree}</p>
                <p className="text-sm text-muted">{item.school}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {item.from} — {item.to}
                </p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
