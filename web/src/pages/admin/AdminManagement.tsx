import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Search, ShieldCheck, Trash2, UserX, Users } from 'lucide-react'
import type { Job, User } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { useDebounced, useAsync } from '@/hooks'
import { formatDate, roleLabel, statusLabel, statusTone } from '@/lib/utils'
import { Avatar, Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, EmptyState, ListSkeleton, Pagination, SectionHeading, Tabs } from '@/components/ui/misc'
import { ConfirmDialog } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/field'

export function AdminUsers() {
  const { t, lang } = useLanguage()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)
  const debounced = useDebounced(search, 300)
  const users = useAsync(() => backend.adminUsers({ search: debounced || undefined, role: role || undefined, page, pageSize: 12 }), [debounced, role, page])

  const updateUser = async (id: number, payload: { role?: string; isActive?: boolean }) => {
    try {
      await backend.adminUpdateUser(id, payload)
      toast.success(t('settings.saved'))
      await users.reload()
    } catch {
      toast.error(t('error.generic'))
    }
  }

  const remove = async () => {
    if (!pendingDelete) return
    try {
      await backend.adminDeleteUser(pendingDelete.id)
      toast.success(t('common.delete'))
      setPendingDelete(null)
      await users.reload()
    } catch {
      toast.error(t('error.generic'))
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeading title={t('admin.users')} subtitle={t('admin.subtitle')} />

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('admin.search')}
            icon={<Search size={15} />}
            aria-label={t('admin.search')}
          />
        </div>
        <div className="w-44">
          <Select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder={t('common.all')}
            aria-label={t('admin.role')}
            options={[
              { value: 'job_seeker', label: roleLabel('job_seeker', lang) },
              { value: 'employer', label: roleLabel('employer', lang) },
              { value: 'admin', label: roleLabel('admin', lang) },
            ]}
          />
        </div>
      </div>

      {users.loading ? (
        <ListSkeleton count={3} />
      ) : (users.data?.items.length ?? 0) === 0 ? (
        <EmptyState icon={<Users size={24} />} title={t('companies.empty')} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-line bg-card-2 text-left text-xs uppercase tracking-wide text-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('auth.fullName')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.role')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.applications')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.jobs')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.created')}</th>
                  <th className="px-4 py-3 font-medium text-right">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.data?.items.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-card-2/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} src={user.avatar} size={34} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-fg">{user.name}</p>
                          <p className="truncate text-xs text-subtle">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Select
                          aria-label={t('admin.role')}
                          className="h-8 w-36 text-xs"
                          value={user.role}
                          onChange={(event) => void updateUser(user.id, { role: event.target.value })}
                          options={[
                            { value: 'job_seeker', label: roleLabel('job_seeker', lang) },
                            { value: 'employer', label: roleLabel('employer', lang) },
                            { value: 'admin', label: roleLabel('admin', lang) },
                          ]}
                        />
                        {!user.isActive ? <Badge tone="danger">{t('admin.block')}</Badge> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{user.applications}</td>
                    <td className="px-4 py-3 text-muted">{user.jobs}</td>
                    <td className="px-4 py-3 text-xs text-subtle">{formatDate(user.createdAt, lang)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<UserX size={14} />}
                          onClick={() => void updateUser(user.id, { isActive: !user.isActive })}
                        >
                          {user.isActive ? t('admin.block') : t('admin.unblock')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger hover:bg-danger/10"
                          icon={<Trash2 size={14} />}
                          onClick={() => setPendingDelete(user)}
                        >
                          {t('common.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination
        page={users.data?.page ?? 1}
        pages={users.data?.pages ?? 1}
        onChange={setPage}
        labels={{ prev: t('common.prev'), next: t('common.next'), page: t('common.page'), of: t('common.of') }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={t('settings.deleteAccount')}
        description={pendingDelete ? `${pendingDelete.name} · ${pendingDelete.email}` : ''}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => void remove()}
      />
    </div>
  )
}

export function AdminJobs() {
  const { t, lang } = useLanguage()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null)
  const debounced = useDebounced(search, 300)
  const jobs = useAsync(
    () => backend.adminJobs({ search: debounced || undefined, status: status === 'all' ? undefined : status, page, pageSize: 12 }),
    [debounced, status, page],
  )

  const changeStatus = async (job: Job, next: string) => {
    try {
      await backend.adminUpdateJob(job.id, { status: next })
      toast.success(t('emp.statusChanged', { status: statusLabel(next, lang) }))
      await jobs.reload()
    } catch {
      toast.error(t('error.generic'))
    }
  }

  const remove = async () => {
    if (!pendingDelete) return
    try {
      await backend.adminDeleteJob(pendingDelete.id)
      toast.success(t('emp.deleted'))
      setPendingDelete(null)
      await jobs.reload()
    } catch {
      toast.error(t('error.generic'))
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeading title={t('admin.jobs')} subtitle={t('admin.moderationNote')} />

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('admin.search')}
            icon={<Search size={15} />}
            aria-label={t('admin.search')}
          />
        </div>
      </div>

      <Tabs
        value={status}
        onChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
        tabs={[
          { value: 'all', label: t('common.all') },
          { value: 'active', label: statusLabel('active', lang) },
          { value: 'paused', label: statusLabel('paused', lang) },
          { value: 'closed', label: statusLabel('closed', lang) },
        ]}
      />

      {jobs.loading ? (
        <ListSkeleton count={3} />
      ) : (jobs.data?.items.length ?? 0) === 0 ? (
        <EmptyState icon={<Briefcase size={24} />} title={t('jobs.empty.title')} />
      ) : (
        <div className="space-y-3">
          {jobs.data?.items.map((job) => (
            <Card key={job.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">
                    <Link to={`/jobs/${job.id}`} className="transition-colors hover:text-primary">
                      {job.title}
                    </Link>
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {job.company?.name ?? 'LocalJob'} · {job.location} · {job.applicationsCount ?? 0} {t('admin.applications').toLowerCase()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(job.status)}>{statusLabel(job.status, lang)}</Badge>
                  <Select
                    aria-label={t('admin.moderationNote')}
                    className="h-8 w-32 text-xs"
                    value={job.status}
                    onChange={(event) => void changeStatus(job, event.target.value)}
                    options={[
                      { value: 'active', label: statusLabel('active', lang) },
                      { value: 'paused', label: statusLabel('paused', lang) },
                      { value: 'closed', label: statusLabel('closed', lang) },
                    ]}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-danger/10"
                    icon={<Trash2 size={14} />}
                    onClick={() => setPendingDelete(job)}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        page={jobs.data?.page ?? 1}
        pages={jobs.data?.pages ?? 1}
        onChange={setPage}
        labels={{ prev: t('common.prev'), next: t('common.next'), page: t('common.page'), of: t('common.of') }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={t('emp.confirmDeleteTitle')}
        description={pendingDelete ? t('emp.confirmDeleteText', { title: pendingDelete.title }) : ''}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => void remove()}
      />
    </div>
  )
}

export function AdminApplications() {
  const { t, lang } = useLanguage()
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const applications = useAsync(
    () => backend.adminApplications({ status: status === 'all' ? undefined : status, page, pageSize: 15 }),
    [status, page],
  )

  return (
    <div className="space-y-5">
      <SectionHeading title={t('admin.applications')} subtitle={t('apps.subtitle')} />

      <Tabs
        value={status}
        onChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
        tabs={[
          { value: 'all', label: t('common.all') },
          ...(['submitted', 'review', 'shortlisted', 'interview', 'rejected', 'hired'] as const).map((item) => ({
            value: item,
            label: statusLabel(item, lang),
          })),
        ]}
      />

      {applications.loading ? (
        <ListSkeleton count={3} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-line bg-card-2 text-left text-xs uppercase tracking-wide text-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('nav.candidates')}</th>
                  <th className="px-4 py-3 font-medium">{t('nav.jobs')}</th>
                  <th className="px-4 py-3 font-medium">{t('emp.match', { score: '' })}</th>
                  <th className="px-4 py-3 font-medium">{t('apps.status')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.created')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {applications.data?.items.map((application) => (
                  <tr key={application.id} className="transition-colors hover:bg-card-2/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-fg">{application.applicant?.name ?? application.fullName}</p>
                      <p className="text-xs text-subtle">{application.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {application.job?.title}
                      <span className="block text-xs text-subtle">{application.job?.company?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="accent">{application.matchScore}%</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(application.status)}>{statusLabel(application.status, lang)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-subtle">{formatDate(application.createdAt, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination
        page={applications.data?.page ?? 1}
        pages={applications.data?.pages ?? 1}
        onChange={setPage}
        labels={{ prev: t('common.prev'), next: t('common.next'), page: t('common.page'), of: t('common.of') }}
      />

      <p className="flex items-center gap-2 text-xs text-subtle">
        <ShieldCheck size={13} /> LocalJob admin
      </p>
    </div>
  )
}
