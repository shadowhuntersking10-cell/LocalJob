import { Link } from 'react-router-dom'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { relativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, EmptyState, ListSkeleton, SectionHeading } from '@/components/ui/misc'

export default function NotificationsPage() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const notifications = useAsync(() => backend.notifications(), [user?.id])
  const items = notifications.data?.items ?? []

  return (
    <div className="lj-container py-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <SectionHeading
          title={
            <span className="inline-flex items-center gap-2">
              <Bell size={19} className="text-primary" /> {t('nav.notifications')}
            </span>
          }
          subtitle={`${notifications.data?.unread ?? 0} ${t('common.new').toLowerCase()}`}
          action={
            items.length ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<CheckCheck size={14} />}
                  onClick={async () => {
                    await backend.markNotifications({ all: true })
                    await notifications.reload()
                  }}
                >
                  {t('common.markAllRead')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={14} />}
                  onClick={async () => {
                    await backend.clearNotifications()
                    await notifications.reload()
                  }}
                >
                  {t('common.delete')}
                </Button>
              </div>
            ) : null
          }
        />

        {notifications.loading ? (
          <ListSkeleton count={3} />
        ) : items.length === 0 ? (
          <EmptyState icon={<Bell size={24} />} title={t('common.noNotifications')} description={t('dash.subtitle')} />
        ) : (
          <div className="space-y-2.5">
            {items.map((note) => (
              <Card key={note.id} className={note.isRead ? 'p-4' : 'border-primary/35 bg-primary/[0.04] p-4'}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent/12 text-accent">
                    <Bell size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-fg">{note.title}</p>
                      {!note.isRead ? <Badge tone="primary">{t('common.new')}</Badge> : null}
                    </div>
                    {note.message ? <p className="mt-1 text-sm leading-relaxed text-muted">{note.message}</p> : null}
                    <div className="mt-2 flex items-center gap-3 text-xs text-subtle">
                      <span>{relativeTime(note.createdAt, lang)}</span>
                      {note.link ? (
                        <Link
                          to={note.link}
                          className="font-medium text-primary hover:underline"
                          onClick={async () => {
                            if (!note.isRead) {
                              await backend.markNotifications({ ids: [note.id] })
                              await notifications.reload()
                            }
                          }}
                        >
                          {t('common.viewAll')}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
