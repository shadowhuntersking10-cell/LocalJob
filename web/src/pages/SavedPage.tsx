import { Bookmark, BookmarkX } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { backend } from '@/services/backend'
import { useAsync } from '@/hooks'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState, ListSkeleton } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'

export default function SavedPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toggle } = useSavedJobs()
  const saved = useAsync(() => backend.savedJobs(), [user?.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">{t('saved.title')}</h1>
          <p className="mt-1.5 text-sm text-muted">{t('saved.subtitle')}</p>
        </div>
        <span className="lj-chip">
          <Bookmark size={13} /> {saved.data?.total ?? 0}
        </span>
      </div>

      {saved.loading ? (
        <ListSkeleton count={3} />
      ) : (saved.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<BookmarkX size={24} />}
          title={t('saved.empty.title')}
          description={t('saved.empty.text')}
          actionLabel={t('saved.empty.cta')}
          actionTo="/jobs"
        />
      ) : (
        <div className="space-y-3">
          {saved.data?.items.map((row) => (
            <div key={row.id} className="space-y-2">
              {row.job ? <JobCard job={{ ...row.job, isSaved: true }} /> : null}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await toggle(row.jobId)
                    await saved.reload()
                  }}
                >
                  {t('saved.remove')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
