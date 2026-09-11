import { NavLink, Outlet } from 'react-router-dom'
import { Activity, BarChart3, Briefcase, Database, LayoutDashboard, Megaphone, Users } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const { t } = useLanguage()
  const items = [
    { to: '/admin', label: t('admin.overview'), icon: <LayoutDashboard size={17} />, end: true },
    { to: '/admin/users', label: t('admin.users'), icon: <Users size={17} /> },
    { to: '/admin/jobs', label: t('admin.jobs'), icon: <Briefcase size={17} /> },
    { to: '/admin/applications', label: t('admin.applications'), icon: <BarChart3 size={17} /> },
    { to: '/admin/broadcast', label: t('admin.broadcast'), icon: <Megaphone size={17} /> },
    { to: '/admin/activity', label: t('admin.activity'), icon: <Activity size={17} /> },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-bg-soft">
      <Navbar />
      <div className="lj-container flex flex-1 flex-col gap-6 py-6 lg:flex-row lg:gap-8 lg:py-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="lj-card mb-4 flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-accent/12 text-accent">
              <Database size={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">LocalJob</p>
              <p className="text-xs text-subtle">admin.localjob.uz</p>
            </div>
          </div>
          <nav className="lj-scroll-x lg:flex lg:flex-col lg:gap-1 lg:overflow-visible" aria-label="Admin">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted hover:bg-card hover:text-fg lg:bg-transparent',
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
