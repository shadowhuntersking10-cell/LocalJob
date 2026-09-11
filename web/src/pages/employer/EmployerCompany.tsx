import { useEffect, useState } from 'react'
import { Building2, Globe, MapPin, Save, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { Card, SectionHeading } from '@/components/ui/misc'
import { Button, ButtonLink } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/field'
import { CompanyLogo } from '@/components/ui/badge'
import { useMeta } from '@/hooks/useMeta'

export default function EmployerCompany() {
  const { t } = useLanguage()
  const { company, setCompany, user } = useAuth()
  const toast = useToast()
  const { meta } = useMeta()

  const [form, setForm] = useState({
    name: company?.name ?? '',
    industry: company?.industry ?? '',
    location: company?.location ?? '',
    size: company?.size ?? '',
    website: company?.website ?? '',
    about: company?.about ?? '',
    logo: company?.logo ?? '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!company) return
    setForm({
      name: company.name,
      industry: company.industry ?? '',
      location: company.location ?? '',
      size: company.size ?? '',
      website: company.website ?? '',
      about: company.about ?? '',
      logo: company.logo ?? '',
    })
  }, [company])

  const save = async () => {
    setSaving(true)
    try {
      const result = await backend.saveCompany(form)
      setCompany(result.company)
      toast.success(t('emp.companySaved'))
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setSaving(false)
    }
  }

  const sizes = ['1-10 employees', '10-25 employees', '25-50 employees', '50-100 employees', '100-250 employees', '250-500 employees', '500+ employees']

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('emp.companyProfile')}</h1>
          <p className="mt-1.5 text-sm text-muted">{t('company.about')}</p>
        </div>
        {company ? (
          <ButtonLink to={`/company/${company.id}`} variant="secondary" size="sm">
            {t('emp.view')}
          </ButtonLink>
        ) : null}
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <CompanyLogo name={form.name || user?.name} logo={form.logo} color={company?.color} size={56} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg">{form.name || user?.name}</p>
            <p className="text-xs text-subtle">{form.industry || t('job.industry')}</p>
          </div>
        </div>

        <SectionHeading title={t('company.about')} className="mt-6" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label={t('post.company')} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input
            label={t('job.industry')}
            value={form.industry}
            onChange={(event) => setForm({ ...form, industry: event.target.value })}
            placeholder="Software Development"
          />
          <Select
            label={t('jobs.location')}
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            placeholder="—"
            options={(meta?.locations ?? []).map((item) => ({ value: item, label: item }))}
          />
          <Select
            label={t('job.size')}
            value={form.size}
            onChange={(event) => setForm({ ...form, size: event.target.value })}
            placeholder="—"
            options={sizes.map((item) => ({ value: item, label: item }))}
          />
          <Input
            label={t('job.website')}
            value={form.website}
            onChange={(event) => setForm({ ...form, website: event.target.value })}
            placeholder="https://technova.uz"
          />
          <Input
            label="Logo (2-3 harf)"
            value={form.logo}
            onChange={(event) => setForm({ ...form, logo: event.target.value.slice(0, 3).toUpperCase() })}
            placeholder="TN"
          />
        </div>
        <div className="mt-4">
          <Textarea
            label={t('company.about')}
            rows={5}
            value={form.about}
            onChange={(event) => setForm({ ...form, about: event.target.value })}
            maxLength={1200}
            counter
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={() => void save()} loading={saving} icon={<Save size={16} />}>
            {t('common.save')}
          </Button>
          <span className="lj-chip">
            <MapPin size={13} /> {form.location || '—'}
          </span>
          <span className="lj-chip">
            <Users size={13} /> {form.size || '—'}
          </span>
          <span className="lj-chip">
            <Globe size={13} /> {form.website ? form.website.replace(/^https?:\/\//, '') : '—'}
          </span>
          <span className="lj-chip">
            <Building2 size={13} /> LocalJob
          </span>
        </div>
      </Card>
    </div>
  )
}
