import type { ReactNode } from 'react'
import { BadgeCheck, Building2 } from 'lucide-react'
import { cn, initials } from '@/lib/utils'

type Tone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'primary'

const TONES: Record<Tone, string> = {
  default: 'border-line bg-card-2 text-muted',
  info: 'border-info/25 bg-info/10 text-info',
  success: 'border-success/25 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/12 text-warning',
  danger: 'border-danger/25 bg-danger/10 text-danger',
  accent: 'border-accent/30 bg-accent/10 text-accent',
  primary: 'border-primary/30 bg-primary/10 text-primary',
}

export function Badge({
  children,
  tone = 'default',
  className,
  icon,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  icon?: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

export function Avatar({
  name,
  src,
  size = 40,
  color,
  className,
  rounded = 'full',
}: {
  name?: string | null
  src?: string | null
  size?: number
  color?: string
  className?: string
  rounded?: 'full' | 'md'
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} avatar` : 'Avatar'}
        width={size}
        height={size}
        className={cn('shrink-0 object-cover', rounded === 'full' ? 'rounded-full' : 'rounded-md', className)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      aria-hidden={!name}
      className={cn(
        'grid shrink-0 place-items-center font-semibold text-white',
        rounded === 'full' ? 'rounded-full' : 'rounded-md',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.36),
        background: color || 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))',
      }}
    >
      {initials(name)}
    </span>
  )
}

export function CompanyLogo({
  name,
  logo,
  color,
  size = 48,
  className,
}: {
  name?: string | null
  logo?: string | null
  color?: string
  size?: number
  className?: string
}) {
  const label = (logo || initials(name) || '').slice(0, 3)
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-md font-bold text-white', className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.32),
        background: color ? `${color}` : 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))',
      }}
    >
      {label || <Building2 size={size * 0.42} />}
    </span>
  )
}

export function VerifiedBadge({ label }: { label: string }) {
  return (
    <Badge tone="accent" icon={<BadgeCheck size={13} />}>
      {label}
    </Badge>
  )
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-card-2', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function MatchRing({ score, size = 44, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, score)) / 100
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(var(--line))" strokeWidth="3.5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-fg">{score}%</span>
    </div>
  )
}
