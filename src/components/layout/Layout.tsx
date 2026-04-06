import { ReactNode } from 'react'
import type { ThemeMode } from '../../lib/theme'
import { SideNavBar } from './SideNavBar'

interface LayoutProps {
  children: ReactNode;
  themeMode?: ThemeMode;
  onToggleTheme: () => void;
  editMode: boolean;
  onToggleEditMode: () => void;
}

export function Layout({ children, themeMode, onToggleTheme, editMode, onToggleEditMode }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <SideNavBar themeMode={themeMode} onToggleTheme={onToggleTheme} editMode={editMode} onToggleEditMode={onToggleEditMode} />
      <main className="min-h-screen w-full md:pl-20">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
