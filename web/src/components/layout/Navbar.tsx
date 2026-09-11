import { useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  Building2,
  CheckCheck,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Settings,
  ShieldCheck,
  Sun,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { Button, ButtonLink } from '@/components/ui/button'
import { Avatar } from '@/components/ui/badge'
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel } from '@/components/ui/dropdown'
import { useAsync } from '@/hooks'
import { backend } from '@/services/backend'
import { relativeTime } from '@/lib/utils'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="LocalJob home">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-[15px] font-extrabold text-white shadow-sm">
        LJ
      </span>
      <span className="text-[17px] font-bold tracking-tight text-fg">
        Local<span className="text-primary">Job</span>
      </span>
    </Link>
  )
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-card-2 hover:text-fg',
        )
      }
    >
      {children}
    </NavLink>
  )
}

function NotificationsMenu() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [items, setItems] = useState<Awaited<ReturnType<typeof backend.notifications>> | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useAsync(async () => {
    if (!user) return null
    const data = await backend.notifications()
    setItems(data)
    return data
  }, [user?.id, reloadKey])

  const unread = items?.unread ?? 0

  return (
    <Dropdown
      width={330}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={() => {
            toggle()
            setReloadKey((key) => key + 1)
          }}
          className="relative grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg"
          aria-label={t('nav.notifications')}
        >
          <Bell size={18} />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          ) : null}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold text-fg">{t('nav.notifications')}</p>
            {unread > 0 ? (
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onClick={async () => {
                  await backend.markNotifications({ all: true })
                  setReloadKey((key) => key + 1)
                }}
              >
                {t('common.markAllRead')}
              </button>
            ) : null}
          </div>
          <DropdownDivider />
          <div className="max-h-80 overflow-y-auto">
            {!items || items.items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-subtle">{t('common.noNotifications')}</p>
            ) : (
              items.items.slice(0, 8).map((note) => (
                <Link
                  key={note.id}
                  to={note.link || '#'}
                  onClick={async () => {
                    close()
                    if (!note.isRead) {
                      await backend.markNotifications({ ids: [note.id] })
                      setReloadKey((key) => key + 1)
                    }
                  }}
                  className={cn(
                    'block rounded-md px-3 py-2.5 transition-colors hover:bg-card-2',
                    !note.isRead && 'bg-primary/[0.06]',
                  )}
                >
                  <p className="flex items-center gap-2 text-sm font-medium text-fg">
                    {!note.isRead ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
                    {note.title}
                  </p>
                  {note.message ? <p className="mt-1 line-clamp-2 text-xs text-muted">{note.message}</p> : null}
                  <p className="mt-1 text-[11px] text-subtle">{relativeTime(note.createdAt, lang)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </Dropdown>
  )
}

function LanguageSwitcher() {
  const { lang, setLang, languages, t } = useLanguage()
  const current = languages.find((item) => item.code === lang)
  return (
    <Dropdown
      width={180}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted transition-colors hover:bg-card-2 hover:text-fg"
          aria-label={t('nav.language')}
        >
          <span aria-hidden>{current?.flag}</span>
          <span className="hidden sm:inline">{current?.short}</span>
          <ChevronDown size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          <DropdownLabel>{t('nav.language')}</DropdownLabel>
          {languages.map((item) => (
            <DropdownItem
              key={item.code}
              active={item.code === lang}
              onClick={() => {
                setLang(item.code)
                close()
              }}
            >
              <span className="mr-1" aria-hidden>
                {item.flag}
              </span>
              {item.label}
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg"
      aria-label={theme === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')}
      title={theme === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

function UserMenu() {
  const { user, isAdmin, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <Dropdown
      width={240}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-card-2"
          aria-label={t('nav.profile')}
        >
          <Avatar name={user.name} src={user.avatar} size={32} />
          <ChevronDown size={14} className="text-subtle" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
          </div>
          <DropdownDivider />
          {user.role === 'job_seeker' ? (
            <>
              <DropdownItem icon={<LayoutDashboard />} onClick={() => { close(); navigate('/dashboard') }}>
                {t('nav.dashboard')}
              </DropdownItem>
              <DropdownItem icon={<FileText />} onClick={() => { close(); navigate('/applications') }}>
                {t('nav.applications')}
              </DropdownItem>
              <DropdownItem icon={<Briefcase />} onClick={() => { close(); navigate('/saved') }}>
                {t('nav.saved')}
              </DropdownItem>
              <DropdownItem icon={<UserIcon />} onClick={() => { close(); navigate('/profile') }}>
                {t('nav.profile')}
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem icon={<LayoutDashboard />} onClick={() => { close(); navigate('/employer') }}>
                {t('nav.dashboard')}
              </DropdownItem>
              <DropdownItem icon={<Briefcase />} onClick={() => { close(); navigate('/employer/jobs') }}>
                {t('nav.myJobs')}
              </DropdownItem>
              <DropdownItem icon={<Users />} onClick={() => { close(); navigate('/employer/applications') }}>
                {t('nav.candidates')}
              </DropdownItem>
              <DropdownItem icon={<Plus />} onClick={() => { close(); navigate('/employer/jobs/new') }}>
                {t('nav.postJob')}
              </DropdownItem>
              <DropdownItem icon={<Building2 />} onClick={() => { close(); navigate('/employer/company') }}>
                {t('nav.company')}
              </DropdownItem>
            </>
          )}
          {isAdmin ? (
            <DropdownItem icon={<ShieldCheck />} onClick={() => { close(); navigate('/admin') }}>
              {t('nav.admin')}
            </DropdownItem>
          ) : null}
          <DropdownItem icon={<Settings />} onClick={() => { close(); navigate('/settings') }}>
            {t('nav.settings')}
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            icon={<LogOut />}
            danger
            onClick={async () => {
              close()
              await logout()
              navigate('/')
            }}
          >
            {t('nav.signOut')}
          </DropdownItem>
        </>
      )}
    </Dropdown>
  )
}

export function Navbar() {
  const { t } = useLanguage()
  const { user, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const publicLinks = [
    { to: '/jobs', label: t('nav.jobs') },
    { to: '/companies', label: t('nav.companies') },
    { to: '/for-employers', label: t('nav.employers') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="lj-container flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {publicLinks.map((link) => (
              <NavItem key={link.to} to={link.to}>
                {link.label}
              </NavItem>
            ))}
            {user && user.role === 'job_seeker' ? (
              <>
                <NavItem to="/dashboard">{t('nav.dashboard')}</NavItem>
                <NavItem to="/applications">{t('nav.applications')}</NavItem>
                <NavItem to="/saved">{t('nav.saved')}</NavItem>
              </>
            ) : null}
            {user && (user.role === 'employer' || isAdmin) ? (
              <>
                <NavItem to="/employer">{t('nav.dashboard')}</NavItem>
                <NavItem to="/employer/jobs">{t('nav.myJobs')}</NavItem>
                <NavItem to="/employer/applications">{t('nav.candidates')}</NavItem>
              </>
            ) : null}
            {isAdmin ? (
              <NavItem to="/admin">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={15} /> {t('nav.admin')}
                </span>
              </NavItem>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <div className="hidden items-center gap-1 sm:flex">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <NotificationsMenu />
              {user.role === 'employer' || isAdmin ? (
                <ButtonLink to="/employer/jobs/new" size="sm" className="hidden md:inline-flex" icon={<Plus size={15} />}>
                  {t('nav.postJob')}
                </ButtonLink>
              ) : null}
              <UserMenu />
            </>
          ) : (
            <>
              <div className="hidden items-center gap-1 sm:flex">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <ButtonLink to="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                {t('nav.signIn')}
              </ButtonLink>
              <ButtonLink to="/register" size="sm">
                {t('nav.createAccount')}
              </ButtonLink>
            </>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg lg:hidden"
            aria-label={t('nav.menu')}
            aria-expanded={mobileOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/55" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-line bg-card shadow-pop">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-subtle hover:bg-card-2 hover:text-fg"
                aria-label={t('common.close')}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
              {[
                ...publicLinks,
                ...(user?.role === 'job_seeker'
                  ? [
                      { to: '/dashboard', label: t('nav.dashboard') },
                      { to: '/applications', label: t('nav.applications') },
                      { to: '/saved', label: t('nav.saved') },
                      { to: '/profile', label: t('nav.profile') },
                    ]
                  : []),
                ...(user && (user.role === 'employer' || isAdmin)
                  ? [
                      { to: '/employer', label: t('nav.dashboard') },
                      { to: '/employer/jobs', label: t('nav.myJobs') },
                      { to: '/employer/applications', label: t('nav.candidates') },
                      { to: '/employer/jobs/new', label: t('nav.postJob') },
                      { to: '/employer/company', label: t('nav.company') },
                    ]
                  : []),
                ...(isAdmin ? [{ to: '/admin', label: t('nav.admin') }] : []),
                ...(user ? [{ to: '/settings', label: t('nav.settings') }] : []),
              ].map((link) => (
                <NavLink
                  key={`${link.to}-${link.label}`}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3.5 py-3 text-[15px] font-medium transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'text-fg hover:bg-card-2',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="space-y-3 border-t border-line px-4 py-4">
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              {user ? (
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<LogOut size={16} />}
                  onClick={async () => {
                    setMobileOpen(false)
                    await logout()
                    navigate('/')
                  }}
                >
                  {t('nav.signOut')}
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <ButtonLink to="/login" variant="secondary" onClick={() => setMobileOpen(false)}>
                    {t('nav.signIn')}
                  </ButtonLink>
                  <ButtonLink to="/register" onClick={() => setMobileOpen(false)}>
                    {t('nav.createAccount')}
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
