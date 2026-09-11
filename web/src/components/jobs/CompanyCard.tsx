import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import type { Company } from '@/types'
import { CompanyLogo, VerifiedBadge } from '@/components/ui/badge'
import { useLanguage } from '@/context/LanguageContext'

export function CompanyCard({ company }: { company: Company }) {
  const { t } = useLanguage()
  return (
    <Link
      to={`/company/${company.id}`}
      className="lj-card group flex flex-col p-5 transition-all hover:border-line-strong hover:shadow-pop"
    >
      <div className="flex items-start gap-3.5">
        <CompanyLogo name={company.name} logo={company.logo} color={company.color} size={46} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-fg group-hover:text-primary">{company.name}</h3>
            {company.verified ? <VerifiedBadge label="" /> : null}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">{company.industry}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-subtle">
            <MapPin size={12} aria-hidden /> {company.location}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
        <span className="text-xs font-medium text-muted">
          {company.openJobsCount ?? 0} {t('company.openJobs').toLowerCase()}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
          {t('common.viewAll')} <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  )
}
