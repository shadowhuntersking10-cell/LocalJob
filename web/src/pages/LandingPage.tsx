import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Code2,
  GraduationCap,
  Handshake,
  Headphones,
  Landmark,
  Megaphone,
  Palette,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useMeta } from '@/hooks/useMeta'
import { SearchBar } from '@/components/jobs/SearchBar'
import { JobCard } from '@/components/jobs/JobCard'
import { SectionHeading, ListSkeleton } from '@/components/ui/misc'
import { ButtonLink } from '@/components/ui/button'
import { useAsync } from '@/hooks'
import { backend } from '@/services/backend'
import { CompanyCard } from '@/components/jobs/CompanyCard'

const ICONS: Record<string, JSX.Element> = {
  code: <Code2 size={18} />,
  palette: <Palette size={18} />,
  megaphone: <Megaphone size={18} />,
  'trending-up': <TrendingUp size={18} />,
  handshake: <Handshake size={18} />,
  landmark: <Landmark size={18} />,
  'graduation-cap': <GraduationCap size={18} />,
  headphones: <Headphones size={18} />,
}

export default function LandingPage() {
  const { t, lang } = useLanguage()
  const { meta } = useMeta()

  const featured = useAsync(
    () => backend.jobs({ pageSize: 6, sort: 'relevant' }),
    [],
  )
  const companies = useAsync(() => backend.companies({}), [])

  const labelFor = (item: { label_uz: string; label_en: string; label_ru: string }) =>
    lang === 'uz' ? item.label_uz : lang === 'ru' ? item.label_ru : item.label_en

  const steps = [
    { icon: <UserPlus size={18} />, title: t('how.step1.title'), text: t('how.step1.text') },
    { icon: <Briefcase size={18} />, title: t('how.step2.title'), text: t('how.step2.text') },
    { icon: <Sparkles size={18} />, title: t('how.step3.title'), text: t('how.step3.text') },
    { icon: <BadgeCheck size={18} />, title: t('how.step4.title'), text: t('how.step4.text') },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-bg-soft">
        <div
          className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 65%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent)), transparent 65%)' }}
          aria-hidden
        />

        <div className="lj-container relative py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-muted">
              <Users size={14} className="text-primary" aria-hidden />
              {t('hero.badge')}
            </span>
            <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight text-fg sm:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <SearchBar />
          </div>

          <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: t('hero.stat.jobs'), value: meta ? '37+' : '—' },
              { label: t('hero.stat.companies'), value: meta ? '8' : '—' },
              { label: t('hero.stat.candidates'), value: '12k+' },
              { label: t('hero.stat.hires'), value: '3.4k' },
            ].map((stat) => (
              <div key={stat.label} className="lj-card p-4 text-center">
                <dt className="text-xs font-medium uppercase tracking-wide text-subtle">{stat.label}</dt>
                <dd className="mt-1.5 text-xl font-bold text-fg">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Popular categories ───────────────────────────────────────── */}
      <section className="lj-container py-12 sm:py-16">
        <SectionHeading
          title={t('popular.title')}
          subtitle={t('popular.subtitle')}
          action={
            <ButtonLink to="/jobs" variant="ghost" size="sm" iconRight={<ArrowRight size={15} />}>
              {t('featured.viewAll')}
            </ButtonLink>
          }
        />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(meta?.popularCategories ?? []).map((category) => (
            <Link
              key={category.key}
              to={`/jobs?category=${encodeURIComponent(category.key)}`}
              className="lj-card group flex items-center gap-3 p-4 transition-all hover:border-primary/40 hover:shadow-pop"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-fg">
                {ICONS[category.icon] ?? <Briefcase size={18} />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-fg">{labelFor(category)}</span>
                <span className="mt-0.5 block text-xs text-subtle">
                  {category.count} {t('nav.jobs').toLowerCase()}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured jobs ────────────────────────────────────────────── */}
      <section className="border-y border-line bg-bg-soft py-12 sm:py-16">
        <div className="lj-container">
          <SectionHeading
            title={t('featured.title')}
            subtitle={t('featured.subtitle')}
            action={
              <ButtonLink to="/jobs" variant="secondary" size="sm" iconRight={<ArrowRight size={15} />}>
                {t('featured.viewAll')}
              </ButtonLink>
            }
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {featured.loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="lj-card p-5">
                    <div className="lj-skeleton h-4 w-2/3" />
                    <div className="lj-skeleton mt-3 h-3 w-1/3" />
                  </div>
                ))
              : (featured.data?.items ?? []).map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* ── Companies ────────────────────────────────────────────────── */}
      <section className="lj-container py-12 sm:py-16">
        <SectionHeading
          title={t('companies.title')}
          subtitle={t('companies.subtitle')}
          action={
            <ButtonLink to="/companies" variant="ghost" size="sm" iconRight={<ArrowRight size={15} />}>
              {t('common.viewAll')}
            </ButtonLink>
          }
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(companies.data?.items ?? []).slice(0, 4).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
          {companies.loading ? <ListSkeleton count={2} className="sm:col-span-2 lg:col-span-4" /> : null}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="border-y border-line bg-bg-soft py-12 sm:py-16">
        <div className="lj-container">
          <SectionHeading title={t('how.title')} subtitle={t('how.subtitle')} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="lj-card relative p-5">
                <span className="absolute right-4 top-4 text-3xl font-extrabold text-line">{index + 1}</span>
                <span className="grid h-11 w-11 place-items-center rounded-md bg-accent/12 text-accent">{step.icon}</span>
                <h3 className="mt-4 text-[15px] font-semibold text-fg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Employer CTA ─────────────────────────────────────────────── */}
      <section className="lj-container py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-xl border border-line bg-card p-8 sm:p-12">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgb(var(--primary)), transparent 65%)' }}
            aria-hidden
          />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card-2 px-3 py-1 text-xs font-medium text-muted">
                <Building2 size={13} /> {t('nav.employers')}
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{t('cta.title')}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-[15px]">{t('cta.text')}</p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <ButtonLink to="/employer/jobs/new" size="lg">
                {t('cta.postJob')}
              </ButtonLink>
              <ButtonLink to="/for-employers" variant="secondary" size="lg">
                {t('cta.learnMore')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
