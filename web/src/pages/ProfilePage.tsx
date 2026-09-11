import { useEffect, useState } from 'react'
import { Briefcase, GraduationCap, Link2, Plus, Save, Sparkles, Trash2, UserRound } from 'lucide-react'
import type { EducationItem, ExperienceItem, Profile } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { Avatar, Badge, Progress } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/field'
import { Card, SectionHeading, Skeleton } from '@/components/ui/misc'
import { useMeta } from '@/hooks/useMeta'
import { EXPERIENCE_LEVELS, experienceLabel, formatDate, roleLabel } from '@/lib/utils'

export default function ProfilePage() {
  const { t, lang } = useLanguage()
  const { user, setUser, setProfileState, completion } = useAuth()
  const toast = useToast()
  const { meta } = useMeta()

  const loaded = useAsync(() => backend.profile(), [user?.id])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState(user?.name ?? '')
  const [skillDraft, setSkillDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [experienceDraft, setExperienceDraft] = useState<ExperienceItem>({ role: '', company: '', from: '', to: '', description: '' })
  const [educationDraft, setEducationDraft] = useState<EducationItem>({ degree: '', school: '', from: '', to: '' })
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [showEducationForm, setShowEducationForm] = useState(false)

  useEffect(() => {
    if (loaded.data) {
      setProfile(loaded.data.profile)
      setName(loaded.data.user.name)
    }
  }, [loaded.data])

  const patch = (changes: Partial<Profile>) => setProfile((current) => (current ? { ...current, ...changes } : current))

  const addSkill = () => {
    const value = skillDraft.trim()
    if (!value || !profile) return
    if (profile.skills.includes(value)) {
      setSkillDraft('')
      return
    }
    patch({ skills: [...profile.skills, value] })
    setSkillDraft('')
  }

  const save = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const result = await backend.updateProfile({
        name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        category: profile.category,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        languages: profile.languages,
        portfolio: profile.portfolio,
        linkedin: profile.linkedin,
        github: profile.github,
        telegram: profile.telegram,
        expected_salary: profile.expectedSalary,
        experience_level: profile.experienceLevel,
      })
      setProfile(result.profile)
      setUser(result.user)
      setProfileState(result.profile)
      toast.success(t('profile.saved'), t('profile.completion', { percent: result.completion }))
      void loaded.reload()
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setSaving(false)
    }
  }

  if (loaded.loading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  const percent = loaded.data?.completion ?? completion

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={name} src={user?.avatar} size={76} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-fg">{name || user?.name}</h1>
            <p className="mt-1 text-sm text-muted">{profile.title || t('profile.professionalTitle')}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Badge tone="primary">{user ? roleLabel(user.role, lang) : ''}</Badge>
              {profile.category ? <Badge tone="accent">{profile.category}</Badge> : null}
              {profile.experienceLevel ? <Badge>{experienceLabel(profile.experienceLevel, lang)}</Badge> : null}
              <Badge>
                {t('profile.memberSince')}: {formatDate(user?.createdAt, lang)}
              </Badge>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">{t('dash.completion')}</p>
              <span className="text-sm font-bold text-fg">{percent}%</span>
            </div>
            <Progress value={percent} className="mt-2.5" />
            <p className="mt-2 text-xs leading-relaxed text-muted">{t('profile.completionHint')}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading title={t('profile.title')} subtitle={t('profile.completion', { percent })} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input label={t('auth.fullName')} value={name} onChange={(event) => setName(event.target.value)} />
          <Input
            label={t('profile.professionalTitle')}
            value={profile.title ?? ''}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="Frontend Developer (React / TypeScript)"
          />
          <Select
            label={t('profile.location')}
            value={profile.location ?? ''}
            onChange={(event) => patch({ location: event.target.value })}
            placeholder="—"
            options={(meta?.locations ?? []).map((item) => ({ value: item, label: item }))}
          />
          <Input
            label={t('auth.phone')}
            value={profile.phone ?? ''}
            onChange={(event) => patch({ phone: event.target.value })}
            placeholder="+998 90 123 45 67"
          />
          <Select
            label={t('profile.category')}
            value={profile.category ?? ''}
            onChange={(event) => patch({ category: event.target.value })}
            placeholder="—"
            options={(meta?.categories ?? []).map((item) => ({ value: item, label: item }))}
          />
          <Select
            label={t('profile.experienceLevel')}
            value={profile.experienceLevel ?? ''}
            onChange={(event) => patch({ experienceLevel: event.target.value })}
            placeholder="—"
            options={EXPERIENCE_LEVELS.map((item) => ({ value: item, label: experienceLabel(item, lang) }))}
          />
          <Input
            label={`${t('profile.expectedSalary')} (UZS)`}
            type="number"
            inputMode="numeric"
            value={profile.expectedSalary ?? ''}
            onChange={(event) => patch({ expectedSalary: event.target.value ? Number(event.target.value) : null })}
          />
          <Input
            label={t('profile.languages')}
            value={profile.languages.join(', ')}
            onChange={(event) =>
              patch({ languages: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })
            }
            placeholder="Uzbek (native), English (B2)"
          />
        </div>
        <div className="mt-4">
          <Textarea
            label={t('profile.about')}
            value={profile.bio ?? ''}
            onChange={(event) => patch({ bio: event.target.value })}
            rows={4}
            maxLength={800}
            counter
            placeholder={t('profile.about')}
          />
        </div>
      </Card>

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
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card-2 px-3 py-1.5 text-xs font-medium text-fg"
            >
              {skill}
              <button
                type="button"
                onClick={() => patch({ skills: profile.skills.filter((item) => item !== skill) })}
                aria-label={`${t('common.remove')} ${skill}`}
                className="text-subtle transition-colors hover:text-danger"
              >
                <Trash2 size={13} />
              </button>
            </span>
          ))}
          {profile.skills.length === 0 ? <p className="text-sm text-subtle">{t('profile.addSkill')}</p> : null}
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            value={skillDraft}
            onChange={(event) => setSkillDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addSkill()
              }
            }}
            placeholder="React, Figma, SMM…"
            aria-label={t('profile.addSkill')}
          />
          <Button variant="secondary" icon={<Plus size={15} />} onClick={addSkill}>
            {t('common.add')}
          </Button>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading
          title={
            <span className="inline-flex items-center gap-2">
              <Briefcase size={17} className="text-primary" /> {t('profile.experience')}
            </span>
          }
          action={
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setShowExperienceForm((value) => !value)}>
              {t('profile.addExperience')}
            </Button>
          }
        />
        <div className="mt-4 space-y-3">
          {profile.experience.map((item, index) => (
            <div key={`${item.role}-${index}`} className="flex items-start justify-between gap-3 rounded-md border border-line bg-card-2 p-3.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg">{item.role}</p>
                <p className="text-sm text-muted">{item.company}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {item.from} — {item.to || t('profile.present')}
                </p>
                {item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => patch({ experience: profile.experience.filter((_, position) => position !== index) })}
                className="rounded-md p-1.5 text-subtle transition-colors hover:bg-card hover:text-danger"
                aria-label={t('common.remove')}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {profile.experience.length === 0 ? <p className="text-sm text-subtle">{t('profile.addExperience')}</p> : null}
        </div>

        {showExperienceForm ? (
          <div className="mt-4 grid gap-3 rounded-md border border-line bg-card-2 p-4 sm:grid-cols-2">
            <Input
              label={t('profile.professionalTitle')}
              value={experienceDraft.role}
              onChange={(event) => setExperienceDraft({ ...experienceDraft, role: event.target.value })}
            />
            <Input
              label={t('job.company')}
              value={experienceDraft.company}
              onChange={(event) => setExperienceDraft({ ...experienceDraft, company: event.target.value })}
            />
            <Input
              label={t('profile.from')}
              type="month"
              value={experienceDraft.from}
              onChange={(event) => setExperienceDraft({ ...experienceDraft, from: event.target.value })}
            />
            <Input
              label={t('profile.to')}
              type="month"
              value={experienceDraft.to}
              onChange={(event) => setExperienceDraft({ ...experienceDraft, to: event.target.value })}
            />
            <div className="sm:col-span-2">
              <Textarea
                label={t('job.responsibilities')}
                rows={2}
                value={experienceDraft.description ?? ''}
                onChange={(event) => setExperienceDraft({ ...experienceDraft, description: event.target.value })}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button
                size="sm"
                onClick={() => {
                  if (!experienceDraft.role.trim() || !experienceDraft.company.trim()) return
                  patch({ experience: [...profile.experience, experienceDraft] })
                  setExperienceDraft({ role: '', company: '', from: '', to: '', description: '' })
                  setShowExperienceForm(false)
                }}
              >
                {t('common.add')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowExperienceForm(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading
          title={
            <span className="inline-flex items-center gap-2">
              <GraduationCap size={17} className="text-primary" /> {t('profile.education')}
            </span>
          }
          action={
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setShowEducationForm((value) => !value)}>
              {t('profile.addEducation')}
            </Button>
          }
        />
        <div className="mt-4 space-y-3">
          {profile.education.map((item, index) => (
            <div key={`${item.degree}-${index}`} className="flex items-start justify-between gap-3 rounded-md border border-line bg-card-2 p-3.5">
              <div>
                <p className="text-sm font-semibold text-fg">{item.degree}</p>
                <p className="text-sm text-muted">{item.school}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {item.from} — {item.to}
                </p>
              </div>
              <button
                type="button"
                onClick={() => patch({ education: profile.education.filter((_, position) => position !== index) })}
                className="rounded-md p-1.5 text-subtle transition-colors hover:bg-card hover:text-danger"
                aria-label={t('common.remove')}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {profile.education.length === 0 ? <p className="text-sm text-subtle">{t('profile.addEducation')}</p> : null}
        </div>

        {showEducationForm ? (
          <div className="mt-4 grid gap-3 rounded-md border border-line bg-card-2 p-4 sm:grid-cols-2">
            <Input
              label={t('profile.education')}
              value={educationDraft.degree}
              onChange={(event) => setEducationDraft({ ...educationDraft, degree: event.target.value })}
            />
            <Input
              label={t('job.company')}
              value={educationDraft.school}
              onChange={(event) => setEducationDraft({ ...educationDraft, school: event.target.value })}
            />
            <Input
              label={t('profile.from')}
              value={educationDraft.from}
              onChange={(event) => setEducationDraft({ ...educationDraft, from: event.target.value })}
            />
            <Input
              label={t('profile.to')}
              value={educationDraft.to}
              onChange={(event) => setEducationDraft({ ...educationDraft, to: event.target.value })}
            />
            <div className="flex gap-2 sm:col-span-2">
              <Button
                size="sm"
                onClick={() => {
                  if (!educationDraft.degree.trim() || !educationDraft.school.trim()) return
                  patch({ education: [...profile.education, educationDraft] })
                  setEducationDraft({ degree: '', school: '', from: '', to: '' })
                  setShowEducationForm(false)
                }}
              >
                {t('common.add')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowEducationForm(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading
          title={
            <span className="inline-flex items-center gap-2">
              <Link2 size={17} className="text-primary" /> {t('profile.portfolio')}
            </span>
          }
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Portfolio"
            value={profile.portfolio ?? ''}
            onChange={(event) => patch({ portfolio: event.target.value })}
            placeholder="https://aziz.dev"
          />
          <Input
            label="GitHub"
            value={profile.github ?? ''}
            onChange={(event) => patch({ github: event.target.value })}
            placeholder="https://github.com/…"
          />
          <Input
            label="LinkedIn"
            value={profile.linkedin ?? ''}
            onChange={(event) => patch({ linkedin: event.target.value })}
            placeholder="https://linkedin.com/in/…"
          />
          <Input
            label="Telegram"
            value={profile.telegram ?? ''}
            onChange={(event) => patch({ telegram: event.target.value })}
            placeholder="https://t.me/…"
          />
        </div>
      </Card>

      <div className="sticky bottom-20 z-30 lg:bottom-4">
        <div className="lj-card flex items-center justify-between gap-3 p-3.5">
          <p className="hidden text-sm text-muted sm:block">
            <UserRound size={14} className="mr-1.5 inline" />
            {t('profile.completion', { percent })}
          </p>
          <Button onClick={() => void save()} loading={saving} icon={<Save size={16} />} className="w-full sm:w-auto">
            {t('profile.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
