import { ReactNode } from 'react'
import { TopNavBar } from './TopNavBar'
import { SideNavBar } from './SideNavBar'

interface LayoutProps {
  children: ReactNode;
  searchNode?: ReactNode;
}

export function Layout({ children, searchNode }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar searchNode={searchNode} />
      <SideNavBar />
      <main className="min-h-screen w-full pt-18 md:pl-20 md:pt-20">
        <div className="min-h-[calc(100vh-4.5rem)] md:min-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
