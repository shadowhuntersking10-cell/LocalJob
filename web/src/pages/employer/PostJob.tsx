import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Plus, Rocket, Save, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { useMeta } from '@/hooks/useMeta'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox, Input, Select, Textarea } from '@/components/ui/field'
import { Card, SectionHeading, Skeleton } from '@/components/ui/misc'

interface JobForm {
  title: string
  category: string
  companyName: string
  location: string
  isRemote: boolean
  salaryMin: string
  salaryMax: string
  currency: string
  employmentType: string
  experienceLevel: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  skills: string[]
}

const EMPTY: JobForm = {
  title: '',
  category: '',
  companyName: '',
  location: '',
  isRemote: false,
  salaryMin: '',
  salaryMax: '',
  currency: 'UZS',
  employmentType: 'Full-time',
  experienceLevel: 'Middle',
  description: '',
  responsibilities: [''],
  requirements: [''],
  benefits: [''],
  skills: [],
}

export default function PostJob() {
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)
  const { t, lang } = useLanguage()
  const { user, company } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { meta } = useMeta()

  const [form, setForm] = useState<JobForm>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(editing)
  const [submitting, setSubmitting] = useState(false)
  const [skillDraft, setSkillDraft] = useState('')

  useEffect(() => {
    setForm((current) => ({ ...current, companyName: company?.name ?? current.companyName }))
  }, [company])

  useEffect(() => {
    if (!editing || !id) return
    let active = true
    backend
      .job(Number(id))
      .then((job) => {
        if (!active) return
        setForm({
          title: job.title,
          category: job.category,
          companyName: job.company?.name ?? '',
          location: job.location,
          isRemote: Boolean(job.isRemote),
          salaryMin: job.salaryMin ? String(job.salaryMin) : '',
          salaryMax: job.salaryMax ? String(job.salaryMax) : '',
          currency: job.currency || 'UZS',
          employmentType: String(job.employmentType),
          experienceLevel: String(job.experienceLevel),
          description: job.description ?? '',
          responsibilities: job.responsibilities?.length ? job.responsibilities : [''],
          requirements: job.requirements?.length ? job.requirements : [''],
          benefits: job.benefits?.length ? job.benefits : [''],
          skills: job.skills ?? [],
        })
      })
      .catch(() => toast.error(t('error.jobNotFound')))
      .finally(() => setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, id])

  const setList = (key: 'responsibilities' | 'requirements' | 'benefits', index: number, value: string) =>
    setForm((current) => {
      const next = [...current[key]]
      next[index] = value
      return { ...current, [key]: next }
    })

  const addListRow = (key: 'responsibilities' | 'requirements' | 'benefits') =>
    setForm((current) => ({ ...current, [key]: [...current[key], ''] }))

  const removeListRow = (key: 'responsibilities' | 'requirements' | 'benefits', index: number) =>
    setForm((current) => ({ ...current, [key]: current[key].filter((_, position) => position !== index) }))

  const validate = () => {
    const next: Record<string, string> = {}
    if (form.title.trim().length < 3) next.title = t('error.required')
    if (!form.category) next.category = t('error.required')
    if (!form.location.trim()) next.location = t('error.required')
    if (form.description.trim().length < 20) next.description = t('error.required')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (status: 'active' | 'paused') => {
    if (!validate()) {
      toast.error(t('error.generic'), t('post.subtitle'))
      return
    }
    setSubmitting(true)
    const payload = {
      title: form.title.trim(),
      category: form.category,
      company_name: form.companyName || company?.name || user?.name,
      location: form.isRemote ? 'Remote' : form.location,
      is_remote: form.isRemote,
      salary_min: form.salaryMin ? Number(form.salaryMin) : null,
      salary_max: form.salaryMax ? Number(form.salaryMax) : null,
      currency: form.currency,
      employment_type: form.employmentType,
      experience_level: form.experienceLevel,
      description: form.description.trim(),
      responsibilities: form.responsibilities.map((item) => item.trim()).filter(Boolean),
      requirements: form.requirements.map((item) => item.trim()).filter(Boolean),
      benefits: form.benefits.map((item) => item.trim()).filter(Boolean),
      skills: form.skills,
      status,
    }

    try {
      if (editing && id) {
        await backend.updateJob(Number(id), payload)
        toast.success(t('emp.updated'))
      } else {
        const created = await backend.createJob(payload)
        if (status === 'paused' && created?.id) {
          // "save as draft" creates the listing, then parks it
          await backend.updateJob(created.id, { status: 'paused' })
        }
        toast.success(status === 'paused' ? t('emp.paused') : t('post.published'), t('post.subtitle'))
      }
      navigate('/employer/jobs')
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {editing ? t('emp.edit') : t('post.title')}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{t('post.subtitle')}</p>
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/employer/jobs')}>
          {t('common.back')}
        </Button>
      </div>

      <Card className="p-5 sm:p-6">
        <SectionHeading title={t('post.step.basics')} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label={t('post.jobTitle')}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              error={errors.title}
              required
              placeholder={t('post.jobTitlePlaceholder')}
            />
          </div>
          <Select
            label={t('post.category')}
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            error={errors.category}
            required
            placeholder="—"
            options={(meta?.categories ?? []).map((item) => ({ value: item, label: item }))}
          />
          <Input
            label={t('post.company')}
            value={form.companyName}
            onChange={(event) => setForm({ ...form, companyName: event.target.value })}
            placeholder="TechNova Solutions"
          />
          <Input
            label={t('post.location')}
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            error={errors.location}
            required
            disabled={form.isRemote}
            list="post-job-locations"
            placeholder="Tashkent"
          />
          <datalist id="post-job-locations">
            {(meta?.locations ?? []).map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <div className="flex items-end">
            <Checkbox
              checked={form.isRemote}
              onChange={(checked) => setForm({ ...form, isRemote: checked })}
              label={t('post.remote')}
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading title={t('post.step.details')} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input
            label={t('post.salaryMin')}
            type="number"
            inputMode="numeric"
            value={form.salaryMin}
            onChange={(event) => setForm({ ...form, salaryMin: event.target.value })}
          />
          <Input
            label={t('post.salaryMax')}
            type="number"
            inputMode="numeric"
            value={form.salaryMax}
            onChange={(event) => setForm({ ...form, salaryMax: event.target.value })}
          />
          <Select
            label={t('post.currency')}
            value={form.currency}
            onChange={(event) => setForm({ ...form, currency: event.target.value })}
            options={(meta?.currencies ?? ['UZS', 'USD', 'EUR']).map((item) => ({ value: item, label: item }))}
          />
          <Select
            label={t('post.employmentType')}
            value={form.employmentType}
            onChange={(event) => setForm({ ...form, employmentType: event.target.value })}
            options={EMPLOYMENT_TYPES.map((item) => ({ value: item, label: item }))}
          />
          <Select
            label={t('post.experience')}
            value={form.experienceLevel}
            onChange={(event) => setForm({ ...form, experienceLevel: event.target.value })}
            options={EXPERIENCE_LEVELS.map((item) => ({ value: item, label: item }))}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label={t('post.description')}
            hint={t('post.descriptionHint')}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            error={errors.description}
            rows={6}
            maxLength={2400}
            counter
            required
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading title={t('post.step.requirements')} />
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <ListEditor
            title={t('post.responsibilities')}
            items={form.responsibilities}
            onChange={(index, value) => setList('responsibilities', index, value)}
            onAdd={() => addListRow('responsibilities')}
            onRemove={(index) => removeListRow('responsibilities', index)}
            addLabel={t('post.addLine')}
          />
          <ListEditor
            title={t('post.requirements')}
            items={form.requirements}
            onChange={(index, value) => setList('requirements', index, value)}
            onAdd={() => addListRow('requirements')}
            onRemove={(index) => removeListRow('requirements', index)}
            addLabel={t('post.addLine')}
          />
          <ListEditor
            title={t('post.benefits')}
            items={form.benefits}
            onChange={(index, value) => setList('benefits', index, value)}
            onAdd={() => addListRow('benefits')}
            onRemove={(index) => removeListRow('benefits', index)}
            addLabel={t('post.addLine')}
          />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-fg">{t('post.skills')}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card-2 px-3 py-1.5 text-xs font-medium text-fg"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, skills: form.skills.filter((item) => item !== skill) })}
                  className="text-subtle transition-colors hover:text-danger"
                  aria-label={`${t('common.remove')} ${skill}`}
                >
                  <Trash2 size={13} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex max-w-lg gap-2">
            <Input
              value={skillDraft}
              onChange={(event) => setSkillDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  const value = skillDraft.trim()
                  if (value && !form.skills.includes(value)) setForm({ ...form, skills: [...form.skills, value] })
                  setSkillDraft('')
                }
              }}
              placeholder="React, FastAPI, Figma…"
              aria-label={t('post.addSkill')}
            />
            <Button
              variant="secondary"
              icon={<Plus size={15} />}
              onClick={() => {
                const value = skillDraft.trim()
                if (value && !form.skills.includes(value)) setForm({ ...form, skills: [...form.skills, value] })
                setSkillDraft('')
              }}
            >
              {t('common.add')}
            </Button>
          </div>
        </div>
      </Card>

      <div className="sticky bottom-20 z-30 lg:bottom-4">
        <Card className="flex flex-wrap items-center justify-between gap-3 p-3.5">
          <p className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <CheckCircle2 size={15} className="text-success" />
            {t('post.subtitle')}
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button variant="secondary" onClick={() => void submit('paused')} disabled={submitting} icon={<Save size={15} />}>
              {t('post.saveDraft')}
            </Button>
            <Button onClick={() => void submit('active')} loading={submitting} icon={<Rocket size={15} />}>
              {t('post.publish')}
            </Button>
          </div>
        </Card>
      </div>
      {lang ? null : null}
    </div>
  )
}

function ListEditor({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
  addLabel,
}: {
  title: string
  items: string[]
  onChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  addLabel: string
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <Input value={item} onChange={(event) => onChange(index, event.target.value)} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              aria-label="Remove row"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="mt-2" icon={<Plus size={14} />} onClick={onAdd}>
        {addLabel}
      </Button>
    </div>
  )
}
