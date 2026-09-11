import { useState } from 'react'
import { FileText } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { APPLICATION_STATUSES, statusLabel } from '@/lib/utils'
import { ApplicationCard } from '@/components/jobs/ApplicationCard'
import { EmptyState, ListSkeleton, Tabs } from '@/components/ui/misc'
import { Card } from '@/components/ui/misc'

export default function ApplicationsPage() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [status, setStatus] = useState<string>('all')

  const applications = useAsync(
    () => backend.applications(status === 'all' ? undefined : status),
    [user?.id, status],
  )

  const counts = applications.data?.counts ?? {}
  const total = applications.data?.total ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('apps.title')}</h1>
        <p className="mt-1.5 text-sm text-muted">{t('apps.subtitle')}</p>
      </div>

      <Tabs
        value={status}
        onChange={setStatus}
        tabs={[
          { value: 'all', label: t('apps.filterAll'), count: total },
          ...APPLICATION_STATUSES.map((item) => ({
            value: item,
            label: statusLabel(item, lang),
            count: counts[item] ?? 0,
          })).filter((tab) => (tab.count ?? 0) > 0),
        ]}
      />

      {applications.loading ? (
        <ListSkeleton count={3} />
      ) : total === 0 ? (
        <EmptyState
          icon={<FileText size={24} />}
          title={t('apps.empty.title')}
          description={t('apps.empty.text')}
          actionLabel={t('apps.empty.cta')}
          actionTo="/jobs"
        />
      ) : (
        <div className="space-y-3">
          {applications.data?.items.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-fg">{t('admin.statusBreakdown')}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {APPLICATION_STATUSES.map((item) => (
            <div key={item} className="rounded-md border border-line bg-card-2 px-3 py-2.5">
              <p className="text-xs text-subtle">{statusLabel(item, lang)}</p>
              <p className="mt-0.5 text-lg font-semibold text-fg">{counts[item] ?? 0}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
