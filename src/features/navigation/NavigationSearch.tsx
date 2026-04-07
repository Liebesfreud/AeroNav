import { forwardRef } from 'react'
import { Select } from '../../components/Select'

function SearchEngineLogo({ searchEngine }: { searchEngine: 'google' | 'bing' }) {
  if (searchEngine === 'google') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.54-5.17 3.54-8.67Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3.01c-1.08.72-2.46 1.15-4.07 1.15-3.12 0-5.76-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l4-3.1Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l4 3.1c.95-2.84 3.59-4.95 6.71-4.95Z"
        />
      </svg>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#008373] text-[11px] font-bold leading-none text-white"
    >
      b
    </div>
  )
}

export const NavigationSearch = forwardRef<HTMLInputElement, {
  value: string
  searchEngine: 'google' | 'bing'
  onChange: (value: string) => void
  onSearchEngineChange: (value: 'google' | 'bing') => void
  onSearchWeb: () => void
}>(function NavigationSearch({ value, searchEngine, onChange, onSearchEngineChange, onSearchWeb }, ref) {
  return (
    <div className="mx-auto w-full max-w-[60rem]">
      <div className="flex items-center rounded-2xl border border-outline/70 bg-surface/85 px-2.5 py-1.5 shadow-[0_8px_24px_-22px_rgba(0,0,0,0.45)] transition-all duration-300 focus-within:border-[#99462a]/20 focus-within:ring-2 focus-within:ring-[#99462a]/10 sm:px-3 dark:border-dark-outline/80 dark:bg-dark-surface-elevated/90 dark:shadow-[0_12px_28px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-on-surface-variant dark:bg-dark-surface-container dark:text-dark-on-surface-variant">
          <SearchEngineLogo searchEngine={searchEngine} />
          <Select
            value={searchEngine}
            onValueChange={onSearchEngineChange}
            options={[
              { value: 'bing', label: '必应' },
              { value: 'google', label: '谷歌' },
            ]}
            variant="inline"
            ariaLabel="选择搜索引擎"
            triggerClassName="min-w-[3.5rem]"
            contentClassName="min-w-[7rem]"
          />
        </div>
        <input
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onSearchWeb()
            }
          }}
          className="min-w-0 w-full border-none bg-transparent px-3 py-2 text-sm font-body text-on-background outline-none placeholder:text-on-surface-variant/60 focus:ring-0 dark:text-dark-on-background dark:placeholder:text-dark-on-surface-variant/70 sm:px-4 sm:text-base"
          placeholder="搜索内容"
          type="text"
          aria-label="搜索链接或互联网"
        />
      </div>
    </div>
  )
})
