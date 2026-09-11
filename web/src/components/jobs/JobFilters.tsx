import { type ChangeEvent } from 'react'
import { RotateCcw } from 'lucide-react'
import type { Facet, JobFilters as Filters } from '@/types'
import { cn, categoryLabel, employmentLabel, experienceLabel, formatSalary } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'
import { Checkbox, Input } from '@/components/ui/field'

const SALARY_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: '≤ 8 mln', max: 8_000_000 },
  { label: '8–15 mln', min: 8_000_000, max: 15_000_000 },
  { label: '15–25 mln', min: 15_000_000, max: 25_000_000 },
  { label: '25 mln +', min: 25_000_000 },
]

interface Props {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
  facets?: {
    categories: Facet[]
    locations: Facet[]
    employmentTypes: Facet[]
    experienceLevels: Facet[]
  }
  className?: string
}

export function JobFiltersPanel({ filters, onChange, onReset, facets, className }: Props) {
  const { t, lang } = useLanguage()

  const toggleValue = (key: 'categories' | 'employmentTypes' | 'experienceLevels', value: string) => {
    const current = filters[key]
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    onChange({ [key]: next, page: 1 } as Partial<Filters>)
  }

  const salaryMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? Number(event.target.value) : null
    onChange({ salaryMin: value, page: 1 })
  }
  const salaryMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? Number(event.target.value) : null
    onChange({ salaryMax: value, page: 1 })
  }

  const activeCount =
    filters.categories.length + filters.employmentTypes.length + filters.experienceLevels.length + (filters.remote ? 1 : 0)

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">{t('jobs.filters')}</h2>
        <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={onReset} disabled={!activeCount}>
          {t('jobs.clear')}
        </Button>
      </div>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle">{t('jobs.category')}</h3>
        <div className="space-y-1.5">
          {(facets?.categories?.length
            ? facets.categories.map((facet) => ({ value: facet.value, count: facet.count }))
            : []
          ).map((item) => (
            <label
              key={item.value}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-card-2"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line-strong accent-[rgb(var(--primary))]"
                  checked={filters.categories.includes(item.value)}
                  onChange={() => toggleValue('categories', item.value)}
                />
                <span className="text-sm text-muted">{categoryLabel(item.value, lang)}</span>
              </span>
              <span className="text-xs text-subtle">{item.count}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle">{t('jobs.employmentType')}</h3>
        <div className="space-y-1.5">
          {(facets?.employmentTypes ?? []).map((item) => (
            <label
              key={item.value}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-card-2"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line-strong accent-[rgb(var(--primary))]"
                  checked={filters.employmentTypes.includes(item.value)}
                  onChange={() => toggleValue('employmentTypes', item.value)}
                />
                <span className="text-sm text-muted">{employmentLabel(item.value, lang)}</span>
              </span>
              <span className="text-xs text-subtle">{item.count}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle">{t('jobs.experience')}</h3>
        <div className="flex flex-wrap gap-1.5">
          {(facets?.experienceLevels ?? []).map((item) => {
            const active = filters.experienceLevels.includes(item.value)
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleValue('experienceLevels', item.value)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-line bg-card text-muted hover:border-line-strong hover:text-fg',
                )}
              >
                {experienceLabel(item.value, lang)} · {item.count}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-subtle">{t('jobs.salaryRange')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={filters.salaryMin ?? ''}
            onChange={salaryMinChange}
            aria-label={`${t('jobs.salaryRange')} min`}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={filters.salaryMax ?? ''}
            onChange={salaryMaxChange}
            aria-label={`${t('jobs.salaryRange')} max`}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SALARY_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ salaryMin: preset.min ?? null, salaryMax: preset.max ?? null, page: 1 })}
              className="rounded-full border border-line bg-card px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-subtle">
          {filters.salaryMin || filters.salaryMax
            ? `${formatSalary(filters.salaryMin ?? 0)} — ${formatSalary(filters.salaryMax ?? 0)}`
            : 'UZS'}
        </p>
      </section>

      <section className="border-t border-line pt-4">
        <Checkbox
          checked={filters.remote}
          onChange={(checked) => onChange({ remote: checked, page: 1 })}
          label={t('jobs.remoteOnly')}
        />
      </section>
    </div>
  )
}
