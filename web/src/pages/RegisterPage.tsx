import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Search, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/services/backend'
import { cn, isEmail } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox, Input, Select } from '@/components/ui/field'
import { useMeta } from '@/hooks/useMeta'

export default function RegisterPage() {
  const { t, lang } = useLanguage()
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { meta } = useMeta()

  const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
  })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = t('error.required')
    if (!form.email.trim()) next.email = t('error.required')
    else if (!isEmail(form.email)) next.email = t('error.email')
    if (!form.password) next.password = t('error.required')
    else if (form.password.length < 8) next.password = t('error.passwordLength')
    if (form.password !== form.confirmPassword) next.confirmPassword = t('error.passwordMatch')
    if (!agree) next.agree = t('error.terms')
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const session = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role,
        phone: form.phone || null,
        location: form.location || null,
        language: lang,
      })
      toast.success(t('auth.registered'), role === 'employer' ? t('emp.subtitle') : t('dash.subtitle'))
      navigate(role === 'employer' ? '/employer' : '/dashboard', { replace: true })
      void session
    } catch (error) {
      const code = error instanceof ApiError ? error.code : 'generic'
      if (code === 'email_already_registered') {
        setErrors({ email: t('error.emailInUse') })
        toast.error(t('error.emailInUse'))
      } else if (code === 'password_too_short') toast.error(t('error.passwordLength'))
      else if (code === 'passwords_do_not_match') toast.error(t('error.passwordMatch'))
      else toast.error(t('error.generic'))
    } finally {
      setLoading(false)
    }
  }

  const accountTypes = [
    {
      value: 'job_seeker' as const,
      icon: <Search size={18} />,
      title: t('auth.jobSeeker'),
      description: t('auth.jobSeekerDesc'),
    },
    {
      value: 'employer' as const,
      icon: <BriefcaseBusiness size={18} />,
      title: t('auth.employer'),
      description: t('auth.employerDesc'),
    },
  ]

  return (
    <div className="lj-card p-6 sm:p-7">
      <h1 className="text-xl font-bold tracking-tight text-fg">{t('auth.registerTitle')}</h1>
      <p className="mt-1.5 text-sm text-muted">{t('auth.registerSubtitle')}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <fieldset>
          <legend className="lj-label">{t('auth.accountType')}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {accountTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setRole(type.value)}
                aria-pressed={role === type.value}
                className={cn(
                  'rounded-lg border p-3.5 text-left transition-all',
                  role === type.value
                    ? 'border-primary bg-primary/[0.07] ring-2 ring-primary/20'
                    : 'border-line bg-card hover:border-line-strong',
                )}
              >
                <span
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-md',
                    role === type.value ? 'bg-primary text-primary-fg' : 'bg-card-2 text-muted',
                  )}
                >
                  {type.icon}
                </span>
                <span className="mt-2.5 block text-sm font-semibold text-fg">{type.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">{type.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <Input
          label={t('auth.fullName')}
          value={form.name}
          onChange={update('name')}
          error={errors.name}
          required
          autoComplete="name"
          placeholder="Aziz Karimov"
        />
        <Input
          label={t('auth.email')}
          type="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('auth.password')}
            type="password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            required
            autoComplete="new-password"
            hint="min 8"
          />
          <Input
            label={t('auth.confirmPassword')}
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('auth.phone')}
            value={form.phone}
            onChange={update('phone')}
            autoComplete="tel"
            placeholder="+998 90 123 45 67"
          />
          <Select
            label={t('auth.location')}
            value={form.location}
            onChange={update('location')}
            placeholder="—"
            options={(meta?.locations ?? []).map((item) => ({ value: item, label: item }))}
          />
        </div>

        <Checkbox
          checked={agree}
          onChange={setAgree}
          error={errors.agree}
          label={
            <>
              {t('auth.agree')} ·{' '}
              <Link to="/terms" className="lj-link">
                {t('footer.terms')}
              </Link>{' '}
              ·{' '}
              <Link to="/privacy" className="lj-link">
                {t('footer.privacy')}
              </Link>
            </>
          }
        />

        <Button type="submit" fullWidth loading={loading} icon={<UserPlus size={16} />}>
          {t('auth.registerButton')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="lj-link font-medium">
          {t('nav.signIn')}
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-subtle">{t('auth.termsNote')}</p>
    </div>
  )
}
