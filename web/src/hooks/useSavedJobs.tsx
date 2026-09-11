import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backend } from '@/services/backend'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useLanguage } from '@/context/LanguageContext'

/** Shared saved-jobs state so every card, page and button stays in sync. */
export function useSavedJobs() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const toast = useToast()
  const navigate = useNavigate()
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [pending, setPending] = useState<Set<number>>(new Set())

  const load = useCallback(async () => {
    if (!user) {
      setSavedIds(new Set())
      return
    }
    try {
      const data = await backend.savedJobs()
      setSavedIds(new Set(data.items.map((row) => row.jobId)))
    } catch {
      setSavedIds(new Set())
    }
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  const toggle = useCallback(
    async (jobId: number) => {
      if (!user) {
        toast.info(t('error.loginToApply'))
        navigate('/login')
        return
      }
      setPending((current) => new Set(current).add(jobId))
      const isSaved = savedIds.has(jobId)
      try {
        if (isSaved) {
          await backend.unsaveJob(jobId)
          setSavedIds((current) => {
            const next = new Set(current)
            next.delete(jobId)
            return next
          })
          toast.info(t('jobs.unsavedJob'))
        } else {
          await backend.saveJob(jobId)
          setSavedIds((current) => new Set(current).add(jobId))
          toast.success(t('jobs.savedJob'))
        }
      } catch {
        toast.error(t('error.generic'))
      } finally {
        setPending((current) => {
          const next = new Set(current)
          next.delete(jobId)
          return next
        })
      }
    },
    [navigate, savedIds, t, toast, user],
  )

  return { savedIds, toggle, pending, reload: load, isSaved: (id: number) => savedIds.has(id) }
}
