import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Eye, FileText, Pause, Pencil, Play, Plus, Trash2 } from 'lucide-react'
import type { Job } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { formatDate, statusLabel, statusTone } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, EmptyState, ListSkeleton } from '@/components/ui/misc'
import { ConfirmDialog } from '@/components/ui/modal'
import { Tabs } from '@/components/ui/misc'

export default function EmployerJobs() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const toast = useToast()
  const [statusFilter, setStatusFilter] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null)
  const [busy, setBusy] = useState<number | null>(null)

  const jobs = useAsync(() => backend.myJobs(), [user?.id])
  const items = jobs.data?.items ?? []
  const filtered = statusFilter === 'all' ? items : items.filter((job) => job.status === statusFilter)

  const changeStatus = async (job: Job, status: 'active' | 'paused' | 'closed') => {
    setBusy(job.id)
    try {
      await backend.updateJob(job.id, { status })
      toast.success(status === 'paused' ? t('emp.paused') : t('emp.activated'))
      await jobs.reload()
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setBusy(null)
    }
  }

  const remove = async () => {
    if (!pendingDelete) return
    try {
      await backend.deleteJob(pendingDelete.id)
      toast.success(t('emp.deleted'))
      setPendingDelete(null)
      await jobs.reload()
    } catch {
      toast.error(t('error.generic'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('emp.myJobs')}</h1>
          <p className="mt-1.5 text-sm text-muted">{t('emp.myJobs.subtitle')}</p>
        </div>
        <ButtonLink to="/employer/jobs/new" icon={<Plus size={16} />}>
          {t('emp.postNewJob')}
        </ButtonLink>
      </div>

      <Tabs
        value={statusFilter}
        onChange={setStatusFilter}
        tabs={[
          { value: 'all', label: t('common.all'), count: items.length },
          { value: 'active', label: statusLabel('active', lang), count: items.filter((job) => job.status === 'active').length },
          { value: 'paused', label: statusLabel('paused', lang), count: items.filter((job) => job.status === 'paused').length },
          { value: 'closed', label: statusLabel('closed', lang), count: items.filter((job) => job.status === 'closed').length },
        ]}
      />

      {jobs.loading ? (
        <ListSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={24} />}
          title={t('emp.noJobs.title')}
          description={t('emp.noJobs.text')}
          actionLabel={t('emp.noJobs.cta')}
          actionTo="/employer/jobs/new"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <Card key={job.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[15px] font-semibold text-fg">
                    <Link to={`/jobs/${job.id}`} className="transition-colors hover:text-primary">
                      {job.title}
                    </Link>
                  </h2>
                  <p className="mt-0.5 text-xs text-subtle">
                    {job.location} · {formatDate(job.createdAt, lang)} · {job.salaryLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={13} /> {job.views}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FileText size={13} /> {job.applicationsCount ?? 0}
                    </span>
                  </div>
                </div>
                <Badge tone={statusTone(job.status)}>{statusLabel(job.status, lang)}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink to={`/jobs/${job.id}`} variant="secondary" size="sm">
                  {t('emp.view')}
                </ButtonLink>
                <ButtonLink to={`/employer/jobs/${job.id}/edit`} variant="secondary" size="sm" icon={<Pencil size={14} />}>
                  {t('emp.edit')}
                </ButtonLink>
                {job.status === 'active' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Pause size={14} />}
                    disabled={busy === job.id}
                    onClick={() => void changeStatus(job, 'paused')}
                  >
                    {t('emp.pause')}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Play size={14} />}
                    disabled={busy === job.id}
                    onClick={() => void changeStatus(job, 'active')}
                  >
                    {t('emp.activate')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:bg-danger/10"
                  icon={<Trash2 size={14} />}
                  onClick={() => setPendingDelete(job)}
                >
                  {t('emp.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={t('emp.confirmDeleteTitle')}
        description={pendingDelete ? t('emp.confirmDeleteText', { title: pendingDelete.title }) : ''}
        confirmLabel={t('emp.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => void remove()}
      />
    </div>
  )
}
