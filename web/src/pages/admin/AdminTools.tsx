import { useState } from 'react'
import { Megaphone, Send } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, EmptyState, ListSkeleton, SectionHeading } from '@/components/ui/misc'
import { Select, Textarea } from '@/components/ui/field'

export function AdminBroadcast() {
  const { t } = useLanguage()
  const toast = useToast()
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<'all' | 'job_seekers' | 'employers'>('all')
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const send = async () => {
    if (message.trim().length < 3) {
      toast.error(t('error.required'))
      return
    }
    setSending(true)
    try {
      const result = await backend.adminBroadcast({ message: message.trim(), audience })
      toast.success(t('admin.sent', { count: result.notified }))
      setHistory((current) => [message.trim(), ...current].slice(0, 5))
      setMessage('')
    } catch {
      toast.error(t('error.generic'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeading
        title={
          <span className="inline-flex items-center gap-2">
            <Megaphone size={18} className="text-primary" /> {t('admin.broadcastTitle')}
          </span>
        }
        subtitle={t('admin.subtitle')}
      />

      <Card className="p-5">
        <div className="grid gap-4">
          <Select
            label={t('admin.audience')}
            value={audience}
            onChange={(event) => setAudience(event.target.value as typeof audience)}
            options={[
              { value: 'all', label: t('admin.audienceAll') },
              { value: 'job_seekers', label: t('admin.audienceSeekers') },
              { value: 'employers', label: t('admin.audienceEmployers') },
            ]}
          />
          <Textarea
            label={t('admin.broadcastText')}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            maxLength={800}
            counter
            placeholder="LocalJob: 20 ta yangi IT vakansiya joylashtirildi…"
          />
          <div>
            <Button onClick={() => void send()} loading={sending} icon={<Send size={15} />}>
              {t('admin.send')}
            </Button>
          </div>
        </div>
      </Card>

      {history.length ? (
        <Card className="p-5">
          <SectionHeading title={t('admin.activity')} />
          <div className="mt-4 space-y-2.5">
            {history.map((item, index) => (
              <div key={index} className="rounded-md border border-line bg-card-2 p-3 text-sm text-muted">
                {item}
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export function AdminActivity() {
  const { t, lang } = useLanguage()
  const activity = useAsync(() => backend.adminActivity(40), [])

  return (
    <div className="space-y-5">
      <SectionHeading title={t('admin.activity')} subtitle={t('admin.subtitle')} />

      {activity.loading ? (
        <ListSkeleton count={3} />
      ) : (activity.data?.items.length ?? 0) === 0 ? (
        <EmptyState title={t('common.noNotifications')} description={t('admin.subtitle')} />
      ) : (
        <Card className="divide-y divide-line">
          {activity.data?.items.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Badge tone="primary">{entry.action}</Badge>
              <span className="min-w-0 flex-1 truncate text-sm text-muted">{entry.detail}</span>
              <span className="text-xs text-subtle">{entry.actor}</span>
              <span className="text-xs text-subtle">{formatDate(entry.createdAt ?? undefined, lang)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
