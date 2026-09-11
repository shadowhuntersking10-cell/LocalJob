import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Spinner } from '@/components/ui/misc'
import { EmptyState } from '@/components/ui/misc'
import { ShieldAlert } from 'lucide-react'

export function ProtectedRoute({
  children,
  roles,
  requireAdmin,
}: {
  children: ReactNode
  roles?: ('job_seeker' | 'employer' | 'admin')[]
  requireAdmin?: boolean
}) {
  const { user, loading, isAdmin } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner label={t('common.loading')} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="lj-container py-16">
        <EmptyState
          icon={<ShieldAlert size={24} />}
          title={t('admin.noAccess')}
          description={t('error.unauthorized')}
          actionLabel={t('common.goHome')}
          actionTo="/"
        />
      </div>
    )
  }

  if (roles && roles.length > 0 && !roles.includes(user.role) && !isAdmin) {
    return (
      <div className="lj-container py-16">
        <EmptyState
          icon={<ShieldAlert size={24} />}
          title={t('error.unauthorized')}
          description={t('dashboard.subtitle')}
          actionLabel={t('common.goHome')}
          actionTo="/"
        />
      </div>
    )
  }

  return <>{children}</>
}
