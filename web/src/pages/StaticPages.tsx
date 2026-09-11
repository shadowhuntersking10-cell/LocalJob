import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Search,
  Send,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, SectionHeading } from '@/components/ui/misc'
import { Input, Textarea } from '@/components/ui/field'
import { isEmail } from '@/lib/utils'

function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <section className="border-b border-line bg-bg-soft">
        <div className="lj-container py-12 sm:py-16">
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p> : null}
          <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p> : null}
        </div>
      </section>
      <div className="lj-container py-10 sm:py-14">{children}</div>
    </div>
  )
}

export function HowItWorksPage() {
  const { t } = useLanguage()
  const steps = [
    { icon: <UserPlus size={20} />, title: t('how.step1.title'), text: t('how.step1.text') },
    { icon: <Search size={20} />, title: t('how.step2.title'), text: t('how.step2.text') },
    { icon: <Send size={20} />, title: t('how.step3.title'), text: t('how.step3.text') },
    { icon: <BadgeCheck size={20} />, title: t('how.step4.title'), text: t('how.step4.text') },
  ]

  return (
    <PageShell eyebrow="LocalJob" title={t('how.title')} subtitle={t('how.subtitle')}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={step.title} className="relative p-5">
            <span className="absolute right-4 top-4 text-3xl font-extrabold text-line">{index + 1}</span>
            <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">{step.icon}</span>
            <h2 className="mt-4 text-base font-semibold text-fg">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <SectionHeading title={t('nav.jobs')} subtitle={t('popular.subtitle')} />
          <ul className="mt-4 space-y-2.5">
            {[t('jobs.remoteOnly'), t('jobs.salaryRange'), t('jobs.sort.relevant'), t('dash.recommended')].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-muted">
                <CheckCircle2 size={15} className="text-success" /> {item}
              </li>
            ))}
          </ul>
          <ButtonLink to="/jobs" className="mt-5" size="sm">
            {t('featured.viewAll')}
          </ButtonLink>
        </Card>
        <Card className="p-6">
          <SectionHeading title={t('nav.employers')} subtitle={t('cta.text')} />
          <ul className="mt-4 space-y-2.5">
            {[t('emp.postNewJob'), t('emp.candidates'), t('emp.activeListings'), t('admin.statusBreakdown')].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-muted">
                <CheckCircle2 size={15} className="text-success" /> {item}
              </li>
            ))}
          </ul>
          <ButtonLink to="/employer/jobs/new" className="mt-5" size="sm">
            {t('cta.postJob')}
          </ButtonLink>
        </Card>
      </div>
    </PageShell>
  )
}

export function ForEmployersPage() {
  const { t } = useLanguage()
  const features = [
    { icon: <Rocket size={18} />, title: t('emp.postNewJob'), text: t('cta.text') },
    { icon: <Users size={18} />, title: t('emp.candidates'), text: t('emp.candidates.subtitle') },
    { icon: <Sparkles size={18} />, title: t('dash.recommended'), text: t('jobs.match', { score: 92 }) },
    { icon: <FileText size={18} />, title: t('admin.export'), text: t('admin.subtitle') },
  ]

  return (
    <PageShell eyebrow={t('nav.employers')} title={t('cta.title')} subtitle={t('cta.text')}>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="p-5">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-accent/12 text-accent">{feature.icon}</span>
            <h2 className="mt-3.5 text-base font-semibold text-fg">{feature.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.text}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-fg">{t('cta.title')}</h2>
          <p className="mt-1 text-sm text-muted">{t('footer.botText')}</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink to="/register">{t('nav.createAccount')}</ButtonLink>
          <ButtonLink to="/employer/jobs/new" variant="secondary">
            {t('cta.postJob')}
          </ButtonLink>
        </div>
      </Card>
    </PageShell>
  )
}

export function AboutPage() {
  const { t } = useLanguage()
  const stats = [
    { label: t('hero.stat.jobs'), value: '37+' },
    { label: t('hero.stat.companies'), value: '8' },
    { label: t('hero.stat.candidates'), value: '12k+' },
    { label: t('hero.stat.hires'), value: '3.4k' },
  ]
  return (
    <PageShell eyebrow="LocalJob" title={t('common.aboutLocalJob')} subtitle={t('common.aboutText')}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5 text-center">
            <p className="text-2xl font-bold text-fg">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-subtle">{stat.label}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-8 p-6">
        <SectionHeading title={t('brand.tagline')} />
        <p className="mt-3 text-sm leading-relaxed text-muted">{t('common.contactText')}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ButtonLink to="/jobs" size="sm">
            {t('nav.jobs')}
          </ButtonLink>
          <ButtonLink to="/contact" variant="secondary" size="sm">
            {t('footer.contact')}
          </ButtonLink>
        </div>
      </Card>
    </PageShell>
  )
}

export function ContactPage() {
  const { t } = useLanguage()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = t('error.required')
    if (!isEmail(form.email)) next.email = t('error.email')
    if (form.message.trim().length < 10) next.message = t('error.required')
    setErrors(next)
    if (Object.keys(next).length) return
    toast.success(t('common.messageSent'))
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <PageShell eyebrow={t('footer.contact')} title={t('common.contactTitle')} subtitle={t('common.contactText')}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-6">
          <div className="grid gap-4">
            <Input
              label={t('auth.fullName')}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={errors.name}
              required
            />
            <Input
              label={t('auth.email')}
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              error={errors.email}
              required
            />
            <Textarea
              label={t('common.message')}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              error={errors.message}
              rows={6}
              maxLength={1200}
              counter
              required
            />
            <div>
              <Button onClick={submit} icon={<Send size={15} />}>
                {t('common.sendMessage')}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeading title="LocalJob" subtitle={t('brand.tagline')} />
          <ul className="mt-5 space-y-3.5 text-sm">
            <li className="flex items-center gap-3 text-muted">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                <Mail size={16} />
              </span>
              support@localjob.uz
            </li>
            <li className="flex items-center gap-3 text-muted">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                <Phone size={16} />
              </span>
              +998 71 200 30 40
            </li>
            <li className="flex items-center gap-3 text-muted">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                <MapPin size={16} />
              </span>
              {t('jobs.location')}: Tashkent, Uzbekistan
            </li>
            <li className="flex items-center gap-3 text-muted">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                <Briefcase size={16} />
              </span>
              <Link to="/jobs" className="lj-link">
                {t('nav.jobs')}
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </PageShell>
  )
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useLanguage()
  const title = kind === 'privacy' ? t('common.privacyTitle') : t('common.termsTitle')
  const sections =
    kind === 'privacy'
      ? [
          { title: t('settings.account'), text: t('settings.deleteWarning') },
          { title: t('settings.privacy'), text: t('settings.privacyProfile') },
          { title: t('settings.notifications'), text: t('settings.notifApplications') },
          { title: t('common.contactTitle'), text: t('common.contactText') },
        ]
      : [
          { title: t('settings.account'), text: t('auth.termsNote') },
          { title: t('nav.employers'), text: t('cta.text') },
          { title: t('nav.jobs'), text: t('jobs.empty.text') },
          { title: t('common.contactTitle'), text: t('common.contactText') },
        ]

  return (
    <PageShell eyebrow="LocalJob" title={title} subtitle={t('footer.rights')}>
      <Card className="p-6">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-fg">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{section.text}</p>
            </section>
          ))}
        </div>
      </Card>
    </PageShell>
  )
}

export function PrivacyPage() {
  return <LegalPage kind="privacy" />
}

export function TermsPage() {
  return <LegalPage kind="terms" />
}
