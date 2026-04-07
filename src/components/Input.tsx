import { forwardRef, type InputHTMLAttributes } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={`min-h-11 w-full rounded-xl border border-outline/70 bg-surface px-3.5 py-2.5 text-sm text-on-background outline-none transition-[border-color,background-color] placeholder:text-on-surface-variant/80 focus:border-outline focus:bg-surface-elevated dark:border-dark-outline/70 dark:bg-dark-surface dark:text-dark-on-background dark:focus:border-dark-outline dark:focus:bg-dark-surface-elevated ${className}`}
    />
  )
})
