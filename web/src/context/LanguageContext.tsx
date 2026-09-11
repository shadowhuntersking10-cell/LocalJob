import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { KEYS, storage } from '@/lib/storage'
import { LANGUAGES, pickLang, translate } from '@/lib/i18n'
import type { Lang } from '@/types'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  languages: typeof LANGUAGES
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => pickLang(storage.raw(KEYS.lang, '')))

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    storage.setRaw(KEYS.lang, lang)
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(pickLang(next)), [])
  const t = useCallback((key: string, vars?: Record<string, string | number>) => translate(key, lang, vars), [lang])

  const value = useMemo(() => ({ lang, setLang, t, languages: LANGUAGES }), [lang, setLang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
