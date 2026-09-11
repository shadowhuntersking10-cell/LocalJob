import { useCallback, useEffect, useRef, useState } from 'react'

/** Debounce any fast changing value (search inputs, filter changes…). */
export function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/** Tailwind-style media query hook. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const list = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    setMatches(list.matches)
    list.addEventListener('change', handler)
    return () => list.removeEventListener('change', handler)
  }, [query])
  return matches
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

/** Lock body scroll — used by modals, sheets and drawers. */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}

/** Run an async task with loading + error state. */
export function useAsync<T>(task: () => Promise<T>, deps: unknown[] = [], immediate = true) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<unknown>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await task()
      if (mounted.current) setData(result)
      return result
    } catch (caught) {
      if (mounted.current) setError(caught)
      throw caught
    } finally {
      if (mounted.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (immediate) void run().catch(() => undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, immediate])

  return { data, loading, error, reload: run, setData }
}

/** Track clicks outside of an element (dropdowns). */
export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      return false
    }
  }, [])
  return { copied, copy }
}
