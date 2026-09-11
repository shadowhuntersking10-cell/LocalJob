import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { AlertCircle, Check, Eye, EyeOff, UploadCloud, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Label({
  htmlFor,
  children,
  hint,
  required,
  className,
}: {
  htmlFor?: string
  children: ReactNode
  hint?: string
  required?: boolean
  className?: string
}) {
  return (
    <label htmlFor={htmlFor} className={cn('lj-label flex items-center gap-2', className)}>
      <span>
        {children}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {hint ? <span className="text-xs font-normal text-subtle">{hint}</span> : null}
    </label>
  )
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger" role="alert">
      <AlertCircle size={13} aria-hidden />
      {children}
    </p>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, className, containerClassName, id, required, type = 'text', ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const isPassword = type === 'password'
  const [revealed, setRevealed] = useState(false)

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <Label htmlFor={inputId} required={required} hint={hint}>
          {label}
        </Label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" aria-hidden>
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'lj-input',
            icon && 'pl-10',
            isPassword && 'pr-11',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-subtle transition-colors hover:bg-card-2 hover:text-fg"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>
      <span id={`${inputId}-error`}>
        <FieldError>{error}</FieldError>
      </span>
    </div>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  counter?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, required, counter, maxLength, value, ...props },
  ref,
) {
  const generatedId = useId()
  const textareaId = id || generatedId
  const length = typeof value === 'string' ? value.length : 0

  return (
    <div className="w-full">
      {label ? (
        <div className="flex items-baseline justify-between">
          <Label htmlFor={textareaId} required={required} hint={hint}>
            {label}
          </Label>
          {counter && maxLength ? (
            <span className="mb-1.5 text-xs text-subtle">
              {length}/{maxLength}
            </span>
          ) : null}
        </div>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full rounded-md border border-line bg-card px-3.5 py-3 text-sm text-fg placeholder:text-subtle transition-colors',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
        rows={4}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </div>
  )
})

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, placeholder, className, id, required, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id || generatedId
  return (
    <div className="w-full">
      {label ? (
        <Label htmlFor={selectId} required={required} hint={hint}>
          {label}
        </Label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-11 w-full appearance-none rounded-md border border-line bg-card px-3.5 pr-9 text-sm text-fg transition-colors',
          'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%2394A4C2\' stroke-width=\'1.8\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
          error && 'border-danger',
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError>{error}</FieldError>
    </div>
  )
})

export function Checkbox({
  checked,
  onChange,
  label,
  error,
  id,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  error?: string
  id?: string
}) {
  const generatedId = useId()
  const checkboxId = id || generatedId
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          id={checkboxId}
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px] border transition-colors',
            checked ? 'border-primary bg-primary text-primary-fg' : 'border-line-strong bg-card hover:border-primary',
          )}
        >
          {checked ? <Check size={13} strokeWidth={3} /> : null}
        </button>
        <label htmlFor={checkboxId} className="cursor-pointer text-sm leading-snug text-muted">
          {label}
        </label>
      </div>
      <FieldError>{error}</FieldError>
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">{label}</p>
        {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-line-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

export function FileUpload({
  file,
  onSelect,
  onClear,
  error,
  label,
  hint,
  chooseLabel,
  maxSizeMb = 5,
}: {
  file: File | null
  onSelect: (file: File) => void
  onClear: () => void
  error?: string
  label?: string
  hint?: string
  chooseLabel: string
  maxSizeMb?: number
}) {
  const inputId = useId()
  return (
    <div>
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-card-2 px-4 py-6 text-center transition-colors hover:border-primary/60',
          error && 'border-danger',
        )}
      >
        {file ? (
          <div className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-card px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Check size={16} />
              </span>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium text-fg">{file.name}</p>
                <p className="text-xs text-subtle">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="rounded-md p-1.5 text-subtle transition-colors hover:bg-card-2 hover:text-danger"
              aria-label="Remove file"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="mb-2 h-7 w-7 text-subtle" aria-hidden />
            <input
              id={inputId}
              type="file"
              accept=".pdf,.doc,.docx,.txt,application/pdf"
              className="sr-only"
              onChange={(event) => {
                const selected = event.target.files?.[0]
                if (selected) onSelect(selected)
              }}
            />
            <label
              htmlFor={inputId}
              className="inline-flex h-9 cursor-pointer select-none items-center gap-1.5 rounded-md border border-line bg-card px-3 text-[13px] font-medium text-fg transition-colors hover:border-line-strong"
            >
              {chooseLabel}
            </label>
            <p className="mt-2 text-xs text-subtle">{hint}</p>
            <p className="sr-only">Max size {maxSizeMb} MB</p>
          </>
        )}
      </div>
      <FieldError>{error}</FieldError>
    </div>
  )
}
