import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Bookmark,
  Briefcase,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  ShieldCheck,
  User as UserIcon,
  Users,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

interface NavEntry {
  to: string
  label: string
  icon: ReactNode
}

export function DashboardLayout() {
  const { user, isAdmin } = useAuth()
  const { t } = useLanguage()

  const seekerNav: NavEntry[] = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard size={17} /> },
    { to: '/applications', label: t('nav.applications'), icon: <FileText size={17} /> },
    { to: '/saved', label: t('nav.saved'), icon: <Bookmark size={17} /> },
    { to: '/profile', label: t('nav.profile'), icon: <UserIcon size={17} /> },
    { to: '/settings', label: t('nav.settings'), icon: <Settings size={17} /> },
  ]

  const employerNav: NavEntry[] = [
    { to: '/employer', label: t('nav.dashboard'), icon: <LayoutDashboard size={17} /> },
    { to: '/employer/jobs', label: t('nav.myJobs'), icon: <Briefcase size={17} /> },
    { to: '/employer/applications', label: t('nav.candidates'), icon: <Users size={17} /> },
    { to: '/employer/jobs/new', label: t('nav.postJob'), icon: <Plus size={17} /> },
    { to: '/settings', label: t('nav.settings'), icon: <Settings size={17} /> },
  ]

  const items = user?.role === 'employer' ? employerNav : seekerNav

  return (
    <div className="flex min-h-screen flex-col bg-bg-soft">
      <Navbar />
      <div className="lj-container flex flex-1 gap-8 py-6 lg:py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1" aria-label="Dashboard">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/employer' || item.to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-card hover:text-fg',
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-card hover:text-fg',
                  )
                }
              >
                <ShieldCheck size={17} />
                {t('nav.admin')}
              </NavLink>
            ) : null}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 pb-20 lg:pb-0">
          <Outlet />
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 backdrop-blur lg:hidden"
        aria-label="Mobile dashboard navigation"
      >
        <div className="grid grid-cols-4">
          {items.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/employer' || item.to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-subtle',
                )
              }
            >
              {item.icon}
              <span className="truncate px-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
