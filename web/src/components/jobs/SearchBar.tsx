import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'
import { useMeta } from '@/hooks/useMeta'
import { Button } from '@/components/ui/button'

export function SearchBar({
  initialSearch = '',
  initialLocation = '',
  size = 'lg',
  className,
}: {
  initialSearch?: string
  initialLocation?: string
  size?: 'md' | 'lg'
  className?: string
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { meta } = useMeta()
  const [search, setSearch] = useState(initialSearch)
  const [location, setLocation] = useState(initialLocation)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (location.trim()) params.set('location', location.trim())
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        'flex w-full flex-col gap-2 rounded-lg border border-line bg-card p-2 shadow-card sm:flex-row sm:items-center',
        size === 'lg' && 'sm:p-2.5',
        className,
      )}
    >
      <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-3 py-2 focus-within:bg-card-2 sm:py-2.5">
        <Search size={18} className="shrink-0 text-subtle" aria-hidden />
        <span className="sr-only">{t('hero.searchPlaceholder')}</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('hero.searchHint')}
          className="w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
          aria-label={t('hero.searchPlaceholder')}
        />
      </label>

      <span className="hidden h-8 w-px bg-line sm:block" aria-hidden />

      <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-3 py-2 focus-within:bg-card-2 sm:py-2.5">
        <MapPin size={18} className="shrink-0 text-subtle" aria-hidden />
        <span className="sr-only">{t('hero.locationPlaceholder')}</span>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder={t('hero.locationHint')}
          list="localjob-locations"
          className="w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
          aria-label={t('hero.locationPlaceholder')}
        />
        <datalist id="localjob-locations">
          {(meta?.locations ?? []).map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </label>

      <Button type="submit" size={size === 'lg' ? 'lg' : 'md'} className="sm:px-6">
        {t('hero.search')}
      </Button>
    </form>
  )
}
