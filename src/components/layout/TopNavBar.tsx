import { ReactNode } from 'react'

interface TopNavBarProps {
  searchNode?: ReactNode
}

export function TopNavBar({ searchNode }: TopNavBarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 h-18 border-b border-outline/70 bg-[#faf9f7]/95 backdrop-blur-xl md:h-20 md:pl-20">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-10">
          <span className="shrink-0 text-lg font-bold tracking-tight text-[#2f3331] uppercase sm:text-xl">ETHOS</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden min-w-0 md:block">{searchNode}</div>
          <button aria-label="打开账户" className="flex h-10 w-10 items-center justify-center rounded-full text-[#2f3331]/70 transition-colors hover:bg-white hover:text-[#99462a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/30">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
