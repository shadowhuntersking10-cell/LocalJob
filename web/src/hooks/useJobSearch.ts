import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { backend } from '@/services/backend'
import type { JobFilters, JobListResponse } from '@/types'

const DEFAULT_FILTERS: JobFilters = {
  search: '',
  location: '',
  categories: [],
  employmentTypes: [],
  experienceLevels: [],
  salaryMin: null,
  salaryMax: null,
  remote: false,
  sort: 'recent',
  page: 1,
  pageSize: 10,
}

/** URL-driven job search: /jobs?search=react&location=tashkent&category=IT&page=2 */
export function useJobSearch() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState<JobListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const filters = useMemo<JobFilters>(() => {
    const read = (key: string) => params.get(key) ?? ''
    const list = (key: string) => read(key).split(',').filter(Boolean)
    const sort = read('sort')
    return {
      search: read('search'),
      location: read('location'),
      categories: list('category'),
      employmentTypes: list('employmentType'),
      experienceLevels: list('experienceLevel'),
      salaryMin: read('salaryMin') ? Number(read('salaryMin')) : null,
      salaryMax: read('salaryMax') ? Number(read('salaryMax')) : null,
      remote: read('remote') === '1' || read('remote') === 'true',
      sort: sort === 'salary' || sort === 'relevant' ? sort : 'recent',
      page: read('page') ? Math.max(1, Number(read('page'))) : 1,
      pageSize: 10,
    }
  }, [params])

  const write = useCallback(
    (patch: Partial<JobFilters>, replace = false) => {
      const next = { ...filters, ...patch }
      const search = new URLSearchParams()
      if (next.search) search.set('search', next.search)
      if (next.location) search.set('location', next.location)
      if (next.categories.length) search.set('category', next.categories.join(','))
      if (next.employmentTypes.length) search.set('employmentType', next.employmentTypes.join(','))
      if (next.experienceLevels.length) search.set('experienceLevel', next.experienceLevels.join(','))
      if (next.salaryMin) search.set('salaryMin', String(next.salaryMin))
      if (next.salaryMax) search.set('salaryMax', String(next.salaryMax))
      if (next.remote) search.set('remote', '1')
      if (next.sort && next.sort !== 'recent') search.set('sort', next.sort)
      if (next.page && next.page > 1) search.set('page', String(next.page))
      setParams(search, { replace })
    },
    [filters, setParams],
  )

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: false }), [setParams])

  const activeFilterCount =
    filters.categories.length +
    filters.employmentTypes.length +
    filters.experienceLevels.length +
    (filters.remote ? 1 : 0) +
    (filters.salaryMin || filters.salaryMax ? 1 : 0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    backend
      .jobs({
        search: filters.search || undefined,
        location: filters.location || undefined,
        category: filters.categories.length ? filters.categories : undefined,
        employmentType: filters.employmentTypes.length ? filters.employmentTypes : undefined,
        experienceLevel: filters.experienceLevels.length ? filters.experienceLevels : undefined,
        salaryMin: filters.salaryMin || undefined,
        salaryMax: filters.salaryMax || undefined,
        remote: filters.remote || undefined,
        sort: filters.sort,
        page: filters.page,
        pageSize: filters.pageSize,
      })
      .then((result) => {
        if (active) setData(result)
      })
      .catch((caught) => {
        if (active) setError(caught)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [filters])

  return { filters, data, loading, error, write, reset, activeFilterCount, defaults: DEFAULT_FILTERS }
}
