import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function PageShell({
  title,
  actions,
  children,
}: {
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">AeroNav</div>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">{title}</h1>
            </div>
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className={`rounded-full px-3 py-2 text-sm transition ${location.pathname === '/' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'}`}
              >
                首页
              </Link>
              <Link
                to="/settings"
                className={`rounded-full px-3 py-2 text-sm transition ${location.pathname === '/settings' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'}`}
              >
                设置
              </Link>
              {actions}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
