import { Link, useLocation } from 'react-router-dom'

export function SideNavBar() {
  const location = useLocation()

  const navItems = [
    { icon: 'home', path: '/', label: 'Dashboard' },
    { icon: 'grid_view', path: '/widgets', label: 'Widgets' },
    { icon: 'bookmarks', path: '/bookmarks', label: 'Bookmarks' },
    { icon: 'settings', path: '/settings', label: 'Settings' },
  ]

  return (
    <aside className="fixed left-0 top-20 z-30 hidden h-[calc(100vh-5rem)] w-20 border-r border-outline/70 bg-[#f3f4f1]/95 md:block">
      <div className="flex h-full flex-col items-center gap-4 px-3 py-6">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.icon}
              to={item.path}
              aria-label={item.label}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/30 ${isActive ? 'bg-white text-[#2f3331] shadow-sm' : 'text-[#2f3331]/55 hover:bg-white/80 hover:text-[#99462a]'}`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
