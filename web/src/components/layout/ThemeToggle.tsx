import { Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        className ??
        'grid h-10 w-10 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-fg'
      }
      aria-label={theme === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')}
      title={theme === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
