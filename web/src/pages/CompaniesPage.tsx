import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { backend } from '@/services/backend'
import { useDebounced, useAsync } from '@/hooks'
import { CompanyCard } from '@/components/jobs/CompanyCard'
import { EmptyState, ListSkeleton, SectionHeading } from '@/components/ui/misc'
import { Input } from '@/components/ui/field'

export default function CompaniesPage() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const debounced = useDebounced(search, 300)
  const companies = useAsync(() => backend.companies({ search: debounced || undefined }), [debounced])

  return (
    <div className="lj-container py-8">
      <SectionHeading title={t('companies.title')} subtitle={t('companies.subtitle')} />
      <div className="mt-5 max-w-md">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('companies.searchPlaceholder')}
          aria-label={t('companies.searchPlaceholder')}
        />
      </div>

      <div className="mt-6">
        {companies.loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="lj-card h-40 p-5">
                <div className="lj-skeleton h-11 w-11 rounded-md" />
                <div className="lj-skeleton mt-4 h-4 w-2/3" />
                <div className="lj-skeleton mt-3 h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (companies.data?.items.length ?? 0) === 0 ? (
          <EmptyState
            icon={<Building2 size={24} />}
            title={t('companies.empty')}
            description={t('jobs.empty.text')}
            actionLabel={t('nav.jobs')}
            actionTo="/jobs"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.data?.items.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
      {companies.loading ? <ListSkeleton count={1} className="hidden" /> : null}
    </div>
  )
}
