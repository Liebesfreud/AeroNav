import { forwardRef, type InputHTMLAttributes } from 'react'

export const SearchBar = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function SearchBar(
  { className = '', ...props },
  ref,
) {
  return (
    <div className={`relative w-full max-w-3xl mx-auto group ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Search Input */}
      <input
        ref={ref}
        {...props}
        className="w-full h-16 pl-14 pr-6 rounded-xl bg-white border-2 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-lg text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:border-accent-200 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-700"
      />
    </div>
  )
})
