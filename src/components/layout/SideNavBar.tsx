import { Link, useLocation } from 'react-router-dom'
import type { ThemeMode } from '../../lib/theme'
import { navigationItems } from './navigationItems'

interface SideNavBarProps {
  themeMode?: ThemeMode
  onToggleTheme: () => void
  editMode: boolean
  onToggleEditMode: () => void
}

export function SideNavBar({ themeMode = 'system', onToggleTheme, editMode, onToggleEditMode }: SideNavBarProps) {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-20 border-r border-outline/70 bg-surface-container/95 backdrop-blur md:block dark:border-dark-outline/80 dark:bg-dark-surface-container/95">
      <div className="flex h-full flex-col items-center gap-4 px-3 py-6">
        <div className="flex flex-1 flex-col items-center gap-4">
          {navigationItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.icon}
                to={item.path}
                aria-label={item.name}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/30 ${isActive ? 'bg-surface text-on-surface shadow-sm dark:bg-dark-surface-elevated dark:text-dark-on-surface' : 'text-on-surface-variant hover:bg-surface hover:text-primary dark:text-dark-on-surface-variant dark:hover:bg-dark-surface dark:hover:text-accent'}`}
              >
                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label={themeMode === 'dark' ? '切换到日间模式' : '切换到夜间模式'}
            onClick={onToggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-on-surface-variant transition-all duration-200 hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/30 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface dark:hover:text-accent"
          >
            <span className="material-symbols-outlined">{themeMode === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button
            type="button"
            aria-label="切换编辑模式"
            aria-pressed={editMode}
            onClick={onToggleEditMode}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/30 ${editMode ? 'bg-surface text-primary shadow-sm dark:bg-dark-surface-elevated dark:text-accent' : 'text-on-surface-variant hover:bg-surface hover:text-primary dark:text-dark-on-surface-variant dark:hover:bg-dark-surface dark:hover:text-accent'}`}
          >
            <span className="material-symbols-outlined" style={editMode ? { fontVariationSettings: "'FILL' 1" } : {}}>edit_square</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
