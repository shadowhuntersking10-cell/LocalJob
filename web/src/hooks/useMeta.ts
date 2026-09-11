import { useEffect, useState } from 'react'
import { backend } from '@/services/backend'
import type { Meta } from '@/types'

let cache: Meta | null = null
const listeners = new Set<(meta: Meta) => void>()

/** Loads /api/meta once and shares it across the whole app. */
export function useMeta() {
  const [meta, setMeta] = useState<Meta | null>(cache)
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    let active = true
    const listener = (value: Meta) => {
      if (active) setMeta(value)
    }
    listeners.add(listener)
    if (cache) {
      setMeta(cache)
      setLoading(false)
    } else {
      backend
        .meta()
        .then((value) => {
          cache = value
          listeners.forEach((item) => item(value))
        })
        .catch(() => undefined)
        .finally(() => {
          if (active) setLoading(false)
        })
    }
    return () => {
      active = false
      listeners.delete(listener)
    }
  }, [])

  return { meta, loading }
}
