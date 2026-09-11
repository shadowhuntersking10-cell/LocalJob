import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, Send } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const columns = [
    {
      title: t('footer.product'),
      links: [
        { to: '/jobs', label: t('nav.jobs') },
        { to: '/companies', label: t('nav.companies') },
        { to: '/for-employers', label: t('nav.employers') },
        { to: '/how-it-works', label: t('nav.howItWorks') },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { to: '/about', label: t('footer.about') },
        { to: '/contact', label: t('footer.contact') },
        { to: '/jobs?category=IT', label: t('nav.jobs') },
        { to: '/register', label: t('nav.createAccount') },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { to: '/privacy', label: t('footer.privacy') },
        { to: '/terms', label: t('footer.terms') },
        { to: '/settings', label: t('nav.settings') },
      ],
    },
  ]

  return (
    <footer className="mt-16 border-t border-line bg-bg-soft">
      <div className="lj-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2.5" aria-label="LocalJob">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-[15px] font-extrabold text-white">
                LJ
              </span>
              <span className="text-[17px] font-bold tracking-tight text-fg">
                Local<span className="text-primary">Job</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{t('brand.tagline')}</p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://t.me/LocalJobUzBot"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary"
                aria-label="Telegram"
              >
                <Send size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:support@localjob.uz"
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-card text-muted transition-colors hover:text-primary"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
            <p className="mt-4 text-xs text-subtle">{t('footer.botText')}</p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-fg">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.to}-${link.label}`}>
                    <Link to={link.to} className="text-sm text-muted transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} LocalJob. {t('footer.rights')}
          </p>
          <p className="flex items-center gap-3">
            <Link to="/privacy" className="transition-colors hover:text-fg">
              {t('footer.privacy')}
            </Link>
            <span aria-hidden>·</span>
            <Link to="/terms" className="transition-colors hover:text-fg">
              {t('footer.terms')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
