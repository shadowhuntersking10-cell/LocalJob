import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearToken, getToken, setToken } from '@/lib/api'
import { backend, detectMode, getMode, onModeChange, type BackendMode } from '@/services/backend'
import { KEYS, storage } from '@/lib/storage'
import type { Company, Profile, SessionPayload, User } from '@/types'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  company: Company | null
  isAdmin: boolean
  completion: number
  loading: boolean
  mode: BackendMode
  login: (email: string, password: string, remember?: boolean) => Promise<SessionPayload>
  register: (payload: Record<string, unknown>) => Promise<SessionPayload>
  demoLogin: (kind: 'seeker' | 'employer') => Promise<SessionPayload>
  telegramLogin: (initData: string, startParam?: string) => Promise<SessionPayload>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  setUser: (user: User) => void
  setProfileState: (profile: Profile | null) => void
  setCompany: (company: Company | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [completion, setCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mode, setModeState] = useState<BackendMode>(getMode())

  const applySession = useCallback((payload: SessionPayload) => {
    setToken(payload.token)
    setUser(payload.user)
    setProfile(payload.profile)
    setCompany(payload.company)
    setIsAdmin(Boolean(payload.isAdmin || payload.user.role === 'admin'))
    setCompletion(payload.profileCompletion ?? 0)
  }, [])

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const payload = await backend.me()
      setUser(payload.user)
      setProfile(payload.profile)
      setCompany(payload.company)
      setIsAdmin(Boolean(payload.isAdmin || payload.user.role === 'admin'))
      setCompletion(payload.profileCompletion ?? 0)
    } catch {
      clearToken()
      setUser(null)
      setProfile(null)
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onModeChange(setModeState)
    let cancelled = false
    const boot = async () => {
      await detectMode()
      if (cancelled) return
      const telegram = (window as unknown as {
        Telegram?: { WebApp?: { initData?: string; startParam?: string; initDataUnsafe?: { start_param?: string }; ready?: () => void; expand?: () => void } }
      }).Telegram?.WebApp
      telegram?.ready?.()
      telegram?.expand?.()
      if (!getToken() && telegram?.initData) {
        try {
          const session = await backend.telegramLogin(telegram.initData, telegram.initDataUnsafe?.start_param)
          applySession(session)
        } catch {
          /* fall through to the normal session refresh */
        }
      }
      await refresh()
    }
    void boot()
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [refresh, applySession])

  const login = useCallback(
    async (email: string, password: string, remember = true) => {
      const session = await backend.login({ email, password, remember })
      applySession(session)
      storage.set(KEYS.session, { email, remember, at: Date.now() })
      return session
    },
    [applySession],
  )

  const register = useCallback(
    async (payload: Record<string, unknown>) => {
      const session = await backend.register(payload)
      applySession(session)
      return session
    },
    [applySession],
  )

  const demoLogin = useCallback(
    async (kind: 'seeker' | 'employer') => {
      const session = await backend.demoLogin(kind)
      applySession(session)
      return session
    },
    [applySession],
  )

  const telegramLogin = useCallback(
    async (initData: string, startParam?: string) => {
      const session = await backend.telegramLogin(initData, startParam)
      applySession(session)
      return session
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await backend.logout()
    } catch {
      /* ignore network errors on logout */
    }
    clearToken()
    setUser(null)
    setProfile(null)
    setCompany(null)
    setIsAdmin(false)
    setCompletion(0)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      company,
      isAdmin,
      completion,
      loading,
      mode,
      login,
      register,
      demoLogin,
      telegramLogin,
      logout,
      refresh,
      setUser,
      setProfileState: setProfile,
      setCompany,
    }),
    [user, profile, company, isAdmin, completion, loading, mode, login, register, demoLogin, telegramLogin, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
