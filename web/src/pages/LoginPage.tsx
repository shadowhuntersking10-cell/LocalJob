import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck, UserCheck, UserCog } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/services/backend'
import { isEmail } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox, Input } from '@/components/ui/field'

export default function LoginPage() {
  const { t } = useLanguage()
  const { login, demoLogin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from

  const redirectFor = (role: string) => {
    if (from) return from
    if (role === 'employer') return '/employer'
    return '/dashboard'
  }

  const submit = async () => {
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = t('error.required')
    else if (!isEmail(email)) next.email = t('error.email')
    if (!password) next.password = t('error.required')
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const session = await login(email, password, remember)
      toast.success(t('auth.welcomeBack', { name: session.user.name.split(' ')[0] }))
      navigate(redirectFor(session.user.role), { replace: true })
    } catch (error) {
      const code = error instanceof ApiError ? error.code : 'generic'
      if (code === 'invalid_credentials') toast.error(t('error.invalidCredentials'))
      else if (code === 'account_disabled') toast.error(t('error.unauthorized'))
      else toast.error(t('error.generic'))
    } finally {
      setLoading(false)
    }
  }

  const runDemo = async (kind: 'seeker' | 'employer') => {
    setDemoLoading(kind)
    try {
      const session = await demoLogin(kind)
      toast.success(t('auth.welcomeBack', { name: session.user.name.split(' ')[0] }))
      navigate(kind === 'employer' ? '/employer' : '/dashboard', { replace: true })
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setDemoLoading(null)
    }
  }

  return (
    <div className="lj-card p-6 sm:p-7">
      <h1 className="text-xl font-bold tracking-tight text-fg">{t('auth.signInTitle')}</h1>
      <p className="mt-1.5 text-sm text-muted">{t('auth.signInSubtitle')}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
          placeholder="you@example.com"
        />
        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between gap-3">
          <Checkbox checked={remember} onChange={setRemember} label={t('auth.remember')} />
          <button
            type="button"
            onClick={() => toast.info(t('auth.forgot'), t('common.contactText'))}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t('auth.forgot')}
          </button>
        </div>

        <Button type="submit" fullWidth loading={loading} icon={<LogIn size={16} />}>
          {t('auth.signInButton')}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium uppercase tracking-wide text-subtle">{t('auth.demoAccounts')}</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<UserCheck size={15} />}
          loading={demoLoading === 'seeker'}
          onClick={() => void runDemo('seeker')}
        >
          {t('auth.demoSeeker')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<ShieldCheck size={15} />}
          loading={demoLoading === 'employer'}
          onClick={() => void runDemo('employer')}
        >
          {t('auth.demoEmployer')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="sm:col-span-2"
          icon={<UserCog size={15} />}
          onClick={() => {
            setEmail('admin@localjob.uz')
            setPassword('Admin1234!')
            toast.info(t('auth.demoAdmin'), 'admin@localjob.uz / Admin1234!')
          }}
        >
          {t('auth.demoAdmin')}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="lj-link font-medium">
          {t('nav.createAccount')}
        </Link>
      </p>
    </div>
  )
}
