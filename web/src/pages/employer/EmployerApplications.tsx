import { useState } from 'react'
import { Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { APPLICATION_STATUSES, statusLabel } from '@/lib/utils'
import { CandidateCard } from '@/components/jobs/ApplicationCard'
import { EmptyState, ListSkeleton, Tabs } from '@/components/ui/misc'
import { Card } from '@/components/ui/misc'
import { Select } from '@/components/ui/field'

export default function EmployerApplications() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [jobId, setJobId] = useState<string>('')
  const [status, setStatus] = useState<string>('all')

  const applications = useAsync(
    () =>
      backend.employerApplications({
        jobId: jobId ? Number(jobId) : undefined,
        status: status === 'all' ? undefined : status,
      }),
    [user?.id, jobId, status],
  )

  const items = applications.data?.items ?? []
  const counts = applications.data?.counts ?? {}
  const jobs = applications.data?.jobs ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('emp.candidates')}</h1>
          <p className="mt-1.5 text-sm text-muted">{t('emp.candidates.subtitle')}</p>
        </div>
        <div className="w-full sm:w-64">
          <Select
            aria-label={t('emp.allJobs')}
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
            placeholder={t('emp.allJobs')}
            options={jobs.map((job) => ({ value: String(job.id), label: job.title }))}
          />
        </div>
      </div>

      <Tabs
        value={status}
        onChange={setStatus}
        tabs={[
          { value: 'all', label: t('emp.allStatuses'), count: applications.data?.total ?? 0 },
          ...APPLICATION_STATUSES.map((item) => ({
            value: item,
            label: statusLabel(item, lang),
            count: counts[item] ?? 0,
          })).filter((tab) => (tab.count ?? 0) > 0),
        ]}
      />

      {applications.loading ? (
        <ListSkeleton count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title={t('emp.noCandidates.title')}
          description={t('emp.noCandidates.text')}
          actionLabel={t('emp.noCandidates.cta')}
          actionTo="/employer/jobs/new"
        />
      ) : (
        <div className="space-y-3">
          {items.map((application) => (
            <CandidateCard
              key={application.id}
              application={application}
              onStatusChange={() => {
                void applications.reload()
              }}
            />
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
