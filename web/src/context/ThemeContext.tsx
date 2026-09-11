import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { KEYS, storage } from '@/lib/storage'
import type { Theme } from '@/types'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function initialTheme(): Theme {
  const stored = storage.raw(KEYS.theme, '') as Theme | ''
  if (stored === 'light' || stored === 'dark') return stored
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.classList.toggle('dark', theme === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#080E1C' : '#F6F9FD')
    storage.setRaw(KEYS.theme, theme)
    const telegram = (window as unknown as { Telegram?: { WebApp?: { setHeaderColor?: (color: string) => void; setBackgroundColor?: (color: string) => void } } }).Telegram?.WebApp
    try {
      telegram?.setHeaderColor?.(theme === 'dark' ? '#080E1C' : '#F6F9FD')
      telegram?.setBackgroundColor?.(theme === 'dark' ? '#080E1C' : '#F6F9FD')
    } catch {
      /* Telegram API not available outside the WebApp */
    }
  }, [theme])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const toggleTheme = useCallback(() => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
