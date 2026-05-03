import type { Settings } from '../../lib/api'
import { AppIcon } from '../../components/AppIcon'
import { Input } from '../../components/Input'

type SettingToggleCardProps = {
  icon: string
  title: string
  checked: boolean
  disabled?: boolean
  onToggle: () => void
}

type SegmentedOption<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  icon: string
  title: string
  value: T
  options: SegmentedOption<T>[]
  disabled?: boolean
  onChange: (value: T) => void
}

type NumberControlProps = {
  icon: string
  title: string
  value: number
  min: number
  max: number
  suffix?: string
  disabled?: boolean
  onChange: (value: number) => void
}

const sectionItemClassName = 'rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface'
const rowIconClassName = 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant'

export function SettingToggleCard({ icon, title, checked, disabled = false, onToggle }: SettingToggleCardProps) {
  return (
    <div className={`${sectionItemClassName} flex items-center justify-between gap-3`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={rowIconClassName}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        onClick={onToggle}
        disabled={disabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${checked ? 'bg-primary dark:bg-accent' : 'bg-outline/80 dark:bg-dark-outline'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

export function SegmentedControl<T extends string>({
  icon,
  title,
  value,
  options,
  disabled = false,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className={sectionItemClassName}>
      <div className="flex items-start gap-3">
        <div className={rowIconClassName}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option.value)}
                className={`rounded-xl border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${value === option.value ? 'bg-on-background text-white border-on-background dark:bg-dark-on-background dark:text-dark-background dark:border-dark-on-background' : 'bg-transparent border-outline text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant dark:border-dark-outline dark:text-dark-on-surface-variant dark:hover:text-dark-on-surface dark:hover:border-dark-on-surface-variant'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NumberControl({
  icon,
  title,
  value,
  min,
  max,
  suffix = '',
  disabled = false,
  onChange,
}: NumberControlProps) {
  return (
    <div className={sectionItemClassName}>
      <div className="flex items-start gap-3">
        <div className={rowIconClassName}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
            <span className="shrink-0 text-xs font-medium text-on-surface-variant dark:text-dark-on-surface-variant">
              {min}-{max}{suffix}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Input
              type="number"
              min={min}
              max={max}
              step={1}
              value={value}
              disabled={disabled}
              onChange={(event) => onChange(Number(event.target.value))}
              className="min-h-10"
            />
            {suffix ? <span className="shrink-0 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{suffix}</span> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function saveSetting<K extends keyof Omit<Settings, 'updatedAt'>>(
  mutate: (payload: Partial<Omit<Settings, 'updatedAt'>>) => void,
  key: K,
  value: Settings[K],
) {
  mutate({ [key]: value })
}

export function normalizeNumberSetting(value: string, min: number, max: number) {
  if (!value.trim()) {
    return min
  }

  const next = Number(value)

  if (!Number.isFinite(next)) {
    return min
  }

  return Math.max(min, Math.min(max, Math.round(next)))
}
