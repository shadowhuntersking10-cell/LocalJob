import { Link, Outlet } from 'react-router-dom'
import { BadgeCheck, Sparkles, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AuthLayout() {
  const { t } = useLanguage()

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-[rgb(var(--bg-soft))] p-10 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-35 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 65%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent)), transparent 65%)' }}
          aria-hidden
        />
        <Link to="/" className="relative flex items-center gap-2.5" aria-label="LocalJob">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-base font-extrabold text-white">
            LJ
          </span>
          <span className="text-lg font-bold tracking-tight text-fg">
            Local<span className="text-primary">Job</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-fg">{t('hero.title')}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{t('hero.subtitle')}</p>

          <ul className="mt-8 space-y-3.5">
            {[
              { icon: <Users size={16} />, text: t('how.step1.text') },
              { icon: <Sparkles size={16} />, text: t('how.step2.text') },
              { icon: <BadgeCheck size={16} />, text: t('how.step4.text') },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-subtle">{t('brand.tagline')}</p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="LocalJob">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-white">
              LJ
            </span>
            <span className="text-base font-bold tracking-tight text-fg">
              Local<span className="text-primary">Job</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
