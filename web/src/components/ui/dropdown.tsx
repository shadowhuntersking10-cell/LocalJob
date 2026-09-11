import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useClickOutside } from '@/hooks'

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
  width = 240,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  children: ReactNode | ((close: () => void) => ReactNode)
  align?: 'left' | 'right'
  className?: string
  width?: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const close = () => setOpen(false)

  return (
    <div ref={ref} className={cn('relative', className)}>
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-2 overflow-hidden rounded-lg border border-line bg-card p-1.5 shadow-pop animate-slide-down',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          style={{ width }}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      ) : null}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger,
  active,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
  active?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
        danger ? 'text-danger hover:bg-danger/10' : 'text-fg hover:bg-card-2',
        active && 'bg-primary/10 text-primary',
      )}
    >
      {icon ? <span className="text-subtle [&_svg]:h-4 [&_svg]:w-4">{icon}</span> : null}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}

export function DropdownDivider() {
  return <div className="my-1.5 h-px bg-line" role="separator" />
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wide text-subtle">{children}</p>
}
