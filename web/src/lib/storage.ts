/** Small typed localStorage helper (SSR/test safe). */
const memory = new Map<string, string>()

function available(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = available() ? window.localStorage.getItem(key) : memory.get(key) ?? null
      if (raw === null || raw === undefined) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  set<T>(key: string, value: T): void {
    try {
      const raw = JSON.stringify(value)
      if (available()) window.localStorage.setItem(key, raw)
      else memory.set(key, raw)
    } catch {
      /* quota exceeded — ignore */
    }
  },
  remove(key: string): void {
    try {
      if (available()) window.localStorage.removeItem(key)
      else memory.delete(key)
    } catch {
      /* ignore */
    }
  },
  raw(key: string, fallback = ''): string {
    try {
      return (available() ? window.localStorage.getItem(key) : memory.get(key)) ?? fallback
    } catch {
      return fallback
    }
  },
  setRaw(key: string, value: string): void {
    try {
      if (available()) window.localStorage.setItem(key, value)
      else memory.set(key, value)
    } catch {
      /* ignore */
    }
  },
}

export const KEYS = {
  token: 'localjob.token',
  session: 'localjob.session',
  theme: 'localjob.theme',
  lang: 'localjob.lang',
  filters: 'localjob.jobs.filters',
  localDb: 'localjob.db.v1',
  prefs: 'localjob.notification.prefs',
} as const
