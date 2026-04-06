import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface TopNavBarProps {
  searchNode?: ReactNode
}

export function TopNavBar({ searchNode }: TopNavBarProps) {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Widgets', path: '/widgets' },
    { name: 'Bookmarks', path: '/bookmarks' },
    { name: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-40 h-18 border-b border-outline/70 bg-[#faf9f7]/95 backdrop-blur-xl md:h-20 md:pl-20">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-10">
          <span className="shrink-0 text-lg font-bold tracking-tight text-[#2f3331] uppercase sm:text-xl">ETHOS</span>
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`border-b-2 px-1 py-1 text-sm font-medium transition-colors duration-200 ${isActive ? 'border-[#99462a] text-[#99462a]' : 'border-transparent text-[#2f3331]/70 hover:text-[#99462a]'}`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden min-w-0 md:block">{searchNode}</div>
          <button aria-label="Open account" className="flex h-10 w-10 items-center justify-center rounded-full text-[#2f3331]/70 transition-colors hover:bg-white hover:text-[#99462a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/30">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
