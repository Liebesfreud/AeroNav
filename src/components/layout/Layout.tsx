import { CSSProperties, ReactNode } from 'react'
import type { ThemeMode } from '../../lib/theme'
import { SideNavBar } from './SideNavBar'

interface LayoutProps {
  children: ReactNode;
  themeMode?: ThemeMode;
  wallpaperUrl?: string | null;
  wallpaperOverlayOpacity?: number;
  wallpaperBlur?: number;
  onToggleTheme: () => void;
  editMode: boolean;
  onToggleEditMode: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
}

export function Layout({ children, themeMode, wallpaperUrl, wallpaperOverlayOpacity = 78, wallpaperBlur = 0, onToggleTheme, editMode, onToggleEditMode, sidebarVisible, onToggleSidebar }: LayoutProps) {
  const wallpaperStyle = wallpaperUrl
    ? ({
        backgroundImage: `url("${encodeURI(wallpaperUrl)}")`,
        ['--wallpaper-blur' as string]: `${wallpaperBlur}px`,
      } satisfies CSSProperties)
    : undefined

  const wallpaperOverlayStyle = wallpaperUrl
    ? ({
        ['--wallpaper-overlay-opacity' as string]: `${Math.max(0, Math.min(100, wallpaperOverlayOpacity)) / 100}`,
      } satisfies CSSProperties)
    : undefined

  return (
    <div className="relative min-h-screen bg-background text-on-background dark:bg-dark-background dark:text-dark-on-background">
      {wallpaperUrl ? <div className="app-wallpaper" style={wallpaperStyle} aria-hidden="true" /> : null}
      {wallpaperUrl ? <div className="app-wallpaper-overlay" style={wallpaperOverlayStyle} aria-hidden="true" /> : null}
      <div className="relative z-10 min-h-screen">
        {!sidebarVisible ? (
          <button
            type="button"
            aria-label="显示侧边栏"
            aria-pressed={false}
            onClick={onToggleSidebar}
            className="fixed left-6 top-6 z-40 hidden h-11 w-11 items-center justify-center rounded-xl border border-outline/70 bg-surface/90 text-on-surface-variant shadow-sm backdrop-blur transition-all duration-200 hover:bg-surface-container-low hover:text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/20 md:flex dark:border-dark-outline/70 dark:bg-dark-surface/90 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/80 dark:hover:text-dark-on-background"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        ) : null}
        <SideNavBar
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
          editMode={editMode}
          onToggleEditMode={onToggleEditMode}
          visible={sidebarVisible}
          onToggleVisible={onToggleSidebar}
        />
        <main className={`min-h-screen w-full transition-[padding] duration-200 ${sidebarVisible ? 'md:pl-24' : 'md:pl-0'}`}>
          <div className="min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  )
}
