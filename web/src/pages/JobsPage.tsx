import { useState } from 'react'
import { SlidersHorizontal, SearchX } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useJobSearch } from '@/hooks/useJobSearch'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFiltersPanel } from '@/components/jobs/JobFilters'
import { SearchBar } from '@/components/jobs/SearchBar'
import { EmptyState, JobCardSkeleton, Pagination } from '@/components/ui/misc'
import { BottomSheet } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'

export default function JobsPage() {
  const { t } = useLanguage()
  const { filters, data, loading, write, reset, activeFilterCount } = useJobSearch()
  const [sheetOpen, setSheetOpen] = useState(false)

  const facets = data?.facets

  return (
    <div className="bg-bg-soft pb-16">
      <div className="sticky top-16 z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className="lj-container py-3.5">
          <SearchBar initialSearch={filters.search} initialLocation={filters.location} size="md" />
        </div>
      </div>

      <div className="lj-container py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="lj-card sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto p-5">
              <JobFiltersPanel filters={filters} onChange={write} onReset={reset} facets={facets} />
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold text-fg">{t('jobs.title')}</h1>
                <p className="mt-1 text-sm text-muted" aria-live="polite">
                  {loading ? t('common.loading') : t('jobs.resultsCount', { count: data?.total ?? 0 })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  icon={<SlidersHorizontal size={15} />}
                  onClick={() => setSheetOpen(true)}
                >
                  {t('jobs.mobileFilters')}
                  {activeFilterCount > 0 ? (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-[11px] text-primary-fg">{activeFilterCount}</span>
                  ) : null}
                </Button>
                <Select
                  aria-label={t('jobs.sortBy')}
                  value={filters.sort}
                  onChange={(event) => write({ sort: event.target.value as typeof filters.sort, page: 1 })}
                  options={[
                    { value: 'recent', label: t('jobs.sort.recent') },
                    { value: 'salary', label: t('jobs.sort.salary') },
                    { value: 'relevant', label: t('jobs.sort.relevant') },
                  ]}
                  className="h-9 w-auto min-w-[170px] text-[13px]"
                />
              </div>
            </div>

            {activeFilterCount > 0 ? (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {filters.categories.map((category) => (
                  <FilterChip
                    key={category}
                    label={category}
                    onRemove={() => write({ categories: filters.categories.filter((item) => item !== category), page: 1 })}
                  />
                ))}
                {filters.employmentTypes.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    onRemove={() => write({ employmentTypes: filters.employmentTypes.filter((item) => item !== type), page: 1 })}
                  />
                ))}
                {filters.experienceLevels.map((level) => (
                  <FilterChip
                    key={level}
                    label={level}
                    onRemove={() => write({ experienceLevels: filters.experienceLevels.filter((item) => item !== level), page: 1 })}
                  />
                ))}
                {filters.remote ? <FilterChip label={t('jobs.remoteOnly')} onRemove={() => write({ remote: false, page: 1 })} /> : null}
                {filters.salaryMin || filters.salaryMax ? (
                  <FilterChip
                    label={`${filters.salaryMin ?? 0} – ${filters.salaryMax ?? '∞'} UZS`}
                    onRemove={() => write({ salaryMin: null, salaryMax: null, page: 1 })}
                  />
                ) : null}
                <button type="button" onClick={reset} className="text-xs font-medium text-primary hover:underline">
                  {t('jobs.clear')}
                </button>
              </div>
            ) : null}

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </div>
            ) : (data?.items.length ?? 0) === 0 ? (
              <EmptyState
                icon={<SearchX size={24} />}
                title={t('jobs.empty.title')}
                description={t('jobs.empty.text')}
                actionLabel={t('jobs.empty.cta')}
                onAction={reset}
              />
            ) : (
              <>
                <div className="space-y-3">
                  {data?.items.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination
                    page={data?.page ?? 1}
                    pages={data?.pages ?? 1}
                    onChange={(page) => write({ page })}
                    labels={{ prev: t('common.prev'), next: t('common.next'), page: t('common.page'), of: t('common.of') }}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={t('jobs.filters')}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={reset}>
              {t('jobs.clear')}
            </Button>
            <Button onClick={() => setSheetOpen(false)}>{t('jobs.applyFilters')}</Button>
          </div>
        }
      >
        <JobFiltersPanel filters={filters} onChange={write} onReset={reset} facets={facets} />
      </BottomSheet>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-primary-hover">
        ×
      </button>
    </span>
  )
}
