import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Bell, Download, KeyRound, LogOut, Shield, Trash2, UserCog } from 'lucide-react'
import type { NotificationPreferences } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { Card, SectionHeading } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { Input, Select, Switch } from '@/components/ui/field'
import { ConfirmDialog } from '@/components/ui/modal'
import { Tabs } from '@/components/ui/misc'
import { useMeta } from '@/hooks/useMeta'
import { cn } from '@/lib/utils'

const DEFAULT_PREFS: NotificationPreferences = {
  emailApplications: true,
  emailJobs: true,
  telegramNotifications: true,
  profileVisible: true,
  showSalary: true,
}

export default function SettingsPage() {
  const { t, lang, setLang, languages } = useLanguage()
  const { user, setUser, logout, mode } = useAuth()
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()
  const { meta } = useMeta()

  const [tab, setTab] = useState('account')
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', location: user?.location ?? '' })
  const [savingAccount, setSavingAccount] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    backend
      .preferences()
      .then((result) => setPrefs({ ...DEFAULT_PREFS, ...result.preferences }))
      .catch(() => undefined)
  }, [])

  const saveAccount = async () => {
    setSavingAccount(true)
    try {
      const result = await backend.updateSettings({ name: form.name, phone: form.phone, location: form.location, theme, language: lang })
      setUser(result.user)
      toast.success(t('settings.saved'))
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setSavingAccount(false)
    }
  }

  const changePassword = async () => {
    if (passwords.next.length < 8) {
      toast.error(t('error.passwordLength'))
      return
    }
    if (passwords.next !== passwords.confirm) {
      toast.error(t('error.passwordMatch'))
      return
    }
    setSavingPassword(true)
    try {
      await backend.changePassword({ current_password: passwords.current, new_password: passwords.next })
      setPasswords({ current: '', next: '', confirm: '' })
      toast.success(t('settings.passwordChanged'))
    } catch {
      toast.error(t('error.invalidCredentials'))
    } finally {
      setSavingPassword(false)
    }
  }

  const updatePrefs = async (patch: Partial<NotificationPreferences>) => {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    try {
      await backend.updatePreferences(patch)
      toast.success(t('settings.saved'))
    } catch {
      toast.error(t('error.generic'))
    }
  }

  const exportData = async () => {
    try {
      const data = await backend.profile()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `localjob-profile-${user?.id}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success(t('settings.exportDone'))
    } catch {
      toast.error(t('error.generic'))
    }
  }

  const removeAccount = async () => {
    setDeleting(true)
    try {
      await backend.deleteAccount(deletePassword)
      toast.success(t('settings.deleteAccount'))
      await logout()
      navigate('/')
    } catch {
      toast.error(t('error.invalidCredentials'))
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('settings.title')}</h1>
        <p className="mt-1.5 text-sm text-muted">{t('settings.subtitle')}</p>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'account', label: t('settings.account') },
          { value: 'password', label: t('settings.password') },
          { value: 'notifications', label: t('settings.notifications') },
          { value: 'privacy', label: t('settings.privacy') },
        ]}
      />

      {tab === 'account' ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <UserCog size={17} className="text-primary" /> {t('settings.account')}
              </span>
            }
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label={t('auth.fullName')} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label={t('auth.email')} value={user?.email ?? ''} disabled />
            <Input label={t('auth.phone')} value={form.phone ?? ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Select
              label={t('auth.location')}
              value={form.location ?? ''}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              placeholder="—"
              options={(meta?.locations ?? []).map((item) => ({ value: item, label: item }))}
            />
            <Select
              label={t('nav.language')}
              value={lang}
              onChange={(event) => setLang(event.target.value as typeof lang)}
              options={languages.map((item) => ({ value: item.code, label: `${item.flag} ${item.label}` }))}
            />
            <Select
              label={t('nav.theme')}
              value={theme}
              onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
              options={[
                { value: 'dark', label: t('nav.darkTheme') },
                { value: 'light', label: t('nav.lightTheme') },
              ]}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={() => void saveAccount()} loading={savingAccount}>
              {t('common.save')}
            </Button>
            <span className={cn('lj-chip', mode === 'offline' && 'border-warning/40 text-warning')}>
              {mode === 'offline' ? t('common.offlineMode') : t('common.onlineMode')}
            </span>
            <span className="lj-chip">
              {user?.telegramId ? t('settings.telegramLinked') : t('settings.telegramNotLinked')} · @{meta?.app.botUsername}
            </span>
          </div>
        </Card>
      ) : null}

      {tab === 'password' ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <KeyRound size={17} className="text-primary" /> {t('settings.password')}
              </span>
            }
            subtitle={t('settings.deleteWarning').split('.')[0]}
          />
          <div className="mt-5 grid max-w-lg gap-4">
            <Input
              label={t('settings.currentPassword')}
              type="password"
              value={passwords.current}
              onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
              autoComplete="current-password"
            />
            <Input
              label={t('settings.newPassword')}
              type="password"
              value={passwords.next}
              onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
              autoComplete="new-password"
              hint="min 8"
            />
            <Input
              label={t('settings.confirmNewPassword')}
              type="password"
              value={passwords.confirm}
              onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
              autoComplete="new-password"
            />
            <div>
              <Button onClick={() => void changePassword()} loading={savingPassword} icon={<KeyRound size={15} />}>
                {t('settings.updatePassword')}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {tab === 'notifications' ? (
        <Card className="p-5 sm:p-6">
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <Bell size={17} className="text-primary" /> {t('settings.notifications')}
              </span>
            }
          />
          <div className="mt-4 max-w-xl divide-y divide-line">
            <Switch
              checked={prefs.emailApplications}
              onChange={(checked) => void updatePrefs({ emailApplications: checked })}
              label={t('settings.notifApplications')}
              description={t('settings.notifJobs')}
            />
            <Switch
              checked={prefs.emailJobs}
              onChange={(checked) => void updatePrefs({ emailJobs: checked })}
              label={t('settings.notifJobs')}
              description={t('dash.recommended')}
            />
            <Switch
              checked={prefs.telegramNotifications}
              onChange={(checked) => void updatePrefs({ telegramNotifications: checked })}
              label={t('settings.notifTelegram')}
              description={t('settings.telegramHint')}
            />
          </div>
        </Card>
      ) : null}

      {tab === 'privacy' ? (
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <SectionHeading
              title={
                <span className="inline-flex items-center gap-2">
                  <Shield size={17} className="text-primary" /> {t('settings.privacy')}
                </span>
              }
            />
            <div className="mt-4 max-w-xl divide-y divide-line">
              <Switch
                checked={prefs.profileVisible}
                onChange={(checked) => void updatePrefs({ profileVisible: checked })}
                label={t('settings.privacyProfile')}
              />
              <Switch
                checked={prefs.showSalary}
                onChange={(checked) => void updatePrefs({ showSalary: checked })}
                label={t('settings.privacySalary')}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" icon={<Download size={15} />} onClick={() => void exportData()}>
                {t('settings.exportData')}
              </Button>
              <Button variant="ghost" icon={<LogOut size={15} />} onClick={async () => { await logout(); navigate('/') }}>
                {t('nav.signOut')}
              </Button>
            </div>
          </Card>

          <Card className="border-danger/35 p-5 sm:p-6">
            <SectionHeading
              title={
                <span className="inline-flex items-center gap-2 text-danger">
                  <AlertTriangle size={17} /> {t('settings.dangerZone')}
                </span>
              }
              subtitle={t('settings.deleteWarning')}
            />
            <Button variant="danger" className="mt-4" icon={<Trash2 size={15} />} onClick={() => setDeleteOpen(true)}>
              {t('settings.deleteAccount')}
            </Button>
          </Card>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('settings.deleteAccount')}
        description={t('settings.deleteWarning')}
        confirmLabel={t('settings.deleteConfirm')}
        cancelLabel={t('common.cancel')}
        loading={deleting}
        onConfirm={() => void removeAccount()}
      />

      {deleteOpen ? (
        <div className="fixed inset-x-0 bottom-24 z-[95] mx-auto max-w-sm px-4 sm:bottom-6">
          <div className="lj-card p-3">
            <Input
              type="password"
              label={t('settings.currentPassword')}
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
