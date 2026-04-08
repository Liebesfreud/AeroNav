import * as SelectPrimitive from '@radix-ui/react-select'
import { AppIcon } from './AppIcon'

type SelectOption<T extends string = string> = {
  value: T
  label: string
  disabled?: boolean
}

export function Select<T extends string = string>({
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false,
  variant = 'field',
  triggerClassName = '',
  contentClassName = '',
  ariaLabel,
}: {
  value: T
  onValueChange: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  disabled?: boolean
  variant?: 'field' | 'inline'
  triggerClassName?: string
  contentClassName?: string
  ariaLabel?: string
}) {
  const triggerClassNameByVariant = variant === 'inline'
    ? 'min-h-0 gap-1 border-none bg-transparent px-0 py-0 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant shadow-none focus:ring-0 dark:text-dark-on-surface-variant'
    : 'min-h-11 w-full gap-2 rounded-xl border border-outline/70 bg-surface px-3.5 py-2.5 text-sm text-on-background shadow-none transition-[border-color,background-color] focus:border-outline focus:bg-surface-elevated focus:ring-0 dark:border-dark-outline/70 dark:bg-dark-surface dark:text-dark-on-background dark:focus:border-dark-outline dark:focus:bg-dark-surface-elevated'

  return (
    <SelectPrimitive.Root value={value} onValueChange={(nextValue) => onValueChange(nextValue as T)} disabled={disabled}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-between rounded-xl outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-on-surface-variant/80 dark:data-[placeholder]:text-dark-on-surface-variant/80 ${triggerClassNameByVariant} ${triggerClassName}`}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="shrink-0 text-on-surface-variant dark:text-dark-on-surface-variant">
          <AppIcon name="unfold_more" className="h-[18px] w-[18px]" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className={`z-50 overflow-hidden rounded-2xl border border-outline/70 bg-surface p-1 shadow-[0_18px_46px_-30px_rgba(15,23,42,0.3)] dark:border-dark-outline/70 dark:bg-dark-surface-elevated ${contentClassName}`}
        >
          <SelectPrimitive.Viewport className="min-w-[var(--radix-select-trigger-width)] p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex min-h-10 cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm text-on-surface outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-surface-container-low data-[highlighted]:text-on-background dark:text-dark-on-surface dark:data-[highlighted]:bg-dark-surface-container/80 dark:data-[highlighted]:text-dark-on-background"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex items-center text-primary dark:text-accent">
                  <AppIcon name="check" className="h-[18px] w-[18px]" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export type { SelectOption }
