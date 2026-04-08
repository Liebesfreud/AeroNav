import { Link, useLocation } from 'react-router-dom'
import { AppIcon } from '../AppIcon'
import type { ThemeMode } from '../../lib/theme'
import { navigationItems } from './navigationItems'

interface SideNavBarProps {
  themeMode?: ThemeMode
  onToggleTheme: () => void
  editMode: boolean
  onToggleEditMode: () => void
  visible: boolean
  onToggleVisible: () => void
}

export function SideNavBar({ themeMode = 'system', onToggleTheme, editMode, onToggleEditMode, visible, onToggleVisible }: SideNavBarProps) {
  const location = useLocation()

  return (
    <aside
      className={`fixed left-0 top-0 z-30 hidden h-screen w-24 border-r border-outline/80 bg-surface-container transition-transform duration-200 md:block dark:border-dark-outline/80 dark:bg-dark-surface-container ${visible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex h-full flex-col items-center gap-5 px-4 py-6">
        <button
          type="button"
          aria-label="隐藏侧边栏"
          aria-pressed={visible}
          onClick={onToggleVisible}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/20 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/75 dark:hover:text-dark-on-background"
        >
          <AppIcon name="layout-sidebar-left-collapse" className="h-5 w-5" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-low text-sm font-semibold tracking-[0.18em] text-on-background dark:bg-dark-surface-container/70 dark:text-dark-on-background">
          AN
        </div>
        <div className="flex flex-1 flex-col items-center gap-3">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.icon}
                to={item.path}
                aria-label={item.name}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/20 ${isActive ? 'bg-on-background text-white dark:bg-dark-on-background dark:text-dark-background' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/75 dark:hover:text-dark-on-background'}`}
              >
                <AppIcon name={item.icon} className="h-5 w-5" />
              </Link>
            )
          })}
        </div>

        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label={themeMode === 'dark' ? '切换到日间模式' : '切换到夜间模式'}
            onClick={onToggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/20 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/75 dark:hover:text-dark-on-background"
          >
            <AppIcon name={themeMode === 'dark' ? 'sun' : 'moon'} className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="切换编辑模式"
            aria-pressed={editMode}
            onClick={onToggleEditMode}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/20 ${editMode ? 'bg-surface-container-low text-primary dark:bg-dark-surface-container dark:text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/75 dark:hover:text-dark-on-background'}`}
          >
            <AppIcon name="pencil-cog" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
