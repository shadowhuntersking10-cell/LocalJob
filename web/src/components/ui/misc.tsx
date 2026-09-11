import type { ReactNode } from 'react'
import { Loader2, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, ButtonLink } from '@/components/ui/button'

export function Card({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'aside' }) {
  return <Tag className={cn('lj-card', className)}>{children}</Tag>
}

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1.5 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  variant = 'default',
}: {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionTo?: string
  variant?: 'default' | 'compact'
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-card/60 text-center',
        variant === 'compact' ? 'px-5 py-10' : 'px-6 py-16',
      )}
    >
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        {icon ?? <SearchX size={24} />}
      </span>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description ? <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</p> : null}
      {actionLabel ? (
        <div className="mt-5">
          {actionTo ? (
            <ButtonLink to={actionTo} size="sm">
              {actionLabel}
            </ButtonLink>
          ) : (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-muted', className)} role="status">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </span>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('lj-skeleton', className)} aria-hidden />
}

export function JobCardSkeleton() {
  return (
    <div className="lj-card p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="lj-card p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-14" />
        </div>
      ))}
    </div>
  )
}

export function Pagination({
  page,
  pages,
  onChange,
  labels,
}: {
  page: number
  pages: number
  onChange: (page: number) => void
  labels: { prev: string; next: string; page: string; of: string }
}) {
  if (pages <= 1) return null

  const windowSize = 2
  const items: (number | 'gap')[] = []
  for (let index = 1; index <= pages; index += 1) {
    if (index === 1 || index === pages || Math.abs(index - page) <= windowSize) {
      items.push(index)
    } else if (items[items.length - 1] !== 'gap') {
      items.push('gap')
    }
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-card px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50"
      >
        {labels.prev}
      </button>
      {items.map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-subtle">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'h-9 min-w-9 rounded-md border px-2.5 text-sm font-medium transition-colors',
              item === page
                ? 'border-primary bg-primary text-primary-fg'
                : 'border-line bg-card text-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-card px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-50"
      >
        {labels.next}
      </button>
      <span className="ml-1 hidden text-xs text-subtle sm:inline">
        {labels.page} {page} {labels.of} {pages}
      </span>
    </nav>
  )
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: string; label: string; count?: number }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('lj-scroll-x', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
            value === tab.value
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-line bg-card text-muted hover:border-line-strong hover:text-fg',
          )}
        >
          {tab.label}
          {typeof tab.count === 'number' ? (
            <span className="rounded-full bg-card-2 px-1.5 text-[11px] text-subtle">{tab.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-subtle">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden>/</span> : null}
          {item.to ? (
            <a href={item.to} className="transition-colors hover:text-fg">
              {item.label}
            </a>
          ) : (
            <span className="text-muted">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = 'primary',
  onClick,
  to,
}: {
  label: string
  value: string | number
  icon?: ReactNode
  hint?: string
  tone?: 'primary' | 'accent' | 'success' | 'warning'
  onClick?: () => void
  to?: string
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/12 text-warning',
  }

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
        {icon ? <span className={cn('grid h-9 w-9 place-items-center rounded-md', tones[tone])}>{icon}</span> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </>
  )

  if (to) {
    return (
      <a href={to} className="lj-card block p-4 transition-colors hover:border-line-strong">
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="lj-card p-4 text-left transition-colors hover:border-line-strong">
        {content}
      </button>
    )
  }

  return <div className="lj-card p-4">{content}</div>
}
